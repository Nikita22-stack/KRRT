// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhQHdOnwFlr99rP4rCqPAs8ScGM9hc3UY",
    authDomain: "aura-database-6b61a.firebaseapp.com",
    databaseURL: "https://aura-database-6b61a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "aura-database-6b61a",
    storageBucket: "aura-database-6b61a.appspot.com",
    messagingSenderId: "9987964080",
    appId: "1:9987964080:web:22618c12804178e05c8f75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get };