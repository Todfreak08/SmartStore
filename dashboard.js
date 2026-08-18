// ==========================================
// DASHBOARD
// ==========================================

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    const email = document.getElementById("userEmail");

    if (email) {

        email.textContent = user.email;

    }

});


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    auth.signOut().then(() => {

        window.location.href = "index.html";

    });

}


// ==========================================
// FIREBASE STORAGE
// ==========================================

database.ref("storage").on("value", (snapshot) => {

    console.log("STORAGE:", snapshot.val());

    if (!snapshot.exists()) {

        document.getElementById("temperature").textContent = "-- °C";

        document.getElementById("humidity").textContent = "-- %";

        document.getElementById("motion").textContent = "Waiting...";

        document.getElementById("storageStatus").textContent =
            "Waiting for ESP32...";

        document.getElementById("lastUpdate").textContent =
            "No data";

        return;

    }


    const data = snapshot.val();


    // Temperature

    document.getElementById("temperature").textContent =
        Number(data.temperature).toFixed(1) + " °C";


    // Humidity

    document.getElementById("humidity").textContent =
        Number(data.humidity).toFixed(1) + " %";


    // Motion

    document.getElementById("motion").textContent =
        data.motion || "No Motion";


    // Status

    document.getElementById("storageStatus").textContent =
        data.status || "Normal";


    // Last update

    document.getElementById("lastUpdate").textContent =
        data.lastUpdate || "No timestamp";


    // Status class

    const statusElement =
        document.getElementById("storageStatus");

    statusElement.classList.remove(
        "normal",
        "warning",
        "danger"
    );


    if (data.status === "Danger") {

        statusElement.classList.add("danger");

    }
    else if (data.status === "Warning") {

        statusElement.classList.add("warning");

    }
    else {

        statusElement.classList.add("normal");

    }

});


// ==========================================
// LIVE WEBSITE CLOCK
// ==========================================

