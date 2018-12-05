//const { promisify } = require('util');
const fetch = require('./');
// miniget('http://makostore-vh.akamaihd.net/i/VOD/KESHET/Ofira_VEBerko/s02/ofira_veberkovich2_01_VOD_xxx374/ofira_veberkovich2_01_VOD_xxx374_,550,850,1400,2200,3100,.mp4.csmil/master.m3u8?hdnea=st%3D1543614993%7Eexp%3D1543615893%7Eacl%3D%2F*%7Ehmac%3D77ee9732def7d9bff8067a2bd5cf080038e4eb55aa7ae23c07c04d7fb4fb4af0', (err, body) => {
//   console.log('' + body);
// });

(async () => {
  const host = '212.199.61.48';
  const port = '5598';
  const downloader = fetch.download('http://212.8.243.130:8082/hls-mix/45-1.stream/start/1543904700/end/1543914900/index.m3u8',
    '/tmp/test.mp4', {
      // proxy: {
      //   host,
      //   port,
      // },
      headers: {
        //referrer: 'https://www.mako.co.il/mako-vod-keshet/ofira-and-berkovich-s2/VOD-2e8a2077d146761006.htm?sCh=beccd958821f2610&pId=957463908',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
      }
    });
  downloader.on('progress', progress => console.log(`Progress: ${progress}`));
  downloader.on('speed', speed => console.log(`Speed: ${speed}`));
  try {
    await downloader.go();
    console.log('done');
  } catch (e) {
    console.log(e);
  }
})();


// const fetchVideo = require('./');
//
// fetchVideo.download('http://c.brightcove.com/services/mobile/streaming/index/rendition.m3u8?assetId=4888175217001&videoId=4888169633001', '/tmp/test.ts', {
//   onStart(start) {
//     console.log(start);
//   }
// });