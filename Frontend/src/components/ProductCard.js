import { state } from '../state.js';

export function ProductCard(product) {
  const card = document.createElement('div');
  // Styling for premium product card
  card.className = 'group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer';
  
  const isWish = state.isWishlisted(product.id);
  const getFormattedBuyDate = (dateVal) => {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  const formattedBuyDate = getFormattedBuyDate(product.buyDate);
  
  // Set up condition badge color classes
  let condColor = '';
  switch (product.condition) {
    case 'New':
      condColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40';
      break;
    case 'Like New':
      condColor = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-800/40';
      break;
    case 'Good':
      condColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40';
      break;
    case 'Fair':
    default:
      condColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40';
      break;
  }

  card.innerHTML = `
    <!-- Product Image & Badges -->
    <div class="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
      <img 
        src="${product.images[0]}" 
        alt="${product.title}" 
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
      
      <!-- Condition Badge -->
      <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg border shadow-sm ${condColor}">
        ${product.condition}
      </span>
      
      <!-- Wishlist Heart Button -->
      <button 
        type="button" 
        id="card-wish-btn" 
        class="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-md hover:scale-110 active:scale-95 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition"
        aria-label="Add to wishlist"
      >
        <i data-lucide="heart" class="w-4 h-4 ${isWish ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}"></i>
      </button>
    </div>

    <!-- Product Details Content -->
    <div class="p-4 flex flex-col flex-grow justify-between gap-3">
      <div class="flex flex-col gap-1.5">
        <!-- Category & Location -->
        <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>${product.category}</span>
          <span class="flex items-center gap-0.5">
            <i data-lucide="map-pin" class="w-3 h-3"></i>
            ${product.location.split(',')[0]}
          </span>
        </div>
        
        <!-- Product Title -->
        <h3 class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 transition leading-tight">
          ${product.title}
        </h3>

        ${formattedBuyDate ? `
          <div class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded-md self-start mt-0.5">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-550"></i>
            <span>Bought: ${formattedBuyDate}</span>
          </div>
        ` : ''}
      </div>

      <!-- Price & CTA Action -->
      <div class="flex items-center justify-between mt-1 pt-3 border-t border-slate-50 dark:border-slate-800/60 shrink-0">
        <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white">₹${product.price}</span>
        
        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5">
          View Details
          <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition duration-150"></i>
        </span>
      </div>
    </div>
  `;

  // Navigate to product details page on click (except when clicking wishlist heart)
  card.addEventListener('click', (e) => {
    const wishBtn = card.querySelector('#card-wish-btn');
    if (wishBtn && wishBtn.contains(e.target)) {
      return;
    }
    window.location.hash = `#/product/${product.id}`;
  });

  // Toggle wishlist state
  const wishBtn = card.querySelector('#card-wish-btn');
  wishBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await state.toggleWishlist(product.id);
    
    // Toggle active classes on the icon locally to avoid full list rebuild and preserve visual position
    const heartIcon = wishBtn.querySelector('i');
    if (state.isWishlisted(product.id)) {
      heartIcon.classList.add('fill-red-500', 'text-red-500', 'dark:fill-red-400', 'dark:text-red-400');
    } else {
      heartIcon.classList.remove('fill-red-500', 'text-red-500', 'dark:fill-red-400', 'dark:text-red-400');
    }
  });

  return card;
}
