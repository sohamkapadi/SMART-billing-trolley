import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  trolleyId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  weight: String,
  price: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  expiryDate: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);