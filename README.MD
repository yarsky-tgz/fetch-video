# fetch-video
m3u8 HLS Stream or video file url downloading to mp4 file with autodetect of url type

## Installation

```bash
npm i fetch-video
```

## Usage

```javascript
  const { download } = require('fetch-video');
  
  const downloader = download(url, filename, requestOptions);
  downloader.on('progress', progress => console.log(`Current progress ${progress}`));
  downloader.on('speed', speed => console.log(`Current speed ${speed}`));
  downloader.on('stats', console.log.bind(console));
  downloader.go() // Promise returned 
    .then(() => console.log(`video stream or file ${url} is downloaded and stored as the ${filename}`));
```

### download(`url`, `filename`, `requestOptions`) => downloader

`url` - url of your video file or m3u8 playlist

`filename` - filename path to which you want save the video. Can be stream. 
If undefined - then `dev-null` stream used. 

`requestOptions` - [request options](https://github.com/request/request#requestoptions-callback) 

### downloader.go() => Promise

Launches downloading and Promise being resolved on finish.

### downloader.abort()

Immediately aborts downloading

### downloader.on(name, handler)

Subscribe for event. Currently it supports two events:
 * `progress` => sending progress percents as payload
 * `speed` => sending current speed in bytes per second as payload
 * `stats` => sending full stats about progress
 * `lastSegmentStats` => stats about time, size and speed of last segment
