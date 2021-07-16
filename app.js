const dotenv = require('dotenv');

const setupDiscordIntegration = require('./setupDiscordIntegration');
const getCompetitionData = require('./getCompetitionData');

dotenv.config();

const { BOT_TOKEN, CHANNEL_ID } = process.env;

setupDiscordIntegration(BOT_TOKEN, CHANNEL_ID, getCompetitionData);
