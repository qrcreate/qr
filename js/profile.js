document.addEventListener("DOMContentLoaded", () => {
    const profileImgInput = document.getElementById("profile-img");
    const profilePreview = document.getElementById("profilePreview");

    // URL endpoint backend untuk profile
    const target_url = "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/qr/user";

    profileImgInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const cancelBtn = document.querySelector(".cancel-btn");
    const saveBtn = document.querySelector(".save-btn");

    cancelBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to discard changes?")) {
            window.location.reload();
        }
    });

    document.querySelector(".profile-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const profileData = {
            name: formData.get("name"),
            email: formData.get("email"),
            profileImg: profilePreview.src
        };

        try {
            const response = await fetch(target_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            alert("Profile updated successfully!");
            console.log("Server Response:", result);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again later.");
        }
    });
});
