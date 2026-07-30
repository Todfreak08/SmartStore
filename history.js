// ----------------------------
// Authentication
// ----------------------------

auth.onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "index.html";

    }

});

// ----------------------------
// Logout
// ----------------------------

function logout() {

    auth.signOut().then(() => {

        window.location.href = "index.html";

    });

}

// ----------------------------
// History Listener
// ----------------------------

const tbody = document.getElementById("historyBody");

database.ref("History").on("value", (snapshot) => {

    tbody.innerHTML = "";

    if (!snapshot.exists()) {

        tbody.innerHTML = `
        <tr>
            <td colspan="5" class="empty-message">
                Waiting for ESP32 to send history...
            </td>
        </tr>
        `;

        return;

    }

    snapshot.forEach((child) => {

        const data = child.val();

        const row = `

        <tr>

        <td>${data.timestamp || "--"}</td>

        <td>${data.temperature ?? "--"} °C</td>

        <td>${data.humidity ?? "--"} %</td>

        <td>${data.motion || "--"}</td>

        <td>${data.status || "--"}</td>

        </tr>

        `;

        tbody.innerHTML += row;

    });

});

// ----------------------------
// Search
// ----------------------------

function searchTable() {

    let filter =
        document.getElementById("searchInput")
        .value
        .toUpperCase();

    let table =
        document.getElementById("historyTable");

    let tr =
        table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {

        let found = false;

        let td = tr[i].getElementsByTagName("td");

        for (let j = 0; j < td.length; j++) {

            if (td[j]) {

                let txt = td[j].textContent;

                if (txt.toUpperCase().indexOf(filter) > -1) {

                    found = true;

                }

            }

        }

        tr[i].style.display =
            found ? "" : "none";

    }

}