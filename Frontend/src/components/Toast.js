export function Toast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 p-4 rounded-xl shadow-lg border animate-slide-in-right glass pointer-events-auto transition duration-300 max-w-sm w-full`;
  
  // Style depending on type
  let colorClasses = '';
  let iconName = '';
  
  switch(type) {
    case 'success':
      colorClasses = 'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/80 dark:text-emerald-300';
      iconName = 'check-circle';
      break;
    case 'error':
      colorClasses = 'border-red-200 bg-red-50/90 text-red-800 dark:border-red-800/40 dark:bg-red-950/80 dark:text-red-300';
      iconName = 'alert-circle';
      break;
    case 'info':
    default:
      colorClasses = 'border-blue-200 bg-blue-50/90 text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/80 dark:text-blue-300';
      iconName = 'info';
      break;
  }
  
  toast.className += ` ${colorClasses}`;
  
  toast.innerHTML = `
    <div class="flex-shrink-0">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-grow text-sm font-medium">
      ${message}
    </div>
    <button class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none ml-2 transition">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;
  
  // Re-run lucide just for this element
  setTimeout(() => {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: { class: 'lucide' },
        nameAttr: 'data-lucide'
      });
    }
  }, 10);
  
  // Close handler
  const closeBtn = toast.querySelector('button');
  const dismiss = () => {
    toast.style.animation = 'fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  };
  
  closeBtn.addEventListener('click', dismiss);
  
  // Auto dismiss after 3 seconds
  const autoDismissTimer = setTimeout(dismiss, 3500);
  
  return toast;
}
