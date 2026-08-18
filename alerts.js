// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// ALERTS.JS
//
// WEBSITE = DISPLAY ONLY
// ESP32   = DEVICE
// FIREBASE = REAL-TIME DATABASE
//
// NO DHT11
// NO HUMIDITY SENSOR
// NO SD CARD
// ==========================================================



// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

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



// ==========================================================
// LOGOUT
// ==========================================================

function initializeLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            button.disabled =
                true;


            button.textContent =
                "Logging out...";


            auth.signOut()

                .then(function () {

                    window.location.href =
                        "index.html";

                })

                .catch(function (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    button.disabled =
                        false;


                    button.textContent =
                        "🚪 Logout";


                    alert(
                        "Logout failed: " +
                        error.message
                    );

                });

        }
    );

}



// ==========================================================
// FIREBASE CONNECTION STATUS
// ==========================================================

function initializeFirebaseStatus() {

    const status =
        document.getElementById(
            "firebaseStatus"
        );


    database
        .ref(".info/connected")
        .on(
            "value",
            function (snapshot) {

                if (!status) {

                    return;

                }


                if (
                    snapshot.val() === true
                ) {

                    status.textContent =
                        "● Firebase Connected";

                    status.style.color =
                        "#28a745";

                }

                else {

                    status.textContent =
                        "● Firebase Disconnected";

                    status.style.color =
                        "#dc3545";

                }

            }
        );

}



// ==========================================================
// ESP32 STATUS
// ==========================================================

function initializeESP32Status() {

    database
        .ref("smartStorage/device")
        .on(
            "value",
            function (snapshot) {

                const status =
                    document.getElementById(
                        "espStatus"
                    );


                const lastSeen =
                    document.getElementById(
                        "espLastSeen"
                    );


                if (!snapshot.exists()) {

                    if (status) {

                        status.textContent =
                            "OFFLINE";

                        status.style.color =
                            "#dc3545";

                    }


                    if (lastSeen) {

                        lastSeen.textContent =
                            "No ESP32 data";

                    }


                    return;

                }


                const data =
                    snapshot.val();


                if (
                    data.online === true
                ) {

                    if (status) {

                        status.textContent =
                            "ONLINE";

                        status.style.color =
                            "#28a745";

                    }

                }

                else {

                    if (status) {

                        status.textContent =
                            "OFFLINE";

                        status.style.color =
                            "#dc3545";

                    }

                }


                if (lastSeen) {

                    lastSeen.textContent =
                        data.timestamp
                            ? "Last seen: " +
                              data.timestamp
                            : "Timestamp unavailable";

                }

            }
        );

}



// ==========================================================
// LOAD ESP32 ALERTS
// ==========================================================

