const ShellDownload = require('./abstract/ShellDownload');
const START_RE = /200 OK/;
const PROGRESS_RE = /(\d+)%/;
const DOT_STYLE = 'giga';

class Wget extends ShellDownload {
  _buildCommand() {
    return `wget --progress=dot:${DOT_STYLE} --show-progress '${this.source}' -O '${this.out}'`
  }
  _parseStart(output) {
    return START_RE.test(output);
  }
  _parseProgress(output) {
    const matches = output.match(PROGRESS_RE);
    if (matches) {
      return parseInt(matches[1]);
    }
  }
}

module.exports = Wget;