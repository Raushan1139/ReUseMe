const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    default: [0, 0]
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${this.username}`;
    }
  },
  joined: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  location: {
    type: locationSchema,
    required: true,
    default: () => ({ type: 'Point', coordinates: [0, 0] })
  },
  phone: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  resetPasswordToken:{
    type:String
  },
  resetPasswordExpire:{
    type:Date,
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  if (!this.location || !this.location.coordinates || this.location.coordinates.length !== 2) {
    this.set('location', {
      type: 'Point',
      coordinates: [0, 0]
    });
  }
  this.markModified('location');
  if (typeof next === 'function') {
    next();
  }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);