const EventEmitter = require('events');
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
}
module.exports = Download;