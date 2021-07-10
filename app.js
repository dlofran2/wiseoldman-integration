const https = require('https');

const GROUP_ID = 755;
const COMPETITION_ID = 3904;
const METRICS = ['agility', 'farming', 'fishing', 'hunter', 'mining', 'thieving', 'woodcutting'];

const httpRequest = url => {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`statusCode=${res.statusCode}`));
            }

            let data = [];

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                try {
                    data = JSON.parse(Buffer.concat(data).toString());
                }
                catch (e) {
                    reject(e)
                }

                resolve(data);
            });
        });
    });
};

const processSkill = data => {
    const { participants = [] } = data;

    return participants.reduce((acc, user) => {
        const { username, progress: { gained } } = user;

        acc.set(username, gained);

        return acc;
    }, new Map());
};

const processAllSkills = data => {
    return data.reduce((acc, skill, index) => {
        const participantsData = processSkill(skill);

        acc.set(METRICS[index], participantsData);

        return acc;
    }, new Map());
};

const getTotals = (users, skillData) => {
    const [agility, farming, fishing, hunter, mining, thieving, woodcutting] = [...skillData.values()];

    return users.reduce((acc, user) => {
        const agilityXP = agility.get(user);
        const farmingXP = farming.get(user);
        const fishingXP = fishing.get(user);
        const hunterXP = hunter.get(user);
        const miningXP = mining.get(user);
        const thievingXP = thieving.get(user);
        const woodcuttingXP = woodcutting.get(user);

        acc.set(user, agilityXP + farmingXP + fishingXP + hunterXP + miningXP + thievingXP + woodcuttingXP);

        return acc;
    }, new Map());
};

const logWinners = (title, winners) => {
    console.log(`\n${title}`);
    console.table(winners);
};

const getWinners = (data, numberOfWinners) => [...data.entries()]
    .map(([key, value]) => ({ username: key, xpGained: value }))
    .sort((a, b) => b.xpGained - a.xpGained)
    .slice(0, numberOfWinners);

const getWinnersForEachCatagory = (totals, skillData) => {
    const [agility, farming, fishing, hunter, mining, thieving, woodcutting] = [...skillData.values()];
    const totalWinners = getWinners(totals, 3);
    const agilityWinners = getWinners(agility, 10);
    const farmingWinners = getWinners(farming, 10);
    const fishingWinners = getWinners(fishing, 10);
    const hunterWinners = getWinners(hunter, 10);
    const miningWinners = getWinners(mining, 10);
    const thievingWinners = getWinners(thieving, 10);
    const woodcuttingWinners = getWinners(woodcutting, 10);

    logWinners('TOTALS', totalWinners);
    logWinners('AGILITY', agilityWinners);
    logWinners('FARMING', farmingWinners);
    logWinners('FISHING', fishingWinners);
    logWinners('HUNTER', hunterWinners);
    logWinners('MINING', miningWinners);
    logWinners('THIEVING', thievingWinners);
    logWinners('WOODCUTTING', woodcuttingWinners);
};

const getRequests = limit =>
    METRICS.map(metric =>
        httpRequest(`https://api.wiseoldman.net/competitions/${COMPETITION_ID}?metric=${metric}&limit=${limit}`)
    );

httpRequest(`https://api.wiseoldman.net/groups/${GROUP_ID}/members`)
    .then(groupData => {
        Promise.all(getRequests(groupData.length))
            .then(data => {
                const users = groupData.map(({ username }) => username);
                const skillData = processAllSkills(data);
                const totals = getTotals(users, skillData);

                getWinnersForEachCatagory(totals, skillData);
            })
            .catch(err => {
                console.log(`Error fetching skill data`, err);
            });
    })
    .catch(err => {
        console.log(`Error fetching group data`, err)
    })