function updateClock() {

    const element =
        document.getElementById("currentDateTime");

    if (!element) return;

    const now = new Date();

    element.textContent =
        now.toLocaleDateString("en-PH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        + " • " +
        now.toLocaleTimeString("en-PH");

}

updateClock();

setInterval(updateClock, 1000);
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
// SAVE BUTTON
// ==========================================================

function initializeSaveButton() {

    const saveButton =
        document.getElementById(
            "saveDataButton"
        );


    if (!saveButton) {

        console.error(
            "SAVE DATA BUTTON NOT FOUND."
        );

        return;
    }


    console.log(
        "Save button connected."
    );


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

    console.log(
        "SAVE DATA CLICKED"
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


    const saveButton =
        document.getElementById(
            "saveDataButton"
        );


    // ------------------------------------------------------
    // CHECK INPUTS
    // ------------------------------------------------------

    if (
        !temperatureInput ||
        !humidityInput ||
        !motionInput
    ) {

        console.error(
            "Manual input fields are missing."
        );


        showManualMessage(
            "❌ Input fields not found.",
            "error"
        );

        return;
    }


    // ------------------------------------------------------
    // GET VALUES
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
    // VALIDATE TEMPERATURE
    // ------------------------------------------------------

    if (isNaN(temperature)) {

        showManualMessage(
            "❌ Please enter temperature.",
            "error"
        );

        temperatureInput.focus();

        return;
    }


    // ------------------------------------------------------
    // VALIDATE HUMIDITY
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // DETERMINE STATUS
    // ------------------------------------------------------

    let status = "NORMAL";


    if (
        temperature >= 35 ||
        humidity >= 80
    ) {

        status = "WARNING";

    }


    if (
        temperature >= 40 ||
        humidity >= 90
    ) {

        status = "DANGER";

    }


    // ------------------------------------------------------
    // TIME
    // ------------------------------------------------------

    const now =
        new Date();


    const readableTime =
        now.toLocaleString();


    // ------------------------------------------------------
    // DATA FOR CURRENT
    // ------------------------------------------------------

    const currentData = {

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
            readableTime,

        updatedAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    // ------------------------------------------------------
    // DATA FOR HISTORY
    // ------------------------------------------------------

    const historyData = {

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

        timestamp:
            readableTime,

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    console.log(
        "Data being saved:",
        currentData
    );


    // ------------------------------------------------------
    // DISABLE BUTTON
    // ------------------------------------------------------

    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "⏳ SAVING...";

    }


    showManualMessage(
        "Saving data to Firebase...",
        "normal"
    );


    // ======================================================
    // SAVE EVERYTHING USING ONE MULTI-PATH UPDATE
    // ======================================================

    const historyKey =
        database
            .ref(
                "SmartStorage/history"
            )
            .push()
            .key;


    if (!historyKey) {

        showManualMessage(
            "❌ Could not create history record.",
            "error"
        );

        enableSaveButton();

        return;
    }


    const updates = {};


    // ------------------------------------------------------
    // MAIN CURRENT DATA
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
        "SmartStorage/current"
    ] =
        currentData;


    // ------------------------------------------------------
    // HISTORY
    // ------------------------------------------------------

    updates[
        "SmartStorage/history/" +
        historyKey
    ] =
        historyData;


    console.log(
        "Firebase updates:",
        updates
    );


    // ======================================================
    // WRITE TO FIREBASE
    // ======================================================

    database
        .ref()
        .update(updates)

        .then(function () {

            console.log(
                "SUCCESS: Data saved to Firebase."
            );


            // ------------------------------------------------
            // SUCCESS MESSAGE
            // ------------------------------------------------

            showManualMessage(
                "✅ Data successfully saved to Firebase!",
                "success"
            );


            // ------------------------------------------------
            // UPDATE DASHBOARD IMMEDIATELY
            // ------------------------------------------------

            updateDashboard(
                currentData
            );


            // ------------------------------------------------
            // CLEAR INPUTS
            // ------------------------------------------------

            temperatureInput.value =
                "";

            humidityInput.value =
                "";

            motionInput.value =
                "false";


            // ------------------------------------------------
            // ENABLE BUTTON
            // ------------------------------------------------

            enableSaveButton();

        })

        .catch(function (error) {

            console.error(
                "Firebase save failed:",
                error
            );


            showManualMessage(
                "❌ Firebase Error: " +
                error.message,
                "error"
            );


            enableSaveButton();

        });

}


// ==========================================================
// ENABLE SAVE BUTTON
// ==========================================================

function enableSaveButton() {

    const button =
        document.getElementById(
            "saveDataButton"
        );


    if (!button) {

        return;
    }


    button.disabled = false;

    button.textContent =
        "💾 SAVE DATA";

}


// ==========================================================
// MESSAGE
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
// FIREBASE MAIN LISTENER
// ==========================================================

function initializeFirebaseListener() {

    database
        .ref("SmartStorage")
        .on(

            "value",

            function (snapshot) {

                const status =
                    document.getElementById(
                        "firebaseStatus"
                    );


                if (status) {

                    status.textContent =
                        "● Firebase Connected";

                    status.style.color =
                        "#28a745";

                }


                if (!snapshot.exists()) {

                    updateDashboard(null);

                    return;
                }


                const data =
                    snapshot.val();


                let dashboardData =
                    data;


                // ------------------------------------------------
                // USE CURRENT IF AVAILABLE
                // ------------------------------------------------

                if (
                    data.current &&
                    typeof data.current ===
                    "object"
                ) {

                    dashboardData = {

                        ...data,

                        ...data.current

                    };

                }


                updateDashboard(
                    dashboardData
                );

            },


            function (error) {

                console.error(
                    "Firebase listener error:",
                    error
                );


                const status =
                    document.getElementById(
                        "firebaseStatus"
                    );


                if (status) {

                    status.textContent =
                        "● Firebase Error";

                    status.style.color =
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
            "Waiting for data..."
        );


        setText(
            "lastUpdate",
            "No data received yet."
        );


        return;
    }


    // ------------------------------------------------------
    // TEMPERATURE
    // ------------------------------------------------------

    const temperature =
        data.temperature;


    // ------------------------------------------------------
    // HUMIDITY
    // ------------------------------------------------------

    const humidity =
        data.humidity;


    // ------------------------------------------------------
    // MOTION
    // ------------------------------------------------------

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

    else if (
        motion === undefined ||
        motion === null
    ) {

        motion =
            "Waiting...";

    }


    // ------------------------------------------------------
    // DISPLAY
    // ------------------------------------------------------

    setText(
        "temperature",

        temperature !== undefined
            ? temperature + " °C"
            : "-- °C"
    );


    setText(
        "humidity",

        humidity !== undefined
            ? humidity + " %"
            : "-- %"
    );


    setText(
        "motion",
        motion
    );


    setText(
        "storageStatus",
        data.status || "NORMAL"
    );


    setText(
        "lastUpdate",

        data.lastUpdate
            ? "Last Update: " +
              data.lastUpdate
            : "No data received yet."
    );


    setText(
        "temperatureSource",

        data.source
            ? "Source: " + data.source
            : "Environmental Data"
    );


    setText(
        "humiditySource",

        data.source
            ? "Source: " + data.source
            : "Environmental Data"
    );


    // ------------------------------------------------------
    // SWITCHES
    // ------------------------------------------------------

    loadSwitches(data);


    // ------------------------------------------------------
    // CHART
    // ------------------------------------------------------

    updateChart(
        temperature,
        humidity
    );

}


// ==========================================================
// SET TEXT
// ==========================================================

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


// ==========================================================
// CHART
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
        canvas.getContext("2d");


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

                            borderWidth: 2,

                            tension: 0.3,

                            fill: false

                        },

                        {

                            label:
                                "Humidity (%)",

                            data:
                                humidityHistory,

                            borderWidth: 2,

                            tension: 0.3,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: true,

                    interaction: {

                        mode: "index",

                        intersect: false

                    }

                }

            }

        );

}


