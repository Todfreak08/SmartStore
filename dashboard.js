// ============================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
// ESP32 + FIREBASE REALTIME DATABASE
//
// FIREBASE STRUCTURE:
//
// smartStorage
// ├── current
// │   ├── light
// │   ├── fan
// │   ├── door
// │   └── alarm
// │
// ├── status
// │   ├── online
// │   ├── wifi
// │   ├── ip
// │   ├── dateTime
// │   └── lastUpdate
// │
// ├── history
// │
// ├── alerts
// │
// └── commands
//     ├── light
//     ├── fan
//     ├── door
//     └── alarm
//
// ============================================================


// ============================================================
// WAIT FOR PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("SMART STORAGE DASHBOARD STARTING");
    console.log("=================================");

    initializeDashboard();

});


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

function initializeDashboard() {

    // --------------------------------------------------------
    // CHECK FIREBASE
    // --------------------------------------------------------

    if (typeof firebase === "undefined") {

        console.error("Firebase library was not loaded.");

        setFirebaseStatus(
            "❌ Firebase library not loaded",
            false
        );

        return;
    }


    if (typeof database === "undefined") {

        console.error(
            "Firebase database is not available."
        );

        setFirebaseStatus(
            "❌ Firebase database unavailable",
            false
        );

        return;
    }


    console.log("Firebase database detected.");


    // --------------------------------------------------------
    // LOGIN
    // --------------------------------------------------------

    setupAuthentication();


    // --------------------------------------------------------
    // FIREBASE CONNECTION
    // --------------------------------------------------------

    monitorFirebaseConnection();


    // --------------------------------------------------------
    // ESP32 DATA
    // --------------------------------------------------------

    monitorESP32();


    // --------------------------------------------------------
    // CURRENT STATE
    // --------------------------------------------------------

    monitorCurrentState();


    // --------------------------------------------------------
    // COMMAND SWITCHES
    // --------------------------------------------------------

    setupControlSwitches();

}


// ============================================================
// AUTHENTICATION
// ============================================================

function setupAuthentication() {

    if (typeof auth === "undefined") {

        console.warn(
            "Firebase Auth object not found."
        );

        return;
    }


    auth.onAuthStateChanged(function (user) {

        const userEmail =
            document.getElementById("userEmail");


        if (user) {

            console.log(
                "Logged in:",
                user.email
            );


            if (userEmail) {

                userEmail.textContent =
                    user.email;

            }

        } else {

            console.log(
                "No authenticated user."
            );


            if (userEmail) {

                userEmail.textContent =
                    "Not logged in";

            }

        }

    });


    // --------------------------------------------------------
    // LOGOUT BUTTON
    // --------------------------------------------------------

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                auth.signOut()
                    .then(function () {

                        console.log(
                            "Logged out."
                        );

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
        );

    }

}


// ============================================================
// FIREBASE CONNECTION
// ============================================================

function monitorFirebaseConnection() {

    const connectionRef =
        database.ref(".info/connected");


    connectionRef.on(
        "value",
        function (snapshot) {

            const connected =
                snapshot.val();


            if (connected === true) {

                console.log(
                    "Firebase: CONNECTED"
                );


                setFirebaseStatus(
                    "🟢 Firebase Connected",
                    true
                );

            } else {

                console.log(
                    "Firebase: DISCONNECTED"
                );


                setFirebaseStatus(
                    "🔴 Firebase Disconnected",
                    false
                );

            }

        }
    );

}


// ============================================================
// FIREBASE STATUS DISPLAY
// ============================================================

function setFirebaseStatus(
    message,
    connected
) {

    const element =
        document.getElementById(
            "firebaseStatus"
        );


    if (!element) return;


    element.textContent = message;


    if (connected) {

        element.style.color = "#35a853";

    } else {

        element.style.color = "#d93025";

    }

}


// ============================================================
// MONITOR ESP32
// ============================================================

