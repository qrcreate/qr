import { onClick, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

// Fungsi untuk menghasilkan QR code
function generateQRCode(event) {
  event.preventDefault(); // Mencegah refresh halaman ketika tombol diklik

  const url = document.getElementById('urlInput').value;
  const name = document.getElementById('urlName').value;

  // Validasi input
  if (!url || !name) {
    alert("Harap masukkan URL dan nama QR Code");
    return;
  }

  // Menyimpan URL dan nama ke cookie
  setCookieWithExpireDay("qrcontent", url, 365); // Menyimpan URL
  setCookieWithExpireDay("alias", name, 365); // Menyimpan nama QR Code

  // Menyembunyikan form dan menampilkan QR Code
  document.getElementById('url').style.display = 'none';
  document.getElementById('qrcode').style.display = 'block';
  document.querySelector('h1').style.display = 'none';

  // Generate QR Code menggunakan qrcode.js
  const canvas = document.querySelector('#qrcode canvas');
  QRCode.toCanvas(canvas, url, { width: 300 }, function (error) {
    if (error) {
      console.error("Error generating QR code:", error);
    } else {
      // Menampilkan tombol download setelah QR Code dibuat
      document.getElementById('downloadBtn').style.display = 'inline-block';
      document.getElementById('buatBaruBtn').style.display = 'inline-block';
      document.getElementById('qrName').textContent = `${name}`;
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
  document.querySelector('h1').style.display = 'none';
  document.getElementById('url').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';

  // Reset input fields
  document.getElementById('urlInput').value = '';
  document.getElementById('urlName').value = '';

  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('buatBaruBtn').style.display = 'none';
}

// Menambahkan event listener untuk tombol
onClick('generateBtn', generateQRCode); // Tombol untuk generate QR Code
onClick('downloadBtn', downloadQRCode); // Tombol untuk download QR Code
onClick('buatBaruBtn', createNewQRCode); // Tombol untuk buat QR Code baru
