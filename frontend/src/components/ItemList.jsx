import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../utils/websocket';
import QuantityControl from './QuantityControl';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const ws = useWebSocket();

  // Fetch items based on trolleyId
  const fetchItems = async () => {
    try {
      const response = await api.get(`/items/${user.trolleyId}`);
      if (response.data && response.data.success && Array.isArray(response.data.items)) {
        setItems(response.data.items); 
        setTotal(calculateTotal(response.data.items)); // Calculate initial total here
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Calculate the total cost
  const calculateTotal = (itemsList) => {
    return itemsList.reduce((sum, item) => {
      const priceString = item.price.replace(/Rs\s*/i, ''); 
      const price = parseFloat(priceString) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + price * quantity;
    }, 0);
  };

  // Handle quantity updates and update total immediately
  const handleQuantityChange = (itemId, newQuantity) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setTotal(calculateTotal(updatedItems)); // Recalculate total immediately after quantity change
      return updatedItems;
    });
  };

  useEffect(() => {
    fetchItems();
  
    if (ws && user && user.trolleyId) {
      const handleWebSocketMessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
          const data = JSON.parse(event.data);
  
          if (data.type === 'ITEMS_UPDATED' && data.items) {
            const updatedItems = data.items;
  
            setItems(updatedItems); 
            setTotal(calculateTotal(updatedItems)); // Recalculate total whenever items are updated
          }
          if (data.type === 'ITEM_ADDED' && data.item) {
            // Add the new item to the list
            setItems((prevItems) => [...prevItems, data.item]);
            setTotal((prevTotal) => prevTotal + parseFloat(data.item.price.replace(/Rs\s*/i, '')));
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
  
      ws.addEventListener('message', handleWebSocketMessage);
  
      return () => {
        ws.removeEventListener('message', handleWebSocketMessage);
      };
    }
  }, [ws, user]);
  

  const handleBuyNow = () => {
    navigate('/payment');
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Weight</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">₹{item.price}</td>
                <td className="px-6 py-4">{item.weight}</td>
                <td className="px-6 py-4">
                  <QuantityControl
                    itemId={item._id}
                    quantity={item.quantity}
                    onQuantityChange={handleQuantityChange}
                  />
                </td>
                <td className={`px-6 py-4 ${isExpired(item.expiryDate) ? 'text-red-600' : ''}`}>
                  {new Date(item.expiryDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <div className="text-2xl font-bold">
          Total: ₹{total.toFixed(2)}
        </div>
        <button
          onClick={handleBuyNow}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ItemList;
