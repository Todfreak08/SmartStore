// =====================================================
// SMART STORAGE - DASHBOARD.JS
// Firebase structure:
// smartStorage/
//    commands/
//       light
//       fan
//       door
//       alarm
//
//    esp32/
//       status
//       wifi
//       ip
//       timestamp
//       dateTime
//       light
//       fan
//       door
//       alarm
// =====================================================


// =====================================================
// FIREBASE REFERENCES
// =====================================================

const smartStorageRef = database.ref("smartStorage");
const esp32Ref = database.ref("smartStorage/esp32");
const commandsRef = database.ref("smartStorage/commands");


// =====================================================
// LOGIN
// =====================================================

auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const emailElement = document.getElementById("userEmail");

    if (emailElement) {
        emailElement.textContent = user.email;
    }

});


// =====================================================
// LOGOUT
// =====================================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        auth.signOut()
            .then(() => {

                window.location.href = "index.html";

            })
            .catch((error) => {

                console.error("Logout error:", error);

            });

    });

}


// =====================================================
// FIREBASE CONNECTION STATUS
// =====================================================

const connectedRef = database.ref(".info/connected");

connectedRef.on("value", (snapshot) => {

    const status = document.getElementById("firebaseStatus");

    if (!status) return;

    if (snapshot.val() === true) {

        status.innerHTML = "🟢 Firebase Connected";

    } else {

        status.innerHTML = "🔴 Firebase Disconnected";

    }

});


// =====================================================
// READ ESP32 DATA
// =====================================================

esp32Ref.on("value", (snapshot) => {

    const data = snapshot.val();

    console.log("ESP32 DATA:", data);

    if (!data) {

        showOffline();

        return;

    }

    updateESP32(data);

});


// =====================================================
// UPDATE ESP32 INFORMATION
// =====================================================

function updateESP32(data) {

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    const statusElement =
        document.getElementById("deviceStatus");

    const sourceElement =
        document.getElementById("deviceSource");


    let status =
        data.status ||
        data.deviceStatus ||
        "ONLINE";


    if (statusElement) {

        statusElement.textContent =
            String(status).toUpperCase();

    }


    if (sourceElement) {

        sourceElement.textContent =
            "ESP32 connected to Firebase";

    }


    // -------------------------------------------------
    // WIFI SIGNAL
    // -------------------------------------------------

    const wifiElement =
        document.getElementById("wifiSignal");


    if (wifiElement) {

        let wifi =
            data.wifi ||
            data.rssi ||
            data.wifiSignal;


        if (wifi !== undefined && wifi !== null) {

            wifiElement.textContent =
                wifi + " dBm";

        } else {

            wifiElement.textContent = "--";

        }

    }


    // -------------------------------------------------
    // IP ADDRESS
    // -------------------------------------------------

    const ipElement =
        document.getElementById("deviceIP");


    if (ipElement) {

        ipElement.textContent =
            data.ip ||
            data.IP ||
            "--";

    }


    // =================================================
    // TIMESTAMP
    // =================================================

    updateTimestamp(data);


    // =================================================
    // DEVICE STATES
    // =================================================

    updateSwitchState(
        "light",
        data.light
    );

    updateSwitchState(
        "fan",
        data.fan
    );

    updateSwitchState(
        "door",
        data.door
    );

    updateSwitchState(
        "alarm",
        data.alarm
    );

}


// =====================================================
// TIMESTAMP HANDLER
// =====================================================

