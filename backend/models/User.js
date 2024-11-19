import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  trolleyId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);