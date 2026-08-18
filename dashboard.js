// =====================================================
// SMART STORAGE ESP32 DASHBOARD
// =====================================================


// =====================================================
// GLOBAL
// =====================================================

let currentStates = {

    light: false,

    fan: false,

    door: false,

    alarm: false

};


// =====================================================
// AUTHENTICATION
// =====================================================

auth.onAuthStateChanged(function(user) {


    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    const email =
        document.getElementById(
            "userEmail"
        );


    if (email) {

        email.textContent =
            user.email;

    }

});



// =====================================================
// LOGOUT
// =====================================================

function logout() {


    auth.signOut()

        .then(function() {

            window.location.href =
                "index.html";

        })

        .catch(function(error) {

            console.error(
                "Logout error:",
                error
            );

        });

}



// =====================================================
// LOGOUT BUTTON
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {


            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        initializeSwitches();

        initializeFirebase();

    }
);



// =====================================================
// FIREBASE
// =====================================================

function initializeFirebase() {


    const firebaseStatus =
        document.getElementById(
            "firebaseStatus"
        );


    if (firebaseStatus) {

        firebaseStatus.textContent =
            "🔄 Connecting to Firebase...";

    }


    // =================================================
    // DEVICE
    // =================================================

    database
        .ref("smartStorage/device")
        .on(

            "value",

            function(snapshot) {


                const data =
                    snapshot.val();


                if (!data) {


                    updateDeviceOffline();


                    return;

                }


                updateDeviceStatus(
                    data
                );

            },


            function(error) {


                console.error(
                    "Device listener error:",
                    error
                );


                if (firebaseStatus) {

                    firebaseStatus.textContent =
                        "🔴 Firebase Error";

                }

            }

        );


    // =================================================
    // CURRENT STATES
    // =================================================

    database
        .ref("smartStorage/current")
        .on(

            "value",

            function(snapshot) {


                const data =
                    snapshot.val();


                if (!data) {

                    return;

                }


                updateCurrentStates(
                    data
                );

            }

        );


    // =================================================
    // FIREBASE CONNECTION
    // =================================================

    database
        .ref(".info/connected")
        .on(

            "value",

            function(snapshot) {


                if (snapshot.val() === true) {


                    if (firebaseStatus) {

                        firebaseStatus.textContent =
                            "🟢 Firebase Connected";

                        firebaseStatus.style.color =
                            "#28a745";

                    }


                }

                else {


                    if (firebaseStatus) {

                        firebaseStatus.textContent =
                            "🔴 Firebase Disconnected";

                        firebaseStatus.style.color =
                            "#dc3545";

                    }

                }

            }

        );

}



// =====================================================
// DEVICE STATUS
// =====================================================

function updateDeviceStatus(
    data
) {


    const status =
        document.getElementById(
            "deviceStatus"
        );


    const source =
        document.getElementById(
            "deviceSource"
        );


    const ip =
        document.getElementById(
            "deviceIP"
        );


    const wifi =
        document.getElementById(
            "wifiSignal"
        );


    const dateTime =
        document.getElementById(
            "deviceDateTime"
        );


    const lastUpdate =
        document.getElementById(
            "lastUpdate"
        );


    // =================================================
    // ONLINE
    // =================================================

    if (status) {

        status.textContent =
            data.online
                ? "ONLINE"
                : "OFFLINE";


        status.style.color =
            data.online
                ? "#28a745"
                : "#dc3545";

    }


    // =================================================
    // SOURCE
    // =================================================

    if (source) {

        source.textContent =
            data.source ||
            "ESP32";

    }


    // =================================================
    // IP
    // =================================================

    if (ip) {

        ip.textContent =
            data.ip ||
            "--";

    }


    // =================================================
    // WIFI
    // =================================================

    if (wifi) {


        if (
            data.wifiRSSI !==
            undefined
        ) {

            wifi.textContent =
                data.wifiRSSI +
                " dBm";

        }

        else {

            wifi.textContent =
                "--";

        }

    }


    // =================================================
    // DATE/TIME
    // =================================================

    if (dateTime) {

        dateTime.textContent =
            data.timestamp ||
            "Waiting for ESP32...";

    }


    // =================================================
    // LAST UPDATE
    // =================================================

    if (lastUpdate) {

        lastUpdate.textContent =
            data.timestamp
                ? "Last update: " +
                  data.timestamp
                : "No update received";

    }

}



// =====================================================
// OFFLINE
// =====================================================

function updateDeviceOffline() {


    const status =
        document.getElementById(
            "deviceStatus"
        );


    const source =
        document.getElementById(
            "deviceSource"
        );


    if (status) {

        status.textContent =
            "OFFLINE";

        status.style.color =
            "#dc3545";

    }


    if (source) {

        source.textContent =
            "Waiting for ESP32...";

    }

}



