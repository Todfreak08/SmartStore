// ============================================================
// SMART STORAGE DASHBOARD
// dashboard.js
// ============================================================


// ============================================================
// FIREBASE
// ============================================================

const database = firebase.database();


// ============================================================
// FIREBASE REFERENCES
// ============================================================

const collectionRef =
    database.ref("collection/enabled");

const dataRef =
    database.ref("collection/data");

const recordCountRef =
    database.ref("collection/recordCount");


// ============================================================
// HELPER
// ============================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


// ============================================================
// FIREBASE CONNECTION STATUS
// ============================================================

database.ref(".info/connected").on(
    "value",
    function(snapshot) {

        if (snapshot.val() === true) {

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

firebase.auth().onAuthStateChanged(
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
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            firebase.auth()
                .signOut()
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


// ============================================================
// START COLLECTION
// ============================================================

const startButton =
    document.getElementById("startCollection");

if (startButton) {

    startButton.addEventListener(
        "click",
        function() {

            console.log(
                "START COLLECTION clicked"
            );


            collectionRef
                .set(true)
                .then(function() {

                    console.log(
                        "Collection started"
                    );

                })
                .catch(function(error) {

                    console.error(
                        "Start error:",
                        error
                    );

                    alert(
                        "Unable to start collection:\n" +
                        error.message
                    );

                });

        }
    );

}


// ============================================================
// STOP COLLECTION
// ============================================================

const stopButton =
    document.getElementById("stopCollection");

if (stopButton) {

    stopButton.addEventListener(
        "click",
        function() {

            console.log(
                "STOP COLLECTION clicked"
            );


            collectionRef
                .set(false)
                .then(function() {

                    console.log(
                        "Collection stopped"
                    );

                })
                .catch(function(error) {

                    console.error(
                        "Stop error:",
                        error
                    );

                    alert(
                        "Unable to stop collection:\n" +
                        error.message
                    );

                });

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


        console.log(
            "Collection status:",
            running
        );


        if (running) {

            setText(
                "collectionStatus",
                "RUNNING"
            );

            setText(
                "summaryCollection",
                "RUNNING"
            );


            // Optional button appearance

            if (startButton) {

                startButton.disabled =
                    true;

            }


            if (stopButton) {

                stopButton.disabled =
                    false;

            }

        } else {

            setText(
                "collectionStatus",
                "STOPPED"
            );

            setText(
                "summaryCollection",
                "STOPPED"
            );


            if (startButton) {

                startButton.disabled =
                    false;

            }


            if (stopButton) {

                stopButton.disabled =
                    true;

            }

        }

    }
);


// ============================================================
// RECORD COUNT
// ============================================================

recordCountRef.on(
    "value",
    function(snapshot) {

        const count =
            parseInt(snapshot.val()) || 0;


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

        return "-";

    }


    const date =
        new Date(timestamp);


    if (isNaN(date.getTime())) {

        return "-";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


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

        return "-";

    }


    const date =
        new Date(timestamp);


    if (isNaN(date.getTime())) {

        return "-";

    }


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    return (
        hours +
        "-" +
        minutes +
        "-" +
        seconds
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

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


// ============================================================
// GET LOG TABLE
// ============================================================

function getLogTableBody() {

    // First try the ID

    let tbody =
        document.getElementById(
            "dataLogBody"
        );


    if (tbody) {

        return tbody;

    }


    // Otherwise find the first tbody

    tbody =
        document.querySelector(
            "#dataLogs tbody"
        );


    return tbody;

}


// ============================================================
// CREATE ONE TABLE ROW
// ============================================================

function createLogRow(
    recordKey,
    record
) {

    const timestamp =
        record.timestamp ||
        record.time ||
        null;


    let dateValue =
        record.date || "";


    let timeValue =
        record.time || "";


    // If ESP32 provides timestamp,
    // convert it automatically.

    if (timestamp) {

        dateValue =
            formatDate(timestamp);

        timeValue =
            formatTime(timestamp);

    }


    // Firebase key can also be
    // something like 17-17-26.

    if (!timeValue) {

        timeValue =
            recordKey;

    }


    const floatValue =
        record.float !== undefined
            ? record.float
            : "";


    const intValue =
        record.int !== undefined
            ? record.int
            : "";


    const stringValue =
        record.string !== undefined
            ? record.string
            : "";


    const tr =
        document.createElement("tr");


    tr.setAttribute(
        "data-record-key",
        recordKey
    );


    tr.innerHTML = `

        <td>
            ${escapeHTML(dateValue)}
        </td>

        <td>
            ${escapeHTML(timeValue)}
        </td>

        <td>
            ${escapeHTML(
                Number(floatValue)
                    .toFixed(2)
            )}
        </td>

        <td>
            ${escapeHTML(intValue)}
        </td>

        <td>
            ${escapeHTML(stringValue)}
        </td>

    `;


    return tr;

}


// ============================================================
// DISPLAY ALL LOGS
// ============================================================

function displayLogs(snapshot) {

    const tbody =
        getLogTableBody();


    if (!tbody) {

        console.error(
            "Cannot find data log table body."
        );

        return;

    }


    // Clear current table

    tbody.innerHTML = "";


    const records = [];


    snapshot.forEach(
        function(childSnapshot) {

            const key =
                childSnapshot.key;


            const value =
                childSnapshot.val();


            if (!value) {

                return;

            }


            records.push({

                key: key,

                value: value

            });

        }
    );


    // Newest records first

    records.reverse();


    // Create rows

    records.forEach(
        function(item) {

            const row =
                createLogRow(
                    item.key,
                    item.value
                );


            tbody.appendChild(
                row
            );

        }
    );


    // Update count

    setText(
        "recordCount",
        records.length
    );


    setText(
        "summaryRecords",
        records.length
    );


    // Device online if records exist

    if (records.length > 0) {

        setText(
            "deviceStatus",
            "ONLINE"
        );

        setText(
            "deviceSource",
            "ESP32 data received"
        );

    }

}


// ============================================================
// REALTIME LOG LISTENER
// ============================================================

dataRef.on(
    "value",
    function(snapshot) {

        console.log(
            "Realtime data updated:",
            snapshot.val()
        );


        displayLogs(
            snapshot
        );


        setText(
            "lastUpdate",
            new Date().toLocaleString()
        );

    },
    function(error) {

        console.error(
            "Realtime data error:",
            error
        );

    }
);


// ============================================================
// NEW RECORD LISTENER
// ============================================================

dataRef.on(
    "child_added",
    function(snapshot) {

        console.log(
            "New record:",
            snapshot.key,
            snapshot.val()
        );

    }
);


// ============================================================
// PAGE LOADED
// ============================================================

console.log(
    "================================="
);

console.log(
    "SMART STORAGE DASHBOARD READY"
);

console.log(
    "================================="
);
