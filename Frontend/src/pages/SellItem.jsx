import { state } from '../state.js';
import { categories, popularLocations } from '../data/products.js';

const locationCoordinates = {
  "Araria, Bihar": { latitude: 26.1509, longitude: 87.4375 },
  "Arwal, Bihar": { latitude: 25.2443, longitude: 84.6677 },
  "Aurangabad, Bihar": { latitude: 24.7539, longitude: 84.3735 },
  "Banka, Bihar": { latitude: 24.8848, longitude: 86.9242 },
  "Begusarai, Bihar": { latitude: 25.4184, longitude: 86.1249 },
  "Bhagalpur, Bihar": { latitude: 25.2445, longitude: 86.9718 },
  "Bhojpur, Bihar": { latitude: 25.4678, longitude: 84.5218 },
  "Buxar, Bihar": { latitude: 25.5647, longitude: 83.9777 },
  "Darbhanga, Bihar": { latitude: 26.1542, longitude: 85.8918 },
  "East Champaran, Bihar": { latitude: 26.6631, longitude: 84.9123 },
  "Gaya, Bihar": { latitude: 24.7969, longitude: 85.0039 },
  "Gopalganj, Bihar": { latitude: 26.4690, longitude: 84.4430 },
  "Jamui, Bihar": { latitude: 24.9200, longitude: 86.2200 },
  "Jehanabad, Bihar": { latitude: 25.2100, longitude: 84.9800 },
  "Kaimur, Bihar": { latitude: 25.0400, longitude: 83.6200 },
  "Katihar, Bihar": { latitude: 25.5300, longitude: 87.5700 },
  "Khagaria, Bihar": { latitude: 25.5000, longitude: 86.4800 },
  "Kishanganj, Bihar": { latitude: 26.2700, longitude: 87.9500 },
  "Lakhisarai, Bihar": { latitude: 25.1800, longitude: 86.0900 },
  "Madhepura, Bihar": { latitude: 25.9200, longitude: 86.7900 },
  "Madhubani, Bihar": { latitude: 26.3500, longitude: 86.0800 },
  "Munger, Bihar": { latitude: 25.3748, longitude: 86.4744 },
  "Muzaffarpur, Bihar": { latitude: 26.1226, longitude: 85.3906 },
  "Nalanda, Bihar": { latitude: 25.2000, longitude: 85.5200 },
  "Nawada, Bihar": { latitude: 24.8800, longitude: 85.5400 },
  "Patna, Bihar": { latitude: 25.5941, longitude: 85.1376 },
  "Purnia, Bihar": { latitude: 25.7700, longitude: 87.4700 },
  "Rohtas, Bihar": { latitude: 24.9500, longitude: 84.0100 },
  "Saharsa, Bihar": { latitude: 25.8800, longitude: 86.6000 },
  "Samastipur, Bihar": { latitude: 25.8600, longitude: 85.7800 },
  "Saran, Bihar": { latitude: 25.8500, longitude: 84.8500 },
  "Sheikhpura, Bihar": { latitude: 25.1400, longitude: 85.8500 },
  "Sheohar, Bihar": { latitude: 26.5200, longitude: 85.2900 },
  "Sitamarhi, Bihar": { latitude: 26.6000, longitude: 85.4800 },
  "Siwan, Bihar": { latitude: 26.2200, longitude: 84.3600 },
  "Supaul, Bihar": { latitude: 26.1200, longitude: 86.6000 },
  "Vaishali, Bihar": { latitude: 25.6800, longitude: 85.2200 },
  "West Champaran, Bihar": { latitude: 27.1600, longitude: 84.5000 }
};

