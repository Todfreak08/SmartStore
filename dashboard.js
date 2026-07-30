// ----------------------------
// Authentication
// ----------------------------

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    document.getElementById("userEmail").innerHTML = user.email;

});

// ----------------------------
// Logout
// ----------------------------

function logout() {

    auth.signOut().then(() => {

        window.location.href = "index.html";

    });

}

// ----------------------------
// Chart
// ----------------------------

const labels = [];
const temperatureData = [];
const humidityData = [];

const ctx = document
.getElementById("environmentChart")
.getContext("2d");

const environmentChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [

            {

                label: "Temperature (°C)",

                data: temperatureData,

                borderWidth: 2,

                tension: .3

            },

            {

                label: "Humidity (%)",

                data: humidityData,

                borderWidth: 2,

                tension: .3

            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: true

    }

});

// ----------------------------
// Firebase Listener
// ----------------------------

database.ref("SmartStorage").on("value", (snapshot) => {

    if (!snapshot.exists()) {

        document.getElementById("temperature").innerHTML = "-- °C";

        document.getElementById("humidity").innerHTML = "-- %";

        document.getElementById("motion").innerHTML = "Waiting...";

        document.getElementById("storageStatus").innerHTML =
            "Waiting for ESP32...";

        document.getElementById("lastUpdate").innerHTML =
            "No data received yet.";

        return;

    }

    const data = snapshot.val();

    const temperature = data.temperature ?? "--";

    const humidity = data.humidity ?? "--";

    const motion = data.motion ?? "Waiting...";

    const status = data.status ?? "Normal";

    const lastUpdate = data.lastUpdate ?? "Unknown";

    document.getElementById("temperature").innerHTML =
        temperature + " °C";

    document.getElementById("humidity").innerHTML =
        humidity + " %";

    document.getElementById("motion").innerHTML =
        motion;

    document.getElementById("storageStatus").innerHTML =
        status;

    document.getElementById("lastUpdate").innerHTML =
        "Last Update: " + lastUpdate;

    labels.push(new Date().toLocaleTimeString());

    temperatureData.push(temperature);

    humidityData.push(humidity);

    if (labels.length > 15) {

        labels.shift();

        temperatureData.shift();

        humidityData.shift();

    }

    environmentChart.update();

});
