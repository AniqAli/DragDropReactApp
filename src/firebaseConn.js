import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxGvqgGnqpd78tpYhj5my04zcYUZ6wWAY",
    authDomain: "dragdrop-react-app.firebaseapp.com",
    projectId: "dragdrop-react-app",
    storageBucket: "dragdrop-react-app.appspot.com",
    messagingSenderId: "264243864472",
    appId: "1:264243864472:web:609f212de547bdd39901ed",
    measurementId: "G-JBSCC8LD11"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { app, db };