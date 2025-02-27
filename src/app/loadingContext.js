"use client"
// context/loadingContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the Loading context
const LoadingContext = createContext();

// Create a custom hook to use the Loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Create the LoadingProvider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
