// ============================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
// Reads exactly:
// smartStorage/esp32
// ============================================================


// ============================================================
// WAIT FOR PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dashboard JavaScript started.");

    startDashboard();

});


// ============================================================
// START DASHBOARD
// ============================================================

function startDashboard() {

    // Make sure Firebase exists
    if (typeof firebase === "undefined") {

        console.error("Firebase library not loaded.");

        showFirebaseStatus(
            "❌ Firebase library not loaded",
            "error"
        );

        return;

    }


    // Make sure database exists
    if (typeof database === "undefined") {

        console.error("Firebase database is not available.");

        showFirebaseStatus(
            "❌ Firebase database not available",
            "error"
        );

        return;

    }


    console.log("Firebase initialized.");

    showFirebaseStatus(
        "🟢 Firebase Connected",
        "connected"
    );


    // --------------------------------------------------------
    // LOGIN USER
    // --------------------------------------------------------

    if (typeof auth !== "undefined") {

        auth.onAuthStateChanged(function (user) {

            const userEmail =
                document.getElementById("userEmail");


            if (user) {

                if (userEmail) {

                    userEmail.textContent =
                        user.email || "User";

                }

                console.log(
                    "Logged in:",
                    user.email
                );

            } else {

                if (userEmail) {

                    userEmail.textContent =
                        "Not logged in";

                }

                console.log(
                    "No authenticated user."
                );

            }

        });

    }


    // --------------------------------------------------------
    // LOGOUT
    // --------------------------------------------------------

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                if (typeof auth !== "undefined") {

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

                        });

                }

            }
        );

    }


    // --------------------------------------------------------
    // IMPORTANT:
    // EXACT FIREBASE PATH
    //
    // smartStorage/esp32
    // --------------------------------------------------------

    const esp32Ref =
        database.ref("smartStorage/esp32");


    // --------------------------------------------------------
    // REAL-TIME ESP32 DATA
    // --------------------------------------------------------

    esp32Ref.on(
        "value",
        function (snapshot) {

            console.log(
                "ESP32 Firebase data received:"
            );

            console.log(
                snapshot.val()
            );


            if (!snapshot.exists()) {

                console.warn(
                    "smartStorage/esp32 does not exist."
                );

                setOfflineState();

                return;

            }


            const data =
                snapshot.val();


            updateDashboard(data);

        },

        function (error) {

            console.error(
                "Firebase read error:",
                error
            );


            showFirebaseStatus(
                "❌ Firebase read error",
                "error"
            );

        }
    );


    // --------------------------------------------------------
    // DEVICE CONTROL LISTENERS
    // --------------------------------------------------------

    setupSwitch(
        "lightSwitch",
        "light"
    );

    setupSwitch(
        "fanSwitch",
        "fan"
    );

    setupSwitch(
        "doorSwitch",
        "door"
    );

    setupSwitch(
        "alarmSwitch",
        "alarm"
    );


    // --------------------------------------------------------
    // INITIAL COMMAND VALUES
    // --------------------------------------------------------

    loadCommands();

}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {

    console.log(
        "Updating dashboard with:",
        data
    );


    // ========================================================
    // ONLINE STATUS
    // ========================================================

    const online =
        convertBoolean(data.online);


    const deviceStatus =
        document.getElementById("deviceStatus");


    const deviceSource =
        document.getElementById("deviceSource");


    if (deviceStatus) {

        deviceStatus.textContent =
            online ? "ONLINE" : "OFFLINE";

        deviceStatus.style.color =
            online ? "#28a745" : "#dc3545";

    }


    if (deviceSource) {

        deviceSource.textContent =
            online
                ? "ESP32 connected"
                : "ESP32 offline";

    }


    // ========================================================
    // WIFI
    // ========================================================

    const wifi =
        data.wifi;


    const wifiElement =
        document.getElementById("wifiSignal");


    if (wifiElement) {

        if (
            wifi !== undefined &&
            wifi !== null &&
            wifi !== ""
        ) {

            wifiElement.textContent =
                formatWifi(wifi);

        } else {

            wifiElement.textContent =
                "--";

        }

    }


    // ========================================================
    // IP ADDRESS
    // ========================================================

    const ipElement =
        document.getElementById("deviceIP");


    if (ipElement) {

        ipElement.textContent =
            data.ip || "--";

    }


    // ========================================================
    // TIMESTAMP
    // ========================================================

    updateTimestamp(
        data.timestamp
    );


    // ========================================================
    // LIGHT
    // ========================================================

    const light =
        convertBoolean(data.light);


    updateLight(light);


    // ========================================================
    // FAN
    // ========================================================

    const fan =
        convertBoolean(data.fan);


    updateFan(fan);


    // ========================================================
    // DOOR
    // ========================================================

    const door =
        convertBoolean(data.door);


    updateDoor(door);


    // ========================================================
    // ALARM
    // ========================================================

    const alarm =
        convertBoolean(data.alarm);


    updateAlarm(alarm);

}


// ============================================================
// TIMESTAMP
// ============================================================

