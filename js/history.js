import {
  getJSON,
  deleteJSON,
  putJSON,
} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";

/// Fetch History
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
        if (response.data.length === 0) {
          // If no QR history exists, show info message
          Swal.fire({
            icon: "info",
            title: "No QR History",
            text: "You haven't created any QR codes yet.",
          });
        } else {
          renderHistory(response.data);
        }
      } else {
        // If the status is not 200, show error message
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
        ? date.toLocaleString("en-ID", { timeZone: "Asia/Jakarta" }) // Set time zone explicitly
        : "Invalid Date";

    historyItem.innerHTML = `
      <div class="item-details">
          <h2>${item.name}</h2>
          <p>Time: ${formattedDate}</p>
      </div>
      <div class="item-actions">
          <button class="view-btn" data-id="${item.id}">
              <i class="fas fa-eye"></i>
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
// Melihat QR Code
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
        // Menampilkan modal atau div untuk menampilkan QR code
        Swal.fire({
          title: data.name, // Nama dari QR Code
          html: `
            <p>${data.name}</p>
            <img src="${data.qrCode}" alt="QR Code" style="max-width: 300px; margin-bottom: 20px;" />
            <button class="download-btn" onclick="downloadQRCode('${data.qrCode}')">Download QR Code</button>
          `,
          showCloseButton: true,
          confirmButtonText: "Tutup",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil QR code.",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengambil QR code.",
      });
    });
}

// Fungsi untuk mendownload QR Code
function downloadQRCode(qrCodeUrl) {
  const link = document.createElement('a');
  link.href = qrCodeUrl;
  link.download = 'qr-code.png';
  link.click();
}


// Edit QR Code
function editQR(id) {
  const token = getCookie("login");

  // Create a modal for input
  Swal.fire({
    title: "Edit QR Code Name",
    html: `<input id="edit-name" class="swal2-input" placeholder="Enter new QR name">`,
    showCancelButton: true,
    confirmButtonText: "Save",
    preConfirm: () => {
      const newName = document.getElementById('edit-name').value;
      if (!newName) {
        Swal.showValidationMessage('Please enter a new QR code name');
        return false;
      }
      return newName;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const data = { name: result.value };

      // Send PUT request to update QR
      putJSON(
        `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/put/qr?id=${id}`,
        "login",
        token,
        data,
        (response) => {
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "QR Code updated successfully!",
              icon: "success",
            });
            fetchHistory(); // Reload the history
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "Failed to update QR code.",
            });
          }
        }
      );
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
      // Send DELETE request to remove QR
      deleteJSON(
        `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/delete/qr?id=${id}`,
        "login",
        token,
        (response) => {
          if (response.status === 200) {
            // Success: Show success message
            Swal.fire({
              title: "Deleted!",
              text: "The QR history has been deleted.",
              icon: "success",
            });
            fetchHistory(); // Reload the history
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "Failed to delete QR history.",
            });
          }
        },
      );
    }
  });
}

// Fetch history on load
document.addEventListener("DOMContentLoaded", fetchHistory);
