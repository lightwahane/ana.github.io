/* =========================================================
   ALL THE TOMORROWS — INTERACTION ENGINE
   ---------------------------------------------------------
   SINGLE-FOLDER VERSION
   ---------------------------------------------------------
   QUICK CUSTOMIZATION:

   FILES:
   - photo1.jpg  = first memory
   - photo2.jpg  = second memory
   - photo3.jpg  = final memory
   - love.mp3    = optional background music

   ALL FILES ARE IN THE SAME FOLDER AS index.html.

   TEXT:
   - Change the story text directly in index.html.

   COLORS:
   - Change CSS variables in style.css.

   ANIMATION SPEED:
   - Change --speed in style.css.

   PARTICLES:
   - Change PARTICLE_COUNT below.

   IMPORTANT:
   No "assets/" folder is required.
   ========================================================= */


/* =========================================================
   GLOBAL SETTINGS
   ========================================================= */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouch = window.matchMedia(
  "(hover: none)"
).matches;


/* =========================================================
   EASY CUSTOMIZATION
   ========================================================= */

// Number of ambient particles.
// Lower this number if an older phone feels slow.
const PARTICLE_COUNT_DESKTOP = 90;
const PARTICLE_COUNT_MOBILE = 45;

// Celebration particle count.
const CELEBRATION_PARTICLE_COUNT = 220;

// Music file.
// IMPORTANT: love.mp3 must be in the SAME folder as index.html.
const MUSIC_FILE = "love.mp3";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const scenes = [
  ...document.querySelectorAll(".scene")
];

const progressBar =
  document.getElementById("progressBar");

const music =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

const musicLabel =
  document.getElementById("musicLabel");

const yesButton =
  document.getElementById("yesButton");

const celebration =
  document.getElementById("celebration");

const easterEgg =
  document.getElementById("easterEgg");

const secret =
  document.getElementById("secret");

const particleCanvas =
  document.getElementById("particles");

const cCanvas =
  document.getElementById("celebrationCanvas");


/* =========================================================
   SAFETY CHECKS
   ---------------------------------------------------------
   These prevent the page from breaking if an optional
   element hasn't been added yet.
   ========================================================= */

if (music) {
  music.src = MUSIC_FILE;
}


/* =========================================================
   SCENE NAVIGATION
   ========================================================= */

function scrollToScene(index) {

  const target = scenes[index];

  if (!target) return;

  target.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start"
  });
}


/*
   Any element with data-next will move to the next scene.

   Example:

   <button data-next>Continue</button>
*/

document.querySelectorAll("[data-next]").forEach((button) => {

  button.addEventListener("click", () => {

    const currentIndex = scenes.findIndex(scene => {

      const rect = scene.getBoundingClientRect();

      return (
        rect.top <= window.innerHeight * 0.55 &&
        rect.bottom >= window.innerHeight * 0.55
      );

    });

    const nextIndex =
      currentIndex >= 0
        ? Math.min(currentIndex + 1, scenes.length - 1)
        : 1;

    scrollToScene(nextIndex);

  });

});


/* =========================================================
   SCENE ACTIVATION
   ---------------------------------------------------------
   Animations begin when a scene enters the viewport.
   ========================================================= */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("is-visible");

      }

    });

  },
  {
    threshold: 0.28
  }
);


scenes.forEach((scene) => {

  observer.observe(scene);

});


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

let scrollRAF = null;

function updateScrollEffects() {

  const scrollTop =
    window.scrollY;

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    maxScroll > 0
      ? (scrollTop / maxScroll) * 100
      : 0;


  if (progressBar) {

    progressBar.style.width =
      `${progress}%`;

  }


  /* -------------------------------------------------------
     PHOTO DEPTH / PARALLAX
     ------------------------------------------------------- */

  if (!reducedMotion) {

    document
      .querySelectorAll(".memory-frame[data-depth]")
      .forEach((frame) => {

        const rect =
          frame.getBoundingClientRect();

        const center =
          window.innerHeight / 2;

        const distance =
          (
            rect.top +
            rect.height / 2 -
            center
          ) / window.innerHeight;

        const depth =
          Number(frame.dataset.depth || 1);

        const y =
          distance * -18 * depth;

        const rotate =
          distance * 1.2;


        frame.style.setProperty(
          "--scroll-y",
          `${y}px`
        );

        frame.style.setProperty(
          "--scroll-r",
          `${rotate}deg`
        );


        /*
           Don't replace transform here.

           The pointer interaction below also uses
           transform, so CSS variables are used
           to keep everything compatible.
        */

        frame.style.setProperty(
          "--parallax-y",
          `${y}px`
        );

        frame.style.setProperty(
          "--parallax-r",
          `${rotate}deg`
        );

      });

  }


  scrollRAF = null;

}


