// BigLand Construction — shared JS (no framework, no build step)

// ── Page loader ──
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const bar = loader.querySelector('.loader-bar');
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 22, 95);
    if (bar) bar.style.width = p + '%';
  }, 120);
  setTimeout(() => {
    clearInterval(iv);
    if (bar) bar.style.width = '100%';
    setTimeout(() => loader.classList.add('done'), 350);
  }, 900);
});

// ── Navbar scroll class + active link ──
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.textContent = '☰';
      }
    });
  }

  // Animated counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          el.textContent = Math.round(ease * target);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  // Scroll reveal
  observeReveal();
});

function observeReveal() {
  const items = document.querySelectorAll('.reveal:not(.in-view),.reveal-l:not(.in-view),.reveal-r:not(.in-view)');
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => ro.observe(el));
}

// ── Scroll to section ──
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = 'index.html#' + id;
  }
  const links = document.getElementById('navLinks');
  if (links) links.classList.remove('open');
}
