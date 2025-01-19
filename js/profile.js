import { getJSON, putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";

document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('login');

    if (token) {
        fetchUserData(token);
    } else {
        console.log("Token tidak ditemukan");
    }

    document.getElementById('save-button').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();

        if (name === "") {
            Swal.fire({
                icon: "error",
                title: "Nama Tidak Boleh Kosong",
                text: "Pastikan kamu mengisi nama dengan benar.",
            });
            return;
        }

        updateUserData(token, name);
    });
});

function fetchUserData(token) {
    const token = getCookie("login");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to view history.",
    }).then(() => {
      redirect("/login");
    });
    return;
  }

    getJSON("https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/data/user","login",getCookie("login"))
        .then(data => {
            if (data.status === "Error") {
                console.error("Error fetching user data:", data.response);
            } else {
                document.getElementById('name').value = data.name || '';
                document.getElementById('phonenumber').value = data.phonenumber || '';
                document.getElementById('email').value = data.email || '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateUserData(token, name) {
    const data = { name };

    putJSON("https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/data/user", "login",token, data)
        .then(response => {
            if (response.status === "Error") {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memperbarui Data",
                    text: response.response,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil Memperbarui Data",
                    text: "Nama Anda berhasil diperbarui.",
                });
                fetchUserData(token); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Gagal Terhubung ke Server",
                text: "Terjadi kesalahan saat memperbarui data.",
            });
        });
}
