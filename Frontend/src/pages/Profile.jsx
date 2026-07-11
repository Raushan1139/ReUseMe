import { state } from '../state.js';
import { ProductCard } from '../components/ProductCard.js';

export function Profile() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6';

  const user = state.currentUser;

  // Protect route with beautiful prompt
  if (!user) {
    container.className = 'max-w-md mx-auto my-16 px-4';
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full mb-6">
          <i data-lucide="lock" class="w-12 h-12"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
          You need to be signed in to access your user profile, manage active listings, and change settings.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <a href="#/login" class="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl text-center shadow-lg shadow-emerald-500/10 transition duration-150">
            Sign In
          </a>
          <a href="#/" class="flex-grow py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl text-center transition">
            Back to Home
          </a>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
    }, 10);
    
    return container;
  }

  let userListings = [];
  let isLoadingProds = true;
  let activeTab = 'active';

  const loadListings = async () => {
    isLoadingProds = true;
    drawProfile();
    userListings = await state.fetchUserListings();
    isLoadingProds = false;
    drawProfile();
  };

  const drawProfile = () => {
    const activeProds = userListings.filter(p => p.status === 'active');
    const soldProds = userListings.filter(p => p.status === 'sold');

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar: User Details Info -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center text-center">
            <div class="relative mb-4">
              <img src="${user.avatar}" alt="${user.username}" class="w-24 h-24 rounded-2xl bg-emerald-100 border-2 border-emerald-500 shadow-md" />
              <div class="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
              </div>
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">${user.username}</h2>
            <p class="text-xs text-slate-505 dark:text-slate-400 mt-0.5">Member since ${user.joined}</p>
            
            <div class="flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-150 dark:border-emerald-900/30">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-400">${user.rating.toFixed(1)} Seller Rating</span>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div class="text-center">
                <p class="text-lg font-black text-slate-900 dark:text-white">${isLoadingProds ? '...' : activeProds.length}</p>
                <p class="text-xs text-slate-450 dark:text-slate-505 font-medium">Active Listings</p>
              </div>
              <div class="text-center border-l border-slate-100 dark:border-slate-800">
                <p class="text-lg font-black text-slate-900 dark:text-white">${isLoadingProds ? '...' : soldProds.length}</p>
                <p class="text-xs text-slate-450 dark:text-slate-505 font-medium">Items Sold</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area: Tabs -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="border-b border-slate-200 dark:border-slate-800 flex justify-between items-end pb-0.5 gap-4">
            <div class="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-0.5">
              <button 
                id="tab-active-btn" 
                class="pb-4 font-bold text-sm border-b-2 transition whitespace-nowrap ${activeTab === 'active' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}"
              >
                Active Listings (${isLoadingProds ? '...' : activeProds.length})
              </button>
              <button 
                id="tab-sold-btn" 
                class="pb-4 font-bold text-sm border-b-2 transition whitespace-nowrap ${activeTab === 'sold' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}"
              >
                Sold Listings (${isLoadingProds ? '...' : soldProds.length})
              </button>
              <button 
                id="tab-settings-btn" 
                class="pb-4 font-bold text-sm border-b-2 transition whitespace-nowrap ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}"
              >
                Account Settings
              </button>
            </div>
            
            <a href="#/sell" class="mb-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition flex-shrink-0 shadow-md shadow-emerald-500/10">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              Sell Item
            </a>
          </div>

          <div id="tab-content" class="w-full">
            <!-- Dynamic tab renderer -->
            ${isLoadingProds ? `
              <div class="text-center py-16">
                <p class="text-sm text-slate-500 animate-pulse">Loading products...</p>
              </div>
            ` : `
              ${activeTab === 'active' ? `
                ${activeProds.length === 0 ? `
                  <div class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center">
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-full mb-4">
                      <i data-lucide="package-open" class="w-12 h-12 text-slate-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-850 dark:text-white">No active listings</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">Earn cash by listing items you no longer use. It takes less than a minute!</p>
                    <a href="#/sell" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition">
                      List Your First Item
                    </a>
                  </div>
                ` : `
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="user-products-grid">
                    <!-- Product cards will be injected -->
                  </div>
                `}
              ` : ''}

              ${activeTab === 'sold' ? `
                ${soldProds.length === 0 ? `
                  <div class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center">
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-full mb-4">
                      <i data-lucide="check-circle-2" class="w-12 h-12 text-slate-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-850 dark:text-white">No sold items yet</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">When you mark active items as sold, they will appear here to show your seller history.</p>
                  </div>
                ` : `
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="user-sold-grid">
                    <!-- Sold product cards will be injected -->
                  </div>
                `}
              ` : ''}
            `}

            ${activeTab === 'settings' ? `
              <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Update Profile Information</h3>
                
                <form id="settings-form" class="flex flex-col gap-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Username</label>
                      <input 
                        type="text" 
                        id="set-username" 
                        value="${user.username}" 
                        required 
                        class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="set-email" 
                        value="${user.email}" 
                        required 
                        class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        id="set-phone" 
                        value="${user.phone || ''}" 
                        class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Location</label>
                      <input 
                        type="text" 
                        id="set-location" 
                        value="${user.city || ''}" 
                        class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    class="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition duration-150 mt-4 max-w-xs cursor-pointer"
                  >
                    Save Modifications
                  </button>
                </form>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Wire up tab button event listeners
    const tabActiveBtn = container.querySelector('#tab-active-btn');
    const tabSoldBtn = container.querySelector('#tab-sold-btn');
    const tabSettingsBtn = container.querySelector('#tab-settings-btn');

    if (tabActiveBtn) {
      tabActiveBtn.addEventListener('click', () => {
        activeTab = 'active';
        drawProfile();
      });
    }
    if (tabSoldBtn) {
      tabSoldBtn.addEventListener('click', () => {
        activeTab = 'sold';
        drawProfile();
      });
    }
    if (tabSettingsBtn) {
      tabSettingsBtn.addEventListener('click', () => {
        activeTab = 'settings';
        drawProfile();
      });
    }

    // Render active products with action buttons wrapper
    if (!isLoadingProds && activeTab === 'active' && activeProds.length > 0) {
      const grid = container.querySelector('#user-products-grid');
      if (grid) {
        grid.innerHTML = '';
        activeProds.forEach(prod => {
          const cardWrapper = document.createElement('div');
          cardWrapper.className = 'flex flex-col border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm';

          const card = ProductCard(prod);
          card.className = 'group relative flex flex-col justify-between h-full bg-transparent border-0 rounded-none shadow-none cursor-pointer';

          const actionArea = document.createElement('div');
          actionArea.className = 'p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2.5';
          actionArea.innerHTML = `
            <button 
              class="flex-grow py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer mark-sold-btn"
              data-id="${prod.id}"
            >
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Mark as Sold
            </button>
            <button 
              class="px-3.5 py-2 bg-red-50 hover:bg-red-150 text-red-950 font-bold text-xs rounded-xl border border-red-200 dark:border-red-950/30 transition flex items-center justify-center gap-1 cursor-pointer delete-listing-btn"
              data-id="${prod.id}"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          `;

          cardWrapper.appendChild(card);
          cardWrapper.appendChild(actionArea);

          const soldBtn = actionArea.querySelector('.mark-sold-btn');
          soldBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const success = await state.markProductAsSold(prod.id);
            if (success) {
              loadListings();
            }
          });

          const deleteBtn = actionArea.querySelector('.delete-listing-btn');
          deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${prod.title}"? This cannot be undone.`)) {
              const success = await state.deleteProduct(prod.id);
              if (success) {
                loadListings();
              }
            }
          });

          grid.appendChild(cardWrapper);
        });
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // Render sold products
    if (!isLoadingProds && activeTab === 'sold' && soldProds.length > 0) {
      const grid = container.querySelector('#user-sold-grid');
      if (grid) {
        grid.innerHTML = '';
        soldProds.forEach(prod => {
          const cardWrapper = document.createElement('div');
          cardWrapper.className = 'flex flex-col border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm opacity-75 relative group';

          const card = ProductCard(prod);
          card.className = 'group relative flex flex-col justify-between h-full bg-transparent border-0 rounded-none shadow-none cursor-pointer';

          const soldBadge = document.createElement('div');
          soldBadge.className = 'absolute top-3 right-3 px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg bg-red-500 text-white shadow-sm z-10';
          soldBadge.innerText = 'Sold';

          const actionArea = document.createElement('div');
          actionArea.className = 'p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2.5';
          actionArea.innerHTML = `
            <button 
              class="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-650 hover:border-red-200 dark:bg-slate-800 dark:hover:bg-red-950/20 text-slate-550 dark:text-slate-400 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer delete-listing-btn"
              data-id="${prod.id}"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete Sold Record
            </button>
          `;

          cardWrapper.appendChild(soldBadge);
          cardWrapper.appendChild(card);
          cardWrapper.appendChild(actionArea);

          const deleteBtn = actionArea.querySelector('.delete-listing-btn');
          deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete this sold record for "${prod.title}"?`)) {
              const success = await state.deleteProduct(prod.id);
              if (success) {
                loadListings();
              }
            }
          });

          grid.appendChild(cardWrapper);
        });
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // Wiring settings updates
    const settingsForm = container.querySelector('#settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = container.querySelector('#set-username').value.trim();
        const email = container.querySelector('#set-email').value.trim();
        const phone = container.querySelector('#set-phone').value.trim();
        const city = container.querySelector('#set-location').value.trim();
        
        const success = await state.updateProfile({ username, email, phone, city });
        if (success) {
          loadListings();
        }
      });
    }
  };

  loadListings();

  return container;
}
