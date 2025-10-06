// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeBtn = document.getElementById("close-btn");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

// Live subscriber counter
async function updateSubscribers() {
  try {
    const response = await fetch("https://api.socialcounts.org/youtube-live-subscriber-count/@NothingButTyler");
    const data = await response.json();
    const count = data.est_sub;
    document.getElementById("subscriberCount").textContent = count.toLocaleString() + "+ subs";
  } catch (err) {
    console.error("Error fetching subscriber count:", err);
  }
}

updateSubscribers();
setInterval(updateSubscribers, 30000);
