/* ════════════════════════════════════
   MASCOT CYCLE
   Cycles through cute animal emojis
   every ~2.8 seconds with a pop animation
════════════════════════════════════ */
const mascots = ['🐻', '🐼', '🐸', '🦊', '🐧', '🦄', '🐙', '🐶', '🐱'];
let mascotIdx = 0;

setInterval(() => {
  mascotIdx = (mascotIdx + 1) % mascots.length;
  const m = document.getElementById('mascot');
  m.style.transform  = 'scale(0)';
  m.style.transition = 'transform 0.2s ease';
  setTimeout(() => {
    m.textContent      = mascots[mascotIdx];
    m.style.transform  = '';
    m.style.transition = 'transform 0.3s cubic-bezier(.34,1.56,.64,1)';
  }, 200);
}, 2800);


/* ════════════════════════════════════
   NO BUTTON — EXCUSES & RUN-AWAY LOGIC
════════════════════════════════════ */
const excuses = [
  "I need to think about our friendship… 🤔",
  "Ask me again after snacks 🍕",
  "My horoscope says not today 🔮",
  "I have trust issues with fun people 😅",
  "Let me consult my goldfish 🐟",
  "My WiFi is too slow for commitments 📶",
  "I'm booked until the next full moon 🌕",
  "My accountant says friendship is risky 📊",
  "Error 404: Excuse not found — just say YES! 💖",
];

let excuseIdx    = 0;
let noClickCount = 0;

/**
 * Moves the No button to a random position within
 * the viewport when the user hovers over it.
 */
function runAway() {
  const btn = document.getElementById('no-btn');
  const btnRect = btn.getBoundingClientRect();

  const margin = 12;
  const maxX = window.innerWidth  - btnRect.width  - margin;
  const maxY = window.innerHeight - btnRect.height - margin;

  const newLeft = margin + Math.random() * maxX;
  const newTop  = margin + Math.random() * maxY;

  btn.style.position = 'fixed';
  btn.style.left     = newLeft + 'px';
  btn.style.top      = newTop  + 'px';
  btn.style.zIndex   = '50';
}

/**
 * Called when the No button is clicked.
 * Cycles through excuses, grows the Yes button,
 * shrinks No button text, and eventually hides it.
 */
function noClick() {
  noClickCount++;

  const noBtn  = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const excuse = document.getElementById('excuse');

  // Grow Yes button to tease the user
  const scale = Math.min(1.4, 1 + noClickCount * 0.08);
  yesBtn.style.transform = `scale(${scale})`;

  // Show rotating excuse message
  excuse.textContent = excuses[excuseIdx % excuses.length];
  excuseIdx++;
  excuse.classList.remove('show');
  void excuse.offsetWidth; // force reflow to restart transition
  excuse.classList.add('show');

  // Shrink No button text with each click
  const newFontSize = Math.max(0.7, 1.25 - noClickCount * 0.08);
  noBtn.style.fontSize = newFontSize + 'rem';

  // After 6 clicks, the No button gives up entirely
  if (noClickCount >= 6) {
    noBtn.style.opacity       = '0';
    noBtn.style.pointerEvents = 'none';
    excuse.textContent = "Okay the NO button quit. Just press YES 💀";
    excuse.classList.add('show');
  }
}


/* ════════════════════════════════════
   YES BUTTON — CELEBRATION
════════════════════════════════════ */

/**
 * Hides the question screen, shows the Yes screen,
 * and triggers the confetti + emoji burst.
 */
function sayYes() {
  document.getElementById('question-screen').style.display = 'none';
  document.getElementById('yes-screen').classList.add('visible');
  launchConfetti();
  burstEmojis();
}

/**
 * Resets everything back to the initial question screen state.
 */
function restart() {
  const noBtn  = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const excuse = document.getElementById('excuse');

  // Reset No button
  noBtn.style.position      = '';
  noBtn.style.left          = '';
  noBtn.style.top           = '';
  noBtn.style.opacity       = '1';
  noBtn.style.fontSize      = '';
  noBtn.style.pointerEvents = '';

  // Reset counters and state
  noClickCount = 0;
  excuseIdx    = 0;

  // Reset Yes button size
  yesBtn.style.transform = '';

  // Hide excuse text
  excuse.classList.remove('show');

  // Swap screens
  document.getElementById('yes-screen').classList.remove('visible');
  document.getElementById('question-screen').style.display = '';
}


/* ════════════════════════════════════
   CONFETTI ANIMATION
════════════════════════════════════ */

/**
 * Renders a canvas-based confetti animation across the
 * full viewport. Pieces fade out as they fall off screen.
 */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff6eb4', '#ffe066', '#7ef0d0', '#c39bd3', '#ff9de2', '#ffffff'];

  const pieces = Array.from({ length: 160 }, () => ({
    x:         Math.random() * canvas.width,
    y:         -20 - Math.random() * 200,
    r:         4   + Math.random() * 6,
    d:         2   + Math.random() * 5,
    color:     colors[Math.floor(Math.random() * colors.length)],
    tilt:      Math.random() * 10 - 10,
    tiltSpeed: 0.1 + Math.random() * 0.2,
    opacity:   1,
    shape:     Math.random() > 0.5 ? 'circle' : 'rect',
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      ctx.beginPath();

      if (p.shape === 'circle') {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      } else {
        ctx.rect(p.x, p.y, p.r * 1.8, p.r * 0.9);
      }

      ctx.fill();

      // Update position and fade
      p.y    += p.d;
      p.x    += Math.sin(frame * 0.02 + p.r) * 1.2;
      p.tilt += p.tiltSpeed;
      if (p.y > canvas.height + 20) p.opacity -= 0.02;
    });

    ctx.globalAlpha = 1;
    frame++;

    if (pieces.some(p => p.opacity > 0)) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}


/* ════════════════════════════════════
   EMOJI BURST ANIMATION
════════════════════════════════════ */
const burstSet = ['💖', '✨', '🎉', '🌟', '💫', '🥳', '🎊', '🍕', '🦄', '🐻'];

/**
 * Spawns 22 floating emoji elements at random positions
 * that rise and fade using CSS animation.
 */
function burstEmojis() {
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className   = 'float-emoji';
      el.textContent = burstSet[Math.floor(Math.random() * burstSet.length)];
      el.style.left             = (10 + Math.random() * 80) + 'vw';
      el.style.bottom           = (5  + Math.random() * 25) + 'vh';
      el.style.animationDuration = (1.4 + Math.random() * 1.6) + 's';
      el.style.fontSize          = (1.4 + Math.random() * 1.4) + 'rem';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 90);
  }
}
