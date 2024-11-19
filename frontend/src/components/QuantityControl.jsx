// QuantityControl.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { api } from '../utils/api';

const QuantityControl = ({ itemId, quantity: initialQuantity = 1 }) => {
  const [quantity, setQuantity] = useState(() => {
    const parsedQuantity = parseInt(initialQuantity);
    return isNaN(parsedQuantity) ? 1 : parsedQuantity;
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parsedQuantity = parseInt(initialQuantity);
    if (!isNaN(parsedQuantity)) {
      setQuantity(parsedQuantity);
    }
  }, [initialQuantity]);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;

    setError(null);
    setIsUpdating(true);
    
    try {
      // Update quantity in the database
      const response = await api.patch(`/items/${itemId}/quantity`, {
        quantity: newQuantity
      });

      if (response.data && response.data.success) {
        setQuantity(newQuantity);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
      setQuantity(quantity); // Revert to previous quantity
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className={`w-8 text-center font-medium ${isUpdating ? 'opacity-50' : ''}`}>
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isUpdating}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default QuantityControl;