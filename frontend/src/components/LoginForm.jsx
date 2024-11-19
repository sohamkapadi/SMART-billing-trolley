import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import shopping from "/shopping.png";

const LoginForm = () => {
  const { trolleyId } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        trolleyId,
        ...formData,
      });
      navigate('/items');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Section: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center md:text-left">Welcome</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={trolleyId}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
            >
              Start Shopping
            </button>
          </form>
        </div>

        {/* Right Section: Image and Title */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Smart Mobile Autonomous Robotic Trolley (SMART)</h2>
          <img
            src={shopping}
            alt="Smart Trolley Illustration"
            className="max-w-xs h-auto rounded-lg shadow-lg"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
