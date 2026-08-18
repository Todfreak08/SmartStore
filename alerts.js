// =====================================================
// SMART STORAGE ALERTS
// ESP32 → Firebase → Website
// =====================================================



// =====================================================
// LOGIN
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

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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

                });

        }
    );

}



// =====================================================
// FIREBASE STATUS
// =====================================================

const firebaseStatus =
    document.getElementById(
        "firebaseStatus"
    );



// =====================================================
// CURRENT ESP32 DATA
// =====================================================
//
// ESP32 writes:
//
// smartStorage/sensorData
//
// =====================================================

database
    .ref("smartStorage/sensorData")
    .on(

        "value",

        function(snapshot) {

            console.log(
                "ESP32 SENSOR DATA:",
                snapshot.val()
            );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Connected";

                firebaseStatus.style.color =
                    "#28a745";

            }


            if (!snapshot.exists()) {

                showNoSensorData();

                return;

            }


            const data =
                snapshot.val();


            updateCurrentAlert(
                data
            );

        },


        function(error) {

            console.error(
                "Firebase sensor error:",
                error
            );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Error";

                firebaseStatus.style.color =
                    "#dc3545";

            }

        }

    );



// =====================================================
// UPDATE CURRENT ALERT
// =====================================================

function updateCurrentAlert(data) {


    // =================================================
    // TEMPERATURE
    // =================================================

    const temperature =
        data.temperature;


    const temperatureElement =
        document.getElementById(
            "alertTemperature"
        );


    if (temperatureElement) {

        temperatureElement.textContent =
            temperature !== undefined
                ? Number(
                    temperature
                ).toFixed(1) + " °C"
                : "-- °C";

    }



    // =================================================
    // HUMIDITY
    // =================================================

    const humidity =
        data.humidity;


    const humidityElement =
        document.getElementById(
            "alertHumidity"
        );


    if (humidityElement) {

        humidityElement.textContent =
            humidity !== undefined
                ? Number(
                    humidity
                ).toFixed(1) + " %"
                : "-- %";

    }



    // =================================================
    // MOTION
    // =================================================

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

    else {

        motion =
            "Unknown";

    }


    const motionElement =
        document.getElementById(
            "alertMotion"
        );


    if (motionElement) {

        motionElement.textContent =
            motion;

    }



    // =================================================
    // STATUS
    // =================================================

    const status =
        String(
            data.status ||
            "NORMAL"
        ).toUpperCase();


    const statusElement =
        document.getElementById(
            "alertStatus"
        );


    if (statusElement) {

        statusElement.textContent =
            status;


        statusElement.classList.remove(
            "normal",
            "warning",
            "danger"
        );


        if (status === "DANGER") {

            statusElement.classList.add(
                "danger"
            );

        }

        else if (status === "WARNING") {

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



    // =================================================
    // TIMESTAMP
    // =================================================

    const timestamp =
        data.timestamp ||
        "No timestamp";


    const timestampElement =
        document.getElementById(
            "alertTimestamp"
        );


    if (timestampElement) {

        timestampElement.textContent =
            "Last ESP32 Update: " +
            timestamp;

    }



    // =================================================
    // CREATE ALERT
    // =================================================

    createCurrentAlert(
        data,
        status,
        motion
    );

}



// =====================================================
// CREATE CURRENT ALERT
// =====================================================

function createCurrentAlert(
    data,
    status,
    motion
) {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    const message =
        document.getElementById(
            "alertsMessage"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    let hasAlert = false;



    // =================================================
    // DANGER
    // =================================================

    if (status === "DANGER") {

        addAlert(
            container,
            "🔴",
            "Danger",
            "The storage environment requires immediate attention.",
            data.timestamp
        );

        hasAlert = true;

    }



    // =================================================
    // WARNING
    // =================================================

    else if (status === "WARNING") {

        addAlert(
            container,
            "🟠",
            "Warning",
            "The storage environment is outside the normal range.",
            data.timestamp
        );

        hasAlert = true;

    }



    // =================================================
    // MOTION
    // =================================================

    if (
        data.motion === true
    ) {

        addAlert(
            container,
            "🚶",
            "Motion Detected",
            "The ESP32 detected motion.",
            data.timestamp
        );

        hasAlert = true;

    }



    // =================================================
    // NORMAL
    // =================================================

    if (!hasAlert) {

        addAlert(
            container,
            "🟢",
            "Normal",
            "No active alerts detected.",
            data.timestamp
        );

    }


    if (message) {

        message.style.display =
            "none";

    }

}



// =====================================================
// ADD ALERT CARD
// =====================================================

function addAlert(
    container,
    icon,
    title,
    description,
    timestamp
) {

    const alert =
        document.createElement(
            "div"
        );


    alert.style.padding =
        "18px";


    alert.style.marginBottom =
        "12px";


    alert.style.borderRadius =
        "10px";


    alert.style.background =
        "#f8f9fa";


    alert.style.border =
        "1px solid #ddd";


    alert.innerHTML = `

        <h3>
            ${icon}
            ${escapeHTML(title)}
        </h3>

        <p>
            ${escapeHTML(description)}
        </p>

        <small>
            ESP32 Timestamp:
            ${escapeHTML(timestamp || "-")}
        </small>

    `;


    container.appendChild(
        alert
    );

}



// =====================================================
// NO DATA
// =====================================================

function showNoSensorData() {

    const temperature =
        document.getElementById(
            "alertTemperature"
        );


    const humidity =
        document.getElementById(
            "alertHumidity"
        );


    const motion =
        document.getElementById(
            "alertMotion"
        );


    const status =
        document.getElementById(
            "alertStatus"
        );


    const timestamp =
        document.getElementById(
            "alertTimestamp"
        );


    if (temperature) {

        temperature.textContent =
            "-- °C";

    }


    if (humidity) {

        humidity.textContent =
            "-- %";

    }


    if (motion) {

        motion.textContent =
            "Waiting...";

    }


    if (status) {

        status.textContent =
            "Waiting for ESP32...";

    }


    if (timestamp) {

        timestamp.textContent =
            "No data received yet.";

    }

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}