function initializeAlerts() {

    const alertsBody =
        document.getElementById(
            "alertsBody"
        );


    if (!alertsBody) {

        return;

    }


    database
        .ref("smartStorage/alerts")
        .on(
            "value",
            function (snapshot) {

                alertsBody.innerHTML =
                    "";


                let count = 0;


                if (
                    !snapshot.exists()
                ) {

                    alertsBody.innerHTML = `

                        <tr>

                            <td
                                colspan="5"
                                style="
                                    text-align:center;
                                    padding:30px;
                                ">

                                ✅ No alerts from ESP32.

                            </td>

                        </tr>

                    `;


                    updateAlertCount(0);

                    return;

                }


                const alerts = [];


                snapshot.forEach(
                    function (child) {

                        alerts.push({

                            key:
                                child.key,

                            data:
                                child.val()

                        });

                    }
                );


                // Newest first

                alerts.reverse();


                alerts.forEach(
                    function (item) {

                        const data =
                            item.data;


                        count++;


                        const row =
                            document.createElement(
                                "tr"
                            );


                        const date =
                            data.date ||
                            "--";


                        const time =
                            data.time ||
                            "--";


                        const event =
                            data.event ||
                            "Device Event";


                        const source =
                            data.source ||
                            "ESP32";


                        const status =
                            data.status ||
                            "INFO";


                        row.innerHTML = `

                            <td>
                                ${escapeHTML(date)}
                            </td>

                            <td>
                                ${escapeHTML(time)}
                            </td>

                            <td>
                                ${escapeHTML(event)}
                            </td>

                            <td>
                                ${escapeHTML(source)}
                            </td>

                            <td>

                                <span
                                    class="
                                        alert-status
                                        ${getStatusClass(status)}
                                    ">

                                    ${escapeHTML(status)}

                                </span>

                            </td>

                        `;


                        alertsBody.appendChild(
                            row
                        );

                    }
                );


                updateAlertCount(count);


                updateCurrentAlert(
                    alerts.length > 0
                        ? alerts[0].data
                        : null
                );

            },

            function (error) {

                console.error(
                    "Alert listener error:",
                    error
                );


                alertsBody.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            style="
                                text-align:center;
                                color:#dc3545;
                                padding:30px;
                            ">

                            ❌ Firebase Error:
                            ${escapeHTML(
                                error.message
                            )}

                        </td>

                    </tr>

                `;

            }
        );

}



// ==========================================================
// UPDATE ALERT COUNT
// ==========================================================

function updateAlertCount(count) {

    const element =
        document.getElementById(
            "alertCount"
        );


    if (element) {

        element.textContent =
            count;

    }

}



// ==========================================================
// UPDATE CURRENT ALERT
// ==========================================================

function updateCurrentAlert(data) {

    const title =
        document.getElementById(
            "alertTitle"
        );


    const description =
        document.getElementById(
            "alertDescription"
        );


    const container =
        document.getElementById(
            "currentAlert"
        );


    if (!data) {

        if (title) {

            title.textContent =
                "No Current Alerts";

        }


        if (description) {

            description.textContent =
                "The ESP32 has not reported any alerts.";

        }


        if (container) {

            container.style.borderLeft =
                "5px solid #28a745";

        }


        return;

    }


    const event =
        data.event ||
        "Device Event";


    const status =
        data.status ||
        "INFO";


    if (title) {

        title.textContent =
            event;

    }


    if (description) {

        description.textContent =
            "Status: " +
            status +
            " • " +
            (
                data.timestamp ||
                "Time unavailable"
            );

    }


    if (container) {

        if (
            status === "DANGER"
        ) {

            container.style.borderLeft =
                "5px solid #dc3545";

        }

        else if (
            status === "WARNING"
        ) {

            container.style.borderLeft =
                "5px solid #ffc107";

        }

        else {

            container.style.borderLeft =
                "5px solid #28a745";

        }

    }

}



// ==========================================================
// STATUS CLASS
// ==========================================================

function getStatusClass(status) {

    if (!status) {

        return "info";

    }


    status =
        String(status)
            .toUpperCase();


    if (
        status === "DANGER"
    ) {

        return "danger";

    }


    if (
        status === "WARNING"
    ) {

        return "warning";

    }


    if (
        status === "ONLINE" ||
        status === "NORMAL" ||
        status === "SUCCESS"
    ) {

        return "normal";

    }


    return "info";

}



// ==========================================================
// CLEAR DISPLAY
//
// This does NOT delete Firebase data.
// It only reloads the alerts from Firebase.
// ==========================================================

function initializeClearButton() {

    const button =
        document.getElementById(
            "clearAlertsButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            const body =
                document.getElementById(
                    "alertsBody"
                );


            if (!body) {

                return;

            }


            body.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                        ">

                        Display cleared.
                        Waiting for new ESP32 alerts...

                    </td>

                </tr>

            `;

        }
    );

}



// ==========================================================
// HTML SECURITY
// ==========================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// ==========================================================
// START ALERTS PAGE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLogout();

        initializeFirebaseStatus();

        initializeESP32Status();

        initializeAlerts();

        initializeClearButton();

    }
);
