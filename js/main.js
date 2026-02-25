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
if (savedLang === 'ko') {
    switchLang('ko');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});