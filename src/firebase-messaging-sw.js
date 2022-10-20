importScripts("https://www.gstatic.com/firebasejs/9.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.12.1/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyCD4LDXppFNhj4c95Js7UDOyLPDRE50f5Y",
    authDomain: "la-jatata-cloud.firebaseapp.com",
    projectId: "la-jatata-cloud",
    storageBucket: "la-jatata-cloud.appspot.com",
    messagingSenderId: "289856671492",
    appId: "1:289856671492:web:51b43fb84356aed253ca51"
});
const messaging = firebase.messaging();