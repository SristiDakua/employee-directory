const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI);

async function testConnection() {
  try {
    // Try with minimal options first
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = client.db('employee_directory');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Try with TLS insecure as a fallback
    console.log('Trying with TLS insecure option...');
    try {
      const clientInsecure = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        tls: true,
        tlsInsecure: true, // This allows connections even with certificate issues
      });
      await clientInsecure.connect();
      console.log('✅ Successfully connected to MongoDB with insecure TLS!');
      
      const db = clientInsecure.db('employee_directory');
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      await clientInsecure.close();
      console.log('Connection closed.');
    } catch (insecureError) {
      console.error('❌ Even insecure connection failed:', insecureError.message);
    }
  }
}

testConnection();
