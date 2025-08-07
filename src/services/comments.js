import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Agrega un comentario a un post existente.
 * @param {String} postID ID del post en el que se está comentando.
 * @param {String} comment Comentario del usuario.
 * @param {String} userID ID del usuario comentando.
 */
export async function saveComment(postID, comment, userID) {
    if (!postID || !comment || !userID) {
        console.error("Faltan parámetros:", { postID, comment, userID });
        return;
    }

    const trimmed = comment.trim();
    if (!trimmed) {
        return;
    }

    const commentData = {
        comment: trimmed,
        user_id: userID,
        created_at: serverTimestamp(),
    };

    try {
        const commentsRef = collection(db, "posted-by-users", postID, "comments");
        await addDoc(commentsRef, commentData);
    } catch (error) {
        console.error("Error guardando el comentario:", error);
    }
}

/**
 * Suscribe en tiempo real a los comentarios de un post
 * @param {string} postID
 * @param {function} callback - Recibe el array actualizado de comentarios
 * @returns {function} - Función para cancelar la suscripción
 */
export function subscribeToComments(postID, callback) {
    const commentsRef = collection(db, "posted-by-users", postID, "comments");
    const q = query(commentsRef, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(comments);
    });

    return unsubscribe;
}