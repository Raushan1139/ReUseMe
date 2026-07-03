import { state } from '../state.js';

export function ForgotPassword() {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4';

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl glass transition duration-300">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 items-center justify-center mb-4">
          <i data-lucide="key-round" class="w-6 h-6"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Forgot Password</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Enter your email and we'll send you a password reset link.</p>
      </div>

      <form id="forgot-form" class="flex flex-col gap-5">
        <div>
          <label for="forgot-email" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </span>
            <input 
              type="email" 
              id="forgot-email" 
              required 
              placeholder="e.g. john@example.com" 
              class="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-150 mt-2 cursor-pointer">Send Reset Link
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Remember your password? 
        <a href="#/login" class="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition hover:underline">Sign In</a>
      </div>
    </div>
  `;

  const form = container.querySelector('#forgot-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#forgot-email').value.trim();
    const success = await state.forgotPassword(email);
    if (success) {
      window.location.hash = '#/login';
    }
  });

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 10);

  return container;
}
