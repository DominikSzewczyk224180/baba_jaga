/* ============================================
   BABA JAGA – Pizzeria & Ogródek Piwny
   JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAVBAR SCROLL ───
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 60);
    });

    // ─── MOBILE NAV ───
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ─── MENU TABS ───
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `tab-${target}`) p.classList.add('active');
            });
        });
    });

    // ─── SCROLL REVEAL ───
    const revealSelectors = [
        '.chalk-heading', '.chalk-underline', '.about-text', '.about-badges',
        '.about-img-frame', '.about-features', '.menu-header', '.menu-tabs',
        '.tab-content', '.gallery-main', '.gallery-thumb', '.fb-post',
        '.contact-block', '.hours-card', '.map-container', '.menu-original',
        '.menu-footer-note', '.fb-link', '.feat', '.badge'
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(', '));
    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // ─── OPEN/CLOSED STATUS ───
    const updateStatus = () => {
        const now = new Date();
        const day = now.getDay();
        const time = now.getHours() + now.getMinutes() / 60;
        const statusEl = document.getElementById('openStatus');
        if (!statusEl) return;

        const schedule = {
            0: { open: 16, close: 21.5 },
            4: { open: 16, close: 21 },
            5: { open: 16, close: 21 },
            6: { open: 16, close: 21.5 },
        };

        // Highlight today
        document.querySelectorAll('.hours-row[data-day]').forEach(row => {
            if (parseInt(row.dataset.day) === day) row.classList.add('today');
        });

        const today = schedule[day];
        if (today && time >= today.open && time < today.close) {
            statusEl.textContent = '🟢 Teraz otwarte!';
            statusEl.className = 'hours-status open';
        } else {
            statusEl.className = 'hours-status closed';
            const dayNames = ['niedzielę', 'poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę'];
            let msg = '🔴 Aktualnie zamknięte';

            // Check if opens later today
            if (today && time < today.open) {
                msg += ` · Otwieramy dziś o ${today.open}:00`;
            } else {
                for (let i = 1; i <= 7; i++) {
                    const nextDay = (day + i) % 7;
                    if (schedule[nextDay]) {
                        msg += ` · Otwieramy w ${dayNames[nextDay]} o ${schedule[nextDay].open}:00`;
                        break;
                    }
                }
            }
            statusEl.textContent = msg;
        }
    };

    updateStatus();

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── ACTIVE NAV LINK ───
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(item => {
                    item.style.color = '';
                    if (item.getAttribute('href') === `#${id}`) {
                        item.style.color = 'var(--white)';
                    }
                });
            }
        });
    });
});
