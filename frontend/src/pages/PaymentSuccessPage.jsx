// PaymentSuccessPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;
  //console.log("Transaction data:", transaction.createdAt);

  const handleContinueShopping = () => {
    navigate('/items');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          {transaction && (
            <div className="mt-4 space-y-2 text-left">
              <p className="text-sm text-gray-600">
                Transaction ID: {transaction._id}
              </p>
              <p className="text-sm text-gray-600">
                Amount: ₹{transaction.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleContinueShopping}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage