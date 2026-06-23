// ---- Carousel ----
const carousels = {};

function initCarousel(id, count) {
  carousels[id] = { index: 0, count };
  const dots = document.getElementById('dots' + cap(id));
  for (let i = 0; i < count; i++) {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Слайд ' + (i + 1));
    d.onclick = () => goToSlide(id, i);
    dots.appendChild(d);
  }
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function goToSlide(id, idx) {
  const c = carousels[id];
  c.index = (idx + c.count) % c.count;
  document.getElementById('track' + cap(id)).style.transform = `translateX(-${c.index * 100}%)`;
  document.querySelectorAll(`#dots${cap(id)} .carousel-dot`).forEach((d, i) => {
    d.classList.toggle('active', i === c.index);
  });
}

function moveCarousel(id, dir) {
  goToSlide(id, carousels[id].index + dir);
}

// Placeholder for missing images — called via onerror inline
function placeholderSlide(label) {
  return `<div class="slide-placeholder">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="4" y="24" width="56" height="28" rx="4" fill="white"/>
      <path d="M8 24L32 8L56 24Z" fill="white"/>
      <rect x="12" y="30" width="10" height="10" rx="2" fill="#0F2D5E"/>
      <rect x="27" y="30" width="10" height="10" rx="2" fill="#0F2D5E"/>
      <rect x="42" y="30" width="10" height="10" rx="2" fill="#0F2D5E"/>
      <circle cx="18" cy="54" r="5" fill="#1A4A8A"/>
      <circle cx="46" cy="54" r="5" fill="#1A4A8A"/>
    </svg>
    <span>${label}</span>
    <span style="font-size:12px;opacity:.6">Фото будет добавлено</span>
  </div>`;
}

// Auto-advance every 5 seconds
function startAutoplay(id) {
  setInterval(() => moveCarousel(id, 1), 5000);
}

// Touch swipe support
function addSwipe(trackId, id) {
  const el = document.getElementById(trackId);
  let startX = 0;
  el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) moveCarousel(id, dx < 0 ? 1 : -1);
  }, { passive: true });
}

// Init all carousels on load
document.addEventListener('DOMContentLoaded', () => {
  initCarousel('wagons', 5);
  initCarousel('base', 3);
  initCarousel('accommodation', 3);

  addSwipe('trackWagons', 'wagons');
  addSwipe('trackBase', 'base');
  addSwipe('trackAccommodation', 'accommodation');

  startAutoplay('wagons');
  startAutoplay('base');
  startAutoplay('accommodation');
});

// ---- Mobile menu ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ---- Contact form ----
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  this.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

// ---- Smooth nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));
