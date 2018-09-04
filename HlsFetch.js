const ShellDownload = require('./abstract/ShellDownload');
const PROGRESS_RE = /(\d+)\/(\d+)/;
class HlsFetch extends ShellDownload {
  _buildCommand() {
    const { referer, agent, proxy } = this.options;
    let optional = '';
    if (referer) optional += `-R "${referer}" `;
    if (agent) optional += `-A "${agent}" `;
    if (proxy) optional += `-P "${proxy}" `;
    return `hls-fetch ${optional}--playlist -b=max -f "${this.source}" -o "${this.out}"`;
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
