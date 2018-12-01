const Download = require('./abstract/Download');
const m3u8Parser = require('m3u8-parser');
const { URL } = require('url');
const { dirname } = require('path');
const request = require('request-promise-native');
const { getBestPlaylist } = require('./common');
const fs = require('fs');
const m3u8stream = require('m3u8stream');
class HlsFetch extends Download {
  go() {
    return new Promise(async (resolve, reject) => {
      const { proxy, headers } = this.options;
      const { host, port } = proxy || {};
      const url = this.source;
      const { pathname, origin } = new URL(url);
      const parser = new m3u8Parser.Parser();
      const manifest = await request(url, {
        proxy: host ? `http://${host}:${port}` : undefined,
        headers,
      });
      parser.push(manifest);
      parser.end();
      const { segments, playlists } = parser.manifest;
      const m3u8streamOptions = {
        requestOptions: {
          headers,
          transform: host ? parsed => ({
            protocol: 'http:',
            host,
            port,
            path: parsed.href,
            headers: { Host: parsed.host, ...headers },
          }) : undefined,
        },
      };
      console.log(m3u8streamOptions);
      let stream;
      if (playlists && (playlists.length > 0)) {
        console.log(playlists);
        const { uri } = getBestPlaylist(parser.manifest.playlists);
        console.log(uri);
        stream = m3u8stream((uri.indexOf('http') !== 0) ? `${origin}${dirname(pathname)}/${uri}` : uri, m3u8streamOptions);
      } else if (segments && (segments.length > 0)) {
        stream = m3u8stream(url, m3u8streamOptions);
      } else {
        return reject(new Error('Unknown playlist type'));
      }
      stream.on('progress', ({num}, total, bytes) => this.updateProgress(num, total, bytes));
      stream.on('error', reject);
      stream.on('end', resolve);
      stream.pipe(fs.createWriteStream(this.out));
    });
  }
}
module.exports = HlsFetch;
