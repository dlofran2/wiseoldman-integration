# WiseOldMan combined skill competition tracker

## Startup

1. Clone repo
2. Ensure node and npm are installed
3. Run `npm install` in your directory to install necessary packages
4. Create a `.env` file and add required environment variables, see below
5. Run `npm run start` to begin application

## Environment Variables

Create a `.env` file and add the following information

- BOT_TOKEN = Token for your bot Discord
- CHANNEL_ID = Channel ID of the channel you want messages sent to in Discord
- COMPETITION_ID = (optional) Compeition ID given by WiseOldMan
- GROUP_ID = (optional) GroupID given by WiseOldMan

## Commands

The following commands can be used within a Discord Channel when the bot is active.

### Competition (!competition)

- `!competition help` provides information on running command in the Discord client
- `!competition metrics=["fishing","hunter"]` runs the command with fishing and hunter skills as the only metrics.
- `!competition groupId=1234 competitionId=12345` runs the command with custom `groupId` and `competitionId`

For a list of all metrics allowed, please visit https://wiseoldman.net/docs/competitions.

Note: Currently the application has only been tested with skill metrics.

## TODO

- Add options for xpGained minimums
- Add points system
- Add more error handling (if services fail, should notify in Discord to try again later and not crash bot)
- Add rate limiter