const categorySpecConfigs = {
  "Mobiles": [
    { label: "Brand", name: "brand", type: "text", placeholder: "e.g., Apple, Samsung, OnePlus" },
    { label: "RAM", name: "ram", type: "text", placeholder: "e.g., 8 GB, 12 GB" },
    { label: "Storage", name: "storage", type: "text", placeholder: "e.g., 128 GB, 256 GB" },
    { label: "Color", name: "color", type: "text", placeholder: "e.g., Graphite, Alpine Green" }
  ],
  "Laptops": [
    { label: "Brand", name: "brand", type: "text", placeholder: "e.g., Apple, Dell, HP" },
    { label: "Processor", name: "processor", type: "text", placeholder: "e.g., Intel Core i7, Apple M2" },
    { label: "RAM", name: "ram", type: "text", placeholder: "e.g., 16 GB, 32 GB" },
    { label: "Storage", name: "storage", type: "text", placeholder: "e.g., 512 GB SSD, 1 TB SSD" }
  ],
  "Bikes": [
    { label: "Brand / Model", name: "brand", type: "text", placeholder: "e.g., Royal Enfield Classic 350" },
    { label: "Model Year", name: "year", type: "number", placeholder: "e.g., 2022" },
    { label: "Mileage", name: "mileage", type: "text", placeholder: "e.g., 40 kmpl" }
  ],
  "Books": [
    { label: "Author", name: "author", type: "text", placeholder: "e.g., George Orwell" },
    { label: "Genre", name: "genre", type: "text", placeholder: "e.g., Dystopian Fiction" },
    { label: "Language", name: "language", type: "text", placeholder: "e.g., English" }
  ],
  "Furniture": [
    { label: "Material", name: "material", type: "text", placeholder: "e.g., Teak Wood, Leather" },
    { label: "Dimensions", name: "dimensions", type: "text", placeholder: "e.g., 6 ft x 3 ft x 2.5 ft" }
  ],
  "Fashion": [
    { label: "Brand", name: "brand", type: "text", placeholder: "e.g., Zara, Nike" },
    { label: "Size", name: "size", type: "text", placeholder: "e.g., M, L, XL, 32" },
    { label: "Material", name: "material", type: "text", placeholder: "e.g., 100% Cotton" }
  ],
  "Electronics": [
    { label: "Brand", name: "brand", type: "text", placeholder: "e.g., Sony, LG, JBL" },
    { label: "Model Name", name: "model", type: "text", placeholder: "e.g., WH-1000XM4" },
    { label: "Warranty Status", name: "warranty", type: "text", placeholder: "e.g., 6 months left, Expired" }
  ],
  "Cars": [
    { label: "Brand / Model", name: "brand", type: "text", placeholder: "e.g., Maruti Suzuki Swift" },
    { label: "Model Year", name: "year", type: "number", placeholder: "e.g., 2018" },
    { label: "Fuel Type", name: "fuel", type: "text", placeholder: "e.g., Petrol, Diesel, CNG" },
    { label: "KM Driven", name: "km", type: "text", placeholder: "e.g., 45,000 km" }
  ],
  "Home Appliances": [
    { label: "Brand", name: "brand", type: "text", placeholder: "e.g., Samsung, Whirlpool, LG" },
    { label: "Appliance Type", name: "type", type: "text", placeholder: "e.g., Refrigerator, Washing Machine" },
    { label: "Capacity", name: "capacity", type: "text", placeholder: "e.g., 250 L, 7 kg" }
  ],
  "Sports & Hobbies": [
    { label: "Brand / Manufacturer", name: "brand", type: "text", placeholder: "e.g., Decathlon, Cosco" },
    { label: "Item Type", name: "type", type: "text", placeholder: "e.g., Bicycle, Cricket Bat, Treadmill" }
  ],
  "Services": [
    { label: "Provider / Company", name: "brand", type: "text", placeholder: "e.g., Self-Employed, Urban Company" },
    { label: "Service Type", name: "type", type: "text", placeholder: "e.g., Home Cleaning, AC Repair, Plumbing" },
    { label: "Pricing Model", name: "pricing", type: "text", placeholder: "e.g., Hourly, Fixed Rate, Quote basis" }
  ],
  "Others": [
    { label: "Brand / Model", name: "brand", type: "text", placeholder: "e.g., Sony WH-1005" }
  ]
};

