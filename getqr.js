import { onClick, addScriptInHead, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

async function makeQrCode(text, id_qr) {
  try {
    // Memuat skrip QRCode
    await addScriptInHead('https://cdn.jsdelivr.net/gh/englishextra/qrjs2@latest/js/qrjs2.min.js');

    // Membuat QR Code sebagai string SVG
    const qr = QRCode.generateSVG(text, {
      ecclevel: "M",
      fillcolor: "#FFFFFF",
      textcolor: "#000000",
      margin: 4,
      modulesize: 8
    });

    // Mengonversi string SVG menjadi elemen DOM
    const svgElement = new DOMParser().parseFromString(qr, "image/svg+xml").documentElement;

    // Menambahkan QR code ke dalam elemen yang ditentukan
    var qrContainer = document.getElementById(id_qr);
    qrContainer.innerHTML = ''; // Menghapus konten lama jika ada
    qrContainer.appendChild(svgElement); // Menambahkan elemen SVG ke dalam container
  } catch (error) {
    console.error('Error loading script or generating QR code:', error);
  }
}

function showQR(text) {
  if (typeof text === 'string' && text.length === 0) {
    document.getElementById('qrcode').style.display = 'none';
  } else {
    document.getElementById('qrcode').style.display = 'block';
    makeQrCode(text, 'whatsauthqr');
  }
}

function handleQRCodeGeneration() {
  const urlInput = document.getElementById('urlInput').value;
  const urlName = document.getElementById('urlName').value;
  const sessionToggle = document.getElementById('sessionToggle').checked;

  let qrContent = urlInput;

  if (sessionToggle) {
    // QR Session (Cookies)
    setCookieWithExpireDay("qrcontent", qrContent, 5); // QR content akan berubah dalam 5 menit
    setCookieWithExpireDay("alias", urlName, 5);
    alert("QR Code akan berubah setelah beberapa menit.");
  } else {
    // QR Permanent (Downloadable)
    qrContent = `${window.location.origin}/download/${urlName}`; // Link untuk mengunduh QR Code
    setCookieWithExpireDay("qrcontent", qrContent, 365); // QR content permanent
    setCookieWithExpireDay("alias", urlName, 365);
  }

  showQR(qrContent);

  // Menampilkan tombol download jika QR Code permanent
  if (!sessionToggle) {
    document.getElementById('downloadBtn').style.display = 'inline-block';
  } else {
    document.getElementById('downloadBtn').style.display = 'none';
  }
}

function resetForm() {
  document.getElementById('urlInput').value = '';
  document.getElementById('urlName').value = '';
  document.getElementById('qrcode').style.display = 'none';
  document.getElementById('downloadBtn').style.display = 'none';
}

// Cek apakah QR Code session sudah ada
function checkCookies() {
  const qrcontent = getCookie("qrcontent");
  const alias = getCookie("alias");

  if (!qrcontent || !alias) {
    document.getElementById('userModal').style.display = 'flex';
    console.log("Tampilkan modal input");
  } else {
    document.getElementById('userModal').style.display = 'none';
    showQR(qrcontent);
    setInner('useracclog', alias);
    console.log("Alias: " + alias);
    setCookieWithExpireDay("alias", alias, 365);
    setCookieWithExpireDay("qrcontent", qrcontent, 365);
  }
}

// Event untuk tombol generate QR Code
onClick('generateBtn', handleQRCodeGeneration);

// Cek cookies saat halaman pertama kali dimuat
const urlhashcontent = window.location.hash.substring(1);
if (urlhashcontent) {
  console.log("Hash terdeteksi: " + urlhashcontent);
  showQR(urlhashcontent);
  setCookieWithExpireDay("alias", "QRCode", 365);
  setCookieWithExpireDay("qrcontent", urlhashcontent, 365);
} else {
  console.log("Hash tidak terdeteksi");
  checkCookies();
}
