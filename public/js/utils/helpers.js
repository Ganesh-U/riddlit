import { api } from "../api/client.js";

let currentUser = null;

// Date formatting
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// HTML escaping
export function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Get difficulty icon
export function getDifficultyIcon(difficulty) {
  const icons = {
    Easy: '<i class="bi bi-circle-fill difficulty-icon-easy"></i>',
    Medium: '<i class="bi bi-dash-circle-fill difficulty-icon-medium"></i>',
    Hard: '<i class="bi bi-x-circle-fill difficulty-icon-hard"></i>',
  };
  return icons[difficulty] || "";
}

// Get category emoji
export function getCategoryEmoji(category) {
  const emojis = {
    Riddle: "🧩",
    Logic: "💡",
    Math: "➗",
    Trivia: "📚",
  };
  return emojis[category] || "🧠";
}

// Trigger confetti animation
export function triggerConfetti() {
  if (typeof confetti !== "undefined") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#06b6d4", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
    });
  }
}

// Session management
export async function checkAndUpdateSession() {
  try {
    const data = await api.getSession();
    if (data.username) {
      currentUser = data.username;
      updateUIForLoggedInUser(currentUser);
    }
    return currentUser;
  } catch (err) {
    console.error("Session check failed:", err);
    return null;
  }
}

// Update UI for logged-in user
function updateUIForLoggedInUser(username) {
  const usernameDisplay = document.getElementById("username-display");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  if (usernameDisplay) usernameDisplay.textContent = username;
  if (logoutBtn) logoutBtn.classList.remove("d-none");
  if (loginLink) loginLink.classList.add("d-none");
  if (registerLink) registerLink.classList.add("d-none");
}

// Setup logout button
export function setupLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await api.logout();
      window.location.href = "index.html";
    });
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}
