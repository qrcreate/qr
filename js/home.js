import { getCookie, setCookieWithExpireSecond, deleteCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";


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
