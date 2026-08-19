// =====================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD JAVASCRIPT
// =====================================================


// =====================================================
// FIREBASE
// =====================================================

const database = firebase.database();


// =====================================================
// HELPER FUNCTION
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// FIREBASE CONNECTION
// =====================================================

const connectedRef =
    database.ref(".info/connected");


connectedRef.on("value", (snapshot) => {

    if (snapshot.val() === true) {

        setText(
            "firebaseStatus",
            "🟢 Firebase Connected"
        );

    } else {

        setText(
            "firebaseStatus",
            "🔴 Firebase Disconnected"
        );

    }

});


// =====================================================
// USER LOGIN
// =====================================================

firebase.auth().onAuthStateChanged((user) => {

    if (user) {

        setText(
            "userEmail",
            user.email || "User"
        );

    } else {

        setText(
            "userEmail",
            "Not logged in"
        );

    }

});


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await firebase.auth().signOut();

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Unable to logout."
                );

            }

        }
    );

}


// =====================================================
// COLLECTION CONTROL
// =====================================================
//
// Firebase:
//
// collection/
//     enabled
//
// true  = START
// false = STOP
//
// =====================================================

const collectionRef =
    database.ref("collection/enabled");


// =====================================================
// START COLLECTION
// =====================================================

const startButton =
    document.getElementById(
        "startCollection"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            collectionRef
                .set(true)
                .then(() => {

                    console.log(
                        "Collection started."
                    );

                })
                .catch((error) => {

                    console.error(
                        "Start error:",
                        error
                    );

                    alert(
                        "Unable to start collection."
                    );

                });

        }
    );

}


// =====================================================
// STOP COLLECTION
// =====================================================

const stopButton =
    document.getElementById(
        "stopCollection"
    );


if (stopButton) {

    stopButton.addEventListener(
        "click",
        () => {

            collectionRef
                .set(false)
                .then(() => {

                    console.log(
                        "Collection stopped."
                    );

                })
                .catch((error) => {

                    console.error(
                        "Stop error:",
                        error
                    );

                    alert(
                        "Unable to stop collection."
                    );

                });

        }
    );

}


// =====================================================
// COLLECTION STATUS
// =====================================================

collectionRef.on(
    "value",
    (snapshot) => {

        const enabled =
            snapshot.val() === true;


        if (enabled) {

            setText(
                "collectionStatus",
                "RUNNING"
            );

            setText(
                "summaryCollection",
                "RUNNING"
            );

        } else {

            setText(
                "collectionStatus",
                "STOPPED"
            );

            setText(
                "summaryCollection",
                "STOPPED"
            );

        }

    }
);


// =====================================================
// READ COLLECTED DATA
// =====================================================
//
// Firebase:
//
// collection/
//     data/
//         intValue
//         floatValue
//         stringValue
//
// =====================================================

const dataRef =
    database.ref("collection/data");


dataRef.on(
    "value",
    (snapshot) => {

        const data =
            snapshot.val();


        if (!data) {

            console.log(
                "No collection data."
            );

            return;

        }


        // =================================================
        // INT
        // =================================================

        if (
            data.intValue !== undefined &&
            data.intValue !== null
        ) {

            const intValue =
                parseInt(
                    data.intValue
                );


            setText(
                "intValue",
                intValue
            );


            setText(
                "summaryInt",
                intValue
            );

        }


        // =================================================
        // FLOAT
        // =================================================

        if (
            data.floatValue !== undefined &&
            data.floatValue !== null
        ) {

            const floatValue =
                parseFloat(
                    data.floatValue
                );


            setText(
                "floatValue",
                floatValue.toFixed(2)
            );


            setText(
                "summaryFloat",
                floatValue.toFixed(2)
            );

        }


        // =================================================
        // STRING
        // =================================================

        if (
            data.stringValue !== undefined &&
            data.stringValue !== null
        ) {

            const stringValue =
                String(
                    data.stringValue
                );


            setText(
                "stringValue",
                stringValue
            );


            setText(
                "summaryString",
                stringValue
            );

        }


        // =================================================
        // LAST UPDATE
        // =================================================

        const now =
            new Date();


        setText(
            "lastUpdate",
            now.toLocaleString()
        );


        // =================================================
        // ESP32 ONLINE
        // =================================================

        setText(
            "deviceStatus",
            "ONLINE"
        );


        setText(
            "deviceSource",
            "ESP32 is connected"
        );

    },
    (error) => {

        console.error(
            "Data error:",
            error
        );

    }
);


// =====================================================
// RECORD COUNT
// =====================================================
//
// Firebase:
//
// collection/
//     records
//
// The ESP32 increments this number
// every time data is collected.
//
// =====================================================

const recordCountRef =
    database.ref("collection/recordCount");


recordCountRef.on(
    "value",
    (snapshot) => {

        const count =
            parseInt(
                snapshot.val()
            ) || 0;


        setText(
            "recordCount",
            count
        );

    }
);


// =====================================================
// INITIAL MESSAGE
// =====================================================

console.log(
    "Smart Storage Dashboard loaded."
);

console.log(
    "Waiting for ESP32..."
);
