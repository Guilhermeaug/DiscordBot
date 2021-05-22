/*
  Deus abençoe o senhor Snowflake,
  https://github.com/Snowflake107,
  https://github.com/Androz2091/discord-player/blob/master/src/utils/Util.ts
*/

import pkg from "youtube-sr";
const { YouTube } = pkg;

const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifyAlbumRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:album\/|\?uri=spotify:album:)((\w|-){22})/;

export const getSearchType = (query) => {
  if (spotifySongRegex.test(query)) return "spotify_song";
  if (spotifyAlbumRegex.test(query)) return "spotify_album";
  if (spotifyPlaylistRegex.test(query)) return "spotify_playlist";
  if (YouTube.validate(query, "PLAYLIST")) return "youtube_playlist";
  if (YouTube.validate(query, "VIDEO")) return "youtube_video";
};
