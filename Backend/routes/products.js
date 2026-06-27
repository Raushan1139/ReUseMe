const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getNearbyProducts,
  updateProductStatus,
  deleteProduct,
  updateProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/nearby', protect, getNearbyProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id/status', protect, updateProductStatus);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
