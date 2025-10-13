// API Client Module
const API_URL = "/api";

export const api = {
  // User endpoints
  async register(username, password) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },

  async getSession() {
    const response = await fetch(`${API_URL}/session`, {
      credentials: "include",
    });
    return response.json();
  },

  // Puzzle endpoints
  async getPuzzles(category = null, difficulty = null) {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);

    const url = `${API_URL}/puzzles${params.toString() ? "?" + params : ""}`;
    const response = await fetch(url);
    return response.json();
  },

  async getPuzzle(id) {
    const response = await fetch(`${API_URL}/puzzles/${id}`);
    return response.json();
  },

  async getMyPuzzles() {
    const response = await fetch(`${API_URL}/puzzles/mine`, {
      credentials: "include",
    });
    return response.json();
  },

  async createPuzzle(puzzleData) {
    const response = await fetch(`${API_URL}/puzzles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(puzzleData),
    });
    return response.json();
  },

  async updatePuzzle(id, puzzleData) {
    const response = await fetch(`${API_URL}/puzzles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(puzzleData),
    });
    return response.json();
  },

  async deletePuzzle(id) {
    const response = await fetch(`${API_URL}/puzzles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },

  // Submission endpoints
  async submitAnswer(puzzleId, answer) {
    const response = await fetch(`${API_URL}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        puzzle_id: puzzleId,
        submitted_answer: answer,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  async getMySubmissions() {
    const response = await fetch(`${API_URL}/submissions/mine`, {
      credentials: "include",
    });
    return response.json();
  },

  async getMyStats() {
    const response = await fetch(`${API_URL}/submissions/stats/mine`, {
      credentials: "include",
    });
    return response.json();
  },

  async getLeaderboard() {
    const response = await fetch(`${API_URL}/submissions/stats/leaderboard`);
    return response.json();
  },

  // Comment endpoints
  async getComments(puzzleId) {
    const response = await fetch(`${API_URL}/comments/${puzzleId}`);
    return response.json();
  },

  async addComment(puzzleId, text) {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ puzzle_id: puzzleId, text }),
    });
    return response.json();
  },

  async deleteComment(id) {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },

  // Vote endpoints
  async vote(puzzleId, voteType) {
    const response = await fetch(`${API_URL}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        puzzle_id: puzzleId,
        vote_type: voteType,
      }),
    });
    return response.json();
  },

  async getMyVotes() {
    const response = await fetch(`${API_URL}/votes/mine`, {
      credentials: "include",
    });
    return response.json();
  },
};
