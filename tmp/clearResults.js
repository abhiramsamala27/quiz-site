const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const Result = require('./backend/models/Result');

async function clearResults() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await Result.countDocuments();
    console.log(`📊 Found ${count} existing result records.`);
    
    const deleteRes = await Result.deleteMany({});
    console.log(`🧹 Successfully cleared ${deleteRes.deletedCount} results.`);
    console.log('✨ Database is now fresh and smooth.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing results:', err.message);
    process.exit(1);
  }
}

clearResults();
