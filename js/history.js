import { getJSON, deleteJSON, putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/url.js";


function fetchHistory() {
  const token = getCookie("login");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to view history.",
    }).then(() => {
      redirect("/login");
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

// Render the QR history into the HTML container
function renderHistory(historyItems) {
  const container = document.querySelector(".history-container");
  container.innerHTML = ""; // Clear existing history

  historyItems.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    historyItem.innerHTML = `
      <div class="item-details">
        <h2>${item.name}</h2>
        <p>Time: ${new Date(item.createdAt).toLocaleString()}</p> <!-- Format the date -->
      </div>
      <button class="edit-btn" data-id="${item.id}">
        <i class="fas fa-edit"></i>
      </button>
      <button class="delete-btn" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    container.appendChild(historyItem);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => editQR(button.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteQR(button.dataset.id));
  });
}

// Edit a QR code based on its ID
function editQR(id) {
  const token = getCookie("login");
  const url = `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/get/qr?id=${id}`;

  fetch(url, {
    method: "GET",
    headers: {
      login: token,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Debugging log untuk memeriksa data yang diterima
    Swal.fire({
      title: 'Edit QR Code',
      html: `
        <input id="edit-name" class="swal2-input" value="${data.name || ''}" placeholder="QR Name">
      `,
      confirmButtonText: 'Save Changes',
      showCancelButton: true,
      preConfirm: () => {
        const updatedName = document.getElementById('edit-name').value;
        return { name: updatedName };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name } = result.value;
        updateQR(id, name); 
      }
    });
  })
  .catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch QR code details.",
    });
  });
}

// Update the QR code with the provided data
function updateQR(id, name, url) {
  const token = getCookie("login");
  const data = { name, url };

  putJSON(
    `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/put/qr?id=${id}`, // Ensure the URL matches your endpoint
    "login",
    token,
    data,
    (response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "QR code updated successfully.",
        }).then(() => {
          fetchHistory(); // Reload the history
        });
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

// Delete the QR code by ID
function deleteQR(id) {
  const token = getCookie("login");
  deleteJSON(
    `https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/delete/qr?id=${id}`, // Ensure the URL matches your endpoint
    "login",
    token,
    {},
    (response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "QR code deleted successfully.",
        }).then(() => {
          fetchHistory(); // Reload the history
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to delete QR code.",
        });
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", fetchHistory);
