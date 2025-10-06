const http = require('http');

let visitCount = 0;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        visitCount++;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Witaj na stronie! Oswiedziles ja juz ${visitCount} razy.`);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Strona nie istnieje');
    }
});

server.listen(3001, () => {
    console.log('Serwer działa na porcie 3000');
});