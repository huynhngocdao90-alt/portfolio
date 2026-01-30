import * as Utils from "./utils.js";

const basePath = "assets/data/";

/**
 * Mobile Menu Toggle
 */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-8 text-2xl font-bold uppercase tracking-widest transition-opacity duration-300 opacity-0 pointer-events-none md:hidden';
mobileMenu.innerHTML = `
  <a href="#projects" class="hover:text-neutral-500 transition-colors mobile-link">Work</a>
  <a href="#skills" class="hover:text-neutral-500 transition-colors mobile-link">Expertise</a>
  <a href="#about" class="hover:text-neutral-500 transition-colors mobile-link">About</a>
  <a href="#contact" class="hover:text-neutral-500 transition-colors mobile-link">Contact</a>
  <button id="close-menu" class="absolute top-6 right-6 text-4xl">&times;</button>
`;
document.body.appendChild(mobileMenu);

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  });
}

const closeBtn = mobileMenu.querySelector('#close-menu');
closeBtn.addEventListener('click', () => {
  mobileMenu.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  });
});


/**
 * Theme Toggle
 */
const themeBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
const html = document.documentElement;

// Check Local Storage or System Preference
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

if (savedTheme === 'light' || (!savedTheme && systemTheme === 'light')) {
  html.classList.add('light');
  updateIcons('light');
} else {
  html.classList.remove('light');
  updateIcons('dark');
}

function updateIcons(theme) {
  themeBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (theme === 'light') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
}

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateIcons(isLight ? 'light' : 'dark');
  });
});


/**
 * Data Loading
 */
async function loadList({ jsonUrl, containerId, renderItem }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(jsonUrl);
    const items = await response.json();
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
      const card = document.createElement("div");
      // Preserve grid layout wrapper if needed, or just append the HTML string directly
      // Here we assume renderItem returns the inner HTML of a wrapper
      // But for better control, we'll let renderItem return a Node or string
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderItem(item);
      
      while (tempDiv.firstChild) {
         fragment.appendChild(tempDiv.firstChild);
      }
    });

    container.innerHTML = ''; // Clear placeholders
    container.appendChild(fragment);
  } catch (error) {
    console.error(`Failed to load ${jsonUrl}`, error);
  }
}

// Load Mobile Apps
loadList({
  jsonUrl: `${basePath}apps.json`,
  containerId: "projects-grid",
  renderItem: (item) => `
    <a href="https://play.google.com/store/apps/details?id=${item.id}" target="_blank" class="group block">
      <div class="aspect-[16/9] bg-[var(--color-card-bg)] rounded-lg overflow-hidden mb-4 relative border border-[var(--color-card-bg)] border-opacity-50">
         <img src="${item.icon}" alt="${item.name}" class="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" loading="lazy">
      </div>
      <h3 class="text-2xl font-bold group-hover:text-[var(--color-primary)] transition-colors">${item.name}</h3>
      <p class="text-[var(--color-text-muted)] mt-1">Mobile Application</p>
    </a>
  `
});


/**
 * Scroll Animations
 */
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class to sections
document.querySelectorAll('section').forEach(section => {
  section.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
  observer.observe(section);
});

// Use a simple class toggle for the observer instead of custom animation if Tailwind doesn't have it configures
// We'll add a utility class in js execution
const style = document.createElement('style');
style.innerHTML = `
  .reveal-visible { opacity: 1 !important; transform: translateY(0) !important; }
  section { transform: translateY(20px); }
`;
document.head.appendChild(style);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => revealObserver.observe(el));

// Production checks
if (Utils.isProduction()) {
  Utils.enableContentProtection();
}

console.log("Minimal Portfolio Loaded");
