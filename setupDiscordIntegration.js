const AsciiTable = require('ascii-table');
const Discord = require('discord.js');

const client = new Discord.Client();

const DEFAULT_ARGS = {
    metrics: ['agility', 'farming']
};

const sendToChannel = (channelId, message) => {
    const channel = client.channels.cache.get(channelId);

    channel.send(message);
}

const sendTablesToChannel = async (channelId, loggingFn) => {
    const channel = client.channels.cache.get(channelId);

    const responses = await loggingFn();

    responses.forEach(response => {
        channel.send(`\`\`\`${response}\`\`\``);
    });
};

const setupDiscordIntegration = (botToken, channelId, loggingFn) => {
    client.login(botToken);

    client.on('message', message => {
        if (!message.content.startsWith('!competition') || message.author.bot) {
            return;
        }

        if (message.content.includes('help')) {
            const helpTable = new AsciiTable();

            helpTable
                .setHeading('Parameters', 'Description', 'Default Value')
                .addRow('competitionId*', 'ID given by WiseOldMan for the competition', '.env COMPETITION_ID')
                .addRow('groupId*', 'ID given by WiseOldMan for the clan', '.env GROUP_ID')
                .addRow('metrics**', 'array of supported WiseOldMan metrics', '["agility", "farming"]');

            sendToChannel(channelId, `\`\`\`\n${helpTable}\n*competitionId and groupId can be defined in a .env file or as arguments in the message\n**For a list of all supported metrics see here (https://wiseoldman.net/docs/competitions)\n**Metrics must be an array of metric strings separated only by a comma (no spaces) ["metric1","metric2"].  Note the use of double quotes\`\`\``);

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
            }, {
                ...DEFAULT_ARGS,
                competitionId: process.env.COMPETITION_ID,
                groupId: process.env.GROUP_ID
            });

        if (!competitionId || !groupId) {
            sendToChannel(channelId, 'competitionId and groupId are required. For more help use command "!competition help"');

            return;
        }

        sendTablesToChannel(channelId, () => loggingFn(competitionId, groupId, metrics));
    });
};

module.exports = setupDiscordIntegration;