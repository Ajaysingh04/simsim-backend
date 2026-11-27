import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getVendorDashboard,
  getVendorInventory,
  adjustStock,
  getVendorEarnings,
  getVendorStaff,
  addVendorStaff,
  getVendorReports,
  getVendorOrders,
  updateVendorOrderStatus
} from '../controllers/vendorDashboardController.js';
import vendorDeliveryRoutes from './vendorDeliveryRoutes.js';
import {
  getOrders,
  getMenu,
  addProduct,
  updateProduct,
  deleteProduct,
  getProfile,
  updateProfile,
  getPartnerReviews
} from '../controllers/partnerController.js';
import { updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Mount vendor delivery sub-routes
router.use('/delivery', vendorDeliveryRoutes);

// Protect all vendor routes below
router.use(protect, restrictTo('partner', 'admin', 'vendor'));

// Dashboard
router.get('/dashboard', getVendorDashboard);

// Orders (Direct live order feed for vendor app)
router.get('/orders', getVendorOrders);
router.put('/orders/:id/status', updateVendorOrderStatus);

// Products / Menu
router.get('/products', getMenu);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Inventory
router.get('/inventory', getVendorInventory);
router.post('/inventory/adjust', adjustStock);

// Earnings & Settlements
router.get('/earnings', getVendorEarnings);

// Staff
router.get('/staff', getVendorStaff);
router.post('/staff', addVendorStaff);

// Reviews
router.get('/reviews', getPartnerReviews);

// Reports
router.get('/reports', getVendorReports);

// Store Profile
router.get('/store', getProfile);
router.put('/store', updateProfile);

export default router;
