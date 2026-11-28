import DeliveryAssignment from '../models/DeliveryAssignment.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';

// Helper to get vendor's store
const getVendorStore = async (userId) => {
  if (userId) {
    const s = await Store.findOne({
      $or: [{ owner: userId }, { vendor: userId }, { partner: userId }, { user: userId }]
    });
    if (s) return s;
  }
  return await Store.findOne({});
};

// 1. GET /api/vendor/delivery/overview
export const getDeliveryOverview = async (req, res) => {
  try {
    const store = await getVendorStore(req.user?._id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const totalOrders = await Order.countDocuments({ store: store._id });
    const waitingForPickup = await DeliveryAssignment.countDocuments({
      storeId: store._id,
      assignmentStatus: { $in: ['PENDING', 'ASSIGNMENT_REQUESTED'] }
    });
    const assignedDeliveries = await DeliveryAssignment.countDocuments({
      storeId: store._id,
      assignmentStatus: { $in: ['ASSIGNED', 'ACCEPTED', 'ARRIVING', 'ARRIVED'] }
    });
    const pickedUpOrders = await DeliveryAssignment.countDocuments({
      storeId: store._id,
      assignmentStatus: { $in: ['PICKED_UP', 'IN_TRANSIT'] }
    });
    const completedDeliveries = await DeliveryAssignment.countDocuments({
      storeId: store._id,
      assignmentStatus: 'DELIVERED'
    });
    const failedPickups = await DeliveryAssignment.countDocuments({
      storeId: store._id,
      assignmentStatus: 'FAILED'
    });

    res.status(200).json({
      success: true,
      data: {
        totalDeliveryOrders: totalOrders,
        waitingForPickup,
        assignedDeliveries,
        pickedUpOrders,
        completedDeliveries,
        failedPickups
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/vendor/delivery/assignments
export const getDeliveryAssignments = async (req, res) => {
  try {
    const store = await getVendorStore(req.user?._id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const { status } = req.query;
    const filter = { storeId: store._id };
    if (status && status !== 'ALL') {
      filter.assignmentStatus = status;
    }

    const assignments = await DeliveryAssignment.find(filter)
      .populate('orderId')
      .populate('deliveryPartnerId')
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET /api/vendor/delivery/assignments/:id
export const getDeliveryAssignmentById = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findById(req.params.id)
      .populate('orderId')
      .populate('deliveryPartnerId');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. POST /api/vendor/delivery/assignments/:id/request-pickup
export const requestOrderPickup = async (req, res) => {
  try {
    const store = await getVendorStore(req.user._id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const order = await Order.findOne({ _id: req.params.id, store: store._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found for your store' });
    }

    // Generate secure 4-digit Handover OTP
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Check or create partner for initial demo/assignment
    let partner = await DeliveryPartner.findOne({ isOnline: true });
    if (!partner) {
      partner = await DeliveryPartner.create({
        name: 'Rahul Sharma (SimSim Express)',
        partnerId: 'SIM-DEL-501',
        phone: '+91 98765 43210',
        vehicleType: 'EV_CYCLE',
        vehicleNumber: 'DL 04 EX 8899',
        rating: 4.9,
        isOnline: true,
        currentLocation: {
          latitude: store.location?.coordinates?.[1] || 28.6139,
          longitude: store.location?.coordinates?.[0] || 77.2090,
          heading: 90
        }
      });
    }

    let assignment = await DeliveryAssignment.findOne({ orderId: order._id });
    if (!assignment) {
      assignment = new DeliveryAssignment({
        orderId: order._id,
        vendorId: req.user._id,
        storeId: store._id,
        deliveryPartnerId: partner._id,
        assignmentStatus: 'ASSIGNED',
        assignedAt: new Date(),
        pickupOtpVerification: {
          otp: pickupOtp,
          isVerified: false
        }
      });
    } else {
      assignment.assignmentStatus = 'ASSIGNED';
      assignment.deliveryPartnerId = partner._id;
      assignment.assignedAt = new Date();
      assignment.pickupOtpVerification = {
        otp: pickupOtp,
        isVerified: false
      };
    }

    await assignment.save();

    // Update order status
    order.status = 'ready_for_pickup';
    await order.save();

    // Broadcast real-time Socket.IO event if available
    if (global.io) {
      global.io.emit(`order_${order._id}_delivery`, {
        assignmentId: assignment._id,
        status: 'ASSIGNED',
        partner: {
          name: partner.name,
          phone: partner.phone,
          vehicleNumber: partner.vehicleNumber
        },
        otp: pickupOtp
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pickup requested. Delivery partner assigned!',
      data: {
        assignment,
        partner,
        pickupOtp
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. POST /api/vendor/delivery/assignments/:id/verify-pickup
export const verifyOrderPickup = async (req, res) => {
  try {
    const { otp, notes } = req.body;
    const assignment = await DeliveryAssignment.findById(req.params.id)
      .populate('orderId')
      .populate('deliveryPartnerId');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Delivery assignment not found' });
    }

    if (assignment.pickupOtpVerification.otp !== otp?.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Handover OTP! Please enter correct 4-digit code provided by delivery partner.'
      });
    }

    assignment.pickupOtpVerification.isVerified = true;
    assignment.pickupOtpVerification.verifiedAt = new Date();
    assignment.pickupOtpVerification.verifiedBy = 'VENDOR';
    assignment.assignmentStatus = 'PICKED_UP';
    assignment.pickedUpAt = new Date();
    if (notes) assignment.handoverNotes = notes;
    await assignment.save();

    // Update Order to out_for_delivery
    if (assignment.orderId) {
      await Order.findByIdAndUpdate(assignment.orderId._id, {
        status: 'out_for_delivery',
        deliveryStatus: 'in_transit'
      });
    }

    if (global.io) {
      global.io.emit(`order_${assignment.orderId?._id}_status`, {
        status: 'out_for_delivery',
        pickedUpAt: assignment.pickedUpAt
      });
    }

    res.status(200).json({
      success: true,
      message: 'Handover verified successfully! Order is now Out For Delivery.',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. POST /api/vendor/delivery/assignments/:id/report-issue
export const reportDeliveryIssue = async (req, res) => {
  try {
    const { issueType, description } = req.body;
    const assignment = await DeliveryAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    assignment.issueReported = {
      type: issueType || 'PICKUP_DELAYED',
      description: description || 'Delivery partner has not arrived yet.',
      reportedAt: new Date(),
      resolved: false
    };
    assignment.assignmentStatus = 'FAILED';
    assignment.failureReason = description || issueType;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Issue reported to SimSim support. Central dispatcher alerted.',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. GET /api/vendor/delivery/history
export const getDeliveryHistory = async (req, res) => {
  try {
    const store = await getVendorStore(req.user._id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const history = await DeliveryAssignment.find({
      storeId: store._id,
      assignmentStatus: { $in: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] }
    })
      .populate('orderId')
      .populate('deliveryPartnerId')
      .sort({ updatedAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
