// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// LOGIN.JS
// ==========================================================

console.log("LOGIN.JS LOADED");


// ==========================================================
// LOGIN FUNCTION
// ==========================================================

function login() {

    console.log("LOGIN BUTTON CLICKED");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const message =
        document.getElementById("message");

    const loginButton =
        document.getElementById("loginButton");


    if (!emailElement || !passwordElement) {

        console.error(
            "Email or password field not found."
        );

        return;

    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    // ======================================================
    // VALIDATION
    // ======================================================

    if (!email || !password) {

        if (message) {

            message.style.color = "#dc3545";

            message.textContent =
                "Please enter your email and password.";

        }

        return;

    }


    // ======================================================
    // BUTTON
    // ======================================================

    if (loginButton) {

        loginButton.disabled = true;

        loginButton.textContent =
            "LOGGING IN...";

    }


    if (message) {

        message.style.color = "#0b2447";

        message.textContent =
            "Logging in...";

    }


    // ======================================================
    // FIREBASE AUTHENTICATION
    // ======================================================

    auth.signInWithEmailAndPassword(
        email,
        password
    )

    .then(function(result) {

        const user = result.user;

        console.log(
            "LOGIN SUCCESS:",
            user.email
        );


        // ==================================================
        // CREATE LOGIN ACTIVITY
        // ==================================================

        const loginRecord = {

            action: "LOGIN",

            email: user.email,

            uid: user.uid,

            source: "Web Login",

            timestamp:
                new Date().toLocaleString(),

            createdAt:
                firebase.database.ServerValue.TIMESTAMP,

            userAgent:
                navigator.userAgent

        };


        // ==================================================
        // SAVE LOGIN ACTIVITY
        // ==================================================

        return database
            .ref("SmartStorage/loginActivity")
            .push(loginRecord)

            .then(function() {

                console.log(
                    "LOGIN ACTIVITY SAVED"
                );

            })

            .catch(function(error) {

                // IMPORTANT:
                // If the login log fails,
                // DO NOT prevent the user
                // from entering the dashboard.

                console.error(
                    "Could not save login activity:",
                    error
                );

            });

    })

    .then(function() {

        console.log(
            "GOING TO DASHBOARD..."
        );


        if (message) {

            message.style.color =
                "#28a745";

            message.textContent =
                "Login successful!";

        }


        // ==================================================
        // REDIRECT
        // ==================================================

        window.location.replace(
            "dashboard.html"
        );

    })

    .catch(function(error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        if (loginButton) {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "LOGIN";

        }


        let errorMessage =
            error.message;


        switch (error.code) {

            case "auth/invalid-email":

                errorMessage =
                    "Invalid email address.";

                break;


            case "auth/user-not-found":

                errorMessage =
                    "Account not found.";

                break;


            case "auth/wrong-password":

                errorMessage =
                    "Incorrect password.";

                break;


            case "auth/invalid-credential":

                errorMessage =
                    "Incorrect email or password.";

                break;


            case "auth/too-many-requests":

                errorMessage =
                    "Too many attempts. Please try again later.";

                break;

        }


        if (message) {

            message.style.color =
                "#dc3545";

            message.textContent =
                errorMessage;

        }

    });

}


// ==========================================================
// MAKE FUNCTION AVAILABLE
// ==========================================================

window.login = login;


// ==========================================================
// FORM SUPPORT
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const form =
            document.getElementById(
                "loginForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    login();

                }
            );

        }

    }
);        console.error(
            "AUTH is undefined."
        );


        if (message) {

            message.textContent =
                "Firebase Authentication is not initialized.";

        }

        return;

    }


    // ------------------------------------------------------
    // BUTTON
    // ------------------------------------------------------

    if (loginButton) {

        loginButton.disabled =
            true;

        loginButton.textContent =
            "LOGGING IN...";

    }


    if (message) {

        message.style.color =
            "#0b2447";

        message.textContent =
            "Checking account...";

    }


    // ======================================================
    // FIREBASE LOGIN
    // ======================================================

    auth
        .signInWithEmailAndPassword(
            email,
            password
        )

        .then(function(result) {

            console.log(
                "Firebase Authentication SUCCESS"
            );


            const user =
                result.user;


            console.log(
                "Logged in user:",
                user.email
            );


            // ==================================================
            // LOGIN ACTIVITY
            // ==================================================

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
                    new Date().toLocaleString(),

                createdAt:
                    firebase.database.ServerValue.TIMESTAMP,

                userAgent:
                    navigator.userAgent

            };


            // ==================================================
            // SAVE LOGIN ACTIVITY
            // ==================================================

            if (
                typeof database ===
                "undefined"
            ) {

                console.error(
                    "DATABASE is undefined."
                );


                // Still allow login
                // even if database logging fails

                window.location.href =
                    "dashboard.html";

                return null;

            }


            console.log(
                "Saving login activity..."
            );


            return database
                .ref(
                    "SmartStorage/loginActivity"
                )
                .push(
                    loginRecord
                );

        })

        .then(function() {

            console.log(
                "Login activity saved successfully."
            );


            if (message) {

                message.style.color =
                    "#28a745";

                message.textContent =
                    "Login successful!";

            }


            // ==================================================
            // REDIRECT TO DASHBOARD
            // ==================================================

            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 300);

        })

        .catch(function(error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            // --------------------------------------------------
            // ENABLE BUTTON AGAIN
            // --------------------------------------------------

            if (loginButton) {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "LOGIN";

            }


            // --------------------------------------------------
            // DISPLAY ERROR
            // --------------------------------------------------

            let errorMessage =
                error.message;


            switch (error.code) {

                case "auth/invalid-email":

                    errorMessage =
                        "Invalid email address.";

                    break;


                case "auth/user-not-found":

                    errorMessage =
                        "Account does not exist.";

                    break;


                case "auth/wrong-password":

                    errorMessage =
                        "Incorrect password.";

                    break;


                case "auth/invalid-credential":

                    errorMessage =
                        "Incorrect email or password.";

                    break;


                case "auth/too-many-requests":

                    errorMessage =
                        "Too many login attempts. Please try again later.";

                    break;

            }


            if (message) {

                message.style.color =
                    "#dc3545";

                message.textContent =
                    errorMessage;

            }

        });

}


// ==========================================================
// MAKE FUNCTION AVAILABLE TO HTML
// ==========================================================

window.login =
    login;


// ==========================================================
// FORM SUPPORT
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Login page ready."
        );


        const form =
            document.getElementById(
                "loginForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    login();

                }
            );

        }

    }
);

</div>


<!-- =====================================================
     FIREBASE
====================================================== -->

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-database-compat.js"></script>


<!-- YOUR FIREBASE CONFIG -->

<script src="firebase-config.js"></script>


<!-- LOGIN SCRIPT -->

<script src="login.js"></script>


</body>

</html>
