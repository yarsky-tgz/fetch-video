const ShellDownload = require('./abstract/ShellDownload');
const START_RE = /Length:/;
const LENGTH_RE = /(\d+)/;
const PROGRESS_RE = /(\d+)%/;
const DOT_STYLE = 'binary';
class Wget extends ShellDownload {
  async _buildCommand() {
    const { referer, agent, proxy } = this.options;
    let optional = '';
    if (proxy) optional += `-e use_proxy=yes -e http_proxy=http://${proxy} -e https_proxy=http://${proxy} `;
    if (referer) optional += `--referer="${referer}" `;
    if (agent) optional += `-U "${agent}" `;
    return `wget --progress=dot:${DOT_STYLE} ${optional}'${this.source}' -O '${this.out}'`;
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