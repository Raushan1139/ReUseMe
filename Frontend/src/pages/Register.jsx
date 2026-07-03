import { state } from '../state.js';

export function Register() {
  const container = document.createElement('div');
  container.className = 'max-w-md mx-auto my-12 px-4';
  
  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl glass transition duration-300">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-emerald-500 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <i data-lucide="user-plus" class="w-6 h-6"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Create Account</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Join ReUseHub to begin trading items securely today.</p>
      </div>

      <form id="register-form" class="flex flex-col gap-4">
        <!-- Username Field -->
        <div>
          <label for="reg-username" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Username</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="user" class="w-4 h-4"></i>
            </span>
            <input 
              type="text" 
              id="reg-username" 
              required 
              placeholder="e.g. JohnDoe" 
              class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="reg-email" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </span>
            <input 
              type="email" 
              id="reg-email" 
              required 
              placeholder="john@example.com" 
              class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label for="reg-password" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="lock" class="w-4 h-4"></i>
            </span>
            <input 
              type="password" 
              id="reg-password" 
              required 
              placeholder="••••••••" 
              class="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              type="button" 
              id="toggle-reg-pass-btn" 
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="reg-confirm-password" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Confirm Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i data-lucide="lock" class="w-4 h-4"></i>
            </span>
            <input 
              type="password" 
              id="reg-confirm-password" 
              required 
              placeholder="••••••••" 
              class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-150 mt-2"
        >
          Sign Up
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account? 
        <a href="#/login" class="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition hover:underline">Log In</a>
      </div>
    </div>
  `;

  // Password visibility toggle
  const toggleBtn = container.querySelector('#toggle-reg-pass-btn');
  const passwordInput = container.querySelector('#reg-password');
  
  toggleBtn.addEventListener('click', () => {
    const isPass = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPass ? 'text' : 'password');
    toggleBtn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Submit behavior
  const form = container.querySelector('#register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = container.querySelector('#reg-username').value.trim();
    const email = container.querySelector('#reg-email').value.trim();
    const password = container.querySelector('#reg-password').value;
    const confirmPassword = container.querySelector('#reg-confirm-password').value;

    if (password !== confirmPassword) {
      state.showToast("Passwords do not match", "error");
      return;
    }

    const success = await state.register(username, email, password);
    if (success) {
      window.location.hash = '#/login';
    }
  });

  // Refresh icons
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 10);

  return container;
}
