import { api } from "../api/client.js";
import { initDarkMode } from "../utils/darkMode.js";
import { checkAndUpdateSession, setupLogoutButton, escapeHtml } from "../utils/helpers.js";

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  initDarkMode();
  await checkAndUpdateSession();
  setupLogoutButton();
  loadLeaderboard();
});

// Load leaderboard
async function loadLeaderboard() {
  const container = document.getElementById("leaderboard-content");
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary loading-spinner"></div>
      <p class="text-muted mt-3 loading-text">Loading leaderboard...</p>
    </div>
  `;

  try {
    const users = await api.getLeaderboard();

    if (!users.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏆</div>
          <h3>No stats yet</h3>
          <p>Start solving puzzles to appear here!</p>
        </div>
      `;
      return;
    }

    const rankIcons = ["👑", "🥈", "🥉"];

    container.innerHTML = users
      .map((u, i) => {
        const rankDisplay = i < 3 ? rankIcons[i] : `#${i + 1}`;

        return `
          <div class="card leaderboard-item">
            <div class="rank rank-${i + 1}">${rankDisplay}</div>
            <div class="flex-grow-1">
              <div class="leaderboard-username">@${escapeHtml(u.username)}</div>
              <div class="leaderboard-stats">
                <i class="bi bi-trophy-fill text-warning"></i>
                ${u.total_solved} puzzles solved
                <span class="ms-3">
                  <i class="bi bi-fire text-danger"></i>
                  ${u.streak || 0} day streak
                </span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Load leaderboard error:", err);
    container.innerHTML = `
      <div class="alert alert-danger">
        Failed to load leaderboard. ${err.message || ""}
      </div>
    `;
  }
}
