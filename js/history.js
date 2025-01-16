import {
  getJSON,
  deleteJSON,
} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

// Fungsi untuk mendapatkan data history
function fetchHistory() {
  const token = getCookie("token"); // Ambil token dari cookie
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to view history.",
    }).then(() => {
      window.location.href = "login.html"; // Redirect ke halaman login
    });
    return;
  }

  // Panggil API backend
  getJSON(
    "https://api.example.com/api/history", // Ganti dengan endpoint backend Anda
    "Authorization",
    `Bearer ${token}`,
    (response) => {
      if (response.status === 200) {
        renderHistory(response.data); // Tampilkan data history
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to fetch history.",
        });
      }
    }
  );
}

// Fungsi untuk menampilkan data history
function renderHistory(historyItems) {
  const container = document.querySelector(".history-container");
  container.innerHTML = ""; // Bersihkan kontainer

  historyItems.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    historyItem.innerHTML = `
            <div class="item-details">
                <h2>${item.name} (${item.type})</h2>
                <p>Date: ${item.date}</p>
                <p>Time: ${item.time}</p>
            </div>
            <div class="item-actions">
                <button class="download-btn" data-id="${item.id}">
                    <i class="fas fa-download"></i>
                </button>
                <button class="delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

    container.appendChild(historyItem);
  });

  // Tambahkan event listener untuk tombol download dan delete
  document.querySelectorAll(".download-btn").forEach((button) => {
    button.addEventListener("click", () => downloadQR(button.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteQR(button.dataset.id));
  });
}

// Fungsi untuk mendownload QR
function downloadQR(qrId) {
  const token = getCookie("token");
  const url = `https://api.example.com/api/qrcode/${qrId}/download`; // Endpoint download QR
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "qr-code.png"; // Nama file yang akan diunduh
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to download QR code.",
      });
    });
}

// Fungsi untuk menghapus QR
function deleteQR(qrId) {
  const token = getCookie("token");
  deleteJSON(
    `https://api.example.com/api/qrcode/${qrId}`, // Endpoint delete QR
    "Authorization",
    `Bearer ${token}`,
    {},
    (response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "QR code deleted successfully.",
        }).then(() => {
          fetchHistory(); // Refresh data history
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete QR code.",
        });
      }
    }
  );
}

// Panggil fungsi untuk fetch data history saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchHistory);
