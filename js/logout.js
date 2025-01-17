import { deleteCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

export const loading = `
<svg id="loading" class="lds-microsoft" width="80px" height="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g transform="rotate(0)">
    <circle cx="81.734" cy="74.350" fill="#e15b64" r="5" transform="rotate(340 50 50)">
      <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="0s"></animateTransform>
    </circle>
    <circle cx="74.350" cy="81.734" fill="#f47e60" r="5" transform="rotate(348.352 50 50)">
      <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.0625s"></animateTransform>
    </circle>
  </g>
</svg>
`;

window.logout = function() {
    deleteCookie("login"); 

    document.body.insertAdjacentHTML('beforeend', loading);

    setTimeout(() => {
      window.location.href = "https://qrcreate.github.io";
  }, 1500);
}

  logout();


