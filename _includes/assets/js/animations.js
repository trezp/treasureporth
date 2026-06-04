document.addEventListener('DOMContentLoaded', function () {

  // Scroll fade-in with stagger for sibling elements
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    var siblings = Array.from(el.parentElement.children).filter(function (c) {
      return c.classList.contains('fade-in');
    });
    var index = siblings.indexOf(el);
    if (index > 0) {
      el.style.transitionDelay = (index * 0.08) + 's';
    }
    observer.observe(el);
  });

  // Hero particles
  var canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var colors = ['#5EEAD4', '#0D9488', '#8B45C4'];
  var animating = true;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.25 + 0.08
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < 45; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);

  // Pause when tab is hidden to save resources
  document.addEventListener('visibilitychange', function () {
    animating = !document.hidden;
    if (animating) draw();
  });

  init();
  draw();
});
