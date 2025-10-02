// ===== Scroll Animations =====
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => {
  section.classList.add("hidden");
  observer.observe(section);
});

// ===== Animated Subscriber Counter =====
function animateCounter(id, start, end, duration) {
  const element = document.getElementById(id);
  let startTime = null;

  function updateCounter(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start) + "+ subs";
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Run subscriber counter animation when page loads
window.addEventListener("load", () => {
  animateCounter("sub-counter", 0, 7510, 2000);
});

// ===== Navbar Active Link Highlight =====
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 60;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
