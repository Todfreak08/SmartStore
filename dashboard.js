// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
// ==========================================================
//
// SYSTEM:
//
// WEBSITE
//    ↓
// FIREBASE REALTIME DATABASE
//    ↓
// ESP32
//
// ESP32 sensor/data path:
//
// smartStorage/sensorData
//
// Website command paths:
//
// smartStorage/commands/light/state
// smartStorage/commands/fan/state
// smartStorage/commands/door/state
// smartStorage/commands/alarm/state
//
// ==========================================================


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let environmentChart = null;

let temperatureHistory = [];
let humidityHistory = [];
let chartLabels = [];


// ==========================================================
// FIREBASE AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href = "index.html";

        return;
    }


    console.log(
        "Logged in:",
        user.email
    );


    const emailElement =
        document.getElementById("userEmail");


    if (emailElement) {

        emailElement.textContent =
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

            alert(
                "Logout failed: " +
                error.message
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

            logoutButton.disabled = true;

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
// FIREBASE SENSOR DATA LISTENER
// ==========================================================
//
// ESP32 writes:
//
// smartStorage/sensorData
//
// ==========================================================

function initializeSensorListener() {

    console.log(
        "Starting ESP32 data listener..."
    );


    const sensorReference =
        database.ref(
            "smartStorage/sensorData"
        );


    sensorReference.on(

        "value",

        function (snapshot) {

            console.log(
                "ESP32 DATA:",
                snapshot.val()
            );


            const firebaseStatus =
                document.getElementById(
                    "firebaseStatus"
                );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Connected";

                firebaseStatus.style.color =
                    "#28a745";

            }


            if (!snapshot.exists()) {

                console.log(
                    "No ESP32 data yet."
                );


                updateDashboard(null);

                return;

            }


            const data =
                snapshot.val();


            updateDashboard(data);

        },

        function (error) {

            console.error(
                "Firebase sensor listener error:",
                error
            );


            const firebaseStatus =
                document.getElementById(
                    "firebaseStatus"
                );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Error";

                firebaseStatus.style.color =
                    "#dc3545";

            }

        }

    );

}


// ==========================================================
// UPDATE DASHBOARD
// ==========================================================

function updateDashboard(data) {

    if (!data) {

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


        return;

    }


    // ======================================================
    // TEMPERATURE
    // ======================================================

    let temperature =
        data.temperature;


    if (
        temperature !== undefined &&
        temperature !== null
    ) {

        temperature =
            Number(temperature);


        setText(
            "temperature",
            temperature.toFixed(1) +
            " °C"
        );

    }

    else {

        setText(
            "temperature",
            "-- °C"
        );

    }


    // ======================================================
    // HUMIDITY
    // ======================================================

    let humidity =
        data.humidity;


    if (
        humidity !== undefined &&
        humidity !== null
    ) {

        humidity =
            Number(humidity);


        setText(
            "humidity",
            humidity.toFixed(1) +
            " %"
        );

    }

    else {

        setText(
            "humidity",
            "-- %"
        );

    }


    // ======================================================
    // MOTION
    // ======================================================

    let motion =
        data.motion;


    if (motion === true) {

        setText(
            "motion",
            "Motion Detected"
        );

    }

    else if (motion === false) {

        setText(
            "motion",
            "No Motion"
        );

    }

    else if (
        motion !== undefined &&
        motion !== null
    ) {

        setText(
            "motion",
            String(motion)
        );

    }

    else {

        setText(
            "motion",
            "Waiting..."
        );

    }


    // ======================================================
    // STATUS
    // ======================================================

    const status =
        data.status ||
        "NORMAL";


    setText(
        "storageStatus",
        status
    );


    updateStatusClass(
        status
    );


    // ======================================================
    // TIMESTAMP
    // ======================================================

    if (data.timestamp) {

        setText(
            "lastUpdate",
            "Last Update: " +
            data.timestamp
        );

    }

    else if (data.date && data.time) {

        setText(
            "lastUpdate",
            "Last Update: " +
            data.date +
            " " +
            data.time
        );

    }

    else {

        setText(
            "lastUpdate",
            "No timestamp received."
        );

    }


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
    // UPDATE CHART
    // ======================================================

    if (
        temperature !== undefined &&
        humidity !== undefined &&
        !isNaN(temperature) &&
        !isNaN(humidity)
    ) {

        updateChart(
            temperature,
            humidity
        );

    }

}


// ==========================================================
// SET TEXT HELPER
// ==========================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ==========================================================
// STATUS CLASS
// ==========================================================

function updateStatusClass(
    status
) {

    const statusElement =
        document.getElementById(
            "storageStatus"
        );


    if (!statusElement) {

        return;

    }


    statusElement.classList.remove(
        "normal",
        "warning",
        "danger"
    );


    const currentStatus =
        String(status)
            .toUpperCase();


    if (
        currentStatus ===
        "DANGER"
    ) {

        statusElement.classList.add(
            "danger"
        );

    }

    else if (
        currentStatus ===
        "WARNING"
    ) {

        statusElement.classList.add(
            "warning"
        );

    }

    else {

        statusElement.classList.add(
            "normal"
        );

    }

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

                type: "line",

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

    if (!environmentChart) {

        return;

    }


    const now =
        new Date();


    let label;


    label =
        now.toLocaleTimeString(
            "en-PH"
        );


    chartLabels.push(
        label
    );


    temperatureHistory.push(
        Number(temperature)
    );


    humidityHistory.push(
        Number(humidity)
    );


    // Keep only latest 15 records

    if (
        chartLabels.length > 15
    ) {

        chartLabels.shift();

        temperatureHistory.shift();

        humidityHistory.shift();

    }


    environmentChart.update();

}


