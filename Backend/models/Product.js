const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair'],
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    default: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'sold'],
    default: 'active',
  },
  buyDate: {
    type: Date,
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);
