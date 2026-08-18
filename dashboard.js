// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
//
// SYSTEM:
// WEBSITE
//    ↓
// FIREBASE REALTIME DATABASE
//    ↓
// ESP32
//    ↓
// PHYSICAL GPIO OUTPUTS
//
// NO DHT11
// NO HUMIDITY SENSOR
// NO MOTION SENSOR
// NO SD CARD
// ==========================================================


// ==========================================================
// FIREBASE AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    const email =
        document.getElementById("userEmail");

    if (email) {

        email.textContent =
            user.email;

    }

});


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    auth.signOut()

        .then(function () {

            window.location.href =
                "index.html";

        })

        .catch(function (error) {

            console.error(
                "Logout error:",
                error
            );

        });

}


// ==========================================================
// LOGOUT BUTTON
// ==========================================================

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    if (!logoutButton) {

        console.warn(
            "Logout button not found."
        );

        return;
    }

    logoutButton.addEventListener(
        "click",
        function () {

            logoutButton.disabled =
                true;

            logoutButton.textContent =
                "Logging out...";

            auth.signOut()

                .then(function () {

                    window.location.href =
                        "index.html";

                })

                .catch(function (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                    logoutButton.disabled =
                        false;

                    logoutButton.textContent =
                        "🚪 Logout";

                    alert(
                        "Logout failed: " +
                        error.message
                    );

                });

        }
    );

}


// ==========================================================
// FIREBASE CONNECTION STATUS
// ==========================================================

function initializeFirebaseConnection() {

    const status =
        document.getElementById(
            "firebaseStatus"
        );

    if (!status) {

        return;
    }

    database
        .ref(".info/connected")
        .on(
            "value",
            function (snapshot) {

                if (
                    snapshot.val() === true
                ) {

                    status.textContent =
                        "● Firebase Connected";

                    status.style.color =
                        "#28a745";

                }

                else {

                    status.textContent =
                        "● Firebase Disconnected";

                    status.style.color =
                        "#dc3545";

                }

            }
        );

}


// ==========================================================
// ESP32 STATUS LISTENER
// ==========================================================
//
// Reads:
//
// smartStorage
//     esp32
//         online
//         lastSeen
//         device
//
// ==========================================================

function initializeESP32Listener() {

    database
        .ref("smartStorage/esp32")
        .on(
            "value",
            function (snapshot) {

                const status =
                    document.getElementById(
                        "firebaseStatus"
                    );

                if (!snapshot.exists()) {

                    if (status) {

                        status.textContent =
                            "● Firebase Connected — Waiting for ESP32";

                        status.style.color =
                            "#f39c12";

                    }

                    return;
                }

                const esp32 =
                    snapshot.val();

                if (
                    esp32.online === true
                ) {

                    if (status) {

                        status.textContent =
                            "● ESP32 Connected";

                        status.style.color =
                            "#28a745";

                    }

                }

                else {

                    if (status) {

                        status.textContent =
                            "● ESP32 Offline";

                        status.style.color =
                            "#dc3545";

                    }

                }

                console.log(
                    "ESP32 STATUS:",
                    esp32
                );

            }
        );

}


// ==========================================================
// LOAD SWITCH STATES
// ==========================================================
//
// Reads the exact Firebase paths:
//
// smartStorage/commands/light/state
// smartStorage/commands/fan/state
// smartStorage/commands/door/state
// smartStorage/commands/alarm/state
//
// ==========================================================

function initializeSwitchListeners() {

    loadSwitch(
        "light",
        "lightSwitch"
    );

    loadSwitch(
        "fan",
        "fanSwitch"
    );

    loadSwitch(
        "door",
        "doorSwitch"
    );

    loadSwitch(
        "alarm",
        "alarmSwitch"
    );

}


// ==========================================================
// LOAD ONE SWITCH
// ==========================================================

function loadSwitch(
    device,
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {

        console.warn(
            "Switch not found:",
            elementId
        );

        return;
    }

    const path =
        "smartStorage/commands/" +
        device +
        "/state";

    database
        .ref(path)
        .on(
            "value",
            function (snapshot) {

                if (
                    snapshot.exists()
                ) {

                    const state =
                        snapshot.val();

                    element.checked =
                        Boolean(state);

                    updateSwitchStatus(
                        device,
                        Boolean(state)
                    );

                    console.log(
                        device +
                        " state:",
                        state
                    );

                }

                else {

                    // Default state

                    element.checked =
                        false;

                    updateSwitchStatus(
                        device,
                        false
                    );

                }

            }
        );

}


