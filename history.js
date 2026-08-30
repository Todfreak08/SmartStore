```javascript
async function loadHistory() {

    const body = document.getElementById("historyBody");

    body.innerHTML = `
        <tr>
            <td colspan="6" class="empty">
                Reading LittleFS history...
            </td>
        </tr>
    `;

    try {

        const response = await fetch("/api/history");

        if (!response.ok) {
            throw new Error("History request failed");
        }

        const records = await response.json();

        // Newest record first
        records.reverse();

        document.getElementById("totalRecords").textContent =
            records.length;

        if (records.length === 0) {

            body.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No records have been stored yet.
                    </td>
                </tr>
            `;

            document.getElementById("latestFloat").textContent = "--";
            document.getElementById("latestString").textContent = "--";

            return;
        }


        document.getElementById("latestFloat").textContent =
            Number(records[0].float).toFixed(2);

        document.getElementById("latestString").textContent =
            records[0].string;


        body.innerHTML = "";


        records.forEach((record, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td class="number">
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(record.date)}
                </td>

                <td>
                    ${escapeHTML(record.time)}
                </td>

                <td class="float-value">
                    ${Number(record.float).toFixed(2)}
                </td>

                <td class="integer-value">
                    ${Number(record.integer)}
                </td>

                <td class="string-value">
                    ${escapeHTML(record.string)}
                </td>

            `;

            body.appendChild(row);

        });

    }

    catch(error) {

        console.error(error);

        body.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to connect to ESP32.
                    <br><br>
                    Make sure you are connected to
                    SmartStorage-ESP32.
                </td>
            </tr>
        `;

    }

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


loadHistory();


// Automatically refresh history every 5 seconds
setInterval(loadHistory, 5000);
```
