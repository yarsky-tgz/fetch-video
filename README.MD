# fetch-video
fetching (downloading) video by uri, using wget or hls-fetch 
for .m3u8 to specified outfile

You must have installed `wget` and `hls-fetch` all features 
to work properly. 

## Installation

Make sure you have installed `wget`.

Install [hls-fetch](https://github.com/osklil/hls-fetch) with all needed Perl CPAN packages.

test it just by running 

```bash
hls-fetch
```
and install package
```bash
npm i fetch-video
```

## Usage

`require('fetch-video').download(url, filename, options:{ onProgress: function(progress)})`

`url` - url of your video file or m3u8 playlist

`filename` - filename path to which you want save the video

`options` - for now the only option:

* `onProgress` - callback to run, for example:
```javascript
{
  onProgress: function(progress) {
    console.log(progress);
  }
}
``` 

## Example

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