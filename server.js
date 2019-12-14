const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { USER_LOCATION, PORT } = require('./lib/settings');
const TvTimeAPI = require('./lib/tvtimeapi');
const parseShowGuid = require('./lib/util');

const user = JSON.parse(fs.readFileSync(USER_LOCATION));

const app = express();
const upload = multer({ dest: '/tmp/' });


app.post('/*', upload.single('thumb'), async (req, res) => {
  let payload;
  try {
    payload = JSON.parse(req.body.payload);
  } catch (error) {
    res.sendStatus(400);
    return;
  }
  // we only want the Scrobble Event
  if (payload.event !== 'media.scrobble') {
    res.sendStatus(200);
    return;
  }
  // we only want tv shows
  if (payload.Metadata.librarySectionType !== 'show') {
    res.sendStatus(200);
    return;
  }
  // Check if the event came from a user we need
  if (!(payload.Account.title in user)) {
    res.sendStatus(200);
    return;
  }

  // parse GUID to get thetvdb id and season and episode number
  const episodeInfo = parseShowGuid(payload.Metadata.guid);
  // check if the used db is TheTVDB
  if (episodeInfo == null || episodeInfo.db !== 'thetvdb') {
    res.sendStatus(200);
    return;
  }
  // use TVTime api with found access token
  const api = new TvTimeAPI(user[payload.Account.title].tvTimeAccessToken);
  try {
    // send checkin request to tvtime
    let response = await api.checkIn(
      {
        show_id: episodeInfo.id,
        season_number: episodeInfo.season,
        number: episodeInfo.episode,
      },
    );
    if (response.body.result === 'KO' && response.body.message === 'Show not followed') {
      // if show isn't already followed follow the show
      response = await api.follow(episodeInfo.id);
      if (response.body.result === 'OK') {
        // after we followed the show we need to send another checkin
        response = await api.checkIn(
          {
            show_id: episodeInfo.id,
            season_number: episodeInfo.season,
            number: episodeInfo.episode,
          },
        );
      }
    }
  } catch (error) {
    // something went really wrong so we print the error object
    console.log(error);
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`PVTime listening on port ${PORT}`);
});
