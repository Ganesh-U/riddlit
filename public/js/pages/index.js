import { api } from "../api/client.js";
import { initDarkMode } from "../utils/darkMode.js";
import {
  checkAndUpdateSession,
  setupLogoutButton,
  getCurrentUser,
  triggerConfetti,
  escapeHtml,
} from "../utils/helpers.js";
import { showToast } from "../components/toast.js";
import { createPuzzleCard } from "../components/puzzleCard.js";

// State
let currentCategory = "All";
let currentDifficulty = "";
let currentSort = "newest";
let currentPuzzleId = null;
let modals = {};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  initDarkMode();
  initModals();
  await checkAndUpdateSession();
  setupLogoutButton();
  setupListeners();
  loadCategoryFromURL();
  loadPuzzleFeed();
});

// Initialize modals
function initModals() {
  modals.createPuzzle = new bootstrap.Modal(document.getElementById("createPuzzleModal"));
  modals.comments = new bootstrap.Modal(document.getElementById("commentsModal"));
}

// Load category from URL and update active state
function loadCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  document.querySelectorAll(".sidebar-left .nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  if (category) {
    currentCategory = category;
    document.querySelectorAll(".sidebar-left .nav-link").forEach((link) => {
      const linkCategory = new URLSearchParams(link.search).get("category");
      if (linkCategory === category) {
        link.classList.add("active");
      }
    });
  } else {
    document.querySelector(".sidebar-left .nav-link[href='index.html']")?.classList.add("active");
  }
}

// Setup event listeners
function setupListeners() {
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".difficulty-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentDifficulty = btn.dataset.difficulty;
      loadPuzzleFeed();
    });
  });

  document.getElementById("sort-puzzles").addEventListener("change", (e) => {
    currentSort = e.target.value;
    loadPuzzleFeed();
  });

  document.getElementById("create-puzzle-form").addEventListener("submit", handleCreatePuzzle);
  document.getElementById("add-comment-form").addEventListener("submit", handleAddComment);
}

