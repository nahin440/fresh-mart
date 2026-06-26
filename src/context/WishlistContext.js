'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('freshmart_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('freshmart_wishlist', JSON.stringify(items)); } catch {}
  }, [items]);

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        toast.success('Removed from wishlist');
        return prev.filter(i => i.id !== product.id);
      }
      toast.success('Added to wishlist');
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback((id) => items.some(i => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
