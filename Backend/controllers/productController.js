const Product = require('../models/Product');
const User = require('../models/User');

const mapProduct = (p) => {
  if (!p) return null;
  return {
    id: p._id.toString(),
    title: p.title,
    category: p.category,
    price: p.price,
    condition: p.condition,
    location: p.city || '', // For backward compatibility with frontend expecting city string
    coordinates: p.location && p.location.coordinates ? {
      longitude: p.location.coordinates[0],
      latitude: p.location.coordinates[1]
    } : null,
    images: p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"],
    description: p.description,
    seller: p.seller ? {
      id: p.seller._id ? p.seller._id.toString() : p.seller,
      name: p.seller.username || "Registered User",
      rating: p.seller.rating || 5.0,
      avatar: p.seller.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=Guest`,
      joined: p.seller.joined || "Jun 2026",
      phone: p.seller.phone || "+918102249732",
      email: p.seller.email || "",
    } : null,
    createdAt: p.createdAt,
    views: p.views,
    isFeatured: p.isFeatured,
    status: p.status || 'active',
    buyDate: p.buyDate,
    specifications: p.specifications instanceof Map 
      ? Object.fromEntries(p.specifications) 
      : (p.specifications || {})
  };
};

// @desc    Get all products (with optional filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { search, category, location, minPrice, maxPrice, condition, sort, latitude, longitude, status, seller } = req.query;
    
    // Build query object
    const query = {};

    // Filter by status: default to active (not sold) if not explicitly queried (e.g. to display sold items in profile)
    if (status) {
      query.status = status;
    } else if (!seller) {
      query.status = { $ne: 'sold' };
    }

    if (seller) {
      query.seller = seller;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.city = { $regex: location, $options: 'i' };
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortCriteria = {};
    let useNear = false;

    // Proximity sorting
    if (latitude && longitude && (sort === 'nearby' || !sort)) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          }
        }
      };
      useNear = true;
    } else {
      // Build standard sort criteria
      if (sort === 'price-asc') {
        sortCriteria = { price: 1 };
      } else if (sort === 'price-desc') {
        sortCriteria = { price: -1 };
      } else {
        sortCriteria = { createdAt: -1 }; // Default: newest first
      }
    }

    let productsQuery = Product.find(query).populate('seller', 'username email avatar rating joined phone');
    
    if (!useNear && Object.keys(sortCriteria).length > 0) {
      productsQuery = productsQuery.sort(sortCriteria);
    }

    const products = await productsQuery;
    const formattedProducts = products.map(mapProduct);
    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'username email avatar rating joined phone');

    if (!product) {
      res.status(404);
      throw new Error('Product listing not found');
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    res.json(mapProduct(product));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { title, category, price, condition, location, city, latitude, longitude, description, images, buyDate, specifications } = req.body;

    if (!title || !category || !price || !condition || !description) {
      res.status(400);
      throw new Error('Please include all required fields');
    }

    const resolvedCity = city || location || 'San Francisco, CA';
    const lat = latitude !== undefined ? Number(latitude) : 37.7749;
    const lng = longitude !== undefined ? Number(longitude) : -122.4194;

    const product = await Product.create({
      title,
      category,
      price: Number(price),
      condition,
      city: resolvedCity,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      description,
      images: images && images.length > 0 ? images : undefined,
      seller: req.user._id,
      buyDate: buyDate || undefined,
      specifications: specifications || {},
    });

    // Populate seller info before responding
    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'username email avatar rating joined phone');

    res.status(201).json(mapProduct(populatedProduct));
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby products for logged-in user
// @route   GET /api/products/nearby
// @access  Private
const getNearbyProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.location || !user.location.coordinates || user.location.coordinates.length < 2) {
      res.status(400);
      throw new Error('User location is not set');
    }

    const coords = user.location.coordinates;
    const products = await Product.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords
          },
          $maxDistance: 50000 // 50km
        }
      }
    }).populate('seller', 'username email avatar rating joined phone');

    res.json(products.map(mapProduct));
  } catch (error) {
    next(error);
  }
};

// @desc    Update product status (e.g. mark as sold)
// @route   PUT /api/products/:id/status
// @access  Private
const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'sold'].includes(status)) {
      res.status(400);
      throw new Error('Please provide a valid status');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to modify this listing');
    }

    product.status = status;
    await product.save();

    res.json(mapProduct(product));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this listing');
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details (edit listing)
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const { title, category, price, condition, city, latitude, longitude, description, images, buyDate, specifications } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to modify this listing');
    }

    // Update fields
    if (title) product.title = title;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (condition) product.condition = condition;
    if (city) product.city = city;
    if (latitude !== undefined && longitude !== undefined) {
      product.location = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      };
    }
    if (description) product.description = description;
    if (images) product.images = images;
    if (buyDate !== undefined) product.buyDate = buyDate;
    if (specifications) product.specifications = specifications;

    await product.save();

    // Populate seller info before responding
    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'username email avatar rating joined phone');

    res.json(mapProduct(populatedProduct));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getNearbyProducts,
  updateProductStatus,
  deleteProduct,
  updateProduct,
};

const transporter =
    require("../utils/sendMail");

exports.contactSeller =
async (req, res) => {
    try {
        const {
            sellerEmail,
            buyerName,
            message,
            productTitle
        } = req.body;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,

            to: sellerEmail,

            subject:
                `Inquiry about ${productTitle}`,

            html: `
                <h2>New Inquiry on ReUseMe</h2>

                <p>
                    <b>${buyerName}</b>
                    is interested in your product.
                </p>

                <p>
                    <b>Message:</b>
                </p>

                <p>${message}</p>

                <hr>

                <p>
                    Sent via ReUseMe
                </p>
            `
        });

        res.json({
            success: true,
            message:
                "Message sent successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message:
                "Email sending failed"
        });
    }
};