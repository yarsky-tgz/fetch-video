module.exports.getBestPlaylist = playlists => playlists.reduce(
  (max, item) => (max.attributes.BANDWIDTH < item.attributes.BANDWIDTH) ? item : max,
  playlists[0]);