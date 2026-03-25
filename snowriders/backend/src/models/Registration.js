const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Puan en az 1 olabilir'],
    max: [5, 'Puan en fazla 5 olabilir']
  },
  comment: {
    type: String,
    maxLength: [1000, 'Yorum çok uzun']
  },
  evaluatedAt: {
    type: Date
  }
}, { timestamps: true });

// Aynı kullanıcı aynı etkinliğe iki kez kayıt olamasın
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
