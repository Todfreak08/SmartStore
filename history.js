// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// HISTORY.JS
// ==========================================================
//
// DATA SOURCE:
//
// ESP32
//    ↓
// Firebase Realtime Database
//    ↓
// smartStorage/history
//    ↓
// Website History Page
//
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href = "index.html";

        return;
    }


    console.log(
        "History page logged in:",
        user.email
    );

});


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

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

            alert(
                "Logout failed: " +
                error.message
            );

        });

}


// ==========================================================
// LOGOUT BUTTON
// ==========================================================

function initializeLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {

        console.warn(
            "Logout button not found."
        );

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
// FIREBASE HISTORY LISTENER
// ==========================================================
//
// EXACT PATH:
//
// smartStorage/history
//
// ==========================================================

function initializeHistoryListener() {

    console.log(
        "Listening to smartStorage/history..."
    );


    const historyReference =
        database.ref(
            "smartStorage/history"
        );


    historyReference.on(

        "value",

        function (snapshot) {

            console.log(
                "History Firebase data:",
                snapshot.val()
            );


            const firebaseStatus =
                document.getElementById(
                    "firebaseStatus"
                );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Connected";

                firebaseStatus.style.color =
                    "#28a745";

            }


            const tbody =
                document.getElementById(
                    "historyBody"
                );


            if (!tbody) {

                console.error(
                    "historyBody element not found."
                );

                return;
            }


            tbody.innerHTML = "";


            if (!snapshot.exists()) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td colspan="5">
                        No ESP32 history data yet.
                    </td>
                `;


                tbody.appendChild(
                    row
                );


                return;
            }


            const records = [];


            snapshot.forEach(
                function (child) {

                    const data =
                        child.val();


                    records.push({

                        key:
                            child.key,

                        data:
                            data

                    });

                }
            );


            // ==================================================
            // NEWEST RECORD FIRST
            // ==================================================

            records.reverse();


            records.forEach(
                function (record) {

                    addHistoryRow(
                        tbody,
                        record.data
                    );

                }
            );

        },

        function (error) {

            console.error(
                "History Firebase error:",
                error
            );


            const firebaseStatus =
                document.getElementById(
                    "firebaseStatus"
                );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    "● Firebase Error";

                firebaseStatus.style.color =
                    "#dc3545";

            }

        }

    );

}


// ==========================================================
// ADD HISTORY ROW
// ==========================================================

function addHistoryRow(
    tbody,
    data
) {

    const row =
        document.createElement(
            "tr"
        );


    // ======================================================
    // TIMESTAMP
    // ======================================================

    let timestamp =
        data.timestamp ||
        "";


    if (!timestamp) {

        if (
            data.date &&
            data.time
        ) {

            timestamp =
                data.date +
                " " +
                data.time;

        }

        else if (
            data.createdAt
        ) {

            timestamp =
                formatTimestamp(
                    data.createdAt
                );

        }

        else {

            timestamp =
                "Unknown";

        }

    }


    // ======================================================
    // TEMPERATURE
    // ======================================================

    let temperature =
        data.temperature;


    if (
        temperature !== undefined &&
        temperature !== null
    ) {

        temperature =
            Number(temperature)
                .toFixed(1)
                +
                " °C";

    }

    else {

        temperature =
            "--";

    }


    // ======================================================
    // HUMIDITY
    // ======================================================

    let humidity =
        data.humidity;


    if (
        humidity !== undefined &&
        humidity !== null
    ) {

        humidity =
            Number(humidity)
                .toFixed(1)
                +
                " %";

    }

    else {

        humidity =
            "--";

    }


    // ======================================================
    // MOTION
    // ======================================================

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

    else if (
        motion === undefined ||
        motion === null
    ) {

        motion =
            "--";

    }


    // ======================================================
    // STATUS
    // ======================================================

    const status =
        data.status ||
        "NORMAL";


    // ======================================================
    // CREATE HTML
    // ======================================================

    row.innerHTML = `

        <td>
            ${escapeHTML(timestamp)}
        </td>

        <td>
            ${escapeHTML(temperature)}
        </td>

        <td>
            ${escapeHTML(humidity)}
        </td>

        <td>
            ${escapeHTML(motion)}
        </td>

        <td>
            <span class="history-status ${getStatusClass(status)}">
                ${escapeHTML(status)}
            </span>
        </td>

    `;


    tbody.appendChild(
        row
    );

}


// ==========================================================
// STATUS CLASS
// ==========================================================

function getStatusClass(
    status
) {

    const value =
        String(status)
            .toLowerCase();


    if (
        value === "danger"
    ) {

        return "danger";

    }


    if (
        value === "warning"
    ) {

        return "warning";

    }


    return "normal";

}


// ==========================================================
// TIMESTAMP FORMATTER
// ==========================================================

function formatTimestamp(
    timestamp
) {

    const date =
        new Date(
            Number(timestamp)
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "Unknown";

    }


    return date.toLocaleString(
        "en-PH"
    );

}


// ==========================================================
// SEARCH HISTORY
// ==========================================================

function searchTable() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const table =
        document.getElementById(
            "historyTable"
        );


    if (
        !input ||
        !table
    ) {

        return;

    }


    const filter =
        input.value
            .toUpperCase();


    const rows =
        table
            .getElementsByTagName(
                "tr"
            );


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const row =
            rows[i];


        const text =
            row.textContent ||
            row.innerText ||
            "";


        if (
            text
                .toUpperCase()
                .includes(filter)
        ) {

            row.style.display =
                "";

        }

        else {

            row.style.display =
                "none";

        }

    }

}


// ==========================================================
// ESCAPE HTML
// ==========================================================
//
// Prevents Firebase values from being interpreted as HTML.
//
// ==========================================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "History page starting..."
        );


        initializeLogout();


        initializeHistoryListener();


        console.log(
            "History page ready."
        );

    }
);


// ==========================================================
// GLOBAL FUNCTIONS
// ==========================================================

window.logout =
    logout;


window.searchTable =
    searchTable;
