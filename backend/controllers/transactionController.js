import { Transaction } from '../models/Transaction.js';
import { Item } from '../models/Item.js';
import { User } from '../models/User.js';
import { generatePDF } from '../utils/generatePDF.js';

// Accept payment (mocked)
export const acceptPayment = async (req, res) => {
  try {
    const { amount, paymentStatus } = req.body;

    if (!req.user || !req.user.trolleyId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: Missing trolley ID',
      });
    }

    const { trolleyId } = req.user;

    // Perform necessary actions here (logging payment or similar)
    console.log(`Payment accepted for trolley ID: ${trolleyId}, Amount: ${amount}, Status: ${paymentStatus}`);

    res.status(200).json({
      success: true,
      message: 'Payment accepted',
    });
  } catch (error) {
    console.error('Payment acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept payment',
      error: error.message,
    });
  }
};

// Complete transaction
export const completeTransaction = async (req, res) => {
  try {
    // Check if trolleyId exists in the request
    if (!req.user || !req.user.trolleyId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: Missing trolley ID',
      });
    }

    const { trolleyId } = req.user;

    // Find items associated with the trolleyId
    const items = await Item.find({ trolleyId });

    // Check if no items are found in the trolley
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items found in trolley',
      });
    }

    const cleanedItems = items.map(item => {
      // Validate and clean price
      const cleanedPrice = parseFloat(item.price.replace('Rs', '').trim());
    
      // Ensure quantity is a valid number
      const quantity = item.quantity ? parseInt(item.quantity, 10) : 0; // Default to 0 if quantity is missing
      const name=item.name;
      const expiryDate=item.expiryDate;
    
      // Check if name, quantity, and price are valid
      if (!item.name || isNaN(cleanedPrice) || isNaN(quantity)) {
        console.warn(`Invalid item data: ${JSON.stringify(item)}`);
        return null; // Skip this item if data is invalid
      }
    
      console.log(`Cleaned price for ${item.name}: ${cleanedPrice}, Quantity: ${quantity}`);
      return {
        ...item,
        name: name,
        expiryDate:expiryDate,
        price: cleanedPrice,
        quantity: quantity
      };
    }).filter(item => item !== null); // Remove invalid items
    
    // Calculate total amount
    const totalAmount = cleanedItems.reduce((sum, item) => {
      console.log(`Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}`);
      return sum + item.price * item.quantity;
    }, 0);
    
    console.log('Total amount:', totalAmount);

    // Retrieve user details from the database
    const user = await User.findOne({ trolleyId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create a transaction record with the calculated totalAmount and other details
    const transaction = await Transaction.create({
      trolleyId,
      customerName: user.name,
      phoneNumber: user.phoneNumber,
      items: cleanedItems.map(item => ({
        name: item.name,
        weight: item.weight,
        price: item.price,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
      })),
      totalAmount,
      paymentStatus: 'completed', // This can be updated based on actual payment status
      timestamp: new Date().toISOString(),
    });

    // Generate a PDF bill for the transaction
    const pdfBuffer = await generatePDF(transaction);

    // Clear the cart after a successful transaction
    await Item.deleteMany({ trolleyId });

    // Send a successful response with the transaction and the PDF bill
    res.status(200).json({
      success: true,
      transaction,
      bill: pdfBuffer.toString('base64'),
    });
  } catch (error) {
    console.error('Transaction completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete transaction',
      error: error.message,
    });
  }
};
