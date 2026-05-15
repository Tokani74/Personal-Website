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
   PCB-STYLE CANVAS ANIMATION
   Nodes on a soft grid, connected by
   traces, with animated signal packets
   travelling along them.
═══════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const ACCENT = '163, 255, 78';   // RGB of --green
    const SPACING     = 88;
    const CONNECT_MAX = 118;

    let nodes       = [];
    let connections = [];
    let signals     = [];
    let mouse       = { x: -9999, y: -9999 };
    let animId;

    /* ── Build grid nodes & connections ── */
    function buildScene() {
        nodes       = [];
        connections = [];
        signals     = [];

        const W    = canvas.width;
        const H    = canvas.height;
        const cols = Math.ceil(W / SPACING) + 1;
        const rows = Math.ceil(H / SPACING) + 1;

        for (let c = 0; c <= cols; c++) {
            for (let r = 0; r <= rows; r++) {
                if (Math.random() < 0.62) {
                    nodes.push({
                        x:     c * SPACING + (Math.random() - 0.5) * 22,
                        y:     r * SPACING + (Math.random() - 0.5) * 22,
                        size:  Math.random() * 1.4 + 0.7,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.012 + Math.random() * 0.009,
                    });
                }
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < CONNECT_MAX) {
                    connections.push({ a: i, b: j, d });
                }
            }
        }
    }

    /* ── Spawn a signal packet on a random trace ── */
    function spawnSignal() {
        if (connections.length === 0 || signals.length > 18) return;
        const conn = connections[Math.floor(Math.random() * connections.length)];
        // Randomly decide direction
        const fromIdx = Math.random() < 0.5 ? conn.a : conn.b;
        const toIdx   = fromIdx === conn.a  ? conn.b : conn.a;
        signals.push({
            from:     nodes[fromIdx],
            to:       nodes[toIdx],
            progress: 0,
            speed:    0.007 + Math.random() * 0.013,
        });
    }

    /* ── Main draw loop ── */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Occasionally spawn a new signal
        if (Math.random() < 0.06) spawnSignal();

        /* Draw traces */
        for (const conn of connections) {
            const a     = nodes[conn.a];
            const b     = nodes[conn.b];
            const alpha = (1 - conn.d / CONNECT_MAX) * 0.1;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        /* Draw nodes */
        for (const n of nodes) {
            n.phase += n.speed;
            const pulse = 0.22 + 0.18 * Math.sin(n.phase);

            // Mouse influence
            const mdx  = mouse.x - n.x;
            const mdy  = mouse.y - n.y;
            const mdst = Math.sqrt(mdx * mdx + mdy * mdy);
            const inf  = Math.max(0, 1 - mdst / 190);

            // Outer glow on hover
            if (inf > 0.1) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size + 4 + inf * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${ACCENT}, ${inf * 0.12})`;
                ctx.fill();
            }

            // Node dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size + inf * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT}, ${pulse + inf * 0.5})`;
            ctx.fill();
        }

        /* Draw & advance signal packets */
        signals = signals.filter(sig => {
            sig.progress += sig.speed;
            if (sig.progress >= 1) return false;

            const x = sig.from.x + (sig.to.x - sig.from.x) * sig.progress;
            const y = sig.from.y + (sig.to.y - sig.from.y) * sig.progress;

            // Outer glow
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT}, 0.18)`;
            ctx.fill();

            // Bright core
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT}, 1)`;
            ctx.fill();

            return true;
        });

        animId = requestAnimationFrame(draw);
    }

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        cancelAnimationFrame(animId);
        buildScene();
        draw();
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

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
