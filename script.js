document.addEventListener('DOMContentLoaded', () => {
    // Intro - hide after animation
    setTimeout(() => {
        const i = document.getElementById('intro');
        if (i) i.style.display = 'none';
    }, 3200);

    // Nav scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

    // Mobile menu
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        ham.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }));

    // Tabs
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById('p-' + t.dataset.t).classList.add('active');
    }));

    // Hours
    const now = new Date(), day = now.getDay(), time = now.getHours() + now.getMinutes() / 60;
    const sched = { 0: [16, 21.5], 4: [16, 21], 5: [16, 21], 6: [16, 21.5] };
    document.querySelectorAll('.hr[data-day]').forEach(r => { if (+r.dataset.day === day) r.classList.add('today') });
    const st = document.getElementById('status');
    const td = sched[day];
    if (td && time >= td[0] && time < td[1]) {
        st.textContent = 'Teraz otwarte!';
        st.className = 'open';
    } else {
        let msg = 'Aktualnie zamknięte';
        if (td && time < td[0]) msg += ' · Otwieramy dziś o ' + td[0] + ':00';
        else {
            const dn = ['niedzielę','pon.','wt.','śr.','czwartek','piątek','sobotę'];
            for (let i = 1; i <= 7; i++) { const nd = (day + i) % 7; if (sched[nd]) { msg += ' · Otwieramy w ' + dn[nd] + ' o ' + sched[nd][0] + ':00'; break; } }
        }
        st.textContent = msg;
        st.className = 'closed';
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    }));
});
