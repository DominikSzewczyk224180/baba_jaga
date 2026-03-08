document.addEventListener('DOMContentLoaded',()=>{
    // Intro overlay auto-hides via CSS animation
    const overlay=document.getElementById('introOverlay');
    setTimeout(()=>{if(overlay)overlay.style.display='none'},3000);

    // Navbar
    const nav=document.getElementById('navbar');
    window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>60));

    // Mobile nav
    const toggle=document.getElementById('navToggle'),links=document.getElementById('navLinks');
    toggle.addEventListener('click',()=>{toggle.classList.toggle('active');links.classList.toggle('active');document.body.style.overflow=links.classList.contains('active')?'hidden':''});
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.classList.remove('active');links.classList.remove('active');document.body.style.overflow=''}));

    // Menu tabs
    const tabs=document.querySelectorAll('.tab'),panels=document.querySelectorAll('.tp');
    tabs.forEach(t=>t.addEventListener('click',()=>{
        const id=t.dataset.tab;
        tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');
        panels.forEach(p=>{p.classList.remove('active');if(p.id==='tab-'+id){p.classList.add('active');animItems(p)}});
    }));

    function animItems(el){
        const items=el.querySelectorAll('.mi');
        items.forEach((m,i)=>{m.classList.remove('visible');m.style.transitionDelay=i*.04+'s';void m.offsetWidth;setTimeout(()=>m.classList.add('visible'),20)});
    }

    // Scroll reveal
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));

    // Menu items initial
    const menuSec=document.getElementById('menu');
    const mObs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){const ap=document.querySelector('.tp.active');if(ap)animItems(ap);mObs.disconnect()}},{threshold:.1});
    if(menuSec)mObs.observe(menuSec);

    // Hours
    const now=new Date(),day=now.getDay(),time=now.getHours()+now.getMinutes()/60;
    const sched={0:{o:16,c:21.5},4:{o:16,c:21},5:{o:16,c:21},6:{o:16,c:21.5}};
    document.querySelectorAll('.h-row[data-day]').forEach(r=>{if(+r.dataset.day===day)r.classList.add('today')});
    const st=document.getElementById('openStatus');
    if(st){
        const td=sched[day];
        if(td&&time>=td.o&&time<td.c){st.innerHTML='● Teraz otwarte!';st.className='h-status open'}
        else{st.className='h-status closed';let m='● Aktualnie zamknięte';
            if(td&&time<td.o)m+=' · Otwieramy dziś o '+td.o+':00';
            else{const dn=['niedzielę','poniedziałek','wtorek','środę','czwartek','piątek','sobotę'];for(let i=1;i<=7;i++){const nd=(day+i)%7;if(sched[nd]){m+=' · Otwieramy w '+dn[nd]+' o '+sched[nd].o+':00';break}}}
            st.innerHTML=m}
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}));

    // Active nav
    const secs=document.querySelectorAll('section[id]'),navAs=document.querySelectorAll('.nav-links a:not(.nav-cta)');
    window.addEventListener('scroll',()=>{const s=scrollY+150;secs.forEach(sec=>{const top=sec.offsetTop,h=sec.offsetHeight,id=sec.id;if(s>=top&&s<top+h)navAs.forEach(a=>{a.style.color='';if(a.getAttribute('href')==='#'+id)a.style.color='var(--acc)'})})});
});
