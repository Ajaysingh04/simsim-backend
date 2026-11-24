import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    settlementId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    grossSales: { type: Number, required: true, default: 0 },
    platformCommissionRate: { type: Number, default: 5 }, // 5%
    platformCommission: { type: Number, required: true, default: 0 },
    taxDeduction: { type: Number, default: 0 },
    refundDeductions: { type: Number, default: 0 },
    netPayout: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SETTLED', 'FAILED'],
      default: 'PENDING',
      index: true
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    payoutRef: { type: String, default: null },
    settledAt: { type: Date, default: null },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
export default Settlement;
