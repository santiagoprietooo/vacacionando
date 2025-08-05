import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Función para obtener el nombre de un usuario por su ID.
 * @param {String} id ID del usuario.
 * @returns {Promise<String>} Nombre del usuario. Si no hay nombre de usuario, retorna su email.
 */
export async function getUserEmail(id) {
    const userRef = doc(db, "users", id);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        console.error("Usuario no encontrado:", id);
        return;
    }

    return snapshot.data().email;
}

/**
* 
* @param {string} id 
* @returns {{id: string, email: string, displayName: string, bio: string, traveledTo: string}}
*/
export async function getUserProfileById(id, loading, error) {
    try {
        loading.value = true;

        const profileRef = doc(db, `/users/${id}`);
        const profileDocument = await getDoc(profileRef);

        if (!profileDocument.exists()) {
            return loading.value = false, error.value = {
                state: true,
                message: "No se encontró el perfil."
            }
        }

        return loading.value = false, {
            id: profileDocument.id,
            email: profileDocument.data().email,
            displayName: profileDocument.data().displayName,
            bio: profileDocument.data().bio,
            traveledTo: profileDocument.data().traveledTo
        };
    } catch (err) {
        console.error("Error al obtener el perfil del usuario:", err);
    }
}

/**
* 
* @param {string} id 
* @param {{displayName: string, bio: string, traveledTo: string}} data
*/

export async function updateUserProfile(id, {displayName, bio, traveledTo}){
    const profileRef = doc(db, `/users/${id}`);

    await updateDoc(profileRef, {
        displayName,
        bio,
        traveledTo
    });
}