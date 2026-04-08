const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });

async function manualClean() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found in backend/.env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Deleting via raw collection names to avoid model require issues
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
