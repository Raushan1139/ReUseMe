const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);
router.put('/location', protect, updateLocation);
router.put('/profile', protect, updateProfile);
router.get('/wishlist', protect, getWishlist);
router.delete('/wishlist', protect, clearWishlist);
router.post('/wishlist/toggle/:productId', protect, toggleWishlist);

module.exports = router;
