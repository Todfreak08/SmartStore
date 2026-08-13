// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// SHARED LOGOUT.JS
// ==========================================================

(function () {

    "use strict";


    // ======================================================
    // LOGOUT FUNCTION
    // ======================================================

    function smartStorageLogout() {

        // Make sure Firebase Authentication is available
        if (
            typeof auth === "undefined"
        ) {

            console.error(
                "Firebase Auth is not loaded."
            );

            window.location.replace(
                "index.html"
            );

            return;

        }


        const user =
            auth.currentUser;


        // ==================================================
        // NO CURRENT USER
        // ==================================================

        if (!user) {

            window.location.replace(
                "index.html"
            );

            return;

        }


        // ==================================================
        // LOGOUT ACTIVITY
        // ==================================================

        const logoutActivity = {

            action: "LOGOUT",

            email:
                user.email || "",

            uid:
                user.uid || "",

            timestamp:
                new Date().toLocaleString(),

            createdAt:
                firebase.database.ServerValue.TIMESTAMP,

            userAgent:
                navigator.userAgent || ""

        };


        // ==================================================
        // SAVE LOGOUT ACTIVITY
        // ==================================================

        let saveActivity =
            Promise.resolve();


        if (
            typeof database !== "undefined"
        ) {

            saveActivity =
                database
                    .ref(
                        "SmartStorage/loginActivity"
                    )
                    .push(
                        logoutActivity
                    );

        }


        // ==================================================
        // SIGN OUT
        // ==================================================

        saveActivity

            .catch((error) => {

                // Do not prevent logout if
                // Firebase activity logging fails.

                console.warn(
                    "Could not save logout activity:",
                    error
                );

            })

            .then(() => {

                return auth.signOut();

            })

            .then(() => {

                console.log(
                    "Logout successful."
                );


                // Replace prevents the user from
                // returning to the protected page
                // using browser history.

                window.location.replace(
                    "index.html"
                );

            })

            .catch((error) => {

                console.error(
                    "Logout error:",
                    error
                );


                // Force logout even if something
                // unexpected happens.

                try {

                    auth.signOut();

                }

                catch (e) {

                    console.error(e);

                }


                window.location.replace(
                    "index.html"
                );

            });

    }


    // ======================================================
    // MAKE FUNCTION AVAILABLE TO HTML
    // ======================================================

    window.smartStorageLogout =
        smartStorageLogout;


})();
