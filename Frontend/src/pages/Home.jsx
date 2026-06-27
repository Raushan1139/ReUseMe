import { state } from '../state.js';
import { ProductCard } from '../components/ProductCard.js';
import { categories } from '../data/products.js';

const categoryColorClasses = {
  indigo: {
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    text: 'text-indigo-650 dark:text-indigo-400',
    hoverBg: 'group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white',
    border: 'hover:border-indigo-500/25 dark:hover:border-indigo-400/25',
    shadow: 'hover:shadow-indigo-500/5'
  },
  blue: {
    bg: 'bg-blue-50/70 dark:bg-blue-950/20',
    text: 'text-blue-650 dark:text-blue-400',
    hoverBg: 'group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white',
    border: 'hover:border-blue-500/25 dark:hover:border-blue-400/25',
    shadow: 'hover:shadow-blue-500/5'
  },
  amber: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/20',
    text: 'text-amber-650 dark:text-amber-400',
    hoverBg: 'group-hover:bg-amber-600 dark:group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-500/25 dark:hover:border-amber-400/25',
    shadow: 'hover:shadow-amber-500/5'
  },
  orange: {
    bg: 'bg-orange-50/70 dark:bg-orange-950/20',
    text: 'text-orange-650 dark:text-orange-400',
    hoverBg: 'group-hover:bg-orange-600 dark:group-hover:bg-orange-500 group-hover:text-white',
    border: 'hover:border-orange-500/25 dark:hover:border-orange-400/25',
    shadow: 'hover:shadow-orange-500/5'
  },
  emerald: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    text: 'text-emerald-650 dark:text-emerald-400',
    hoverBg: 'group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white',
    border: 'hover:border-emerald-500/25 dark:hover:border-emerald-400/25',
    shadow: 'hover:shadow-emerald-500/5'
  },
  pink: {
    bg: 'bg-pink-50/70 dark:bg-pink-950/20',
    text: 'text-pink-650 dark:text-pink-400',
    hoverBg: 'group-hover:bg-pink-600 dark:group-hover:bg-pink-500 group-hover:text-white',
    border: 'hover:border-pink-500/25 dark:hover:border-pink-400/25',
    shadow: 'hover:shadow-pink-500/5'
  },
  purple: {
    bg: 'bg-purple-50/70 dark:bg-purple-950/20',
    text: 'text-purple-650 dark:text-purple-400',
    hoverBg: 'group-hover:bg-purple-600 dark:group-hover:bg-purple-500 group-hover:text-white',
    border: 'hover:border-purple-500/25 dark:hover:border-purple-400/25',
    shadow: 'hover:shadow-purple-500/5'
  },
  red: {
    bg: 'bg-red-50/70 dark:bg-red-950/20',
    text: 'text-red-650 dark:text-red-400',
    hoverBg: 'group-hover:bg-red-600 dark:group-hover:bg-red-500 group-hover:text-white',
    border: 'hover:border-red-500/25 dark:hover:border-red-400/25',
    shadow: 'hover:shadow-red-500/5'
  },
  cyan: {
    bg: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    text: 'text-cyan-650 dark:text-cyan-400',
    hoverBg: 'group-hover:bg-cyan-600 dark:group-hover:bg-cyan-500 group-hover:text-white',
    border: 'hover:border-cyan-500/25 dark:hover:border-cyan-400/25',
    shadow: 'hover:shadow-cyan-500/5'
  },
  teal: {
    bg: 'bg-teal-50/70 dark:bg-teal-950/20',
    text: 'text-teal-655 dark:text-teal-400',
    hoverBg: 'group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white',
    border: 'hover:border-teal-500/25 dark:hover:border-teal-400/25',
    shadow: 'hover:shadow-teal-500/5'
  },
  lime: {
    bg: 'bg-lime-50/70 dark:bg-lime-950/20',
    text: 'text-lime-650 dark:text-lime-400',
    hoverBg: 'group-hover:bg-lime-600 dark:group-hover:bg-lime-500 group-hover:text-white',
    border: 'hover:border-lime-500/25 dark:hover:border-lime-400/25',
    shadow: 'hover:shadow-lime-500/5'
  },
  slate: {
    bg: 'bg-slate-100/70 dark:bg-slate-800/40',
    text: 'text-slate-655 dark:text-slate-405',
    hoverBg: 'group-hover:bg-slate-650 dark:group-hover:bg-slate-500 group-hover:text-white',
    border: 'hover:border-slate-500/25 dark:hover:border-slate-400/25',
    shadow: 'hover:shadow-slate-500/5'
  }
};

