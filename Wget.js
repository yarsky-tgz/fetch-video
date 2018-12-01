const Download = require('./abstract/Download');
const request = require('request');
const progress = require('request-progress');
const fs = require('fs');
class Wget extends Download {
  go() {
    const { proxy, headers } = this.options || {};
    const { host, port } = proxy || {};
    return new Promise((resolve, reject) => {
      const stream = progress(request(this.source, {
        proxy: `http://${host}:${port}`,
        headers
      }), {
        throttle: 1000
      });
      stream.on('progress', progress => this.updateProgress(progress.percent, 1, progress.size.transferred));
      stream.on('error', reject);
      stream.on('end', resolve);
      stream.pipe(fs.createWriteStream(this.out));
    });
  }
}
module.exports = Wget;