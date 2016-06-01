//load env vars
require('dotenv-safe').load();

const http = require('http');
const Stats = require('./application/stats.js');
const stats = new Stats(process.env.STATS_PATH);

const server = http.createServer((req, res) => {
    stats.collect((err, data) => {
        if(err){
            res.statusCode = 403;
            res.end(err);
            return;
        }
        res.end(data);
    });
});

const host = process.env.WEB_HOST || '127.0.0.1';
const port = process.env.WEB_PORT || 3000;
server.listen(port, host, () => {
    
    console.log(`Server running at http://${host}:${port}/`);
});
