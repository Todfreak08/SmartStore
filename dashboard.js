// ============================================================
// SMART STORAGE DASHBOARD
// dashboard.js
// ============================================================


// ============================================================
// FIREBASE DATABASE
// ============================================================

const database =
    firebase.database();


// ============================================================
// REFERENCES
// ============================================================

const collectionRef =
    database.ref(
        "collection/enabled"
    );


const dataRef =
    database.ref(
        "collection/data"
    );


const recordCountRef =
    database.ref(
        "collection/recordCount"
    );


// ============================================================
// ELEMENT HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element =
        getElement(id);

    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// HTML SECURITY
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
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


// ============================================================
// FIREBASE CONNECTION
// ============================================================

database
    .ref(".info/connected")
    .on(
        "value",
        function(snapshot) {

            if (
                snapshot.val() === true
            ) {

                setText(
                    "firebaseStatus",
                    "🟢 Firebase Connected"
                );

            } else {

                setText(
                    "firebaseStatus",
                    "🔴 Firebase Disconnected"
                );

            }

        }
    );


// ============================================================
// LOGIN
// ============================================================

firebase
    .auth()
    .onAuthStateChanged(
        function(user) {

            if (user) {

                setText(
                    "userEmail",
                    user.email
                );

            } else {

                setText(
                    "userEmail",
                    "Not logged in"
                );

            }

        }
    );


// ============================================================
// LOGOUT
// ============================================================

