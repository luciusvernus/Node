const express = require('express');
const app = express();
const port = 3000;

const visitCounter = require('./middleware/visitCounter');
const guestsRoutes = require('./routes/guests');
const statsRoutes = require('./routes/stats');

// Middleware
app.use(visitCounter);

// Routes
app.use('/', guestsRoutes);
app.use('/', statsRoutes);

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});