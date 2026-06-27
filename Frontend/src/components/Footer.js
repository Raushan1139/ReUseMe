import { state } from '../state.js';

export function Footer() {
  const footer = document.createElement('footer');
  footer.className = 'w-full bg-slate-900 text-slate-350 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300';
  
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <!-- Logo and tagline -->
        <div class="md:col-span-1 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <i data-lucide="recycle" class="w-5 h-5"></i>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">ReUseHub</span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            The modern, reliable, and premium marketplace for buying and selling second-hand goods. Give items a second life and save the planet.
          </p>
          <div class="flex items-center gap-4 mt-2">
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition duration-200" aria-label="Facebook">
              <i data-lucide="facebook" class="w-4 h-4"></i>
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition duration-200" aria-label="Twitter">
              <i data-lucide="twitter" class="w-4 h-4"></i>
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition duration-200" aria-label="Instagram">
              <i data-lucide="instagram" class="w-4 h-4"></i>
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition duration-200" aria-label="GitHub">
              <i data-lucide="github" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

        <!-- Categories Links -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">Categories</h3>
          <ul class="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-mobiles">Mobiles & Tablets</a></li>
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-laptops">Laptops & PC</a></li>
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-books">Books & Hobbies</a></li>
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-furniture">Home & Furniture</a></li>
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-bikes">Bikes & Vehicles</a></li>
            <li><a href="#/" class="hover:text-emerald-400 transition" id="footer-cat-fashion">Fashion & Apparel</a></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">Help & Support</h3>
          <ul class="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><a href="#" class="hover:text-emerald-400 transition">How it Works</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition">Safety Tips</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition">Terms of Service</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition">Help Center</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition">Contact Us</a></li>
          </ul>
        </div>

        <!-- Newsletter Sign-up -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Subscribe to our newsletter to receive the latest updates, special deals, and tips directly in your inbox.
          </p>
          <form id="newsletter-form" class="flex flex-col sm:flex-row gap-2 mt-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              class="flex-grow px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            <button 
              type="submit" 
              class="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; 2026 ReUseHub Marketplace. All rights reserved.</p>
        <p>Made with ❤️ for a sustainable future</p>
      </div>
    </div>
  `;

  // Attach handlers
  const form = footer.querySelector('#newsletter-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input').value;
    state.showToast(`Subscribed successfully with: ${email}!`, 'success');
    form.reset();
  });

  // Attach category links mapping to home filters
  const setupCatLink = (id, name) => {
    const link = footer.querySelector(`#${id}`);
    if (link) {
      link.addEventListener('click', () => {
        state.setFilters({ category: name });
      });
    }
  };

  setupCatLink('footer-cat-mobiles', 'Mobiles');
  setupCatLink('footer-cat-laptops', 'Laptops');
  setupCatLink('footer-cat-books', 'Books');
  setupCatLink('footer-cat-furniture', 'Furniture');
  setupCatLink('footer-cat-bikes', 'Bikes');
  setupCatLink('footer-cat-fashion', 'Fashion');

  return footer;
}
