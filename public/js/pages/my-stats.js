import { api } from "../api/client.js";
import { initDarkMode } from "../utils/darkMode.js";
import { checkAndUpdateSession, setupLogoutButton, getCurrentUser } from "../utils/helpers.js";

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  initDarkMode();
  await checkAndUpdateSession();
  setupLogoutButton();
  loadStats();
});

// Load stats
async function loadStats() {
  const container = document.getElementById("stats-content");
  const currentUser = getCurrentUser();

  if (!currentUser) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <h3>Login to see your stats</h3>
        <p>Track your solving progress and streaks</p>
        <a href="login.html" class="btn btn-primary">
          <i class="bi bi-box-arrow-in-right"></i> Login
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary loading-spinner"></div>
      <p class="text-muted mt-3 loading-text">Loading statistics...</p>
    </div>
  `;

  try {
    const stats = await api.getMyStats();

    container.innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-3">
          <div class="card stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">${stats.total_solved || 0}</div>
            <div class="stat-label">Puzzles Solved</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">${stats.success_rate || 0}%</div>
            <div class="stat-label">Success Rate</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card stat-card">
            <div class="stat-icon streak-fire">🔥</div>
            <div class="stat-value">${stats.current_streak || 0}</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">${stats.longest_streak || 0}</div>
            <div class="stat-label">Longest Streak</div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Load stats error:", err);
    container.innerHTML = '<div class="alert alert-danger">Failed to load statistics</div>';
  }
}
