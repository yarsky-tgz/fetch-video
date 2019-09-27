const Download = require('./abstract/Download');
const request = require('request');
class Wget extends Download {
  _getStream() {
    return request(this.source, this.options);
  }
  _abort() {
    this.stream.abort();
  }
}
module.exports = Wget;
