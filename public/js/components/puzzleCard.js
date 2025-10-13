import { escapeHtml, getDifficultyIcon } from "../utils/helpers.js";

export function createPuzzleCard(puzzle, userSolved = null, userVote = null) {
  const initials = puzzle.creator_username.substring(0, 2).toUpperCase();
  const rate = puzzle.total_attempts
    ? Math.round((puzzle.successful_solves / puzzle.total_attempts) * 100)
    : 0;

  const difficultyIcon = getDifficultyIcon(puzzle.difficulty);
  const isSolved = userSolved !== null;

  const likes = puzzle.likes || 0;
  const dislikes = puzzle.dislikes || 0;

  return `
    <div class="card puzzle-card ${isSolved ? "puzzle-solved" : ""}" data-id="${puzzle._id}">
      <div class="d-flex align-items-center mb-4">
        <div class="user-avatar">${initials}</div>
        <div class="flex-grow-1">
          <div class="puzzle-author">@${escapeHtml(puzzle.creator_username)}</div>
          <div class="d-flex gap-2 mt-2">
            <span class="badge badge-${puzzle.category.toLowerCase()}">${puzzle.category}</span>
            <span class="badge badge-${puzzle.difficulty.toLowerCase()}">
              ${difficultyIcon} ${puzzle.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <div class="puzzle-question">${escapeHtml(puzzle.question)}</div>
      
      <div class="my-4">
        ${
          isSolved
            ? `
          <div class="alert alert-success feedback">
            <i class="bi bi-check-circle-fill"></i>
            <strong>Already Solved!</strong> You got this one right! 🎉
          </div>
          <div class="answer-reveal">
            <i class="bi bi-lightbulb-fill"></i>
            <strong>Answer:</strong> ${escapeHtml(puzzle.answer)}
          </div>
        `
            : `
          <div class="input-group input-group-lg">
            <input type="text" class="form-control answer-input" placeholder="Type your answer here..." />
            <button class="btn btn-primary submit-btn">
              <i class="bi bi-send-fill"></i> Submit
            </button>
          </div>
          ${puzzle.hint ? '<button class="btn btn-sm btn-outline-warning mt-2 hint-btn"><i class="bi bi-lightbulb"></i> Show Hint</button>' : ""}
          <div class="hint-container"></div>
          <div class="feedback-container"></div>
        `
        }
      </div>
      
      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <div class="d-flex gap-3 align-items-center flex-wrap">
          <!-- Like/Dislike buttons -->
          <div class="vote-buttons d-flex align-items-center gap-2">
            <button class="btn btn-sm vote-btn like-btn ${userVote === "like" ? "active" : ""}" data-vote="like" title="Like this puzzle">
              <i class="bi bi-hand-thumbs-up${userVote === "like" ? "-fill" : ""}"></i>
              <span class="ms-1">${likes}</span>
            </button>
            <button class="btn btn-sm vote-btn dislike-btn ${userVote === "dislike" ? "active" : ""}" data-vote="dislike" title="Dislike this puzzle">
              <i class="bi bi-hand-thumbs-down${userVote === "dislike" ? "-fill" : ""}"></i>
              <span class="ms-1">${dislikes}</span>
            </button>
          </div>
          
          <!-- Solve stats -->
          <div class="puzzle-stats">
            <i class="bi bi-check-circle-fill text-success"></i>
            <strong>${puzzle.successful_solves}/${puzzle.total_attempts}</strong> solved 
            <span class="text-muted">(${rate}%)</span>
          </div>
        </div>
        
        <button class="btn btn-outline-primary btn-sm comments-btn">
          <i class="bi bi-chat-dots-fill"></i> Comments
        </button>
      </div>
    </div>
  `;
}
