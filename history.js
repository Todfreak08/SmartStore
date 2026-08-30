/*
=========================================================
 SMART STORAGE MONITORING SYSTEM
 HISTORY.JS
=========================================================

 Matches:
    history.html

 Table:
    DATE | TIME | FLOAT | INTEGER | STRING

 Example:
    2026-08-30 | 20:45:04 | 12.75 | 3 | value_4000

 IMPORTANT:
    Latest record is always displayed FIRST.
=========================================================
*/


// =======================================================
// GLOBAL DATA
// =======================================================

let historyRecords = [];


// =======================================================
// PAGE LOAD
// =======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadHistory();

});


// =======================================================
// LOAD HISTORY FROM ESP32
// =======================================================

function loadHistory() {

    fetch("/api/history", {
        method: "GET",
        cache: "no-cache"
    })

    .then(function (response) {

        if (!response.ok) {
            throw new Error("Unable to connect to history API");
        }

        return response.json();

    })

    .then(function (data) {

        /*
        Accept different possible API structures.

        Example 1:
        [
            {...},
            {...}
        ]

        Example 2:
        {
            "history": [...]
        }

        Example 3:
        {
            "records": [...]
        }
        */

        if (Array.isArray(data)) {

            historyRecords = data;

        }

        else if (Array.isArray(data.history)) {

            historyRecords = data.history;

        }

        else if (Array.isArray(data.records)) {

            historyRecords = data.records;

        }

        else {

            historyRecords = [];

        }


        displayHistory(historyRecords);

    })

    .catch(function (error) {

        console.log("ESP32 history error:", error);

        /*
        If ESP32 API is unavailable,
        try browser local storage.
        */

        loadLocalHistory();

    });

}


// =======================================================
// DISPLAY HISTORY
// =======================================================

function displayHistory(records) {

    const tableBody =
        document.getElementById("historyBody");


    if (!tableBody) {

        console.error(
            "historyBody was not found in history.html"
        );

        return;

    }


    tableBody.innerHTML = "";


    // ---------------------------------------------------
    // NO RECORDS
    // ---------------------------------------------------

    if (!records || records.length === 0) {

        showEmptyHistory();

        updateSummary([]);

        return;

    }


    // ---------------------------------------------------
    // COPY ARRAY
    // ---------------------------------------------------

    let sortedRecords = [...records];


    // ---------------------------------------------------
    // SORT NEWEST RECORD FIRST
    // ---------------------------------------------------

    sortedRecords.sort(function (a, b) {

        const dateA =
            getRecordDate(a);

        const dateB =
            getRecordDate(b);


        return dateB - dateA;

    });


    // ---------------------------------------------------
    // DISPLAY EACH RECORD
    // ---------------------------------------------------

    sortedRecords.forEach(function (record) {

        const row =
            document.createElement("tr");


        // DATE
        const date =
            getDate(record);


        // TIME
        const time =
            getTime(record);


        // FLOAT
        const floatValue =
            getFloat(record);


        // INTEGER
        const integerValue =
            getInteger(record);


        // STRING
        const stringValue =
            getString(record);


        row.innerHTML = `

            <td class="date-value">
                ${escapeHTML(date)}
            </td>

            <td class="time-value">
                ${escapeHTML(time)}
            </td>

            <td class="float-value">
                ${formatFloat(floatValue)}
            </td>

            <td class="integer-value">
                ${escapeHTML(integerValue)}
            </td>

            <td class="string-value">
                ${escapeHTML(stringValue)}
            </td>

        `;


        tableBody.appendChild(row);

    });


    // ---------------------------------------------------
    // UPDATE SUMMARY
    // ---------------------------------------------------

    updateSummary(sortedRecords);

}


// =======================================================
// GET DATE
// =======================================================

function getDate(record) {

    /*
    Preferred:
        record.date

    Other possible names:
        record.DATE
        record.Date
        record.timestamp
    */

    if (record.date !== undefined) {

        return String(record.date);

    }


    if (record.DATE !== undefined) {

        return String(record.DATE);

    }


    if (record.Date !== undefined) {

        return String(record.Date);

    }


    // Try timestamp

    if (record.timestamp !== undefined) {

        const date =
            new Date(record.timestamp);

        if (!isNaN(date.getTime())) {

            return formatDate(date);

        }

    }


    return "---";

}


// =======================================================
// GET TIME
// =======================================================

function getTime(record) {

    if (record.time !== undefined) {

        return String(record.time);

    }


    if (record.TIME !== undefined) {

        return String(record.TIME);

    }


    if (record.Time !== undefined) {

        return String(record.Time);

    }


    // Try timestamp

    if (record.timestamp !== undefined) {

        const date =
            new Date(record.timestamp);

        if (!isNaN(date.getTime())) {

            return formatTime(date);

        }

    }


    return "---";

}


// =======================================================
// GET FLOAT
// =======================================================

function getFloat(record) {

    if (record.float !== undefined) {

        return record.float;

    }


    if (record.FLOAT !== undefined) {

        return record.FLOAT;

    }


    if (record.floatValue !== undefined) {

        return record.floatValue;

    }


    return 0;

}


// =======================================================
// GET INTEGER
// =======================================================