const logoutButton =
    getElement(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            try {

                await firebase
                    .auth()
                    .signOut();


                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Logout failed: " +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// START COLLECTION
// ============================================================

const startButton =
    getElement(
        "startCollection"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        async function() {

            console.log(
                "Start Collection clicked"
            );


            try {

                await collectionRef.set(
                    true
                );


                console.log(
                    "Collection started"
                );

            }

            catch (error) {

                console.error(
                    "Start error:",
                    error
                );


                alert(
                    "Unable to start collection:\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// STOP COLLECTION
// ============================================================

const stopButton =
    getElement(
        "stopCollection"
    );


if (stopButton) {

    stopButton.addEventListener(
        "click",
        async function() {

            console.log(
                "Stop Collection clicked"
            );


            try {

                await collectionRef.set(
                    false
                );


                console.log(
                    "Collection stopped"
                );

            }

            catch (error) {

                console.error(
                    "Stop error:",
                    error
                );


                alert(
                    "Unable to stop collection:\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// COLLECTION STATUS
// ============================================================

collectionRef.on(
    "value",
    function(snapshot) {

        const running =
            snapshot.val() === true;


        const status =
            running
                ? "RUNNING"
                : "STOPPED";


        setText(
            "collectionStatus",
            status
        );


        setText(
            "summaryCollection",
            status
        );


        if (startButton) {

            startButton.disabled =
                running;

        }


        if (stopButton) {

            stopButton.disabled =
                !running;

        }


        console.log(
            "Collection:",
            status
        );

    },
    function(error) {

        console.error(
            "Collection status error:",
            error
        );

    }
);


// ============================================================
// RECORD COUNT
// ============================================================

recordCountRef.on(
    "value",
    function(snapshot) {

        const count =
            Number(
                snapshot.val()
            ) || 0;


        setText(
            "recordCount",
            count
        );


        setText(
            "summaryRecords",
            count
        );

    }
);


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "--";

    }


    const date =
        new Date(
            Number(timestamp)
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "--";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(timestamp) {

    if (!timestamp) {

        return "--";

    }


    const date =
        new Date(
            Number(timestamp)
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "--";

    }


    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const seconds =
        String(
            date.getSeconds()
        ).padStart(
            2,
            "0"
        );


    // Match your screenshot:
    // 17-17-26

    return (
        hours +
        "-" +
        minutes +
        "-" +
        seconds
    );

}


// ============================================================
// FORMAT FLOAT
// ============================================================

function formatFloat(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "--";

    }


    const number =
        Number(value);


    if (
        isNaN(number)
    ) {

        return escapeHTML(
            value
        );

    }


    return number.toFixed(2);

}


// ============================================================
// FORMAT INTEGER
// ============================================================

function formatInteger(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "--";

    }


    return escapeHTML(
        value
    );

}


// ============================================================
// FORMAT STRING
// ============================================================

function formatString(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "--";

    }


    return escapeHTML(
        value
    );

}


// ============================================================
// CREATE TABLE ROW
// ============================================================

function createRow(
    recordKey,
    record
) {

    const row =
        document.createElement(
            "tr"
        );


    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    let date =
        record.date || "";


    // --------------------------------------------------------
    // TIME
    // --------------------------------------------------------

    let time =
        record.time || "";


    // --------------------------------------------------------
    // TIMESTAMP
    // --------------------------------------------------------

    if (
        record.timestamp
    ) {

        date =
            formatDate(
                record.timestamp
            );


        time =
            formatTime(
                record.timestamp
            );

    }


    // --------------------------------------------------------
    // IF NO TIME EXISTS
    // USE FIREBASE CHILD KEY
    // --------------------------------------------------------

    if (
        !time
    ) {

        time =
            recordKey;

    }


    // --------------------------------------------------------
    // VALUES
    // --------------------------------------------------------

    const floatValue =
        formatFloat(
            record.float
        );


    const intValue =
        formatInteger(
            record.int
        );


    const stringValue =
        formatString(
            record.string
        );


    // --------------------------------------------------------
    // HTML
    // --------------------------------------------------------

    row.innerHTML = `

        <td>
            ${escapeHTML(date)}
        </td>

        <td>
            ${escapeHTML(time)}
        </td>

        <td>
            ${floatValue}
        </td>

        <td>
            ${intValue}
        </td>

        <td>
            ${stringValue}
        </td>

    `;


    return row;

}


// ============================================================
// SORT RECORDS
// ============================================================

function sortRecords(records) {

    return records.sort(
        function(a, b) {

            const timeA =
                Number(
                    a.value.timestamp
                ) || 0;


            const timeB =
                Number(
                    b.value.timestamp
                ) || 0;


            return timeB - timeA;

        }
    );

}


// ============================================================
// DISPLAY DATA
// ============================================================

function displayData(
    snapshot
) {

    const tableBody =
        getElement(
            "dataLogBody"
        );


    if (!tableBody) {

        console.error(
            "dataLogBody not found."
        );

        return;

    }


    const records = [];


    snapshot.forEach(
        function(child) {

            const value =
                child.val();


            if (!value) {

                return;

            }


            records.push({

                key:
                    child.key,

                value:
                    value

            });

        }
    );


    // --------------------------------------------------------
    // SORT NEWEST FIRST
    // --------------------------------------------------------

    sortRecords(
        records
    );


    // --------------------------------------------------------
    // CLEAR TABLE
    // --------------------------------------------------------

    tableBody.innerHTML = "";


    // --------------------------------------------------------
    // EMPTY
    // --------------------------------------------------------

    if (
        records.length === 0
    ) {

        tableBody.innerHTML = `

            <tr class="empty-row">

                <td colspan="5">
                    No realtime data available.
                </td>

            </tr>

        `;


        setText(
            "deviceStatus",
            "OFFLINE"
        );


        setText(
            "deviceSource",
            "Waiting for ESP32"
        );


        return;

    }


    // --------------------------------------------------------
    // CREATE ROWS
    // --------------------------------------------------------

    records.forEach(
        function(item) {

            const row =
                createRow(
                    item.key,
                    item.value
                );


            tableBody.appendChild(
                row
            );

        }
    );


    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    setText(
        "deviceStatus",
        "ONLINE"
    );


    setText(
        "deviceSource",
        "ESP32 data received"
    );


    setText(
        "lastUpdate",
        new Date().toLocaleTimeString()
    );


    // --------------------------------------------------------
    // UPDATE RECORD COUNT
    // --------------------------------------------------------

    setText(
        "recordCount",
        records.length
    );


    setText(
        "summaryRecords",
        records.length
    );

}


// ============================================================
// REALTIME FIREBASE DATA
// ============================================================

dataRef.on(
    "value",
    function(snapshot) {

        console.log(
            "Realtime data:",
            snapshot.val()
        );


        displayData(
            snapshot
        );

    },
    function(error) {

        console.error(
            "Database error:",
            error
        );


        const tableBody =
            getElement(
                "dataLogBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr class="empty-row">

                    <td colspan="5">
                        Firebase error:
                        ${escapeHTML(
                            error.message
                        )}
                    </td>

                </tr>

            `;

        }

    }
);


// ============================================================
// NEW RECORD LISTENER
// ============================================================

dataRef.on(
    "child_added",
    function(snapshot) {

        console.log(
            "New Firebase record:",
            snapshot.key,
            snapshot.val()
        );

    }
);


// ============================================================
// DEVICE STATUS
// ============================================================

const deviceStatusRef =
    database.ref(
        "device/status"
    );


deviceStatusRef.on(
    "value",
    function(snapshot) {

        const status =
            snapshot.val();


        if (
            status
        ) {

            setText(
                "deviceStatus",
                String(
                    status
                ).toUpperCase()
            );

        }

    }
);


// ============================================================
// INITIALIZATION
// ============================================================

console.log(
    "=========================================="
);

console.log(
    "SMART STORAGE DASHBOARD"
);

console.log(
    "Dashboard JavaScript loaded successfully."
);

console.log(
    "=========================================="
);
