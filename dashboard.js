// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
//
// WEBSITE
//     ↓
// FIREBASE COMMANDS
//     ↓
// ESP32
//
// ESP32
//     ↓
// FIREBASE SENSOR DATA
//     ↓
// WEBSITE
// ==========================================================


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let environmentChart = null;

let temperatureHistory = [];

let humidityHistory = [];

let chartLabels = [];


// ==========================================================
// DATABASE REFERENCES
// ==========================================================

// These references come from firebase-config.js

// Sensor data from ESP32
const esp32SensorRef =
    database.ref(
        "smartStorage/sensorData"
    );

// Commands from website to ESP32
const esp32CommandsRef =
    database.ref(
        "smartStorage/commands"
    );

// History
const esp32HistoryRef =
    database.ref(
        "smartStorage/history"
    );

// Alerts
const esp32AlertsRef =
    database.ref(
        "smartStorage/alerts"
    );


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href =
            "index.html";

        return;
    }


    const userEmail =
        document.getElementById(
            "userEmail"
        );


    if (userEmail) {

        userEmail.textContent =
            user.email;

    }


    console.log(
        "User logged in:",
        user.email
    );

});


// ==========================================================
// LOGOUT
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

    const firebaseStatus =
        document.getElementById(
            "firebaseStatus"
        );


    database
        .ref(".info/connected")
        .on(
            "value",
            function (snapshot) {

                if (!firebaseStatus) {

                    return;

                }


                if (
                    snapshot.val() === true
                ) {

                    firebaseStatus.textContent =
                        "● Firebase Connected";


                    firebaseStatus.style.color =
                        "#28a745";

                }

                else {

                    firebaseStatus.textContent =
                        "● Firebase Disconnected";


                    firebaseStatus.style.color =
                        "#dc3545";

                }

            }
        );

}


// ==========================================================
// LISTEN TO ESP32 SENSOR DATA
// ==========================================================
//
// Firebase path:
//
// smartStorage
//      └── sensorData
//
// ESP32 will write:
//
// temperature
// humidity
// motion
// status
// timestamp
// source
//
// ==========================================================

function initializeSensorListener() {

    esp32SensorRef.on(

        "value",

        function (snapshot) {

            console.log(
                "ESP32 SENSOR DATA:",
                snapshot.val()
            );


            if (!snapshot.exists()) {

                showWaitingForESP32();

                return;

            }


            const data =
                snapshot.val();


            updateDashboard(
                data
            );

        },

        function (error) {

            console.error(
                "Sensor Firebase error:",
                error
            );


            setText(
                "firebaseStatus",
                "● Firebase Sensor Error"
            );


            const status =
                document.getElementById(
                    "firebaseStatus"
                );


            if (status) {

                status.style.color =
                    "#dc3545";

            }

        }

    );

}


// ==========================================================
// WAITING FOR ESP32
// ==========================================================

function showWaitingForESP32() {

    setText(
        "temperature",
        "-- °C"
    );


    setText(
        "humidity",
        "-- %"
    );


    setText(
        "motion",
        "Waiting..."
    );


    setText(
        "storageStatus",
        "Waiting for ESP32..."
    );


    setText(
        "lastUpdate",
        "No ESP32 data received yet."
    );


    setText(
        "temperatureSource",
        "Waiting for ESP32..."
    );


    setText(
        "humiditySource",
        "Waiting for ESP32..."
    );

}


// ==========================================================
// UPDATE DASHBOARD
// ==========================================================

