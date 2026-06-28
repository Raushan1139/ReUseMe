const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const crypto=require("crypto")
const transporter=require("../utils/sendMail")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeyforreuseme', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please enter all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
    try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "🎉 Welcome to ReUseHub!",
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto">
        <h1 style="color:#16a34a;">Welcome to ReUseHub, ${user.username}! 👋</h1>

        <p>Thank you for joining <b>ReUseHub</b>.</p>

        <p>You can now:</p>

        <ul>
          <li>🛒 Buy quality used products</li>
          <li>💰 Sell your unused items</li>
          <li>📍 Discover products near your location</li>
          <li>❤️ Save items to your wishlist</li>
        </ul>

        <a href="https://reuseme-eight.vercel.app"
           style="display:inline-block;
                  background:#16a34a;
                  color:white;
                  text-decoration:none;
                  padding:12px 24px;
                  border-radius:8px;">
          Visit ReUseHub
        </a>

        <br><br>

        <p>Happy Trading!</p>

        <p><b>The ReUseHub Team</b></p>
      </div>
    `
  });
} catch (err) {
  console.error("Welcome email failed:", err);
}

    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          joined: user.joined,
          rating: user.rating,
          phone: user.phone || '',
          city: user.city || '',
          activeListingsCount: 0,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter email and password');
    }

    // Check for user email strictly
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Count active listings created by this user
      const activeListingsCount = await Product.countDocuments({ seller: user._id });

      res.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          joined: user.joined,
          rating: user.rating,
          phone: user.phone || '',
          city: user.city || '',
          activeListingsCount,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const activeListingsCount = await Product.countDocuments({ seller: user._id });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      joined: user.joined,
      rating: user.rating,
      phone: user.phone || '',
      city: user.city || '',
      activeListingsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'seller', select: 'username email avatar rating joined' }
    });

    // Filter out deleted products from wishlist
    const activeWishlist = user.wishlist.filter(p => p !== null);

    // Map wishlist products to format frontend expects
    const formattedWishlist = activeWishlist.map(p => {
      return {
        id: p._id.toString(),
        title: p.title,
        category: p.category,
        price: p.price,
        condition: p.condition,
        location: p.city || '', // For backward compatibility with frontend expecting city string
        images: p.images,
        description: p.description,
        createdAt: p.createdAt,
        views: p.views,
        isFeatured: p.isFeatured,
        seller: p.seller ? {
          id: p.seller._id.toString(),
          name: p.seller.username,
          rating: p.seller.rating,
          avatar: p.seller.avatar,
          joined: p.seller.joined,
          email: p.seller.email,
        } : null
      };
    });

    res.json(formattedWishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/toggle/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    // Use findIndex and string conversion since wishlist contains ObjectIds
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    let isAdded = false;

    if (index > -1) {
      // Remove
      user.wishlist.splice(index, 1);
    } else {
      // Add
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    res.json({ wishlist: user.wishlist, isAdded });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user wishlist
// @route   DELETE /api/auth/wishlist
// @access  Private
const clearWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    res.json({ message: "Wishlist cleared" });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile settings
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, phone, city } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // If username is changing, check if it's already taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username is already taken');
      }
      user.username = username;
    }

    // If email is changing, check if it's already taken
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already in use');
      }
      user.email = email.toLowerCase();
    }

    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;

    await user.save();

    const activeListingsCount = await Product.countDocuments({ seller: user._id });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      joined: user.joined,
      rating: user.rating,
      phone: user.phone || '',
      city: user.city || '',
      activeListingsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user location
// @route   PUT /api/auth/location
// @access  Private
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400);
      throw new Error('Please provide latitude and longitude');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.location = {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    };

    await user.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry (15 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset link
    const resetLink =
`https://reuseme-eight.vercel.app/#/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your ReUseHub Password",
      html: `
        <h2>Password Reset</h2>

        <p>Hello ${user.username},</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>
      `
    });

    res.json({
      success: true,
      message: "Password reset link sent successfully."
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400);
      throw new Error('Please include token and new password');
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  getWishlist,
  toggleWishlist,
  clearWishlist,
  updateLocation,
  updateProfile,
};
