import { onClick, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.0/api.js'; // Import postJSON
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

function generateQRCode(event) {
  event.preventDefault(); // Mencegah refresh halaman ketika tombol diklik

  const url = document.getElementById('urlInput').value;
  const name = document.getElementById('urlName').value;

  if (!url || !name) {
    Swal.fire({
      icon: "error",
      title: "Input Tidak Lengkap",
      text: "Harap masukkan URL dan nama QR Code.",
    });
    return;
  }

  // Menyimpan URL dan nama ke cookie
  setCookieWithExpireDay("qrcontent", url, 365);
  setCookieWithExpireDay("alias", name, 365); 

  document.getElementById('url').style.display = 'none';
  document.getElementById('qrcode').style.display = 'block';
  document.querySelector('h1').style.display = 'none';

  // Generate QR Code menggunakan qrcode.js
  const canvas = document.querySelector('#qrcode canvas');
  QRCode.toCanvas(canvas, url, { width: 300 }, function (error) {
    if (error) {
      console.error("Error generating QR code:", error);
    } else {
      document.getElementById('downloadBtn').style.display = 'inline-block';
      document.getElementById('buatBaruBtn').style.display = 'inline-block';
      document.getElementById('qrName').textContent = `${name}`;

      // Kirim data QR code ke server menggunakan metode POST
      sendQRCodeToServer(url, name);
    }
  });
}

// Fungsi untuk mengirim data QR code ke server
function sendQRCodeToServer(url, name) {
  const token = getCookie("login");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to save QR code.",
    });
    return;
  }

  const data = { name, url }; // Data yang akan dikirim ke server

  postJSON(
    "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/post/qr",
    "login",
    token,
    data,
    (response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "QR Code Created",
          text: "QR Code telah berhasil dibuat dan disimpan.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Gagal menyimpan QR code. Nama QR sudah ada",
        });
      }
    }
  );
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

function createNewQRCode() {
  document.querySelector('h1').style.display = 'none';
  document.getElementById('url').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';

  document.getElementById('urlInput').value = '';
  document.getElementById('urlName').value = '';

  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('buatBaruBtn').style.display = 'none';
}

onClick('generateBtn', generateQRCode); 
onClick('downloadBtn', downloadQRCode); 
onClick('buatBaruBtn', createNewQRCode); 
