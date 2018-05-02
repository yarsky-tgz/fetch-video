const HlsFetch = require('./HlsFetch');
const Wget = require('./Wget');
async function download(url, out, options) {
  let driver;
  if (/\.m3u8/.test(url)) {
    driver = HlsFetch;
  } else {
    driver = Wget;
  }
  const instance = new driver(url, out, options);
  await instance.go();
}
module.exports = {
  download: download
};