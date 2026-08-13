// ==========================================================
// SMART STORAGE - HISTORY.JS
// ==========================================================

// AUTHENTICATION
auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const email = document.getElementById("userEmail");

    if (email) {
        email.textContent = user.email;
    }

    loadHistory();
});


// ==========================================================
// LOAD HISTORY FROM FIREBASE
// ==========================================================

function loadHistory() {

    const historyBody =
        document.getElementById("historyBody");

    if (!historyBody) {
        console.error("historyBody not found.");
        return;
    }

    database
        .ref("SmartStorage/history")
        .on("value", (snapshot) => {

            historyBody.innerHTML = "";

            if (!snapshot.exists()) {

                historyBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-message">
                            No history records found.
                        </td>
                    </tr>
                `;

                return;
            }

            const records = [];

            snapshot.forEach((child) => {

                records.push({
                    id: child.key,
                    data: child.val()
                });

            });


            // Newest first
            records.reverse();


            records.forEach((record) => {

                const data = record.data;

                let motion = data.motion ?? "--";

                if (motion === true) {
                    motion = "Motion Detected";
                }

                if (motion === false) {
                    motion = "No Motion";
                }


                let device = "--";

                if (data.device) {

                    device =
                        data.device +
                        " - " +
                        (
                            data.state
                                ? "ON"
                                : "OFF"
                        );

                }


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${data.timestamp ?? "--"}
                    </td>

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
