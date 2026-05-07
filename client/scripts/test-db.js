const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to get MONGODB_URI
const envPath = path.join(__dirname, '../.env.local');
let MONGODB_URI = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match) {
    MONGODB_URI = match[1].trim();
  }
}

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB Atlas...');
console.log(`URI: ${MONGODB_URI.split('@')[1]} (password hidden)`);

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Create a dummy collection and document to force DB creation
    const TestSchema = new mongoose.Schema({ name: String, date: Date });
    const TestModel = mongoose.models.DBInitTest || mongoose.model('DBInitTest', TestSchema);
    
    console.log('Creating initial metadata...');
    await TestModel.create({ name: 'Initial Connection Test', date: new Date() });
    
    console.log('✅ Database "resumeforge" and collection "dbinittests" created successfully!');
    console.log('\nNext steps:');
    console.log('1. Go to your MongoDB Atlas dashboard.');
    console.log('2. Click "Data Explorer" or "Browse Collections".');
    console.log('3. You should now see the "resumeforge" database.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error details:', error.message);
    
    if (error.message.includes('IP not whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.log('\nTIP: Check your MongoDB Atlas "Network Access" settings and ensure your IP is whitelisted.');
    }
    
    process.exit(1);
  }
}

testConnection();
