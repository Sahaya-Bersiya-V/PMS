document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       PROFILE PHOTO
    ========================================= */

    const avatarButton =
        document.querySelector(".avatar-edit-button");

    if (avatarButton) {

        avatarButton.addEventListener(
            "click",
            function () {

                alert(
                    "Profile photo upload will be available after backend integration."
                );

            }
        );

    }


    /* =========================================
       PASSWORD VISIBILITY
    ========================================= */

    const passwordButtons =
        document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    this.dataset.target;

                const input =
                    document.getElementById(targetId);

                if (!input) {
                    return;
                }

                const icon =
                    this.querySelector("i");


                if (input.type === "password") {

                    input.type = "text";

                    icon.classList.remove(
                        "bi-eye"
                    );

                    icon.classList.add(
                        "bi-eye-slash"
                    );

                } else {

                    input.type = "password";

                    icon.classList.remove(
                        "bi-eye-slash"
                    );

                    icon.classList.add(
                        "bi-eye"
                    );

                }

            }
        );

    });


    /* =========================================
       PASSWORD UPDATE
    ========================================= */

    const updatePasswordButton =
        document.getElementById(
            "updatePasswordBtn"
        );

    if (updatePasswordButton) {

        updatePasswordButton.addEventListener(
            "click",
            function () {

                const newPassword =
                    document.getElementById(
                        "newPassword"
                    ).value;

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    ).value;


                if (!newPassword || !confirmPassword) {

                    alert(
                        "Please enter and confirm your new password."
                    );

                    return;

                }


                if (newPassword !== confirmPassword) {

                    alert(
                        "New passwords do not match."
                    );

                    return;

                }


                alert(
                    "Password update will be connected to Django authentication during backend integration."
                );

            }
        );

    }

});