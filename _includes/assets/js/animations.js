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

  // Hero sparkles
  var canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var colors = ['#5EEAD4', '#A5F3FC', '#8B45C4', '#C084FC', '#ffffff'];
  var animating = true;
  var clearZone = null;
  var padding = 24;

  function updateClearZone() {
    var textEl = document.querySelector('.hero__text');
    if (!textEl) { clearZone = null; return; }
    var canvasRect = canvas.getBoundingClientRect();
    var textRect = textEl.getBoundingClientRect();
    clearZone = {
      left:   textRect.left   - canvasRect.left - padding,
      top:    textRect.top    - canvasRect.top  - padding,
      right:  textRect.right  - canvasRect.left + padding,
      bottom: textRect.bottom - canvasRect.top  + padding
    };
  }

  function inClearZone(x, y) {
    if (!clearZone) return false;
    return x > clearZone.left && x < clearZone.right &&
           y > clearZone.top  && y < clearZone.bottom;
  }

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    updateClearZone();
  }

  function drawSparkle(x, y, r, color, opacity, rotation) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var angle = (i * Math.PI) / 4;
      var radius = i % 2 === 0 ? r : r * 0.25;
      var px = Math.cos(angle) * radius;
      var py = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      baseOpacity: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      twinkleAmount: Math.random() * 0.3 + 0.15,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008
    };
  }

  function init() {
    resize();
    updateClearZone();
    particles = [];
    for (var i = 0; i < 70; i++) {
      particles.push(createParticle());
    }
  }

  function draw(timestamp) {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      if (inClearZone(p.x, p.y)) return;
      var twinkle = Math.sin((timestamp || 0) * p.twinkleSpeed + p.phase);
      var opacity = Math.max(0, Math.min(1, p.baseOpacity + twinkle * p.twinkleAmount));
      p.rotation += p.rotationSpeed;
      drawSparkle(p.x, p.y, p.r, p.color, opacity, p.rotation);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10 || p.x > canvas.width + 10) p.vx *= -1;
      if (p.y < -10 || p.y > canvas.height + 10) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', function () {
    animating = !document.hidden;
    if (animating) draw();
  });

  init();
  requestAnimationFrame(draw);
});
