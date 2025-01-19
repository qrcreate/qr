import {
  getJSON,
  deleteJSON,
  putJSON,
} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";

// Fetch History
function fetchHistory() {
  const token = getCookie("login");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to view history.",
    }).then(() => {
      window.location.href = "https://qrcreate.github.io/login/";
    });
    return;
  }

  getJSON(
    "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/get/qr",
    "login",
    getCookie("login"),
    (response) => {
      if (response.status === 200) {
        renderHistory(response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to fetch history.",
        });
      }
    }
  );
}

// Render History Items
function renderHistory(historyItems) {
  const container = document.querySelector(".history-container");
  container.innerHTML = ""; // Clear existing history

  historyItems.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    const date = new Date(item.createdAt);
    const formattedDate =
      date instanceof Date && !isNaN(date)
        ? date.toLocaleString()
        : "Invalid Date";

    historyItem.innerHTML = `
          <div class="item-details">
              <h2>${item.name}</h2>
              <p>Time: ${formattedDate}</p>
          </div>
          <div class="item-actions">
              <button class="view-btn" data-id="${item.id}">
                  <i class="fas fa-eye"></i> View QR
              </button>
              <button class="edit-btn" data-id="${item.id}">
                  <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" data-id="${item.id}">
                  <i class="fas fa-trash"></i>
              </button>
          </div>
      `;
    container.appendChild(historyItem);
  });

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", () => viewQR(button.dataset.id));
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => editQR(button.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteQR(button.dataset.id));
  });
}

// View QR Code
function viewQR(id) {
  const token = getCookie("login");
  const url = `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/get/qr?id=${id}`;

  fetch(url, {
    method: "GET",
    headers: { login: token },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.qrCode) {
        Swal.fire({
          title: "QR Code",
          html: `
                    <p>${data.name}</p>
                    <img src="${data.qrCode}" alt="QR Code" />
                `,
          showCloseButton: true,
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to retrieve QR code.",
        });
      }
    });
}

// Delete QR History
function deleteQR(id) {
  const token = getCookie("login");

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteJSON(
        `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/delete/qr?id=${id}`,
        "login",
        getCookie("login"),
        () => {
          Swal.fire("Deleted!", "The QR history has been deleted.", "success");
          fetchHistory(); 
        }
      );
    }
  });
}

// Fetch history on load
document.addEventListener("DOMContentLoaded", fetchHistory);
