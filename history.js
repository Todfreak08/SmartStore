// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// COMPLETE HISTORY.JS
// Firebase Realtime Database
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.replace("index.html");

        return;

    }


    console.log(
        "History user:",
        user.email
    );


    const userEmail =
        document.getElementById("userEmail");


    if (userEmail) {

        userEmail.textContent =
            user.email;

    }

});


// ==========================================================
// VARIABLES
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
            "historyBody was not found."
        );

        return;

    }


    historyBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty-message">

                Loading history...

            </td>

        </tr>

    `;


    // ======================================================
    // FIREBASE LISTENER
    // ======================================================

    database
        .ref("SmartStorage/history")
        .on(

            "value",

            (snapshot) => {

                historyData = [];


                // ------------------------------------------------
                // NO DATA
                // ------------------------------------------------

                if (!snapshot.exists()) {

                    historyBody.innerHTML = `

                        <tr>

                            <td
                                colspan="5"
                                class="empty-message">

                                No history data available.

                            </td>

                        </tr>

                    `;

                    return;

                }


                // ------------------------------------------------
                // GET FIREBASE DATA
                // ------------------------------------------------

                const data =
                    snapshot.val();


                Object.keys(data).forEach(
                    (key) => {

                        const item =
                            data[key];


                        if (!item) return;


                        historyData.push({

                            id:
                                key,

                            ...item

                        });

                    }
                );


                // ------------------------------------------------
                // SORT NEWEST FIRST
                // ------------------------------------------------

                historyData.sort(
                    (a, b) => {

                        const timeA =
                            getTime(a);


                        const timeB =
                            getTime(b);


                        return timeB - timeA;

                    }
                );


                // ------------------------------------------------
                // DISPLAY
                // ------------------------------------------------

                displayHistory(
                    historyData
                );

            },

            (error) => {

                console.error(
                    "Firebase history error:",
                    error
                );


                historyBody.innerHTML = `

                    <tr>

                        <td
                            colspan="5                    </td>

                    <td>
                        ${
                            data.temperature !== undefined
                                ? data.temperature + " °C"
                                : "--"
                        }
                    </td>

                    <td>
                        ${
                            data.humidity !== undefined
                                ? data.humidity + " %"
                                : "--"
                        }
                    </td>

                    <td>
                        ${motion}
                    </td>

                    <td>
                        ${data.status ?? "--"}
                    </td>

                    <td>
                        ${device}
                    </td>

                    <td>
                        ${data.source ?? "--"}
                    </td>

                `;


                historyBody.appendChild(row);

            });

        }, (error) => {

            console.error(
                "Firebase history error:",
                error
            );

            historyBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-message">
                        ❌ ${error.message}
                    </td>
                </tr>
            `;

        });

}


// ==========================================================
// SEARCH
// ==========================================================

function searchTable() {

    const input =
        document.getElementById("searchInput");

    const filter =
        input.value.toLowerCase();

    const rows =
        document.querySelectorAll(
            "#historyBody tr"
        );

    rows.forEach((row) => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(filter)
                ? ""
                : "none";

    });

}


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    auth.signOut()
        .then(() => {

            window.location.href =
                "index.html";

        })
        .catch((error) => {

            console.error(
                "Logout failed:",
                error
            );

            alert(
                "Logout failed: " +
                error.message
            );

        });

}


window.logout = logout;
window.searchTable = searchTable;
                historyBody.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            class="empty-message"
                        >

                            No history records found.

                        </td>

                    </tr>

                `;

                return;

            }


            const history =
                snapshot.val();


            // Convert Firebase object
            // into array

            const records =
                Object.entries(history);


            // Newest first

            records.reverse();


            // ------------------------------------------------
            // DISPLAY RECORDS
            // ------------------------------------------------

            records.forEach(
                ([id, data]) => {


                    const row =
                        document.createElement(
                            "tr"
                        );


                    // ----------------------------------------
                    // DATE
                    // ----------------------------------------

                    const timestamp =
                        data.timestamp ??
                        data.lastUpdate ??
                        "--";


                    // ----------------------------------------
                    // TEMPERATURE
                    // ----------------------------------------

                    const temperature =
                        data.temperature !==
                        undefined

                            ? data.temperature +
                              " °C"

                            : "--";


                    // ----------------------------------------
                    // HUMIDITY
                    // ----------------------------------------

                    const humidity =
                        data.humidity !==
                        undefined

                            ? data.humidity +
                              " %"

                            : "--";


                    // ----------------------------------------
                    // MOTION
                    // ----------------------------------------

                    let motion =
                        data.motion;


                    if (
                        motion === true
                    ) {

                        motion =
                            "Motion Detected";

                    }

                    else if (
                        motion === false
                    ) {

                        motion =
                            "No Motion";

                    }

                    else {

                        motion =
                            "--";

                    }


                    // ----------------------------------------
                    // STATUS
                    // ----------------------------------------

                    const status =
                        data.status ??
                        "--";


                    // ----------------------------------------
                    // DEVICE
                    // ----------------------------------------

                    let device =
                        "--";


                    if (
                        data.device
                    ) {

                        let deviceName =
                            data.device;


                        if (
                            data.device ===
                            "light"
                        ) {

                            deviceName =
                                "💡 Light";

                        }

                        else if (
                            data.device ===
                            "fan"
                        ) {

                            deviceName =
                                "🌀 Fan";

                        }

                        else if (
                            data.device ===
                            "door"
                        ) {

                            deviceName =
                                "🚪 Door";

                        }

                        else if (
                            data.device ===
                            "alarm"
                        ) {

                            deviceName =
                                "🚨 Alarm";

                        }


                        const state =
                            Boolean(
                                data.state
                            );


                        let stateText =
                            state
                                ? "ON"
                                : "OFF";


                        if (
                            data.device ===
                            "door"
                        ) {

                            stateText =
                                state
                                    ? "OPEN"
                                    : "CLOSED";

                        }


                        device =
                            deviceName +
                            " - " +
                            stateText;

                    }


                    // ----------------------------------------
                    // SOURCE
                    // ----------------------------------------

                    const source =
                        data.source ??
                        "Unknown";


                    // ----------------------------------------
                    // CREATE ROW
                    // ----------------------------------------

                    row.innerHTML = `

                        <td>
                            ${timestamp}
                        </td>

                        <td>
                            ${temperature}
                        </td>

                        <td>
                            ${humidity}
                        </td>

                        <td>
                            ${motion}
                        </td>

                        <td>
                            ${status}
                        </td>

                        <td>
                            ${device}
                        </td>

                        <td>
                            ${source}
                        </td>

                    `;


                    historyBody.appendChild(
                        row
                    );

                }
            );

        },


        // ==================================================
        // FIREBASE ERROR
        // ==================================================

        (error) => {

            console.error(
                "Firebase History Error:",
                error
            );


            historyBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="empty-message"
                    >

                        ❌ Unable to load Firebase
                        history.<br><br>

                        ${error.message}

                    </td>

                </tr>

            `;

        }

    );

}

// ==========================================================
// SEARCH
// ==========================================================

function searchTable() {

const input =
    document.getElementById(
        "searchInput"
    );


const filter =
    input.value.toLowerCase();


const rows =
    document.querySelectorAll(
        "#historyBody tr"
    );


rows.forEach((row) => {

    const text =
        row.innerText.toLowerCase();


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

// ==========================================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.logout =
logout;

window.searchTable =
searchTable;
