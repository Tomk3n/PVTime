const dotenv = require('dotenv');

dotenv.config({
  path: process.env.ENV_FILE || '.env',
});

const { TVTIME_CLIENT_ID } = process.env;
const { TVTIME_CLIENT_SECRET } = process.env;
const { PORT } = process.env;
const { USER_LOCATION } = process.env;

if (!TVTIME_CLIENT_ID || !TVTIME_CLIENT_SECRET || !USER_LOCATION || !PORT) {
  throw new Error(
    'Please make sure to configure all variables in .env file properly.',
  );
}

module.exports = {
  TVTIME_CLIENT_ID,
  TVTIME_CLIENT_SECRET,
  USER_LOCATION,
  PORT,
};
