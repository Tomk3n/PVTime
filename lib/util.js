/**
 * Object with all the Information that can be extracted from a Plex GUID
 * @typedef {Object} episodeInfo
 * @property {string} db - used Database
 * @property {string} id - ID of the tv show
 * @property {number} season - season number
 * @property {number} episode - episode number
 */

/**
 * @param {string} guid - GUID String from Plex
 * @return {episodeInfo} - Object with tvdb, season, episode
 */
function parseShowGuid(guid) {
  const match = guid.match(/(\w+):\/\/([0-9]+)\/([0-9]+)\/([0-9]+)/);
  if (!match) {
    return null;
  }
  return {
    db: match[1],
    id: match[2],
    season: Number(match[3]),
    episode: Number(match[4]),
  };
}

module.exports = parseShowGuid;
