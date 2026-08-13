// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE UPDATED DASHBOARD.JS
// Firebase Realtime Database
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }


    const userEmail =
        document.getElementById("userEmail");


    if (userEmail) {

        userEmail.innerHTML =
            user.email;

    }

});


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    auth.signOut()

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
                "Logout failed: " +
                error.message
            );

        });

}


// ==========================================================
// FIREBASE CONNECTION STATUS
// ==========================================================

const firebaseStatus =
    document.getElementById(
        "firebaseStatus"
    );


function firebaseConnected() {

    if (!firebaseStatus) return;

    firebaseStatus.innerHTML =
        "● Connected";

    firebaseStatus.classList.remove(
        "firebase-error"
    );

    firebaseStatus.classList.add(
        "firebase-connected"
    );

}


function firebaseError() {

    if (!firebaseStatus) return;

    firebaseStatus.innerHTML =
        "● Connection Error";

    firebaseStatus.classList.remove(
        "firebase-connected"
    );

    firebaseStatus.classList.add(
        "firebase-error"
    );

}


// ==========================================================
// HELPER
// ==========================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.innerHTML =
            value;

    }

}


// ==========================================================
// CHART DATA
// ==========================================================

const labels = [];

const temperatureData = [];

const humidityData = [];

let environmentChart = null;


const chartCanvas =
    document.getElementById(
        "environmentChart"
    );


if (chartCanvas) {

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

                    },

                    scales: {

                        y: {

                            beginAtZero: false

                        }

                    }

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
        data.temperature !== undefined &&
        data.temperature !== null
            ? Number(data.temperature)
            : null;


    // ------------------------------------------------------
    // HUMIDITY
    // ------------------------------------------------------

    const humidity =
        data.humidity !== undefined &&
        data.humidity !== null
            ? Number(data.humidity)
            : null;


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
    // STATUS
    // ------------------------------------------------------

    const status =
        data.status ??
        "NORMAL";


    // ------------------------------------------------------
    // LAST UPDATE
    // ------------------------------------------------------

    const lastUpdate =
        data.lastUpdate ??
        data.updatedAt ??
        "Unknown";


    // ------------------------------------------------------
    // DISPLAY
    // ------------------------------------------------------

    setText(
        "temperature",

        temperature !== null &&
        !isNaN(temperature)

            ? temperature + " °C"

            : "-- °C"
    );


    setText(
        "humidity",

        humidity !== null &&
        !isNaN(humidity)

            ? humidity + " %"

            : "-- %"
    );


    setText(
        "motion",
        motion
    );


    setText(
        "storageStatus",
        status
    );


    setText(
        "lastUpdate",

        "Last Update: " +
        lastUpdate
    );


    // ------------------------------------------------------
    // DATA SOURCE
    // ------------------------------------------------------

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

    if (

        environmentChart &&

        temperature !== null &&

        humidity !== null &&

        !isNaN(temperature) &&

        !isNaN(humidity)

    ) {

        labels.push(
            new Date()
                .toLocaleTimeString()
        );


        temperatureData.push(
            temperature
        );


        humidityData.push(
            humidity
        );


        // Keep last 15 records

        if (labels.length > 15) {

            labels.shift();

            temperatureData.shift();

            humidityData.shift();

        }


        environmentChart.update();

    }

}


// ==========================================================
// FIREBASE MAIN DATA LISTENER
// ==========================================================

