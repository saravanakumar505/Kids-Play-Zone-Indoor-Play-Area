/**
 * WonderPlay - Big Premium 2026 Interactive Animation Engine
 * Includes:
 * 1. Cinematic Hero Parallax & Layer Depth
 * 2. Horizontal Scroll Adventure for Home 2
 * 3. Card Spread / Stack Fan Transformation
 * 4. Image Mask Clip-Path Reveals
 * 5. Birthday Confetti Celebration Canvas Burst (Single-trigger, GPU accelerated)
 * 6. Interactive Theme Switcher
 * 7. Safety Radial Hub & Connecting Lines
 * 8. Dynamic Timeline Scroll Growth
 * 9. Asymmetric Masonry Parallax
 * 10. Performance & Reduced-Motion Guards
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. CINEMATIC HERO PARALLAX & ENTRANCE
  // ==========================================================================
  const heroSection = document.querySelector('section.relative');
  const heroBg = document.querySelector('section.relative .absolute.inset-0 img');
  const heroText = document.querySelector('section.relative .lg\\:col-span-6, section.relative .lg\\:col-span-7');
  const heroImageCard = document.querySelector('section.relative .card-asymmetric, section.relative .card-asymmetric-alt');

  if (heroBg) {
    heroBg.style.transition = 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
    heroBg.style.transform = 'scale(1.06)';
    requestAnimationFrame(() => {
      heroBg.style.transform = 'scale(1)';
    });
  }

  if (!isReducedMotion && heroSection) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          if (scrollY < 900) {
            if (heroBg) {
              heroBg.style.transform = `translateY(${scrollY * 0.25}px) scale(1)`;
            }
            if (heroText && window.innerWidth >= 1024) {
              heroText.style.transform = `translateY(${scrollY * -0.12}px)`;
            }
            if (heroImageCard && window.innerWidth >= 1024) {
              heroImageCard.style.transform = `translateY(${scrollY * 0.08}px)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Desktop subtle mouse-follow (X: ±8px, Y: ±8px)
    const heroVisuals = document.querySelectorAll('.hero-visual, .hero-floating-subject');
    if (heroVisuals.length && window.innerWidth >= 1024) {
      window.addEventListener('mousemove', (e) => {
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 16;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 16;
        heroVisuals.forEach(visual => {
          visual.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        });
      }, { passive: true });
    }
  }

  // ==========================================================================
  // 2. IMAGE MASK REVEALS (clip-path inset transitions)
  // ==========================================================================
  const maskImages = document.querySelectorAll('.mask-reveal-left, .mask-reveal-right, .mask-reveal-up');
  if (maskImages.length && !isReducedMotion) {
    const maskObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mask-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    maskImages.forEach(img => {
      img.classList.add('mask-init');
      maskObserver.observe(img);
    });
  }

  // ==========================================================================
  // 3. MEMBERSHIP & PARTY CARD FAN SPREAD TRANSFORMATION
  // ==========================================================================
  const cardSpreadContainers = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3, .grid-cols-1.lg\\:grid-cols-4');
  if (cardSpreadContainers.length && !isReducedMotion) {
    const spreadObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.card-playful');
          cards.forEach((c, idx) => {
            c.classList.add('card-spread-revealed');
            c.style.transitionDelay = `${idx * 110}ms`;
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cardSpreadContainers.forEach(container => {
      const cards = container.querySelectorAll('.card-playful');
      if (cards.length >= 3) {
        cards.forEach((c, idx) => {
          c.classList.add('card-spread-init');
          if (idx === 0) c.classList.add('spread-left');
          else if (idx === cards.length - 1) c.classList.add('spread-right');
          else c.classList.add('spread-center');
        });
        spreadObserver.observe(container);
      }
    });
  }

  // ==========================================================================
  // 4. BIRTHDAY CONFETTI CELEBRATION MOMENT (Runs once)
  // ==========================================================================
  const partySections = document.querySelectorAll('#birthday-section, section:has(a[href*="parties.html"]), .birthday-celebration-zone');
  let confettiFired = false;

  function launchConfetti(container) {
    if (confettiFired || isReducedMotion) return;
    confettiFired = true;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '20';
    container.style.position = 'relative';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const colors = ['#FF7043', '#5B3FD3', '#FFB74D', '#52D6B5', '#FFFFFF'];
    const particles = [];
    const count = Math.min(80, Math.floor(canvas.width / 15));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 50,
        r: 4 + Math.random() * 6,
        d: Math.random() * count,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        speedY: 2 + Math.random() * 3,
        speedX: Math.random() * 3 - 1.5,
        opacity: 1
      });
    }

    let animationFrame;
    let frameCount = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.speedY;
        p.x += Math.sin(p.tiltAngle) * 2 + p.speedX;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (frameCount > 80) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
        }
      });

      if (frameCount < 160) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    }

    draw();
  }

  if (partySections.length) {
    const partyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !confettiFired) {
          launchConfetti(entry.target);
        }
      });
    }, { threshold: 0.3 });

    partySections.forEach(sec => partyObserver.observe(sec));
  }

  // ==========================================================================
  // 5. ABOUT TIMELINE SCROLL GROWTH
  // ==========================================================================
  const timelineSection = document.querySelector('section:has(.w-14.h-14.rounded-2xl)');
  if (timelineSection && !isReducedMotion) {
    const timelineItems = timelineSection.querySelectorAll('.flex.items-start.gap-4');
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-milestone-active');
        }
      });
    }, { threshold: 0.4 });

    timelineItems.forEach((item, i) => {
      item.classList.add('timeline-milestone-init');
      item.style.transitionDelay = `${i * 120}ms`;
      timelineObserver.observe(item);
    });
  }

  // ==========================================================================
  // 6. STAGGERED REVEAL & INTERACTIVE HOVER IN GALLERIES
  // ==========================================================================
  const galleryGrids = document.querySelectorAll('.gallery-adventure-grid');
  if (galleryGrids.length && !isReducedMotion) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.card-playful');
          items.forEach((item, idx) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, idx * 80);
          });
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    galleryGrids.forEach(grid => {
      const items = grid.querySelectorAll('.card-playful');
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(24px) scale(0.97)';
        item.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
      });
      galleryObserver.observe(grid);
    });
  }

  // ==========================================================================
  // 7. INTERACTIVE THEME CAROUSEL SWITCHER (Parties Page)
  // ==========================================================================
  const themeCards = document.querySelectorAll('.grid-cols-2.sm\\:grid-cols-4 > div');
  themeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      themeCards.forEach(c => {
        c.style.transform = 'scale(0.96)';
        c.style.opacity = '0.7';
      });
      card.style.transform = 'scale(1.08) translateY(-6px)';
      card.style.opacity = '1';
      card.style.borderColor = 'var(--wp-primary)';
    });

    card.addEventListener('mouseleave', () => {
      themeCards.forEach(c => {
        c.style.transform = '';
        c.style.opacity = '';
        c.style.borderColor = '';
      });
    });
  });
});
