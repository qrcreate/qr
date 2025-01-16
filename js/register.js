import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.0/api.js';
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

function register() {
    console.log("Register button clicked"); // Debugging log
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!name || !email || !password) {
        console.log("Validation failed: Missing fields"); // Debugging log
        Swal.fire({
            icon: "error",
            title: "Incomplete Form",
            text: "Please fill out all fields to proceed.",
        });
        return;
    }

    if (!validateEmail(email)) {
        console.log("Validation failed: Invalid email"); // Debugging log
        Swal.fire({
            icon: "error",
            title: "Invalid Email Address",
            text: "Please enter a valid email format.",
        });
        return;
    }

    if (password.length < 6) {
        console.log("Validation failed: Weak password"); // Debugging log
        Swal.fire({
            icon: "error",
            title: "Weak Password",
            text: "Your password must be at least 6 characters.",
        });
        return;
    }

    const data = { username: name, email, password };
    const target_url = "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/qr/user";

    Swal.fire({
        title: "Registering...",
        html: "Please wait while we process your registration.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    postJSON(
        target_url,
        "Content-Type",
        "application/json",
        data,
        (response) => {
            console.log("Response received:", response); // Debugging log
            Swal.close();

            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "Welcome!",
                    html: `<b>Registration Successful!</b><br>You will be redirected shortly.`,
                    timer: 3000,
                    timerProgressBar: true,
                    willClose: () => {
                        window.location.href = "../home.html";
                    },
                });
            } else {
                console.log("Response error:", response); // Debugging log
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: response.data.message || "Unexpected error occurred. Please try again.",
                });
            }
        },
        (error) => {
            console.error("Network error:", error); // Debugging log
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Failed to connect to the server. Please check your connection and try again.",
            });
        }
    );
}

// Email Validation Function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Attach Register Function to Button
document.getElementById("registerButton").addEventListener("click", register);
