import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhwLgjNwNMVW35eiMwScA2jyE91hSJZhc",
    authDomain: "vacacionando-ar.firebaseapp.com",
    projectId: "vacacionando-ar",
    storageBucket: "vacacionando-ar.firebasestorage.app",
    messagingSenderId: "58017346672",
    appId: "1:58017346672:web:0352edf7fe5317fba2b0b5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);