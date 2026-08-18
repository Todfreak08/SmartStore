// ==========================================
// AUTHENTICATION
// ==========================================

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

    }

});


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    auth.signOut().then(() => {

        window.location.href = "index.html";

    });

}


// ==========================================
// ALERTS
// ==========================================

const container =
    document.getElementById("alertsContainer");


database.ref("Alerts").on("value", (snapshot) => {

    console.log("ALERTS:", snapshot.val());


    container.innerHTML = "";


    // No alerts

    if (!snapshot.exists()) {

        container.innerHTML = `

            <div class="alert-box alert-normal">

                <h3>🟢 No Alerts</h3>

                <p>
                    No alerts from the ESP32.
                </p>

            </div>

        `;

        return;

    }


    const alerts = [];


    snapshot.forEach((child) => {

        const alert = child.val();

        alerts.push(alert);

    });


    // Newest first

    alerts.reverse();


    alerts.forEach((alert) => {

        let alertClass = "alert-normal";

        let icon = "ℹ️";


        if (alert.level === "Warning") {

            alertClass = "alert-warning";

            icon = "⚠️";

        }


        if (alert.level === "Danger") {

            alertClass = "alert-danger";

            icon = "🚨";

        }


        container.innerHTML += `

            <div class="alert-box ${alertClass}">

                <h3>
                    ${icon} ${alert.level || "Alert"}
                </h3>

                <p>
                    ${alert.message || "No message"}
                </p>

                <small>
                    ${alert.timestamp || "No timestamp"}
                </small>

            </div>

        `;

    });

});
