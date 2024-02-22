// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNX-p8DRubGnM8K3QgtHi_s7ccok5BaIE",
  authDomain: "myproject-53bda.firebaseapp.com",
  projectId: "myproject-53bda",
  storageBucket: "myproject-53bda.appspot.com",
  messagingSenderId: "203480973703",
  appId: "1:203480973703:web:2416f078cbf97d7a005322",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { app, database };
