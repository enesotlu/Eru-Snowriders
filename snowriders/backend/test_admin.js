require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Event = require('./src/models/Event');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const events = await Event.find().sort({ date: 1 });
    console.log('Events fetched:', events.length);
  } catch (err) {
    console.error('Error fetching events:', err);
  }
  mongoose.disconnect();
});
