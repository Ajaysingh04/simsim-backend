import express from 'express';
import { protect, restrictTo, optionalProtect } from '../middleware/authMiddleware.js';
import {
  getDeliveryOverview,
  getDeliveryAssignments,
  getDeliveryAssignmentById,
  requestOrderPickup,
  verifyOrderPickup,
  reportDeliveryIssue,
  getDeliveryHistory
} from '../controllers/vendorDeliveryController.js';

const router = express.Router();

// Allow vendor delivery management routes with optionalProtect
router.use(optionalProtect);

router.get('/overview', getDeliveryOverview);
router.get('/assignments', getDeliveryAssignments);
router.get('/assignments/:id', getDeliveryAssignmentById);
router.post('/assignments/:id/request-pickup', requestOrderPickup);
router.post('/assignments/:id/verify-pickup', verifyOrderPickup);
router.post('/assignments/:id/report-issue', reportDeliveryIssue);
router.get('/history', getDeliveryHistory);

export default router;