function updateDashboard(data) {

    if (!data) {

        showWaitingForESP32();

        return;

    }


    // ======================================================
    // TEMPERATURE
    // ======================================================

    if (
        data.temperature !== undefined &&
        data.temperature !== null
    ) {

        const temperature =
            Number(
                data.temperature
            );


        if (!isNaN(temperature)) {

            setText(
                "temperature",
                temperature.toFixed(1) +
                " °C"
            );

        }

    }


    // ======================================================
    // HUMIDITY
    // ======================================================

    if (
        data.humidity !== undefined &&
        data.humidity !== null
    ) {

        const humidity =
            Number(
                data.humidity
            );


        if (!isNaN(humidity)) {

            setText(
                "humidity",
                humidity.toFixed(1) +
                " %"
            );

        }

    }


    // ======================================================
    // MOTION
    // ======================================================

    let motion =
        data.motion;


    if (motion === true) {

        motion =
            "Motion Detected";

    }

    else if (motion === false) {

        motion =
            "No Motion";

    }

    else if (
        motion === undefined ||
        motion === null
    ) {

        motion =
            "Waiting...";

    }


    setText(
        "motion",
        motion
    );


    // ======================================================
    // STORAGE STATUS
    // ======================================================

    const storageStatus =
        data.status ||
        "NORMAL";


    setText(
        "storageStatus",
        storageStatus
    );


    updateStatusAppearance(
        storageStatus
    );


    // ======================================================
    // SOURCE
    // ======================================================

    setText(
        "temperatureSource",
        "Source: " +
        (data.source || "ESP32")
    );


    setText(
        "humiditySource",
        "Source: " +
        (data.source || "ESP32")
    );


    // ======================================================
    // TIMESTAMP
    // ======================================================

    if (
        data.timestamp !== undefined &&
        data.timestamp !== null
    ) {

        let timestampText =
            formatTimestamp(
                data.timestamp
            );


        setText(
            "lastUpdate",
            "Last Update: " +
            timestampText
        );

    }

    else {

        setText(
            "lastUpdate",
            "Timestamp unavailable"
        );

    }


    // ======================================================
    // UPDATE CHART
    // ======================================================

    if (
        data.temperature !== undefined &&
        data.humidity !== undefined
    ) {

        const temperature =
            Number(
                data.temperature
            );


        const humidity =
            Number(
                data.humidity
            );


        if (
            !isNaN(temperature) &&
            !isNaN(humidity)
        ) {

            updateChart(
                temperature,
                humidity
            );

        }

    }


    // ======================================================
    // LOAD CURRENT DEVICE STATES
    // ======================================================

    loadDeviceStates();

}


// ==========================================================
// STATUS APPEARANCE
// ==========================================================

function updateStatusAppearance(
    status
) {

    const element =
        document.getElementById(
            "storageStatus"
        );


    if (!element) {

        return;

    }


    element.classList.remove(
        "normal",
        "warning",
        "danger"
    );


    const statusText =
        String(status)
            .toUpperCase();


    if (
        statusText === "DANGER"
    ) {

        element.classList.add(
            "danger"
        );

    }

    else if (
        statusText === "WARNING"
    ) {

        element.classList.add(
            "warning"
        );

    }

    else {

        element.classList.add(
            "normal"
        );

    }

}


// ==========================================================
// FORMAT FIREBASE TIMESTAMP
// ==========================================================

function formatTimestamp(
    timestamp
) {

    // Firebase ServerValue timestamp
    // is normally a number in milliseconds.

    if (
        typeof timestamp ===
        "number"
    ) {

        return new Date(
            timestamp
        ).toLocaleString(
            "en-PH",
            {
                dateStyle:
                    "medium",

                timeStyle:
                    "medium"
            }
        );

    }


    // If ESP32 sends a text timestamp
    // use it directly.

    return String(
        timestamp
    );

}


// ==========================================================
// WEBSITE LIVE CLOCK
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
                weekday:
                    "long",

                year:
                    "numeric",

                month:
                    "long",

                day:
                    "numeric"
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
// MANUAL DATA ENTRY
// ==========================================================
//
// Manual entry is optional.
//
// The real sensor source is ESP32.
//
// If you use manual entry, it writes to the same
// sensorData path so the dashboard can display it.
//
// ==========================================================

function initializeSaveButton() {

    const saveButton =
        document.getElementById(
            "saveDataButton"
        );


    if (!saveButton) {

        return;

    }


    saveButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            saveManualData();

        }
    );

}


// ==========================================================
// SAVE MANUAL DATA
// ==========================================================

