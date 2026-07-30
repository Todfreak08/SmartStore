// ----------------------------
// Authentication
// ----------------------------

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

    }

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
// Alerts
// ----------------------------

const container = document.getElementById("alertsContainer");

database.ref("Alerts").on("value", (snapshot) => {

    container.innerHTML = "";

    if (!snapshot.exists()) {

        container.innerHTML = `

        <div class="alert-box alert-normal">

            <h3>No Alerts</h3>

            <p>Waiting for ESP32 to send alerts...</p>

        </div>

        `;

        return;

    }

    const alerts = [];

    snapshot.forEach((child) => {

        alerts.push(child.val());

    });

    alerts.reverse();

    alerts.forEach((alert) => {

        let css = "alert-normal";

        if (alert.level === "Warning") {

            css = "alert-warning";

        }

        if (alert.level === "Danger") {

            css = "alert-danger";

        }

        container.innerHTML += `

        <div class="alert-box ${css}">

            <h3>${alert.level || "Alert"}</h3>

            <p>${alert.message || "No message"}</p>

            <small>${alert.timestamp || "--"}</small>

        </div>

        `;

    });

});