database
    .ref("SmartStorage")
    .on(

        "value",

        (snapshot) => {

            firebaseConnected();


            if (!snapshot.exists()) {

                updateDashboard(
                    null
                );

                return;

            }


            const data =
                snapshot.val();


            // ------------------------------------------------
            // SUPPORT CURRENT STRUCTURE
            // ------------------------------------------------

            let dashboardData =
                data;


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


        (error) => {

            console.error(
                "Firebase listener error:",
                error
            );

            firebaseError();

        }

    );


// ==========================================================
// MANUAL DATA ENTRY
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


    const message =
        document.getElementById(
            "manualMessage"
        );


    // ------------------------------------------------------
    // CHECK FORM
    // ------------------------------------------------------

    if (

        !temperatureInput ||

        !humidityInput ||

        !motionInput

    ) {

        console.error(
            "Manual form elements not found."
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
        motionInput.value ===
        "true";


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (isNaN(temperature)) {

        showManualMessage(
            "❌ Please enter a temperature.",
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
    // TIME
    // ------------------------------------------------------

    const now =
        new Date();


    const timestamp =
        now.toLocaleString();


    // ------------------------------------------------------
    // AUTOMATIC STATUS
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
    // DATA
    // ------------------------------------------------------

    const manualData = {

        temperature:
            temperature,

        humidity:
            humidity,

        motion:
            motion,

        status:
            status,

        lastUpdate:
            timestamp,

        source:
            "Manual Entry",

        updatedAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    console.log(
        "Saving manual data:",
        manualData
    );


    // ------------------------------------------------------
    // SAVE CURRENT DATA
    // ------------------------------------------------------

    database
        .ref("SmartStorage")
        .update(manualData)

        .then(() => {

            console.log(
                "Main SmartStorage updated."
            );


            // ----------------------------------------------
            // SAVE CURRENT COPY
            // ----------------------------------------------

            return database
                .ref(
                    "SmartStorage/current"
                )
                .set(manualData);

        })


        .then(() => {

            console.log(
                "Current data updated."
            );


            // ----------------------------------------------
            // SAVE HISTORY
            // ----------------------------------------------

            return database
                .ref(
                    "SmartStorage/history"
                )
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
                        timestamp,

                    createdAt:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP

                });

        })


        .then(() => {

            console.log(
                "History successfully saved."
            );


            // ----------------------------------------------
            // UPDATE DASHBOARD
            // ----------------------------------------------

            updateDashboard(
                manualData
            );


            // ----------------------------------------------
            // SUCCESS MESSAGE
            // ----------------------------------------------

            showManualMessage(
                "✓ Data successfully saved to Firebase!",
                "success"
            );


            // ----------------------------------------------
            // CLEAR FORM
            // ----------------------------------------------

            temperatureInput.value =
                "";

            humidityInput.value =
                "";

            motionInput.value =
                "false";


        })


        .catch((error) => {

            console.error(
                "Firebase save error:",
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
    text,
    type
) {

    const message =
        document.getElementById(
            "manualMessage"
        );


    if (!message) return;


    message.innerHTML =
        text;


    if (type === "success") {

        message.style.color =
            "#28a745";

    }

    else {

        message.style.color =
            "#dc3545";

    }


    setTimeout(() => {

        message.innerHTML =
            "";

    }, 5000);

}


// ==========================================================
// DEVICE SWITCH CONTROL
// ==========================================================

function updateDeviceSwitch(
    device,
    state
) {

    if (!device) {

        return;

    }


    const switchState =
        Boolean(state);


    const timestamp =
        new Date()
            .toLocaleString();


    // ------------------------------------------------------
    // DATA
    // ------------------------------------------------------

    const switchData = {};


    switchData[device] =
        switchState;


    switchData.lastUpdate =
        timestamp;


    switchData.source =
        "Manual Control";


    switchData.updatedAt =
        firebase.database
            .ServerValue
            .TIMESTAMP;


    console.log(
        "Updating switch:",
        device,
        switchState
    );


    // ------------------------------------------------------
    // SAVE TO SMART STORAGE
    // ------------------------------------------------------

    database
        .ref("SmartStorage")
        .update(switchData)

        .then(() => {

            console.log(
                device +
                " saved to SmartStorage."
            );


            // ----------------------------------------------
            // SAVE CURRENT COPY
            // ----------------------------------------------

            return database
                .ref(
                    "SmartStorage/current"
                )
                .update(switchData);

        })


        .then(() => {

            // ----------------------------------------------
            // SAVE HISTORY
            // ----------------------------------------------

            return database
                .ref(
                    "SmartStorage/history"
                )
                .push({

                    device:
                        device,

                    state:
                        switchState,

                    source:
                        "Manual Control",

                    timestamp:
                        timestamp,

                    createdAt:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP

                });

        })


        .then(() => {

            console.log(
                "Switch saved successfully:",
                device,
                switchState
            );


            // ----------------------------------------------
            // UPDATE STATUS TEXT
            // ----------------------------------------------

            updateSwitchStatusText(
                device,
                switchState
            );

        })


        .catch((error) => {

            console.error(
                "Switch Firebase error:",
                error
            );


            alert(
                "Unable to save " +
                device +
                " switch.\n\n" +
                error.message
            );


            // ----------------------------------------------
            // REVERT SWITCH
            // ----------------------------------------------

            const switchElement =
                document.getElementById(
                    device +
                    "Switch"
                );


            if (switchElement) {

                switchElement.checked =
                    !switchState;

            }

        });

}


// ==========================================================
// UPDATE SWITCH TEXT
// ==========================================================

function updateSwitchStatusText(
    device,
    state
) {

    let elementId;


    switch (device) {

        case "light":

            elementId =
                "lightStatus";

            break;


        case "fan":

            elementId =
                "fanStatus";

            break;


        case "door":

            elementId =
                "doorStatus";

            break;


        case "alarm":

            elementId =
                "alarmStatus";

            break;


        default:

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

        element.innerHTML =
            state
                ? "OPEN"
                : "CLOSED";

    }

    else {

        element.innerHTML =
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
// LOAD SWITCH STATES
// ==========================================================

function loadSwitches(
    data
) {

    if (!data) {

        return;

    }


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


    const switchElement =
        document.getElementById(
            device +
            "Switch"
        );


    if (!switchElement) {

        return;

    }


    switchElement.checked =
        Boolean(state);


    updateSwitchStatusText(
        device,
        Boolean(state)
    );

}


// ==========================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================================

window.logout =
    logout;


window.saveManualData =
    saveManualData;


window.updateDeviceSwitch =
    updateDeviceSwitch;
