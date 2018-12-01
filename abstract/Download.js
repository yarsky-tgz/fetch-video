const EventEmitter = require('events');
const fs = require('fs');
class Download extends EventEmitter {
  constructor(source, out, options) {
    super();
    this.source = source;
    this.out = out;
    this.options = options || {};
    this.progress = -1;
    this.bytes = 0;
    this.timestamp = Date.now() / 1000;
  }
  updateProgress(current, total, bytes) {
    const newTimestamp = Date.now() / 1000;
    const timeDiff = newTimestamp - this.timestamp;
    const bytesDiff = bytes - this.bytes;
    const speed = Math.floor(bytesDiff / timeDiff);
    this.emit('speed', speed);
    // this.bytes = bytes;
    // this.timestamp = newTimestamp;
    const newProgress = Math.ceil((current / total) * 100);
    if (newProgress <= this.progress) return;
    this.progress = newProgress;
    this.emit('progress', newProgress);
  }
  go() {
    return new Promise(async (resolve, reject) => {
      const stream = await this._getStream();
      stream.on('error', reject);
      const outStream = fs.createWriteStream(this.out);
      outStream.on('finish', resolve);
      outStream.on('error', reject);
      stream.pipe(outStream);
    });
  }

}
module.exports = Download;