// ==========================================================
// WEBSITE CLOCK
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

        +

        " • "

        +

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
// WEBSITE COMMAND SWITCHES
// ==========================================================
//
// IMPORTANT:
//
// These are the EXACT Firebase paths:
//
// light:
// smartStorage/commands/light/state
//
// fan:
// smartStorage/commands/fan/state
//
// door:
// smartStorage/commands/door/state
//
// alarm:
// smartStorage/commands/alarm/state
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
// CONNECT INDIVIDUAL SWITCH
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
            "Switch not found:",
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
                "Website command:",
                device,
                state
            );


            sendCommandToFirebase(
                device,
                state
            );

        }
    );

}


// ==========================================================
// SEND WEBSITE COMMAND TO FIREBASE
// ==========================================================

function sendCommandToFirebase(
    device,
    state
) {

    // ======================================================
    // EXACT COMMAND PATH
    // ======================================================

    const commandPath =
        "smartStorage/commands/" +
        device +
        "/state";


    console.log(
        "Writing command to:",
        commandPath
    );


    // ======================================================
    // WRITE ONLY THE STATE
    // ======================================================

    database
        .ref(commandPath)
        .set(Boolean(state))

        .then(function () {

            console.log(
                "Command successfully written:",
                commandPath,
                "=",
                state
            );


            updateSwitchStatus(
                device,
                state
            );

        })

        .catch(function (error) {

            console.error(
                "Command write failed:",
                error
            );


            alert(
                "Unable to send command to ESP32.\n\n" +
                error.message
            );


            // Return switch to previous state

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
// SWITCH STATUS DISPLAY
// ==========================================================

function updateSwitchStatus(
    device,
    state
) {

    let statusId;


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
// OPTIONAL: READ CURRENT COMMAND STATES
// ==========================================================
//
// This allows the website to remember the switch state
// after refreshing the page.
//
// ==========================================================

function loadCommandStates() {

    const commandsReference =
        database.ref(
            "smartStorage/commands"
        );


    commandsReference.on(
        "value",
        function (snapshot) {

            if (!snapshot.exists()) {

                return;

            }


            const commands =
                snapshot.val();


            // LIGHT

            if (
                commands.light &&
                commands.light.state !== undefined
            ) {

                setSwitchFromFirebase(
                    "light",
                    commands.light.state
                );

            }


            // FAN

            if (
                commands.fan &&
                commands.fan.state !== undefined
            ) {

                setSwitchFromFirebase(
                    "fan",
                    commands.fan.state
                );

            }


            // DOOR

            if (
                commands.door &&
                commands.door.state !== undefined
            ) {

                setSwitchFromFirebase(
                    "door",
                    commands.door.state
                );

            }


            // ALARM

            if (
                commands.alarm &&
                commands.alarm.state !== undefined
            ) {

                setSwitchFromFirebase(
                    "alarm",
                    commands.alarm.state
                );

            }

        },

        function (error) {

            console.error(
                "Command listener error:",
                error
            );

        }
    );

}


// ==========================================================
// SET SWITCH FROM FIREBASE
// ==========================================================

function setSwitchFromFirebase(
    device,
    state
) {

    const element =
        document.getElementById(
            device + "Switch"
        );


    if (!element) {

        return;

    }


    element.checked =
        Boolean(state);


    updateSwitchStatus(
        device,
        Boolean(state)
    );

}


// ==========================================================
// MANUAL DATA ENTRY
// ==========================================================
//
// This remains available for testing the website.
// It writes to smartStorage/sensorData.
//
// Your ESP32 can later overwrite this data.
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
        function () {

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
        motionInput.value === "true";


    if (isNaN(temperature)) {

        showManualMessage(
            "❌ Please enter temperature.",
            "error"
        );

        return;

    }


    if (isNaN(humidity)) {

        showManualMessage(
            "❌ Please enter humidity.",
            "error"
        );

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

        return;

    }


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


    const now =
        new Date();


    const timestamp =
        now.toLocaleString(
            "en-PH"
        );


    const data = {

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

        date:
            now.toLocaleDateString(
                "en-CA"
            ),

        time:
            now.toLocaleTimeString(
                "en-PH"
            ),

        source:
            "Website"

    };


    database
        .ref(
            "smartStorage/sensorData"
        )
        .set(data)

        .then(function () {

            showManualMessage(
                "✅ Data saved to Firebase.",
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
                "Manual save error:",
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
// MANUAL MESSAGE
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


    if (type === "success") {

        element.style.color =
            "#28a745";

    }

    else if (type === "error") {

        element.style.color =
            "#dc3545";

    }

    else {

        element.style.color =
            "#0b2447";

    }

}


// ==========================================================
// INITIALIZE EVERYTHING
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Smart Storage Dashboard starting..."
        );


        initializeLogout();


        initializeSensorListener();


        initializeSwitches();


        loadCommandStates();


        initializeSaveButton();


        initializeChart();


        console.log(
            "Smart Storage Dashboard ready."
        );

    }
);


// ==========================================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.logout =
    logout;


window.saveManualData =
    saveManualData;


window.sendCommandToFirebase =
    sendCommandToFirebase;
