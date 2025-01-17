import { addScriptInHead } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js";
import { setCookieWithExpireSecond } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js";

// Fungsi untuk Generate QR Code
async function generateQRCode(type) {
  const qrContainer = document.getElementById("qrcode");
  const sessionToggle = document.getElementById("sessionToggle");
  let value = "";
  let name = "";

  try {
    // Tambahkan library QR js2 jika belum dimuat
    await addScriptInHead(
      "https://cdn.jsdelivr.net/gh/englishextra/qrjs2@latest/js/qrjs2.min.js"
    );

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

    if (!value || !name) {
      alert("Harap isi data yang diperlukan dan nama QR Code.");
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
    qrContainer.innerHTML = ""; // Hapus elemen sebelumnya
    qrContainer.appendChild(qr);

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

  const inputs = [
    "urlInput",
    "urlName",
    "documentInput",
    "documentName",
    "signatureTextInput",
    "signatureImageInput",
    "signatureName",
  ];
  inputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });

  const sessionToggle = document.getElementById("sessionToggle");
  if (sessionToggle) sessionToggle.checked = false;
}

// Panggil fungsi berdasarkan halaman aktif
document.addEventListener("DOMContentLoaded", function () {
  const pageType = document.querySelector(".tab-btn.active").textContent.trim();

  if (pageType === "URL") {
    document
      .querySelector("#url a")
      .addEventListener("click", () => generateQRCode("url"));
  } else if (pageType === "Dokumen") {
    document
      .querySelector("#document a")
      .addEventListener("click", () => generateQRCode("document"));
  } else if (pageType === "Tanda Tangan") {
    document
      .querySelector("#signature a")
      .addEventListener("click", () => generateQRCode("signature"));
  }

  const resetBtn = document.querySelector("button[onclick='resetForm()']");
  if (resetBtn) resetBtn.addEventListener("click", resetForm);
});