window.addEventListener(
  "scroll",
  () => {

    if (!scrollRAF) {

      scrollRAF =
        requestAnimationFrame(
          updateScrollEffects
        );

    }

  },
  { passive: true }
);


updateScrollEffects();


/* =========================================================
   SECTION-LOCAL CAMERA PROGRESS
   ---------------------------------------------------------
   CSS can use:

   var(--scene-progress)

   for additional cinematic effects.
   ========================================================= */

function updateSceneProgress() {

  if (reducedMotion) return;

  scenes.forEach((scene) => {

    const rect =
      scene.getBoundingClientRect();

    const center =
      window.innerHeight * 0.5;

    const progress =
      Math.max(
        -1,
        Math.min(
          1,
          (
            center -
            (
              rect.top +
              rect.height / 2
            )
          ) /
          Math.max(rect.height / 2, 1)
        )
      );


    scene.style.setProperty(
      "--scene-progress",
      progress.toFixed(3)
    );

  });

}


window.addEventListener(
  "scroll",
  () => requestAnimationFrame(updateSceneProgress),
  { passive: true }
);


updateSceneProgress();


/* =========================================================
   PHOTO PARALLAX
   ---------------------------------------------------------
   Desktop only.

   On phones we rely mainly on scroll movement.
   ========================================================= */

if (!reducedMotion && !isTouch) {

  document
    .querySelectorAll(".memory-frame")
    .forEach((frame) => {

      const resetTransform = () => {

        frame.style.transform =
          `perspective(1200px)
           translateY(var(--parallax-y, 0px))
           rotateZ(var(--parallax-r, 0deg))`;

      };


      const move = (x, y) => {

        const rect =
          frame.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }


        const px =
          (x - rect.left) /
          rect.width -
          0.5;

        const py =
          (y - rect.top) /
          rect.height -
          0.5;


        const tiltX =
          py * -4;

        const tiltY =
          px * 5;


        frame.style.transform =
          `perspective(1200px)
           translateY(var(--parallax-y, 0px))
           rotateX(${tiltX}deg)
           rotateY(${tiltY}deg)
           rotateZ(var(--parallax-r, 0deg))`;

      };


      frame.addEventListener(
        "pointermove",
        (event) => {

          move(
            event.clientX,
            event.clientY
          );

        }
      );


      frame.addEventListener(
        "pointerleave",
        resetTransform
      );

    });

}


/* =========================================================
   AMBIENT PARTICLE FIELD
   ---------------------------------------------------------
   Uses ONE canvas instead of hundreds of DOM elements.
   This is much better for mobile performance.
   ========================================================= */

let pctx = null;
let particles = [];
let dpr =
  Math.min(
    window.devicePixelRatio || 1,
    2
  );


if (particleCanvas) {

  pctx =
    particleCanvas.getContext(
      "2d",
      { alpha: true }
    );

}


/* =========================================================
   CANVAS RESIZE
   ========================================================= */

function resizeCanvas(canvas, ctx) {

  if (!canvas || !ctx) return;

  const width =
    window.innerWidth;

  const height =
    window.innerHeight;


  canvas.width =
    Math.floor(width * dpr);

  canvas.height =
    Math.floor(height * dpr);


  canvas.style.width =
    `${width}px`;

  canvas.style.height =
    `${height}px`;


  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}


/* =========================================================
   CREATE PARTICLES
   ========================================================= */

function seedParticles() {

  if (!particleCanvas) return;

  particles.length = 0;


  const isMobile =
    window.innerWidth <= 600;


  const desiredCount =
    isMobile
      ? PARTICLE_COUNT_MOBILE
      : PARTICLE_COUNT_DESKTOP;


  const count =
    Math.min(
      desiredCount,
      Math.max(
        24,
        Math.floor(window.innerWidth / 13)
      )
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    particles.push({

      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      r:
        Math.random() *
        1.25 +
        0.2,

      a:
        Math.random() *
        0.5 +
        0.08,

      speed:
        Math.random() *
        0.18 +
        0.03,

      drift:
        (Math.random() - 0.5) *
        0.08,

      phase:
        Math.random() *
        Math.PI *
        2

    });

  }

}