function saveManualData() {

    const temperatureInput =
        document.getElementById(
            "manualTemperature"
        );


    const humidityInput =
        document.getElementById(
            "manualHumidity"
        );


    const motionInput =
        document.getElementById(
            "manualMotion"
        );


    if (
        !temperatureInput ||
        !humidityInput ||
        !motionInput
    ) {

        showManualMessage(
            "❌ Input fields not found.",
            "error"
        );

        return;

    }


    const temperature =
        parseFloat(
            temperatureInput.value
        );


    const humidity =
        parseFloat(
            humidityInput.value
        );


    const motion =
        motionInput.value ===
        "true";


    // ======================================================
    // VALIDATION
    // ======================================================

    if (isNaN(temperature)) {

        showManualMessage(
            "❌ Please enter temperature.",
            "error"
        );

        temperatureInput.focus();

        return;

    }


    if (isNaN(humidity)) {

        showManualMessage(
            "❌ Please enter humidity.",
            "error"
        );

        humidityInput.focus();

        return;

    }


    if (
        humidity < 0 ||
        humidity > 100
    ) {

        showManualMessage(
            "❌ Humidity must be between 0 and 100.",
            "error"
        );

        humidityInput.focus();

        return;

    }


    // ======================================================
    // DETERMINE STATUS
    // ======================================================

    let status =
        "NORMAL";


    if (
        temperature >= 35 ||
        humidity >= 80
    ) {

        status =
            "WARNING";

    }


    if (
        temperature >= 40 ||
        humidity >= 90
    ) {

        status =
            "DANGER";

    }


    // ======================================================
    // TIMESTAMP
    // ======================================================

    const timestamp =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    // ======================================================
    // DATA
    // ======================================================

    const sensorData = {

        temperature:
            temperature,

        humidity:
            humidity,

        motion:
            motion,

        status:
            status,

        timestamp:
            timestamp,

        source:
            "Manual Entry"

    };


    // ======================================================
    // SAVE CURRENT SENSOR DATA
    // ======================================================

    esp32SensorRef
        .set(sensorData)

        .then(function () {

            // ==============================================
            // SAVE HISTORY
            // ==============================================

            return esp32HistoryRef
                .push({

                    temperature:
                        temperature,

                    humidity:
                        humidity,

                    motion:
                        motion,

                    status:
                        status,

                    timestamp:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP,

                    source:
                        "Manual Entry"

                });

        })

        .then(function () {

            showManualMessage(
                "✅ Data saved to Firebase!",
                "success"
            );


            temperatureInput.value =
                "";


            humidityInput.value =
                "";


            motionInput.value =
                "false";

        })

        .catch(function (error) {

            console.error(
                "Manual data error:",
                error
            );


            showManualMessage(
                "❌ Firebase Error: " +
                error.message,
                "error"
            );

        });

}


// ==========================================================
// MANUAL DATA MESSAGE
// ==========================================================

function showManualMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "manualMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    if (
        type === "success"
    ) {

        element.style.color =
            "#28a745";

    }

    else if (
        type === "error"
    ) {

        element.style.color =
            "#dc3545";

    }

    else {

        element.style.color =
            "#0b2447";

    }

}


// ==========================================================
// DEVICE COMMANDS
// ==========================================================
//
// WEBSITE → FIREBASE → ESP32
//
// These values are commands.
//
// ==========================================================

function initializeSwitches() {

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
// CONNECT SWITCH
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

        return;

    }


    element.addEventListener(
        "change",
        function () {

            sendCommandToESP32(
                device,
                element.checked
            );

        }
    );

}


// ==========================================================
// SEND COMMAND TO ESP32
// ==========================================================
//
// Example:
//
// smartStorage
//     └── commands
//         └── light: true
//
// ESP32 will read this value.
//
// ==========================================================

