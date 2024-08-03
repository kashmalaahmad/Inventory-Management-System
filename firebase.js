// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcbFR_80s87QnooYo2MOm05clxaWOxiRs",
  authDomain: "inventory-management-sys-e434a.firebaseapp.com",
  projectId: "inventory-management-sys-e434a",
  storageBucket: "inventory-management-sys-e434a.appspot.com",
  messagingSenderId: "998342676770",
  appId: "1:998342676770:web:bc8bca6268d35add85157b",
  measurementId: "G-FQY618WF9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore=getFirestore(app);

export {firestore};