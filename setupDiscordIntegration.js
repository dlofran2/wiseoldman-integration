const Discord = require('discord.js');

const client = new Discord.Client();

const DEFAULT_ARGS = {
    metrics: ['agility', 'farming', 'fishing', 'hunter', 'mining', 'thieving', 'woodcutting']
};

const sendToChannel = async (channelId, loggingFn) => {
    const channel = client.channels.cache.get(channelId);

    const responses = await loggingFn();

    responses.forEach(response => {
        channel.send(`\`\`\`${response}\`\`\``);
    });
};

const setupDiscordIntegration = (botToken, channelId, loggingFn) => {
    client.login(botToken);

    client.on('message', message => {
        const channel = client.channels.cache.get(channelId);

        if (!message.content.startsWith('!competition') || message.author.bot) {
            return;
        }

        if (message.content.includes('help')) {
            channel.send(`Parameters: (* = required)\n*competitionId -> ID given by WiseOldMan for the competition\n*groupId -> ID for your clan on WiseOldMan\nmetrics -> (default value = gathering skills) -> array of supported WiseOldMan strings, see this link for a list of possible metrics https://wiseoldman.net/docs/competitions\n\tMetrics must be in the format metrics='["metric1","metric2"]' Note position of the single quotes and double quotes`);

            return;
        }

        const { competitionId, groupId, metrics } = message.content
            .split('!competition')[1]
            .split(' ')
            .reduce((acc, arg) => {
                if (!arg) {
                    return acc;
                }

                const [key, value] = arg.split('=');

                acc[key] = JSON.parse(value);

                return acc;
            }, DEFAULT_ARGS);

        if (!competitionId || !groupId) {
            channel.send('competitionId and groupId are required. For more help use command "!competition help"');

            return;
        }

        sendToChannel(channelId, () => loggingFn(competitionId, groupId, metrics));
    });
};

module.exports = setupDiscordIntegration;