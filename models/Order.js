import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  customerEmail: { type: String },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, default: 'Noida' },
    state: { type: String, default: 'Uttar Pradesh' },
    zipCode: { type: String, default: '201301' }
  },
  billDetails: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    tax: { type: Number, default: 0 },
    codCharge: { type: Number, default: 0 },
    extraDistanceSurcharge: { type: Number, default: 0 },
    appliedCharges: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }],
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  paymentDetails: {
    method: { type: String, enum: ['cod', 'card', 'upi', 'online', 'wallet', 'netbanking'], default: 'upi', required: true },
    gateway: { type: String, enum: ['stripe', 'razorpay', 'none'], default: 'none' },
    paymentId: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'completed', 'failed', 'refund_requested', 'refunded'], default: 'pending' }
  },
  status: {
    type: String,
    enum: [
      'pending_payment',
      'placed',
      'confirmed',
      'preparing',
      'ready',
      'ready_for_pickup',
      'searching_rider',
      'rider_assigned',
      'picked_up',
      'out_for_delivery',
      'out-for-delivery',
      'arrived',
      'delivered',
      'cancelled',
      'rejected',
      'refund_pending',
      'refunded'
    ],
    default: 'placed',
    index: true
  },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // role must be 'delivery'
  deliveryCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  pickedUpAt: { type: Date },
  deliveredAt: { type: Date },
  pickupCode: { type: String },
  rating: {
    riderRating: { type: Number, min: 1, max: 5 },
    customerRating: { type: Number, min: 1, max: 5 },
    feedback: { type: String }
  },
  codPaidViaQr: { type: Boolean, default: false }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
