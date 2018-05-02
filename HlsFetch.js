const ShellDownload = require('./abstract/ShellDownload');
const PROGRESS_RE = /(\d+)\/(\d+)/;
class HlsFetch extends ShellDownload {
  _buildCommand() {
    return `hls-fetch --playlist -b=max -f "${this.source}" -o "${this.out}"`;
  }
  _parseProgress(output) {
    let matches = output.match(PROGRESS_RE);
    if (matches) {
      let result = Math.floor((parseInt(matches[1]) / parseInt(matches[2])) * 100);
      return result;
    }
  }
}
module.exports = HlsFetch;