function getInteger(record) {

    if (record.integer !== undefined) {

        return record.integer;

    }


    if (record.INTEGER !== undefined) {

        return record.INTEGER;

    }


    if (record.int !== undefined) {

        return record.int;

    }


    if (record.integerValue !== undefined) {

        return record.integerValue;

    }


    return 0;

}


// =======================================================
// GET STRING
// =======================================================

function getString(record) {

    if (record.string !== undefined) {

        return record.string;

    }


    if (record.STRING !== undefined) {

        return record.STRING;

    }


    if (record.stringValue !== undefined) {

        return record.stringValue;

    }


    return "---";

}


// =======================================================
// CREATE DATE FOR SORTING
// =======================================================

function getRecordDate(record) {

    let date =
        getDate(record);

    let time =
        getTime(record);


    /*
    Convert:

        2026-08-30
        20:45:04

    Into:

        2026-08-30T20:45:04
    */

    if (
        date !== "---" &&
        time !== "---"
    ) {

        const combined =
            `${date}T${time}`;


        const result =
            new Date(combined);


        if (!isNaN(result.getTime())) {

            return result;

        }

    }


    /*
    If timestamp exists,
    use it as a backup.
    */

    if (record.timestamp !== undefined) {

        const result =
            new Date(record.timestamp);


        if (!isNaN(result.getTime())) {

            return result;

        }

    }


    return new Date(0);

}


// =======================================================
// FORMAT FLOAT
// =======================================================

function formatFloat(value) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "0.00";

    }


    return number.toFixed(2);

}


// =======================================================
// FORMAT DATE
// =======================================================

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(date.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =======================================================
// FORMAT TIME
// =======================================================

function formatTime(date) {

    const hours =
        String(date.getHours())
            .padStart(2, "0");


    const minutes =
        String(date.getMinutes())
            .padStart(2, "0");


    const seconds =
        String(date.getSeconds())
            .padStart(2, "0");


    return `${hours}:${minutes}:${seconds}`;

}


// =======================================================
// EMPTY HISTORY
// =======================================================

function showEmptyHistory() {

    const tableBody =
        document.getElementById("historyBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty"
            >

                <div class="empty-icon">
                    📋
                </div>

                <strong>
                    No history records yet.
                </strong>

                <br>

                <span>
                    Records collected by the ESP32
                    will appear here.
                </span>

            </td>

        </tr>

    `;

}


// =======================================================
// UPDATE SUMMARY
// =======================================================

function updateSummary(records) {

    const total =
        document.getElementById("totalRecords");


    const latestDate =
        document.getElementById("latestDate");


    const latestTime =
        document.getElementById("latestTime");


    // TOTAL

    if (total) {

        total.textContent =
            records.length;

    }


    // NO DATA

    if (records.length === 0) {

        if (latestDate) {
            latestDate.textContent = "---";
        }

        if (latestTime) {
            latestTime.textContent = "---";
        }

        return;

    }


    // LATEST RECORD

    const latest =
        records[0];


    if (latestDate) {

        latestDate.textContent =
            getDate(latest);

    }


    if (latestTime) {

        latestTime.textContent =
            getTime(latest);

    }

}


// =======================================================
// LOAD LOCAL STORAGE
// =======================================================

function loadLocalHistory() {

    try {

        const saved =
            localStorage.getItem(
                "storageHistory"
            );


        if (!saved) {

            historyRecords = [];

        }

        else {

            historyRecords =
                JSON.parse(saved);

        }


        if (!Array.isArray(historyRecords)) {

            historyRecords = [];

        }


        displayHistory(historyRecords);

    }

    catch (error) {

        console.log(
            "Local history error:",
            error
        );


        historyRecords = [];

        displayHistory([]);

    }

}


// =======================================================
// SAVE HISTORY LOCALLY
// =======================================================

function saveLocalHistory(records) {

    try {

        localStorage.setItem(
            "storageHistory",
            JSON.stringify(records)
        );

    }

    catch (error) {

        console.log(
            "Unable to save history:",
            error
        );

    }

}


// =======================================================
// CLEAR HISTORY
// =======================================================

function clearHistory() {

    const confirmation =
        confirm(
            "Are you sure you want to clear all history records?"
        );


    if (!confirmation) {

        return;

    }


    /*
    Clear browser storage
    */

    localStorage.removeItem(
        "storageHistory"
    );


    /*
    Clear current records
    */

    historyRecords = [];


    /*
    Update table
    */

    showEmptyHistory();


    /*
    Update counters
    */

    updateSummary([]);


    /*
    Optional ESP32 endpoint.

    If your Arduino code supports:

        DELETE /api/history

    this will also clear ESP32 history.
    */

    fetch("/api/history", {
        method: "DELETE"
    })

    .then(function (response) {

        console.log(
            "ESP32 history clear response:",
            response.status
        );

    })

    .catch(function (error) {

        console.log(
            "ESP32 clear unavailable:",
            error
        );

    });

}


// =======================================================
// HTML ESCAPE
// =======================================================

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


// =======================================================
// AUTOMATIC REFRESH
// =======================================================

/*
    The ESP32 history is refreshed every 5 seconds.

    This means if the ESP32 records:

    20:45:02
    20:45:03
    20:45:04

    the newest one will automatically
    move to the top.
*/

setInterval(function () {

    loadHistory();

}, 5000);
