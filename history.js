/* ==========================================================
SMART STORAGE MONITORING SYSTEM
HISTORY.JS
========================================================== */

// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged((user) => {

if (!user) {

    window.location.href = "index.html";

    return;

}


const userEmail =
    document.getElementById("userEmail");


if (userEmail) {

    userEmail.innerHTML =
        user.email;

}


loadHistory();

});

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
            "Logout error:",
            error
        );

    });

}

// ==========================================================
// LOAD FIREBASE HISTORY
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


database
    .ref("SmartStorage/history")
    .on(

        "value",

        (snapshot) => {

            console.log(
                "Firebase History:",
                snapshot.val()
            );


            // Clear existing rows

            historyBody.innerHTML =
                "";


            // ------------------------------------------------
            // NO DATA
            // ------------------------------------------------

            if (!snapshot.exists()) {

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
