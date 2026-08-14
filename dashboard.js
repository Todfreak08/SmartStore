// ==========================================================
// SAVE MANUAL DATA
// Saves to:
// SmartStorage
// SmartStorage/current
// SmartStorage/history
// ==========================================================

function saveManualData() {

    const temperatureInput =
        document.getElementById("manualTemperature");

    const humidityInput =
        document.getElementById("manualHumidity");

    const motionInput =
        document.getElementById("manualMotion");

    const message =
        document.getElementById("manualMessage");


    // ------------------------------------------------------
    // CHECK INPUTS
    // ------------------------------------------------------

    if (
        !temperatureInput ||
        !humidityInput ||
        !motionInput
    ) {

        console.error("Manual input fields not found.");

        return;

    }


    // ------------------------------------------------------
    // GET VALUES
    // ------------------------------------------------------

    const temperature =
        parseFloat(temperatureInput.value);

    const humidity =
        parseFloat(humidityInput.value);

    const motion =
        motionInput.value === "true";


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (isNaN(temperature)) {

        showManualMessage(
            "❌ Please enter the temperature.",
            "error"
        );

        return;

    }


    if (
        isNaN(humidity) ||
        humidity < 0 ||
        humidity > 100
    ) {

        showManualMessage(
            "❌ Humidity must be between 0 and 100.",
            "error"
        );

        return;

    }


    // ------------------------------------------------------
    // AUTOMATIC STATUS
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
    // CREATE DATA
    // ------------------------------------------------------

    const manualData = {

        temperature: temperature,

        humidity: humidity,

        motion: motion,

        status: status,

        source: "Manual Entry",

        lastUpdate:
            new Date().toLocaleString(),

        updatedAt:
            firebase.database.ServerValue.TIMESTAMP

    };


    console.log(
        "Saving data:",
        manualData
    );


    // ------------------------------------------------------
    // DISABLE BUTTON WHILE SAVING
    // ------------------------------------------------------

    const saveButton =
        document.getElementById("saveDataButton");


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.innerHTML =
            "⏳ SAVING...";

    }


    showManualMessage(
        "Saving data to Firebase...",
        "success"
    );


    // ======================================================
    // SAVE EVERYTHING USING ONE MULTI-PATH UPDATE
    // ======================================================

    const updates = {};


    // Current/main data

    updates["SmartStorage/temperature"] =
        temperature;

    updates["SmartStorage/humidity"] =
        humidity;

    updates["SmartStorage/motion"] =
        motion;

    updates["SmartStorage/status"] =
        status;

    updates["SmartStorage/source"] =
        "Manual Entry";

    updates["SmartStorage/lastUpdate"] =
        manualData.lastUpdate;

    updates["SmartStorage/updatedAt"] =
        firebase.database.ServerValue.TIMESTAMP;


    // Current copy

    updates["SmartStorage/current/temperature"] =
        temperature;

    updates["SmartStorage/current/humidity"] =
        humidity;

    updates["SmartStorage/current/motion"] =
        motion;

    updates["SmartStorage/current/status"] =
        status;

    updates["SmartStorage/current/source"] =
        "Manual Entry";

    updates["SmartStorage/current/lastUpdate"] =
        manualData.lastUpdate;

    updates["SmartStorage/current/updatedAt"] =
        firebase.database.ServerValue.TIMESTAMP;


    // History

    const historyKey =
        database
            .ref("SmartStorage/history")
            .push()
            .key;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/temperature"
    ] = temperature;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/humidity"
    ] = humidity;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/motion"
    ] = motion;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/status"
    ] = status;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/source"
    ] = "Manual Entry";


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/timestamp"
    ] = manualData.lastUpdate;


    updates[
        "SmartStorage/history/" +
        historyKey +
        "/createdAt"
    ] =
        firebase.database.ServerValue.TIMESTAMP;


    // ======================================================
    // SEND TO FIREBASE
    // ======================================================

    database
        .ref()
        .update(updates)

        .then(function () {

            console.log(
                "✅ DATA SUCCESSFULLY SAVED"
            );


            showManualMessage(
                "✅ Data saved successfully to Firebase!",
                "success"
            );


            // ------------------------------------------------
            // UPDATE DASHBOARD IMMEDIATELY
            // ------------------------------------------------

            updateDashboard(manualData);


            // ------------------------------------------------
            // CLEAR INPUTS
            // ------------------------------------------------

            temperatureInput.value = "";

            humidityInput.value = "";

            motionInput.value = "false";


        })

        .catch(function (error) {

            console.error(
                "❌ Firebase Save Error:",
                error
            );


            showManualMessage(
                "❌ Failed to save: " +
                error.message,
                "error"
            );

        })

        .finally(function () {

            // ------------------------------------------------
            // RESTORE BUTTON
            // ------------------------------------------------

            if (saveButton) {

                saveButton.disabled = false;

                saveButton.innerHTML =
                    "💾 SAVE DATA";

            }

        });

}    };


    database
        .ref("SmartStorage/loginActivity")
        .push(activity)

        .then(() => {

            return auth.signOut();

        })

        .then(() => {

            window.location.href =
                "index.html";

        })

        .catch((error) => {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Logout failed:\n" +
                error.message
            );

        });

}


window.logout = logout;


// ==========================================================
// FIREBASE CONNECTION
// ==========================================================

const connectedRef =
    database.ref(".info/connected");


