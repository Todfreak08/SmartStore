<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Smart Storage Monitoring System</title>

    <link rel="stylesheet" href="style.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

    <!-- =========================
         SIDEBAR
    ========================== -->

    <div class="sidebar">

        <h2>📦 Smart Storage</h2>

        <a href="dashboard.html" class="active">
            🏠 Dashboard
        </a>

        <a href="history.html">
            📋 History
        </a>

        <a href="alerts.html">
            🚨 Alerts
        </a>

        <a href="reports.html">
            📊 Reports
        </a>

        <a href="settings.html">
            ⚙️ Settings
        </a>

        <a href="profile.html">
            👤 Profile
        </a>

        <a href="about.html">
            ℹ️ About
        </a>

        <button class="logout-btn" onclick="logout()">
            Logout
        </button>

    </div>


    <!-- =========================
         MAIN CONTENT
    ========================== -->

    <div class="main-content">

        <!-- TOP BAR -->

        <div class="top-bar">

            <h1>Dashboard</h1>

            <div class="user-card">

                Logged in as

                <b id="userEmail">
                    Loading...
                </b>

            </div>

        </div>


        <!-- =========================
             ENVIRONMENT CARDS
        ========================== -->

        <div class="card-grid">

            <!-- TEMPERATURE -->

            <div class="card">

                <h3>🌡 Temperature</h3>

                <h1 id="temperature">
                    -- °C
                </h1>

                <p id="temperatureSource">
                    Waiting for data...
                </p>

            </div>


            <!-- HUMIDITY -->

            <div class="card">

                <h3>💧 Humidity</h3>

                <h1 id="humidity">
                    -- %
                </h1>

                <p id="humiditySource">
                    Waiting for data...
                </p>

            </div>


            <!-- MOTION -->

            <div class="card">

                <h3>🚶 Motion</h3>

                <h1 id="motion">
                    Waiting...
                </h1>

                <p>
                    PIR Sensor / Manual
                </p>

            </div>

        </div>


        <!-- =========================
             STORAGE STATUS
        ========================== -->

        <div class="status-card">

            <h2>Storage Status</h2>

            <h1 id="storageStatus">
                Waiting for data...
            </h1>

            <p id="lastUpdate">
                No data received yet.
            </p>

        </div>


        <!-- =========================
             MANUAL DATA ENTRY
        ========================== -->

        <div class="chart-card">

            <h2>📝 Manual Data Entry</h2>

            <p>
                Enter storage environmental data manually.
                The information will be saved directly to Firebase.
            </p>

            <div class="manual-form">

                <!-- TEMPERATURE -->

                <div class="input-group">

                    <label for="manualTemperature">
                        Temperature (°C)
                    </label>

                    <input
                        type="number"
                        id="manualTemperature"
                        placeholder="Example: 28.5"
                        step="0.1">

                </div>


                <!-- HUMIDITY -->

                <div class="input-group">

                    <label for="manualHumidity">
                        Humidity (%)
                    </label>

                    <input
                        type="number"
                        id="manualHumidity"
                        placeholder="Example: 65"
                        min="0"
                        max="100"
                        step="0.1">

                </div>


                <!-- MOTION -->

                <div class="input-group">

                    <label for="manualMotion">
                        Motion
                    </label>

                    <select id="manualMotion">

                        <option value="false">
                            No Motion
                        </option>

                        <option value="true">
                            Motion Detected
                        </option>

                    </select>

                </div>


                <button
                    class="login-btn"
                    type="button"
                    onclick="saveManualData()">

                    💾 SAVE DATA

                </button>

                <p id="manualMessage"></p>

            </div>

        </div>


        <!-- =========================
             DEVICE CONTROLS
        ========================== -->

        <div class="chart-card">

            <h2>🎛 Device Controls</h2>

            <p>
                Changes made to these switches are automatically
                saved to Firebase Realtime Database.
            </p>


            <!-- LIGHT -->

            <div class="control-row">

                <div class="control-info">

                    <span class="control-icon">
                        💡
                    </span>

                    <div>

                        <strong>Light</strong>

                        <small id="lightStatus">
                            OFF
                        </small>

                    </div>

                </div>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="lightSwitch"
                        onchange="updateDeviceSwitch('light', this.checked)">

                    <span class="slider"></span>

                </label>

            </div>


            <!-- FAN -->

            <div class="control-row">

                <div class="control-info">

                    <span class="control-icon">
                        🌀
                    </span>

                    <div>

                        <strong>Fan</strong>

                        <small id="fanStatus">
                            OFF
                        </small>

                    </div>

                </div>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="fanSwitch"
                        onchange="updateDeviceSwitch('fan', this.checked)">

                    <span class="slider"></span>

                </label>

            </div>


            <!-- STORAGE DOOR -->

            <div class="control-row">

                <div class="control-info">

                    <span class="control-icon">
                        🚪
                    </span>

                    <div>

                        <strong>Storage Door</strong>

                        <small id="doorStatus">
                            CLOSED
                        </small>

                    </div>

                </div>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="doorSwitch"
                        onchange="updateDeviceSwitch('door', this.checked)">

                    <span class="slider"></span>

                </label>

            </div>


            <!-- ALARM -->

            <div class="control-row">

                <div class="control-info">

                    <span class="control-icon">
                        🚨
                    </span>

                    <div>

                        <strong>Alarm</strong>

                        <small id="alarmStatus">
                            OFF
                        </small>

                    </div>

                </div>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="alarmSwitch"
                        onchange="updateDeviceSwitch('alarm', this.checked)">

                    <span class="slider"></span>

                </label>

            </div>


            <!-- MANUAL MOTION -->

            <div class="control-row">

                <div class="control-info">

                    <span class="control-icon">
                        🚶
                    </span>

                    <div>

                        <strong>Motion Sensor</strong>

                        <small id="motionSwitchStatus">
                            OFF
                        </small>

                    </div>

                </div>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="motionSwitch"
                        onchange="updateDeviceSwitch('motion', this.checked)">

                    <span class="slider"></span>

                </label>

            </div>

        </div>


        <!-- =========================
             LIVE CHART
        ========================== -->

        <div class="chart-card">

            <h2>📈 Live Environment</h2>

            <canvas id="environmentChart"></canvas>

        </div>


        <!-- =========================
             DATABASE CONNECTION STATUS
        ========================== -->

        <div class="status-card">

            <h2>🔥 Firebase Connection</h2>

            <h3 id="firebaseStatus">
                Connecting...
            </h3>

            <p>
                Real-time database synchronization
            </p>

        </div>

    </div>


    <!-- =========================
         FIREBASE
    ========================== -->

    <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-database-compat.js"></script>


    <!-- YOUR FIREBASE CONFIG -->

    <script src="firebase-config.js"></script>


    <!-- DASHBOARD SCRIPT -->

    <script src="dashboard.js"></script>

</body>

</html>
