const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3210;

let requestCount = 0;

const routes = {
    '/': rootRoute,
    '/data': dataRoute,
    '/status': statusRoute
};

const server = http.createServer((req, res) => {
    requestCount++;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    };

    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    const handler = getHandler(req, res)
    if (!handler) return

    handler(req, res)
});

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

function getHandler(req, res) {

    if (!req.url) throw new Error('No req.url')

    const route = req.url.split('?')[0]

    const handler = routes[route]

    if (!handler) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }

    return handler
}

function rootRoute(req, res) {
    if (req.method !== 'GET') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }

    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

function dataRoute(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        if (!body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No data provided' }));
        };

        try {
            const data = JSON.parse(body);
            console.log('Received data:', data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data received', data }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        };
    });
};

function statusRoute(req, res) {
    const status = {
        serverTime: new Date().toISOString(),
        requestCount,
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
}