// ==========================================================
// CONNECT WEBSITE SWITCHES
// ==========================================================

function initializeSwitchControls() {

    connectSwitch(
        "lightSwitch",
        "light"
    );

    connectSwitch(
        "fanSwitch",
        "fan"
    );

    connectSwitch(
        "doorSwitch",
        "door"
    );

    connectSwitch(
        "alarmSwitch",
        "alarm"
    );

}


// ==========================================================
// CONNECT ONE SWITCH
// ==========================================================

function connectSwitch(
    elementId,
    device
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {

        console.warn(
            "Cannot connect switch:",
            elementId
        );

        return;
    }

    element.addEventListener(
        "change",
        function () {

            const state =
                element.checked;

            console.log(
                "WEBSITE COMMAND:",
                device,
                state
            );

            updateDeviceCommand(
                device,
                state
            );

        }
    );

}


// ==========================================================
// UPDATE DEVICE COMMAND
// ==========================================================
//
// THIS IS THE MOST IMPORTANT FUNCTION.
//
// Website writes:
//
// smartStorage/commands/light/state
// smartStorage/commands/fan/state
// smartStorage/commands/door/state
// smartStorage/commands/alarm/state
//
// ESP32 reads those exact paths.
//
// ==========================================================

function updateDeviceCommand(
    device,
    state
) {

    const path =
        "smartStorage/commands/" +
        device +
        "/state";

    const commandData = {

        state:
            Boolean(state),

        source:
            "Website",

        timestamp:
            new Date()
                .toLocaleString(
                    "en-PH"
                ),

        updatedAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };

    console.log(
        "Sending command to Firebase:",
        path,
        commandData
    );


    // ======================================================
    // WRITE COMMAND
    // ======================================================

    database
        .ref(
            "smartStorage/commands/" +
            device
        )
        .set(
            commandData
        )

        .then(function () {

            console.log(
                "COMMAND SUCCESS:",
                device,
                state
            );

            updateSwitchStatus(
                device,
                state
            );

        })

        .catch(function (error) {

            console.error(
                "COMMAND FAILED:",
                error
            );

            alert(
                "Unable to send command to Firebase.\n\n" +
                error.message
            );


            // Revert switch

            const element =
                document.getElementById(
                    device + "Switch"
                );

            if (element) {

                element.checked =
                    !state;

            }

        });

}


// ==========================================================
// UPDATE SWITCH TEXT
// ==========================================================

function updateSwitchStatus(
    device,
    state
) {

    let statusId = "";


    if (device === "light") {

        statusId =
            "lightStatus";

    }

    else if (device === "fan") {

        statusId =
            "fanStatus";

    }

    else if (device === "door") {

        statusId =
            "doorStatus";

    }

    else if (device === "alarm") {

        statusId =
            "alarmStatus";

    }


    if (!statusId) {

        return;
    }


    const element =
        document.getElementById(
            statusId
        );

    if (!element) {

        return;
    }


    // Door uses OPEN/CLOSED

    if (device === "door") {

        element.textContent =
            state
                ? "OPEN"
                : "CLOSED";

    }

    else {

        element.textContent =
            state
                ? "ON"
                : "OFF";

    }


    element.style.color =
        state
            ? "#28a745"
            : "#777";

}


// ==========================================================
// LIVE CLOCK
// ==========================================================

function updateClock() {

    const element =
        document.getElementById(
            "currentDateTime"
        );

    if (!element) {

        return;
    }

    const now =
        new Date();

    element.textContent =

        now.toLocaleDateString(
            "en-PH",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        )

        + " • " +

        now.toLocaleTimeString(
            "en-PH"
        );

}


updateClock();

setInterval(
    updateClock,
    1000
);


// ==========================================================
// INITIALIZE DASHBOARD
// ==========================================================

function initializeDashboard() {

    console.log(
        "================================"
    );

    console.log(
        "SMART STORAGE DASHBOARD"
    );

    console.log(
        "================================"
    );

    console.log(
        "Website → Firebase → ESP32"
    );


    initializeLogout();

    initializeFirebaseConnection();

    initializeESP32Listener();

    initializeSwitchListeners();

    initializeSwitchControls();

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDashboard();

    }
);


// ==========================================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.logout =
    logout;

window.updateDeviceCommand =
    updateDeviceCommand;

window.updateSwitchStatus =
    updateSwitchStatus;
