const got = require('got');

/**
 * Class to Interact with the TVTime API
 */
class TvTimeAPI {
  /**
   * @param  {string} accessToken - generated access token to authenticate with the API
   * @memberof TvTimeAPI
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.tvTimeGot = got.extend({
      baseUrl: 'https://api.tvtime.com/v1/',
      headers: {
        'User-Agent': 'plex-tvst-scrobbler',
        TVST_ACCESS_TOKEN: this.accessToken,
      },
      form: true,
      json: true,
    });
  }

  /**
   * Follow specified TV Show
   * @param  {number} id - TheTVDB ID of Show
   * @memberof TvTimeAPI
   */
  async follow(id) {
    const options = {
      body: {
        show_id: id,
      },
    };
    const response = await this.tvTimeGot.post('follow', options);
    return response;
  }

  /**
   * mark Episode as watched on TVTime
   * @param {Object} episodeItem - Episode Item
   * @param {string} [episodeItem.filename] - filename of Episode
   * @param {number} [episodeItem.episode_id] - TheTVDB ID of the episode
   * @param {number} [episodeItem.imdb_id] - IMDB ID of episode
   * @memberof TvTimeAPI
   */
  async checkIn(episodeItem) {
    const options = {
      body: {
        ...episodeItem,
        auto_follow: 0,
      },
    };
    const response = await this.tvTimeGot.post('checkin', options);
    return response;
  }

  /**
   * set Show Progress
   *
   * @param {Object} show - Show object
   * @memberof TvTimeAPI
   */
  async saveShowProgress(show) {
    const options = {
      body: {
        ...show,
      },
    };
    const response = await this.tvTimeGot.post('show_progress', options);
    return response;
  }

  /**
   * delete show progress
   *
   * @param {*} show
   * @return {Object}
   * @memberof TvTimeAPI
   */
  async deleteShowProgress(show) {
    const options = {
      body: {
        ...show,
      },
    };
    const response = await this.tvTimeGot.delete('delete_show_progress', options);
    return response;
  }
}

module.exports = TvTimeAPI;
