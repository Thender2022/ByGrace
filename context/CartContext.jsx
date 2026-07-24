'use client';

import { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const CartContext = createContext();

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT_CART':
      return {
        ...state,
        cartItems: Array.isArray(action.payload) ? action.payload : [],
        isLoaded: true,
      };

    case 'ADD_TO_CART': {
      const { product, selectedSize, selectedColor } = action.payload;
      const currentItems = Array.isArray(state.cartItems) ? state.cartItems : [];
      
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      let newCartItems;
      if (existingItemIndex > -1) {
        newCartItems = [...currentItems];
        newCartItems[existingItemIndex].quantity += 1;
      } else {
        newCartItems = [
          ...currentItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '/placeholder.jpg',
            selectedSize: selectedSize || 'Default',
            selectedColor: selectedColor || 'Default',
            quantity: 1,
            maxStock: product.stock,
          },
        ];
      }

      return {
        ...state,
        cartItems: newCartItems,
      };
    }

    case 'REMOVE_FROM_CART': {
      const currentItems = Array.isArray(state.cartItems) ? state.cartItems : [];
      const newCartItems = currentItems.filter((_, i) => i !== action.payload);
      return {
        ...state,
        cartItems: newCartItems,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { index, quantity } = action.payload;
      const currentItems = Array.isArray(state.cartItems) ? state.cartItems : [];
      
      if (quantity < 1) {
        const newCartItems = currentItems.filter((_, i) => i !== index);
        return {
          ...state,
          cartItems: newCartItems,
        };
      }

      const updatedItems = [...currentItems];
      const item = updatedItems[index];
      if (item && quantity <= item.maxStock) {
        updatedItems[index].quantity = quantity;
      }
      return {
        ...state,
        cartItems: updatedItems,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isCartOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isCartOpen: false,
      };

    default:
      return state;
  }
}

// Initial state
const initialState = {
  cartItems: [],
  isCartOpen: false,
  isLoaded: false,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isInitialMount = useRef(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'INIT_CART', payload: Array.isArray(parsed) ? parsed : [] });
      } else {
        dispatch({ type: 'INIT_CART', payload: [] });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'INIT_CART', payload: [] });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (state.isLoaded && Array.isArray(state.cartItems)) {
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    }
  }, [state.cartItems, state.isLoaded]);

  // Cart actions
  const addToCart = (product, selectedSize, selectedColor) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, selectedSize, selectedColor },
    });
  };

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const updateQuantity = (index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Computed values - with safety checks
  const getTotalItems = () => {
    const items = Array.isArray(state.cartItems) ? state.cartItems : [];
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    const items = Array.isArray(state.cartItems) ? state.cartItems : [];
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems: Array.isArray(state.cartItems) ? state.cartItems : [],
    isCartOpen: state.isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}