class Download {
  constructor(source, out, options) {
    const defaultOptions = {
      onProgress: undefined
    };
    this.source = source;
    this.out = out;
    this.options = options || defaultOptions;
  }
}
module.exports = Download;