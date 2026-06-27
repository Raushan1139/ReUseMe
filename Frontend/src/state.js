import { getUserLocation } from './utils/location.js';

const API_URL = 'http://localhost:3001/api';

// Init state variables
let darkMode = localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

let currentUser = null;
try {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.error("Failed to parse user session", e);
}

let wishlist = [];
try {
  const savedWishlist = localStorage.getItem('wishlist');
  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist);
  }
} catch (e) {
  console.error("Failed to parse wishlist", e);
}

let userCoordinates = null;
let products = [];

// Active filters
let filters = {
  search: '',
  category: '',
  location: '',
  minPrice: null,
  maxPrice: null,
  condition: ''
};

// Event listeners for state changes
const listeners = new Set();

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const notify = () => {
  listeners.forEach(fn => fn());
};

// Toast listeners
const toastListeners = new Set();
export const subscribeToToasts = (listener) => {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
};

// Helper for making authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// App Actions
export const state = {
  _lastViewedProductId: null,

  get userCoordinates() { return userCoordinates; },
  set userCoordinates(val) { userCoordinates = val; },

  async detectLocationAndFetch() {
    try {
      const location = await getUserLocation();
      userCoordinates = location;
      
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_URL}/auth/location`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude
          })
        }).catch(err => console.warn("Failed to sync location to backend:", err));
      }
    } catch (e) {
      console.warn("Location prompt denied or failed:", e);
    }
    await this.fetchProducts();
  },

  // Initialize state
  async init() {
    this.initTheme();

    // Request location dynamically and fetch products
    await this.detectLocationAndFetch();

    // Check token and validate with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          currentUser = await res.json();
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          // Fetch backend wishlist
          const wishRes = await fetch(`${API_URL}/auth/wishlist`, {
            headers: getAuthHeaders()
          });
          if (wishRes.ok) {
            const wishData = await wishRes.json();
            wishlist = wishData.map(p => p.id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
          }
        } else {
          // Token is expired/invalid
          this.clearSession();
        }
      } catch (e) {
        console.warn("Session sync failed, using cached session:", e);
      }
    }
    notify();
  },

  clearSession() {
    currentUser = null;
    wishlist = [];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('wishlist');
  },

  // Theme Manager
  get darkMode() { return darkMode; },
  toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notify();
    this.showToast(`${darkMode ? 'Dark' : 'Light'} mode enabled!`, 'info');
  },
  
  // Apply initial theme
  initTheme() {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // API URL
  get API_URL() { return API_URL; },

  // Auth User
  get currentUser() { return currentUser; },
  
  async login(email, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Fetch wishlist items
        const wishRes = await fetch(`${API_URL}/auth/wishlist`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          wishlist = wishData.map(p => p.id);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        // Request location and reload products sorted by distance
        await this.detectLocationAndFetch();

        notify();
        this.showToast(`Welcome back, ${currentUser.username}!`, 'success');
        return true;
      } else {
        this.showToast(data.message || "Invalid credentials", 'error');
        return false;
      }
    } catch (e) {
      console.error("Authentication server offline:", e);
      this.showToast("Cannot connect to server. Please check if the backend is running.", 'error');
      return false;
    }
  },

  async register(username, email, password) {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();

      if (res.ok) {
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Request location and reload products sorted by distance
        await this.detectLocationAndFetch();

        notify();
        this.showToast(`Account created! Welcome, ${currentUser.username}!`, 'success');
        return true;
      } else {
        this.showToast(data.message || "Registration failed", 'error');
        return false;
      }
    } catch (e) {
      console.error("Authentication server offline:", e);
      this.showToast("Cannot connect to server. Please check if the backend is running.", 'error');
      return false;
    }
  },

  logout() {
    this.showToast(`Goodbye, ${currentUser?.username || 'user'}!`, 'info');
    this.clearSession();
    notify();
  },

  async updateProfile(profileData) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showToast("Please sign in to update your profile.", 'error');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();

      if (res.ok) {
        currentUser = {
          ...currentUser,
          username: data.username,
          email: data.email,
          phone: data.phone,
          city: data.city
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        notify();
        this.showToast("Profile settings updated successfully!", 'success');
        return true;
      } else {
        this.showToast(data.message || "Failed to update profile", 'error');
        return false;
      }
    } catch (e) {
      console.error("Profile update failed:", e);
      this.showToast("Cannot connect to server. Please check your connection.", 'error');
      return false;
    }
  },

  // Wishlist Manager
  get wishlist() { return wishlist; },
  isWishlisted(productId) {
    return wishlist.includes(productId);
  },
  async toggleWishlist(productId) {
    const token = localStorage.getItem('token');
    const prod = this.getProductById(productId);
    if (!prod) return;

    if (!token) {
      this.showToast("Please sign in to add items to your wishlist.", 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/wishlist/toggle/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        wishlist = data.wishlist;
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        notify();
        this.showToast(
          data.isAdded 
            ? `Added "${prod.title}" to wishlist` 
            : `Removed "${prod.title}" from wishlist`,
          data.isAdded ? 'success' : 'info'
        );
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.message || `Server error (${res.status})`;
        this.showToast(`Failed to update wishlist: ${errorMsg}`, 'error');
      }
    } catch (e) {
      console.error("Backend wishlist toggle failed:", e);
      this.showToast("Failed to update wishlist. Server is unreachable.", 'error');
    }
  },
  async clearWishlist() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showToast("Please sign in to manage your wishlist.", 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/wishlist`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        notify();
        this.showToast("Wishlist cleared", "info");
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.message || `Server error (${res.status})`;
        this.showToast(`Failed to clear wishlist: ${errorMsg}`, 'error');
      }
    } catch (e) {
      console.error("Backend wishlist clear failed:", e);
      this.showToast("Failed to clear wishlist. Server is unreachable.", 'error');
    }
  },

  // Products Manager
  get products() {
    return products;
  },
  async fetchUserListings() {
    const token = localStorage.getItem('token');
    if (!token || !currentUser) return [];

    try {
      const res = await fetch(`${API_URL}/products?seller=${currentUser._id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to fetch user listings from server:", e);
    }
    return [];
  },
  async markProductAsSold(productId) {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'sold' })
      });
      if (res.ok) {
        this.showToast("Product marked as sold successfully!", "success");
        await this.fetchProducts();
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        this.showToast(data.message || "Failed to update product status", "error");
        return false;
      }
    } catch (e) {
      console.error("Failed to mark product as sold:", e);
      this.showToast("Server unreachable", "error");
      return false;
    }
  },
  async deleteProduct(productId) {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        this.showToast("Product listing deleted successfully!", "success");
        await this.fetchProducts();
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        this.showToast(data.message || "Failed to delete product", "error");
        return false;
      }
    } catch (e) {
      console.error("Failed to delete product:", e);
      this.showToast("Server unreachable", "error");
      return false;
    }
  },
  getProductById(id) {
    return products.find(p => p.id === id);
  },
  async viewProduct(productId) {
    if (this._lastViewedProductId === productId) {
      return;
    }
    this._lastViewedProductId = productId;

    try {
      // Get fresh details and increment views on server
      const res = await fetch(`${API_URL}/products/${productId}`);
      if (res.ok) {
        const freshProduct = await res.json();
        const index = products.findIndex(p => p.id === productId);
        if (index > -1) {
          products[index] = freshProduct;
        } else {
          products.push(freshProduct);
        }
        notify();
      }
    } catch (e) {
      console.warn("Failed to fetch product details from server:", e);
    }
  },
  async addProduct(productData) {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();

      if (res.ok) {
        // Sync and add
        await this.fetchProducts();
        this.showToast(`"${data.title}" listed successfully!`, 'success');
        return data.id; // Returns database generated ID
      } else {
        this.showToast(data.message || "Failed to create listing", 'error');
        return null;
      }
    } catch (e) {
      console.error("Server offline, failed to list product:", e);
      this.showToast("Cannot connect to server. Please check if the backend is running.", 'error');
      return null;
    }
  },
  async updateProduct(productId, productData) {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();

      if (res.ok) {
        // Sync and refresh
        await this.fetchProducts();
        this.showToast(`"${data.title}" updated successfully!`, 'success');
        return true;
      } else {
        this.showToast(data.message || "Failed to save modifications", 'error');
        return false;
      }
    } catch (e) {
      console.error("Server offline, failed to update product:", e);
      this.showToast("Cannot connect to server. Please check your connection.", 'error');
      return false;
    }
  },
  async forgotPassword(email) {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        this.showToast(data.message || "Password reset link sent!", "success");
        return true;
      } else {
        this.showToast(data.message || "Failed to request password reset", "error");
        return false;
      }
    } catch (e) {
      console.error("ForgotPassword request failed:", e);
      this.showToast("Cannot connect to server", "error");
      return false;
    }
  },
  async resetPassword(token, password) {
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        this.showToast(data.message || "Password reset successfully!", "success");
        return true;
      } else {
        this.showToast(data.message || "Failed to reset password", "error");
        return false;
      }
    } catch (e) {
      console.error("ResetPassword request failed:", e);
      this.showToast("Cannot connect to server", "error");
      return false;
    }
  },

  async fetchProducts() {
    try {
      // Build query parameters based on active filters
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.condition) queryParams.append('condition', filters.condition);
      if (filters.minPrice !== null && filters.minPrice !== '') {
        queryParams.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice !== null && filters.maxPrice !== '') {
        queryParams.append('maxPrice', filters.maxPrice);
      }

      if (userCoordinates) {
        queryParams.append('latitude', userCoordinates.latitude);
        queryParams.append('longitude', userCoordinates.longitude);
      }

      const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
      if (res.ok) {
        products = await res.json();
        notify();
      } else {
        console.warn("Backend products fetch failed.");
        products = [];
        notify();
      }
    } catch (e) {
      console.warn("Backend connection failed.", e);
      products = [];
      notify();
    }
  },

  // Filters Manager
  get filters() { return filters; },
  async setFilters(newFilters) {
    filters = { ...filters, ...newFilters };
    // Immediately fetch filtered products
    await this.fetchProducts();
  },
  async resetFilters() {
    filters = {
      search: '',
      category: '',
      location: '',
      minPrice: null,
      maxPrice: null,
      condition: ''
    };
    // Fetch reset products
    await this.fetchProducts();
  },

  // Toast Dispatcher
  showToast(message, type = 'success') {
    toastListeners.forEach(fn => fn(message, type));
  }
};
