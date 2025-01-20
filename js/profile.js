import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { setValue } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js"; // Mengimpor setValue
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/cookie.js";


function fetchUserData() {
    const token = getCookie("login"); // Mengambil token dari cookie
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You must be logged in to view your profile.",
        }).then(() => {
            window.location.href = "https://qrcreate.github.io/login/";
        });
        return;
    }

   
    getJSON("https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/data/user", "login", token)
        .then(data => {
            if (data.status === "Error") {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Fetch Data",
                    text: data.response,
                });
                console.error("Error fetching user data:", data.response);
            } else {
               
                setValue("name", data.name || ''); 
                setValue("phonenumber", data.phonenumber || ''); 
                setValue("email", data.email || ''); 
                console.log("User data fetched successfully:", data);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Fetch Error",
                text: "An error occurred while fetching user data.",
            });
            console.error("Fetch error:", error);
        });
}

document.addEventListener('DOMContentLoaded', fetchUserData);
