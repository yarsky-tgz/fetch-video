const ShellDownload = require('./abstract/ShellDownload');
const START_RE = /^Length:/;
const LENGTH_RE = /^(\d+)$/;
const PROGRESS_RE = /(\d+)%/;
const DOT_STYLE = 'giga';
class Wget extends ShellDownload {
  _buildCommand() {
    return `wget --progress=dot:${DOT_STYLE} --show-progress '${this.source}' -O '${this.out}'`;
  }
  _parseStart(output) {
    if (START_RE.test(output)) {
      this._startMet = true;
    }
    if (this._startMet) {
      if (LENGTH_RE.test(output)) return parseInt(output.match(LENGTH_RE)[1]);
    }
  }
  _parseProgress(output) {
    const matches = output.match(PROGRESS_RE);
    if (matches) {
      return parseInt(matches[1]);
    }
  }
}
module.exports = Wget;