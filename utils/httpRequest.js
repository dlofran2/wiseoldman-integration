const https = require('https');

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

module.exports = httpRequest;