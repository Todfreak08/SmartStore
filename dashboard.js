// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE DASHBOARD.JS
// ==========================================================


// ==========================================================
// CHECK FIREBASE
// ==========================================================

if (
    typeof firebase === "undefined" ||
    typeof auth === "undefined" ||
    typeof database === "undefined"
) {

    alert(
        "Firebase is not connected. Please check firebase-config.js."
    );

    throw new Error(
        "Firebase configuration not loaded."
    );

}


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

});


// ==========================================================
// LOGOUT
// ==========================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

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
    );

}


// ==========================================================
// FIREBASE CONNECTION
// ==========================================================

const firebaseStatus =
    document.getElementById(
        "firebaseStatus"
    );


database
    .ref(".info/connected")
    .on(
        "value",
        function (snapshot) {

            if (!firebaseStatus) return;


            if (snapshot.val() === true) {

                firebaseStatus.textContent =
                    "● Connected";

                firebaseStatus.style.color =
                    "#28a745";

            } else {

                firebaseStatus.textContent =
                    "● Disconnected";

                firebaseStatus.style.color =
                    "#dc3545";

            }

        }
    );


// ==========================================================
// DASHBOARD DISPLAY
// ==========================================================

function updateDashboard(data) {

    if (!data) return;


    const temperature =
        data.temperature ?? "--";


    const humidity =
        data.humidity ?? "--";


    let motion =
        data.motion;


    if (motion === true) {

        motion =
            "Detected";

    }

    else if (motion === false) {

        motion =
            "No Motion";

    }

    else {

        motion =
            "Waiting...";

    }


    const status =
        data.status ?? "NORMAL";


    const lastUpdate =
        data.lastUpdate ??
        "Unknown";


    const temperatureElement =
        document.getElementById(
            "temperature"
        );


    const humidityElement =
        document.getElementById(
            "humidity"
        );


    const motionElement =
        document.getElementById(
            "motion"
        );


    const statusElement =
        document.getElementById(
            "storageStatus"
        );


    const updateElement =
        document.getElementById(
            "lastUpdate"
        );


    if (temperatureElement) {

        temperatureElement.textContent =
            temperature + " °C";

    }


    if (humidityElement) {

        humidityElement.textContent =
            humidity + " %";

    }


    if (motionElement) {

        motionElement.textContent =
            motion;

    }


    if (statusElement) {

        statusElement.textContent =
            status;

    }


    if (updateElement) {

        updateElement.textContent =
            "Last Update: " +
            lastUpdate;

    }


    const temperatureSource =
        document.getElementById(
            "temperatureSource"
        );


    const humiditySource =
        document.getElementById(
            "humiditySource"
        );


    if (temperatureSource) {

        temperatureSource.textContent =
            "Source: " +
            (data.source ||
             "Firebase");

    }


    if (humiditySource) {

        humiditySource.textContent =
            "Source: " +
            (data.source ||
             "Firebase");

    }

}


// ==========================================================
// LISTEN TO SMART STORAGE
// ==========================================================

database
    .ref("SmartStorage")
    .on(
        "value",
        function (snapshot) {

            if (!snapshot.exists()) {

                return;

            }


            const data =
                snapshot.val();


            let currentData =
                data;


            if (
                data.current &&
                typeof data.current ===
                    "object"
            ) {

                currentData = {

                    ...data,
                    ...data.current

                };

            }


            updateDashboard(
                currentData
            );


            loadSwitches(
                currentData
            );

        },
        function (error) {

            console.error(
                "Firebase read error:",
                error
            );

        }
    );


// ==========================================================
// SAVE MANUAL DATA
// ==========================================================