function getSpecsForCategory(category) {
  return categorySpecConfigs[category] || [
    { label: "Brand / Model", name: "brand", type: "text", placeholder: "e.g., Sony WH-1005" }
  ];
}

export function SellItem(params = {}) {
  const editProductId = params.editProductId;
  const isEditMode = !!editProductId;

  const formatBuyDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6';

  const user = state.currentUser;

  // Protected route check
  if (!user) {
    container.className = 'max-w-md mx-auto my-16 px-4';
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 rounded-full mb-6">
          <i data-lucide="plus-circle" class="w-12 h-12"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
          You must be logged in to create listings and sell your used items on ReUseHub.
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

  // Local state for listing form
  let listData = {
    title: '',
    category: 'Mobiles',
    price: '',
    condition: 'Good',
    description: '',
    images: [],
    location: 'Patna, Bihar',
    buyDate: '',
    specifications: {}
  };

  const loadEditProduct = async () => {
    if (!isEditMode) return;
    let prodToEdit = state.getProductById(editProductId);
    if (!prodToEdit) {
      // Fetch specifically from server
      try {
        const res = await fetch(`${state.API_URL}/products/${editProductId}`);
        if (res.ok) {
          prodToEdit = await res.json();
        }
      } catch (e) {
        console.error("Failed to fetch product for editing:", e);
      }
    }

    if (prodToEdit) {
      listData = {
        title: prodToEdit.title || '',
        category: prodToEdit.category || 'Mobiles',
        price: prodToEdit.price || '',
        condition: prodToEdit.condition || 'Good',
        description: prodToEdit.description || '',
        images: prodToEdit.images || [],
        location: prodToEdit.location || 'Patna, Bihar',
        buyDate: prodToEdit.buyDate || '',
        specifications: prodToEdit.specifications || {}
      };
      drawPage();
    } else {
      state.showToast("Product not found or unable to edit", "error");
      window.location.hash = '#/';
    }
  };

  if (isEditMode) {
    loadEditProduct();
  }

  const drawPage = () => {
    // Determine condition badge style class
    let condBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40';
    if (listData.condition === 'New') {
      condBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40';
    } else if (listData.condition === 'Like New') {
      condBadgeColor = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-800/40';
    } else if (listData.condition === 'Fair') {
      condBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40';
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Form Section -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-6">${isEditMode ? 'Edit Product Listing' : 'List an Item for Sale'}</h2>
          
          <form id="sell-form" class="flex flex-col gap-5">
            <!-- Title -->
            <div>
              <label for="sell-title" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ad Title</label>
              <input 
                type="text" 
                id="sell-title" 
                required 
                maxlength="70"
                placeholder="Key features of your item (e.g., iPhone 13 Pro Max 256GB Gold)" 
                value="${listData.title}"
                class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition duration-150"
              />
              <p class="text-xs text-slate-400 mt-1">Include brand, model, specs, and color (max 70 chars).</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Category -->
              <div>
                <label for="sell-category" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
                <select 
                  id="sell-category" 
                  required
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                >
                  ${categories.map(cat => `
                    <option value="${cat.name}" ${listData.category === cat.name ? 'selected' : ''}>${cat.name}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Price -->
              <div>
                <label for="sell-price" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  id="sell-price" 
                  required 
                  min="0"
                  placeholder="Set your selling price" 
                  value="${listData.price}"
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition duration-150"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Condition -->
              <div>
                <label for="sell-condition" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Condition</label>
                <select 
                  id="sell-condition" 
                  required
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="New" ${listData.condition === 'New' ? 'selected' : ''}>New (Unopened box)</option>
                  <option value="Like New" ${listData.condition === 'Like New' ? 'selected' : ''}>Like New (Barely used, perfect)</option>
                  <option value="Good" ${listData.condition === 'Good' ? 'selected' : ''}>Good (Minor wear, works fully)</option>
                  <option value="Fair" ${listData.condition === 'Fair' ? 'selected' : ''}>Fair (Visible wear, functional)</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label for="sell-location" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location</label>
                <select 
                  id="sell-location" 
                  required
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                >
                  ${popularLocations.filter(loc => loc !== "Use Current Location").map(loc => `
                    <option value="${loc}" ${listData.location === loc ? 'selected' : ''}>${loc}</option>
                  `).join('')}
                </select>
               </div>
             </div>

             <!-- Buy Date -->
             <div>
               <label for="sell-buy-date" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Buy Date</label>
               <input 
                 type="date" 
                 id="sell-buy-date" 
                 value="${listData.buyDate ? (typeof listData.buyDate === 'string' ? listData.buyDate.substring(0, 10) : new Date(listData.buyDate).toISOString().substring(0, 10)) : ''}"
                 class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition duration-150"
               />
               <p class="text-xs text-slate-400 mt-1">When did you buy this item?</p>
             </div>

             <!-- Category Specific Fields Container -->
            <div id="category-specs-container"></div>

            <!-- Description -->
            <div>
              <label for="sell-description" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
              <textarea 
                id="sell-description" 
                required 
                rows="5"
                placeholder="Describe your item in detail. Include defects, specifications, warranty status, reason for selling, and pickup details..."
                class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition duration-150"
              >${listData.description}</textarea>
            </div>

            <!-- Image Upload Section -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Photos (Up to 3)</label>
              
              <!-- Drag and Drop Dropzone -->
              <div 
                id="image-dropzone" 
                class="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition flex flex-col items-center justify-center gap-2"
              >
                <input type="file" id="file-uploader" accept="image/*" multiple class="hidden" />
                <div class="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl">
                  <i data-lucide="image-plus" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-200">Upload item images</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Drag and drop or click to select files (PNG, JPG)</p>
                </div>
              </div>
              
              <!-- Paste Image URL fallback for easy testing -->
              <div class="mt-3 flex gap-2">
                <input 
                  type="url" 
                  id="image-url-input" 
                  placeholder="Or paste an image web URL for quick testing..." 
                  class="flex-grow px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
                <button 
                  type="button" 
                  id="add-url-btn" 
                  class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Add URL
                </button>
              </div>

              <!-- Uploaded Thumbnails list -->
              <div id="thumbnails-list" class="flex gap-4 mt-4 flex-wrap">
                ${listData.images.length === 0 ? `
                  <p class="text-xs text-slate-400 italic">No photos added yet.</p>
                ` : listData.images.map((img, idx) => `
                  <div class="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 shadow-sm shrink-0 group">
                    <img src="${img}" alt="Preview" class="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      data-index="${idx}" 
                      class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition remove-img-btn"
                    >
                      <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Submit buttons -->
            <button 
              type="submit" 
              class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition mt-4 cursor-pointer"
            >
              ${isEditMode ? 'Save Modifications' : 'Post Listings Ad'}
            </button>
          </form>
        </div>

        <!-- Sticky Live Preview Column (Desktop Only) -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <div class="sticky top-20">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Ad Preview</h3>
            
            <!-- Live Preview Card -->
            <div class="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div class="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  id="preview-card-image"
                  src="${listData.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'}" 
                  alt="Listing Preview" 
                  class="w-full h-full object-cover"
                />
                <span id="preview-card-condition" class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg border shadow-sm ${condBadgeColor}">
                  ${listData.condition}
                </span>
                <button type="button" class="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow text-slate-400 pointer-events-none">
                  <i data-lucide="heart" class="w-4 h-4"></i>
                </button>
              </div>

              <div class="p-4 flex flex-col justify-between gap-3 flex-grow">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span id="preview-card-category">${listData.category}</span>
                    <span class="flex items-center gap-0.5">
                      <i data-lucide="map-pin" class="w-3 h-3"></i>
                      <span id="preview-card-location">${listData.location.split(',')[0]}</span>
                    </span>
                  </div>
                  <h3 id="preview-card-title" class="text-base font-bold text-slate-850 dark:text-slate-100 truncate line-clamp-1">
                    ${listData.title || 'Untitled Listing'}
                  </h3>

                  <div id="preview-card-buy-date-container" class="${listData.buyDate ? 'flex' : 'hidden'} items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded-md self-start mt-0.5">
                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-555"></i>
                    <span id="preview-card-buy-date">${listData.buyDate ? `Bought: ${formatBuyDate(listData.buyDate)}` : ''}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-1 pt-3 border-t border-slate-50 dark:border-slate-800">
                  <span id="preview-card-price" class="text-lg font-black text-slate-900 dark:text-white">
                    ₹${listData.price || '0'}
                  </span>
                  <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    View Details
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Dynamic seller details preview -->
            <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <img src="${user.avatar}" alt="${user.username}" class="w-8 h-8 rounded-lg" />
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Seller Preview</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400">Your registered username ${user.username} will be public</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    const renderSpecsContainer = () => {
      const specsContainer = container.querySelector('#category-specs-container');
      if (!specsContainer) return;

      const fields = getSpecsForCategory(listData.category);
      
      const newSpecs = {};
      fields.forEach(f => {
        newSpecs[f.label] = listData.specifications[f.label] || '';
      });
      listData.specifications = newSpecs;

      specsContainer.innerHTML = `
        <div class="border-t border-slate-100 dark:border-slate-800 pt-5 mt-2 flex flex-col gap-4">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
            <i data-lucide="sliders" class="w-4 h-4 text-emerald-500"></i>
            Category Specifications
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${fields.map(f => `
              <div>
                <label for="spec-${f.name}" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${f.label}</label>
                <input 
                  type="${f.type}" 
                  id="spec-${f.name}" 
                  placeholder="${f.placeholder}" 
                  value="${listData.specifications[f.label] || ''}"
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition duration-150 spec-input"
                  data-label="${f.label}"
                />
              </div>
            `).join('')}
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const specInputs = specsContainer.querySelectorAll('.spec-input');
      specInputs.forEach(input => {
        input.addEventListener('input', (e) => {
          const label = e.target.getAttribute('data-label');
          listData.specifications[label] = e.target.value;
        });
      });
    };

    if (window.lucide) window.lucide.createIcons();
    renderSpecsContainer();

    // Wiring up Form update handlers to achieve live updates!
    const sellForm = container.querySelector('#sell-form');
    const inputTitle = container.querySelector('#sell-title');
    const selectCat = container.querySelector('#sell-category');
    const inputPrice = container.querySelector('#sell-price');
    const selectCond = container.querySelector('#sell-condition');
    const selectLoc = container.querySelector('#sell-location');
    const inputDesc = container.querySelector('#sell-description');
    const inputBuyDate = container.querySelector('#sell-buy-date');

    // DOM live elements
    const pTitle = container.querySelector('#preview-card-title');
    const pCat = container.querySelector('#preview-card-category');
    const pPrice = container.querySelector('#preview-card-price');
    const pCond = container.querySelector('#preview-card-condition');
    const pLoc = container.querySelector('#preview-card-location');
    const pImg = container.querySelector('#preview-card-image');

    const updateLiveCard = () => {
      pTitle.innerText = listData.title || 'Untitled Listing';
      pCat.innerText = listData.category;
      pPrice.innerText = `$${listData.price || '0'}`;
      pLoc.innerText = listData.location.split(',')[0];
      pCond.innerText = listData.condition;
      
      // Update condition colors
      pCond.className = `absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg border shadow-sm `;
      let condBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40';
      if (listData.condition === 'New') {
        condBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40';
      } else if (listData.condition === 'Like New') {
        condBadgeColor = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-800/40';
      } else if (listData.condition === 'Fair') {
        condBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40';
      }
      pCond.className += condBadgeColor;

      pImg.src = listData.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80';
    };

    // Listeners for live typing
    inputTitle.addEventListener('input', (e) => {
      listData.title = e.target.value;
      pTitle.innerText = listData.title || 'Untitled Listing';
    });

    selectCat.addEventListener('change', (e) => {
      listData.category = e.target.value;
      pCat.innerText = listData.category;
      renderSpecsContainer();
    });

    inputPrice.addEventListener('input', (e) => {
      listData.price = e.target.value;
      pPrice.innerText = `₹${listData.price || '0'}`;
    });

    selectCond.addEventListener('change', (e) => {
      listData.condition = e.target.value;
      listData.condition = e.target.value;
      updateLiveCard();
    });

    selectLoc.addEventListener('change', (e) => {
      listData.location = e.target.value;
      pLoc.innerText = listData.location.split(',')[0];
    });

    inputDesc.addEventListener('input', (e) => {
      listData.description = e.target.value;
    });

    inputBuyDate.addEventListener('change', (e) => {
      listData.buyDate = e.target.value;
      const previewDateContainer = container.querySelector('#preview-card-buy-date-container');
      const previewDateText = container.querySelector('#preview-card-buy-date');
      
      const formatted = formatBuyDate(listData.buyDate);
      if (formatted) {
        if (previewDateText) previewDateText.innerText = `Bought: ${formatted}`;
        if (previewDateContainer) {
          previewDateContainer.classList.remove('hidden');
          previewDateContainer.classList.add('flex');
        }
      } else {
        if (previewDateContainer) {
          previewDateContainer.classList.remove('flex');
          previewDateContainer.classList.add('hidden');
        }
      }
    });

    // File Uploader logic (Drag & Drop + Input Click)
    const dropzone = container.querySelector('#image-dropzone');
    const fileUploader = container.querySelector('#file-uploader');

    dropzone.addEventListener('click', () => {
      fileUploader.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-emerald-500', 'bg-emerald-50/20');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-emerald-500', 'bg-emerald-50/20');
    });

    const processFiles = (files) => {
      Array.from(files).forEach(file => {
        if (listData.images.length >= 3) {
          state.showToast("Maximum of 3 images allowed", "error");
          return;
        }
        if (!file.type.startsWith('image/')) {
          state.showToast("File must be an image type", "error");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          listData.images.push(e.target.result);
          drawPage();
        };
        reader.readAsDataURL(file);
      });
    };

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-emerald-500', 'bg-emerald-50/20');
      processFiles(e.dataTransfer.files);
    });

    fileUploader.addEventListener('change', (e) => {
      processFiles(e.target.files);
    });

    // Image URL Input Logic
    const addUrlBtn = container.querySelector('#add-url-btn');
    const imageUrlInput = container.querySelector('#image-url-input');

    addUrlBtn.addEventListener('click', () => {
      const url = imageUrlInput.value.trim();
      if (!url) return;

      if (listData.images.length >= 3) {
        state.showToast("Maximum of 3 images allowed", "error");
        return;
      }

      listData.images.push(url);
      imageUrlInput.value = '';
      drawPage();
    });

    // Remove Image button
    const removeBtns = container.querySelectorAll('.remove-img-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'));
        listData.images.splice(idx, 1);
        drawPage();
      });
    });

    // Form submission
    sellForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!listData.title || !listData.price || !listData.description) {
        state.showToast("Please fill all required fields", "error");
        return;
      }

      const selectedLoc = listData.location;
      const coords = locationCoordinates[selectedLoc] || { latitude: 25.5941, longitude: 85.1376 };

      const payload = {
        title: listData.title,
        category: listData.category,
        price: listData.price,
        condition: listData.condition,
        city: selectedLoc,
        latitude: coords.latitude,
        longitude: coords.longitude,
        description: listData.description,
        images: listData.images,
        buyDate: listData.buyDate || undefined,
        specifications: listData.specifications
      };

      if (isEditMode) {
        const success = await state.updateProduct(editProductId, payload);
        if (success) {
          // Redirect to newly created item details page!
          window.location.hash = `#/product/${editProductId}`;
        }
      } else {
        // Create listed item in store
        const addedProdId = await state.addProduct(payload);
        
        if (addedProdId) {
          // Redirect to newly created item details page!
          window.location.hash = `#/product/${addedProdId}`;
        }
      }
    });
  };

  drawPage();

  return container;
}
