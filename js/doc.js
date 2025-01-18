import { onClick, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

// Fungsi untuk menghasilkan QR code
function generateQRCode(event) {
  event.preventDefault(); // Mencegah refresh halaman ketika tombol diklik

  const documentInput = document.getElementById('documentInput'); // Input file
  const documentName = document.getElementById('documentName').value;

  if (!documentInput.files[0] || !documentName) {
    alert("Harap unggah dokumen dan masukkan nama QR Code");
    return;
  }

  // Membaca file yang diunggah menggunakan FileReader
  const file = documentInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    // Ambil data URL dari file
    const fileDataUrl = e.target.result;

    // Menyimpan file dan nama ke cookie (opsional)
    setCookieWithExpireDay("qrcontent", fileDataUrl, 365); // Menyimpan URL Data
    setCookieWithExpireDay("alias", documentName, 365); // Menyimpan nama QR Code

    // Menyembunyikan form dan menampilkan QR Code
    document.getElementById('tab').style.display = 'none';
    document.getElementById('document').style.display = 'none';
    document.getElementById('qrcode').style.display = 'block';

    // Generate QR Code menggunakan qrcode.js
    const canvas = document.querySelector('#qrcode canvas');
    QRCode.toCanvas(canvas, fileDataUrl, { width: 300 }, function (error) {
      if (error) {
        console.error("Error generating QR code:", error);
      } else {
        // Menampilkan tombol download setelah QR Code dibuat
        document.getElementById('downloadBtn').style.display = 'inline-block';
        document.getElementById('buatBaruBtn').style.display = 'inline-block';
        setInner('qrcode h3', `QR Code untuk: ${documentName}`); // Menampilkan nama QR
      }
    });
  };

  // Membaca file sebagai Data URL
  reader.readAsDataURL(file);
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
  document.getElementById('document').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';

  // Reset input fields
  document.getElementById('documentInput').value = '';
  document.getElementById('documentName').value = '';

  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('buatBaruBtn').style.display = 'none';
}

// Menambahkan event listener untuk tombol
onClick('generateBtn', generateQRCode); // Tombol untuk generate QR Code
onClick('downloadBtn', downloadQRCode); // Tombol untuk download QR Code
onClick('buatBaruBtn', createNewQRCode); // Tombol untuk buat QR Code baru