// Load puzzle feed
async function loadPuzzleFeed() {
  const container = document.getElementById("puzzle-feed");
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary loading-spinner"></div>
      <p class="text-muted mt-3 loading-text">Loading puzzles...</p>
    </div>
  `;

  try {
    let puzzles = await api.getPuzzles(currentCategory, currentDifficulty);

    let userSubmissions = [];
    let userVotes = {};
    const currentUser = getCurrentUser();

    if (currentUser) {
      try {
        [userSubmissions, userVotes] = await Promise.all([
          api.getMySubmissions(),
          api.getMyVotes(),
        ]);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    }

    // Sort puzzles
    const sortFunctions = {
      oldest: (a, b) => new Date(a.created_date) - new Date(b.created_date),
      "most-solved": (a, b) => b.successful_solves - a.successful_solves,
      "least-solved": (a, b) => a.successful_solves - b.successful_solves,
      newest: (a, b) => new Date(b.created_date) - new Date(a.created_date),
    };

    puzzles.sort(sortFunctions[currentSort] || sortFunctions.newest);

    if (!puzzles.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🧩</div>
          <h3>No puzzles found</h3>
          <p>Try a different filter or create one!</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPuzzleModal">
            <i class="bi bi-plus-circle"></i> Create Puzzle
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = puzzles
      .map((p) => {
        const userSolved = userSubmissions.find(
          (s) => s.puzzle_id === p._id.toString() && s.is_correct
        );
        const userVote = userVotes[p._id.toString()] || null;
        return createPuzzleCard(p, userSolved, userVote);
      })
      .join("");

    attachPuzzleListeners();
  } catch (err) {
    console.error("Load puzzle feed failed:", err);
    container.innerHTML = '<div class="alert alert-danger">Failed to load puzzles</div>';
  }
}

// Attach puzzle event listeners
function attachPuzzleListeners() {
  attachSubmitListeners();
  attachHintListeners();
  attachVoteListeners();
  attachCommentListeners();
  attachEnterKeyListeners();
}

// Submit answer listeners
function attachSubmitListeners() {
  document.querySelectorAll(".submit-btn").forEach((btn) => {
    btn.addEventListener("click", handleSubmitAnswer);
  });
}

// Handle submit answer
async function handleSubmitAnswer(e) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Please login to submit answers", "warning");
    window.location.href = "login.html";
    return;
  }

  const card = e.target.closest(".puzzle-card");
  const puzzleId = card.dataset.id;
  const input = card.querySelector(".answer-input");
  const answer = input.value.trim();

  if (!answer) {
    showToast("Please enter an answer", "warning");
    return;
  }

  try {
    const data = await api.submitAnswer(puzzleId, answer);
    const container = card.querySelector(".feedback-container");

    if (data.is_correct) {
      container.innerHTML = `
        <div class="alert alert-success feedback">
          <i class="bi bi-check-circle-fill"></i>
          <strong>Correct!</strong> Well done! 🎉
        </div>
      `;
      triggerConfetti();

      const answerReveal = document.createElement("div");
      answerReveal.className = "answer-reveal";
      answerReveal.innerHTML = `
        <i class="bi bi-lightbulb-fill"></i>
        <strong>Answer:</strong> ${escapeHtml(answer)}
      `;
      container.appendChild(answerReveal);

      card.classList.add("puzzle-solved");
      input.disabled = true;
      e.target.disabled = true;
      e.target.innerHTML = '<i class="bi bi-check-circle-fill"></i> Solved';

      updateSolveCount(card, true);
    } else {
      container.innerHTML = `
        <div class="alert alert-danger feedback">
          <i class="bi bi-x-circle-fill"></i>
          <strong>Not quite!</strong> Try again! 💭
        </div>
      `;
      card.classList.add("puzzle-attempted");
      updateSolveCount(card, false);
    }

    input.value = "";
  } catch (err) {
    if (err.already_solved) {
      showAlreadySolvedMessage(card);
    } else {
      showToast(err.error || "Failed to submit answer", "danger");
    }
  }
}

// Update solve count
function updateSolveCount(card, isCorrect) {
  const statsElement = card.querySelector(".puzzle-stats");
  const match = statsElement.innerHTML.match(/(\d+)\/(\d+)/);

  if (match) {
    const solved = parseInt(match[1]) + (isCorrect ? 1 : 0);
    const total = parseInt(match[2]) + 1;
    const rate = Math.round((solved / total) * 100);

    statsElement.innerHTML = `
      <i class="bi bi-check-circle-fill text-success"></i>
      <strong>${solved}/${total}</strong> solved 
      <span class="text-muted">(${rate}%)</span>
    `;
  }
}

// Show already solved
function showAlreadySolvedMessage(card) {
  const container = card.querySelector(".feedback-container");
  container.innerHTML = `
    <div class="alert alert-info feedback">
      <i class="bi bi-info-circle-fill"></i>
      <strong>Already Solved!</strong> You've already solved this puzzle correctly!
    </div>
  `;
  card.classList.add("puzzle-solved");

  const input = card.querySelector(".answer-input");
  const btn = card.querySelector(".submit-btn");
  input.disabled = true;
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Solved';
}

// Hint listeners
function attachHintListeners() {
  document.querySelectorAll(".hint-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const card = e.target.closest(".puzzle-card");
      const puzzleId = card.dataset.id;

      try {
        const puzzle = await api.getPuzzle(puzzleId);

        if (puzzle.hint) {
          card.querySelector(".hint-container").innerHTML = `
            <div class="hint-text">
              <i class="bi bi-lightbulb-fill"></i> 
              Hint: ${escapeHtml(puzzle.hint)}
            </div>
          `;
          e.target.disabled = true;
          e.target.innerHTML = '<i class="bi bi-lightbulb-fill"></i> Hint Shown';
        }
      } catch {
        showToast("Failed to load hint", "danger");
      }
    });
  });
}

// Vote listeners
function attachVoteListeners() {
  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", handleVote);
  });
}

// Handle vote
async function handleVote(e) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Please login to vote", "warning");
    window.location.href = "login.html";
    return;
  }

  const card = e.target.closest(".puzzle-card");
  const puzzleId = card.dataset.id;
  const voteType = e.target.closest(".vote-btn").dataset.vote;
  const likeBtn = card.querySelector(".like-btn");
  const dislikeBtn = card.querySelector(".dislike-btn");

  try {
    const data = await api.vote(puzzleId, voteType);
    updateVoteUI(card, likeBtn, dislikeBtn, data, voteType);
  } catch {
    showToast("Failed to vote", "danger");
  }
}

// Update vote UI
function updateVoteUI(card, likeBtn, dislikeBtn, data, voteType) {
  const likeCount = likeBtn.querySelector("span");
  const dislikeCount = dislikeBtn.querySelector("span");
  let likes = parseInt(likeCount.textContent);
  let dislikes = parseInt(dislikeCount.textContent);

  // Reset active states
  likeBtn.classList.remove("active");
  dislikeBtn.classList.remove("active");
  likeBtn.querySelector("i").className = "bi bi-hand-thumbs-up";
  dislikeBtn.querySelector("i").className = "bi bi-hand-thumbs-down";

  if (data.action === "added") {
    if (voteType === "like") {
      likes++;
      likeBtn.classList.add("active");
      likeBtn.querySelector("i").className = "bi bi-hand-thumbs-up-fill";
    } else {
      dislikes++;
      dislikeBtn.classList.add("active");
      dislikeBtn.querySelector("i").className = "bi bi-hand-thumbs-down-fill";
    }
  } else if (data.action === "removed") {
    if (voteType === "like") likes--;
    else dislikes--;
  } else if (data.action === "switched") {
    if (voteType === "like") {
      likes++;
      dislikes--;
      likeBtn.classList.add("active");
      likeBtn.querySelector("i").className = "bi bi-hand-thumbs-up-fill";
    } else {
      dislikes++;
      likes--;
      dislikeBtn.classList.add("active");
      dislikeBtn.querySelector("i").className = "bi bi-hand-thumbs-down-fill";
    }
  }

  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
}

// Comment listeners
function attachCommentListeners() {
  document.querySelectorAll(".comments-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentPuzzleId = e.target.closest(".puzzle-card").dataset.id;
      loadComments();
      modals.comments.show();
    });
  });
}

// Enter key listeners
function attachEnterKeyListeners() {
  document.querySelectorAll(".answer-input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.target.closest(".puzzle-card").querySelector(".submit-btn").click();
      }
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
    loadPuzzleFeed();
  } catch {
    showToast("Failed to create puzzle", "danger");
  }
}

// Load comments
async function loadComments() {
  const list = document.getElementById("comments-list");
  list.innerHTML =
    '<div class="text-center py-3"><div class="spinner-border spinner-border-sm"></div></div>';

  try {
    const comments = await api.getComments(currentPuzzleId);

    if (!comments.length) {
      list.innerHTML =
        '<p class="empty-comments-message text-center py-4">No comments yet. Be the first!</p>';
      return;
    }

    const sortedComments = [...comments].reverse();
    const currentUser = getCurrentUser();

    list.innerHTML = sortedComments
      .map((c) => {
        const commentText = escapeHtml(c.text.trim());
        const deleteBtn =
          c.commenter_username === currentUser
            ? `<button class="btn btn-sm btn-outline-danger delete-comment-btn" data-id="${c._id}"><i class="bi bi-trash"></i></button>`
            : "";

        return `<div class="comment-item"><div class="comment-header"><div><span class="comment-author">@${escapeHtml(c.commenter_username)}</span><small class="comment-time ms-2">${new Date(c.created_at).toLocaleDateString()}</small></div>${deleteBtn}</div><div class="comment-text">${commentText}</div></div>`;
      })
      .join("");

    attachDeleteCommentListeners();
  } catch (err) {
    console.error("Load comments error:", err);
    list.innerHTML = '<div class="alert alert-danger">Failed to load comments</div>';
  }
}

// Attach delete comment listeners
function attachDeleteCommentListeners() {
  document.querySelectorAll(".delete-comment-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this comment?")) return;

      try {
        await api.deleteComment(btn.dataset.id);
        loadComments();
        showToast("Comment deleted", "info");
      } catch {
        showToast("Failed to delete comment", "danger");
      }
    });
  });
}

// Add comment
async function handleAddComment(e) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Please login to comment", "warning");
    return;
  }

  const textarea = document.getElementById("comment-text");
  const text = textarea.value.trim().replace(/\n/g, " ");

  if (!text) {
    showToast("Please enter a comment", "warning");
    return;
  }

  try {
    await api.addComment(currentPuzzleId, text);
    textarea.value = "";
    loadComments();
    showToast("Comment added!", "success");
  } catch {
    showToast("Failed to add comment", "danger");
  }
}
