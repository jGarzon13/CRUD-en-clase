// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDi14jcUjplDFgbEv-wKokiSdfOd_MPEaQ",
  authDomain: "mi-primera-basefuego.firebaseapp.com",
  projectId: "mi-primera-basefuego",
  storageBucket: "mi-primera-basefuego.firebasestorage.app",
  messagingSenderId: "954483324979",
  appId: "1:954483324979:web:669211298b505264e50b46"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
