// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// LOGIN.JS
// Firebase Authentication + Realtime Database Login Log
// ==========================================================


// ==========================================================
// CHECK IF ALREADY LOGGED IN
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (user) {

        window.location.replace("dashboard.html");

    }

});


// ==========================================================
// LOGIN FUNCTION
// ==========================================================

function login() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    if (message) {
        message.textContent = "";
    }


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

    .then(function (result) {

        const user = result.user;


        console.log(
            "Authentication successful:",
            user.email
        );


        // ==================================================
        // LOGIN RECORD
        // ==================================================

        const loginRecord = {

            action:
                "LOGIN",

            email:
                user.email,

            uid:
                user.uid,

            timestamp:
                new Date().toLocaleString(),

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