function saveManualData() {

    console.log(
        "SAVE DATA BUTTON CLICKED"
    );


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


    const message =
        document.getElementById(
            "manualMessage"
        );


    const button =
        document.getElementById(
            "saveDataButton"
        );


    // ------------------------------------------------------
    // CHECK ELEMENTS
    // ------------------------------------------------------

    if (!temperatureInput ||
        !humidityInput ||
        !motionInput) {

        alert(
            "Manual input fields are missing."
        );

        return;

    }


    // ------------------------------------------------------
    // GET INPUT
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // VALIDATE
    // ------------------------------------------------------

    if (isNaN(temperature)) {

        showMessage(
            "❌ Please enter temperature.",
            "error"
        );

        return;

    }


    if (
        isNaN(humidity) ||
        humidity < 0 ||
        humidity > 100
    ) {

        showMessage(
            "❌ Humidity must be between 0 and 100.",
            "error"
        );

        return;

    }


    // ------------------------------------------------------
    // STATUS
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // TIME
    // ------------------------------------------------------

    const readableTime =
        new Date()
            .toLocaleString();


    // ------------------------------------------------------
    // SHOW SAVING
    // ------------------------------------------------------

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "⏳ SAVING...";

    }


    showMessage(
        "Saving to Firebase...",
        "success"
    );


    // ======================================================
    // CREATE HISTORY ID
    // ======================================================

    const historyRef =
        database
            .ref(
                "SmartStorage/history"
            )
            .push();


    const historyId =
        historyRef.key;


    // ======================================================
    // CREATE UPDATE
    // ======================================================

    const updates = {};


    // ------------------------------------------------------
    // MAIN SMART STORAGE
    // ------------------------------------------------------

    updates[
        "SmartStorage/temperature"
    ] =
        temperature;


    updates[
        "SmartStorage/humidity"
    ] =
        humidity;


    updates[
        "SmartStorage/motion"
    ] =
        motion;


    updates[
        "SmartStorage/status"
    ] =
        status;


    updates[
        "SmartStorage/source"
    ] =
        "Manual Entry";


    updates[
        "SmartStorage/lastUpdate"
    ] =
        readableTime;


    updates[
        "SmartStorage/updatedAt"
    ] =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    // ------------------------------------------------------
    // CURRENT
    // ------------------------------------------------------

    updates[
        "SmartStorage/current/temperature"
    ] =
        temperature;


    updates[
        "SmartStorage/current/humidity"
    ] =
        humidity;


    updates[
        "SmartStorage/current/motion"
    ] =
        motion;


    updates[
        "SmartStorage/current/status"
    ] =
        status;


    updates[
        "SmartStorage/current/source"
    ] =
        "Manual Entry";


    updates[
        "SmartStorage/current/lastUpdate"
    ] =
        readableTime;


    updates[
        "SmartStorage/current/updatedAt"
    ] =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    // ------------------------------------------------------
    // HISTORY
    // ------------------------------------------------------

    updates[
        "SmartStorage/history/" +
        historyId +
        "/temperature"
    ] =
        temperature;


    updates[
        "SmartStorage/history/" +
        historyId +
        "/humidity"
    ] =
        humidity;


    updates[
        "SmartStorage/history/" +
        historyId +
        "/motion"
    ] =
        motion;


    updates[
        "SmartStorage/history/" +
        historyId +
        "/status"
    ] =
        status;


    updates[
        "SmartStorage/history/" +
        historyId +
        "/source"
    ] =
        "Manual Entry";


    updates[
        "SmartStorage/history/" +
        historyId +
        "/timestamp"
    ] =
        readableTime;


    updates[
        "SmartStorage/history/" +
        historyId +
        "/createdAt"
    ] =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    // ======================================================
    // SAVE TO FIREBASE
    // ======================================================

    database
        .ref()
        .update(updates)

        .then(function () {

            console.log(
                "================================"
            );

            console.log(
                "DATA SAVED SUCCESSFULLY"
            );

            console.log(
                "History ID:",
                historyId
            );

            console.log(
                "================================"
            );


            showMessage(
                "✅ DATA SAVED TO FIREBASE!",
                "success"
            );


            // ------------------------------------------------
            // UPDATE SCREEN
            // ------------------------------------------------

            updateDashboard({

                temperature:
                    temperature,

                humidity:
                    humidity,

                motion:
                    motion,

                status:
                    status,

                source:
                    "Manual Entry",

                lastUpdate:
                    readableTime

            });


            // ------------------------------------------------
            // CLEAR FORM
            // ------------------------------------------------

            temperatureInput.value =
                "";

            humidityInput.value =
                "";

            motionInput.value =
                "false";

        })


        .catch(function (error) {

            console.error(
                "================================"
            );

            console.error(
                "FIREBASE SAVE ERROR"
            );

            console.error(
                error
            );

            console.error(
                "================================"
            );


            showMessage(
                "❌ SAVE FAILED: " +
                error.message,
                "error"
            );

        })


        .finally(function () {

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "💾 SAVE DATA";

            }

        });

}


// ==========================================================
// MAKE SAVE FUNCTION AVAILABLE
// ==========================================================

window.saveManualData =
    saveManualData;


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "manualMessage"
        );


    if (!message) {

        alert(text);

        return;

    }


    message.textContent =
        text;


    if (type === "success") {

        message.style.color =
            "#28a745";

    }

    else {

        message.style.color =
            "#dc3545";

    }

}


// ==========================================================
// SWITCH CONTROL
// ==========================================================

