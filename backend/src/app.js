const path = require('node:path');
const express = require('express');
const apiLeadsRouter = require('./routes/api/leads.routes');
const { errorHandler } = require('./middleware/error-handler');
const { notFound } = require('./middleware/not-found');

const app = express();

app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/leads', apiLeadsRouter);
app.use('/api', notFound);
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
