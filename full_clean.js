const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });

const Question = require('./backend/models/Question');
const Result = require('./backend/models/Result');

async function cleanDatabase() {
  try {
    console.log('🔄 Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Cleaning Questions database...');
    const qRes = await Question.deleteMany({});
    console.log(`✨ Removed ${qRes.deletedCount} questions.`);

    console.log('🧹 Cleaning Candidate Results database...');
    const rRes = await Result.deleteMany({});
    console.log(`✨ Removed ${rRes.deletedCount} result records.`);

    console.log('\n🌟 DATABASE IS NOW FULLY CLEANED AND FRESH!');
    console.log('You can now start with a brand new question set.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ CRITICAL ERROR during cleanup:', err.message);
    process.exit(1);
  }
}

cleanDatabase();
