import { addScriptInHead } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js";
import { setCookieWithExpireSecond } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js";

// Fungsi untuk Generate QR Code
async function generateQRCode(type) {
  const qrContainer = document.getElementById("qrcode");
  const sessionToggle = document.getElementById("sessionToggle");
  let value = "";
  let name = "";

  try {
    await addScriptInHead(
      "https://cdn.jsdelivr.net/gh/englishextra/qrjs2@latest/js/qrjs2.min.js"
    );
    if (typeof QRCode === "undefined") {
      console.error("Library QRCode tidak dimuat.");
      alert("Library QRCode gagal dimuat. Periksa koneksi internet Anda.");
      return;
    }

    if (type === "url") {
      value = document.getElementById("urlInput").value.trim();
      name = document.getElementById("urlName").value.trim();
    } else if (type === "document") {
      const file = document.getElementById("documentInput").files[0];
      if (!file) {
        alert("Harap unggah dokumen.");
        return;
      }
      value = URL.createObjectURL(file);
      name = document.getElementById("documentName").value.trim();
    } else if (type === "signature") {
      const text = document.getElementById("signatureTextInput")?.value.trim();
      const file = document.getElementById("signatureImageInput")?.files[0];
      if (!text && !file) {
        alert("Harap masukkan teks atau unggah gambar untuk tanda tangan.");
        return;
      }
      value = file ? URL.createObjectURL(file) : text;
      name = document.getElementById("signatureName").value.trim();
    }

    console.log("Value:", value, "Name:", name);
    if (!value || !name) {
      alert("Harap isi data yang diperlukan dan nama QR Code.");
      console.error("Input kosong:", { value, name });
      return;
    }

    // Generate QR Code
    const qr = QRCode.generateSVG(value, {
      ecclevel: "M",
      fillcolor: "#FFFFFF",
      textcolor: "#000000",
      margin: 4,
      modulesize: 8,
    });

    // Tampilkan QR Code
    qrContainer.innerHTML = ""; // Kosongkan elemen sebelumnya
    qrContainer.appendChild(qr);

    qrContainer.style.display = "block"; // Paksa tampilkan elemen QR Code
    qrContainer.style.visibility = "visible"; // Pastikan elemen terlihat
    qrContainer.style.opacity = "1"; // Pastikan tidak transparan

    // Jika QR Code sementara
    if (type === "url" && sessionToggle?.checked) {
      setCookieWithExpireSecond(name, value, 300);
      alert(
        `QR Code \"${name}\" telah disimpan di cookie dan akan kedaluwarsa dalam 5 menit.`
      );
    }

    // Tambahkan tombol download
    const downloadBtn = document.createElement("a");
    downloadBtn.href = `data:image/svg+xml;base64,${btoa(
      new XMLSerializer().serializeToString(qr)
    )}`;
    downloadBtn.download = `${name}.svg`;
    downloadBtn.textContent = "Download QR Code";
    qrContainer.appendChild(downloadBtn);

    document.querySelector(".left-content").style.display = "none";
    qrContainer.style.display = "block";
  } catch (error) {
    console.error("Error generating QR Code:", error);
    alert("Terjadi kesalahan saat membuat QR Code.");
  }
}

// Fungsi Reset Form
function resetForm() {
  document.querySelector(".left-content").style.display = "block";
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // Kosongkan QR Code

  // Reset hanya input yang relevan dengan halaman
  const activeTab = document
    .querySelector(".tab-btn.active")
    .textContent.trim();
  if (activeTab === "URL") {
    document.getElementById("urlInput").value = "";
    document.getElementById("urlName").value = "";
    document.getElementById("sessionToggle").checked = false;
  } else if (activeTab === "Dokumen") {
    document.getElementById("documentInput").value = "";
    document.getElementById("documentName").value = "";
  } else if (activeTab === "Tanda Tangan") {
    document.getElementById("signatureTextInput").value = "";
    document.getElementById("signatureImageInput").value = "";
    document.getElementById("signatureName").value = "";
  }
}

// Event Listener Global
document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const activeTab = document
        .querySelector(".tab-btn.active")
        .textContent.trim();
      if (activeTab === "URL") generateQRCode("url");
      else if (activeTab === "Dokumen") generateQRCode("document");
      else if (activeTab === "Tanda Tangan") generateQRCode("signature");
    });
  }

  const resetBtn = document.querySelector("button[onclick='resetForm()']");
  if (resetBtn) resetBtn.addEventListener("click", resetForm);
});
