// Toast Notification Component
export function showToast(message, type = "primary") {
  const toastEl = document.getElementById("toast");
  const toastBody = toastEl.querySelector(".toast-body");

  toastBody.textContent = message;
  toastEl.className = `toast align-items-center border-0 bg-${type}`;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}
