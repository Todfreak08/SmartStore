// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE HISTORY.JS
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.replace(
            "index.html"
        );

        return;

    }


    const userEmail =
        document.getElementById(
            "userEmail"
        );


    if (userEmail) {

        userEmail.textContent =
            user.email;

    }


    loadHistory();

});


// ==========================================================
// HISTORY ARRAY
// ==========================================================

let historyData = [];


// ==========================================================
// LOAD HISTORY
// ==========================================================

function loadHistory() {

    const historyBody =
        document.getElementById(
            "historyBody"
        );


    if (!historyBody) {

        console.error(
            "historyBody not found."
        );

        return;

    }


    historyBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty-message">

                Loading Firebase history...

            </td>

        </tr>

    `;


    database
        .ref(
            "SmartStorage/history"
        )
        .on(

            "value",

            function (snapshot) {

                historyData = [];


                // ==========================================
                // NO DATA
                // ==========================================

                if (!snapshot.exists()) {

                    displayHistory([]);

                    return;

                }


                const data =
                    snapshot.val();


                // ==========================================
                // CONVERT FIREBASE OBJECT TO ARRAY
                // ==========================================

                Object.keys(data).forEach(
                    function (key) {

                        const record =
                            data[key];


                        if (!record) return;


                        historyData.push({

                            id:
                                key,

                            ...record

                        });

                    }
                );


                // ==========================================
                // SORT NEWEST FIRST
                // ==========================================

                historyData.sort(
                    function (a, b) {

                        return (
                            getTimestamp(b) -
                            getTimestamp(a)
                        );

                    }
                );


                // ==========================================
                // DISPLAY
                // ==========================================

                displayHistory(
                    historyData
                );

            },

            function (error) {

                console.error(
                    "History Firebase error:",
                    error
                );


                historyBody.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            class="empty-message">

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
// GET TIMESTAMP
// ==========================================================

function getTimestamp(
    record
) {

    if (
        typeof record.createdAt ===
        "number"
    ) {

        return record.createdAt;

    }


    if (
        record.timestamp
    ) {

        const parsed =
            Date.parse(
                record.timestamp
            );


        if (!isNaN(parsed)) {

            return parsed;

        }

    }


    return 0;

}


// ==========================================================
// DISPLAY HISTORY
// ==========================================================

function displayHistory(
    records
) {

    const historyBody =
        document.getElementById(
            "historyBody"
        );


    if (!historyBody) return;


    historyBody.innerHTML = "";


    if (
        !records ||
        records.length === 0
    ) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message">

                    📭 No history records found.

                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


            // ==============================================
            // DATE
            // ==============================================

            const date =
                document.createElement(
                    "td"
                );


            date.textContent =
                getDateText(record);


            // ==============================================
            // TEMPERATURE
            // ==============================================

            const temperature =
                document.createElement(
                    "td"
                );


            if (
                record.temperature !==
                undefined
            ) {

                temperature.textContent =
                    record.temperature +
                    " °C";

            }

            else {

                temperature.textContent =
                    "—";

            }


            // ==============================================
            // HUMIDITY
            // ==============================================

            const humidity =
                document.createElement(
                    "td"
                );


            if (
                record.humidity !==
                undefined
            ) {

                humidity.textContent =
                    record.humidity +
                    " %";

            }

            else {

                humidity.textContent =
                    "—";

            }


            // ==============================================
            // MOTION / DEVICE
            // ==============================================

            const motion =
                document.createElement(
                    "td"
                );


            if (
                record.motion !==
                undefined
            ) {

                if (
                    record.motion === true
                ) {

                    motion.textContent =
                        "🚶 Detected";

                }

                else if (
                    record.motion === false
                ) {

                    motion.textContent =
                        "No Motion";

                }

                else {

                    motion.textContent =
                        record.motion;

                }

            }

            else if (
                record.device
            ) {

                const state =
                    Boolean(
                        record.state
                    );


                motion.textContent =
                    getDeviceName(
                        record.device
                    ) +
                    " " +
                    (
                        state
                            ? "ON"
                            : "OFF"
                    );

            }

            else {

                motion.textContent =
                    "—";

            }


            // ==============================================
            // STATUS
            // ==============================================

            const status =
                document.createElement(
                    "td"
                );


            if (
                record.status
            ) {

                status.textContent =
                    record.status;


                applyStatus(
                    status,
                    record.status
                );

            }

            else if (
                record.device
            ) {

                const state =
                    Boolean(
                        record.state
                    );


                status.textContent =
                    state
                        ? "ON"
                        : "OFF";

            }

            else {

                status.textContent =
                    "—";

            }


            // ==============================================
            // ADD ROW
            // ==============================================

            row.appendChild(
                date
            );

            row.appendChild(
                temperature
            );

            row.appendChild(
                humidity
            );

            row.appendChild(
                motion
            );

            row.appendChild(
                status
            );


            historyBody.appendChild(
                row
            );

        }
    );

}


// ==========================================================
// DATE
// ==========================================================

function getDateText(
    record
) {

    if (
        record.timestamp
    ) {

        return record.timestamp;

    }


    if (
        typeof record.createdAt ===
        "number"
    ) {

        return new Date(
            record.createdAt
        ).toLocaleString();

    }


    return "Unknown";

}


// ==========================================================
// DEVICE NAME
// ==========================================================

function getDeviceName(
    device
) {

    switch (device) {

        case "light":

            return "💡 Light:";


        case "fan":

            return "🌀 Fan:";


        case "door":

            return "🚪 Door:";


        case "alarm":

            return "🚨 Alarm:";


        default:

            return device + ":";

    }

}


// ==========================================================
// STATUS
// ==========================================================

function applyStatus(
    element,
    status
) {

    const value =
        String(status)
            .toUpperCase();


    element.classList.remove(
        "status-normal",
        "status-warning",
        "status-danger"
    );


    if (
        value === "NORMAL"
    ) {

        element.classList.add(
            "status-normal"
        );

    }


    else if (
        value === "WARNING"
    ) {

        element.classList.add(
            "status-warning"
        );

    }


    else if (
        value === "DANGER"
    ) {

        element.classList.add(
            "status-danger"
        );

    }

}


// ==========================================================
// SEARCH
// ==========================================================

function searchTable() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) return;


    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!query) {

        displayHistory(
            historyData
        );

        return;

    }


    const filtered =
        historyData.filter(
            function (record) {

                const searchableText = [

                    record.timestamp,

                    record.temperature,

                    record.humidity,

                    record.motion,

                    record.status,

                    record.source,

                    record.device,

                    record.state

                ]
                    .join(" ")
                    .toLowerCase();


                return searchableText
                    .includes(query);

            }
        );


    displayHistory(
        filtered
    );

}


window.searchTable =
    searchTable;


// ==========================================================
// ESCAPE HTML
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
