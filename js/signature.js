import { onClick, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

// Fungsi untuk generate QR Code
function generateQRCode(event) {
  event.preventDefault();

  const signatureText = document.getElementById('signatureTextInput').value; // Input Teks
  const signatureImageInput = document.getElementById('signatureImageInput'); // Input Gambar
  const signatureName = document.getElementById('signatureName').value;

  let signatureContent = '';

  // Menentukan apakah tanda tangan berbentuk teks atau gambar
  if (signatureText) {
    signatureContent = signatureText; // Gunakan teks jika ada input teks
  } else if (signatureImageInput.files && signatureImageInput.files[0]) {
    // Jika gambar dipilih, konversi gambar ke URL data
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      createQRFromDataUrl(imageUrl, signatureName);
    };
    reader.readAsDataURL(signatureImageInput.files[0]);
    return; // Menghentikan proses sementara hingga gambar diproses
  } else {
    alert("Harap masukkan Teks Tanda Tangan atau Unggah Gambar.");
    return;
  }

  // Jika teks tanda tangan tersedia, buat QR
  createQRFromDataUrl(signatureContent, signatureName);
}

// Fungsi untuk membuat QR code dari teks atau data URL
function createQRFromDataUrl(content, alias) {
  // Menyimpan URL dan nama ke cookie
  setCookieWithExpireDay("qrcontent", content, 365); // Menyimpan URL
  setCookieWithExpireDay("alias", alias, 365); // Menyimpan nama QR Code

  // Menyembunyikan form dan menampilkan QR Code
  document.getElementById('tab').style.display = 'none';
  document.getElementById('signature').style.display = 'none';
  document.getElementById('qrcode').style.display = 'block';

  // Generate QR Code menggunakan qrcode.js
  const canvas = document.querySelector('#qrcode canvas');
  QRCode.toCanvas(canvas, content, { width: 300 }, function (error) {
    if (error) {
      console.error("Error generating QR code:", error);
    } else {
      // Menampilkan tombol download setelah QR Code dibuat
      document.getElementById('downloadBtn').style.display = 'inline-block';
      document.getElementById('buatBaruBtn').style.display = 'inline-block';
      setInner('qrcode h3', `QR Code untuk: ${alias}`); // Menampilkan nama QR
    }
  });
}

// Fungsi untuk mendownload QR Code
function downloadQRCode() {
  const canvas = document.querySelector('#qrcode canvas');
  const imageUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'qr-code.png';
  link.click();
}

// Fungsi untuk membuat QR code baru
function createNewQRCode() {
  // Menyembunyikan QR code lama dan menampilkan form
  document.getElementById('tab').style.display = 'block';
  document.getElementById('signature').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';

  // Reset input fields
  document.getElementById('signatureTextInput').value = '';
  document.getElementById('signatureImageInput').value = '';
  document.getElementById('signatureName').value = '';

  // Menyembunyikan tombol download QR dan tombol buat QR baru
  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('buatBaruBtn').style.display = 'none';
}

// Menambahkan event listener untuk tombol
onClick('generateBtn', generateQRCode); // Tombol untuk generate QR Code
onClick('downloadBtn', downloadQRCode); // Tombol untuk download QR Code
onClick('buatBaruBtn', createNewQRCode); // Tombol untuk buat QR Code baru