function updateDeviceSwitch(
    device,
    state
) {

    const value =
        Boolean(state);


    const historyRef =
        database
            .ref(
                "SmartStorage/history"
            )
            .push();


    const historyId =
        historyRef.key;


    const updates = {};


    updates[
        "SmartStorage/" + device
    ] =
        value;


    updates[
        "SmartStorage/current/" +
        device
    ] =
        value;


    updates[
        "SmartStorage/current/source"
    ] =
        "Manual Control";


    updates[
        "SmartStorage/current/updatedAt"
    ] =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    updates[
        "SmartStorage/history/" +
        historyId
    ] = {

        device:
            device,

        state:
            value,

        source:
            "Manual Control",

        timestamp:
            new Date()
                .toLocaleString(),

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    database
        .ref()
        .update(updates)

        .then(function () {

            updateSwitchText(
                device,
                value
            );

        })

        .catch(function (error) {

            console.error(
                "Switch error:",
                error
            );


            alert(
                "Unable to save switch: " +
                error.message
            );


            const element =
                document.getElementById(
                    device + "Switch"
                );


            if (element) {

                element.checked =
                    !value;

            }

        });

}


window.updateDeviceSwitch =
    updateDeviceSwitch;


// ==========================================================
// SWITCH EVENT LISTENERS
// ==========================================================

function setupSwitch(
    device
) {

    const element =
        document.getElementById(
            device + "Switch"
        );


    if (!element) return;


    element.addEventListener(
        "change",
        function () {

            updateDeviceSwitch(
                device,
                this.checked
            );

        }
    );

}


setupSwitch("light");

setupSwitch("fan");

setupSwitch("door");

setupSwitch("alarm");


// ==========================================================
// LOAD SWITCHES
// ==========================================================

function loadSwitches(data) {

    if (!data) return;


    setSwitch(
        "light",
        data.light
    );


    setSwitch(
        "fan",
        data.fan
    );


    setSwitch(
        "door",
        data.door
    );


    setSwitch(
        "alarm",
        data.alarm
    );

}


function setSwitch(
    device,
    state
) {

    if (
        state === undefined ||
        state === null
    ) {

        return;

    }


    const element =
        document.getElementById(
            device + "Switch"
        );


    if (element) {

        element.checked =
            Boolean(state);

    }


    updateSwitchText(
        device,
        Boolean(state)
    );

}


function updateSwitchText(
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


    if (!statusId) return;


    const element =
        document.getElementById(
            statusId
        );


    if (!element) return;


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
// CHART
// ==========================================================

const chartCanvas =
    document.getElementById(
        "environmentChart"
    );


if (chartCanvas) {

    const chartContext =
        chartCanvas.getContext("2d");


    new Chart(
        chartContext,
        {

            type: "line",

            data: {

                labels: [],

                datasets: [

                    {

                        label:
                            "Temperature (°C)",

                        data: [],

                        borderWidth: 2,

                        tension: 0.3

                    },

                    {

                        label:
                            "Humidity (%)",

                        data: [],

                        borderWidth: 2,

                        tension: 0.3

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: true

            }

        }
    );

                    }    if (motion === true) {
        motion = "Detected";
    }

    else if (motion === false) {
        motion = "No Motion";
    }

    else {
        motion = "Waiting...";
    }


    const status =
        data.status ?? "NORMAL";


    const lastUpdate =
        data.lastUpdate ?? "Unknown";


    const temperatureElement =
        document.getElementById("temperature");

    const humidityElement =
        document.getElementById("humidity");

    const motionElement =
        document.getElementById("motion");

    const statusElement =
        document.getElementById("storageStatus");

    const updateElement =
        document.getElementById("lastUpdate");


    if (temperatureElement) {

        temperatureElement.textContent =
            temperature + " °C";

    }


    if (humidityElement) {

        humidityElement.textContent =
            humidity + " %";

    }


    if (motionElement) {

        motionElement.textContent =
            motion;

    }


    if (statusElement) {

        statusElement.textContent =
            status;

    }


    if (updateElement) {

        updateElement.textContent =
            "Last Update: " + lastUpdate;

    }


    const temperatureSource =
        document.getElementById(
            "temperatureSource"
        );

    const humiditySource =
        document.getElementById(
            "humiditySource"
        );


    if (temperatureSource) {

        temperatureSource.textContent =
            "Source: " +
            (data.source || "Firebase");

    }


    if (humiditySource) {

        humiditySource.textContent =
            "Source: " +
            (data.source || "Firebase");

    }

}


// ==========================================================
// LOAD CURRENT DATA
// ==========================================================

database
    .ref("SmartStorage")
    .on("value", function (snapshot) {

        if (!snapshot.exists()) {

            return;

        }


        const data =
            snapshot.val();


        let currentData =
            data;


        if (
            data.current &&
            typeof data.current === "object"
        ) {

            currentData = {

                ...data,
                ...data.current

            };

        }


        updateDashboard(currentData);


        loadSwitches(currentData);

    });


// ==========================================================
// SAVE MANUAL DATA
// ==========================================================

function saveManualData() {

    console.log("SAVE DATA CLICKED");


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


    const message =
        document.getElementById(
            "manualMessage"
        );


    const button =
        document.getElementById(
            "saveDataButton"
        );


    // ------------------------------------------------------
    // CHECK ELEMENTS
    // ------------------------------------------------------

    if (!temperatureInput) {

        alert(
            "Temperature input not found."
        );

        return;

    }


    if (!humidityInput) {

        alert(
            "Humidity input not found."
        );

        return;

    }


    if (!motionInput) {

        alert(
            "Motion input not found."
        );

        return;

    }


    // ------------------------------------------------------
    // VALUES
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (isNaN(temperature)) {

        showMessage(
            "❌ Enter a valid temperature.",
            "error"
        );

        return;

    }


    if (
        isNaN(humidity) ||
        humidity < 0 ||
        humidity > 100
    ) {

        showMessage(
            "❌ Humidity must be between 0 and 100.",
            "error"
        );

        return;

    }


    // ------------------------------------------------------
    // STATUS
    // ------------------------------------------------------

    let status = "NORMAL";


    if (
        temperature >= 35 ||
        humidity >= 80
    ) {

        status = "WARNING";

    }


    if (
        temperature >= 40
