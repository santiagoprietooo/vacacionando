import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhtvBLxQnS10OMAg5ZsgfTZfrZjiKNn3s",
    authDomain: "vacacionando-tp1.firebaseapp.com",
    projectId: "vacacionando-tp1",
    storageBucket: "vacacionando-tp1.firebasestorage.app",
    messagingSenderId: "920415190634",
    appId: "1:920415190634:web:2a3ab2372a4ef43e001413"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);