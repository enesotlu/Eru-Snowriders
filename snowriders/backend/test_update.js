const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const event = await Event.findOne();
    if (!event) return console.log("Event not found");
    console.log("OLD EVENT:", event);

    const updated = await Event.findByIdAndUpdate(event._id, {
      registrationDeadline: new Date('2026-03-18')
    }, { new: true, runValidators: true });

    console.log("UPDATED EVENT:", updated);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
