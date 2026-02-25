// ── Page Navigation ────────────────────────────────────

function showPage(pageId) {
    // Hide all pages and reset their animations
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.querySelectorAll('.fade-up').forEach(el => el.classList.remove('visible'));
    });

    const page = document.getElementById('page-' + pageId);
    if (!page) return;

    page.classList.add('active');
    window.scrollTo(0, 0);

    // Trigger staggered fade-up animations for the new page
    setTimeout(() => {
        page.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    }, 50);

    // Update active nav link highlight
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('page-active', a.dataset.pageNav === pageId);
    });

    // Nav style: transparent only on home (scroll-driven); always solid on sub-pages
    if (pageId === 'home') {
        navbar.classList.toggle('nav-scrolled', window.pageYOffset > 100);
    } else {
        navbar.classList.add('nav-scrolled');
    }
}

// Intercept all [data-page-nav] link clicks
document.addEventListener('click', e => {
    const link = e.target.closest('[data-page-nav]');
    if (!link) return;
    e.preventDefault();
    const pageId = link.dataset.pageNav;
    history.pushState(null, '', pageId === 'home' ? '#' : '#' + pageId);
    showPage(pageId);
});

// Browser back / forward button support
window.addEventListener('popstate', () => {
    const hash = location.hash.replace('#', '') || 'home';
    showPage(hash);
});

// ── Language Switching ─────────────────────────────────

function switchLang(lang) {
    if (lang === 'ko') {
        document.body.classList.add('korean');
        document.documentElement.lang = 'ko';
    } else {
        document.body.classList.remove('korean');
        document.documentElement.lang = 'en';
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active');
    });

    localStorage.setItem('korchip-lang', lang);
}

const savedLang = localStorage.getItem('korchip-lang');
if (savedLang === 'ko') switchLang('ko');

// ── Navbar Scroll Effect ───────────────────────────────

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    // Only apply scroll-based nav style on the home page
    const isHome = document.getElementById('page-home').classList.contains('active');
    if (isHome) {
        navbar.classList.toggle('nav-scrolled', window.pageYOffset > 100);
    }
});

// ── Mobile Menu ─────────────────────────────────────────

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenuBtn.classList.toggle('open', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close when a nav link inside the drawer is tapped
mobileMenu.addEventListener('click', e => {
    if (e.target.closest('[data-page-nav]')) {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

// ── Initial Page Load ──────────────────────────────────

const initialPage = location.hash.replace('#', '') || 'home';
showPage(initialPage);
