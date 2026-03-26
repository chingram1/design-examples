// ============================================
// DESIGN TRENDS 2026 — Interactive Scripts
// ============================================

(function () {
  'use strict';

  // --- Cursor Glow ---
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    if (cursorGlow) {
      cursorGlow.style.left = mouseX + 'px';
      cursorGlow.style.top = mouseY + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
      });
    });
  }

  // --- Scroll Reveal ---
  const scrollElements = document.querySelectorAll('[data-scroll]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => observer.observe(el));

  // --- Hero Canvas Background ---
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animId;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((width * height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.05
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        width * 0.3, height * 0.4, 0,
        width * 0.3, height * 0.4, width * 0.8
      );
      gradient.addColorStop(0, 'rgba(0, 60, 62, 0.15)');
      gradient.addColorStop(0.5, 'rgba(0, 30, 31, 0.08)');
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Second gradient
      const gradient2 = ctx.createRadialGradient(
        width * 0.7, height * 0.6, 0,
        width * 0.7, height * 0.6, width * 0.6
      );
      gradient2.addColorStop(0, 'rgba(255, 107, 26, 0.06)');
      gradient2.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 237, 229, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 160, 163, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!animId) drawParticles();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    heroObserver.observe(canvas);
  }

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('.section, .philosophy-section');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text)';
          }
        });
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
  });

  // --- Swatch hover tooltips ---
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('mouseenter', function () {
      const bg = this.style.background || this.style.backgroundColor;
      this.title = bg;
    });
  });

  // --- Parallax-lite on hero elements ---
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        const content = hero.querySelector('.hero-content');
        if (content) {
          content.style.transform = `translateY(${scrollY * 0.2}px)`;
          content.style.opacity = 1 - progress * 0.8;
        }
      }
    }, { passive: true });
  }
})();
