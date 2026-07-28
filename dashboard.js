// Reference to SmartStorage in Firebase
const storageRef = database.ref("SmartStorage");

// Read data in real time
storageRef.on("value", (snapshot) => {
    
    const data = snapshot.val();
    
    if (!data) return;
    
    document.getElementById("temperature").innerHTML =
        data.temperature + "°C";
    
    document.getElementById("humidity").innerHTML =
        data.humidity + "%";
    
    document.getElementById("motion").innerHTML =
        data.motion;
    
    document.getElementById("status").innerHTML =
        data.status;
    
    document.getElementById("lastUpdate").innerHTML =
        data.lastUpdate;
    
});



// Logout
function logout() {
    
    window.location.href = "index.html";
    
}



// Chart

const ctx =
    document.getElementById("environmentChart");

new Chart(ctx, {
    
    type: "line",
    
    data: {
        
        labels: ["1", "2", "3", "4", "5"],
        
        datasets: [
            
            {
                
                label: "Temperature",
                
                data: [28, 29, 27, 30, 28],
                
                borderColor: "#00ff99",
                
                fill: false
                
            },
            
            {
                
                label: "Humidity",
                
                data: [60, 64, 62, 66, 65],
                
                borderColor: "#00bfff",
                
                fill: false
                
            }
            
        ]
        
    }
    
});