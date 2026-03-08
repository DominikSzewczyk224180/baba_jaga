/* ============================================
   BABA JAGA – Pizzeria & Ogródek Piwny
   JavaScript – Interaktywność strony
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAVBAR SCROLL ───
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ─── MOBILE NAV TOGGLE ───
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Zamknij menu po kliknięciu linku
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ─── MENU TABS ───
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `tab-${target}`) {
                    p.classList.add('active');
                }
            });
        });
    });

    // ─── SCROLL REVEAL ANIMATION ───
    const revealElements = document.querySelectorAll(
        '.section-tag, .section-title, .about-desc, .feature, .about-img-wrap, ' +
        '.about-stats, .menu-tabs, .menu-panel, .gallery-item, .fb-post, ' +
        '.contact-item, .contact-hours, .map-wrap, .menu-extras, .menu-note'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── STAT COUNTER ANIMATION ───
    const statNums = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        statNums.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const start = performance.now();

            const updateCounter = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(eased * target);

                // Formatowanie
                if (target === 5) {
                    stat.textContent = (eased * 5).toFixed(1);
                } else {
                    stat.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target === 5) {
                        stat.textContent = '5.0';
                    } else if (target === 995) {
                        stat.textContent = '995+';
                    }
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ─── OPEN/CLOSED STATUS ───
    const updateOpenStatus = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = niedziela
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour + minute / 60;

        const statusEl = document.getElementById('openStatus');
        if (!statusEl) return;

        // Mapowanie dni na godziny
        const schedule = {
            0: { open: 16, close: 21.5, id: 'hours-sun' },       // Niedziela
            1: null,                                                // Poniedziałek
            2: null,                                                // Wtorek
            3: null,                                                // Środa
            4: { open: 16, close: 21, id: 'hours-thu' },          // Czwartek
            5: { open: 16, close: 21, id: 'hours-fri' },          // Piątek
            6: { open: 16, close: 21.5, id: 'hours-sat' },        // Sobota
        };

        const today = schedule[day];

        // Zaznacz dzisiejszy dzień
        const dayIds = ['hours-sun', null, null, null, 'hours-thu', 'hours-fri', 'hours-sat'];
        const todayId = dayIds[day];
        if (todayId) {
            const todayRow = document.getElementById(todayId);
            if (todayRow) todayRow.classList.add('today');
        }

        if (today && time >= today.open && time < today.close) {
            statusEl.textContent = '🟢 Teraz otwarte!';
            statusEl.className = 'hours-status open';
        } else {
            statusEl.textContent = '🔴 Aktualnie zamknięte';
            statusEl.className = 'hours-status closed';

            // Znajdź następny dzień otwarcia
            for (let i = 1; i <= 7; i++) {
                const nextDay = (day + i) % 7;
                const nextSchedule = schedule[nextDay];
                if (nextSchedule) {
                    const dayNames = ['niedzielę', 'poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę'];
                    if (i === 0 && today && time < today.open) {
                        statusEl.textContent += ` · Otwieramy dziś o ${today.open}:00`;
                    } else {
                        statusEl.textContent += ` · Otwieramy w ${dayNames[nextDay]} o ${nextSchedule.open}:00`;
                    }
                    break;
                }
            }
        }
    };

    updateOpenStatus();

    // ─── SMOOTH SCROLL (fallback) ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── ACTIVE NAV HIGHLIGHT ───
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(item => {
                    item.style.color = '';
                    if (item.getAttribute('href') === `#${id}`) {
                        item.style.color = 'var(--clr-accent)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // ─── FB POSTS STAGGERED ANIMATION ───
    const fbPosts = document.querySelectorAll('.fb-post');
    fbPosts.forEach((post, i) => {
        post.style.transitionDelay = `${i * 0.15}s`;
    });

});
