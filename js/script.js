/* =========================================================
   Hero canvas — isometric electromagnetic wave
   Classic textbook EM-wave diagram: the E field oscillates
   in the vertical plane, the B field oscillates in a
   horizontal plane drawn in isometric projection so it
   reads as perpendicular to E, and both propagate along a
   shared axis. Rendered in monochrome, "comb" style.
========================================================= */

(function () {
    const canvas = document.getElementById("waveCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener("resize", resize);
    resize();

    // Isometric projection for the B-field plane: a shallow
    // angle so the horizontal wave reads as going "into" the
    // scene rather than as a second vertical wobble.
    const ISO_ANGLE = Math.PI / 7; // ~25.7°
    const ISO_COS = Math.cos(ISO_ANGLE);
    const ISO_SIN = Math.sin(ISO_ANGLE);

    let t = 0;

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        const midY = height * 0.55;
        const amplitude = height * 0.16;
        const wavelength = Math.max(150, width / 4.2);
        const step = 10;
        const rungEvery = 20; // px spacing of connecting field lines

        const axisStart = width * 0.06;
        const axisEnd = width * 0.94;

        // ---- Propagation axis ----
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(axisStart, midY);
        ctx.lineTo(axisEnd, midY);
        ctx.stroke();

        // Arrowhead marking propagation direction
        ctx.beginPath();
        ctx.moveTo(axisEnd, midY);
        ctx.lineTo(axisEnd - 10, midY - 5);
        ctx.moveTo(axisEnd, midY);
        ctx.lineTo(axisEnd - 10, midY + 5);
        ctx.stroke();

        const ePoints = [];
        const bPoints = [];

        for (let x = axisStart; x <= axisEnd; x += step) {
            const phase = ((x - axisStart) / wavelength) * Math.PI * 2 - t;
            const value = Math.sin(phase);

            // Edge taper so the wave fades in/out at the axis ends
            const edgeFade =
                Math.min(1, (x - axisStart) / (wavelength * 0.6)) *
                Math.min(1, (axisEnd - x) / (wavelength * 0.6));
            const env = Math.max(0, Math.min(1, edgeFade));

            const eY = midY - value * amplitude * env;

            const bOffset = value * amplitude * env;
            const bX = x + bOffset * ISO_COS;
            const bY = midY - bOffset * ISO_SIN * 0.55;

            ePoints.push({ x, y: eY });
            bPoints.push({ x: bX, y: bY });
        }

        // ---- Connecting field lines ("comb" rungs) ----
        ctx.lineWidth = 1;
        for (let i = 0; i < ePoints.length; i++) {
            const x = ePoints[i].x;
            if (Math.round((x - axisStart) / step) % (rungEvery / step) !== 0) {
                continue;
            }
            ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
            ctx.beginPath();
            ctx.moveTo(x, midY);
            ctx.lineTo(ePoints[i].x, ePoints[i].y);
            ctx.stroke();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
            ctx.beginPath();
            ctx.moveTo(x, midY);
            ctx.lineTo(bPoints[i].x, bPoints[i].y);
            ctx.stroke();
        }

        // ---- E field curve (bright) ----
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ePoints.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // ---- B field curve (dimmer, isometric plane) ----
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        bPoints.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }

    function animate() {
        t += 0.018;
        drawFrame();
        if (!prefersReducedMotion) {
            requestAnimationFrame(animate);
        }
    }

    if (prefersReducedMotion) {
        drawFrame();
    } else {
        animate();
    }
})();


/* =========================================================
   About section — bullseye tunnel, fixed and centered
   Thick solid white bands with equally thick gaps, evenly
   spaced from the section's center, drifting outward on a
   loop. Only the white bands are drawn; the black gaps are
   just the section's own background showing through.
========================================================= */

(function () {
    const canvas = document.getElementById("tunnelCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener("resize", resize);
    resize();

    const bandWidth = 35;
    const period = bandWidth * 2;
    const maxRadius = () => Math.hypot(width, height) * 0.5 + period;

    function drawBands(phase) {
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const limit = maxRadius();
        const count = Math.ceil(limit / period) + 1;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = bandWidth;

        for (let i = 0; i < count; i++) {
            const radius = i * period + phase;
            if (radius <= 0) continue;

            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    let phase = 0;

    function step() {
        phase = (phase + 0.25) % period;
        drawBands(phase);
        requestAnimationFrame(step);
    }

    if (prefersReducedMotion) {
        drawBands(0);
    } else {
        requestAnimationFrame(step);
    }
})();


/* =========================================================
   Navbar — subtle background on scroll
========================================================= */

(function () {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    function onScroll() {
        if (window.scrollY > 12) {
            navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.18)";
        } else {
            navbar.style.borderBottomColor = "";
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
})();