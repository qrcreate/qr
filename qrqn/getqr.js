import {onClick, setInner} from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import {getCookie, setCookieWithExpireDay} from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

async function makeQrCode(text, id_qr, downloadButtonId, shareButtonId) {
  try {
    // Generate QR code using qrcode.js and render it to canvas
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: 'M',
      color: {
        dark: "#000000",  // Dark color for the QR code
        light: "#FFFFFF"  // Light color (background)
      }
    }, function (error) {
      if (error) {
        console.error(error);
      } else {
        // Add the canvas as the QR code
        var qrContainer = document.getElementById(id_qr);
        qrContainer.innerHTML = '';  // Clear existing QR code
        qrContainer.appendChild(canvas);

        // Enable PNG download
        if (downloadButtonId) {
          const downloadButton = document.getElementById(downloadButtonId);
          downloadButton.style.display = 'inline-block';
          downloadButton.addEventListener('click', () => {
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'qr-code.png';
            a.click();
          });
        }
      }
    });
  } catch (error) {
    console.error('Error loading script or generating QR code:', error);
  }
}

function showQR(text) {
  if (typeof text === 'string' && text.length === 0) {
    document.getElementById('qrcode').style.display = 'none';
  } else {
    makeQrCode(text, 'whatsauthqr', 'downloadBtn', 'shareBtn');
  }
}

function checkCookies() {
  const qrcontent = getCookie("qrcontent");
  const alias = getCookie("alias");

  if (!qrcontent || !alias) {
    document.getElementById('userModal').style.display = 'flex';
    console.log("tampilkan modal");
  } else {
    document.getElementById('userModal').style.display = 'none';
    console.log("sembunyikan modal");
    showQR(qrcontent);
    setInner('useracclog', alias);
    console.log(alias);
    setCookieWithExpireDay("alias", alias, 365);
    setCookieWithExpireDay("qrcontent", qrcontent, 365);
  }
}

function saveUserInfo() {
  const alias = document.getElementById('alias').value;
  const qrcontent = document.getElementById('qrcontent').value;
  console.log(qrcontent);

  if (alias && qrcontent) {
    showQR(qrcontent);
    setCookieWithExpireDay("alias", alias, 365);
    setCookieWithExpireDay("qrcontent", qrcontent, 365);
    document.getElementById('userModal').style.display = 'none';
  } else {
    alert("Silakan masukkan semua informasi.");
  }
}

const urlhashcontent = window.location.hash.substring(1);
console.log(urlhashcontent);
if (urlhashcontent) {
  console.log("hash terdeteksi");
  showQR(urlhashcontent);
  setCookieWithExpireDay("alias", "QRCode", 365);
  setCookieWithExpireDay("qrcontent", urlhashcontent, 365);
} else {
  console.log("hash tidak terdeteksi");
  checkCookies();
}

onClick('buttonsimpaninfouser', saveUserInfo);
setInner('logs', navigator.userAgent);
