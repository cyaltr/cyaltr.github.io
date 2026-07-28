const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );
});


// Close mobile menu when a link is clicked

const navigationLinks =
    document.querySelectorAll("#nav-links a");

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });
});


// Automatically update copyright year

const currentYear =
    document.getElementById("current-year");

currentYear.textContent =
    new Date().getFullYear();
