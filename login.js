function login() {

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        })
        .catch(function(error) {

            alert(error.message);

        });

}
