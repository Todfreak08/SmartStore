function login() {
    
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();
    
    if (user === "admin" && pass === "admin123") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Username or Password");
    }
}