function updateTimestamp(timestamp) {

    const dateTimeElement =
        document.getElementById(
            "deviceDateTime"
        );


    const lastUpdateElement =
        document.getElementById(
            "lastUpdate"
        );


    if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === ""
    ) {

        if (dateTimeElement) {

            dateTimeElement.textContent =
                "Waiting for ESP32...";

        }

        if (lastUpdateElement) {

            lastUpdateElement.textContent =
                "No timestamp received yet.";

        }

        return;

    }


    let date;


    // Firebase timestamp number
    if (
        typeof timestamp === "number"
    ) {

        date =
            new Date(timestamp);

    }


    // Timestamp string
    else {

        // Try numeric string
        if (
            !isNaN(timestamp)
        ) {

            date =
                new Date(
                    Number(timestamp)
                );

        } else {

            date =
                new Date(timestamp);

        }

    }


    // Invalid timestamp
    if (
        isNaN(date.getTime())
    ) {

        console.warn(
            "Invalid timestamp:",
            timestamp
        );


        if (dateTimeElement) {

            dateTimeElement.textContent =
                String(timestamp);

        }

        if (lastUpdateElement) {

            lastUpdateElement.textContent =
                "ESP32 timestamp";

        }

        return;

    }


    // Philippine time
    const formattedDate =
        date.toLocaleString(
            "en-PH",
            {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


    if (dateTimeElement) {

        dateTimeElement.textContent =
            formattedDate;

    }


    if (lastUpdateElement) {

        lastUpdateElement.textContent =
            "Last ESP32 update: " +
            formattedDate;

    }

}


// ============================================================
// LIGHT
// ============================================================

function updateLight(state) {

    const status =
        state ? "ON" : "OFF";


    setText(
        "lightStatus",
        status
    );


    setText(
        "currentLight",
        status
    );


    setSwitch(
        "lightSwitch",
        state
    );

}


// ============================================================
// FAN
// ============================================================

function updateFan(state) {

    const status =
        state ? "ON" : "OFF";


    setText(
        "fanStatus",
        status
    );


    setText(
        "currentFan",
        status
    );


    setSwitch(
        "fanSwitch",
        state
    );

}


// ============================================================
// DOOR
// ============================================================

function updateDoor(state) {

    const status =
        state ? "OPEN" : "CLOSED";


    setText(
        "doorStatus",
        status
    );


    setText(
        "currentDoor",
        status
    );


    setSwitch(
        "doorSwitch",
        state
    );

}


// ============================================================
// ALARM
// ============================================================

function updateAlarm(state) {

    const status =
        state ? "ON" : "OFF";


    setText(
        "alarmStatus",
        status
    );


    setText(
        "currentAlarm",
        status
    );


    setSwitch(
        "alarmSwitch",
        state
    );

}


// ============================================================
// DEVICE SWITCH
// ============================================================

function setupSwitch(
    elementID,
    commandName
) {

    const switchElement =
        document.getElementById(
            elementID
        );


    if (!switchElement) {

        console.warn(
            "Switch not found:",
            elementID
        );

        return;

    }


    switchElement.addEventListener(
        "change",
        function () {

            const state =
                switchElement.checked;


            console.log(
                "Sending command:",
                commandName,
                state
            );


            database
                .ref(
                    "smartStorage/commands/" +
                    commandName
                )
                .set(state)
                .then(function () {

                    console.log(
                        "Command sent:",
                        commandName,
                        state
                    );

                })
                .catch(function (error) {

                    console.error(
                        "Command failed:",
                        error
                    );

                });

        }
    );

}


// ============================================================
// LOAD COMMANDS
// ============================================================

function loadCommands() {

    const commandsRef =
        database.ref(
            "smartStorage/commands"
        );


    commandsRef.on(
        "value",
        function (snapshot) {

            if (!snapshot.exists()) {

                return;

            }


            const commands =
                snapshot.val();


            console.log(
                "Commands:",
                commands
            );


            if (
                commands.light !== undefined
            ) {

                setSwitch(
                    "lightSwitch",
                    convertBoolean(
                        commands.light
                    )
                );

            }


            if (
                commands.fan !== undefined
            ) {

                setSwitch(
                    "fanSwitch",
                    convertBoolean(
                        commands.fan
                    )
                );

            }


            if (
                commands.door !== undefined
            ) {

                setSwitch(
                    "doorSwitch",
                    convertBoolean(
                        commands.door
                    )
                );

            }


            if (
                commands.alarm !== undefined
            ) {

                setSwitch(
                    "alarmSwitch",
                    convertBoolean(
                        commands.alarm
                    )
                );

            }

        }
    );

}


// ============================================================
// SET SWITCH
// ============================================================

function setSwitch(
    elementID,
    state
) {

    const element =
        document.getElementById(
            elementID
        );


    if (element) {

        element.checked =
            Boolean(state);

    }

}


// ============================================================
// SET TEXT
// ============================================================

function setText(
    elementID,
    value
) {

    const element =
        document.getElementById(
            elementID
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// BOOLEAN CONVERTER
// ============================================================

function convertBoolean(value) {

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "TRUE" ||
        value === "on" ||
        value === "ON" ||
        value === "open" ||
        value === "OPEN"
    ) {

        return true;

    }


    return false;

}


// ============================================================
// WIFI FORMAT
// ============================================================

function formatWifi(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "--";

    }


    const number =
        Number(value);


    if (!isNaN(number)) {

        return number + " dBm";

    }


    return String(value);

}


// ============================================================
// OFFLINE STATE
// ============================================================

function setOfflineState() {

    setText(
        "deviceStatus",
        "OFFLINE"
    );


    setText(
        "deviceSource",
        "Waiting for ESP32..."
    );


    setText(
        "wifiSignal",
        "--"
    );


    setText(
        "deviceIP",
        "--"
    );


    setText(
        "deviceDateTime",
        "Waiting for ESP32..."
    );


    setText(
        "lastUpdate",
        "No ESP32 data received yet."
    );

}


// ============================================================
// FIREBASE STATUS
// ============================================================

function showFirebaseStatus(
    message,
    type
) {

    const element =
        document.getElementById(
            "firebaseStatus"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    if (type === "error") {

        element.style.color =
            "#dc3545";

    }

    else {

        element.style.color =
            "#28a745";

    }

}
