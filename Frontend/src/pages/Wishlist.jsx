import { state } from '../state.js';
import { ProductCard } from '../components/ProductCard.js';

export function Wishlist() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6';

  const drawWishlist = () => {
    const listIds = state.wishlist;
    // Map listIds to full product details
    const wishItems = state.products.filter(p => listIds.includes(p.id));

    if (wishItems.length === 0) {
      container.innerHTML = `
        <div class="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center max-w-xl mx-auto mt-6">
          <div class="p-5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full mb-6">
            <i data-lucide="heart-off" class="w-12 h-12"></i>
          </div>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white">Your Wishlist is Empty</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mb-8 leading-relaxed">
            Save items that catch your eye so you can easily compare, track price changes, or message the seller later.
          </p>
          <a href="#/" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 transition duration-150">
            Discover Products
          </a>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <i data-lucide="heart" class="w-6 h-6 text-red-500 fill-red-550"></i>
              My Wishlist
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">You have saved ${wishItems.length} products to your favorites list.</p>
          </div>
          <button id="clear-wish-btn" class="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-950 transition flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i> Clear List
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="wishlist-grid">
          <!-- Cards dynamically injected -->
        </div>
      `;

      const grid = container.querySelector('#wishlist-grid');
      wishItems.forEach(prod => {
        grid.appendChild(ProductCard(prod));
      });

      // Clear wishlist trigger
      const clearBtn = container.querySelector('#clear-wish-btn');
      clearBtn.addEventListener('click', async () => {
        await state.clearWishlist();
        drawWishlist();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  };

  drawWishlist();

  return container;
}
