// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// HISTORY.JS
// ==========================================================


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

        userEmail.textContent =
            user.email;

    }


    loadHistory();

});


// ==========================================================
// LOAD HISTORY
// ==========================================================

function loadHistory() {

    const historyBody =
        document.getElementById("historyBody");


    if (!historyBody) {

        console.error(
            "historyBody element not found."
        );

        return;

    }


    // Clear loading message

    historyBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-message">
                Loading Firebase history...
            </td>
        </tr>
    `;


    // ======================================================
    // READ EXACT FIREBASE PATH
    // ======================================================

    database
        .ref("SmartStorage/history")
        .on(
            "value",
            (snapshot) => {

                console.log(
                    "🔥 HISTORY FROM FIREBASE:",
                    snapshot.val()
                );


                // Clear table

                historyBody.innerHTML =
                    "";


                // ==================================================
                // NO RECORDS
                // ==================================================

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


                const records = [];


                // ==================================================
                // GET FIREBASE RECORDS
                // ==================================================

                snapshot.forEach(
                    (child) => {

                        records.push({

                            id:
                                child.key,

                            data:
                                child.val()

                        });

                    }
                );


                // Newest first

                records.reverse();


                // ==================================================
                // DISPLAY RECORDS
                // ==================================================

                records.forEach(
                    (record) => {

                        const data =
                            record.data;


                        const row =
                            document.createElement(
                                "tr"
                            );


                        // ------------------------------------------
                        // TEMPERATURE
                        // ------------------------------------------

                        const temperature =
                            data.temperature !==
                            undefined

                                ? data.temperature +
                                  " °C"

                                : "--";


                        // ------------------------------------------
                        // HUMIDITY
                        // ------------------------------------------

                        const humidity =
                            data.humidity !==
                            undefined

                                ? data.humidity +
                                  " %"

                                : "--";


                        // ------------------------------------------
                        // MOTION
                        // ------------------------------------------

                        let motion =
                            data.motion;


                        if (
                            motion === true
                        ) {

                            motion =
                                "Detected";

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


                        // ------------------------------------------
                        // STATUS
                        // ------------------------------------------

                        const status =
                            data.status ??
                            "--";


                        // ------------------------------------------
                        // DEVICE
                        // ------------------------------------------

                        let device =
                            "--";


                        if (
                            data.device
                        ) {

                            device =
                                data.device;


                            if (
                                data.state === true
                            ) {

                                device +=
                                    " - ON";

                            }

                            else if (
                                data.state === false
                            ) {

                                device +=
                                    " - OFF";

                            }

                        }


                        // ------------------------------------------
                        // SOURCE
                        // ------------------------------------------

                        const source =
                            data.source ??
                            "--";


                        // ------------------------------------------
                        // TIMESTAMP
                        // ------------------------------------------

                        const timestamp =
                            data.timestamp ??
                            data.lastUpdate ??
                            "--";


                        // ------------------------------------------
                        // CREATE TABLE ROW
                        // ------------------------------------------

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
                    "❌ History Firebase error:",
                    error
                );


                historyBody.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            class="empty-message"
                        >

                            ❌ Firebase Error

                            <br><br>

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


    if (!input) return;


    const filter =
        input.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#historyBody tr"
        );


    rows.forEach(
        (row) => {

            const text =
                row.innerText
                    .toLowerCase();


            row.style.display =
                text.includes(filter)
                    ? ""
                    : "none";

        }
    );

}


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    const user =
        auth.currentUser;


    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    const logoutActivity = {

        action: "LOGOUT",

        email:
            user.email,

        uid:
            user.uid,

        timestamp:
            new Date().toLocaleString(),

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    database
        .ref(
            "SmartStorage/loginActivity"
        )
        .push(logoutActivity)

        .then(() => {

            return auth.signOut();

        })

        .then(() => {

            window.location.href =
                "index.html";

        })

        .catch((error) => {

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


// ==========================================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================================

window.logout =
    logout;

window.searchTable =
    searchTable;
