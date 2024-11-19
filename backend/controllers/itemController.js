import { Item } from '../models/Item.js';
import { wss } from '../server.js';

export const getItems = async (req, res) => {
  try {
    const { trolleyId } = req.params; // Ensure it's params, not query
    console.log('Received trolleyId:', trolleyId); // Log trolleyId for debugging

    const items = await Item.find({ trolleyId: String(trolleyId) });
    console.log('Items found:', items); // Log items to see what's being returned

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      await Item.findByIdAndDelete(itemId);
    } else {
      const item = await Item.findByIdAndUpdate(
        itemId,
        { quantity },
        { new: true }
      );
    }
    
    // Broadcast update to all connected clients
    const updatedItems = await Item.find({ trolleyId: req.user.trolleyId });
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'ITEMS_UPDATED',
          items: updatedItems
        }));
      }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this in your addItems controller

// Controller for adding items
export const addItems = async (req, res) => {
  console.log("A post request was made to add an item");
  try {
    const { trolleyId, name, weight, price, expiryDate } = req.body;

    // Save item to MongoDB
    const item = new Item({ trolleyId, name, weight, price, expiryDate });
    await item.save();

    // Broadcast new item to all WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'ITEM_ADDED',
          item: item, // Send the newly added item data
        }));
      }
    });

    res.status(201).json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
