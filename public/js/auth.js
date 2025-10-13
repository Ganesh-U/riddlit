// Authentication Module
import { api } from "./api/client.js";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

// Show inline error message
function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");

  setTimeout(() => {
    errorDiv.classList.add("hidden");
  }, 5000);
}

// Show success message
function showSuccess(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.className = "alert alert-success mt-3";
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const errorDiv = document.getElementById("error-message");

  errorDiv.classList.add("hidden");

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';

  try {
    const data = await api.login(username, password);

    if (data.success) {
      showSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        const referrer = document.referrer;
        const currentHost = window.location.host;

        if (
          referrer &&
          referrer.includes(currentHost) &&
          !referrer.includes("login.html") &&
          !referrer.includes("register.html")
        ) {
          window.location.href = referrer;
        } else {
          window.location.href = "index.html";
        }
      }, 800);
    } else {
      showError(data.error || "Invalid username or password");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Login failed. Please try again.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
  }
}

// Handle Register
async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const errorDiv = document.getElementById("error-message");

  // Hide any previous error
  errorDiv.classList.add("hidden");

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  if (username.length < 3 || username.length > 20) {
    showError("Username must be 3-20 characters");
    return;
  }

  if (password.length < 4) {
    showError("Password must be at least 4 characters");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...';

  try {
    const data = await api.register(username, password);

    if (data.success) {
      showSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        const referrer = document.referrer;
        const currentHost = window.location.host;

        if (
          referrer &&
          referrer.includes(currentHost) &&
          !referrer.includes("login.html") &&
          !referrer.includes("register.html")
        ) {
          window.location.href = referrer;
        } else {
          window.location.href = "index.html";
        }
      }, 800);
    } else {
      showError(data.error || "Registration failed");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Register';
    }
  } catch (error) {
    console.error("Registration error:", error);
    showError("Registration failed. Please try again.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Register';
  }
}
