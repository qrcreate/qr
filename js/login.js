import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.0/api.js';
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("manualLogin");

    if (!loginButton) {
        console.error("Login button not found!");
        return;
    }

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent page reload

        // Retrieve email and password inputs
        const email = document.getElementById("emailInput")?.value.trim();
        const password = document.getElementById("passwordInput")?.value.trim();

        // Validation: Ensure fields are filled
        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "Incomplete Form",
                text: "Please fill out both email and password.",
            });
            return;
        }

        // Data to be sent to backend
        const data = { email, password };

        // Backend login URL
        const target_url = "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/qr/login";

        // Show loading spinner
        Swal.fire({
            title: "Logging in...",
            html: "Please wait while we authenticate your credentials.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Send login data using postJSON
        postJSON(
            target_url,
            "Content-Type",
            "application/json",
            data,
            function (response) {
                Swal.close(); // Hide loading spinner

                if (response.status >= 200 && response.status < 300) {
                    Swal.fire({
                        icon: "success",
                        title: "Login Successful",
                        text: "Welcome back! Redirecting to the dashboard...",
                        timer: 3000,
                        timerProgressBar: true,
                        willClose: () => {
                            // Redirect to dashboard (or desired page)
                            window.location.href = "../home.html";
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: response.data.message || "Invalid email or password.",
                    });
                }
            },
            function (error) {
                Swal.close(); // Hide loading spinner
                Swal.fire({
                    icon: "error",
                    title: "Network Error",
                    text: "Failed to connect to the server. Please check your internet connection.",
                });
                console.error("Network error:", error); // Debugging log
            }
        );
    });
});