connectedRef.on(
    "value",
    (snapshot) => {

        const status =
            getElement("firebaseStatus");


        if (!status) return;


        if (snapshot.val() === true) {

            status.textContent =
                "● Connected";

            status.classList.remove(
                "firebase-error"
            );

            status.classList.add(
                "firebase-connected"
            );

        }

        else {

            status.textContent =
                "● Offline";

            status.classList.remove(
                "firebase-connected"
            );

            status.classList.add(
                "firebase-error"
            );

        }

    }
);


// ==========================================================
// CHART
// ==========================================================

const chartCanvas =
    getElement("environmentChart");


if (chartCanvas && typeof Chart !== "undefined") {

    const ctx =
        chartCanvas.getContext("2d");


    environmentChart =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Temperature (°C)",

                            data:
                                temperatureData,

                            borderWidth: 2,

                            tension: 0.3,

                            fill: false

                        },

                        {

                            label:
                                "Humidity (%)",

                            data:
                                humidityData,

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


// ==========================================================
// LOAD DASHBOARD DATA
// ==========================================================

database
    .ref("SmartStorage/current")
    .on(
        "value",
        (snapshot) => {

            if (!snapshot.exists()) {

                console.log(
                    "No current data."
                );

                return;

            }


            const data =
                snapshot.val();


            displayDashboard(data);

        },

        (error) => {

            console.error(
                "Dashboard Firebase error:",
                error
            );

        }
    );


// ==========================================================
// DISPLAY DASHBOARD
// ==========================================================

function displayDashboard(data) {

    if (!data) return;


    const temperature =
        data.temperature;


    const humidity =
        data.humidity;


    // Temperature

    if (
        temperature !== undefined &&
        temperature !== null
    ) {

        setText(
            "temperature",
            temperature + " °C"
        );

    }


    // Humidity

    if (
        humidity !== undefined &&
        humidity !== null
    ) {

        setText(
            "humidity",
            humidity + " %"
        );

    }


    // Motion

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


    setText(
        "motion",
        motion
    );


    // Status

    setText(
        "storageStatus",
        data.status ?? "NORMAL"
    );


    // Last update

    setText(
        "lastUpdate",
        "Last Update: " +
        (
            data.lastUpdate ??
            data.timestamp ??
            "Unknown"
        )
    );


    // Source

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


    // Switches

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


    // Chart

    if (
        environmentChart &&
        temperature !== undefined &&
        humidity !== undefined
    ) {

        labels.push(
            new Date()
                .toLocaleTimeString()
        );


        temperatureData.push(
            Number(temperature)
        );


        humidityData.push(
            Number(humidity)
        );


        if (labels.length > 15) {

            labels.shift();

            temperatureData.shift();

            humidityData.shift();

        }


        environmentChart.update();

    }

}


// ==========================================================
// MANUAL DATA SAVE
// ==========================================================

function saveManualData() {

    const temperatureInput =
        getElement(
            "manualTemperature"
        );


    const humidityInput =
        getElement(
            "manualHumidity"
        );


    const motionInput =
        getElement(
            "manualMotion"
        );


    if (
        !temperatureInput ||
        !humidityInput ||
        !motionInput
    ) {

        alert(
            "Manual input fields are missing from dashboard.html."
        );

        return;

    }


    const temperature =
        Number(
            temperatureInput.value
        );


    const humidity =
        Number(
            humidityInput.value
        );


    const motion =
        motionInput.value === "true";


    // ======================================================
    // VALIDATION
    // ======================================================

    if (
        temperatureInput.value === "" ||
        isNaN(temperature)
    ) {

        showMessage(
            "❌ Please enter a valid temperature.",
            "error"
        );

        return;

    }


    if (
        humidityInput.value === "" ||
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


    // ======================================================
    // STATUS
    // ======================================================

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


    // ======================================================
    // DATA
    // ======================================================

    const now =
        new Date();


    const readableTime =
        now.toLocaleString();


    const data = {

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
            firebase.database.ServerValue.TIMESTAMP

    };


    console.log(
        "Saving manual data:",
        data
    );


    // ======================================================
    // SAVE CURRENT
    // ======================================================

    database
        .ref("SmartStorage/current")
        .set(data)

        .then(() => {

            console.log(
                "Current data saved."
            );


            // ==================================================
            // SAVE MAIN DASHBOARD DATA
            // ==================================================

            return database
                .ref("SmartStorage")
                .update(data);

        })


        .then(() => {

            console.log(
                "Main SmartStorage updated."
            );


            // ==================================================
            // SAVE HISTORY
            // ==================================================

            return database
                .ref("SmartStorage/history")
                .push({

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

                });

        })


        .then(() => {

            console.log(
                "History saved."
            );


            displayDashboard(data);


            showMessage(
                "✓ Data saved successfully to Firebase!",
                "success"
            );


            // Clear inputs

            temperatureInput.value =
                "";

            humidityInput.value =
                "";

            motionInput.value =
                "false";

        })


        .catch((error) => {

            console.error(
                "SAVE ERROR:",
                error
            );


            showMessage(
                "❌ Firebase Error: " +
                error.message,
                "error"
            );

        });

}


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
        getElement(
            "manualMessage"
        );


    if (!message) {

        alert(text);

        return;

    }


    message.textContent =
        text;


    message.style.color =
        type === "success"
            ? "#28a745"
            : "#dc3545";


    setTimeout(
        () => {

            message.textContent =
                "";

        },
        5000
    );

}


// ==========================================================
// SWITCH CONTROL
// ==========================================================

function updateDeviceSwitch(
    device,
    state
) {

    const switchState =
        Boolean(state);


    console.log(
        "Switch:",
        device,
        switchState
    );


    const
