// script.js (robust, replaces previous)
document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------
     Helper: safe element getter
     ------------------------------- */
  const $ = (id) => document.getElementById(id);

  /* -------------------------------
     SIDEBAR / HAMBURGER
     ------------------------------- */
  const hamburger = $("hamburger");
  const sidebar = $("sidebar");
  const closeBtn = $("close-btn");

  // ensure overlay exists (create if not)
  let overlay = $("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }

  // open/close helpers (no-op if sidebar missing)
  const openSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // stop background scroll
  };
  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // restore scroll
  };

  // safe event wiring
  if (hamburger) hamburger.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // close sidebar when clicking its links (helps on mobile)
  document.querySelectorAll(".sidebar a").forEach(a => {
    a.addEventListener("click", () => {
      closeSidebar();
    });
  });

  // close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  /* -------------------------------
     SUBSCRIBER COUNTER (live + fallback)
     ------------------------------- */
  const subscriberElem = $("subscriberCount"); // must match your HTML id

  function animateCounter(element, start, end, duration = 1400) {
    if (!element) return;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value.toLocaleString() + (end >= 1000 ? "+ subscribers" : " subscribers");
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function fetchLiveSubscribers() {
    // NOTE: some free APIs or endpoints may be blocked by CORS or go down.
    // We try one commonly-seen endpoint, but fall back cleanly on failure.
    const fallback = 7510;
    if (!subscriberElem) return;

    try {
      // Try socialcounts endpoint used earlier (may or may not work depending on CORS)
      const endpoint = "https://api.socialcounts.org/youtube-live-subscriber-count/@NothingButTyler";
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("non-ok response");
      const json = await res.json();

      // Possible property names to look for (different APIs use different names)
      const possible =
        json?.est_sub || json?.subscribers || json?.subscriberCount || json?.count || json?.sub_count;
      const count = typeof possible === "number" ? possible
                   : (typeof json === "number" ? json : null);

      if (count && Number.isFinite(count) && count > 0) {
        animateCounter(subscriberElem, 0, Math.round(count), 1000 + Math.min(2000, Math.round(count / 5)));
        return;
      } else {
        throw new Error("invalid payload");
      }
    } catch (err) {
      // console warning for debugging; fallback to static count animation
      console.warn("Live subscriber fetch failed (CORS / offline / API change). Falling back. Error:", err);
      animateCounter(subscriberElem, 0, fallback, 1200);
    }
  }

  // run once now, then try again every 30s
  fetchLiveSubscribers();
  setInterval(fetchLiveSubscribers, 30000);

  /* -------------------------------
     SECTION FADE-IN ON SCROLL
     ------------------------------- */
  const sections = document.querySelectorAll(".section, .hero");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(s => {
      // start hidden (if not already)
      if (!s.classList.contains("visible")) s.classList.add("hidden");
      io.observe(s);
    });
  } else {
    // fallback: just reveal everything
    sections.forEach(s => s.classList.add("visible"));
  }

  /* -------------------------------
     NAVBAR ACTIVE LINK HIGHLIGHT
     ------------------------------- */
  const navLinks = document.querySelectorAll(".nav-links a");
  const sectsWithId = Array.from(document.querySelectorAll("section[id]"));

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    let currentId = "";
    for (const sec of sectsWithId) {
      const top = sec.offsetTop - 80;
      if (scrollY >= top) currentId = sec.id;
    }
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`);
    });
  }

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  /* -------------------------------
     Debugging tip (only logs if something missing)
     ------------------------------- */
  setTimeout(() => {
    const missing = [];
    if (!hamburger) missing.push("#hamburger");
    if (!sidebar) missing.push("#sidebar");
    if (!closeBtn) missing.push("#close-btn");
    if (!subscriberElem) missing.push("#subscriberCount");
    if (missing.length) {
      console.info("script.js loaded — missing elements:", missing.join(", "), "\nIf any are intentional, ignore this.");
    }
  }, 400);
});
l>
