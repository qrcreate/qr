import { getJSON, deleteJSON, putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

function fetchHistory() {
  const token = getCookie("login");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to view history.",
    }).then(() => {
      redirect = "https://yourloginpage.com";
    });
    return;
  }

  getJSON(
    "https://yourapi.com/get/qr",
    "Authorization",
    `Bearer ${token}`,
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

function renderHistory(historyItems) {
  const container = document.querySelector(".history-container");
  container.innerHTML = ""; 

  historyItems.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");

    historyItem.innerHTML = `
      <div class="item-details">
        <h2>${item.name}</h2>
        <p>Time: ${item.createdAt}</p>
      </div>
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

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => editQR(button.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteQR(button.dataset.id));
  });
}

function editQR(qrId) {
  const token = getCookie("login");
  const url = `https://yourapi.com/get/qr/${qrId}`;
  
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      Swal.fire({
        title: 'Edit QR Code',
        html: `
          <input id="edit-name" class="swal2-input" value="${data.name}" placeholder="QR Name">
          <input id="edit-url" class="swal2-input" value="${data.url}" placeholder="QR URL">
        `,
        confirmButtonText: 'Save Changes',
        showCancelButton: true,
        preConfirm: () => {
          const updatedName = document.getElementById('edit-name').value;
          const updatedUrl = document.getElementById('edit-url').value;
          return { name: updatedName, url: updatedUrl  };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { name, url } = result.value;
          updateQR(qrId, name, url); 
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

function updateQR(qrId, name, url) {
  const token = getCookie("token");
  const data = { name, url };

  putJSON(
    `https://yourapi.com/put/qr/${qrId}`,
    "Authorization",
    `Bearer ${token}`,
    data,
    (response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "QR code updated successfully.",
        }).then(() => {
          fetchHistory(); 
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

// Delete QR code
function deleteQR(qrId) {
  const token = getCookie("token");
  deleteJSON(
    `https://yourapi.com/delete/qr/${qrId}`,
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
          fetchHistory();
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
