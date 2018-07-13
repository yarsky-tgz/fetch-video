const HlsFetch = require('./HlsFetch');
const Wget = require('./Wget');
function download(url, out, options) {
  let driver;
  if (/\.m3u8/.test(url)) {
    driver = HlsFetch;
  } else {
    driver = Wget;
  }
  return new driver(url, out, options);
}
module.exports = {
  download: download
};