const mongoose = require('mongoose');

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
    type: {
        type: String,
        enum:["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        default:[0,0]
    }
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

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);