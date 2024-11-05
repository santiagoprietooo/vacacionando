import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from './firebase';
import { getUserProfileById, updateUserProfile } from "./user-profile";

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    traveledTo: null,
    fullyLoaded: false
};

let observers = [];

onAuthStateChanged(auth, async user => {
    if(user){
            loggedUser = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName
        }
        
        getUserProfileById(user.uid)
        .then(userProfile => {
            loggedUser = {
                ...loggedUser,
                bio: userProfile.bio,
                traveledTo: userProfile.traveledTo,
                fullyLoaded: true
            }
            notifyAll();
        });
    } else {
        loggedUser = {
            id: null,
            email: null,
            displayName: null,
            bio: null,
            traveledTo: null,
            fullyLoaded: false
        }
    }

    notifyAll();
});

export async function newUser({ email, password }) {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', user.user.uid);

        await setDoc(userRef, {
            id: user.user.uid,
            email
        });

        console.log("Se creó la cuenta con éxito: ", user);
    } catch (error) {
        loggedUser = {
            id: null,
            email: null,
            displayName: null,
            bio: null,
            traveledTo: null,
            fullyLoaded: false
        };
        console.error("[auth.js newUser] Error al tratar de crear la cuenta: ", error);
    }
}

export async function login({email, password}) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log("Se inició la sesión con éxito: ", user);
    } catch(error) {
        console.error("[auth.js login] Error al tratar de iniciar sesión: ", error);
        throw error;
    }
}

/**
 * 
 * @param {{displayName: string, bio: string, traveledTo: string}} data
 * @returns {Promise<null>}
 */

export async function editMyProfile({displayName, bio, traveledTo}) {
    try {
        await updateProfile(auth.currentUser, {displayName});

        await updateUserProfile(loggedUser.id, {displayName, bio, traveledTo});

        loggedUser = {
            ...loggedUser,
            displayName,
            bio,
            traveledTo
        }
        notifyAll();
    } catch (error) {
        console.error("[auth.js editMyProfile] Error al tratar de editar el perfil: ", error);
        throw error;
    }
}

export async function logout() {
    await signOut(auth);
}

/**
 * 
 * @param {Function} callback 
 */

export function subscribeToAuthChanges(callback) {
    observers.push(callback);

    notify(callback);
}

/**
 * 
 * @param {Function} callback 
 */

function notify(callback) {
    callback({...loggedUser});
}

function notifyAll() {
    observers.forEach(callback => notify(callback));
}