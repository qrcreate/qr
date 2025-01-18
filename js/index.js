import { onClick, setInner } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import { getCookie, setCookieWithExpireDay } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';

function generateQRCode(event) {
  event.preventDefault(); // Mencegah refresh halaman ketika tombol diklik

  const url = document.getElementById('urlInput').value;
  const name = document.getElementById('urlName').value;
  const logoInput = document.getElementById('logoInput').files[0]; // Ambil file logo jika ada
  
  if (!url || !name) {
    alert("Harap masukkan URL dan nama QR Code");
    return;
  }

  const fileType = logoInput.type;
if (!fileType.startsWith('image/')) {
  alert("Tolong pilih file gambar!");
  return;
}

  setCookieWithExpireDay("qrcontent", url, 365);
  setCookieWithExpireDay("alias", name, 365); 

  document.getElementById('tab').style.display = 'none';
  document.getElementById('url').style.display = 'none';
  document.getElementById('qrcode').style.display = 'block';

  const canvas = document.querySelector('#qrcode canvas');
  
  QRCode.toCanvas(canvas, url, { width: 300 }, function (error) {
    if (error) {
      console.error("Error generating QR code:", error);
    } else {
      if (logoInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const logo = new Image();
          logo.src = e.target.result;
          logo.onload = function () {
            const ctx = canvas.getContext('2d');
            const logoSize = 60; // Ukuran logo
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            ctx.drawImage(logo, x, y, logoSize, logoSize);
          };
        };
        reader.readAsDataURL(logoInput); // Convert gambar logo menjadi Data URL
      }

      document.getElementById('downloadBtn').style.display = 'inline-block';
      document.getElementById('buatBaruBtn').style.display = 'inline-block';
      setInner('qrcode h3', `QR Code untuk: ${name}`);
    }
  });
}

function downloadQRCode() {
  const canvas = document.querySelector('#qrcode canvas');
  const imageUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'qr-code.png';
  link.click();
}

function createNewQRCode() {
  document.getElementById('tab').style.display = 'block';
  document.getElementById('url').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';

  document.getElementById('urlInput').value = '';
  document.getElementById('urlName').value = '';
  document.getElementById('logoInput').value = ''; 

  document.getElementById('downloadBtn').style.display = 'none';
  document.getElementById('buatBaruBtn').style.display = 'none';
}

onClick('generateBtn', generateQRCode);
onClick('downloadBtn', downloadQRCode); 
onClick('buatBaruBtn', createNewQRCode);


