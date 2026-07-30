// Protect the dashboard
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userEmail").textContent = user.email;
});

// Reference to SmartStorage in Firebase
const storageRef = database.ref("SmartStorage");

// Read data in real time
storageRef.on("value", (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    document.getElementById("temperature").textContent =
        data.temperature + " °C";

    document.getElementById("humidity").textContent =
        data.humidity + " %";

    document.getElementById("motion").textContent =
        data.motion;

    // Storage Status
    document.getElementById("storageStatus").textContent =
        data.status;

    // System Status
    document.getElementById("systemStatus").textContent =
        "Online";

    // Alert Message
    document.getElementById("alertMessage").textContent =
        data.alert || "No alerts";

    // Last Update
    document.getElementById("lastUpdate").textContent =
        data.lastUpdate || "N/A";

});

// Logout
function logout() {

    auth.signOut()
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });

}

// Chart
const ctx = document.getElementById("environmentChart").getContext("2d");

new Chart(ctx, {

    type: "line",

    data: {

        labels: ["1", "2", "3", "4", "5"],

        datasets: [

            {
                label: "Temperature",
                data: [28, 29, 27, 30, 28],
                borderColor: "#00ff99",
                fill: false
            },

            {
                label: "Humidity",
                data: [60, 64, 62, 66, 65],
                borderColor: "#00bfff",
                fill: false
            }

        ]

    },

    options: {
        responsive: true,
        maintainAspectRatio: false
    }

});
