// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE LOGIN.JS
// ==========================================================


// ==========================================================
// PAGE READY
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Login page loaded."
        );


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const loginButton =
            document.getElementById(
                "loginButton"
            );


        const message =
            document.getElementById(
                "message"
            );


        // ==================================================
        // CHECK FIREBASE
        // ==================================================

        if (
            typeof firebase ===
            "undefined"
        ) {

            console.error(
                "Firebase SDK not loaded."
            );


            message.textContent =
                "Firebase SDK failed to load.";

            return;

        }


        if (
            typeof auth ===
            "undefined"
        ) {

            console.error(
                "Firebase Auth unavailable."
            );


            message.textContent =
                "Firebase Authentication is unavailable.";

            return;

        }


        if (
            typeof database ===
            "undefined"
        ) {

            console.error(
                "Firebase Database unavailable."
            );


            message.textContent =
                "Firebase Database is unavailable.";

            return;

        }


        // ==================================================
        // LOGIN FORM
        // ==================================================

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                performLogin();

            }
        );


        // ==================================================
        // LOGIN FUNCTION
        // ==================================================

        function performLogin() {


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            // ----------------------------------------------
            // VALIDATION
            // ----------------------------------------------

            if (!email) {

                showMessage(
                    "Please enter your email.",
                    "error"
                );

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                return;

            }


            // ----------------------------------------------
            // DISABLE BUTTON
            // ----------------------------------------------

            loginButton.disabled =
                true;


            loginButton.textContent =
                "LOGGING IN...";


            showMessage(
                "Checking account...",
                "normal"
            );


            console.log(
                "Attempting Firebase login..."
            );


            // ==================================================
            // FIREBASE AUTHENTICATION
            // ==================================================

            auth
                .signInWithEmailAndPassword(
                    email,
                    password
                )


                // ==============================================
                // AUTHENTICATION SUCCESS
                // ==============================================

                .then(
                    function (result) {

                        const user =
                            result.user;


                        console.log(
                            "Authentication successful."
                        );


                        console.log(
                            "User:",
                            user.email
                        );


                        // ==========================================
                        // LOGIN ACTIVITY
                        // ==========================================

                        const loginActivity = {

                            action:
                                "LOGIN",

                            email:
                                user.email,

                            uid:
                                user.uid,

                            source:
                                "Web Login",

                            timestamp:
                                new Date()
                                    .toLocaleString(),

                            createdAt:
                                firebase
                                    .database
                                    .ServerValue
                                    .TIMESTAMP,

                            userAgent:
                                navigator.userAgent

                        };


                        console.log(
                            "Saving login activity...",
                            loginActivity
                        );


                        // ==========================================
                        // SAVE TO REALTIME DATABASE
                        // ==========================================

                        return database
                            .ref(
                                "SmartStorage/loginActivity"
                            )
                            .push(
                                loginActivity
                            );

                    }
                )


                // ==============================================
                // DATABASE SAVE SUCCESS
                // ==============================================

                .then(
                    function (result) {

                        console.log(
                            "Login activity saved."
                        );


                        if (result) {

                            console.log(
                                "Firebase key:",
                                result.key
                            );

                        }


                        showMessage(
                            "Login successful!",
                            "success"
                        );


                        // ==========================================
                        // REDIRECT
                        // ==========================================

                        setTimeout(
                            function () {

                                window.location.replace(
                                    "dashboard.html"
                                );

                            },
                            500
                        );

                    }
                )


                // ==============================================
                // ERROR
                // ==============================================

                .catch(
                    function (error) {

                        console.error(
                            "LOGIN ERROR:",
                            error
                        );


                        loginButton.disabled =
                            false;


                        loginButton.textContent =
                            "LOGIN";


                        let errorMessage =
                            error.message;


                        // ------------------------------------------
                        // FRIENDLY FIREBASE ERRORS
                        // ------------------------------------------

                        if (
                            error.code ===
                            "auth/invalid-credential"
                        ) {

                            errorMessage =
                                "Incorrect email or password.";

                        }


                        else if (
                            error.code ===
                            "auth/invalid-email"
                        ) {

                            errorMessage =
                                "Invalid email address.";

                        }


                        else if (
                            error.code ===
                            "auth/user-not-found"
                        ) {

                            errorMessage =
                                "Account not found.";

                        }


                        else if (
                            error.code ===
                            "auth/wrong-password"
                        ) {

                            errorMessage =
                                "Incorrect password.";

                        }


                        else if (
                            error.code ===
                            "auth/too-many-requests"
                        ) {

                            errorMessage =
                                "Too many login attempts. Try again later.";

                        }


                        else if (
                            error.code ===
                            "PERMISSION_DENIED"
                        ) {

                            errorMessage =
                                "Firebase Database permission denied.";

                        }


                        showMessage(
                            errorMessage,
                            "error"
                        );

                    }
                );

        }


        // ==================================================
        // MESSAGE
        // ==================================================

        function showMessage(
            text,
            type
        ) {

            message.textContent =
                text;


            if (
                type ===
                "success"
            ) {

                message.style.color =
                    "#28a745";

            }

            else if (
                type ===
                "error"
            ) {

                message.style.color =
                    "#dc3545";

            }

            else {

                message.style.color =
                    "#0b2447";

            }

        }

    }
);
