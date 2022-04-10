importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyBJqNVwk-6ecGRzcRbwrEqBJ9mjqZUdJH8",
    authDomain: "gmot-dev.firebaseapp.com",
    projectId: "gmot-dev",
    storageBucket: "gmot-dev.appspot.com",
    messagingSenderId: "382565803534",
    appId: "1:382565803534:web:3660c97ac562a57d1cbe5f",
    measurementId: "G-S2C2GWBZLM"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'devx.grosirmotor.id'
    const options = {
        body: payload.notification,
        icon: "https://file.sitama.co.id/storage/grosirmotor/thumbnail/grosirmotor.png",
    };
    return self.registration.showNotification(title, options);
});