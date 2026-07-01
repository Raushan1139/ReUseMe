import { state } from '../state.js';
import { ProductCard } from '../components/ProductCard.js';

export function ProductDetails({ productId }) {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6';

  // Request fresh details in background (increments views and gets seller details)
  state.viewProduct(productId);

  const product = state.getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center max-w-md mx-auto">
        <div class="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full mb-4 animate-bounce">
          <i data-lucide="package-search" class="w-12 h-12"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-850 dark:text-white">Listing not found</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">The item you are trying to view does not exist or has been deleted by the owner.</p>
        <a href="#/" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition">
          Return Home
        </a>
      </div>
    `;
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
    }, 10);
    return container;
  }

  // Active image in gallery
  let activeImageIdx = 0;
  
  // Similar products (same category, excluding current product)
  const similarProducts = state.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const drawDetails = () => {
    const isWish = state.isWishlisted(product.id);
    const hasSpecs = product.specifications && Object.values(product.specifications).some(val => val && val.trim() !== '');
    const isSeller = state.currentUser && product.seller && state.currentUser._id === product.seller.id;

    const getTravelEstimates = () => {
      const userCoords = state.userCoordinates;
      if (!userCoords || !product.coordinates) return null;
      
      const lat1 = userCoords.latitude;
      const lon1 = userCoords.longitude;
      const lat2 = product.coordinates.latitude;
      const lon2 = product.coordinates.longitude;
      
      if (lat1 === 0 && lon1 === 0) return null;
      
      const R = 6371; // Radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = R * c; // Distance in km
      
      // Average speeds in km/h
      const walkSpeed = 5;
      const cycleSpeed = 15;
      const driveSpeed = 40;
      
      const formatTime = (hours) => {
        const mins = Math.round(hours * 60);
        if (mins < 60) return `${mins} min`;
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
      };
      
      return {
        distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
        walk: formatTime(dist / walkSpeed),
        cycle: formatTime(dist / cycleSpeed),
        drive: formatTime(dist / driveSpeed)
      };
    };
    const travelTime = getTravelEstimates();

    // Determine condition badge style class
    let condBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40';
    if (product.condition === 'New') {
      condBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40';
    } else if (product.condition === 'Like New') {
      condBadgeColor = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-800/40';
    } else if (product.condition === 'Fair') {
      condBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40';
    }

    container.innerHTML = `
      <!-- Breadcrumbs -->
      <nav class="flex text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6 gap-1.5 items-center">
        <a href="#/" class="hover:text-emerald-500 dark:hover:text-emerald-400">Home</a>
        <i data-lucide="chevron-right" class="w-3 h-3"></i>
        <span>Categories</span>
        <i data-lucide="chevron-right" class="w-3 h-3"></i>
        <button id="breadcrumb-cat" class="hover:text-emerald-500 dark:hover:text-emerald-400 font-semibold cursor-pointer">${product.category}</button>
        <i data-lucide="chevron-right" class="w-3 h-3"></i>
        <span class="text-slate-600 dark:text-slate-350 truncate max-w-[200px]">${product.title}</span>
      </nav>

      <!-- Main Columns Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Image Gallery & Description -->
        <div class="lg:col-span-7 flex flex-col gap-8">
          <!-- Gallery -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 sm:p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <!-- Big Image Frame -->
            <div class="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
              <img 
                id="gallery-main-image"
                src="${product.images[activeImageIdx]}" 
                alt="${product.title}" 
                class="w-full h-full object-contain"
              />
              <button 
                id="gallery-wish-btn"
                class="absolute top-4 right-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-lg hover:scale-105 active:scale-95 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition"
              >
                <i data-lucide="heart" class="w-5 h-5 ${isWish ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}"></i>
              </button>
            </div>
            
            <!-- Thumbnail Row -->
            ${product.images.length > 1 ? `
              <div class="flex gap-3 overflow-x-auto pb-1">
                ${product.images.map((img, idx) => `
                  <button 
                    class="relative w-20 h-20 rounded-xl overflow-hidden border-2 transition duration-150 shrink-0 select-thumb-btn ${idx === activeImageIdx ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-100 dark:border-slate-800 opacity-70 hover:opacity-100'}"
                    data-index="${idx}"
                  >
                    <img src="${img}" alt="Thumbnail" class="w-full h-full object-cover" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Description Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-150 dark:border-slate-800">
              Listing Description
            </h3>
            <p class="text-slate-650 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              ${product.description}
            </p>
          </div>

          <!-- Specifications Card -->
          ${hasSpecs ? `
            <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-150 dark:border-slate-800 flex items-center gap-2">
                <i data-lucide="sliders" class="w-5 h-5 text-emerald-500"></i>
                Specifications
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${Object.entries(product.specifications).filter(([_, value]) => value && value.trim() !== '').map(([key, value]) => `
                  <div class="flex flex-col p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">${key}</span>
                    <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">${value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Right: Info Panel & Seller Details -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          
          <!-- Product Information -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">${product.category}</span>
                <span class="text-xs text-slate-400 dark:text-slate-500">Posted ${new Date(product.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                ${product.title}
              </h1>
            </div>

            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${condBadgeColor}">
                ${product.condition} Condition
              </span>
              <span class="text-xs text-slate-500 flex items-center gap-1">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                ${product.views + 8} views
              </span>
            </div>

            <div class="py-4 border-y border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Selling Price</span>
                <span class="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹${product.price}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-555">Location</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5 mt-0.5">
                  <i data-lucide="map-pin" class="w-4 h-4 text-emerald-500"></i>
                  ${product.location}
                </span>
              </div>
            </div>

            <!-- Proximity & Travel Times -->
            ${travelTime ? `
              <div class="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col gap-3">
                <div class="flex items-center justify-between text-xs font-bold text-slate-555 dark:text-slate-450">
                  <span class="flex items-center gap-1.5">
                    <i data-lucide="navigation" class="w-3.5 h-3.5 rotate-45 text-emerald-600"></i>
                    Distance Proximity
                  </span>
                  <span class="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">${travelTime.distance} away</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2.5 mt-1 border-t border-slate-100 dark:border-slate-800/40 pt-3">
                  <div class="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 text-center gap-1.5 shadow-sm">
                    <i data-lucide="footprints" class="w-4 h-4 text-slate-450"></i>
                    <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Walk</div>
                    <div class="text-xs font-black text-slate-800 dark:text-slate-205">${travelTime.walk}</div>
                  </div>
                  <div class="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 text-center gap-1.5 shadow-sm">
                    <i data-lucide="bike" class="w-4 h-4 text-slate-450"></i>
                    <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Cycle</div>
                    <div class="text-xs font-black text-slate-800 dark:text-slate-205">${travelTime.cycle}</div>
                  </div>
                  <div class="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 text-center gap-1.5 shadow-sm">
                    <i data-lucide="car" class="w-4 h-4 text-slate-450"></i>
                    <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Drive</div>
                    <div class="text-xs font-black text-slate-800 dark:text-slate-205">${travelTime.drive}</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Action buttons -->
            <div class="flex flex-col gap-3">
              ${isSeller ? `
                <button 
                  id="details-sold-btn"
                  ${product.status === 'sold' ? 'disabled' : ''}
                  class="w-full py-3.5 ${product.status === 'sold' ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-550 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer'} font-bold text-sm rounded-xl active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                  ${product.status === 'sold' ? 'Marked as Sold' : 'Mark as Sold'}
                </button>
                <a 
                  href="#/edit/${product.id}"
                  class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <i data-lucide="edit" class="w-4 h-4"></i>
                  Edit Listing
                </a>
                <button 
                  id="details-delete-btn"
                  class="w-full py-3.5 bg-red-650 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                  Delete Listing
                </button>
              ` : `
                <button 
                  id="details-contact-btn"
                  class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i data-lucide="message-square" class="w-4 h-4"></i>
                  Contact Seller
                </button>
                <button 
                  id="details-wishlist-btn"
                  class="w-full py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i data-lucide="heart" class="w-4 h-4 ${isWish ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}"></i>
                  ${isWish ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>
              `}
            </div>
          </div>

          <!-- Seller Profile Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-5">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">About Seller</h3>
            <div class="flex items-center gap-4">
              <img src="${product.seller.avatar}" alt="${product.seller.name}" class="w-14 h-14 rounded-2xl bg-emerald-50 border border-slate-100 dark:border-slate-800" />
              <div class="flex-grow">
                <h4 class="font-bold text-slate-850 dark:text-white leading-tight">${product.seller.name}</h4>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Joined ReUseHub in ${product.seller.joined}</p>
                <div class="flex items-center gap-1.5 mt-1 text-xs text-amber-500 font-bold">
                  <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                  <span>${product.seller.rating.toFixed(1)} / 5.0 Rating</span>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <div class="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                <i data-lucide="mail" class="w-4 h-4 text-emerald-500"></i>
                <span class="font-medium text-slate-400 dark:text-slate-505">Email:</span>
                <span class="font-semibold select-all">${product.seller.email}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                <i data-lucide="phone" class="w-4 h-4 text-emerald-500"></i>
                <span class="font-medium text-slate-400 dark:text-slate-505">Mobile:</span>
                <span class="font-semibold select-all">${product.seller.phone}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-xs p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400">
              <span class="font-medium">Seller listings:</span>
              <span class="font-bold text-slate-800 dark:text-white">${product.seller.activeListings || 1} listed ads</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Similar Listings -->
      ${similarProducts.length > 0 ? `
        <div class="mt-16 pt-10 border-t border-slate-100 dark:border-slate-950">
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
            Similar Listings
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="similar-grid-container">
            <!-- Cards will be injected -->
          </div>
        </div>
      ` : ''}

      <!-- Contact Seller Overlay Modal -->
      <div id="contact-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center p-4 transition-opacity duration-300 opacity-0 pointer-events-none">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transform scale-95 transition-transform duration-300 flex flex-col gap-6 glass">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="message-square" class="w-5 h-5 text-emerald-500"></i>
                Contact Seller
              </h3>
              <p class="text-xs text-slate-450 dark:text-slate-500 mt-1">Send a message or retrieve contact info for ${product.seller.name}</p>
            </div>
            <button id="modal-close-btn" class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Contact Tabs (Message / Details) -->
          <div class="flex flex-col gap-5">
            
            <!-- Tab Contents -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-850/40 rounded-2xl">
                <img src="${product.images[0]}" alt="${product.title}" class="w-12 h-12 rounded-xl object-cover" />
                <div class="truncate">
                  <p class="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase">${product.category}</p>
                  <p class="text-sm font-bold text-slate-800 dark:text-white truncate">${product.title}</p>
                  <p class="text-xs font-black text-emerald-600 dark:text-emerald-400">₹${product.price}</p>
                </div>
              </div>

              <!-- Message Textarea -->
              <div>
                <label for="contact-msg-body" class="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">Message Body</label>
                <textarea 
                  id="contact-msg-body" 
                  rows="3" 
                  class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >Hi ${product.seller.name}, is this still available?</textarea>
              </div>

              <!-- Template chips -->
              <div class="flex flex-wrap gap-2">
                <button class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-150 dark:border-slate-700 transition tag-message-chip">
                  Is this still available?
                </button>
                <button class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-150 dark:border-slate-700 transition tag-message-chip">
                  Would you accept ₹${Math.round(product.price * 0.85)}?
                </button>
                <button class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-150 dark:border-slate-700 transition tag-message-chip">
                  When can I pick this up?
                </button>
              </div>

              <button 
                id="send-modal-message-btn"
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition"
              >
                Send Message
              </button>
            </div>

            <!-- Separator line -->
            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-150 dark:border-slate-850"></div>
              <span class="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or Direct Contact</span>
              <div class="flex-grow border-t border-slate-150 dark:border-slate-850"></div>
            </div>

            <!-- Direct Contact Numbers -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="tel:${product.seller.phone}" class="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-250 transition">
                <i data-lucide="phone" class="w-4 h-4 text-emerald-500"></i>
                Call: ${product.seller.phone}
              </a>
              <a href="mailto:${product.seller.email}" class="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-250 transition">
                <i data-lucide="mail" class="w-4 h-4 text-emerald-500"></i>
                Mail Seller
              </a>
            </div>

          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Wiring up category breadcrumb navigation
    const breadcrumbCat = container.querySelector('#breadcrumb-cat');
    if (breadcrumbCat) {
      breadcrumbCat.addEventListener('click', () => {
        state.setFilters({ category: product.category });
        window.location.hash = '#/';
      });
    }

    // Thumbnail switching behavior
    const thumbnailBtns = container.querySelectorAll('.select-thumb-btn');
    thumbnailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeImageIdx = parseInt(btn.getAttribute('data-index'));
        drawDetails();
      });
    });

    // Wishlist toggling
    const wishBtn = container.querySelector('#gallery-wish-btn');
    const detailsWishBtn = container.querySelector('#details-wishlist-btn');

    const triggerWishToggle = async () => {
      await state.toggleWishlist(product.id);
      drawDetails();
    };

    if (wishBtn) wishBtn.addEventListener('click', triggerWishToggle);
    if (detailsWishBtn) detailsWishBtn.addEventListener('click', triggerWishToggle);

    if (isSeller) {
      const soldBtn = container.querySelector('#details-sold-btn');
      const deleteBtn = container.querySelector('#details-delete-btn');

      if (soldBtn) {
        soldBtn.addEventListener('click', async () => {
          if (confirm("Are you sure you want to mark this product as sold?")) {
            const success = await state.markProductAsSold(product.id);
            if (success) {
              drawDetails();
            }
          }
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            const success = await state.deleteProduct(product.id);
            if (success) {
              window.location.hash = '#/profile';
            }
          }
        });
      }
    }

    // Modal open / close handlers
    const contactBtn = container.querySelector('#details-contact-btn');
    const modal = container.querySelector('#contact-modal');
    const modalClose = container.querySelector('#modal-close-btn');
    const modalBody = modal.querySelector('.scale-95');

    const openModal = () => {
      modal.classList.remove('hidden');
      modal.offsetHeight; // Force reflow
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto', 'flex');
      modalBody.classList.remove('scale-95');
      modalBody.classList.add('scale-100');
    };

    const closeModal = () => {
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalBody.classList.remove('scale-100');
      modalBody.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }, 300);
    };

    if (contactBtn) {
      contactBtn.addEventListener('click', openModal);
    }
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Message template chip click handlers
    const chips = container.querySelectorAll('.tag-message-chip');
    const txtArea = container.querySelector('#contact-msg-body');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        txtArea.value = chip.innerText.trim();
      });
    });

    // Send Message Button Modal
    const sendBtn = container.querySelector('#send-modal-message-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        state.showToast("Message sent to seller successfully!", "success");
        closeModal();
      });
    }

    // Load similar products grid
    if (similarProducts.length > 0) {
      const grid = container.querySelector('#similar-grid-container');
      if (grid) {
        grid.innerHTML = '';
        similarProducts.forEach(prod => {
          grid.appendChild(ProductCard(prod));
        });
      }
      if (window.lucide) window.lucide.createIcons();
    }
  };

  drawDetails();

  return container;
}