/* =========================================================
   DRAW PARTICLES
   ========================================================= */

function drawParticles(time = 0) {

  if (
    reducedMotion ||
    !pctx
  ) {
    return;
  }


  pctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  for (const p of particles) {

    p.y -= p.speed;

    p.x += p.drift;


    /* Wrap vertically */

    if (p.y < -5) {

      p.y =
        window.innerHeight + 5;

    }


    /* Wrap horizontally */

    if (p.x < -5) {

      p.x =
        window.innerWidth + 5;

    }

    if (
      p.x >
      window.innerWidth + 5
    ) {

      p.x = -5;

    }


    /* Soft twinkle */

    const twinkle =
      p.a *
      (
        0.72 +
        Math.sin(
          time * 0.001 +
          p.phase
        ) *
        0.28
      );


    pctx.beginPath();

    pctx.fillStyle =
      `rgba(
        231,
        200,
        137,
        ${Math.max(
          0.03,
          twinkle
        )}
      )`;


    pctx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI * 2
    );


    pctx.fill();

  }


  requestAnimationFrame(
    drawParticles
  );

}


/* =========================================================
   INITIALIZE PARTICLE FIELD
   ========================================================= */

function resizeParticleField() {

  if (!particleCanvas || !pctx) {
    return;
  }


  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  resizeCanvas(
    particleCanvas,
    pctx
  );


  seedParticles();

}


resizeParticleField();


window.addEventListener(
  "resize",
  resizeParticleField
);


/* Start animation */

if (
  !reducedMotion &&
  pctx
) {

  requestAnimationFrame(
    drawParticles
  );

}


/* =========================================================
   MUSIC
   ---------------------------------------------------------
   IMPORTANT:

   The music file is expected to be:

   love.mp3

   in the SAME FOLDER as:

   index.html
   style.css
   script.js

   Example:

   our-tomorrows/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── photo1.jpg
   ├── photo2.jpg
   ├── photo3.jpg
   └── love.mp3
   ========================================================= */

if (
  music &&
  musicToggle
) {

  music.src = MUSIC_FILE;


  musicToggle.addEventListener(
    "click",
    async () => {

      try {

        if (music.paused) {

          await music.play();


          if (musicLabel) {

            musicLabel.textContent =
              "♪ Playing";

          }


          musicToggle.classList.add(
            "playing"
          );

        } else {

          music.pause();


          if (musicLabel) {

            musicLabel.textContent =
              "♪ Music";

          }


          musicToggle.classList.remove(
            "playing"
          );

        }

      } catch (error) {

        if (musicLabel) {

          musicLabel.textContent =
            "♪ Add love.mp3";

        }


        console.info(
          "Music unavailable. Add love.mp3 next to index.html.",
          error
        );

      }

    }
  );


  /* Keep button state synchronized */

  music.addEventListener(
    "play",
    () => {

      if (musicLabel) {

        musicLabel.textContent =
          "♪ Playing";

      }

      musicToggle.classList.add(
        "playing"
      );

    }
  );


  music.addEventListener(
    "pause",
    () => {

      if (musicLabel) {

        musicLabel.textContent =
          "♪ Music";

      }

      musicToggle.classList.remove(
        "playing"
      );

    }
  );

}


/* =========================================================
   CELEBRATION PARTICLES
   ========================================================= */

let cctx = null;

let celebrationParticles = [];

let celebrationRunning =
  false;


if (cCanvas) {

  cctx =
    cCanvas.getContext(
      "2d",
      { alpha: true }
    );

}


/* =========================================================
   CELEBRATION CANVAS RESIZE
   ========================================================= */

function resizeCelebration() {

  if (!cCanvas || !cctx) {
    return;
  }


  const ratio =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  cCanvas.width =
    Math.floor(
      window.innerWidth *
      ratio
    );


  cCanvas.height =
    Math.floor(
      window.innerHeight *
      ratio
    );


  cCanvas.style.width =
    `${window.innerWidth}px`;


  cCanvas.style.height =
    `${window.innerHeight}px`;


  cctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

}


/* =========================================================
   CREATE CELEBRATION BURST
   ========================================================= */

