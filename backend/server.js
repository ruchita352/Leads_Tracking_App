require('dotenv').config();

const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Leads Tracking App listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start the application:', error.message);
  process.exitCode = 1;
});
