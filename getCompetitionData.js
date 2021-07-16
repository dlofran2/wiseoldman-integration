const AsciiTable = require('ascii-table');

const chunkArray = require('./utils/chunkArray');
const httpRequest = require('./utils/httpRequest');

const processSkill = data => {
    const { participants = [] } = data;

    return participants.reduce((acc, user) => {
        const { username, progress: { gained } } = user;

        acc.set(username, gained);

        return acc;
    }, new Map());
};

const processAllSkills = (data, metrics) => {
    return data.reduce((acc, skill, index) => {
        const participantsData = processSkill(skill);

        acc.set(metrics[index], participantsData);

        return acc;
    }, new Map());
};

const getTotals = (users, skillData, metrics) => {
    return users.reduce((acc, user) => {
        const gainedXP = metrics.reduce((acc, metric) => {
            return acc + skillData.get(metric).get(user);
        }, 0);

        acc.set(user, gainedXP);

        return acc;
    }, new Map());
};

const createTable = (title, winners) => {
    const table = new AsciiTable();

    table.setHeading(title, 'Name', 'Exp Gained');

    winners.forEach(({ username, xpGained }, index) => {
        table.addRow(index, username, xpGained);
    });

    return `\n${table.toString()}`;
};

const getWinners = (data, numberOfWinners) => [...data.entries()]
    .map(([key, value]) => ({ username: key, xpGained: value }))
    .sort((a, b) => b.xpGained - a.xpGained)
    .slice(0, numberOfWinners);

const getWinnersForEachCatagory = (totals, skillData, metrics) => {
    const winners = metrics.reduce((acc, metric) => {
        acc.push(
            createTable(
                metric.toUpperCase(),
                getWinners(skillData.get(metric), 10)
            )
        );

        return acc;
    }, [])

    winners.unshift(createTable('TOTALS', getWinners(totals, 3)));

    return chunkArray(winners, 3).map(chunk => chunk.join(''));
};

const getSkillRequests = (metrics, competitonId, limit) =>
    metrics.map(metric =>
        httpRequest(`https://api.wiseoldman.net/competitions/${competitonId}?metric=${metric}&limit=${limit}`)
    );

const getWinnersStringArrays = (groupData, competitonId, metrics) => {
    return Promise.all(getSkillRequests(metrics, competitonId, groupData.length))
        .then(data => {
            const users = groupData.map(({ username }) => username);
            const skillData = processAllSkills(data, metrics);
            const totals = getTotals(users, skillData, metrics);

            return getWinnersForEachCatagory(totals, skillData, metrics);
        })
        .catch(err => {
            console.log(`Error fetching skill data`, err);
        });
};

const getCompetitionData = async (competitonId, groupId, metrics) => {
    const groupData = await httpRequest(`https://api.wiseoldman.net/groups/${groupId}/members`);

    return await getWinnersStringArrays(groupData, competitonId, metrics);
};

module.exports = getCompetitionData;