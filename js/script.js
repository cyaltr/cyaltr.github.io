const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");


// =========================================
// Mobile Navigation
// =========================================

menuToggle.addEventListener("click", () => {

    const isOpen =
        navLinks.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );

});


// Close mobile menu after selecting a section

const navigationLinks =
    document.querySelectorAll(
        "#nav-links a"
    );

navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


// =========================================
// Automatic Copyright Year
// =========================================

const currentYear =
    document.getElementById(
        "current-year"
    );

currentYear.textContent =
    new Date().getFullYear();
