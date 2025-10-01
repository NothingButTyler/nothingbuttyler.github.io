document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    // Simple function to toggle a 'nav-open' class on the <nav> element
    // You would add CSS to style the 'nav-open' state (e.g., display: flex; flex-direction: column;)
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }
});
