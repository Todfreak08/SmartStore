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
// LOAD HISTORY
// ==========================================================

function loadHistory() {

    const historyTable =
        document.getElementById(
            "historyTable"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    if (!historyTable) {

        console.error(
            "historyTable was not found."
        );

        return;

    }


    database
        .ref("SmartStorage/history")
        .on(

            "value",

            (snapshot) => {

                console.log(
                    "Firebase history:",
                    snapshot.val()
                );


                historyTable.innerHTML =
                    "";


                if (!snapshot.exists()) {

                    if (emptyMessage) {

                        emptyMessage.style.display =
                            "block";

                    }

                    return;

                }


                if (emptyMessage) {

                    emptyMessage.style.display =
                        "none";

                }


                const history =
                    snapshot.val();


                const records =
                    Object.entries(history);


                // Newest first

                records.reverse();


                records.forEach(
                    ([id, data]) => {

                        const row =
                            document.createElement(
                                "tr"
                            );


                        // ----------------------------------
                        // DATA
                        // ----------------------------------

                        const temperature =
                            data.temperature ??
                            "--";


                        const humidity =
                            data.humidity ??
                            "--";


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


                        const status =
                            data.status ??
                            "--";


                        const source =
                            data.source ??
                            "--";


                        const timestamp =
                            data.timestamp ??
                            "--";


                        // ----------------------------------
                        // DEVICE ACTION
                        // ----------------------------------

                        let deviceInfo =
                            "--";


                        if (
                            data.device
                        ) {

                            const device =
                                data.device;


                            const state =
                                Boolean(
                                    data.state
                                );


                            let deviceName =
                                device;


                            if (
                                device ===
                                "light"
                            ) {

                                deviceName =
                                    "💡 Light";

                            }

                            else if (
                                device ===
                                "fan"
                            ) {

                                deviceName =
                                    "🌀 Fan";

                            }

                            else if (
                                device ===
                                "door"
                            ) {

                                deviceName =
                                    "🚪 Door";

                            }

                            else if (
                                device ===
                                "alarm"
                            ) {

                                deviceName =
                                    "🚨 Alarm";

                            }


                            let stateText =
                                state
                                    ? "ON"
                                    : "OFF";


                            if (
                                device ===
                                "door"
                            ) {

                                stateText =
                                    state
                                        ? "OPEN"
                                        : "CLOSED";

                            }


                            deviceInfo =
                                deviceName +
                                " - " +
                                stateText;

                        }


                        // ----------------------------------
                        // BUILD ROW
                        // ----------------------------------

                        row.innerHTML = `

                            <td>
                                ${timestamp}
                            </td>

                            <td>
                                ${temperature}
                                °C
                            </td>

                            <td>
                                ${humidity}
                                %
                            </td>

                            <td>
                                ${motion}
                            </td>

                            <td>
                                ${status}
                            </td>

                            <td>
                                ${deviceInfo}
                            </td>

                            <td>
                                ${source}
                            </td>

                        `;


                        historyTable
                            .appendChild(
                                row
                            );

                    }
                );

            },

            (error) => {

                console.error(
                    "History Firebase error:",
                    error
                );


                if (emptyMessage) {

                    emptyMessage.innerHTML =
                        "❌ Unable to load Firebase history: " +
                        error.message;

                    emptyMessage.style.display =
                        "block";

                }

            }

        );

}


// ==========================================================
// MAKE LOGOUT AVAILABLE
// ==========================================================

window.logout =
    logout;
