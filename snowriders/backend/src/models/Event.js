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
  registrationDeadline: {
    type: Date,
    required: [true, 'Son kayıt tarihi zorunludur']
  },
  date: {
    type: Date,
    required: [true, 'Etkinlik tarihi zorunludur']
  },
  startTime: {
    type: String,
    trim: true,
    default: ''
  },
  endTime: {
    type: String,
    trim: true,
    default: ''
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

// Sanal alan: kayıt kapandı mı?
eventSchema.virtual('isRegistrationClosed').get(function() {
  if (!this.registrationDeadline) return false;
  
  // Set the deadline to the end of the day (23:59:59.999) if no specific time is provided,
  // or just compare directly. For simplicity, we compare directly.
  return new Date(this.registrationDeadline) < new Date();
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
