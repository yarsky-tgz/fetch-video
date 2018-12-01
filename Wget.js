const Download = require('./abstract/Download');
const request = require('request');
const progress = require('request-progress');
class Wget extends Download {
  _getStream() {
    const { proxy, headers } = this.options || {};
    const { host, port } = proxy || {};
    const options = {};
    if (proxy) options.proxy = `http://${host}:${port}`;
    if (headers) options.headers = headers;
    const stream = progress(request(this.source, options), {
      throttle: 1000
    });
    stream.on('progress', progress => this.updateProgress(progress.percent, 1, progress.size.transferred));
    return stream;
  }
}
module.exports = Wget;