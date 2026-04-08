const mongoose = require('mongoose');
require('dotenv').config();

async function manualClean() {
  try {
    console.log('🔄 Connecting to Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🧹 Clearing results collection...');
    await mongoose.connection.db.collection('results').deleteMany({});
    
    console.log('🧹 Clearing questions collection...');
    await mongoose.connection.db.collection('questions').deleteMany({});

    console.log('✨ DATABASE FULLY WIPED MANUALLY.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

manualClean();
