const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const navItems = document.querySelectorAll(".nav-links a, .logo");
const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

function closeMenu() {
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function setTheme(theme, shouldStore = true) {
  document.documentElement.setAttribute("data-theme", theme);

  if (shouldStore) {
    localStorage.setItem("portfolio-theme", theme);
  }

  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || (prefersDarkMode.matches ? "dark" : "light"), Boolean(savedTheme));

prefersDarkMode.addEventListener("change", function (event) {
  if (!localStorage.getItem("portfolio-theme")) {
    setTheme(event.matches ? "dark" : "light", false);
  }
});

menuToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

themeToggle.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

navItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    const targetId = item.getAttribute("href");

    if (targetId && targetId.startsWith("#")) {
      event.preventDefault();
      const target = document.querySelector(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start"
        });
        history.pushState(null, "", targetId);
      }
    }

    closeMenu();
  });
});

document.addEventListener("click", function (event) {
  const clickedInsideNav = event.target.closest(".navbar");

  if (!clickedInsideNav && navLinks.classList.contains("open")) {
    closeMenu();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
  }
});

if (prefersReducedMotion.matches) {
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
}
