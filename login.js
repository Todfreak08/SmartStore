<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Smart Storage Monitoring System</title>

    <link
        rel="stylesheet"
        href="style.css">

</head>


<body class="login-body">


<div class="login-container">

    <div class="login-header">

        <div class="logo-group">

            <img
                src="pcc.jpg"
                alt="PCC Logo">

            <img
                src="bsit.jpeg"
                alt="BSIT Logo">

        </div>


        <h2>
            SMART STORAGE MONITORING SYSTEM
        </h2>


        <p>
            IoT Environmental Monitoring and Data Logging
        </p>

    </div>


    <!-- LOGIN FORM -->

    <form id="loginForm">


        <div class="input-group">

            <label for="email">
                Email
            </label>

            <input
                type="email"
                id="email"
                placeholder="Enter your email"
                autocomplete="email"
                required>

        </div>


        <div class="input-group">

            <label for="password">
                Password
            </label>

            <input
                type="password"
                id="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                required>

        </div>


        <button
            type="submit"
            class="login-btn"
            id="loginButton">

            LOGIN

        </button>


        <p
            id="message"
            style="
                margin-top:15px;
                text-align:center;
                color:red;
            ">
        </p>


    </form>


</div>


<!-- =====================================================
     FIREBASE
====================================================== -->

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-database-compat.js"></script>


<!-- YOUR FIREBASE CONFIG -->

<script src="firebase-config.js"></script>


<!-- LOGIN SCRIPT -->

<script src="login.js"></script>


</body>

</html>
