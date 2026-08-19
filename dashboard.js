// ============================================================
// SMART STORAGE MONITORING SYSTEM
// DASHBOARD.JS
//
// FIREBASE STRUCTURE:
//
// smartStorage
// ├── commands
// │   ├── light
// │   ├── fan
// │   ├── door
// │   └── alarm
// │
// ├── esp32
// │   ├── online
// │   ├── ip
// │   ├── wifi
// │   ├── timestamp
// │   ├── light
// │   ├── fan
// │   ├── door
// │   └── alarm
// │
// ├── history
// └── alerts
//
// ============================================================


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let previousESP32Data = null;

let firstESP32Read = true;

let lastSavedTimestamp = null;


// ============================================================
// WAIT FOR PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("SMART STORAGE DASHBOARD STARTED");
    console.log("=================================");

    startDashboard();

});


// ============================================================
// START DASHBOARD
// ============================================================

function startDashboard() {

    // --------------------------------------------------------
    // CHECK FIREBASE
    // --------------------------------------------------------

    if (typeof firebase === "undefined") {

        console.error("Firebase library not loaded.");

        showFirebaseStatus(
            "❌ Firebase library not loaded",
            "error"
        );

        return;
    }


    // --------------------------------------------------------
    // CHECK DATABASE
    // --------------------------------------------------------

    if (typeof database === "undefined") {

        console.error("Firebase database is not available.");

        showFirebaseStatus(
            "❌ Firebase database not available",
            "error"
        );

        return;
    }


    console.log("Firebase database ready.");

    showFirebaseStatus(
        "🟢 Firebase Connected",
        "connected"
    );


    // ========================================================
    // AUTHENTICATION
    // ========================================================

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

            }

            else {

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


    // ========================================================
    // LOGOUT
    // ========================================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                if (
                    typeof auth !== "undefined"
                ) {

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


    // ========================================================
    // ESP32 REFERENCE
    // ========================================================

    const esp32Ref =
        database.ref("smartStorage/esp32");


    console.log(
        "Listening to:",
        "smartStorage/esp32"
    );


    // ========================================================
    // REAL-TIME ESP32 DATA
    // ========================================================

    esp32Ref.on(

        "value",

        function (snapshot) {

            console.log(
                "================================="
            );

            console.log(
                "ESP32 DATA RECEIVED"
            );

            console.log(
                snapshot.val()
            );

            console.log(
                "================================="
            );


            // ------------------------------------------------
            // NO DATA
            // ------------------------------------------------

            if (!snapshot.exists()) {

                console.warn(
                    "No smartStorage/esp32 data."
                );

                setOfflineState();

                return;

            }


            const data =
                snapshot.val();


            // ------------------------------------------------
            // UPDATE DASHBOARD
            // ------------------------------------------------

            updateDashboard(data);


            // ------------------------------------------------
            // SAVE ACTIVITY
            // ------------------------------------------------

            saveActivity(data);

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


    // ========================================================
    // DEVICE CONTROL SWITCHES
    // ========================================================

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


    // ========================================================
    // LOAD COMMANDS
    // ========================================================

    loadCommands();

}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {

    console.log(
        "Updating dashboard:",
        data
    );


    // ========================================================
    // ONLINE
    // ========================================================

    const online =
        convertBoolean(data.online);


    setText(
        "deviceStatus",
        online ? "ONLINE" : "OFFLINE"
    );


    const deviceStatus =
        document.getElementById("deviceStatus");


    if (deviceStatus) {

        deviceStatus.style.color =
            online
                ? "#28a745"
                : "#dc3545";

    }


    setText(
        "deviceSource",
        online
            ? "ESP32 connected"
            : "ESP32 offline"
    );


    // ========================================================
    // WIFI
    // ========================================================

    if (
        data.wifi !== undefined &&
        data.wifi !== null &&
        data.wifi !== ""
    ) {

        setText(
            "wifiSignal",
            formatWifi(data.wifi)
        );

    }

    else {

        setText(
            "wifiSignal",
            "--"
        );

    }


    // ========================================================
    // IP
    // ========================================================

    setText(
        "deviceIP",
        data.ip || "--"
    );


    // ========================================================
    // TIMESTAMP
    // ========================================================

    updateTimestamp(
        data.timestamp
    );


    // ========================================================
    // LIGHT
    // ========================================================

    updateLight(
        convertBoolean(data.light)
    );


    // ========================================================
    // FAN
    // ========================================================

    updateFan(
        convertBoolean(data.fan)
    );


    // ========================================================
    // DOOR
    // ========================================================

    updateDoor(
        convertBoolean(data.door)
    );


    // ========================================================
    // ALARM
    // ========================================================

    updateAlarm(
        convertBoolean(data.alarm)
    );

}


// ============================================================
// SAVE ACTIVITY
//
// Every meaningful ESP32 change is stored in:
//
// smartStorage/history
//
// ============================================================

function saveActivity(data) {

    if (!data) {

        return;

    }


    const timestamp =
        getTimestampValue(
            data.timestamp
        );


    // --------------------------------------------------------
    // Prevent duplicate saves
    // --------------------------------------------------------

    if (
        timestamp &&
        timestamp === lastSavedTimestamp
    ) {

        console.log(
            "Same timestamp. Activity already saved."
        );

        return;

    }


    // --------------------------------------------------------
    // First reading
    //
    // Save it because this is the first known ESP32 state.
    // --------------------------------------------------------

    if (firstESP32Read) {

        firstESP32Read = false;

        saveHistoryRecord(
            data,
            "ESP32 connected"
        );

        previousESP32Data =
            createCopy(data);

        lastSavedTimestamp =
            timestamp;

        return;

    }


    // --------------------------------------------------------
    // Check if something changed
    // --------------------------------------------------------

    const changes =
        detectChanges(
            previousESP32Data,
            data
        );


    if (changes.length === 0) {

        console.log(
            "No activity change detected."
        );

        previousESP32Data =
            createCopy(data);

        return;

    }


    // --------------------------------------------------------
    // Save every detected activity
    // --------------------------------------------------------

    changes.forEach(function (change) {

        saveHistoryRecord(
            data,
            change
        );


        // ----------------------------------------------------
        // Create alert when necessary
        // ----------------------------------------------------

        if (
            change === "Alarm turned ON" ||
            change === "Door opened"
        ) {

            saveAlert(
                data,
                change
            );

        }

    });


    previousESP32Data =
        createCopy(data);


    lastSavedTimestamp =
        timestamp;

}


// ============================================================
// DETECT CHANGES
// ============================================================

function detectChanges(
    oldData,
    newData
) {

    const changes = [];


    if (!oldData) {

        return changes;

    }


    // --------------------------------------------------------
    // ONLINE
    // --------------------------------------------------------

    if (
        convertBoolean(oldData.online) !==
        convertBoolean(newData.online)
    ) {

        changes.push(
            newData.online
                ? "ESP32 came ONLINE"
                : "ESP32 went OFFLINE"
        );

    }


    // --------------------------------------------------------
    // LIGHT
    // --------------------------------------------------------

    if (
        convertBoolean(oldData.light) !==
        convertBoolean(newData.light)
    ) {

        changes.push(
            convertBoolean(newData.light)
                ? "Light turned ON"
                : "Light turned OFF"
        );

    }


    // --------------------------------------------------------
    // FAN
    // --------------------------------------------------------

    if (
        convertBoolean(oldData.fan) !==
        convertBoolean(newData.fan)
    ) {

        changes.push(
            convertBoolean(newData.fan)
                ? "Fan turned ON"
                : "Fan turned OFF"
        );

    }


    // --------------------------------------------------------
    // DOOR
    // --------------------------------------------------------

    if (
        convertBoolean(oldData.door) !==
        convertBoolean(newData.door)
    ) {

        changes.push(
            convertBoolean(newData.door)
                ? "Door opened"
                : "Door closed"
        );

    }


    // --------------------------------------------------------
    // ALARM
    // --------------------------------------------------------

    if (
        convertBoolean(oldData.alarm) !==
        convertBoolean(newData.alarm)
    ) {

        changes.push(
            convertBoolean(newData.alarm)
                ? "Alarm turned ON"
                : "Alarm turned OFF"
        );

    }


    // --------------------------------------------------------
    // IP CHANGE
    // --------------------------------------------------------

    if (
        oldData.ip !== newData.ip &&
        newData.ip
    ) {

        changes.push(
            "ESP32 IP changed to " +
            newData.ip
        );

    }


    return changes;

}


// ============================================================
// SAVE HISTORY RECORD
// ============================================================

function saveHistoryRecord(
    data,
    activity
) {

    const historyRef =
        database.ref(
            "smartStorage/history"
        );


    const record =
        {

            activity: activity,

            timestamp:
                getTimestampForFirebase(
                    data.timestamp
                ),

            timestampRaw:
                data.timestamp || "",

            online:
                convertBoolean(
                    data.online
                ),

            ip:
                data.ip || "",

            wifi:
                data.wifi || "",

            light:
                convertBoolean(
                    data.light
                ),

            fan:
                convertBoolean(
                    data.fan
                ),

            door:
                convertBoolean(
                    data.door
                ),

            alarm:
                convertBoolean(
                    data.alarm
                ),

            source:
                "ESP32",

            createdAt:
                firebase.database.ServerValue.TIMESTAMP

        };


    historyRef
        .push(record)
        .then(function () {

            console.log(
                "History saved:",
                activity
            );

        })
        .catch(function (error) {

            console.error(
                "History save failed:",
                error
            );

        });

}


// ============================================================
// SAVE ALERT
// ============================================================

function saveAlert(
    data,
    message
) {

    const alertRef =
        database.ref(
            "smartStorage/alerts"
        );


    const alert =
        {

            message:
                message,

            timestamp:
                getTimestampForFirebase(
                    data.timestamp
                ),

            online:
                convertBoolean(
                    data.online
                ),

            ip:
                data.ip || "",

            wifi:
                data.wifi || "",

            light:
                convertBoolean(
                    data.light
                ),

            fan:
                convertBoolean(
                    data.fan
                ),

            door:
                convertBoolean(
                    data.door
                ),

            alarm:
                convertBoolean(
                    data.alarm
                ),

            source:
                "ESP32",

            createdAt:
                firebase.database.ServerValue.TIMESTAMP

        };


    alertRef
        .push(alert)
        .then(function () {

            console.log(
                "Alert saved:",
                message
            );

        })
        .catch(function (error) {

            console.error(
                "Alert save failed:",
                error
            );

        });

}


// ============================================================
// TIMESTAMP DISPLAY
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

        setText(
            "deviceDateTime",
            "Waiting for ESP32..."
        );


        setText(
            "lastUpdate",
            "No timestamp received yet."
        );


        return;

    }


    const date =
        convertTimestampToDate(
            timestamp
        );


    if (!date) {

        setText(
            "deviceDateTime",
            String(timestamp)
        );


        setText(
            "lastUpdate",
            "ESP32 timestamp"
        );


        return;

    }


    const formattedDate =
        date.toLocaleString(
            "en-PH",
            {

                timeZone:
                    "Asia/Manila",

                year:
                    "numeric",

                month:
                    "long",

                day:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    true

            }
        );


    setText(
        "deviceDateTime",
        formattedDate
    );


    setText(
        "lastUpdate",
        "Last ESP32 update: " +
        formattedDate
    );

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
// DEVICE CONTROL
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
                        "Command sent successfully:",
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
                "Commands received:",
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
// TIMESTAMP CONVERTER
// ============================================================

function convertTimestampToDate(
    timestamp
) {

    if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === ""
    ) {

        return null;

    }


    // Number
    if (
        typeof timestamp === "number"
    ) {

        // Seconds -> milliseconds
        if (
            timestamp < 100000000000
        ) {

            timestamp =
                timestamp * 1000;

        }


        const date =
            new Date(timestamp);


        return isNaN(
            date.getTime()
        )
            ? null
            : date;

    }


    // String
    const stringValue =
        String(timestamp);


    // Numeric string
    if (
        !isNaN(stringValue)
    ) {

        let number =
            Number(stringValue);


        if (
            number < 100000000000
        ) {

            number =
                number * 1000;

        }


        const date =
            new Date(number);


        return isNaN(
            date.getTime()
        )
            ? null
            : date;

    }


    // Date string
    const date =
        new Date(stringValue);


    return isNaN(
        date.getTime()
    )
        ? null
        : date;

}


// ============================================================
// GET TIMESTAMP VALUE
// ============================================================

function getTimestampValue(
    timestamp
) {

    if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === ""
    ) {

        return null;

    }


    const date =
        convertTimestampToDate(
            timestamp
        );


    if (!date) {

        return String(timestamp);

    }


    return date.getTime();

}


// ============================================================
// GET FIREBASE TIMESTAMP
// ============================================================

function getTimestampForFirebase(
    timestamp
) {

    const converted =
        getTimestampValue(
            timestamp
        );


    if (converted) {

        return converted;

    }


    return firebase.database.ServerValue.TIMESTAMP;

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
// CREATE COPY
// ============================================================

function createCopy(data) {

    return JSON.parse(
        JSON.stringify(data)
    );

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
