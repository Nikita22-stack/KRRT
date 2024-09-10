// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDNYiaRdeWwLgcjGGG6GN74UxeFb-JuMM",
  authDomain: "aura-database-5930b.firebaseapp.com",
  databaseURL: "https://aura-database-5930b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aura-database-5930b",
  storageBucket: "aura-database-5930b.appspot.com",
  messagingSenderId: "994632018772",
  appId: "1:994632018772:web:7461156d0c6cbfdd2bb6c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };