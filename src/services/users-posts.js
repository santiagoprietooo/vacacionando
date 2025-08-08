import { doc, addDoc, getDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { supabase } from './supabase';

/**
 * Función para guardar un post público en la base de datos.
 * @param {{ title: string, description: string, location: string }} newPost Detalles del post.
 * @param {File} file Foto a subir.
 * @return {Promise}
 **/

export async function savePublicPost({ title, description, location }, file) {
  const user = auth.currentUser;

  if (!user) {
    console.error("Usuario no autenticado. No se puede guardar el post.");

    return
  }

  let imageURL;

  if (!file) {
    file = null;
  } else {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('post-images').upload(fileName, file);
  
    if (uploadError) {
      console.error("Error al subir foto: ", uploadError);
      throw uploadError
    };
  
    const { data: publicURLdata } = supabase.storage.from('post-images').getPublicUrl(fileName);
    imageURL = publicURLdata.publicUrl;
  }

  const usersPosts = collection(db, 'posted-by-users');

  await addDoc(usersPosts, {
    title,
    description,
    photo: !file ? null : imageURL,
    location,
    comments: [],
    user_id: user.uid,
    user_email: user.email,
    created_at: serverTimestamp()
  });
}

/**
 * Función para leer los posts públicos de la base de datos.
 * @param {Function} callback Función que se ejecuta cuando se reciben los posts. 
 */
export function readPublicPosts(callback){
    const usersPosts = collection(db, 'posted-by-users');
    const postQuery = query(usersPosts, orderBy('created_at', 'desc'));

    onSnapshot(postQuery, (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
          return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              photo: doc.data().photo,
              location: doc.data().location,
              comments: doc.data().comments,
              user_id: doc.data().user_id,
              user_email: doc.data().user_email,
              created_at: doc.data().created_at
          }
      });

      callback(posts);
    });
}

/**
 * Función para obtener un post por su ID.
 * @param {String} id ID del post a obtener.
 * @returns {Promise<Object>} Objeto con los datos del post. 
 */
export async function getPostById(id, callback){
  try {
    const profileRef = doc(db, `/posted-by-users/${id}`);
    const profileDocument = await getDoc(profileRef);

    if (!profileDocument.exists()) {
      throw new Error(`No se encontró el perfil de usuario con ID: ${id}`);
    }

    onSnapshot(profileRef, (snapshot) => {
      const post = {
        id: snapshot.id,
        title: snapshot.data().title,
        description: snapshot.data().description,
        photo: snapshot.data().photo,
        location: snapshot.data().location,
        comments: snapshot.data().comments,
        user_id: snapshot.data().user_id,
        user_email: snapshot.data().user_email,
        created_at: snapshot.data().created_at
      }

      callback(post);
    });
  } catch (error) {
    console.error("Error al obtener el posteo:", error);
    throw error;
  }
}