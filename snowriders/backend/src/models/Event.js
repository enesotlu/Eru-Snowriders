const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Etkinlik adı zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakterden fazla olamaz']
  },
  description: {
    type: String,
    required: [true, 'Açıklama zorunludur'],
    maxlength: [1000, 'Açıklama 1000 karakterden fazla olamaz']
  },
  date: {
    type: Date,
    required: [true, 'Etkinlik tarihi zorunludur']
  },
  location: {
    type: String,
    trim: true,
    default: 'Erciyes Dağı'
  },
  capacity: {
    type: Number,
    required: [true, 'Kontenjan zorunludur'],
    min: [1, 'Kontenjan en az 1 olmalıdır']
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Sanal alan: kalan kontenjan
eventSchema.virtual('remainingCapacity').get(function() {
  return this.capacity - this.registeredUsers.length;
});

// Sanal alan: etkinlik dolu mu?
eventSchema.virtual('isFull').get(function() {
  return this.registeredUsers.length >= this.capacity;
});

// Sanal alan: tarih geçti mi?
eventSchema.virtual('isPast').get(function() {
  return new Date(this.date) < new Date();
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