function monitorESP32() {

    console.log(
        "Listening to smartStorage/status"
    );


    const statusRef =
        database.ref(
            "smartStorage/status"
        );


    statusRef.on(
        "value",
        function (snapshot) {

            const data =
                snapshot.val();


            console.log(
                "ESP32 STATUS:",
                data
            );


            if (!data) {

                showESP32Offline();

                return;
            }


            updateESP32Status(data);

        },
        function (error) {

            console.error(
                "Status read error:",
                error
            );

            showESP32Offline();

        }
    );

}


// ============================================================
// UPDATE ESP32 STATUS
// ============================================================

function updateESP32Status(data) {

    const deviceStatus =
        document.getElementById(
            "deviceStatus"
        );


    const deviceSource =
        document.getElementById(
            "deviceSource"
        );


    const wifiSignal =
        document.getElementById(
            "wifiSignal"
        );


    const deviceIP =
        document.getElementById(
            "deviceIP"
        );


    const deviceDateTime =
        document.getElementById(
            "deviceDateTime"
        );


    const lastUpdate =
        document.getElementById(
            "lastUpdate"
        );


    // --------------------------------------------------------
    // ONLINE
    // --------------------------------------------------------

    let online =
        data.online;


    if (
        online === true ||
        online === "true" ||
        online === "ONLINE" ||
        online === "online"
    ) {

        if (deviceStatus) {

            deviceStatus.textContent =
                "ONLINE";

            deviceStatus.style.color =
                "#159447";

        }

    } else {

        if (deviceStatus) {

            deviceStatus.textContent =
                "OFFLINE";

            deviceStatus.style.color =
                "#d93025";

        }

    }


    // --------------------------------------------------------
    // SOURCE
    // --------------------------------------------------------

    if (deviceSource) {

        deviceSource.textContent =
            data.source ||
            "ESP32";

    }


    // --------------------------------------------------------
    // WIFI
    // --------------------------------------------------------

    if (wifiSignal) {

        let wifi =
            data.wifi ??
            data.rssi ??
            data.signal ??
            "--";


        if (
            typeof wifi === "number"
        ) {

            wifiSignal.textContent =
                wifi + " dBm";

        } else {

            wifiSignal.textContent =
                wifi;

        }

    }


    // --------------------------------------------------------
    // IP
    // --------------------------------------------------------

    if (deviceIP) {

        deviceIP.textContent =
            data.ip ||
            data.IP ||
            "--";

    }


    // --------------------------------------------------------
    // DATE AND TIME
    // --------------------------------------------------------

    if (deviceDateTime) {

        deviceDateTime.textContent =
            data.dateTime ||
            data.datetime ||
            data.time ||
            data.date ||
            "Waiting for ESP32...";

    }


    // --------------------------------------------------------
    // LAST UPDATE
    // --------------------------------------------------------

    if (lastUpdate) {

        if (data.lastUpdate) {

            lastUpdate.textContent =
                "Last update: " +
                formatTimestamp(
                    data.lastUpdate
                );

        } else {

            lastUpdate.textContent =
                "ESP32 data received.";

        }

    }

}


// ============================================================
// ESP32 OFFLINE
// ============================================================

function showESP32Offline() {

    const deviceStatus =
        document.getElementById(
            "deviceStatus"
        );


    const deviceSource =
        document.getElementById(
            "deviceSource"
        );


    const wifiSignal =
        document.getElementById(
            "wifiSignal"
        );


    const deviceIP =
        document.getElementById(
            "deviceIP"
        );


    const deviceDateTime =
        document.getElementById(
            "deviceDateTime"
        );


    const lastUpdate =
        document.getElementById(
            "lastUpdate"
        );


    if (deviceStatus) {

        deviceStatus.textContent =
            "OFFLINE";

        deviceStatus.style.color =
            "#d93025";

    }


    if (deviceSource) {

        deviceSource.textContent =
            "Waiting for ESP32...";

    }


    if (wifiSignal) {

        wifiSignal.textContent =
            "--";

    }


    if (deviceIP) {

        deviceIP.textContent =
            "--";

    }


    if (deviceDateTime) {

        deviceDateTime.textContent =
            "Waiting for ESP32...";

    }


    if (lastUpdate) {

        lastUpdate.textContent =
            "No ESP32 data received yet.";

    }

}


