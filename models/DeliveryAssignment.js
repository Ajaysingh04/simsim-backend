import mongoose from 'mongoose';

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
      default: null,
      index: true
    },
    assignmentStatus: {
      type: String,
      enum: [
        'PENDING',
        'ASSIGNMENT_REQUESTED',
        'ASSIGNED',
        'ACCEPTED',
        'ARRIVING',
        'ARRIVED',
        'PICKUP_VERIFICATION_PENDING',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'FAILED',
        'CANCELLED'
      ],
      default: 'PENDING',
      index: true
    },
    assignedAt: { type: Date },
    acceptedAt: { type: Date },
    arrivedAt: { type: Date },
    pickupOtpVerification: {
      otp: { type: String },
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      verifiedBy: { type: String, enum: ['VENDOR', 'DELIVERY_PARTNER', 'SYSTEM'], default: 'VENDOR' }
    },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    failureReason: { type: String, default: null },
    issueReported: {
      type: { type: String },
      description: { type: String },
      reportedAt: { type: Date },
      resolved: { type: Boolean, default: false }
    },
    handoverNotes: { type: String, default: '' },
    estimatedDeliveryTime: { type: String, default: '10-15 mins' }
  },
  { timestamps: true }
);

const DeliveryAssignment = mongoose.model('DeliveryAssignment', deliveryAssignmentSchema);
export default DeliveryAssignment;
