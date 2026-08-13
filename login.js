// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// LOGIN.JS
// Firebase Authentication + Login Activity
// ==========================================================


// ==========================================================
// IF ALREADY LOGGED IN
// ==========================================================

auth.onAuthStateChanged((user) => {

    if (user) {

        window.location.href =
            "dashboard.html";

    }

});


// ==========================================================
// LOGIN
// ==========================================================

function login() {

    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const message =
        document
            .getElementById("message");


    message.innerHTML = "";


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (
        email === "" ||
        password === ""
    ) {

        message.innerHTML =
            "Please enter your email and password.";

        return;

    }


    // ------------------------------------------------------
    // SHOW LOGIN STATUS
    // ------------------------------------------------------

    message.style.color =
        "#0b2447";

    message.innerHTML =
        "Logging in...";


    // ------------------------------------------------------
    // FIREBASE AUTHENTICATION
    // ------------------------------------------------------

    auth.signInWithEmailAndPassword(
        email,
        password
    )

    .then((result) => {

        const user =
            result.user;


        console.log(
            "Login successful:",
            user.email
        );


        // --------------------------------------------------
        // LOGIN ACTIVITY
        // --------------------------------------------------

        const loginActivity = {

            action:
                "LOGIN",

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
