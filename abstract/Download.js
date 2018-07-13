const EventEmitter = require('events');
class Download extends EventEmitter {
  constructor(source, out, options) {
    super();
    const defaultOptions = {
      onProgress: undefined
    };
    this.source = source;
    this.out = out;
    this.options = options || defaultOptions;
  }
}
module.exports = Download;