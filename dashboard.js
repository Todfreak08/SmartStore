// =====================================================
// DASHBOARD.JS
// SMART STORAGE MONITORING SYSTEM
// =====================================================


// =====================================================
// CHECK FIREBASE
// =====================================================

if (typeof firebase === "undefined") {

    console.error("Firebase library was not loaded.");

}


// =====================================================
// FIREBASE DATABASE
// =====================================================

const database = firebase.database();


// =====================================================
// DOM ELEMENT HELPER
// =====================================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


// =====================================================
// FIREBASE CONNECTION STATUS
// =====================================================

const connectedRef = database.ref(".info/connected");


connectedRef.on("value", (snapshot) => {

    const firebaseStatus =
        document.getElementById("firebaseStatus");


    if (!firebaseStatus) {
        return;
    }


    if (snapshot.val() === true) {

        firebaseStatus.textContent =
            "🟢 Firebase Connected";

    } else {

        firebaseStatus.textContent =
            "🔴 Firebase Disconnected";

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

        console.log(
            "Logged in as:",
            user.email
        );

    } else {

        setText(
            "userEmail",
            "Not logged in"
        );

        console.log(
            "No user logged in."
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
// ESP32 SENSOR DATA
// =====================================================
//
// Firebase:
//
// sensor/
//     motion
//     temperature
//     humidity
//     status
//
// =====================================================

const sensorRef =
    database.ref("sensor");


sensorRef.on(
    "value",
    (snapshot) => {

        const data =
            snapshot.val();


        if (!data) {

            console.log(
                "No sensor data found."
            );

            setText(
                "temperature",
                "--"
            );

            setText(
                "humidity",
                "--"
            );

            setText(
                "motion",
                "--"
            );

            setText(
                "sensorStatus",
                "--"
            );

            setText(
                "summaryTemperature",
                "--"
            );

            setText(
                "summaryHumidity",
                "--"
            );

            setText(
                "summaryMotion",
                "--"
            );

            setText(
                "summaryStatus",
                "--"
            );

            return;

        }


        // =================================================
        // MOTION
        // INT
        // =================================================

        const motion =
            Number(data.motion);


        if (motion === 1) {

            setText(
                "motion",
                "Detected"
            );

            setText(
                "summaryMotion",
                "Motion Detected"
            );

        } else {

            setText(
                "motion",
                "No Motion"
            );

            setText(
                "summaryMotion",
                "No Motion"
            );

        }


        // =================================================
        // TEMPERATURE
        // FLOAT
        // =================================================

        if (
            data.temperature !== undefined &&
            data.temperature !== null
        ) {

            const temperature =
                Number(data.temperature);


            if (!isNaN(temperature)) {

                const temperatureText =
                    temperature.toFixed(2) +
                    " °C";


                setText(
                    "temperature",
                    temperatureText
                );


                setText(
                    "summaryTemperature",
                    temperatureText
                );

            }

        }


        // =================================================
        // HUMIDITY
        // FLOAT
        // =================================================

        if (
            data.humidity !== undefined &&
            data.humidity !== null
        ) {

            const humidity =
                Number(data.humidity);


            if (!isNaN(humidity)) {

                const humidityText =
                    humidity.toFixed(2) +
                    " %";


                setText(
                    "humidity",
                    humidityText
                );


                setText(
                    "summaryHumidity",
                    humidityText
                );

            }

        }


        // =================================================
        // STATUS
        // STRING
        // =================================================

        if (
            data.status !== undefined &&
            data.status !== null
        ) {

            const status =
                String(data.status);


            setText(
                "sensorStatus",
                status
            );


            setText(
                "summaryStatus",
                status
            );

        }


        // =================================================
        // UPDATE LAST DATA RECEIVED
        // =================================================

        const now =
            new Date();


        setText(
            "lastUpdate",
            "Last data received: " +
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
            "Receiving data from ESP32"
        );


        console.log(
            "Sensor data:",
            data
        );

    },
    (error) => {

        console.error(
            "Sensor data error:",
            error
        );

    }
);


// =====================================================
// DEVICE INFORMATION
// =====================================================
//
// Firebase:
//
// device/
//     status
//     wifiSignal
//     ip
//     dateTime
//
// =====================================================

const deviceRef =
    database.ref("device");


deviceRef.on(
    "value",
    (snapshot) => {

        const data =
            snapshot.val();


        if (!data) {

            console.log(
                "No device information found."
            );

            return;

        }


        // =================================================
        // DEVICE STATUS
        // =================================================

        if (
            data.status !== undefined &&
            data.status !== null
        ) {

            setText(
                "deviceStatus",
                String(data.status)
            );

        }


        // =================================================
        // WIFI SIGNAL
        // =================================================

        if (
            data.wifiSignal !== undefined &&
            data.wifiSignal !== null
        ) {

            setText(
                "wifiSignal",
                String(data.wifiSignal)
            );

        }


        // =================================================
        // ESP32 IP
        // =================================================

        if (
            data.ip !== undefined &&
            data.ip !== null
        ) {

            setText(
                "deviceIP",
                String(data.ip)
            );

        }


        // =================================================
        // ESP32 DATE/TIME
        // =================================================

        if (
            data.dateTime !== undefined &&
            data.dateTime !== null
        ) {

            setText(
                "deviceDateTime",
                String(data.dateTime)
            );

        }


        console.log(
            "Device data:",
            data
        );

    },
    (error) => {

        console.error(
            "Device data error:",
            error
        );

    }
);


// =====================================================
// DEVICE CONTROLS
// =====================================================
//
// Firebase:
//
// controls/
//     light
//     fan
//     door
//     alarm
//
// =====================================================


// =====================================================
// LIGHT
// =====================================================

const lightSwitch =
    document.getElementById("lightSwitch");


const lightRef =
    database.ref("controls/light");


if (lightSwitch) {

    lightSwitch.addEventListener(
        "change",
        () => {

            const value =
                lightSwitch.checked;


            lightRef.set(value)
                .catch((error) => {

                    console.error(
                        "Light control error:",
                        error
                    );

                });

        }
    );

}


lightRef.on(
    "value",
    (snapshot) => {

        const value =
            snapshot.val() === true;


        if (lightSwitch) {

            lightSwitch.checked =
                value;

        }


        setText(
            "lightStatus",
            value ? "ON" : "OFF"
        );


        setText(
            "currentLight",
            value ? "ON" : "OFF"
        );

    }
);


// =====================================================
// FAN
// =====================================================

const fanSwitch =
    document.getElementById("fanSwitch");


const fanRef =
    database.ref("controls/fan");


if (fanSwitch) {

    fanSwitch.addEventListener(
        "change",
        () => {

            const value =
                fanSwitch.checked;


            fanRef.set(value)
                .catch((error) => {

                    console.error(
                        "Fan control error:",
                        error
                    );

                });

        }
    );

}


fanRef.on(
    "value",
    (snapshot) => {

        const value =
            snapshot.val() === true;


        if (fanSwitch) {

            fanSwitch.checked =
                value;

        }


        setText(
            "fanStatus",
            value ? "ON" : "OFF"
        );


        setText(
            "currentFan",
            value ? "ON" : "OFF"
        );

    }
);


// =====================================================
// DOOR
// =====================================================

const doorSwitch =
    document.getElementById("doorSwitch");


const doorRef =
    database.ref("controls/door");


if (doorSwitch) {

    doorSwitch.addEventListener(
        "change",
        () => {

            const value =
                doorSwitch.checked;


            doorRef.set(value)
                .catch((error) => {

                    console.error(
                        "Door control error:",
                        error
                    );

                });

        }
    );

}


doorRef.on(
    "value",
    (snapshot) => {

        const value =
            snapshot.val() === true;


        if (doorSwitch) {

            doorSwitch.checked =
                value;

        }


        setText(
            "doorStatus",
            value ? "OPEN" : "CLOSED"
        );


        setText(
            "currentDoor",
            value ? "OPEN" : "CLOSED"
        );

    }
);


// =====================================================
// ALARM
// =====================================================

const alarmSwitch =
    document.getElementById("alarmSwitch");


const alarmRef =
    database.ref("controls/alarm");


if (alarmSwitch) {

    alarmSwitch.addEventListener(
        "change",
        () => {

            const value =
                alarmSwitch.checked;


            alarmRef.set(value)
                .catch((error) => {

                    console.error(
                        "Alarm control error:",
                        error
                    );

                });

        }
    );

}


alarmRef.on(
    "value",
    (snapshot) => {

        const value =
            snapshot.val() === true;


        if (alarmSwitch) {

            alarmSwitch.checked =
                value;

        }


        setText(
            "alarmStatus",
            value ? "ON" : "OFF"
        );


        setText(
            "currentAlarm",
            value ? "ON" : "OFF"
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
    "Waiting for ESP32 sensor data..."
);