// =====================================================
// CURRENT STATES
// =====================================================

function updateCurrentStates(
    data
) {


    // =================================================
    // LIGHT
    // =================================================

    if (
        data.light !== undefined
    ) {

        currentStates.light =
            Boolean(data.light);

        updateSwitch(
            "light",
            currentStates.light
        );

    }


    // =================================================
    // FAN
    // =================================================

    if (
        data.fan !== undefined
    ) {

        currentStates.fan =
            Boolean(data.fan);

        updateSwitch(
            "fan",
            currentStates.fan
        );

    }


    // =================================================
    // DOOR
    // =================================================

    if (
        data.door !== undefined
    ) {

        currentStates.door =
            Boolean(data.door);

        updateSwitch(
            "door",
            currentStates.door
        );

    }


    // =================================================
    // ALARM
    // =================================================

    if (
        data.alarm !== undefined
    ) {

        currentStates.alarm =
            Boolean(data.alarm);

        updateSwitch(
            "alarm",
            currentStates.alarm
        );

    }

}



// =====================================================
// INITIALIZE SWITCHES
// =====================================================

function initializeSwitches() {


    const light =
        document.getElementById(
            "lightSwitch"
        );


    const fan =
        document.getElementById(
            "fanSwitch"
        );


    const door =
        document.getElementById(
            "doorSwitch"
        );


    const alarm =
        document.getElementById(
            "alarmSwitch"
        );


    // =================================================
    // LIGHT
    // =================================================

    if (light) {


        light.addEventListener(
            "change",
            function() {


                sendCommand(
                    "light",
                    light.checked
                );

            }
        );

    }


    // =================================================
    // FAN
    // =================================================

    if (fan) {


        fan.addEventListener(
            "change",
            function() {


                sendCommand(
                    "fan",
                    fan.checked
                );

            }
        );

    }


    // =================================================
    // DOOR
    // =================================================

    if (door) {


        door.addEventListener(
            "change",
            function() {


                sendCommand(
                    "door",
                    door.checked
                );

            }
        );

    }


    // =================================================
    // ALARM
    // =================================================

    if (alarm) {


        alarm.addEventListener(
            "change",
            function() {


                sendCommand(
                    "alarm",
                    alarm.checked
                );

            }
        );

    }

}



// =====================================================
// SEND COMMAND TO FIREBASE
// =====================================================

function sendCommand(
    device,
    state
) {


    console.log(
        "Sending command:",
        device,
        state
    );


    const commandData = {


        state:
            Boolean(state),


        source:
            "Website",


        timestamp:
            firebase.database
                .ServerValue
                .TIMESTAMP


    };


    database
        .ref(
            "smartStorage/commands/" +
            device
        )

        .set(
            commandData
        )

        .then(function() {


            console.log(
                "Command sent successfully:",
                device,
                state
            );


        })

        .catch(function(error) {


            console.error(
                "Command failed:",
                error
            );


            alert(
                "Command could not be sent:\n" +
                error.message
            );


            // Restore previous state

            updateSwitch(
                device,
                currentStates[device]
            );

        });

}



// =====================================================
// UPDATE SWITCH
// =====================================================

function updateSwitch(
    device,
    state
) {


    const switchElement =
        document.getElementById(
            device + "Switch"
        );


    if (switchElement) {

        switchElement.checked =
            Boolean(state);

    }


    // =================================================
    // LIGHT
    // =================================================

    if (device === "light") {


        setText(
            "lightStatus",
            state ? "ON" : "OFF"
        );


        setText(
            "currentLight",
            state ? "ON" : "OFF"
        );

    }


    // =================================================
    // FAN
    // =================================================

    if (device === "fan") {


        setText(
            "fanStatus",
            state ? "ON" : "OFF"
        );


        setText(
            "currentFan",
            state ? "ON" : "OFF"
        );

    }


    // =================================================
    // DOOR
    // =================================================

    if (device === "door") {


        setText(
            "doorStatus",
            state ? "OPEN" : "CLOSED"
        );


        setText(
            "currentDoor",
            state ? "OPEN" : "CLOSED"
        );

    }


    // =================================================
    // ALARM
    // =================================================

    if (device === "alarm") {


        setText(
            "alarmStatus",
            state ? "ON" : "OFF"
        );


        setText(
            "currentAlarm",
            state ? "ON" : "OFF"
        );

    }

}



// =====================================================
// SET TEXT
// =====================================================

function setText(
    id,
    value
) {


    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}



// =====================================================
// MAKE FUNCTIONS AVAILABLE
// =====================================================

window.sendCommand =
    sendCommand;

window.logout =
    logout;
