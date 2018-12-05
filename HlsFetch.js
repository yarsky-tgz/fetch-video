const Download = require('./abstract/Download');
const m3u8Parser = require('m3u8-parser');
const {URL} = require('url');
const {dirname} = require('path');
const request = require('request-promise-native');
const {getBestPlaylist} = require('./common');
const multistream = require('multistream');

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
    return multistream(segments.map(({uri}, index) => () => {
      this.updateProgress(index, segments.length);
      return request(resolveUri(uri), this.options)
    }));
  }
}

module.exports = HlsFetch;
