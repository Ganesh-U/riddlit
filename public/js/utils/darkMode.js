export function initDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    updateDarkModeIcon(true);
  }

  const toggle = document.getElementById("dark-mode-toggle");
  if (toggle) {
    toggle.addEventListener("click", toggleDarkMode);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  const icon = document.querySelector("#dark-mode-toggle i");
  if (icon) {
    icon.className = isDark ? "bi bi-sun-fill fs-5" : "bi bi-moon-fill fs-5";
  }
}
