// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE DASHBOARD.JS
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const userEmail =
        document.getElementById("userEmail");

    if (userEmail) {
        userEmail.textContent = user.email;
    }

});


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    auth.signOut()
        .then(function () {

            window.location.href = "index.html";

        })
        .catch(function (error) {

            console.error("Logout error:", error);

            alert("Logout failed: " + error.message);

        });

}

window.logout = logout;


// ==========================================================
// FIREBASE CONNECTION STATUS
// ==========================================================

const firebaseStatus =
    document.getElementById("firebaseStatus");

database.ref(".info/connected")
    .on("value", function (snapshot) {

        if (snapshot.val() === true) {

            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Connected";

                firebaseStatus.style.color =
                    "#28a745";

            }

        } else {

            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Disconnected";

                firebaseStatus.style.color =
                    "#dc3545";

            }

        }

    });


// ==========================================================
// DASHBOARD UPDATE
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
