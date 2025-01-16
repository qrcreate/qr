import { getCookie, setCookieWithExpireSecond, deleteCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

// Fungsi untuk memeriksa login dan mengambil data pengguna
// function checkLoginAndFetchUserData() {
//   const loginToken = getCookie("auth_token");
//   if (!loginToken) {
//     redirect("home.html"); // Arahkan ke login jika tidak ada token
//     return;
//   }

//   // Ambil informasi pengguna dari backend
//   getJSON(
//     "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qr/user/me",
//     null,
//     loginToken,
//     handleUserDataResponse,
//     handleFetchError
//   );
// }

// Callback untuk menangani respons sukses dari backend
// function handleUserDataResponse(result) {
//   if (result.status === 200 && result.data.username) {
//     // Set nama pengguna di navbar
//     setInner("user-info", `<span>Welcome, ${result.data.username} 👋</span>
//       <button id="logoutBtn" class="btn">Logout</button>`);
//     setupLogoutButton();
//   } else {
//     redirect("login.html");
//   }
// }

// Callback untuk menangani error saat mengambil data pengguna
// function handleFetchError(error) {
//   console.error("Failed to fetch user data:", error);
//   redirect("login.html");
// }

// Fungsi untuk logout
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", function () {
    deleteCookie("auth_token"); // Hapus cookie
    alert("Anda telah logout. Mengarahkan ke halaman login...");
    redirect("index.html");
  });
}

// Fungsi untuk mengubah tab aktif
export function openTab(tabName) {
  console.log(`Tab yang dipilih: ${tabName}`);
  
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach((tab) => {
    tab.classList.remove('active');
  });

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((button) => {
    button.classList.remove('active');
  });

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  const activeButton = Array.from(buttons).find((button) => {
    return button.textContent.toLowerCase() === tabName;
  });
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Fungsi untuk Generate QR Code
function generateQRCode(type) {
  let value = "";
  let name = "";

  if (type === "url") {
    value = document.getElementById("urlInput").value;
    name = document.getElementById("urlName").value;
  } else if (type === "document") {
    const file = document.getElementById("documentInput").files[0];
    if (!file) {
      alert("Harap unggah dokumen.");
      return;
    }
    value = URL.createObjectURL(file);
    name = document.getElementById("documentName").value;
  } else if (type === "signature") {
    const text = document.getElementById("signatureTextInput").value;
    const file = document.getElementById("signatureImageInput").files[0];
    if (!text && !file) {
      alert("Harap masukkan teks atau unggah gambar untuk tanda tangan.");
      return;
    }
    value = file ? URL.createObjectURL(file) : text;
    name = document.getElementById("signatureName").value;
  }

  if (!value || !name) {
    alert("Harap isi data yang diperlukan dan nama QR Code.");
    return;
  }

  // Cek status checkbox "sessionToggle"
  const sessionToggle = document.getElementById("sessionToggle").checked;
  if (sessionToggle) {
    // Simpan QR Code ke dalam cookie dengan waktu kadaluwarsa 5 menit (300 detik)
    setCookieWithExpireSecond(name, value, 300);
    alert(`QR Code \"${name}\" telah disimpan dan akan kedaluwarsa dalam 5 menit.`);
  }

  // Tampilkan QR Code di layar
  const qrContainer = document.getElementById("qrcode");
  const nameElement = qrContainer.querySelector("h3");
  nameElement.textContent = name;

  const existingCanvas = qrContainer.querySelector("canvas");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const canvas = document.createElement("canvas");
  new QRious({
    element: canvas,
    value: value,
    size: 250,
  });

  qrContainer.insertBefore(canvas, qrContainer.querySelector(".button-group"));

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.style.display = "inline-block";
  downloadBtn.href = canvas.toDataURL("image/png");
  downloadBtn.download = `${name}.png`;

  document.querySelector(".left-content").style.display = "none";
  qrContainer.style.display = "block";

  // Cleanup URL object jika dokumen atau gambar
  if (type === "document" || type === "signature") {
    setTimeout(() => URL.revokeObjectURL(value), 3000);
  }
}

// Fungsi Reset Form
function resetForm() {
  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const cookieName = decodeURIComponent(cookie.split("=")[0]);
    deleteCookie(cookieName);
  });

  document.querySelector(".left-content").style.display = "block";
  document.getElementById("qrcode").style.display = "none";

  document.getElementById("urlInput").value = "";
  document.getElementById("urlName").value = "";

  document.getElementById("documentInput").value = "";
  document.getElementById("documentName").value = "";

  document.getElementById("signatureTextInput").value = "";
  document.getElementById("signatureImageInput").value = "";
  document.getElementById("signatureName").value = "";

  document.getElementById("sessionToggle").checked = false;
}

// Panggil fungsi utama saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  checkLoginAndFetchUserData(); // Cek login dan ambil data pengguna
});
