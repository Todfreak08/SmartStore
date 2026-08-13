// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS - STABLE VERSION
// Firebase Realtime Database
// ==========================================================


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let currentUser = null;

let environmentChart = null;

const labels = [];
const temperatureData = [];
const humidityData = [];


// ==========================================================
// HELPER
// ==========================================================

function getElement(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element = getElement(id);

    if (element) {

        element.textContent = value;

    }

}


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }


    currentUser = user;


    setText(
        "userEmail",
        user.email
    );


    console.log(
        "Authenticated:",
        user.email
    );

});


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    if (!currentUser) {

        window.location.href = "index.html";

        return;

    }


    const activity = {

        action: "LOGOUT",

        email:
            currentUser.email,

        uid:
            currentUser.uid,

        timestamp:
            new Date().toLocaleString(),

        createdAt:
            firebase.database.ServerValue.TIMESTAMP,

        userAgent:
            navigator.userAgent

    };


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
