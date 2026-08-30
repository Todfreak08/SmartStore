// =====================================================
// SMART STORAGE MONITORING SYSTEM
// HISTORY JAVASCRIPT
//
// ESP32 LOCAL WEB SERVER
//
// Arduino API:
// /api/history
// /api/status
// /api/clear
//
// Data:
// Date
// Time
// Float
// Integer
// String
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const historyBody =
    document.getElementById("historyBody");

const historyMessage =
    document.getElementById("historyMessage");

const searchInput =
    document.getElementById("historySearch");

const refreshButton =
    document.getElementById("refreshButton");

const clearButton =
    document.getElementById("clearButton");

const backButton =
    document.getElementById("backButton");

const connectionStatus =
    document.getElementById("connectionStatus");

const collectionStatus =
    document.getElementById("collectionStatus");

const recordCount =
    document.getElementById("recordCount");

const secondsCount =
    document.getElementById("secondsCount");


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


// =====================================================
// UPDATE CONNECTION STATUS
// =====================================================

function setConnectionStatus(connected) {

    if (!connectionStatus) {
        return;
    }


    if (connected) {

        connectionStatus.textContent =
            "● ESP32 Online";

        connectionStatus.className =
            "status online";

    }
    else {

        connectionStatus.textContent =
            "● ESP32 Offline";

        connectionStatus.className =
            "status offline";

    }

}


// =====================================================
// LOAD HISTORY
// =====================================================

async function loadHistory() {

    try {

        const response =
            await fetch(
                "/api/history",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "ESP32 returned HTTP " +
                response.status
            );

        }


        const records =
            await response.json();


        setConnectionStatus(true);


        // -------------------------------------------------
        // CLEAR TABLE
        // -------------------------------------------------

        historyBody.innerHTML = "";


        // -------------------------------------------------
        // NO RECORDS
        // -------------------------------------------------

        if (
            !Array.isArray(records) ||
            records.length === 0
        ) {

            historyMessage.textContent =
                "No history records yet.";

            historyMessage.style.display =
                "block";


            recordCount.textContent =
                "0";


            secondsCount.textContent =
                "0";


            return;

        }


        historyMessage.style.display =
            "none";


        // -------------------------------------------------
        // SORT NEWEST FIRST
        //
        // Arduino already sends newest first.
        // This additional sort ensures that the newest
        // record remains at the top.
        // -------------------------------------------------

        records.sort(function(a, b) {

            const secondsA =
                Number(a.seconds || 0);

            const secondsB =
                Number(b.seconds || 0);

            return secondsB - secondsA;

        });


        // -------------------------------------------------
        // UPDATE RECORD COUNT
        // -------------------------------------------------

        recordCount.textContent =
            records.length;


        // -------------------------------------------------
        // LATEST SECONDS
        // -------------------------------------------------

        if (records.length > 0) {

            secondsCount.textContent =
                records[0].seconds ?? 0;

        }


        // -------------------------------------------------
        // DISPLAY RECORDS
        // -------------------------------------------------

        records.forEach(function(record) {

            const row =
                document.createElement("tr");


            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            const date =
                record.date ?? "-";


            // -------------------------------------------------
            // TIME
            // -------------------------------------------------

            const time =
                record.time ?? "-";


            // -------------------------------------------------
            // FLOAT
            // -------------------------------------------------

            let floatValue =
                "-";


            if (
                record.float !== undefined &&
                record.float !== null
            ) {

                const number =
                    Number(record.float);


                if (!isNaN(number)) {

                    floatValue =
                        number.toFixed(2);

                }
                else {

                    floatValue =
                        String(record.float);

                }

            }


            // -------------------------------------------------
            // INTEGER
            // -------------------------------------------------

            let integerValue =
                "-";


            if (
                record.integer !== undefined &&
                record.integer !== null
            ) {

                integerValue =
                    String(
                        parseInt(
                            record.integer,
                            10
                        )
                    );

            }


            // -------------------------------------------------
            // STRING
            // -------------------------------------------------

            const stringValue =
                record.string ?? "-";


            // -------------------------------------------------
            // CREATE ROW
            // -------------------------------------------------

            row.innerHTML = `

                <td>
                    ${escapeHTML(date)}
                </td>

                <td class="time-cell">
                    ${escapeHTML(time)}
                </td>

                <td class="float-cell">
                    ${escapeHTML(floatValue)}
                </td>

                <td class="integer-cell">
                    ${escapeHTML(integerValue)}
                </td>

                <td class="string-cell">
                    ${escapeHTML(stringValue)}
                </td>

            `;


            // -------------------------------------------------
            // NEWEST RECORD
            // -------------------------------------------------

            if (
                records.indexOf(record) === 0
            ) {

                row.classList.add(
                    "latest-record"
                );

            }


            historyBody.appendChild(row);

        });

    }
    catch (error) {

        console.error(
            "History loading error:",
            error
        );


        setConnectionStatus(false);


        historyMessage.textContent =
            "Unable to connect to ESP32.";


        historyMessage.style.display =
            "block";

    }

}


