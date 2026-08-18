// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// FIREBASE CONFIGURATION
// ==========================================================

// Firebase project configuration
const firebaseConfig = {

    apiKey:
        "AIzaSyA5QX9AyP2_ktesCGvbAA4nQ2Y2zO7Szrs",

    authDomain:
        "storage-monitoring-48413.firebaseapp.com",

    databaseURL:
        "https://storage-monitoring-48413-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "storage-monitoring-48413",

    storageBucket:
        "storage-monitoring-48413.firebasestorage.app",

    messagingSenderId:
        "836795478981",

    appId:
        "1:836795478981:web:a7ebcfa7676bb8a36ed1ac"

};


// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

if (!firebase.apps.length) {

    firebase.initializeApp(
        firebaseConfig
    );

}


// ==========================================================
// FIREBASE SERVICES
// ==========================================================

// Authentication
const auth =
    firebase.auth();


// Realtime Database
const database =
    firebase.database();


// ==========================================================
// DATABASE ROOT
// ==========================================================
//
// EVERYTHING in our project will use:
//
// smartStorage
//
// We will NOT use:
//
// SmartStorage
// storage
//
// ==========================================================

const smartStorageRef =
    database.ref("smartStorage");


// ==========================================================
// DATABASE SECTIONS
// ==========================================================

// ESP32 sensor data
const sensorDataRef =
    database.ref(
        "smartStorage/sensorData"
    );


// Website commands
const commandsRef =
    database.ref(
        "smartStorage/commands"
    );


// Sensor/history records
const historyRef =
    database.ref(
        "smartStorage/history"
    );


// Alerts
const alertsRef =
    database.ref(
        "smartStorage/alerts"
    );


// ==========================================================
// OPTIONAL DEBUG
// ==========================================================

console.log(
    "Firebase initialized successfully."
);

console.log(
    "Database:",
    database
);

console.log(
    "Smart Storage Firebase root:",
    smartStorageRef
);// ==========================================================
// SMART STORAGE MONITORING SYSTEM
// FIREBASE CONFIGURATION
// ==========================================================

// Firebase project configuration
const firebaseConfig = {

    apiKey:
        "AIzaSyA5QX9AyP2_ktesCGvbAA4nQ2Y2zO7Szrs",

    authDomain:
        "storage-monitoring-48413.firebaseapp.com",

    databaseURL:
        "https://storage-monitoring-48413-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "storage-monitoring-48413",

    storageBucket:
        "storage-monitoring-48413.firebasestorage.app",

    messagingSenderId:
        "836795478981",

    appId:
        "1:836795478981:web:a7ebcfa7676bb8a36ed1ac"

};


// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

if (!firebase.apps.length) {

    firebase.initializeApp(
        firebaseConfig
    );

}


// ==========================================================
// FIREBASE SERVICES
// ==========================================================

// Authentication
const auth =
    firebase.auth();


// Realtime Database
const database =
    firebase.database();


// ==========================================================
// DATABASE ROOT
// ==========================================================
//
// EVERYTHING in our project will use:
//
// smartStorage
//
// We will NOT use:
//
// SmartStorage
// storage
//
// ==========================================================

const smartStorageRef =
    database.ref("smartStorage");


// ==========================================================
// DATABASE SECTIONS
// ==========================================================

// ESP32 sensor data
const sensorDataRef =
    database.ref(
        "smartStorage/sensorData"
    );


// Website commands
const commandsRef =
    database.ref(
        "smartStorage/commands"
    );


// Sensor/history records
const historyRef =
    database.ref(
        "smartStorage/history"
    );


// Alerts
const alertsRef =
    database.ref(
        "smartStorage/alerts"
    );


// ==========================================================
// OPTIONAL DEBUG
// ==========================================================

console.log(
    "Firebase initialized successfully."
);

console.log(
    "Database:",
    database
);

console.log(
    "Smart Storage Firebase root:",
    smartStorageRef
);