function updateTimestamp(data) {

    const dateTimeElement =
        document.getElementById("deviceDateTime");

    const lastUpdateElement =
        document.getElementById("lastUpdate");


    /*
       Accept several possible timestamp formats.

       Example Firebase:

       timestamp: 1753849200000

       OR

       timestamp: "2026-07-30 12:35:00"

       OR

       dateTime: "2026-07-30 12:35:00"
    */


    let timestamp =
        data.timestamp ||
        data.updatedAt ||
        data.lastUpdate ||
        data.dateTime;


    if (!timestamp) {

        if (dateTimeElement) {

            dateTimeElement.textContent =
                "Waiting for ESP32...";

        }

        if (lastUpdateElement) {

            lastUpdateElement.textContent =
                "No timestamp received yet.";

        }

        return;

    }


    // -------------------------------------------------
    // IF FIREBASE SERVER TIMESTAMP / MILLISECONDS
    // -------------------------------------------------

    if (
        typeof timestamp === "number" ||
        !isNaN(Number(timestamp))
    ) {

        const date =
            new Date(Number(timestamp));


        if (!isNaN(date.getTime())) {

            const formatted =
                formatDateTime(date);


            if (dateTimeElement) {

                dateTimeElement.textContent =
                    formatted;

            }


            if (lastUpdateElement) {

                lastUpdateElement.textContent =
                    "Last ESP32 update: " +
                    formatted;

            }

            return;

        }

    }


    // -------------------------------------------------
    // IF STRING TIMESTAMP
    // -------------------------------------------------

    if (typeof timestamp === "string") {

        const date =
            new Date(timestamp);


        if (!isNaN(date.getTime())) {

            const formatted =
                formatDateTime(date);


            if (dateTimeElement) {

                dateTimeElement.textContent =
                    formatted;

            }


            if (lastUpdateElement) {

                lastUpdateElement.textContent =
                    "Last ESP32 update: " +
                    formatted;

            }

        } else {

            // If ESP32 already sends readable text

            if (dateTimeElement) {

                dateTimeElement.textContent =
                    timestamp;

            }


            if (lastUpdateElement) {

                lastUpdateElement.textContent =
                    "Timestamp received from ESP32";

            }

        }

    }

}


// =====================================================
// FORMAT DATE AND TIME
// =====================================================

function formatDateTime(date) {

    return date.toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );

}


// =====================================================
// UPDATE SWITCH STATES
// =====================================================

function updateSwitchState(device, value) {

    let isOn = false;

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "ON" ||
        value === "on" ||
        value === "true"
    ) {

        isOn = true;

    }


    const switchElement =
        document.getElementById(
            device + "Switch"
        );


    const statusElement =
        document.getElementById(
            device + "Status"
        );


    const currentElement =
        document.getElementById(
            "current" +
            capitalize(device)
        );


    // -------------------------------------------------
    // SWITCH
    // -------------------------------------------------

    if (switchElement) {

        switchElement.checked = isOn;

    }


    // -------------------------------------------------
    // STATUS TEXT
    // -------------------------------------------------

    if (statusElement) {

        if (device === "door") {

            statusElement.textContent =
                isOn ? "OPEN" : "CLOSED";

        } else {

            statusElement.textContent =
                isOn ? "ON" : "OFF";

        }

    }


    // -------------------------------------------------
    // CURRENT STATE
    // -------------------------------------------------

    if (currentElement) {

        if (device === "door") {

            currentElement.textContent =
                isOn ? "OPEN" : "CLOSED";

        } else {

            currentElement.textContent =
                isOn ? "ON" : "OFF";

        }

    }

}


// =====================================================
// CAPITALIZE
// =====================================================

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


// =====================================================
// OFFLINE DISPLAY
// =====================================================

function showOffline() {

    const status =
        document.getElementById("deviceStatus");

    const source =
        document.getElementById("deviceSource");

    const ip =
        document.getElementById("deviceIP");

    const dateTime =
        document.getElementById("deviceDateTime");

    const lastUpdate =
        document.getElementById("lastUpdate");


    if (status)
        status.textContent = "OFFLINE";


    if (source)
        source.textContent =
            "Waiting for ESP32...";


    if (wifi)
        wifi.textContent = "--";


    if (ip)
        ip.textContent = "--";


    if (dateTime)
        dateTime.textContent =
            "Waiting for ESP32...";


    if (lastUpdate)
        lastUpdate.textContent =
            "No ESP32 data received yet.";

}


// =====================================================
// WEBSITE SWITCHES → FIREBASE COMMANDS
// =====================================================

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


// =====================================================
// SWITCH COMMAND FUNCTION
// =====================================================

function setupSwitch(elementId, device) {

    const switchElement =
        document.getElementById(elementId);


    if (!switchElement) return;


    switchElement.addEventListener(
        "change",
        async function () {

            const state =
                this.checked;


            try {

                await commandsRef
                    .child(device)
                    .set(state);


                console.log(
                    "Command sent:",
                    device,
                    state
                );


            } catch (error) {

                console.error(
                    "Command error:",
                    error
                );


                // Return switch to previous state

                this.checked =
                    !state;

            }

        }
    );

}
