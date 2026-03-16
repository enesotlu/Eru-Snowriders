require('dotenv').config();
const mongoose = require('mongoose');
require('./src/models/User');
const Event = require('./src/models/Event');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const events = await Event.find().populate('registeredUsers', '_id');
  
  let fixed = 0;
  for (const event of events) {
    const beforeCount = event.registeredUsers.length;
    const validUsers = event.registeredUsers.filter(u => u !== null);
    const afterCount = validUsers.length;
    
    if (beforeCount !== afterCount) {
      console.log(`Fixing "${event.title}": ${beforeCount - afterCount} stale ID(s) removed`);
      event.registeredUsers = validUsers.map(u => u._id);
      await event.save();
      fixed++;
    } else {
      console.log(`"${event.title}": Clean (${afterCount} participants)`);
    }
  }

  console.log(`\nDone. Fixed ${fixed} event(s).`);
  mongoose.disconnect();
});
