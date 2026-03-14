const mongoose = require('mongoose');

async function makeAdmin() {
  await mongoose.connect('mongodb://localhost:27017/eru-snowriders');
  const result = await mongoose.connection.collection('users').updateOne(
    { name: 'ahmet' },
    { $set: { role: 'admin' } }
  );
  console.log('Modified count:', result.modifiedCount);
  await mongoose.disconnect();
}

makeAdmin().catch(console.error);