function updateChart(
    temperature,
    humidity
) {

    if (
        !environmentChart ||
        temperature === undefined ||
        humidity === undefined
    ) {

        return;
    }


    chartLabels.push(
        new Date()
            .toLocaleTimeString()
    );


    temperatureHistory.push(
        Number(temperature)
    );


    humidityHistory.push(
        Number(humidity)
    );


    if (chartLabels.length > 15) {

        chartLabels.shift();

        temperatureHistory.shift();

        humidityHistory.shift();

    }


    environmentChart.update();

}


// ==========================================================
// SWITCH INITIALIZATION
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

            updateDeviceSwitch(
                device,
                element.checked
            );

        }
    );

}


// ==========================================================
// UPDATE DEVICE SWITCH
// ==========================================================

function updateDeviceSwitch(
    device,
    state
) {

    console.log(
        "Switch changed:",
        device,
        state
    );


    const switchData = {

        [device]:
            Boolean(state),

        source:
            "Manual Control",

        lastUpdate:
            new Date()
                .toLocaleString(),

        updatedAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    // ------------------------------------------------------
    // UPDATE MAIN DATA
    // ------------------------------------------------------

    database
        .ref("SmartStorage")
        .update(switchData)

        .then(function () {

            // ------------------------------------------------
            // UPDATE CURRENT
            // ------------------------------------------------

            return database
                .ref(
                    "SmartStorage/current"
                )
                .update(
                    switchData
                );

        })

        .then(function () {

            // ------------------------------------------------
            // SAVE SWITCH HISTORY
            // ------------------------------------------------

            return database
                .ref(
                    "SmartStorage/history"
                )
                .push({

                    device:
                        device,

                    state:
                        Boolean(state),

                    source:
                        "Manual Control",

                    timestamp:
                        new Date()
                            .toLocaleString(),

                    createdAt:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP

                });

        })

        .then(function () {

            console.log(
                "Switch saved successfully."
            );


            updateSwitchStatus(
                device,
                state
            );

        })

        .catch(function (error) {

            console.error(
                "Switch save error:",
                error
            );


            alert(
                "Unable to save switch:\n" +
                error.message
            );


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
// LOAD SWITCHES
// ==========================================================

function loadSwitches(data) {

    setSwitchState(
        "light",
        data.light
    );


    setSwitchState(
        "fan",
        data.fan
    );


    setSwitchState(
        "door",
        data.door
    );


    setSwitchState(
        "alarm",
        data.alarm
    );

}


// ==========================================================
// SET SWITCH STATE
// ==========================================================

function setSwitchState(
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


    updateSwitchStatus(
        device,
        Boolean(state)
    );

}


// ==========================================================
// SWITCH STATUS TEXT
// ==========================================================

function updateSwitchStatus(
    device,
    state
) {

    let elementId = "";


    if (device === "light") {

        elementId =
            "lightStatus";

    }

    else if (device === "fan") {

        elementId =
            "fanStatus";

    }

    else if (device === "door") {

        elementId =
            "doorStatus";

    }

    else if (device === "alarm") {

        elementId =
            "alarmStatus";

    }


    if (!elementId) {

        return;
    }


    const element =
        document.getElementById(
            elementId
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
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.saveManualData =
    saveManualData;


window.updateDeviceSwitch =
    updateDeviceSwitch;
