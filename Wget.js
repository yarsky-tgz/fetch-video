const ShellDownload = require('./abstract/ShellDownload');
const START_RE = /^Length:/;
const LENGTH_RE = /^(\d+)$/;
const PROGRESS_RE = /(\d+)%/;
const DOT_STYLE = 'binary';
const exec = require('child_process').exec;
class Wget extends ShellDownload {
  _getBinaryVersion() {
    return new Promise((resolve => exec('wget --version|head -n 1|cut -d " " -f 3', (err, stde) => resolve(stde))));
  }
  async _buildCommand() {
    const version = await this._getBinaryVersion();
    const parts = version.split('.');
    if ((parts.length > 2) && (parseInt(parts[1]) > 18)) return `wget --progress=dot:${DOT_STYLE} --show-progress '${this.source}' -O '${this.out}'`;
    return `wget --progress=dot:${DOT_STYLE} '${this.source}' -O '${this.out}'`;
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