import { state } from '../state.js';

export function ResetPassword() {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4';

  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const token = searchParams.get('token') || '';

  if (!token) {
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div class="p-4 bg-red-50 dark:bg-red-955/20 text-red-600 rounded-full mb-6">
          <i data-lucide="alert-triangle" class="w-12 h-12"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Link</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
          The password reset link is invalid or missing a token. Please request a new one.
        </p>
        <a href="#/forgot-password" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl text-center shadow-lg transition">
          Go to Forgot Password
        </a>
      </div>
    `;
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
    }, 10);
    return container;
  }

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl glass transition duration-300">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 dark:text-emerald-400 items-center justify-center mb-4">
          <i data-lucide="lock" class="w-6 h-6"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Reset Password</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Enter your new password below.</p>
      </div>

      <form id="reset-form" class="flex flex-col gap-5">
        <div>
          <label for="reset-password" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">New Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="lock" class="w-4 h-4"></i>
            </span>
            <input 
              type="password" 
              id="reset-password" 
              required 
              placeholder="••••••••" 
              class="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              type="button" 
              id="toggle-reset-password-btn" 
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-150 mt-2"
        >
          Reset Password
        </button>
      </form>
    </div>
  `;

  // Password toggle
  const toggleBtn = container.querySelector('#toggle-reset-password-btn');
  const passwordInput = container.querySelector('#reset-password');
  toggleBtn.addEventListener('click', () => {
    const isPass = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPass ? 'text' : 'password');
    toggleBtn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) window.lucide.createIcons();
  });

  const form = container.querySelector('#reset-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    const success = await state.resetPassword(token, password);
    if (success) {
      window.location.hash = '#/login';
    }
  });

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 10);

  return container;
}
