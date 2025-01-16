import {onClick,addScriptInHead,setInner} from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/element.js';
import {getCookie,setCookieWithExpireDay} from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.3/cookie.js';



async function makeQrCode(text, id_qr) {
  try {
    await addScriptInHead('https://cdn.jsdelivr.net/gh/englishextra/qrjs2@latest/js/qrjs2.min.js'); // Tunggu sampai script selesai dimuat
    const qr = QRCode.generateSVG(text, {
      ecclevel: "M",
      fillcolor: "#FFFFFF",
      textcolor: "#000000",
      margin: 4,
      modulesize: 8
    });
    var svg = document.getElementById(id_qr);
    svg.replaceChild(qr, svg.firstElementChild);
  } catch (error) {
    console.error('Error loading script or generating QR code:', error);
  }
}


function showQR(text){
  if (typeof text === 'string' && text.length === 0) {
    document.getElementById('qrcode').style.display = 'none';
  } else {
    makeQrCode(text,'whatsauthqr');
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
      setInner('useracclog',alias);
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
if (urlhashcontent){
  console.log("hash terdeteksi");
  showQR(urlhashcontent);
  setCookieWithExpireDay("alias", "QRCode", 365);
  setCookieWithExpireDay("qrcontent", urlhashcontent, 365);
}else{
  console.log("hash tidak terdeteksi");
  checkCookies();
  //saveUserInfo();
}

onClick('buttonsimpaninfouser',saveUserInfo);
setInner('logs',navigator.userAgent);