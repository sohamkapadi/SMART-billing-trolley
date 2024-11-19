// ItemsPage.jsx
import React from 'react';
import ItemList from '../components/ItemList';
import { useAuth } from '../context/AuthContext';

const ItemsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <span className="text-gray-600">Trolley ID: {user?.trolleyId}</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <ItemList />
      </main>
    </div>
  );
};

export default ItemsPage;