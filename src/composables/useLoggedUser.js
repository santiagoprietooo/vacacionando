import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthChanges } from "../services/auth";

export function useLoggedUser() {
    let unsubscribeFromAuth = () => {};

    const loggedUser = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        traveledTo: null,
        photoURL: null
    });

    onMounted(() => {
        unsubscribeFromAuth = subscribeToAuthChanges(async (newUserData) => {
            loggedUser.value = await {
                ...loggedUser.value,
                ...newUserData,
                displayName: !loggedUser.value.displayName && !newUserData.displayName
                    ? newUserData.email?.slice(0, newUserData.email?.indexOf("@"))
                    : newUserData.displayName
                ,
                bio: !loggedUser.value.displayName && !newUserData.displayName
                    ? null
                    : newUserData.bio
                ,
                traveledTo: Array.isArray(newUserData.traveledTo)
                    ? newUserData.traveledTo
                    : []
                ,
                photoURL: !loggedUser.value.photoURL && !newUserData.photoURL
                    ? null
                    : newUserData.photoURL
                
            };
        });
    });

    onUnmounted(() => {
        unsubscribeFromAuth();
    });

    return { loggedUser }
}