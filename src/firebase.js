// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGZuLK5SwXFXRRL4f_IVHeaTfJD8lD5WQ",
  authDomain: "grocery-list-app-a7047.firebaseapp.com",
  projectId: "grocery-list-app-a7047",
  storageBucket: "grocery-list-app-a7047.appspot.com",
  messagingSenderId: "282873587634",
  appId: "1:282873587634:web:b01a1570bac7ba6b6766ab",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;
