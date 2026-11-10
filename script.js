document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    // ----- Zoom & pan state -----
    const MIN_SCALE = 1;
    const MAX_SCALE = 8;
    let scale = 1;
    let tx = 0;
    let ty = 0;
    let dragging = false;
    let didDrag = false;
    let startX = 0;
    let startY = 0;

    function applyTransform() {
        lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        lightboxImg.classList.toggle("zoomed", scale > 1);
    }

    function resetZoom() {
        scale = 1;
        tx = 0;
        ty = 0;
        applyTransform();
    }

    // Zoom to a new scale, keeping the point under the cursor in place
    function zoomAt(clientX, clientY, newScale) {
        newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
        if (newScale === scale) return;
        if (newScale === MIN_SCALE) {
            resetZoom();
            return;
        }
        const rect = lightboxImg.getBoundingClientRect();
        const cx = clientX - rect.left;
        const cy = clientY - rect.top;
        tx = cx + tx - (cx * newScale) / scale;
        ty = cy + ty - (cy * newScale) / scale;
        scale = newScale;
        applyTransform();
    }

    // Scroll wheel: zoom toward the cursor
    lightboxImg.addEventListener("wheel", (e) => {
        e.preventDefault();
        const factor = Math.exp(-Math.max(-100, Math.min(100, e.deltaY)) * 0.002);
        zoomAt(e.clientX, e.clientY, scale * factor);
    }, { passive: false });

    // Click and drag: pan while zoomed
    lightboxImg.addEventListener("pointerdown", (e) => {
        if (scale === 1) return;
        e.preventDefault();
        dragging = true;
        didDrag = false;
        startX = e.clientX - tx;
        startY = e.clientY - ty;
        lightboxImg.setPointerCapture(e.pointerId);
        lightboxImg.classList.add("dragging");
    });

    lightboxImg.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        // Only count it as a drag after a few pixels, so a slightly shaky click still zooms out
        if (!didDrag && Math.hypot(e.clientX - startX - tx, e.clientY - startY - ty) < 4) return;
        didDrag = true;
        tx = e.clientX - startX;
        ty = e.clientY - startY;
        applyTransform();
    });

    function endDrag() {
        dragging = false;
        lightboxImg.classList.remove("dragging");
    }
    lightboxImg.addEventListener("pointerup", endDrag);
    lightboxImg.addEventListener("pointercancel", endDrag);

    // Click: zoom in on the clicked spot, or back out if already zoomed
    const CLICK_SCALE = 2.5;
    lightboxImg.addEventListener("click", (e) => {
        if (didDrag) return; // this click ended a pan; the lightbox handler clears the flag
        if (scale > 1) {
            resetZoom();
        } else {
            zoomAt(e.clientX, e.clientY, CLICK_SCALE);
        }
    });
    lightboxImg.addEventListener("dragstart", (e) => e.preventDefault());

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.classList.toggle("pixel-art", img.classList.contains("pixel-art"));
        const figcaption = img.closest("figure")?.querySelector("figcaption");
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
        resetZoom();
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
        endDrag();
    }

    document.querySelectorAll(".img-gallery img").forEach((img) => {
        img.addEventListener("click", () => openLightbox(img));
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        // Ignore the click that ends a pan, so dragging doesn't close the viewer
        if (didDrag) {
            didDrag = false;
            return;
        }
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}
