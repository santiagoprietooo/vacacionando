import { doc, addDoc, collection, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
/**
 * @param {{title: string, description: string, location: string, created_at: string, user_id: string, user_email: string, comments: string}} newPosts
 * @return {Promise}
 **/

import { getAuth } from "firebase/auth";
import { comment } from "postcss";

export async function savePublicPost({ title, description, location }) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid; 
    const userEmail = user.email ; 
    const usersPosts = collection(db, 'posted-by-users');
    await addDoc(usersPosts, {
      title,
      description,
      location,
      user_id: userId,
      user_email: userEmail,
      created_at: serverTimestamp(),
      comments: []
    });
  } 
}

/**
 * @param {{comments: string, comment: string, created_at: string}} newComments
 * @return {Promise}
 **/

export async function savePublicComment({postId, comment}) {
  const publicComment = doc(db, 'posted-by-users', postId);
  const readPost = await getDoc(publicComment);

  if (readPost.exists()) {
    await updateDoc(publicComment, {
      comments: arrayUnion({
        comment: comment
      })
    });
  } else {
    throw new Error('No se encontró el post con el ID: ', postId);
  }
}

export function readPublicPosts(callback){
    const usersPosts = collection(db, 'posted-by-users');
    const postQuery = query(usersPosts, orderBy('created_at', 'desc'));

    onSnapshot(postQuery, snapshot => {
        const posts = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                location: doc.data().location,
                created_at: doc.data().created_at,
                user_id: doc.data().user_id,
                user_email: doc.data().user_email,
                comments: doc.data().comments || []
            }
        });
        callback(posts);
    });
}

export function readPublicComments(callback){
  const userComments = collection(db, 'posted-by-users');
  const commentQuery = query(userComments, orderBy('created_at', 'desc'));

  onSnapshot(commentQuery, snapshot => {
    const comments = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        comment: doc.data().comment,
        comments: doc.data().comments
      }
    });
    callback(comments);
  })
}