// ============================================================
// MONITOR CURRENT DEVICE STATE
// ============================================================

function monitorCurrentState() {

    console.log(
        "Listening to smartStorage/current"
    );


    const currentRef =
        database.ref(
            "smartStorage/current"
        );


    currentRef.on(
        "value",
        function (snapshot) {

            const data =
                snapshot.val();


            console.log(
                "CURRENT ESP32 STATE:",
                data
            );


            if (!data) {

                return;

            }


            updateCurrentState(data);

        },
        function (error) {

            console.error(
                "Current state error:",
                error
            );

        }
    );

}


// ============================================================
// UPDATE CURRENT STATE
// ============================================================

function updateCurrentState(data) {

    // --------------------------------------------------------
    // LIGHT
    // --------------------------------------------------------

    const light =
        getDeviceValue(
            data,
            "light"
        );


    updateDeviceDisplay(
        "light",
        light
    );


    // --------------------------------------------------------
    // FAN
    // --------------------------------------------------------

    const fan =
        getDeviceValue(
            data,
            "fan"
        );


    updateDeviceDisplay(
        "fan",
        fan
    );


    // --------------------------------------------------------
    // DOOR
    // --------------------------------------------------------

    const door =
        getDeviceValue(
            data,
            "door"
        );


    updateDeviceDisplay(
        "door",
        door
    );


    // --------------------------------------------------------
    // ALARM
    // --------------------------------------------------------

    const alarm =
        getDeviceValue(
            data,
            "alarm"
        );


    updateDeviceDisplay(
        "alarm",
        alarm
    );

}


// ============================================================
// GET DEVICE VALUE
// ============================================================

function getDeviceValue(
    data,
    device
) {

    if (
        data &&
        Object.prototype.hasOwnProperty.call(
            data,
            device
        )
    ) {

        return data[device];

    }


    return false;

}


// ============================================================
// UPDATE DEVICE DISPLAY
// ============================================================

function updateDeviceDisplay(
    device,
    value
) {

    const isOn =
        isDeviceOn(value);


    // --------------------------------------------------------
    // SWITCH
    // --------------------------------------------------------

    const switchElement =
        document.getElementById(
            device + "Switch"
        );


    if (switchElement) {

        switchElement.checked =
            isOn;

    }


    // --------------------------------------------------------
    // SMALL STATUS
    // --------------------------------------------------------

    const statusElement =
        document.getElementById(
            device + "Status"
        );


    if (statusElement) {

        if (device === "door") {

            statusElement.textContent =
                isOn
                    ? "OPEN"
                    : "CLOSED";

        } else {

            statusElement.textContent =
                isOn
                    ? "ON"
                    : "OFF";

        }

    }


    // --------------------------------------------------------
    // CURRENT STATE CARD
    // --------------------------------------------------------

    const currentElement =
        document.getElementById(
            "current" +
            capitalize(device)
        );


    if (currentElement) {

        if (device === "door") {

            currentElement.textContent =
                isOn
                    ? "OPEN"
                    : "CLOSED";

        } else {

            currentElement.textContent =
                isOn
                    ? "ON"
                    : "OFF";

        }

    }

}


// ============================================================
// DETERMINE ON / OFF
// ============================================================

function isDeviceOn(value) {

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "TRUE" ||
        value === "ON" ||
        value === "on" ||
        value === "OPEN" ||
        value === "open"
    ) {

        return true;

    }


    return false;

}