function sendCommandToESP32(
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

        timestamp:
            firebase.database
                .ServerValue
                .TIMESTAMP,

        source:
            "Website"

    };


    esp32CommandsRef
        .child(device)
        .set(commandData)

        .then(function () {

            console.log(
                "Command sent successfully:",
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
                "Command error:",
                error
            );


            alert(
                "Unable to send command:\n" +
                error.message
            );


            const switchElement =
                document.getElementById(
                    device + "Switch"
                );


            if (switchElement) {

                switchElement.checked =
                    !state;

            }

        });

}


// ==========================================================
// LOAD COMMAND STATES
// ==========================================================
//
// Reads Firebase commands so the website remains
// synchronized with ESP32 commands.
//
// ==========================================================

function loadDeviceStates() {

    esp32CommandsRef.once(
        "value",
        function (snapshot) {

            if (!snapshot.exists()) {

                return;

            }


            const commands =
                snapshot.val();


            setDeviceState(
                "light",
                commands.light
            );


            setDeviceState(
                "fan",
                commands.fan
            );


            setDeviceState(
                "door",
                commands.door
            );


            setDeviceState(
                "alarm",
                commands.alarm
            );

        }
    );

}


// ==========================================================
// SET DEVICE STATE
// ==========================================================

function setDeviceState(
    device,
    command
) {

    if (!command) {

        return;

    }


    let state =
        false;


    if (
        typeof command ===
        "object"
    ) {

        state =
            Boolean(
                command.state
            );

    }

    else {

        state =
            Boolean(command);

    }


    const element =
        document.getElementById(
            device + "Switch"
        );


    if (element) {

        element.checked =
            state;

    }


    updateSwitchStatus(
        device,
        state
    );

}


// ==========================================================
// SWITCH STATUS TEXT
// ==========================================================

function updateSwitchStatus(
    device,
    state
) {

    let statusId =
        "";


    if (
        device === "light"
    ) {

        statusId =
            "lightStatus";

    }

    else if (
        device === "fan"
    ) {

        statusId =
            "fanStatus";

    }

    else if (
        device === "door"
    ) {

        statusId =
            "doorStatus";

    }

    else if (
        device === "alarm"
    ) {

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


    if (
        device === "door"
    ) {

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
// CHART INITIALIZATION
// ==========================================================

function initializeChart() {

    const canvas =
        document.getElementById(
            "environmentChart"
        );


    if (!canvas) {

        console.warn(
            "Chart canvas not found."
        );

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    environmentChart =
        new Chart(
            ctx,
            {

                type:
                    "line",

                data: {

                    labels:
                        chartLabels,

                    datasets: [

                        {

                            label:
                                "Temperature (°C)",

                            data:
                                temperatureHistory,

                            borderWidth:
                                2,

                            tension:
                                0.3,

                            fill:
                                false

                        },


                        {

                            label:
                                "Humidity (%)",

                            data:
                                humidityHistory,

                            borderWidth:
                                2,

                            tension:
                                0.3,

                            fill:
                                false

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        true,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    }

                }

            }
        );

}


// ==========================================================
// UPDATE CHART
// ==========================================================

function updateChart(
    temperature,
    humidity
) {

    if (
        !environmentChart
    ) {

        return;

    }


    chartLabels.push(
        new Date()
            .toLocaleTimeString(
                "en-PH"
            )
    );


    temperatureHistory.push(
        temperature
    );


    humidityHistory.push(
        humidity
    );


    // Keep last 15 readings

    if (
        chartLabels.length >
        15
    ) {

        chartLabels.shift();

        temperatureHistory.shift();

        humidityHistory.shift();

    }


    environmentChart.update();

}


// ==========================================================
// START DASHBOARD
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Smart Storage Dashboard starting..."
        );


        initializeLogout();


        initializeFirebaseConnection();


        initializeSensorListener();


        initializeSaveButton();


        initializeSwitches();


        initializeChart();


        updateClock();


        console.log(
            "Dashboard ready."
        );

    }
);


// ==========================================================
// GLOBAL FUNCTIONS
// ==========================================================

window.saveManualData =
    saveManualData;


window.sendCommandToESP32 =
    sendCommandToESP32;
