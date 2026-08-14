// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
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
        "Firebase is not loaded correctly.\n\n" +
        "Please check firebase-config.js."
    );

    throw new Error("Firebase not initialized.");

}


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function(user) {

    if (!user) {

        window.location.href = "index.html";

        return;

    }


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

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

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

                    alert(
                        "Logout failed:\n" +
                        error.message
                    );

                });

        }
    );

}


// ==========================================================
// FIREBASE CONNECTION
// ==========================================================

const connectionElement =
    document.getElementById(
        "firebaseConnection"
    );


database
    .ref(".info/connected")
    .on("value", function(snapshot) {

        if (snapshot.val() === true) {

            if (connectionElement) {

                connectionElement.textContent =
                    "● Connected";

                connectionElement.style.color =
                    "#28a745";

            }

        }

        else {

            if (connectionElement) {

                connectionElement.textContent =
                    "● Disconnected";

                connectionElement.style.color =
                    "#dc3545";

            }

        }

    });


// ==========================================================
// HELPER
// ==========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


// ==========================================================
// DASHBOARD LISTENER
// ==========================================================

database
    .ref("SmartStorage")
    .on(
        "value",
        function(snapshot) {

            if (!snapshot.exists()) {

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


            const data =
                snapshot.val();


            setText(
                "temperature",
                data.temperature !== undefined
                    ? data.temperature + " °C"
                    : "-- °C"
            );


            setText(
                "humidity",
                data.humidity !== undefined
                    ? data.humidity + " %"
                    : "-- %"
            );


            let motion =
                data.motion;


            if (motion === true) {

                motion = "Detected";

            }

            else if (motion === false) {

                motion = "No Motion";

            }

            else {

                motion = "Waiting...";

            }


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


            loadSwitch(
                "light",
                data.light
            );


            loadSwitch(
                "fan",
                data.fan
            );


            loadSwitch(
                "door",
                data.door
            );


            loadSwitch(
                "alarm",
                data.alarm
            );

        },

        function(error) {

            console.error(
                "Dashboard Firebase error:",
                error
            );

        }
    );


// ==========================================================
// SAVE MANUAL DATA
// ==========================================================

function saveManualData() {

    const temperatureElement =
        document.getElementById(
            "manualTemperature"
        );


    const humidityElement =
        document.getElementById(
            "manualHumidity"
        );


    const motionElement =
        document.getElementById(
            "manualMotion"
        );


    const messageElement =
        document.getElementById(
            "manualMessage"
        );


    // ------------------------------------------------------
    // CHECK ELEMENTS
    // ------------------------------------------------------

    if (
        !temperatureElement ||
        !humidityElement ||
        !motionElement
    ) {

        console.error(
            "Manual input elements are missing."
        );

        return;

    }


    // ------------------------------------------------------
    // GET VALUES
    // ------------------------------------------------------

    const temperature =
        parseFloat(
            temperatureElement.value
        );


    const humidity =
        parseFloat(
            humidityElement.value
        );


    const motion =
        motionElement.value === "true";


    // ------------------------------------------------------
    // VALIDATION
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
    // BUTTON
    // ------------------------------------------------------

    const button =
        document.getElementById(
            "saveDataButton"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "💾 SAVING...";

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
    // CURRENT TIME
    // ------------------------------------------------------

    const now =
        new Date();


    const readableTime =
        now.toLocaleString();


    // ------------------------------------------------------
    // CURRENT DATA
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

        lastUpdate:
            readableTime,

        source:
            "Manual Entry",

        updatedAt:
            firebase.database.ServerValue.TIMESTAMP

    };


    console.log(
        "Saving:",
        currentData
    );


    // ======================================================
    // SAVE CURRENT DATA
    // ======================================================

    database
        .ref("SmartStorage/current")
        .set(currentData)

        .then(function() {

            console.log(
                "Current data saved."
            );


            // ==================================================
            // ALSO UPDATE MAIN SMARTSTORAGE
            // ==================================================

            return database
                .ref("SmartStorage")
                .update(currentData);

        })


        .then(function() {

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


        .then(function() {

            console.log(
                "History record saved."
            );


            showMessage(
                "✅ DATA SAVED SUCCESSFULLY!",
                "success"
            );


            // CLEAR FORM

            temperatureElement.value =
                "";

            humidityElement.value =
                "";

            motionElement.value =
                "false";


            if (button) {

                button.disabled = false;

                button.textContent =
                    "💾 SAVE DATA";

            }

        })


        .catch(function(error) {

            console.error(
                "SAVE ERROR:",
                error
            );


            showMessage(
                "❌ Firebase Error: " +
                error.message,
                "error"
            );


            if (button) {

                button.disabled = false;

                button.textContent =
                    "💾 SAVE DATA";

            }

        });

}


// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "manualMessage"
        );


    if (!element) return;


    element.textContent =
        message;


    if (type === "success") {

        element.style.color =
            "#28a745";

    }

    else {

        element.style.color =
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


    const time =
        new Date()
            .toLocaleString();


    const updateData = {};

    updateData[device] =
        value;

    updateData.lastUpdate =
        time;

    updateData.source =
        "Manual Control";

    updateData.updatedAt =
        firebase.database.ServerValue.TIMESTAMP;


    database
        .ref("SmartStorage")
        .update(updateData)

        .then(function() {

            return database
                .ref(
                    "SmartStorage/current"
                )
                .update(updateData);

        })

        .then(function() {

            return database
                .ref(
                    "SmartStorage/history"
                )
                .push({

                    device:
                        device,

                    state:
                        value,

                    source:
                        "Manual Control",

                    timestamp:
                        time,

                    createdAt:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP

                });

        })

        .then(function() {

            updateSwitchText(
                device,
                value
            );

        })

        .catch(function(error) {

            console.error(
                "Switch error:",
                error
            );

            alert(
                "Unable to save switch:\n" +
                error.message
            );

        });

}


// ==========================================================
// SWITCH TEXT
// ==========================================================

function updateSwitchText(
    device,
    state
) {

    const element =
        document.getElementById(
            device + "Status"
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

}


// ==========================================================
// LOAD SWITCH
// ==========================================================

function loadSwitch(
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
            device + "Switch"
        );


    if (switchElement) {

        switchElement.checked =
            Boolean(state);

    }


    updateSwitchText(
        device,
        Boolean(state)
    );

}


// ==========================================================
// CONNECT SWITCHES
// ==========================================================

function connectSwitch(
    device
) {

    const element =
        document.getElementById(
            device + "Switch"
        );


    if (!element) return;


    element.addEventListener(
        "change",
        function() {

            updateDeviceSwitch(
                device,
                this.checked
            );

        }
    );

}


connectSwitch("light");
connectSwitch("fan");
connectSwitch("door");
connectSwitch("alarm");


// ==========================================================
// CHART
// ==========================================================

const chartElement =
    document.getElementById(
        "environmentChart"
    );


let chart = null;


if (chartElement) {

    chart =
        new Chart(
            chartElement.getContext("2d"),
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

}


// ==========================================================
// UPDATE CHART FROM FIREBASE
// ==========================================================

database
    .ref("SmartStorage/history")
    .limitToLast(15)
    .on("value", function(snapshot) {

        if (!chart) return;


        const labels = [];

        const temperatures = [];

        const humidities = [];


        snapshot.forEach(
            function(child) {

                const data =
                    child.val();


                if (
                    data.temperature !== undefined &&
                    data.humidity !== undefined
                ) {

                    labels.push(
                        data.timestamp || ""
                    );

                    temperatures.push(
                        Number(data.temperature)
                    );

                    humidities.push(
                        Number(data.humidity)
                    );

                }

            }
        );


        chart.data.labels =
            labels;


        chart.data.datasets[0].data =
            temperatures;


        chart.data.datasets[1].data =
            humidities;


        chart.update();

    });


// ==========================================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.saveManualData =
    saveManualData;

window.updateDeviceSwitch =
    updateDeviceSwitch;
