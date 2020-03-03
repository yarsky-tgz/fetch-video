const EventEmitter = require('events');
const fs = require('fs');
const progress = require('progress-stream');
const devnull = require('dev-null');
const { performance } = require('perf_hooks');
const currentTime = () => (performance.now() / 1000);

class Download extends EventEmitter {
  constructor(source, out, options) {
    super();
    this.source = source;
    this.out = typeof out === 'string' ? fs.createWriteStream(out) : out ;
    this.options = options || { simple: true, progressFrequency: 250 };
    this.progress = -1;
    this.time = 0;
  }
  updateProgress(transferred, length) {
    const newProgress = Math.floor((transferred / length) * 100);
    if (this.constructor.name === 'HlsFetch') {
      this.segments = this.segments || {};
      const { segments } = this;
      Object.assign(segments, { transferred, length });
    }
    if (newProgress <= this.progress) return;
    this.progress = newProgress;
    this.emit('progress', newProgress);
  }
  go() {
    return new Promise(async (resolve, reject) => {
      try {
        this.stream = await this._getStream();
        this.progressDuplex = progress({ time: this.options.progressFrequency });
        const { progressDuplex } = this;
        progressDuplex.on('progress', ({ transferred, length, speed }) => {
          const { progress, segments } = this;
          this.time = currentTime() - this.start;
          const stats = { transferred, speed: Math.round(speed), progress, time: this.time };
          if (segments) Object.assign(stats, { segments });
          this.emit('speed', parseInt(speed, 10));
          this.emit('stats', stats);
          if (length) this.updateProgress(transferred, length);
        });
        this.stream.on('error', reject);
        this.stream.on('response', res => {
          if (!res || !res.headers) return;
          if (res.statusCode !== 200) {
            this._abort();
            reject(new Error('Non 200 response'));
          }
          if (res.headers['content-encoding'] === 'gzip') return;
          if (res.headers['content-length']) return progressDuplex.setLength(parseInt(res.headers['content-length'], 10));
        });
        const outStream = this.out ? this.out : devnull();
        outStream.on('finish', resolve);
        outStream.on('error', reject);
        this.stream
            .pipe(progressDuplex)
            .pipe(outStream);
        this.start = currentTime();
      } catch (e) {
        reject(e);
      }
    });
  }
  abort() {
    this._abort();
    this.emit('abort');
  }
}
module.exports = Download;
