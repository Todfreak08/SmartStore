// ============================================
// SMART STORAGE MONITORING SYSTEM
// dashboard.js
// ============================================

// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    // Show user email
    const email = document.getElementById("userEmail");

    if (email) {
        email.innerHTML = user.email;
    }

    loadStorageData();

});

// Logout
function logout() {

    firebase.auth().signOut()
        .then(function () {

            alert("Logged out successfully!");

            window.location.href = "index.html";

        })
        .catch(function(error){

            alert(error.message);

        });

}

// Arrays for chart history
let temperatureHistory = [];
let humidityHistory = [];
let labels = [];

// Create Chart
const ctx = document.getElementById("environmentChart").getContext("2d");

const environmentChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [

            {

                label: "Temperature (°C)",

                data: temperatureHistory,

                borderWidth: 2,

                tension: .4

            },

            {

                label: "Humidity (%)",

                data: humidityHistory,

                borderWidth: 2,

                tension: .4

            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false

    }

});

// Read Firebase Realtime Database
function loadStorageData() {

    firebase.database().ref("storage").on("value", function (snapshot) {

        const data = snapshot.val();

        if (!data) return;

        // Temperature
        document.getElementById("temperature").innerHTML =
            data.temperature + " °C";

        // Humidity
        document.getElementById("humidity").innerHTML =
            data.humidity + " %";

        // Motion
        document.getElementById("motion").innerHTML =
            data.motion;

        // Storage Status
       document.getElementById("storageStatus").innerHTML = data.status;
        document.getElementById("systemStatus").innerHTML = data.status;

        // Alert
        document.getElementById("alertMessage").innerHTML =
            data.alert;

        // Last Update
        document.getElementById("lastUpdate").innerHTML =
            new Date().toLocaleTimeString();

        // Store history (keep only last 10 readings)

        labels.push(new Date().toLocaleTimeString());

        temperatureHistory.push(data.temperature);

        humidityHistory.push(data.humidity);

        if (labels.length > 10) {

            labels.shift();

            temperatureHistory.shift();

            humidityHistory.shift();

        }

        environmentChart.update();

    });

}
