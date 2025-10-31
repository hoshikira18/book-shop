import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAllProducts } from '../utils/database';
import { books as staticBooks } from '../data/books';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const dbProducts = await getAllProducts();

      if (dbProducts.length !== 0) {
        setProducts(dbProducts);
      } 
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

console.log({products})

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const refreshProducts = async () => {
    await loadProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
