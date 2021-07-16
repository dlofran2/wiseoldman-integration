# WiseOldMan combined skill competition tracker

## Startup

1. Clone repo
2. Ensure node and npm are installed
3. Run `npm install` in your directory to install necessary packages
4. Run `npm run start` to begin application

## Necessary Environment Variables

Create a `.env` file and add the following information

- BOT_TOKEN = Token for your bot Discord
- CHANNEL_ID = Channel ID of the channel you want messages sent to in Discord

## TODO

- Add options for xpGained minimums
- Add points system
- Add more error handling (if services fail, should notify in Discord to try again later)
- Add rate limiter
- Make `!help` option more legible
- Add more documention in README
