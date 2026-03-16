require('dotenv').config();
const mongoose = require('mongoose');
// Load User model first so it's registered for populate
require('./src/models/User');
const Event = require('./src/models/Event');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const events = await Event.find().populate('registeredUsers', 'name surname email studentNumber');
  
  events.forEach(event => {
    if (event.registeredUsers.length > 0) {
      console.log(`\n=== ${event.title} (${event.registeredUsers.length} katılımcı) ===`);
      event.registeredUsers.forEach((u, i) => {
        console.log(`${i + 1}. ${u.name} ${u.surname} - ${u.email} (${u.studentNumber || 'No'})`);
      });
    }
  });

  mongoose.disconnect();
});