// ============================================================
// SETUP WEBSITE SWITCHES
// ============================================================

function setupControlSwitches() {

    setupSwitch(
        "lightSwitch",
        "light"
    );


    setupSwitch(
        "fanSwitch",
        "fan"
    );


    setupSwitch(
        "doorSwitch",
        "door"
    );


    setupSwitch(
        "alarmSwitch",
        "alarm"
    );

}


// ============================================================
// SETUP ONE SWITCH
// ============================================================

function setupSwitch(
    switchID,
    device
) {

    const switchElement =
        document.getElementById(
            switchID
        );


    if (!switchElement) {

        console.warn(
            "Switch not found:",
            switchID
        );

        return;

    }


    switchElement.addEventListener(
        "change",
        function () {

            const state =
                switchElement.checked;


            console.log(
                "================================="
            );

            console.log(
                "WEBSITE COMMAND"
            );

            console.log(
                "Device:",
                device
            );

            console.log(
                "State:",
                state
            );

            console.log(
                "Firebase path:",
                "smartStorage/commands/" +
                device
            );

            console.log(
                "================================="
            );


            sendCommand(
                device,
                state
            );

        }
    );

}


// ============================================================
// SEND COMMAND TO ESP32
// ============================================================

function sendCommand(
    device,
    state
) {

    // ========================================================
    // IMPORTANT
    //
    // THESE ARE THE EXACT COMMAND PATHS:
    //
    // smartStorage/commands/light
    // smartStorage/commands/fan
    // smartStorage/commands/door
    // smartStorage/commands/alarm
    // ========================================================


    const commandRef =
        database.ref(
            "smartStorage/commands/" +
            device
        );


    commandRef.set(state)
        .then(function () {

            console.log(
                "COMMAND SUCCESS"
            );

            console.log(
                "smartStorage/commands/" +
                device
            );

            console.log(
                "Value:",
                state
            );


            updateLocalCommandDisplay(
                device,
                state
            );

        })
        .catch(function (error) {

            console.error(
                "COMMAND FAILED:",
                error
            );


            // Revert switch
            const switchElement =
                document.getElementById(
                    device + "Switch"
                );


            if (switchElement) {

                switchElement.checked =
                    !state;

            }


            alert(
                "Unable to send command to Firebase.\n\n" +
                error.message
            );

        });

}


// ============================================================
// UPDATE LOCAL DISPLAY AFTER COMMAND
// ============================================================

function updateLocalCommandDisplay(
    device,
    state
) {

    const statusElement =
        document.getElementById(
            device + "Status"
        );


    const currentElement =
        document.getElementById(
            "current" +
            capitalize(device)
        );


    if (device === "door") {

        if (statusElement) {

            statusElement.textContent =
                state
                    ? "OPEN"
                    : "CLOSED";

        }


        if (currentElement) {

            currentElement.textContent =
                state
                    ? "OPEN"
                    : "CLOSED";

        }

    } else {

        if (statusElement) {

            statusElement.textContent =
                state
                    ? "ON"
                    : "OFF";

        }


        if (currentElement) {

            currentElement.textContent =
                state
                    ? "ON"
                    : "OFF";

        }

    }

}


// ============================================================
// CAPITALIZE
// ============================================================

function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


// ============================================================
// FORMAT FIREBASE TIMESTAMP
// ============================================================

function formatTimestamp(value) {

    if (!value) {

        return "--";

    }


    // Firebase ServerValue.TIMESTAMP
    if (
        typeof value === "number"
    ) {

        const date =
            new Date(value);


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            return date.toLocaleString();

        }

    }


    // String timestamp
    if (
        typeof value === "string"
    ) {

        const date =
            new Date(value);


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            return date.toLocaleString();

        }


        return value;

    }


    return String(value);

}


// ============================================================
// DEBUG HELPER
// ============================================================

console.log(
    "dashboard.js loaded successfully."
);
