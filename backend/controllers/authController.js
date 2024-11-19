import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { trolleyId, name, phoneNumber } = req.body;
    
    // Find or create user
    let user = await User.findOne({ trolleyId });
    if (!user) {
      user = await User.create({ trolleyId, name, phoneNumber });
    } else {
      // Update existing user info
      user.name = name;
      user.phoneNumber = phoneNumber;
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, trolleyId: user.trolleyId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      token,
      user: {
        trolleyId: user.trolleyId,
        name: user.name,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};