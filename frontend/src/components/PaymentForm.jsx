import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const PaymentForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    cvv: '',
    expiryDate: '',
  });

  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!user?.trolleyId) {
      setError('No trolley ID found');
      return;
    }

    // Validate card fields (basic checks)
    if (!cardDetails.cardNumber || !cardDetails.cardHolderName || !cardDetails.cvv || !cardDetails.expiryDate) {
      setError('Please fill in all card details.');
      return;
    }
  
    setIsProcessing(true);
    setError('');
  
    try {
      // First accept the payment
      const paymentResponse = await api.post('/transactions/accept-payment', {
        amount: 0, // Amount will be calculated on backend based on trolley items
        paymentStatus: 'processing',
        cardDetails, // Include card details in the request
      });
  
      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.message);
      }
  
      // Then complete the transaction
      const transactionResponse = await api.post('/transactions/complete');
  
      if (transactionResponse.data.success) {
        if (transactionResponse.data.bill) {
          const binaryString = atob(transactionResponse.data.bill);
          const byteArray = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bill-${transactionResponse.data.transaction._id}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        }
  
        navigate('/payment-success', {
          state: { transaction: transactionResponse.data.transaction },
        });
      } else {
        throw new Error(transactionResponse.data.message);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handlePayment} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Complete Your Purchase</h2>
          <p className="text-gray-600">Trolley ID: {user?.trolleyId}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Card Details Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            maxLength="20"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails((prev) => ({ ...prev, cardNumber: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardDetails.cardHolderName}
            onChange={(e) => setCardDetails((prev) => ({ ...prev, cardHolderName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              maxLength="5"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => setCardDetails((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="password"
              maxLength="3"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                   flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Pay Now</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
