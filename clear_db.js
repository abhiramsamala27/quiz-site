const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });

const Result = require('./backend/models/Result');

async function clearResults() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await Result.countDocuments();
    console.log(`📊 Found ${count} result records.`);
    
    await Result.deleteMany({});
    console.log(`🧹 Successfully cleared all previous results.`);
    console.log('✨ System is now fresh.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

clearResults();
