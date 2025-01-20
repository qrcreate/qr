import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";

// Fungsi untuk mengambil data pengguna
function fetchUserData() {
    const token = getCookie("login"); // Mengambil token dari cookie
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Kode QR telah berhasil dibuat dan disimpan.",
        }).then(() => {
            window.location.href = "https://qrcreate.github.io/login/";
        });
        return;
    }

    // Request data user dari API menggunakan jscroot
    getJSON("https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/data/user","login",getCookie("login"))
        .then(data => {
            if (data.status === "Error") {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Mengambil Data",
                    text: data.response,
                });
                console.error("Error fetching user data:", data.response);
            } else {
                // Mengisi form dengan data pengguna yang diterima
                document.getElementById("name").value = data.name || '';
                document.getElementById("phonenumber").value = data.phonenumber || '';
                document.getElementById("email").value = data.email || '';
                console.log("User data fetched successfully:", data);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Fetch Error",
                text: "Terjadi kesalahan saat mengambil data pengguna.",
            });
            console.error("Fetch error:", error);
        });
}

// Memastikan DOM sudah siap sebelum memanggil fetchUserData
document.addEventListener('DOMContentLoaded', fetchUserData);

