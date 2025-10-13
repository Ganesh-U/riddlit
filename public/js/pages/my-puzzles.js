import { api } from "../api/client.js";
import { initDarkMode } from "../utils/darkMode.js";
import {
  checkAndUpdateSession,
  setupLogoutButton,
  getCurrentUser,
  escapeHtml,
  getDifficultyIcon,
} from "../utils/helpers.js";
import { showToast } from "../components/toast.js";

// State
let currentDeletePuzzleId = null;
let modals = {};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  initDarkMode();
  initModals();
  await checkAndUpdateSession();
  setupLogoutButton();
  setupListeners();
  loadMyPuzzles();
});

// Initialize modals
function initModals() {
  modals.createPuzzle = new bootstrap.Modal(document.getElementById("createPuzzleModal"));
  modals.editPuzzle = new bootstrap.Modal(document.getElementById("editPuzzleModal"));
  modals.deletePuzzle = new bootstrap.Modal(document.getElementById("deletePuzzleModal"));
}

// Setup listeners
function setupListeners() {
  document.getElementById("create-puzzle-form").addEventListener("submit", handleCreatePuzzle);
  document.getElementById("edit-puzzle-form").addEventListener("submit", handleEditPuzzle);
  document.getElementById("confirm-delete-puzzle").addEventListener("click", handleDeletePuzzle);
}

// Load my puzzles
async function loadMyPuzzles() {
  const container = document.getElementById("my-puzzles-content");
  const currentUser = getCurrentUser();

  if (!currentUser) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>Login to see your puzzles</h3>
        <p>Create and manage your brain teasers</p>
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
      <p class="text-muted mt-3 loading-text">Loading your puzzles...</p>
    </div>
  `;

  try {
    const puzzles = await api.getMyPuzzles();

    if (!Array.isArray(puzzles) || !puzzles.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>You haven't created any puzzles yet</h3>
          <p>Click "Create Puzzle" to get started!</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPuzzleModal">
            <i class="bi bi-plus-circle"></i> Create First Puzzle
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = puzzles.map((p) => createPuzzleCard(p)).join("");
    attachPuzzleListeners();
  } catch (err) {
    console.error("Load my puzzles error:", err);
    container.innerHTML = '<div class="alert alert-danger">Failed to load puzzles</div>';
  }
}

// Create puzzle card HTML
function createPuzzleCard(p) {
  const rate = p.total_attempts ? Math.round((p.successful_solves / p.total_attempts) * 100) : 0;
  const difficultyIcon = getDifficultyIcon(p.difficulty);
  const likes = p.likes || 0;
  const dislikes = p.dislikes || 0;

  return `
    <div class="card puzzle-card">
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div class="d-flex gap-2">
          <span class="badge badge-${p.category.toLowerCase()}">${p.category}</span>
          <span class="badge badge-${p.difficulty.toLowerCase()}">
            ${difficultyIcon} ${p.difficulty}
          </span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary edit-btn" 
            data-id="${p._id}"
            data-question="${escapeHtml(p.question).replace(/"/g, "&quot;")}"
            data-answer="${escapeHtml(p.answer)}"
            data-hint="${p.hint ? escapeHtml(p.hint) : ""}"
            data-category="${p.category}"
            data-difficulty="${p.difficulty}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-outline-danger delete-btn" data-id="${p._id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
      
      <div class="puzzle-question mb-3">${escapeHtml(p.question)}</div>
      ${p.hint ? '<div class="puzzle-hint-indicator mb-3"><i class="bi bi-lightbulb"></i> Has hint</div>' : ""}
      
      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <div class="d-flex gap-3 align-items-center">
          <div class="puzzle-vote-stats">
            <span><i class="bi bi-hand-thumbs-up-fill text-success"></i> ${likes}</span>
            <span><i class="bi bi-hand-thumbs-down-fill text-danger"></i> ${dislikes}</span>
          </div>
          <div class="puzzle-stats">
            <i class="bi bi-check-circle-fill text-success"></i>
            <strong>${p.successful_solves}/${p.total_attempts}</strong> solved (${rate}%)
          </div>
        </div>
        <small class="puzzle-date">
          <i class="bi bi-calendar"></i>
          ${new Date(p.created_date).toLocaleDateString()}
        </small>
      </div>
    </div>
  `;
}

// Attach puzzle listeners
function attachPuzzleListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("edit-puzzle-id").value = btn.dataset.id;
      document.getElementById("edit-puzzle-question").value = btn.dataset.question;
      document.getElementById("edit-puzzle-answer").value = btn.dataset.answer;
      document.getElementById("edit-puzzle-hint").value = btn.dataset.hint;
      document.getElementById("edit-puzzle-category").value = btn.dataset.category;
      document.getElementById("edit-puzzle-difficulty").value = btn.dataset.difficulty;
      modals.editPuzzle.show();
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentDeletePuzzleId = btn.dataset.id;
      modals.deletePuzzle.show();
    });
  });
}

// Create puzzle
async function handleCreatePuzzle(e) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Please login to create puzzles", "warning");
    window.location.href = "login.html";
    return;
  }

  const data = {
    question: document.getElementById("puzzle-question").value.trim(),
    answer: document.getElementById("puzzle-answer").value.trim(),
    hint: document.getElementById("puzzle-hint").value.trim() || null,
    category: document.getElementById("puzzle-category").value,
    difficulty: document.getElementById("puzzle-difficulty").value,
  };

  try {
    await api.createPuzzle(data);
    modals.createPuzzle.hide();
    showToast("Puzzle created successfully!", "success");
    document.getElementById("create-puzzle-form").reset();
    loadMyPuzzles();
  } catch {
    showToast("Failed to create puzzle", "danger");
  }
}

// Edit puzzle
async function handleEditPuzzle(e) {
  e.preventDefault();

  const id = document.getElementById("edit-puzzle-id").value;
  const data = {
    question: document.getElementById("edit-puzzle-question").value.trim(),
    answer: document.getElementById("edit-puzzle-answer").value.trim(),
    hint: document.getElementById("edit-puzzle-hint").value.trim() || null,
    category: document.getElementById("edit-puzzle-category").value,
    difficulty: document.getElementById("edit-puzzle-difficulty").value,
  };

  try {
    await api.updatePuzzle(id, data);
    modals.editPuzzle.hide();
    showToast("Puzzle updated successfully!", "success");
    loadMyPuzzles();
  } catch {
    showToast("Failed to update puzzle", "danger");
  }
}

// Delete puzzle
async function handleDeletePuzzle() {
  if (!currentDeletePuzzleId) return;

  try {
    await api.deletePuzzle(currentDeletePuzzleId);
    modals.deletePuzzle.hide();
    showToast("Puzzle deleted successfully", "success");
    currentDeletePuzzleId = null;
    loadMyPuzzles();
  } catch {
    showToast("Failed to delete puzzle", "danger");
  }
}
