/* ═══════════════════════════════════════
   IMAGE FALLBACK
   Show a styled placeholder when an image
   file doesn't exist yet.
═══════════════════════════════════════ */
document.querySelectorAll('.img-wrap img').forEach(img => {
    const handle = function() {
        if (this.naturalWidth === 0 || !this.complete) {
            this.style.display = 'none';
            const ph = document.createElement('div');
            ph.className = 'img-placeholder';
            ph.textContent = this.alt || 'Image coming soon';
            this.parentElement.insertBefore(ph, this);
        }
    };
    img.addEventListener('error', handle);
    // Also check after load in case browser cached a broken state
    img.addEventListener('load', handle);
});

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
    });
}

/* ═══════════════════════════════════════
   STICKY NAV
═══════════════════════════════════════ */
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

/* ═══════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
let menuOpen = false;

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        hamburger.style.transform = menuOpen ? 'rotate(90deg)' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            mobileMenu.classList.remove('open');
            hamburger.style.transform = '';
        });
    });
}

/* ═══════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════ */
const typedEl = document.getElementById('typed');
if (typedEl) {
    const phrases = [
        'PCB Designer & Electronics Engineer',
        'CAD Modeler — Onshape & SolidWorks',
        'Python Developer — OpenCV & LAMMPS',
        'Electronics Lead @ UT Austin',
        'Hardware + Software Builder',
    ];

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;

    function typeLoop() {
        const current = phrases[phraseIdx];

        if (!deleting) {
            typedEl.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeLoop, 2200);
                return;
            }
            setTimeout(typeLoop, 48);
        } else {
            typedEl.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
            setTimeout(typeLoop, 28);
        }
    }

    setTimeout(typeLoop, 900);
}

/* ═══════════════════════════════════════
   SAKURA + JAZZ CANVAS ANIMATION
   Falling cherry blossom petals and
   floating musical notes drifting upward.
═══════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const PETAL_COLORS = [
        [255, 179, 198],  // sakura pink
        [196, 181, 253],  // lavender
        [147, 197, 253],  // sky blue
        [253, 236, 220],  // warm cream
        [134, 239, 172],  // mint
        [249, 199,  79],  // warm gold
    ];

    const NOTES = ['♩', '♪', '♫', '♬'];

    let petals = [];
    let notes  = [];
    let animId;

    function makePetal() {
        const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        return {
            x:       Math.random() * canvas.width,
            y:      -20 - Math.random() * 200,
            size:    3 + Math.random() * 5.5,
            speed:   0.5 + Math.random() * 1.1,
            drift:   (Math.random() - 0.5) * 0.6,
            angle:   Math.random() * Math.PI * 2,
            spin:    (Math.random() - 0.5) * 0.035,
            color:   color,
            alpha:   0.14 + Math.random() * 0.32,
            phase:   Math.random() * Math.PI * 2,
            wave:    0.3 + Math.random() * 0.9,
        };
    }

    function makeNote() {
        const color = PETAL_COLORS[Math.floor(Math.random() * 3)];
        return {
            x:     Math.random() * canvas.width,
            y:     canvas.height + 20,
            glyph: NOTES[Math.floor(Math.random() * NOTES.length)],
            size:  10 + Math.random() * 9,
            speed: 0.28 + Math.random() * 0.45,
            drift: (Math.random() - 0.5) * 0.25,
            alpha: 0.07 + Math.random() * 0.16,
            color: color,
            phase: Math.random() * Math.PI * 2,
        };
    }

    function buildScene() {
        petals = [];
        notes  = [];
        for (let i = 0; i < 55; i++) {
            const p = makePetal();
            p.y = Math.random() * canvas.height;
            petals.push(p);
        }
        for (let i = 0; i < 9; i++) {
            const n = makeNote();
            n.y = Math.random() * canvas.height;
            notes.push(n);
        }
    }

    function drawPetal(p) {
        const [r, g, b] = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, -p.size * 0.55, p.size * 0.5, p.size * 1.05, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, -p.size * 0.55, p.size * 0.5, p.size * 1.05, Math.PI / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.65})`;
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of petals) {
            p.phase += 0.017;
            p.y     += p.speed;
            p.x     += p.drift + Math.sin(p.phase) * p.wave;
            p.angle += p.spin;
            if (p.y > canvas.height + 30) {
                p.y = -20; p.x = Math.random() * canvas.width;
                p.phase = Math.random() * Math.PI * 2;
            }
            drawPetal(p);
        }

        for (const n of notes) {
            n.phase += 0.011;
            n.y     -= n.speed;
            n.x     += Math.sin(n.phase) * 0.35 + n.drift;
            if (n.y < -30) {
                n.y = canvas.height + 20;
                n.x = Math.random() * canvas.width;
            }
            const [r, g, b] = n.color;
            ctx.font      = `${n.size}px serif`;
            ctx.fillStyle = `rgba(${r},${g},${b},${n.alpha})`;
            ctx.fillText(n.glyph, n.x, n.y);
        }

        animId = requestAnimationFrame(draw);
    }

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        cancelAnimationFrame(animId);
        buildScene();
        draw();
    }

    window.addEventListener('resize', resize);
    resize();
})();

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');

if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 70);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    reveals.forEach(el => revealObserver.observe(el));
}

/* ═══════════════════════════════════════
   PROJECT CARD EXPAND / COLLAPSE
═══════════════════════════════════════ */
function toggleExpand(id, btn) {
    const panel  = document.getElementById(id);
    if (!panel) return;
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('active', !isOpen);
    btn.innerHTML = isOpen ? 'Details &darr;' : 'Close &uarr;';
}
