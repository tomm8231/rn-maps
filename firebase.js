// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJW5P3q71ajvvZMBR2XAg-0sA1dJ_TkFI",
  authDomain: "photo-location-3a1b5.firebaseapp.com",
  projectId: "photo-location-3a1b5",
  storageBucket: "photo-location-3a1b5.appspot.com",
  messagingSenderId: "698769940441",
  appId: "1:698769940441:web:f81c08ca2510c7171e43c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }