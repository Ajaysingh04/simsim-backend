import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['MANAGER', 'BILLING', 'INVENTORY', 'PACKER'],
      default: 'PACKER'
    },
    permissions: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INVITED', 'INACTIVE'],
      default: 'ACTIVE'
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
