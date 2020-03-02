const Download = require('./abstract/Download');
const m3u8Parser = require('m3u8-parser');
const {URL} = require('url');
const {dirname} = require('path');
const request = require('request-promise-native');
const {getBestPlaylist} = require('./common');
const multistream = require('multistream');

const currentTime = () => ((new Date()).getTime() / 1000);

class HlsFetch extends Download {
  async _getStream() {
    const url = this.source;
    const {pathname, origin} = new URL(url);
    const parser = new m3u8Parser.Parser();
    const resolveUri = uri => (uri.indexOf('http') !== 0) ? `${origin}${dirname(pathname)}/${uri}` : uri;
    const manifest = await request(url, this.options);
    parser.push(manifest);
    parser.end();
    let { segments, playlists } = parser.manifest;
    if (playlists && (playlists.length > 0)) {
      const { uri } = getBestPlaylist(parser.manifest.playlists);
      const segmentsParser = new m3u8Parser.Parser();
      const segmentsManifest = await request(resolveUri(uri), this.options);
      segmentsParser.push(segmentsManifest);
      segmentsParser.end();
      segments = segmentsParser.manifest.segments;
    }
    if (!segments || (segments.length === 0)) throw new Error('Unknown playlist type');
    this.updateProgress(0, segments.length);
    return multistream(segments.map(({uri}, index) => () => {
      const { progressDuplex } = this;
      const substream = request(resolveUri(uri), this.options);
      const segmentLoadingStartTime = currentTime();
      const { transferred } = progressDuplex ? progressDuplex.progress() : {};
      const segmentLoadingStartSize = transferred || 0;
      substream.on('end', () => {
        const { progressDuplex } = this;
        const { transferred } = progressDuplex.progress();
        const size = transferred - segmentLoadingStartSize;
        const time = currentTime() - segmentLoadingStartTime;
        this.updateProgress(index + 1, segments.length);
        const speed = Math.round(size / time);
        this.emit('lastSegmentStats', { time, speed, size });
      });
      return substream;
    }));
  }
  _abort() {
    this.stream._queue = [];
    this.stream._current.abort();
  }
}

module.exports = HlsFetch;
