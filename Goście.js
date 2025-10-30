const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let visitCount = 0;
const visitIPs = {};

app.use((req, res, next) => {
  visitCount++;
  const ip = req.ip;

  if (!visitIPs[ip]) {
    visitIPs[ip] = 0;
  }

  visitIPs[ip]++;
  next();
});

app.get('/', (req, res) => {
  res.send(`<h1>Odwiedziny: ${visitCount}</h1>`);
});

app.get('/add', (req, res) => {
  const name = req.query.name;
  const ip = req.ip;
  const timestamp = new Date().toISOString();

  if (!name) {
    return res.status(400).send('Name is required');
  }

  const guest = { name, timestamp, ip };
  let guests = [];

  if (fs.existsSync('guests.json')) {
    guests = JSON.parse(fs.readFileSync('guests.json'));
  }

  guests.push(guest);
  fs.writeFileSync('guests.json', JSON.stringify(guests, null, 2));

  res.send(`<p>Dodano gościa: ${name}</p>`);
});

app.get('/delete', (req, res) => {
  const nameToDelete = req.query.name;
  
  if (!nameToDelete) return res.status(400).send("Podaj nazwę");
  let guests = [];

  if (fs.existsSync('guests.json')) {
    guests = JSON.parse(fs.readFileSync('guests.json'));
  }

  const newGuests = guests.filter(g => g.name !== nameToDelete);
  fs.writeFileSync('guests.json', JSON.stringify(newGuests, null, 2));

  res.send(`<p>Usunięto gościa: ${nameToDelete}</p>`);
});

app.get('/clear', (req, res) => {
  fs.writeFileSync('guests.json', '[]');
  res.send('Wyczyszczono listę gości');
});

app.get('/stats', (req, res) => {
  let html = '<h2>Statystyki odwiedzin</h2><ul>';
  for (let ip in visitIPs) {
    html += `<li>${ip}: ${visitIPs[ip]} odwiedzin</li>`;
  }
  html += '</ul>';
  res.send(html);
});

app.get('/form', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Dodaj gościa</title>
        <style>
          body { font-family: Arial; background: #f4f4f4; padding: 20px; }
          form { background: white; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <form action="/add" method="get">
          <label>Imię: <input type="text" name="name" /></label>
          <button type="submit">Dodaj</button>
        </form>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
