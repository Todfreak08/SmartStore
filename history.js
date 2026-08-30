// =====================================================
// SMART STORAGE HISTORY
// ESP32 → Firebase → Website
// =====================================================


// =====================================================
// LOGIN CHECK
// =====================================================

auth.onAuthStateChanged(function(user) {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const email = document.getElementById("userEmail");

    if (email) {
        email.textContent = user.email;
    }

});



// =====================================================
// LOGOUT
// =====================================================

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
                        "Logout failed: " +
                        error.message
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
// FIREBASE HISTORY REFERENCE
// =====================================================

const historyRef =
    database.ref(
        "smartStorage/history"
    );



// =====================================================
// TIMESTAMP → DATE
// =====================================================

function convertTimestampToDate(timestamp) {

    if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === ""
    ) {
        return null;
    }

    let value = Number(timestamp);

    if (isNaN(value)) {
        return null;
    }

    // Firebase timestamp in seconds
    if (value < 100000000000) {
        value = value * 1000;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
}



// =====================================================
// FORMAT DATE
// Philippines: Asia/Manila
// =====================================================

function formatDate(timestamp) {

    const date =
        convertTimestampToDate(timestamp);

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}



// =====================================================
// FORMAT TIME
// Philippines: Asia/Manila
// =====================================================

function formatTime(timestamp) {

    const date =
        convertTimestampToDate(timestamp);

    if (!date) {
        return "-";
    }

    return date.toLocaleTimeString(
        "en-PH",
        {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );

}



// =====================================================
// FORMAT MOTION
// =====================================================

function formatMotion(value) {

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "TRUE"
    ) {
        return "Motion Detected";
    }

    if (
        value === false ||
        value === 0 ||
        value === "0" ||
        value === "false" ||
        value === "FALSE"
    ) {
        return "No Motion";
    }

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "-";
    }

    return String(value);

}



// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(data) {

    // If ESP32 sends status directly
    if (
        data.status !== undefined &&
        data.status !== null &&
        data.status !== ""
    ) {
        return String(data.status);
    }

    // Otherwise use online field
    if (
        data.online === true ||
        data.online === 1 ||
        data.online === "true" ||
        data.online === "TRUE" ||
        data.online === "1"
    ) {
        return "ONLINE";
    }

    if (
        data.online === false ||
        data.online === 0 ||
        data.online === "false" ||
        data.online === "FALSE" ||
        data.online === "0"
    ) {
        return "OFFLINE";
    }

    return "-";

}



// =====================================================
// LOAD HISTORY
// =====================================================

historyRef.on(

    "value",

    function(snapshot) {

        console.log(
            "ESP32 HISTORY:",
            snapshot.val()
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


        const message =
            document.getElementById(
                "historyMessage"
            );


        if (!tbody) {

            console.error(
                "historyBody not found."
            );

            return;

        }


        tbody.innerHTML = "";



        // =================================================
        // NO DATA
        // =================================================

        if (!snapshot.exists()) {

            if (message) {

                message.textContent =
                    "Waiting for ESP32 data...";

                message.style.display =
                    "block";

            }

            return;

        }


        if (message) {

            message.style.display =
                "none";

        }



        // =================================================
        // CONVERT FIREBASE RECORDS TO ARRAY
        // =================================================

        const records = [];


        snapshot.forEach(function(child) {

            records.push({

                key:
                    child.key,

                data:
                    child.val()

            });

        });



       // =================================================
// =================================================
// SORT: NEWEST RECORD FIRST
// =================================================

records.sort(function(a, b) {

    const dataA = a.data || {};
    const dataB = b.data || {};

    // Get timestamp from the available Firebase field
    function getTimestamp(data) {

        let value =
            data.timestamp ??
            data.timestampRaw ??
            data.createdAt ??
            data.timeStamp ??
            0;

        value = Number(value);

        if (isNaN(value)) {
            return 0;
        }

        // Convert seconds to milliseconds
        if (value < 100000000000) {
            value = value * 1000;
        }

        return value;
    }

    const timestampA = getTimestamp(dataA);
    const timestampB = getTimestamp(dataB);

    // NEWEST → OLDEST
    return timestampB - timestampA;

});



        // =================================================
        // DISPLAY RECORDS
        // =================================================

        records.forEach(function(record) {

            const data =
                record.data || {};


            const row =
                document.createElement(
                    "tr"
                );



            // -------------------------------------------------
            // TIMESTAMP
            // -------------------------------------------------

            const timestamp =
                data.timestamp ||
                data.timestampRaw ||
                data.createdAt ||
                null;



            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            const date =
                data.date ||
                formatDate(timestamp);



            // -------------------------------------------------
            // TIME
            // -------------------------------------------------

            const time =
                data.time ||
                formatTime(timestamp);



            // -------------------------------------------------
            // TEMPERATURE
            // -------------------------------------------------

            let temperature = "-";

            if (
                data.temperature !== undefined &&
                data.temperature !== null &&
                data.temperature !== ""
            ) {

                const temp =
                    Number(data.temperature);

                temperature =
                    isNaN(temp)
                        ? String(data.temperature)
                        : temp.toFixed(1) + " °C";

            }



            // -------------------------------------------------
            // HUMIDITY
            // -------------------------------------------------

            let humidity = "-";

            if (
                data.humidity !== undefined &&
                data.humidity !== null &&
                data.humidity !== ""
            ) {

                const hum =
                    Number(data.humidity);

                humidity =
                    isNaN(hum)
                        ? String(data.humidity)
                        : hum.toFixed(1) + " %";

            }



            // -------------------------------------------------
            // MOTION
            // -------------------------------------------------

            const motion =
                formatMotion(
                    data.motion
                );



            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            const status =
                formatStatus(data);



            // -------------------------------------------------
            // SOURCE
            // -------------------------------------------------

            const source =
                data.source ||
                "ESP32";



            // -------------------------------------------------
            // CREATE ROW
            // -------------------------------------------------

            row.innerHTML = `

                <td>
                    ${escapeHTML(date)}
                </td>

                <td>
                    ${escapeHTML(time)}
                </td>

                <td>
                    ${escapeHTML(
                        timestamp || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        temperature
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        humidity
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        motion
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            status
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        source
                    )}
                </td>

            `;


            tbody.appendChild(row);

        });

    },


    function(error) {

        console.error(
            "History Firebase error:",
            error
        );


        if (firebaseStatus) {

            firebaseStatus.textContent =
                "● Firebase Error";

            firebaseStatus.style.color =
                "#dc3545";

        }


        const message =
            document.getElementById(
                "historyMessage"
            );


        if (message) {

            message.textContent =
                "Unable to load Firebase history: " +
                error.message;

            message.style.display =
                "block";

        }

    }

);



// =====================================================
// SEARCH
// =====================================================

const searchInput =
    document.getElementById(
        "historySearch"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function() {

            const filter =
                searchInput.value
                    .toLowerCase();


            const rows =
                document.querySelectorAll(
                    "#historyBody tr"
                );


            rows.forEach(function(row) {

                const text =
                    row.textContent
                        .toLowerCase();


                row.style.display =
                    text.includes(filter)
                        ? ""
                        : "none";

            });

        }
    );

}



// =====================================================
// SECURITY
// Prevent Firebase values from injecting HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;

}
