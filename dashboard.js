const firebaseConfig = {
    apiKey: "AIzaSyA5QX9AyP2_ktesCGvbAA4nQ2Y2zO7Szrs",
    authDomain: "storage-monitoring-48413.firebaseapp.com",
    databaseURL: "https://storage-monitoring-48413-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "storage-monitoring-48413",
    storageBucket: "storage-monitoring-48413.firebasestorage.app",
    messagingSenderId: "836795478981",
    appId: "1:836795478981:web:a7ebcfa7676bb8a36ed1ac"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
