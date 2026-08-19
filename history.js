// =====================================================
// SMART STORAGE HISTORY
// ESP32 → Firebase → Website
// =====================================================


// =====================================================
// LOGIN CHECK
// =====================================================

auth.onAuthStateChanged(function(user) {

    if (!user) {

        window.location.href = "index.html";

        return;

    }


    const email =
        document.getElementById("userEmail");


    if (email) {

        email.textContent =
            user.email;

    }

});



// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            auth.signOut()
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



// =====================================================
// FIREBASE STATUS
// =====================================================

const firebaseStatus =
    document.getElementById(
        "firebaseStatus"
    );



// =====================================================
// HISTORY REFERENCE
// =====================================================
//
// IMPORTANT:
//
// ESP32 writes:
//
// smartStorage/history
//
// NOT:
//
// History
//
// NOT:
//
// SmartStorage/history
//
// =====================================================

const historyRef =
    database.ref(
        "smartStorage/history"
    );



// =====================================================
// LOAD HISTORY
// =====================================================

historyRef.on(

    "value",

    function(snapshot) {

        console.log(
            "ESP32 HISTORY:",
            snapshot.val()
        );


        if (firebaseStatus) {

            firebaseStatus.textContent =
                "● Firebase Connected";

            firebaseStatus.style.color =
                "#28a745";

        }


        const tbody =
            document.getElementById(
                "historyBody"
            );


        const message =
            document.getElementById(
                "historyMessage"
            );


        if (!tbody) {

            return;

        }


        tbody.innerHTML = "";



        // =================================================
        // NO DATA
        // =================================================

        if (!snapshot.exists()) {

            if (message) {

                message.textContent =
                    "Waiting for ESP32 data...";

                message.style.display =
                    "block";

            }

            return;

        }


        if (message) {

            message.style.display =
                "none";

        }



        // =================================================
        // CONVERT FIREBASE RECORDS TO ARRAY
        // =================================================

        const records = [];


        snapshot.forEach(function(child) {

            const data =
                child.val();


            records.push({

                key:
                    child.key,

                data:
                    data

            });

        });



        // =================================================
        // NEWEST FIRST
        // =================================================

        records.reverse();



        // =================================================
        // DISPLAY RECORDS
        // =================================================

        records.forEach(function(record) {

            const data =
                record.data;


            const row =
                document.createElement(
                    "tr"
                );


            const date =
                data.date ||
                "-";


            const time =
                data.time ||
                "-";


            const timestamp =
                data.timestamp ||
                "-";


            const temperature =
                data.temperature !== undefined
                    ? Number(
                        data.temperature
                    ).toFixed(1) + " °C"
                    : "-";


            const humidity =
                data.humidity !== undefined
                    ? Number(
                        data.humidity
                    ).toFixed(1) + " %"
                    : "-";


            let motion =
                data.motion;


            if (motion === true) {

                motion =
                    "Motion Detected";

            }

            else if (motion === false) {

                motion =
                    "No Motion";

            }

            else {

                motion =
                    motion || "-";

            }


            const status =
                data.status ||
                "-";


            const source =
                data.source ||
                "ESP32";



            row.innerHTML = `

                <td>${escapeHTML(date)}</td>

                <td>${escapeHTML(time)}</td>

                <td>${escapeHTML(timestamp)}</td>

                <td>${escapeHTML(temperature)}</td>

                <td>${escapeHTML(humidity)}</td>

                <td>${escapeHTML(motion)}</td>

                <td>
                    <strong>
                        ${escapeHTML(status)}
                    </strong>
                </td>

                <td>${escapeHTML(source)}</td>

            `;


            tbody.appendChild(row);

        });

    },


    function(error) {

        console.error(
            "History Firebase error:",
            error
        );


        if (firebaseStatus) {

            firebaseStatus.textContent =
                "● Firebase Error";

            firebaseStatus.style.color =
                "#dc3545";

        }


        const message =
            document.getElementById(
                "historyMessage"
            );


        if (message) {

            message.textContent =
                "Unable to load Firebase history: " +
                error.message;

            message.style.display =
                "block";

        }

    }

);



// =====================================================
// SEARCH
// =====================================================

const searchInput =
    document.getElementById(
        "historySearch"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function() {

            const filter =
                searchInput.value
                    .toLowerCase();


            const rows =
                document.querySelectorAll(
                    "#historyBody tr"
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
// SECURITY
// Prevent Firebase values from injecting HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}
