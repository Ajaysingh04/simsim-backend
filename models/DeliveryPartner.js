import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    partnerId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'APPROVED'
    },
    isOnline: {
      type: Boolean,
      default: true
    },
    vehicleType: {
      type: String,
      enum: ['BIKE', 'SCOOTER', 'EV_CYCLE', 'VAN'],
      default: 'BIKE'
    },
    vehicleNumber: {
      type: String,
      default: 'DL 01 AB 1234'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    currentLocation: {
      latitude: { type: Number, default: 28.6139 },
      longitude: { type: Number, default: 77.2090 },
      heading: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    },
    activeAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryAssignment',
      default: null
    }
  },
  { timestamps: true }
);

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
