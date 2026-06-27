import { state, subscribe } from './state.js';
import { initRouter } from './router.js';
import { Toast } from './components/Toast.js';

// Initialize dark/light theme on root html element and fetch data
state.init();

// Start the client-side router
const handleRoute = initRouter();

// Listen to state changes to update Navbar/UI elements
subscribe(() => {
  // We can re-trigger routing updates to redraw pages like Wishlist/Navbar
  // but to avoid losing input focus, we only do this for specific changes.
  // For simplicity, a full redraw on hashchange works, but sub-draw is even better.
  // For most page updates, redraw keeps layout accurate.
  const activeHash = window.location.hash;
  
  // Re-run router draw if we are on wishlist or profile or landing page updates.
  // But we skip if user is typing (which has activeElement of type input)
  const isTyping = document.activeElement && 
                   (document.activeElement.tagName === 'INPUT' || 
                    document.activeElement.tagName === 'TEXTAREA');
  
  if (!isTyping) {
    handleRoute();
  }
});

// Setup toast notifications system
const toastContainer = document.getElementById('toast-container');
import { subscribeToToasts } from './state.js';

subscribeToToasts((message, type) => {
  const toast = Toast(message, type);
  toastContainer.appendChild(toast);
});
