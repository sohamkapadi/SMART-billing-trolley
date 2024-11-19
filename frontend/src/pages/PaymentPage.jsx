import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { useWebSocket } from '../utils/websocket';

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ws = useWebSocket();

  React.useEffect(() => {
    if (ws) {
      const handleWebSocketMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle real-time payment status updates
          if (data.type === 'PAYMENT_STATUS' && data.trolleyId === user?.trolleyId) {
            if (data.status === 'completed') {
              navigate('/payment-success', { 
                state: { transaction: data.transaction }
              });
            } else if (data.status === 'failed') {
              // Handle payment failure
              console.error('Payment failed:', data.message);
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.addEventListener('message', handleWebSocketMessage);
      return () => ws.removeEventListener('message', handleWebSocketMessage);
    }
  }, [ws, user?.trolleyId, navigate]);

  const handleCancel = () => {
    navigate('/items');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

