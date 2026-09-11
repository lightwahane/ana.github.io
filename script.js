/* =========================================================
   ALL THE TOMORROWS — INTERACTION ENGINE
   ---------------------------------------------------------
   QUICK CUSTOMIZATION:
   1) Replace text directly in index.html.
   2) Replace photos in /assets/photo1.jpg, photo2.jpg, photo3.jpg.
   3) Put your own music at /assets/music.mp3.
   4) Change animation speed in :root { --speed: 1; } in style.css.
   5) Change colors in the :root variables in style.css.
   ========================================================= */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;
const scenes = [...document.querySelectorAll(".scene")];
const progressBar = document.getElementById("progressBar");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const yesButton = document.getElementById("yesButton");
const celebration = document.getElementById("celebration");
const easterEgg = document.getElementById("easterEgg");
const secret = document.getElementById("secret");

function scrollToScene(index) {
  const target = scenes[index];
  if (!target) return;
  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => scrollToScene(1));
});

/* Scene activation: animations are triggered as each chapter enters view. */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.28 });

scenes.forEach(scene => observer.observe(scene));

/* Progress bar + subtle camera/parallax effect. */
let raf = null;
function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;

  if (!reducedMotion) {
    document.querySelectorAll(".memory-frame[data-depth]").forEach((frame) => {
      const rect = frame.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const distance = (rect.top + rect.height / 2 - center) / window.innerHeight;
      const depth = Number(frame.dataset.depth || 1);
      const y = distance * -18 * depth;
      const rotate = distance * 1.2;
      frame.style.setProperty("--scroll-y", `${y}px`);
      frame.style.setProperty("--scroll-r", `${rotate}deg`);
      frame.style.translate = `0 ${y}px`;
      frame.style.rotate = `${rotate}deg`;
    });
  }
  raf = null;
}

window.addEventListener("scroll", () => {
  if (!raf) raf = requestAnimationFrame(updateScrollEffects);
}, { passive: true });
updateScrollEffects();

/* Gentle pointer/touch tilt on photos. */
if (!reducedMotion && !isTouch) {
  document.querySelectorAll(".memory-frame").forEach(frame => {
    const move = (x, y) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (x - rect.left) / rect.width - .5;
      const py = (y - rect.top) / rect.height - .5;
      const tiltX = py * -4;
      const tiltY = px * 5;
      frame.style.transform = `perspective(1200px) translateY(var(--scroll-y, 0px)) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(var(--scroll-r, 0deg))`;
    };
    frame.addEventListener("pointermove", e => move(e.clientX, e.clientY));
    frame.addEventListener("pointerleave", () => {
      frame.style.transform = `perspective(1200px) translateY(var(--scroll-y, 0px)) rotateZ(var(--scroll-r, 0deg))`;
    });
  });
}


/* Section-local camera progress. CSS can use --scene-progress for future polish. */
function updateSceneProgress() {
  if (reducedMotion) return;
  scenes.forEach(scene => {
    const r = scene.getBoundingClientRect();
    const center = innerHeight * 0.5;
    const progress = Math.max(-1, Math.min(1, (center - (r.top + r.height / 2)) / Math.max(r.height / 2, 1)));
    scene.style.setProperty("--scene-progress", progress.toFixed(3));
  });
}
window.addEventListener("scroll", () => requestAnimationFrame(updateSceneProgress), { passive: true });
updateSceneProgress();

/* Ambient particle field — one canvas instead of hundreds of DOM nodes. */
const particleCanvas = document.getElementById("particles");
const pctx = particleCanvas.getContext("2d", { alpha: true });
const particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas(canvas, ctx) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(90, Math.max(36, Math.floor(window.innerWidth / 13)));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.25 + .2,
      a: Math.random() * .5 + .08,
      speed: Math.random() * .18 + .03,
      drift: (Math.random() - .5) * .08,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function drawParticles(time = 0) {
  if (reducedMotion) return;
  pctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -5) p.y = innerHeight + 5;
    if (p.x < -5) p.x = innerWidth + 5;
    if (p.x > innerWidth + 5) p.x = -5;
    const twinkle = p.a * (0.72 + Math.sin(time * .001 + p.phase) * .28);
    pctx.beginPath();
    pctx.fillStyle = `rgba(231, 200, 137, ${Math.max(.03, twinkle)})`;
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fill();
  }
  requestAnimationFrame(drawParticles);
}

function resizeParticleField() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  resizeCanvas(particleCanvas, pctx);
  seedParticles();
}
resizeParticleField();
window.addEventListener("resize", resizeParticleField);

if (!reducedMotion) requestAnimationFrame(drawParticles);

/* Optional music. Browsers require a user gesture before audio starts. */
musicToggle.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicLabel.textContent = "♪ Playing";
      musicToggle.classList.add("playing");
    } else {
      music.pause();
      musicLabel.textContent = "♪ Music";
      musicToggle.classList.remove("playing");
    }
  } catch (err) {
    musicLabel.textContent = "♪ Add music.mp3";
    console.info("Optional music is not available yet. Add assets/music.mp3.", err);
  }
});

/* Celebration particle burst. */
const cCanvas = document.getElementById("celebrationCanvas");
const cctx = cCanvas.getContext("2d", { alpha: true });
let celebrationParticles = [];
let celebrationRunning = false;

function resizeCelebration() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  cCanvas.width = Math.floor(innerWidth * ratio);
  cCanvas.height = Math.floor(innerHeight * ratio);
  cCanvas.style.width = `${innerWidth}px`;
  cCanvas.style.height = `${innerHeight}px`;
  cctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function burstParticles() {
  celebrationParticles = [];
  const count = 260;
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 7 + 2;
    celebrationParticles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: Math.random() * 110 + 80,
      maxLife: 190,
      size: Math.random() * 2.8 + .5,
      type: Math.random() > .72 ? "heart" : "dot"
    });
  }
}

function drawCelebration() {
  if (!celebrationRunning) return;
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of celebrationParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= .988;
    p.vy = p.vy * .988 + .035;
    p.life--;
    const alpha = Math.max(0, p.life / p.maxLife);
    cctx.save();
    cctx.globalAlpha = alpha;
    cctx.fillStyle = p.type === "heart" ? "rgba(217,139,158,.9)" : "rgba(255,233,174,.9)";
    if (p.type === "heart") {
      cctx.font = `${Math.max(8, p.size * 5)}px serif`;
      cctx.fillText("♥", p.x, p.y);
    } else {
      cctx.beginPath();
      cctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      cctx.fill();
    }
    cctx.restore();
  }
  celebrationParticles = celebrationParticles.filter(p => p.life > 0);
  requestAnimationFrame(drawCelebration);
}

yesButton.addEventListener("click", () => {
  celebration.classList.add("active");
  celebration.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  resizeCelebration();
  burstParticles();
  celebrationRunning = true;
  drawCelebration();
});

window.addEventListener("resize", resizeCelebration);

easterEgg.addEventListener("click", () => {
  secret.classList.add("show");
  easterEgg.textContent = "♥";
  easterEgg.setAttribute("aria-label", "A little secret");
});

/* Allow keyboard navigation between scenes. */
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    const current = scenes.findIndex(scene => {
      const r = scene.getBoundingClientRect();
      return r.top <= innerHeight * .45 && r.bottom >= innerHeight * .45;
    });
    scrollToScene(Math.min(current + 1, scenes.length - 1));
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    const current = scenes.findIndex(scene => {
      const r = scene.getBoundingClientRect();
      return r.top <= innerHeight * .45 && r.bottom >= innerHeight * .45;
    });
    scrollToScene(Math.max(current - 1, 0));
  }
});