export function Home() {
  const container = document.createElement('div');
  container.className = 'w-full relative';
  
  // Local state for skeleton loading simulation
  let isLoading = true;

  // Local sorting state: 'newest' | 'price-asc' | 'price-desc' | 'nearby'
  let sortCriteria = state.userCoordinates ? 'nearby' : 'newest';

  // Render Skeleton Placeholders for Product Cards
  const renderSkeletons = (count = 4) => {
    return Array(count).fill(0).map(() => `
      <div class="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm animate-pulse">
        <div class="aspect-video sm:aspect-square bg-slate-200 dark:bg-slate-800"></div>
        <div class="p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div class="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
            <div class="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    `).join('');
  };

  const drawPage = () => {
    const activeFilters = state.filters;
    
    // Filter calculations
    let filteredList = state.products;

    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      filteredList = filteredList.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (activeFilters.category) {
      filteredList = filteredList.filter(p => p.category === activeFilters.category);
    }
    if (activeFilters.location) {
      filteredList = filteredList.filter(p => p.location === activeFilters.location);
    }
    if (activeFilters.minPrice !== null && activeFilters.minPrice !== '') {
      filteredList = filteredList.filter(p => p.price >= parseFloat(activeFilters.minPrice));
    }
    if (activeFilters.maxPrice !== null && activeFilters.maxPrice !== '') {
      filteredList = filteredList.filter(p => p.price <= parseFloat(activeFilters.maxPrice));
    }
    if (activeFilters.condition) {
      filteredList = filteredList.filter(p => p.condition === activeFilters.condition);
    }

    // Sort listings logic
    if (sortCriteria === 'price-asc') {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'price-desc') {
      filteredList.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === 'nearby') {
      // Keep backend proximity sort order as is
    } else {
      // Default: newest first
      filteredList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const featuredList = filteredList.filter(p => p.isFeatured);
    const latestList = [...filteredList];

    const isAnyFilterActive = activeFilters.search || activeFilters.category || activeFilters.location || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.condition;

    // Calculate active chips
    const activeChips = [];
    if (activeFilters.search) activeChips.push({ name: `Search: "${activeFilters.search}"`, type: 'search' });
    if (activeFilters.category) activeChips.push({ name: `Category: ${activeFilters.category}`, type: 'category' });
    if (activeFilters.location) activeChips.push({ name: `Location: ${activeFilters.location.split(',')[0]}`, type: 'location' });
    if (activeFilters.minPrice || activeFilters.maxPrice) {
      let label = '';
      if (activeFilters.minPrice && activeFilters.maxPrice) label = `Price: $${activeFilters.minPrice}-$${activeFilters.maxPrice}`;
      else if (activeFilters.minPrice) label = `Price: >$${activeFilters.minPrice}`;
      else if (activeFilters.maxPrice) label = `Price: <$${activeFilters.maxPrice}`;
      activeChips.push({ name: label, type: 'price' });
    }
    if (activeFilters.condition) activeChips.push({ name: `Condition: ${activeFilters.condition}`, type: 'condition' });

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        <!-- Categories Carousel Section (Always at the top) -->
        ${!isAnyFilterActive ? `
          <div class="mb-8">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Categories</h2>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 sm:gap-4">
              ${categories.map(cat => {
                const count = state.products.filter(p => p.category === cat.name).length;
                const cls = categoryColorClasses[cat.color] || categoryColorClasses.slate;
                return `
                  <button 
                    class="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md ${cls.shadow} ${cls.border} hover:-translate-y-0.5 transition duration-200 group text-center cursor-pointer cat-filter-btn"
                    data-category="${cat.name}"
                  >
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${cls.bg} ${cls.text} flex items-center justify-center mb-2 sm:mb-2.5 ${cls.hoverBg} transition duration-250">
                      <i data-lucide="${cat.icon}" class="w-4.5 h-4.5 sm:w-5 sm:h-5"></i>
                    </div>
                    <span class="text-[10px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1 truncate max-w-full">${cat.name}</span>
                    <span class="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">${count} ${count === 1 ? 'Item' : 'Items'}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Horizontal Filter Toolbar (New Position: Above Listings, Full-Width Layout) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div class="flex flex-wrap items-center gap-3">
            <!-- Condition Selector Dropdown -->
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Condition:</span>
              <select id="toolbar-condition" class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option value="">Any Condition</option>
                <option value="New" ${activeFilters.condition === 'New' ? 'selected' : ''}>New</option>
                <option value="Like New" ${activeFilters.condition === 'Like New' ? 'selected' : ''}>Like New</option>
                <option value="Good" ${activeFilters.condition === 'Good' ? 'selected' : ''}>Good</option>
                <option value="Fair" ${activeFilters.condition === 'Fair' ? 'selected' : ''}>Fair</option>
              </select>
            </div>

            <!-- Price Range inputs -->
            <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
              <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price ($):</span>
              <input 
                type="number" 
                id="toolbar-min-price" 
                placeholder="Min" 
                value="${activeFilters.minPrice || ''}"
                class="w-20 px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
              <span class="text-slate-350">-</span>
              <input 
                type="number" 
                id="toolbar-max-price" 
                placeholder="Max" 
                value="${activeFilters.maxPrice || ''}"
                class="w-20 px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>
            
            <!-- Category Dropdown override (only active if no categories carousel shown, or as manual pick) -->
            <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
              <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category:</span>
              <select id="toolbar-category" class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                <option value="">All Categories</option>
                ${categories.map(c => `
                  <option value="${c.name}" ${activeFilters.category === c.name ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Sorting selection and Reset -->
          <div class="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort By:</span>
              <select id="toolbar-sort" class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                ${state.userCoordinates ? `<option value="nearby" ${sortCriteria === 'nearby' ? 'selected' : ''}>Nearby First</option>` : ''}
                <option value="newest" ${sortCriteria === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="price-asc" ${sortCriteria === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${sortCriteria === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              </select>
            </div>
            
            ${isAnyFilterActive ? `
              <button id="toolbar-reset-btn" class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset
              </button>
            ` : ''}
          </div>

        </div>

        <!-- Active Filter Tags/Chips Row (Compact alert panel) -->
        ${activeChips.length > 0 ? `
          <div class="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <span class="text-xs font-extrabold text-slate-400 dark:text-slate-550 mr-1.5 uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="tag" class="w-3.5 h-3.5 text-emerald-500"></i>
              Active Filters
            </span>
            ${activeChips.map(chip => `
              <span class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition">
                ${chip.name}
                <button class="remove-filter-chip hover:text-emerald-950 dark:hover:text-white transition focus:outline-none ml-1 cursor-pointer p-0.5" data-type="${chip.type}">
                  <i data-lucide="x" class="w-3 h-3"></i>
                </button>
              </span>
            `).join('')}
            <button id="reset-filters-chips-clear" class="text-xs font-extrabold text-red-500 hover:text-red-600 hover:underline transition ml-auto cursor-pointer p-1">
              Clear All
            </button>
          </div>
        ` : ''}

        <!-- Listings Section: Spreads 4 full columns on Desktop -->
        <div id="products-grid-container">
          ${isLoading ? `
            <!-- Loading Skeletons -->
            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">Loading listings...</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${renderSkeletons(8)}
              </div>
            </div>
          ` : `
            <!-- Actual Listings Grid -->
            ${filteredList.length === 0 ? `
              <div class="text-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center max-w-lg mx-auto my-6">
                <div class="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-full mb-4">
                  <i data-lucide="search-x" class="w-12 h-12 text-slate-400"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-1">No items match your filters</h3>
                <p class="text-sm text-slate-505 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">Try changing your location, category filters, price settings, or clear active tags to view items.</p>
                <button id="no-results-reset-btn" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition cursor-pointer">
                  Reset All Filters
                </button>
              </div>
            ` : `
              <!-- Featured Items Grid (4 columns) -->
              ${featuredList.length > 0 && !isAnyFilterActive ? `
                <div class="mb-12">
                  <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                    <i data-lucide="sparkles" class="w-5 h-5 text-amber-500 fill-amber-500"></i>
                    Featured Listings
                  </h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="featured-products-grid">
                    <!-- Cards injected via script -->
                  </div>
                </div>
              ` : ''}

              <!-- Latest listings section (4 columns) -->
              <div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                  <i data-lucide="clock" class="w-5 h-5 text-emerald-500"></i>
                  ${isAnyFilterActive ? 'Filtered Listings' : 'Latest Postings'}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="latest-products-grid">
                  <!-- Cards injected via script -->
                </div>
              </div>
            `}
          `}
        </div>


      </div>
    `;

    // Initialize lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Wiring event listeners

    // Categories filter buttons (landing page carousel)
    const catBtns = container.querySelectorAll('.cat-filter-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        state.setFilters({ category: cat });
      });
    });



    // Active filter chips: Individual removal handler
    const chipsClose = container.querySelectorAll('.remove-filter-chip');
    chipsClose.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = chip.getAttribute('data-type');
        if (type === 'search') state.setFilters({ search: '' });
        else if (type === 'category') state.setFilters({ category: '' });
        else if (type === 'location') state.setFilters({ location: '' });
        else if (type === 'condition') state.setFilters({ condition: '' });
        else if (type === 'price') state.setFilters({ minPrice: null, maxPrice: null });
      });
    });

    // Active chips: Clear all
    const chipsClearAll = container.querySelector('#reset-filters-chips-clear');
    if (chipsClearAll) {
      chipsClearAll.addEventListener('click', () => {
        state.resetFilters();
      });
    }

    // Reset buttons
    const noResultsResetBtn = container.querySelector('#no-results-reset-btn');
    if (noResultsResetBtn) {
      noResultsResetBtn.addEventListener('click', () => {
        state.resetFilters();
      });
    }

    const resetToolbar = container.querySelector('#toolbar-reset-btn');
    if (resetToolbar) {
      resetToolbar.addEventListener('click', () => {
        state.resetFilters();
      });
    }

    // Toolbar selectors and inputs
    const toolbarCondition = container.querySelector('#toolbar-condition');
    const toolbarCategory = container.querySelector('#toolbar-category');
    const toolbarMinPrice = container.querySelector('#toolbar-min-price');
    const toolbarMaxPrice = container.querySelector('#toolbar-max-price');
    const toolbarSort = container.querySelector('#toolbar-sort');

    if (toolbarCondition) {
      toolbarCondition.addEventListener('change', (e) => {
        state.setFilters({ condition: e.target.value });
      });
    }

    if (toolbarCategory) {
      toolbarCategory.addEventListener('change', (e) => {
        state.setFilters({ category: e.target.value });
      });
    }

    if (toolbarMinPrice) {
      toolbarMinPrice.addEventListener('input', (e) => {
        state.setFilters({ minPrice: e.target.value === '' ? null : e.target.value });
      });
    }

    if (toolbarMaxPrice) {
      toolbarMaxPrice.addEventListener('input', (e) => {
        state.setFilters({ maxPrice: e.target.value === '' ? null : e.target.value });
      });
    }

    if (toolbarSort) {
      toolbarSort.addEventListener('change', (e) => {
        sortCriteria = e.target.value;
        drawPage();
      });
    }

    // Populate Product Cards in the grid
    if (!isLoading && filteredList.length > 0) {
      const featuredGrid = container.querySelector('#featured-products-grid');
      if (featuredGrid && featuredList.length > 0) {
        featuredGrid.innerHTML = '';
        featuredList.forEach(prod => {
          featuredGrid.appendChild(ProductCard(prod));
        });
      }

      const latestGrid = container.querySelector('#latest-products-grid');
      if (latestGrid) {
        latestGrid.innerHTML = '';
        latestList.forEach(prod => {
          latestGrid.appendChild(ProductCard(prod));
        });
      }
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  };

  // Simulated skeletal loading indicator
  setTimeout(() => {
    isLoading = false;
    drawPage();
  }, 400);

  // Initial draw
  drawPage();

  return container;
}
