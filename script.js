/* ============================================
   BABA JAGA – Advanced JavaScript
   Loading screen, scroll reveals, stagger
   animations, open/closed status
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── LOADING SCREEN ───
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 1800);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => loader.classList.add('hidden'), 1800);
    }

    // ─── NAVBAR ───
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
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `tab-${target}`) {
                    p.classList.add('active');
                    // Animate menu items in new panel
                    animateMenuItems(p);
                }
            });
        });
    });

    // ─── SCROLL REVEAL ───
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // ─── STAGGERED MENU ITEMS ───
    function animateMenuItems(container) {
        const items = container.querySelectorAll('.mitem');
        items.forEach((item, i) => {
            item.classList.remove('visible');
            item.style.transitionDelay = `${i * 0.05}s`;
            // Trigger reflow
            void item.offsetWidth;
            setTimeout(() => item.classList.add('visible'), 20);
        });
    }

    // Initial animation for active panel
    const menuSection = document.getElementById('menu');
    const menuObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const activePanel = document.querySelector('.tab-panel.active');
            if (activePanel) animateMenuItems(activePanel);
            menuObserver.disconnect();
        }
    }, { threshold: 0.1 });
    if (menuSection) menuObserver.observe(menuSection);

    // ─── PARALLAX DECORATIONS ───
    const decoElements = document.querySelectorAll('.hero-deco, .section-deco');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        decoElements.forEach(el => {
            const speed = 0.03;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.transform = `translateY(${scrollY * speed}px) ${el.style.transform?.replace(/translateY\([^)]+\)/, '') || ''}`;
            }
        });
    }, { passive: true });

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
        document.querySelectorAll('.h-row[data-day]').forEach(row => {
            if (parseInt(row.dataset.day) === day) row.classList.add('today');
        });

        const today = schedule[day];
        if (today && time >= today.open && time < today.close) {
            statusEl.innerHTML = '<span style="font-size:1.1em">●</span> Teraz otwarte!';
            statusEl.className = 'h-status open';
        } else {
            statusEl.className = 'h-status closed';
            const dayNames = ['niedzielę', 'poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę'];
            let msg = '<span style="font-size:1.1em">●</span> Aktualnie zamknięte';

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
            statusEl.innerHTML = msg;
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
                    item.classList.remove('nav-active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('nav-active');
                    }
                });
            }
        });
    });
});
