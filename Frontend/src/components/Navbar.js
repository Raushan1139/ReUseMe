import { state } from '../state.js';
import { popularLocations } from '../data/products.js';

export function Navbar(activePath = '') {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors duration-300';
  
  const wishlistCount = state.wishlist.length;
  const user = state.currentUser;
  const isDark = state.darkMode;
  
  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        <!-- Logo and Brand -->
        <a href="#/" class="flex items-center gap-2 group shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition duration-200">
            <i data-lucide="recycle" class="w-6 h-6 animate-spin-slow"></i>
          </div>
          <span class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent group-hover:opacity-90 transition">ReUseHub</span>
        </a>

        <!-- Search Bar & Location Container (Desktop/Tablet) -->
        <div class="hidden md:flex flex-grow max-w-2xl relative mx-4 items-center gap-2" id="desktop-search-container">
          
          <!-- Location Picker (OLX Style) -->
          <div class="relative shrink-0 w-44">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <i data-lucide="map-pin" class="w-4 h-4"></i>
            </span>
            <select 
              id="nav-location-select" 
              class="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              ${popularLocations.map(loc => `
                <option value="${loc}" ${state.filters.location === loc ? 'selected' : ''}>${loc.split(',')[0]}</option>
              `).join('')}
            </select>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-450">
              <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </span>
          </div>

          <!-- Keyword Search -->
          <div class="relative flex-grow">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <i data-lucide="search" class="w-4 h-4"></i>
            </span>
            <input 
              type="text" 
              id="nav-search-input"
              value="${state.filters.search || ''}"
              placeholder="Search items, electronics, furniture..." 
              class="w-full pl-10 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:bg-white dark:focus:bg-slate-800 transition duration-150"
            />
            <button id="clear-search-btn" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hidden">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Live Suggestions Popover -->
          <div id="search-suggestions" class="absolute top-full left-48 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 hidden animate-fade-in glass">
          </div>
        </div>

        <!-- Right Side Nav Actions -->
        <div class="flex items-center gap-1 sm:gap-3">
          <!-- Messages Box (Directly on Navbar) -->
          ${user ? `
            <a href="#/chat" id="nav-messages-btn" class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white relative transition duration-150" aria-label="Messages">
              <i data-lucide="message-square" class="w-5 h-5"></i>
              <span id="nav-messages-badge" class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 flex items-center justify-center ${state.unreadMessagesCount > 0 ? '' : 'hidden'}">
                ${state.unreadMessagesCount}
              </span>
            </a>
          ` : ''}

          <!-- Dark Mode Toggle -->
          <button id="theme-toggle" class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition duration-150" aria-label="Toggle theme">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
          </button>

          <!-- Wishlist -->
          <a href="#/wishlist" class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white relative transition duration-150" aria-label="Wishlist">
            <i data-lucide="heart" class="w-5 h-5 ${activePath === '/wishlist' ? 'fill-red-500 text-red-500' : ''}"></i>
            ${wishlistCount > 0 ? `
              <span class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                ${wishlistCount}
              </span>
            ` : ''}
          </a>

          <!-- Sell Button (Desktop) -->
          <a href="#/sell" class="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-150">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Sell Item</span>
          </a>

          <!-- Profile / Auth Actions -->
          <div class="relative" id="profile-menu-container">
            ${user ? `
              <button id="profile-dropdown-btn" class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-150">
                <img src="${user.avatar}" alt="${user.username}" class="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 dark:border-emerald-800" />
                <span class="hidden lg:block text-sm font-semibold text-slate-700 dark:text-slate-200">${user.username}</span>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 hidden lg:block text-slate-500"></i>
              </button>
              
              <!-- Dropdown Menu -->
              <div id="profile-dropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 hidden glass">
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                  <p class="text-sm font-bold truncate text-slate-800 dark:text-slate-100">${user.username}</p>
                </div>
                <a href="#/profile" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition">
                  <i data-lucide="user" class="w-4 h-4 text-slate-400"></i> My Profile
                </a>
                <a href="#/wishlist" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition">
                  <i data-lucide="heart" class="w-4 h-4 text-slate-400"></i> My Wishlist
                </a>
                <a href="#/sell" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition sm:hidden">
                  <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400"></i> Sell Item
                </a>
                <hr class="border-slate-100 dark:border-slate-800" />
                <button id="logout-btn" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition">
                  <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
                </button>
              </div>
            ` : `
              <div class="flex items-center gap-1 sm:gap-2">
                <a href="#/login" class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition">Log In</a>
                <a href="#/register" class="hidden lg:inline-flex px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition">Register</a>
              </div>
            `}
          </div>

          <!-- Mobile Hamburger Menu Toggle -->
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition" aria-label="Toggle mobile menu">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div id="mobile-menu-drawer" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden transition-opacity duration-300 opacity-0 pointer-events-none">
      <div class="absolute top-0 right-0 w-80 max-w-full bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between transform translate-x-full transition-transform duration-300">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <i data-lucide="recycle" class="w-5 h-5"></i>
              </div>
              <span class="text-lg font-bold text-slate-900 dark:text-white">ReUseHub</span>
            </div>
            <button id="mobile-menu-close" class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Mobile Search -->
          <div class="mt-6 relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i data-lucide="search" class="w-4 h-4"></i>
            </span>
            <input 
              type="text" 
              id="mobile-search-input"
              value="${state.filters.search || ''}"
              placeholder="Search items..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            />
          </div>

          <!-- Mobile Location select -->
          <div class="mt-4 relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <i data-lucide="map-pin" class="w-4 h-4"></i>
            </span>
            <select 
              id="mobile-location-select" 
              class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              ${popularLocations.map(loc => `
                <option value="${loc}" ${state.filters.location === loc ? 'selected' : ''}>${loc.split(',')[0]}</option>
              `).join('')}
            </select>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-450">
              <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </span>
          </div>

          <!-- Quick Navigation Links -->
          <nav class="mt-8 flex flex-col gap-1">
            <a href="#/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition ${activePath === '/' || activePath === '' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}">
              <i data-lucide="home" class="w-5 h-5"></i> Home
            </a>
            <a href="#/wishlist" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition ${activePath === '/wishlist' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}">
              <i data-lucide="heart" class="w-5 h-5"></i> Wishlist
            </a>
            <a href="#/sell" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition ${activePath === '/sell' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}">
              <i data-lucide="plus-circle" class="w-5 h-5"></i> Sell Item
            </a>
            ${user ? `
              <a href="#/chat" class="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition ${activePath === '/chat' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}">
                <span class="flex items-center gap-3">
                  <i data-lucide="message-square" class="w-5 h-5"></i> Messages
                </span>
                <span id="mobile-nav-messages-badge" class="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white ${state.unreadMessagesCount > 0 ? '' : 'hidden'}">
                  ${state.unreadMessagesCount}
                </span>
              </a>
              <a href="#/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition ${activePath === '/profile' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}">
                <i data-lucide="user" class="w-5 h-5"></i> My Profile
              </a>
            ` : `
              <a href="#/login" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition">
                <i data-lucide="log-in" class="w-5 h-5"></i> Log In
              </a>
              <a href="#/register" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition">
                <i data-lucide="user-plus" class="w-5 h-5"></i> Register
              </a>
            `}
          </nav>
        </div>

        <!-- Footer inside drawer -->
        <div class="pt-6 border-t border-slate-100 dark:border-slate-800">
          ${user ? `
            <div class="flex items-center gap-3 mb-4">
              <img src="${user.avatar}" alt="${user.username}" class="w-10 h-10 rounded-lg bg-emerald-100" />
              <div>
                <p class="font-bold text-sm text-slate-800 dark:text-slate-100">${user.username}</p>
                <p class="text-xs text-slate-500">${user.email}</p>
              </div>
            </div>
            <button id="mobile-logout-btn" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold transition">
              <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
            </button>
          ` : `
            <p class="text-xs text-center text-slate-400 dark:text-slate-550 mb-2">Buy & sell used items easily.</p>
          `}
        </div>
      </div>
    </div>
  `;
  
  // Handlers and Event Listeners
  
  // Theme toggle
  const themeToggle = header.querySelector('#theme-toggle');
  themeToggle.addEventListener('click', () => {
    state.toggleDarkMode();
  });
  
  // Profile Dropdown
  const profileDropdownBtn = header.querySelector('#profile-dropdown-btn');
  const profileDropdown = header.querySelector('#profile-dropdown');
  if (profileDropdownBtn && profileDropdown) {
    profileDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!profileDropdown.classList.contains('hidden') && !profileDropdownBtn.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }

  // Logout actions
  const logoutBtn = header.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.logout();
      window.location.hash = '#/';
    });
  }

  const mobileLogoutBtn = header.querySelector('#mobile-logout-btn');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', () => {
      state.logout();
      window.location.hash = '#/';
    });
  }

  // Mobile drawer logic
  const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
  const mobileMenuDrawer = header.querySelector('#mobile-menu-drawer');
  const mobileMenuClose = header.querySelector('#mobile-menu-close');
  const drawerContainer = mobileMenuDrawer.querySelector('.absolute');
  
  const openDrawer = () => {
    mobileMenuDrawer.classList.remove('hidden');
    mobileMenuDrawer.offsetHeight;
    mobileMenuDrawer.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenuDrawer.classList.add('opacity-100', 'pointer-events-auto');
    drawerContainer.classList.remove('translate-x-full');
    drawerContainer.classList.add('translate-x-0');
  };
  
  const closeDrawer = () => {
    mobileMenuDrawer.classList.remove('opacity-100', 'pointer-events-auto');
    mobileMenuDrawer.classList.add('opacity-0', 'pointer-events-none');
    drawerContainer.classList.remove('translate-x-0');
    drawerContainer.classList.add('translate-x-full');
    setTimeout(() => {
      mobileMenuDrawer.classList.add('hidden');
    }, 300);
  };
  
  mobileMenuBtn.addEventListener('click', openDrawer);
  mobileMenuClose.addEventListener('click', closeDrawer);
  mobileMenuDrawer.addEventListener('click', (e) => {
    if (e.target === mobileMenuDrawer) closeDrawer();
  });

  // Search input processing (Live suggestions and Filtering)
  const navSearchInput = header.querySelector('#nav-search-input');
  const navLocationSelect = header.querySelector('#nav-location-select');
  const clearSearchBtn = header.querySelector('#clear-search-btn');
  const suggestionsBox = header.querySelector('#search-suggestions');
  const mobileSearchInput = header.querySelector('#mobile-search-input');

  const checkClearBtn = (val) => {
    if (val) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
  };

  // Location selector change handler
  if (navLocationSelect) {
    navLocationSelect.addEventListener('change', async (e) => {
      if (e.target.value === "Use Current Location") {
        await state.detectLocationAndFetch();
        state.setFilters({ location: "" });
      } else {
        state.setFilters({ location: e.target.value });
      }
      if (window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
    });
  }

  if (navSearchInput) {
    checkClearBtn(navSearchInput.value);

    // Dynamic suggestions logic
    navSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      checkClearBtn(e.target.value);
      
      if (!val) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.classList.add('hidden');
        return;
      }
      
      const matches = state.products.filter(p => 
        p.title.toLowerCase().includes(val) || 
        p.category.toLowerCase().includes(val)
      ).slice(0, 5); // Max 5 suggestions
      
      if (matches.length === 0) {
        suggestionsBox.innerHTML = `
          <div class="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 text-center">
            No matches found for "${val}"
          </div>
        `;
      } else {
        suggestionsBox.innerHTML = matches.map(prod => `
          <a href="#/product/${prod.id}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-left select-item-suggestion">
            <img src="${prod.images[0]}" alt="${prod.title}" class="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
            <div class="flex-grow truncate">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">${prod.title}</p>
              <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">$${prod.price}</span>
                <span>•</span>
                <span>${prod.category}</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          </a>
        `).join('');
        
        // Render lucide icons inside suggestions box
        if (window.lucide) {
          window.lucide.createIcons({
            attrs: { class: 'lucide' },
            nameAttr: 'data-lucide'
          });
        }
      }
      
      suggestionsBox.classList.remove('hidden');
    });

    // Close suggestions dropdown on click outside
    document.addEventListener('click', (e) => {
      if (suggestionsBox && !suggestionsBox.classList.contains('hidden') && !header.querySelector('#desktop-search-container').contains(e.target)) {
        suggestionsBox.classList.add('hidden');
      }
    });

    // Enter key search
    navSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim();
        state.setFilters({ search: val });
        suggestionsBox.classList.add('hidden');
        if (window.location.hash !== '#/') {
          window.location.hash = '#/';
        }
      }
    });

    // Clear search
    clearSearchBtn.addEventListener('click', () => {
      navSearchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      suggestionsBox.classList.add('hidden');
      state.setFilters({ search: '' });
      if (window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
    });
  }

  // Mobile search enter press
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim();
        state.setFilters({ search: val });
        closeDrawer();
        if (window.location.hash !== '#/') {
          window.location.hash = '#/';
        }
      }
    });
  }

  // Mobile location select listener
  const mobileLocationSelect = header.querySelector('#mobile-location-select');
  if (mobileLocationSelect) {
    mobileLocationSelect.addEventListener('change', async (e) => {
      if (e.target.value === "Use Current Location") {
        await state.detectLocationAndFetch();
        state.setFilters({ location: "" });
      } else {
        state.setFilters({ location: e.target.value });
      }
      closeDrawer();
      if (window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
    });
  }

  return header;
}
