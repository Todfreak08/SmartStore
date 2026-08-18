// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// HISTORY.JS
//
// WEBSITE = VIEW ONLY
// ESP32   = CREATES THE LOGS
// FIREBASE = STORES THE LOGS
// ==========================================================


// ==========================================================
// AUTHENTICATION
// ==========================================================

auth.onAuthStateChanged(function (user) {

    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    const email =
        document.getElementById(
            "userEmail"
        );


    if (email) {

        email.textContent =
            user.email;

    }

});


// ==========================================================
// LOGOUT
// ==========================================================

function initializeLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            button.disabled =
                true;


            button.textContent =
                "Logging out...";


            auth.signOut()

                .then(function () {

                    window.location.href =
                        "index.html";

                })

                .catch(function (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    button.disabled =
                        false;


                    button.textContent =
                        "🚪 Logout";


                    alert(
                        "Logout failed: " +
                        error.message
                    );

                });

        }
    );

}


// ==========================================================
// FIREBASE CONNECTION STATUS
// ==========================================================

function initializeFirebaseStatus() {

    const status =
        document.getElementById(
            "firebaseStatus"
        );


    database
        .ref(".info/connected")
        .on(
            "value",
            function (snapshot) {

                if (!status) {

                    return;

                }


                if (
                    snapshot.val() === true
                ) {

                    status.textContent =
                        "● Firebase Connected";


                    status.style.color =
                        "#28a745";

                }

                else {

                    status.textContent =
                        "● Firebase Disconnected";


                    status.style.color =
                        "#dc3545";

                }

            }
        );

}


// ==========================================================
// LOAD ESP32 HISTORY
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


    // ======================================================
    // IMPORTANT
    // ======================================================
    //
    // ONLY READ:
    //
    // smartStorage/history
    //
    // The WEBSITE does NOT write here.
    //
    // ESP32 creates these records.
    //
    // ======================================================

    database
        .ref(
            "smartStorage/history"
        )
        .on(
            "value",
            function (snapshot) {

                historyBody.innerHTML =
                    "";


                if (
                    !snapshot.exists()
                ) {

                    historyBody.innerHTML = `

                        <tr>

                            <td
                                colspan="5"
                                style="
                                    text-align:center;
                                    padding:30px;
                                ">

                                📡 Waiting for ESP32
                                history logs...

                            </td>

                        </tr>

                    `;

                    return;

                }


                const records = [];


                snapshot.forEach(
                    function (child) {

                        records.push({

                            key:
                                child.key,

                            data:
                                child.val()

                        });

                    }
                );


                // =================================================
                // NEWEST FIRST
                // =================================================

                records.reverse();


                records.forEach(
                    function (record) {

                        const data =
                            record.data;


                        const row =
                            document.createElement(
                                "tr"
                            );


                        const date =
                            data.date ||
                            "--";


                        const time =
                            data.time ||
                            "--";


                        const timestamp =
                            data.timestamp ||
                            "--";


                        const source =
                            data.source ||
                            "ESP32";


                        const online =
                            data.online;


                        let deviceStatus =
                            "OFFLINE";


                        if (
                            online === true
                        ) {

                            deviceStatus =
                                "ONLINE";

                        }


                        row.innerHTML = `

                            <td>
                                ${escapeHTML(
                                    date
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    time
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    timestamp
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    source
                                )}
                            </td>

                            <td>

                                <span
                                    class="history-status
                                    ${
                                        online === true
                                            ? "normal"
                                            : "danger"
                                    }">

                                    ${deviceStatus}

                                </span>

                            </td>

                        `;


                        historyBody.appendChild(
                            row
                        );

                    }
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
                            style="
                                text-align:center;
                                color:#dc3545;
                                padding:30px;
                            ">

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
// SEARCH HISTORY
// ==========================================================

function searchTable() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const table =
        document.getElementById(
            "historyTable"
        );


    if (
        !input ||
        !table
    ) {

        return;

    }


    const filter =
        input.value
            .toUpperCase();


    const rows =
        table.getElementsByTagName(
            "tr"
        );


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const text =
            rows[i].textContent ||
            rows[i].innerText;


        if (
            text
                .toUpperCase()
                .indexOf(filter) > -1
        ) {

            rows[i].style.display =
                "";

        }

        else {

            rows[i].style.display =
                "none";

        }

    }

}


// ==========================================================
// SEARCH EVENT
// ==========================================================

function initializeSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "keyup",
        searchTable
    );

}


// ==========================================================
// ESCAPE HTML
// ==========================================================

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


// ==========================================================
// START HISTORY PAGE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLogout();

        initializeFirebaseStatus();

        initializeSearch();

        loadHistory();

    }
);
