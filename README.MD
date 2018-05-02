# fetch-video
=============


## Installation

```bash
npm i fetch-video
```

## Usage

```javascript
const fetchVideo = require('fetch-video');
const url = 'http://somewhere.com/index.m3u8';
const outPath = '/home/user/videos/';
fetchVideo.download(url, outPath, {
  onProgress: progress => {
    console.log(progress) // 1, 2, 3, one cb run for each change
  }
});

```