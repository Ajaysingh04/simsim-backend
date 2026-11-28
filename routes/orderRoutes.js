import express from 'express';
import {
  createOrder,
  createRazorpayIntent,
  getOrderById,
  getMyOrders,
  getAssignedOrders,
  updateOrderStatus,
  updateDeliveryCoordinates,
  verifyPayment,
  cancelOrder,
  requestRefund,
  getAllOrders,
  getPartnerOrders,
  deleteOrder,
  pickupScanOrder,
  rateOrder
} from '../controllers/orderController.js';
import { protect, restrictTo, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow order creation with optionalProtect so guest/mobile app checkouts never get rejected by 401
router.post('/', optionalProtect, createOrder);
router.post('/razorpay-intent', optionalProtect, createRazorpayIntent);
router.post('/verify-payment', optionalProtect, verifyPayment);
// User Orders (supports both /myorders and /my-orders, with optionalProtect for demo/guest mobile flow)
router.get('/myorders', optionalProtect, getMyOrders);
router.get('/my-orders', optionalProtect, getMyOrders);
router.get('/admin/all', optionalProtect, getAllOrders);
router.get('/partner', optionalProtect, getPartnerOrders);
router.get('/:id', optionalProtect, getOrderById);
router.delete('/:id', optionalProtect, deleteOrder);

// Pickup and Rating Actions
router.post('/:id/pickup-scan', optionalProtect, pickupScanOrder);
router.post('/:id/rate', optionalProtect, rateOrder);

// User Order actions
router.put('/:id/cancel', optionalProtect, cancelOrder);
router.put('/:id/refund', optionalProtect, requestRefund);

// Delivery partner assignments and locations
router.get('/delivery/assigned', optionalProtect, getAssignedOrders);
router.put('/delivery/coordinates', optionalProtect, updateDeliveryCoordinates);

// Status modifier (used by Admins, Partners & Delivery Partners)
router.put('/:id/status', optionalProtect, updateOrderStatus);

export default router;
