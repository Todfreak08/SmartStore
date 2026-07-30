// If already logged in, go directly to the dashboard.
auth.onAuthStateChanged((user) => {

    if (user) {

        window.location.href = "dashboard.html";

    }

});

function login() {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    message.innerHTML = "";

    if (email === "" || password === "") {

        message.innerHTML = "Please enter your email and password.";

        return;

    }

    auth.signInWithEmailAndPassword(email, password)

        .then(() => {

            window.location.href = "dashboard.html";

        })

        .catch((error) => {

            message.innerHTML = error.message;

        });

}
