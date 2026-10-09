require('dotenv').config();

const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');
const Lead = require('../models/lead');

const sampleLeads = [
  { name: 'Jordan Lee', email: 'jordan.lee@example.com', phone: '+1 555 010 1001', status: 'new' },
  { name: 'Morgan Patel', email: 'morgan.patel@example.com', phone: '+1 555 010 1002', status: 'contacted' },
  { name: 'Riley Chen', email: 'riley.chen@example.com', phone: '+1 555 010 1003', status: 'qualified' }
];

async function seed() {
  await connectDatabase();
  const count = await Lead.countDocuments();
  if (count === 0) {
    await Lead.insertMany(sampleLeads);
    console.log(`Inserted ${sampleLeads.length} sample leads`);
  } else {
    console.log(`Database already has ${count} lead(s); no sample data inserted`);
  }
}

seed()
  .catch((error) => {
    console.error('Unable to seed the database:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
