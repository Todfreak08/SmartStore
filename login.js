// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// LOGIN.JS
// Firebase Authentication + Realtime Database
// ==========================================================


// ==========================================================
// WAIT FOR PAGE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


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
                "Firebase SDK was not loaded."
            );


            message.textContent =
                "Firebase failed to load.";

            return;

        }


        if (
            typeof auth ===
            "undefined"
        ) {

            console.error(
                "Firebase Auth is not initialized."
            );


            message.textContent =
                "Firebase Authentication is not configured.";

            return;

        }


        if (
            typeof database ===
            "undefined"
        ) {

            console.error(
                "Firebase Database is not initialized."
            );


            message.textContent =
                "Firebase Database is not configured.";

            return;

        }


        // ==================================================
        // CHECK ALREADY LOGGED IN
        // ==================================================

        auth.onAuthStateChanged(
            function (user) {

                if (user) {

                    window.location.replace(
                        "dashboard.html"
                    );

                }

            }
        );


        // ==================================================
        // LOGIN FORM
        // ==================================================

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                message.textContent =
                    "";


                // ==========================================
                // VALIDATION
                // ==========================================

                if (!email) {

                    message.style.color =
                        "#dc3545";

                    message.textContent =
                        "Please enter your email.";

                    return;

                }


                if (!password) {

                    message.style.color =
                        "#dc3545";

                    message.textContent =
                        "Please enter your password.";

                    return;

                }


                // ==========================================
                // DISABLE BUTTON
                // ==========================================

                loginButton.disabled =
                    true;


                loginButton.textContent =
                    "LOGGING IN...";


                message.style.color =
                    "#0b2447";

                message.textContent =
                    "Please wait...";


                // ==========================================
                // FIREBASE LOGIN
                // ==========================================

                auth
                    .signInWithEmailAndPassword(
                        email,
                        password
                    )


                    // ======================================
                    // LOGIN SUCCESS
                    // ======================================

                    .then(
                        function (result) {

                            const user =
                                result.user;


                            console.log(
                                "Login successful:",
                                user.email
                            );


                            // ==============================
                            // CREATE LOGIN RECORD
                            // ==============================

                            const loginRecord = {

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
                                    firebase.database
                                        .ServerValue
                                        .TIMESTAMP,

                                userAgent:
                                    navigator.userAgent

                            };


                            console.log(
                                "Saving login activity...",
                                loginRecord
                            );


                            // ==============================
                            // SAVE TO FIREBASE
                            // ==============================

                            return database
                                .ref(
                                    "SmartStorage/loginActivity"
                                )
                                .push(
                                    loginRecord
                                );

                        }
                    )


                    // ======================================
                    // DATABASE SAVE SUCCESS
                    // ======================================

                    .then(
                        function () {

                            console.log(
                                "Login activity saved!"
                            );


                            message.style.color =
                                "#28a745";

                            message.textContent =
                                "Login successful!";


                            // ==========================
                            // GO TO DASHBOARD
                            // ==========================

                            setTimeout(
                                function () {

                                    window.location.replace(
                                        "dashboard.html"
                                    );

                                },
                                300
                            );

                        }
                    )


                    // ======================================
                    // ERROR
                    // ======================================

                    .catch(
                        function (error) {

                            console.error(
                                "Login error:",
                                error
                            );


                            loginButton.disabled =
                                false;


                            loginButton.textContent =
                                "LOGIN";


                            message.style.color =
                                "#dc3545";


                            // ==========================
                            // FRIENDLY ERROR
                            // ==========================

                            let errorMessage =
                                error.message;


                            if (
                                error.code ===
                                "auth/invalid-credential"
                            ) {

                                errorMessage =
                                    "Incorrect email or password.";

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
                                "auth/invalid-email"
                            ) {

                                errorMessage =
                                    "Invalid email address.";

                            }


                            message.textContent =
                                errorMessage;

                        }
                    );

            }
        );


    }
);
            createdAt:
                firebase.database.ServerValue.TIMESTAMP,

            source:
                "Web Login",

            userAgent:
                navigator.userAgent

        };


        console.log(
            "Saving login record:",
            loginRecord
        );


        // ==================================================
        // SAVE TO REALTIME DATABASE
        // ==================================================

        return database
            .ref("SmartStorage/loginActivity")
            .push(loginRecord);

    })


    .then(function (result) {

        console.log(
            "LOGIN ACTIVITY SAVED:",
            result.key
        );


        // ==================================================
        // REDIRECT AFTER DATABASE SAVE
        // ==================================================

        window.location.replace(
            "dashboard.html"
        );

    })


    .catch(function (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        if (message) {

            message.style.color =
                "#dc3545";

            message.textContent =
                error.message;

        }

    });

}


// ==========================================================
// MAKE LOGIN AVAILABLE TO HTML
// ==========================================================

window.login = login;                "LOGIN",

            email:
                user.email,

            uid:
                user.uid,

            timestamp:
                new Date()
                    .toLocaleString(),

            createdAt:
                firebase.database
                    .ServerValue
                    .TIMESTAMP,

            userAgent:
                navigator.userAgent

        };


        // --------------------------------------------------
        // SAVE LOGIN ACTIVITY
        // --------------------------------------------------

        return database
            .ref(
                "SmartStorage/loginActivity"
            )
            .push(loginActivity);

    })


    .then(() => {

        console.log(
            "Login activity saved to Firebase."
        );


        // --------------------------------------------------
        // GO TO DASHBOARD
        // --------------------------------------------------

        window.location.href =
            "dashboard.html";

    })


    .catch((error) => {

        console.error(
            "Login error:",
            error
        );


        message.style.color =
            "#dc3545";


        message.innerHTML =
            error.message;

    });

}


// ==========================================================
// MAKE LOGIN AVAILABLE TO HTML
// ==========================================================

window.login = login;
