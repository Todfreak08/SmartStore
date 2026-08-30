// =====================================================
// SMART STORAGE HISTORY
// ESP32 → Firebase → Website
// Fields:
// Date | Time | Float | Integer | String
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

    logoutButton.addEventListener("click", function() {

        auth.signOut()
            .then(function() {

                window.location.href = "index.html";

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

    });

}


// =====================================================
// FIREBASE STATUS
// =====================================================

const firebaseStatus =
    document.getElementById("firebaseStatus");


// =====================================================
// FIREBASE HISTORY
// =====================================================

const historyRef =
    database.ref("smartStorage/history");


// =====================================================
// TIMESTAMP → DATE OBJECT
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

    // If timestamp is in seconds,
    // convert to milliseconds.
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
// MILITARY / 24-HOUR TIME
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
            hour12: false
        }
    );

}


// =====================================================
// GET TIMESTAMP
// =====================================================

function getRecordTimestamp(data) {

    let timestamp =
        data.timestamp ??
        data.timestampRaw ??
        data.createdAt ??
        data.timeStamp ??
        0;

    timestamp = Number(timestamp);

    if (isNaN(timestamp)) {
        return 0;
    }

    return timestamp;
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


        // -------------------------------------------------
        // FIREBASE STATUS
        // -------------------------------------------------

        if (firebaseStatus) {

            firebaseStatus.textContent =
                "● Firebase Connected";

            firebaseStatus.style.color =
                "#28a745";

        }


        // -------------------------------------------------
        // TABLE BODY
        // -------------------------------------------------

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


        // Clear existing records
        tbody.innerHTML = "";


        // -------------------------------------------------
        // NO DATA
        // -------------------------------------------------

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
        // CONVERT FIREBASE DATA TO ARRAY
        // =================================================

        const records = [];


        snapshot.forEach(function(child) {

            const data =
                child.val() || {};


            records.push({

                key:
                    child.key,

                data:
                    data

            });

        });


        // =================================================
        // SORT NEWEST RECORD FIRST
        // =================================================

        records.sort(function(a, b) {

            const timestampA =
                getRecordTimestamp(
                    a.data
                );


            const timestampB =
                getRecordTimestamp(
                    b.data
                );


            // Newest → oldest
            return timestampB - timestampA;

        });


        // =================================================
        // DISPLAY RECORDS
        // =================================================

        records.forEach(function(record) {

            const data =
                record.data || {};


            const row =
                document.createElement("tr");


            // -------------------------------------------------
            // TIMESTAMP
            // -------------------------------------------------

            const timestamp =
                getRecordTimestamp(data);


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
            // FLOAT
            // -------------------------------------------------

            let floatValue = "-";


            if (
                data.float !== undefined &&
                data.float !== null &&
                data.float !== ""
            ) {

                const value =
                    Number(data.float);


                if (!isNaN(value)) {

                    floatValue =
                        value.toFixed(2);

                } else {

                    floatValue =
                        String(data.float);

                }

            }


            // -------------------------------------------------
            // INTEGER
            // -------------------------------------------------

            let integerValue = "-";


            if (
                data.integer !== undefined &&
                data.integer !== null &&
                data.integer !== ""
            ) {

                const value =
                    Number(data.integer);


                if (
                    !isNaN(value) &&
                    Number.isInteger(value)
                ) {

                    integerValue =
                        String(value);

                } else {

                    integerValue =
                        String(data.integer);

                }

            }


            // -------------------------------------------------
            // STRING
            // -------------------------------------------------

            let stringValue = "-";


            if (
                data.string !== undefined &&
                data.string !== null &&
                data.string !== ""
            ) {

                stringValue =
                    String(data.string);

            }


            // =================================================
            // CREATE TABLE ROW
            // =================================================

            row.innerHTML = `

                <td>
                    ${escapeHTML(date)}
                </td>

                <td>
                    ${escapeHTML(time)}
                </td>

                <td>
                    ${escapeHTML(floatValue)}
                </td>

                <td>
                    ${escapeHTML(integerValue)}
                </td>

                <td>
                    ${escapeHTML(stringValue)}
                </td>

            `;


            // Newest records appear first
            tbody.appendChild(row);

        });

    },


    // =====================================================
    // FIREBASE ERROR
    // =====================================================

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
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}
