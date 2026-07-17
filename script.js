(function() {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('is-out');
      setTimeout(() => { document.querySelector('.hero').classList.add('is-in'); }, 300);
    }, 1200);
  });
  setTimeout(() => {
    document.getElementById('loader').classList.add('is-out');
    document.querySelector('.hero').classList.add('is-in');
  }, 2500);
  
  let lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, smoothTouch: false });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  
  const nav = document.getElementById('nav');
  const backTop = document.getElementById('backTop');
  const whatsapp = document.getElementById('whatsappFloat');
  
  function onScroll() {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('is-scrolled'); else nav.classList.remove('is-scrolled');
    if (y > window.innerHeight * 0.8) { backTop.classList.add('is-visible'); whatsapp.classList.add('is-visible'); } 
    else { backTop.classList.remove('is-visible'); whatsapp.classList.remove('is-visible'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
  
  backTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  document.querySelectorAll('.hero-title .inner, .manifesto .inner').forEach((el, i) => {
    if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i);
  });
  
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); revealObs.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal, .menu-card, .manifesto').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal, .menu-card, .manifesto').forEach(el => el.classList.add('is-in'));
  }
  
  if (!prefersReduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('#heroBg', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero-content', { y: 80, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 1 } });
  }
  
  const reviews = document.querySelectorAll('.review');
  const dots = document.querySelectorAll('.reviews-dot');
  let currentReview = 0;
  let reviewTimer;
  function showReview(i) {
    reviews.forEach(r => r.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));
    reviews[i].classList.add('is-active');
    if(dots[i]) dots[i].classList.add('is-active');
    currentReview = i;
  }
  function nextReview() { showReview((currentReview + 1) % reviews.length); }
  function prevReview() { showReview((currentReview - 1 + reviews.length) % reviews.length); }
  function startReviewTimer() { if (prefersReduced) return; clearInterval(reviewTimer); reviewTimer = setInterval(nextReview, 6000); }
  document.getElementById('reviewNext').addEventListener('click', () => { nextReview(); startReviewTimer(); });
  document.getElementById('reviewPrev').addEventListener('click', () => { prevReview(); startReviewTimer(); });
  dots.forEach(dot => { dot.addEventListener('click', () => { showReview(parseInt(dot.dataset.i)); startReviewTimer(); }); });
  startReviewTimer();
  
  const today = new Date().getDay();
  const todayLi = document.querySelector(`#hoursList li[data-day="${today}"]`);
  if (todayLi) todayLi.classList.add('today');
  
  const dateInput = document.getElementById('rDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.addEventListener('change', () => {
      const picked = new Date(dateInput.value);
      if (picked.getDay() === 1) {
        alert('We are closed on Mondays. Please choose another day — we are open Tuesday through Sunday.');
        dateInput.value = '';
      }
    });
  }
  
  const form = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');
  const formActions = document.getElementById('formActions');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    formActions.style.display = 'none';
    formSuccess.classList.add('is-visible');
    setTimeout(() => { formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
  });
  
  document.getElementById('year').textContent = new Date().getFullYear();
  
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) { lenis.scrollTo(target, { offset: -60, duration: 1.4 }); } 
      else {
        const top = target.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
