const mongoose = require('mongoose');
const { LEAD_STATUSES } = require('../constants/lead-statuses');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name must be 120 characters or fewer']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email must be 254 characters or fewer']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'new'
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
