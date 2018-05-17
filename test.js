const fetchVideo = require('./');

fetchVideo.download('http://c.brightcove.com/services/mobile/streaming/index/rendition.m3u8?assetId=4888175217001&videoId=4888169633001', '/tmp/test.ts', {
  onStart(start) {
    console.log(start);
  }
});