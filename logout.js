// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// SHARED LOGOUT.JS
// ==========================================================

(function () {

    "use strict";

    function performLogout() {

        console.log("Logout button clicked.");

        // --------------------------------------------------
        // CHECK FIREBASE AUTH
        // --------------------------------------------------

        if (typeof firebase === "undefined") {

            console.error("Firebase is not loaded.");

            window.location.replace("index.html");

            return;
        }


        if (typeof auth === "undefined") {

            console.error("Firebase Auth is not loaded.");

            window.location.replace("index.html");

            return;
        }


        const user = auth.currentUser;


        // --------------------------------------------------
        // IF NO USER
        // --------------------------------------------------

        if (!user) {

            console.log(
                "No logged-in user. Redirecting..."
            );

            window.location.replace("index.html");

            return;
        }


        // --------------------------------------------------
        // SAVE LOGOUT ACTIVITY
        // --------------------------------------------------

        const logoutData = {

            action: "LOGOUT",

            email: user.email || "",

            uid: user.uid || "",

            timestamp:
                new Date().toLocaleString(),

            createdAt:
                firebase.database.ServerValue.TIMESTAMP,

            userAgent:
                navigator.userAgent || ""

        };


        let activityPromise =
            Promise.resolve();


        // --------------------------------------------------
        // SAVE TO FIREBASE
        // --------------------------------------------------

        if (typeof database !== "undefined") {

            activityPromise =
                database
                    .ref(
                        "SmartStorage/loginActivity"
                    )
                    .push(logoutData);

        }


        // --------------------------------------------------
        // SIGN OUT
        // --------------------------------------------------

        activityPromise
            .catch((error) => {

                console.warn(
                    "Logout activity could not be saved:",
                    error
                );

            })
            .then(() => {

                console.log(
                    "Signing out..."
                );

                return auth.signOut();

            })
            .then(() => {

                console.log(
                    "Firebase logout successful."
                );

                // --------------------------------------------------
                // REDIRECT
                // --------------------------------------------------

                window.location.replace(
                    "index.html"
                );

            })
            .catch((error) => {

                console.error(
                    "Logout failed:",
                    error
                );

                // Force sign out

                auth.signOut()
                    .finally(() => {

                        window.location.replace(
                            "index.html"
                        );

                    });

            });

    }


    // ------------------------------------------------------
    // MAKE AVAILABLE TO HTML
    // ------------------------------------------------------

    window.performLogout =
        performLogout;


    // ------------------------------------------------------
    // ALSO SUPPORT OLD logout() BUTTONS
    // ------------------------------------------------------

    window.logout =
        performLogout;


    // ------------------------------------------------------
    // AUTOMATICALLY CONNECT BUTTONS
    // ------------------------------------------------------

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const buttons =
                document.querySelectorAll(
                    ".logout-btn"
                );


            buttons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            performLogout();

                        }
                    );

                }
            );

        }
    );

})();