// =====================================================
// LOAD ESP32 STATUS
// =====================================================

async function loadStatus() {

    try {

        const response =
            await fetch(
                "/api/status",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Status request failed"
            );

        }


        const data =
            await response.json();


        setConnectionStatus(true);


        // -------------------------------------------------
        // COLLECTION STATUS
        // -------------------------------------------------

        if (collectionStatus) {

            if (data.collecting) {

                collectionStatus.textContent =
                    "COLLECTING";

                collectionStatus.className =
                    "collecting";

            }
            else {

                collectionStatus.textContent =
                    "STOPPED";

                collectionStatus.className =
                    "stopped";

            }

        }


        // -------------------------------------------------
        // RECORD COUNT
        // -------------------------------------------------

        if (recordCount) {

            recordCount.textContent =
                data.records ?? 0;

        }


        // -------------------------------------------------
        // SECONDS
        // -------------------------------------------------

        if (secondsCount) {

            secondsCount.textContent =
                data.seconds ?? 0;

        }

    }
    catch (error) {

        console.error(
            "Status error:",
            error
        );


        setConnectionStatus(false);

    }

}


// =====================================================
// SEARCH HISTORY
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const filter =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const rows =
                historyBody.querySelectorAll(
                    "tr"
                );


            rows.forEach(function(row) {

                const text =
                    row.textContent
                        .toLowerCase();


                if (
                    text.includes(filter)
                ) {

                    row.style.display =
                        "";

                }
                else {

                    row.style.display =
                        "none";

                }

            });

        }
    );

}


// =====================================================
// REFRESH BUTTON
// =====================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        async function() {

            refreshButton.disabled =
                true;


            refreshButton.textContent =
                "Loading...";


            await loadHistory();

            await loadStatus();


            refreshButton.disabled =
                false;


            refreshButton.textContent =
                "Refresh";

        }
    );

}


// =====================================================
// CLEAR HISTORY
// =====================================================

if (clearButton) {

    clearButton.addEventListener(
        "click",
        async function() {

            const confirmed =
                confirm(
                    "Are you sure you want to clear all history records?"
                );


            if (!confirmed) {
                return;
            }


            try {

                clearButton.disabled =
                    true;


                clearButton.textContent =
                    "Clearing...";


                const response =
                    await fetch(
                        "/api/clear",
                        {
                            method: "GET",
                            cache: "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to clear history"
                    );

                }


                await loadHistory();

                await loadStatus();


                alert(
                    "History cleared successfully."
                );

            }
            catch (error) {

                console.error(
                    "Clear history error:",
                    error
                );


                alert(
                    "Failed to clear history."
                );

            }
            finally {

                clearButton.disabled =
                    false;


                clearButton.textContent =
                    "Clear History";

            }

        }
    );

}


// =====================================================
// BACK BUTTON
// =====================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "ap-dashboard.html";

        }
    );

}


// =====================================================
// AUTOMATIC REFRESH
// =====================================================
//
// Refresh history every 1 second.
// This matches the Arduino's 1-second
// data collection interval.
//

setInterval(
    function() {

        loadHistory();

        loadStatus();

    },
    1000
);


// =====================================================
// INITIAL LOAD
// =====================================================

loadHistory();

loadStatus();
