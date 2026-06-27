import { state } from './state.js';
import { Home } from './pages/Home.jsx';
import { ProductDetails } from './pages/ProductDetails.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { SellItem } from './pages/SellItem.jsx';
import { Wishlist } from './pages/Wishlist.jsx';
import { Profile } from './pages/Profile.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { ResetPassword } from './pages/ResetPassword.jsx';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

const routes = [
  { path: /^\/?$/, page: Home },
  { path: /^\/product\/([^/]+)$/, page: ProductDetails, paramName: 'productId' },
  { path: /^\/login$/, page: Login },
  { path: /^\/register$/, page: Register },
  { path: /^\/sell$/, page: SellItem },
  { path: /^\/edit\/([^/]+)$/, page: SellItem, paramName: 'editProductId' },
  { path: /^\/wishlist$/, page: Wishlist },
  { path: /^\/profile$/, page: Profile },
  { path: /^\/forgot-password$/, page: ForgotPassword },
  { path: /^\/reset-password$/, page: ResetPassword }
];

export function initRouter() {
  const app = document.getElementById('app');
  let currentNavbar = null;
  let currentFooter = null;
  let activePageName = '';

  const handleRoute = () => {
    const rawHash = window.location.hash || '#/';
    const path = rawHash.slice(1); // Remove '#'
    
    // Clean query params if any
    const cleanPath = path.split('?')[0];

    // Find matching route
    let match = null;
    let params = {};
    
    for (const route of routes) {
      const matchResult = cleanPath.match(route.path);
      if (matchResult) {
        match = route;
        if (route.paramName && matchResult[1]) {
          params[route.paramName] = matchResult[1];
        }
        break;
      }
    }
    
    // Redirect if viewing details and not logged in
    if (match && match.page === ProductDetails && !state.currentUser) {
      state.showToast("Please log in to view product details.", "info");
      window.location.hash = '#/login';
      return;
    }
    
    // Clear page contents
    app.innerHTML = '';
    
    // Render Navbar (only re-create if needed or always to keep state fresh)
    currentNavbar = Navbar(cleanPath);
    app.appendChild(currentNavbar);
    
    // Render Page Container
    const main = document.createElement('main');
    main.className = 'flex-grow animate-fade-in pb-16 w-full';
    
    if (match) {
      const pageElement = match.page(params);
      main.appendChild(pageElement);
    } else {
      // 404 page
      main.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div class="p-4 bg-red-50 text-red-500 rounded-full dark:bg-red-950/30 dark:text-red-400 mb-6">
            <i data-lucide="alert-triangle" class="w-12 h-12"></i>
          </div>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
          <p class="text-slate-600 dark:text-slate-400 max-w-md mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <a href="#/" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition duration-200">
            Back to Home
          </a>
        </div>
      `;
    }
    app.appendChild(main);
    
    // Render Footer
    currentFooter = Footer();
    app.appendChild(currentFooter);
    
    // Initialize icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
  window.addEventListener('hashchange', () => {
    state._lastViewedProductId = null;
    handleRoute();
  });
  
  // Call once on init
  handleRoute();
  
  // Return re-render function
  return handleRoute;
}
