const Download = require('./abstract/Download');
const request = require('request');
class Wget extends Download {
  _getStream() {
    const { proxy, headers } = this.options || {};
    const { host, port } = proxy || {};
    const options = {};
    if (proxy) options.proxy = `http://${host}:${port}`;
    if (headers) options.headers = headers;
    return request(this.source, options);
  }
}
module.exports = Wget;
