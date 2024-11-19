import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  trolleyId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    weight: String,
    price: Number,
    quantity: Number,
    expiryDate: Date
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);