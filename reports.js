// --------------------
// Authentication
// --------------------

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

    }

});

// --------------------
// Logout
// --------------------

function logout() {

    auth.signOut().then(() => {

        window.location.href = "index.html";

    });

}

// --------------------
// Report Variables
// --------------------

let historyData = [];

// --------------------
// Read History
// --------------------

database.ref("History").on("value", (snapshot) => {

    historyData = [];

    if (!snapshot.exists()) {

        document.getElementById("totalRecords").innerHTML = "--";

        document.getElementById("avgTemp").innerHTML = "-- °C";

        document.getElementById("avgHumidity").innerHTML = "-- %";

        document.getElementById("motionCount").innerHTML = "--";

        document.getElementById("latestReading").innerHTML =
            "Waiting for ESP32...";

        return;

    }

    let tempTotal = 0;

    let humidityTotal = 0;

    let motionEvents = 0;

    snapshot.forEach((child) => {

        const data = child.val();

        historyData.push(data);

        tempTotal += Number(data.temperature || 0);

        humidityTotal += Number(data.humidity || 0);

        if (data.motion === "Motion Detected") {

            motionEvents++;

        }

    });

    const count = historyData.length;

    document.getElementById("totalRecords").innerHTML = count;

    document.getElementById("avgTemp").innerHTML =
        (tempTotal / count).toFixed(1) + " °C";

    document.getElementById("avgHumidity").innerHTML =
        (humidityTotal / count).toFixed(1) + " %";

    document.getElementById("motionCount").innerHTML =
        motionEvents;

    const latest = historyData[count - 1];

    document.getElementById("latestReading").innerHTML =

        "Temperature: " + latest.temperature + " °C | " +

        "Humidity: " + latest.humidity + " % | " +

        "Motion: " + latest.motion + " | " +

        latest.timestamp;

});

// --------------------
// Export CSV
// --------------------

function exportCSV() {

    if (historyData.length === 0) {

        alert("No report available.");

        return;

    }

    let csv =

"Timestamp,Temperature,Humidity,Motion,Status\n";

    historyData.forEach((item) => {

        csv +=

`${item.timestamp},${item.temperature},${item.humidity},${item.motion},${item.status}\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "SmartStorageReport.csv";

    a.click();

    window.URL.revokeObjectURL(url);

}