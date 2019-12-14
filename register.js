#!/usr/bin/env node

const got = require('got');
const { TVTIME_CLIENT_ID, TVTIME_CLIENT_SECRET } = require('./lib/settings');


(async () => {
  console.log('Requesting Device Code from tvtime.com');
  let response = await got.post('https://api.tvtime.com/v1/oauth/device/code', {
    body: {
      client_id: TVTIME_CLIENT_ID,
    },
    form: true,
    json: true,
  });
  const deviceCode = response.body.device_code;
  const { interval } = response.body;

  console.log('To authenticate PVTime please do the following:');
  console.log(`Visit: ${response.body.verification_url}`);
  console.log(`Enter the code: ${response.body.user_code}`);

  const pollInterval = setInterval(async () => {
    response = await got.post('https://api.tvtime.com/v1/oauth/access_token', {
      body: {
        client_id: TVTIME_CLIENT_ID,
        client_secret: TVTIME_CLIENT_SECRET,
        code: deviceCode,
      },
      form: true,
      json: true,
    });
    if (response.body.result === 'OK') {
      console.log(
        `Please add the access token to your user.json "PlexUSERNAME":{"tvTimeAccessToken":"${
          response.body.access_token
        }"} if you have more than one entry separate them by commas`,
      );
      // if we receive OK the authentication was successful and we can stop the interval
      clearInterval(pollInterval);
    } else if (response.body.message === 'Invalid code') {
      // Invalid Code means the user took longer than the expire time to enter the user code
      console.log('Couldn\'t retrieve Access Token. Try Again!');
      clearInterval(pollInterval);
    }
  }, (interval * 1000 + 1000)); // interval is in seconds and we give it one second more to not get rate limited
})();
