import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialProducts } from '../data/productsData';

const AppContext = createContext();

export const DEFAULT_ACCOUNTS = {
  'gokul.admin@groceryapp.com': {
    id: 'admin_gokul',
    name: 'Gokul',
    email: 'gokul.admin@groceryapp.com',
    password: 'gokul123',
    role: 'Admin',
    phone: '+91 94432 55678',
    address: 'FreshCart Store Hub, Sulur, Coimbatore - 641402',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  'kishore.customer@example.com': {
    id: 'cust_kishore',
    name: 'Kishore',
    email: 'kishore.customer@example.com',
    password: 'kishore123',
    role: 'Customer',
    phone: '+91 97890 12345',
    address: '42/7 Sunrise Apartments, Trichy Road, Sulur, Coimbatore - 641402',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  'madan.customer@example.com': {
    id: 'cust_madan',
    name: 'Madan Kumar',
    email: 'madan.customer@example.com',
    password: 'madan123',
    role: 'Customer',
    phone: '+91 98765 43210',
    address: '14/B Green Garden, RVS College Road, Sulur, Coimbatore - 641402',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  },
};

export const ADMIN_CONFIG = DEFAULT_ACCOUNTS['gokul.admin@groceryapp.com'];

export const AppProvider = ({ children }) => {
  // Accounts Registry
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);

  // User Authentication State (Default: Customer Kishore or Madan)
  const [user, setUser] = useState({
    ...DEFAULT_ACCOUNTS['kishore.customer@example.com'],
    isLoggedIn: true,
  });

  // Grocery Products State (can be modified by Admin or browsed by Customer)
  const [products, setProducts] = useState(initialProducts);

  // Multi-User Cart Persistence (Strictly isolated per user account)
  // Kishore has his own items, Madan has his own items, Gokul (Admin) has his own separate cart
  const [userCarts, setUserCarts] = useState({
    'kishore.customer@example.com': [
      {
        id: '4',
        product: initialProducts[3], // Ooty Carrots
        quantity: 2,
      },
      {
        id: '6',
        product: initialProducts[5], // Sulur Farm Fresh Red Onion
        quantity: 1,
      },
    ],
    'madan.customer@example.com': [
      {
        id: '1',
        product: initialProducts[0], // Ponni Boiled Rice
        quantity: 2,
      },
      {
        id: '5',
        product: initialProducts[4], // Desi Cow A2 Cultured Ghee
        quantity: 1,
      },
    ],
    'gokul.admin@groceryapp.com': [],
  });

  // Multi-User Favourites Persistence (Strictly isolated per user account)
  const [userFavourites, setUserFavourites] = useState({
    'kishore.customer@example.com': ['4', '6'],
    'madan.customer@example.com': ['1', '5'],
    'gokul.admin@groceryapp.com': [],
  });

  // Helper to normalize user key
  const getUserKey = (u) => {
    if (!u) return 'guest';
    const raw = u.email || u.id || 'guest';
    return String(raw).toLowerCase().trim();
  };

  // Active user identifier key
  const currentUserId = getUserKey(user);

  // Active cart for currently logged in user
  const cart = useMemo(() => {
    return userCarts[currentUserId] || [];
  }, [userCarts, currentUserId]);

  // Active favourites for currently logged in user
  const favouriteIds = useMemo(() => {
    return userFavourites[currentUserId] || [];
  }, [userFavourites, currentUserId]);

  // Active Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Search and Category Filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // --- Cart Operations (User-Isolated) ---
  const addToCart = (product, qty = 1) => {
    if (!product) return;
    const activeKey = getUserKey(user);
    setUserCarts((prev) => {
      const userCart = prev[activeKey] || [];
      const existingIndex = userCart.findIndex((item) => item.id === product.id);
      let updated;
      if (existingIndex > -1) {
        updated = [...userCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        showToast(`Updated ${product.name} quantity to ${updated[existingIndex].quantity}`);
      } else {
        showToast(`Added ${product.name} to ${user?.name || 'your'} cart! 🛒`);
        updated = [...userCart, { id: product.id, product, quantity: qty }];
      }
      return {
        ...prev,
        [activeKey]: updated,
      };
    });
  };

  const removeFromCart = (productId) => {
    const activeKey = getUserKey(user);
    setUserCarts((prev) => {
      const userCart = prev[activeKey] || [];
      const item = userCart.find((p) => p.id === productId);
      if (item) {
        showToast(`Removed ${item.product.name} from cart`);
      }
      return {
        ...prev,
        [activeKey]: userCart.filter((item) => item.id !== productId),
      };
    });
  };

  const updateCartQuantity = (productId, delta) => {
    const activeKey = getUserKey(user);
    setUserCarts((prev) => {
      const userCart = prev[activeKey] || [];
      const existing = userCart.find((item) => item.id === productId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      let updated;
      if (newQty <= 0) {
        showToast(`Removed ${existing.product.name} from cart`);
        updated = userCart.filter((item) => item.id !== productId);
      } else {
        updated = userCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQty } : item
        );
      }
      return {
        ...prev,
        [activeKey]: updated,
      };
    });
  };

  const clearCart = () => {
    const activeKey = getUserKey(user);
    setUserCarts((prev) => ({
      ...prev,
      [activeKey]: [],
    }));
    showToast(`${user?.name || 'Active'}'s cart cleared`);
  };

  const applyPromo = (code) => {
    if (code.trim().toUpperCase() === 'FRESH25') {
      setPromoCode('FRESH25');
      setDiscountPercent(25);
      showToast('🎉 Promo code FRESH25 applied! 25% discount');
      return { success: true, message: '25% discount applied!' };
    } else if (code.trim().toUpperCase() === 'FREEDEL') {
      setPromoCode('FREEDEL');
      setDiscountPercent(10);
      showToast('🎉 Promo code FREEDEL applied!');
      return { success: true, message: 'Promo applied!' };
    } else {
      showToast('❌ Invalid promo code. Try "FRESH25"');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 499 ? 0 : 40;
  }, [cartSubtotal, cart.length]);

  const discountAmount = useMemo(() => {
    return (cartSubtotal * discountPercent) / 100;
  }, [cartSubtotal, discountPercent]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const total = cartSubtotal + deliveryFee - discountAmount;
    return total > 0 ? total : 0;
  }, [cartSubtotal, deliveryFee, discountAmount, cart.length]);

  // --- Favourite Operations (Customer Only, User-Isolated) ---
  const isFavourite = (productId) => favouriteIds.includes(productId);

  const toggleFavourite = (product) => {
    if (!product) return;
    if (user?.role !== 'Customer') {
      showToast('⚠️ Add to Favourites is only for Customers! (Active: Admin Gokul)');
      return;
    }
    const activeKey = getUserKey(user);
    setUserFavourites((prev) => {
      const userFavs = prev[activeKey] || [];
      const exists = userFavs.includes(product.id);
      let updated;
      if (exists) {
        showToast(`Removed ${product.name} from favourites`);
        updated = userFavs.filter((id) => id !== product.id);
      } else {
        showToast(`Added ${product.name} to favourites ❤️`);
        updated = [...userFavs, product.id];
      }
      return {
        ...prev,
        [activeKey]: updated,
      };
    });
  };

  const favouriteProducts = useMemo(() => {
    return products.filter((p) => favouriteIds.includes(p.id));
  }, [products, favouriteIds]);

  // --- Profile / Auth Operations ---
  const signIn = (emailOrUsername, password, role = 'Customer') => {
    const raw = (emailOrUsername || '').trim();
    const key = raw.toLowerCase();

    // Check if account already registered
    let account = accounts[key];
    if (!account) {
      // Check by prefix or name match
      const found = Object.values(accounts).find(
        (acc) =>
          acc.email.toLowerCase() === key ||
          acc.name.toLowerCase() === key ||
          acc.email.toLowerCase().startsWith(key)
      );
      if (found) account = found;
    }

    if (!account) {
      // If Admin role selected
      if (role === 'Admin') {
        account = DEFAULT_ACCOUNTS['gokul.admin@groceryapp.com'];
      } else {
        // Create customer profile with the entered name/email
        const namePart = key.includes('@') ? key.split('@')[0] : key;
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const emailFormatted = key.includes('@') ? key : `${key}@customer.freshcart.com`;
        account = {
          id: 'cust_' + Date.now(),
          name: displayName,
          email: emailFormatted,
          password: password || 'pass123',
          phone: '+91 98765 00000',
          address: 'Sulur, Coimbatore - 641402',
          role: 'Customer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        };
        setAccounts((prev) => ({
          ...prev,
          [emailFormatted]: account,
        }));
      }
    }

    const effectiveUser = {
      ...account,
      isLoggedIn: true,
    };
    setUser(effectiveUser);

    // Ensure user has their own cart initialized
    const userKey = getUserKey(effectiveUser);
    setUserCarts((prev) => {
      if (prev[userKey]) return prev;
      return { ...prev, [userKey]: [] };
    });
    setUserFavourites((prev) => {
      if (prev[userKey]) return prev;
      return { ...prev, [userKey]: [] };
    });

    showToast(`Signed in as ${account.name} (${account.role})! ✅`);
  };

  const signUp = (userData) => {
    const normalizedEmail = (userData.email || '').toLowerCase().trim();
    const newAccount = {
      id: 'cust_' + Date.now(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      phone: userData.phone || '+91 98765 00000',
      address: userData.address || 'Sulur, Coimbatore',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };
    setAccounts((prev) => ({
      ...prev,
      [normalizedEmail]: newAccount,
    }));
    setUser({
      ...newAccount,
      isLoggedIn: true,
    });
    // Initialize isolated cart & favourites
    setUserCarts((prev) => ({
      ...prev,
      [normalizedEmail]: [],
    }));
    setUserFavourites((prev) => ({
      ...prev,
      [normalizedEmail]: [],
    }));
    showToast(`Welcome ${userData.name}! Your private customer cart is ready.`);
  };

  const switchUser = (accountEmailOrKey) => {
    const key = (accountEmailOrKey || '').toLowerCase().trim();
    const target = accounts[key] || Object.values(accounts).find(
      (a) => a.email.toLowerCase() === key || a.name.toLowerCase() === key
    );
    if (target) {
      setUser({
        ...target,
        isLoggedIn: true,
      });
      showToast(`Switched active user to ${target.name} (${target.role}) 👤`);
    }
  };

  const switchRole = (newRole) => {
    if (newRole === 'Admin') {
      switchUser('gokul.admin@groceryapp.com');
    } else {
      // Switch to Kishore
      switchUser('kishore.customer@example.com');
    }
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        ...updatedData,
      };
      if (updated.email) {
        setAccounts((accs) => ({
          ...accs,
          [updated.email.toLowerCase()]: updated,
        }));
      }
      return updated;
    });
    showToast('Profile updated successfully! ✅');
  };

  const signOut = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    showToast('Signed out successfully');
  };

  // --- Admin Product Management Operations ---
  const addProduct = (newProd) => {
    const productToAdd = {
      ...newProd,
      id: String(Date.now()),
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
    };
    setProducts((prev) => [productToAdd, ...prev]);
    showToast(`New grocery product "${newProd.name}" added!`);
  };

  const updateProductStock = (productId, newCount) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockCount: Math.max(0, newCount), inStock: newCount > 0 } : p
      )
    );
    showToast('Stock quantity updated');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchRole,
        switchUser,
        accounts,
        DEFAULT_ACCOUNTS,
        products,
        addProduct,
        updateProductStock,
        favourites: favouriteProducts,
        favouriteIds,
        isFavourite,
        toggleFavourite,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        deliveryFee,
        discountAmount,
        grandTotal,
        promoCode,
        discountPercent,
        applyPromo,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
