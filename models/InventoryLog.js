import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    changeType: {
      type: String,
      enum: ['STOCK_IN', 'STOCK_OUT', 'ORDER_DEDUCTION', 'ORDER_RESTORE', 'ADJUSTMENT', 'EXPIRED'],
      required: true
    },
    quantityChanged: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    batchNumber: {
      type: String,
      default: ''
    },
    expiryDate: {
      type: Date
    },
    reason: {
      type: String,
      default: ''
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);
export default InventoryLog;