function burstParticles() {

  celebrationParticles = [];


  const count =
    window.innerWidth <= 600
      ? Math.floor(
          CELEBRATION_PARTICLE_COUNT * 0.7
        )
      : CELEBRATION_PARTICLE_COUNT;


  const centerX =
    window.innerWidth / 2;

  const centerY =
    window.innerHeight / 2;


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    const velocity =
      Math.random() *
      7 +
      2;


    celebrationParticles.push({

      x: centerX,

      y: centerY,

      vx:
        Math.cos(angle) *
        velocity,

      vy:
        Math.sin(angle) *
        velocity,

      life:
        Math.random() *
        110 +
        80,

      maxLife:
        190,

      size:
        Math.random() *
        2.8 +
        0.5,

      type:
        Math.random() >
        0.72
          ? "heart"
          : "dot"

    });

  }

}


/* =========================================================
   DRAW CELEBRATION
   ========================================================= */

function drawCelebration() {

  if (
    !celebrationRunning ||
    !cctx
  ) {
    return;
  }


  cctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  for (
    const p of celebrationParticles
  ) {

    p.x += p.vx;

    p.y += p.vy;


    /* Air resistance */

    p.vx *= 0.988;


    /* Gravity */

    p.vy =
      p.vy * 0.988 +
      0.035;


    p.life--;


    const alpha =
      Math.max(
        0,
        p.life /
        p.maxLife
      );


    cctx.save();


    cctx.globalAlpha =
      alpha;


    if (
      p.type === "heart"
    ) {

      cctx.fillStyle =
        "rgba(217,139,158,.9)";


      cctx.font =
        `${Math.max(
          8,
          p.size * 5
        )}px serif`;


      cctx.fillText(
        "♥",
        p.x,
        p.y
      );

    } else {

      cctx.fillStyle =
        "rgba(255,233,174,.9)";


      cctx.beginPath();


      cctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );


      cctx.fill();

    }


    cctx.restore();

  }


  celebrationParticles =
    celebrationParticles.filter(
      p => p.life > 0
    );


  if (
    celebrationParticles.length
  ) {

    requestAnimationFrame(
      drawCelebration
    );

  } else {

    celebrationRunning =
      false;

  }

}


/* =========================================================
   YES BUTTON
   ========================================================= */

if (yesButton) {

  yesButton.addEventListener(
    "click",
    () => {

      if (celebration) {

        celebration.classList.add(
          "active"
        );

        celebration.setAttribute(
          "aria-hidden",
          "false"
        );

      }


      /*
         Don't permanently lock the page.

         The celebration overlay can still be closed
         if your HTML provides a close button.
      */

      resizeCelebration();

      burstParticles();

      celebrationRunning =
        true;

      drawCelebration();


      /*
         If music is currently paused,
         don't force it to play.

         This keeps mobile autoplay behavior safe.
      */

    }
  );

}


/* =========================================================
   EASTER EGG
   ========================================================= */

if (
  easterEgg &&
  secret
) {

  easterEgg.addEventListener(
    "click",
    () => {

      secret.classList.add(
        "show"
      );


      easterEgg.textContent =
        "♥";


      easterEgg.setAttribute(
        "aria-label",
        "A little secret"
      );

    }
  );

}


/* =========================================================
   CELEBRATION RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  resizeCelebration
);


/* =========================================================
   KEYBOARD NAVIGATION
   ---------------------------------------------------------
   Desktop enhancement.

   Mobile users naturally scroll.
   ========================================================= */

window.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "ArrowDown" ||
      event.key === "PageDown"
    ) {

      event.preventDefault();


      const current =
        scenes.findIndex(
          (scene) => {

            const rect =
              scene.getBoundingClientRect();


            return (
              rect.top <=
              window.innerHeight * 0.45 &&
              rect.bottom >=
              window.innerHeight * 0.45
            );

          }
        );


      scrollToScene(
        Math.min(
          current + 1,
          scenes.length - 1
        )
      );

    }


    if (
      event.key === "ArrowUp" ||
      event.key === "PageUp"
    ) {

      event.preventDefault();


      const current =
        scenes.findIndex(
          (scene) => {

            const rect =
              scene.getBoundingClientRect();


            return (
              rect.top <=
              window.innerHeight * 0.45 &&
              rect.bottom >=
              window.innerHeight * 0.45
            );

          }
        );


      scrollToScene(
        Math.max(
          current - 1,
          0
        )
      );

    }

  }
);


/* =========================================================
   INITIALIZATION COMPLETE
   ========================================================= */

console.log(
  "All the Tomorrows — cinematic experience ready."
);

console.log(
  "Expected music file:",
  MUSIC_FILE
);
