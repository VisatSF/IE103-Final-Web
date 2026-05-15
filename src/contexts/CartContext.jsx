
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem('jobillee_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('jobillee_cart', JSON.stringify(cart));
  }, [cart]);

  // Utility to parse price strings like "30k" or "78,000 VND" to numbers
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const str = priceStr.toString().toLowerCase().replace(/,/g, '').replace(/\./g, '').trim();
    if (str.endsWith('k')) {
      return parseInt(str.replace('k', '')) * 1000;
    }
    if (str.includes('vnd')) {
      return parseInt(str.replace('vnd', '').trim());
    }
    return parseInt(str) || 0;
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          menuItemId: item.menuItemId ?? item.id,
          id: Math.random().toString(36).substr(2, 9),
          quantity: 1,
          parsedPrice: item.parsedPrice ?? parsePrice(item.price)
        }
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => 
      prev.map((i) => {
        if (i.id === itemId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.parsedPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
