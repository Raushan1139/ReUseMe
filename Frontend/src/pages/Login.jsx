import { state } from '../state.js';

export function Login() {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4';
  
  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl glass transition duration-300">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-emerald-500 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <i data-lucide="log-in" class="w-6 h-6"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Sign in to list items, message sellers, and save favorites.</p>
      </div>

      <form id="login-form" class="flex flex-col gap-5">
        <!-- Email Field -->
        <div>
          <label for="login-email" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </span>
            <input 
              type="email" 
              id="login-email" 
              required 
              placeholder="e.g. john@example.com" 
              class="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label for="login-password" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
            <a href="#/forgot-password" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition hover:underline">Forgot password?</a>
          </div>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="lock" class="w-4 h-4"></i>
            </span>
            <input 
              type="password" 
              id="login-password" 
              required 
              placeholder="••••••••" 
              class="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              type="button" 
              id="toggle-password-btn" 
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-150 mt-2"
        >
          Sign In
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account? 
        <a href="#/register" class="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition hover:underline">Create Account</a>
      </div>
    </div>
  `;

  // Password toggle behavior
  const toggleBtn = container.querySelector('#toggle-password-btn');
  const passwordInput = container.querySelector('#login-password');
  
  toggleBtn.addEventListener('click', () => {
    const isPass = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPass ? 'text' : 'password');
    toggleBtn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Submit behavior
  const form = container.querySelector('#login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#login-email').value.trim();
    const password = container.querySelector('#login-password').value;
    const success = await state.login(email, password);
    if (success) {
      window.location.hash = '#/';
    }
  });

  // Refresh icons
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 10);

  return container;
}