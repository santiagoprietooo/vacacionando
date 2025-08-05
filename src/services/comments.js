import {
    arrayUnion,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Agrega un comentario a un post existente.
 * @param {String} postID
 * @param {String} comment
 * @param {String} userID
 */
export async function saveComment(postID, comment, userID) {
    if (!postID || !comment || !userID) {
        console.error("Faltan parámetros:", { postID, comment, userID });
        return {
            success: false,
            message: "postID, comment y userID son requeridos.",
        };
    }

    try {
        const postRef = doc(db, "posted-by-users", postID);
        const snapshot = await getDoc(postRef);

        if (!snapshot.exists()) {
            console.error("Post no encontrado:", postID);
            return { success: false, message: "Post no encontrado." };
        }

        const trimmed = comment.trim();
        if (!trimmed) {
            return { success: false, message: "Comentario vacío no permitido." };
        }

        const commentData = {
            comment: trimmed,
            user_id: userID,
            created_at: new Date().toISOString(),
        };

        await updateDoc(postRef, {
            comments: arrayUnion(commentData),
        });

        console.log("Comentario guardado correctamente en post", postID);
        return { success: true, message: "Comentario guardado correctamente." };
    } catch (error) {
        console.error("Error guardando el comentario:", error);
        return {
            success: false,
            message: "Error interno al guardar el comentario.",
        };
    }
}