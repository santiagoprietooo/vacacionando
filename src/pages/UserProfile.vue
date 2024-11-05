<script setup>  
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserProfileById } from '../services/user-profile';

const route = useRoute();
const userId = route.params.id;
const userProfile = ref(null);
const notAnUser = ref(null);

onMounted(async () => {
    try {
        userProfile.value = await getUserProfileById(userId);
        notAnUser.value = false;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        notAnUser.value = true;
        throw error;
    }
});

</script>  

<template>
    <section class="px-5 pt-5 pb-48 flex flex-col items-center">
        <div v-if="notAnUser == null">
            <p>Cargando perfil del usuario...</p>
        </div>

        <div v-else-if="notAnUser == false">
            <h2>Perfil de usuario: {{ userId }}</h2>
    
            <p>Email: {{ userProfile.email || "No definido todavía..." }}</p>
            <p>Nombre: {{ userProfile.displayName || "No definido todavía..." }}</p>
            <p>Biografía: {{ userProfile.bio || "No definido todavía..." }}</p>
            <p>Lugares visitados:</p>
        
            <ul v-if="userProfile.traveledTo">
                <li
                    v-for="place in userProfile.traveledTo"
                    :key="place"
                >
                    {{ place }}
                </li>
            </ul>

            <p v-else>No definido.</p>
        </div>

        <div v-else>
            <p>No existe el usuario</p>
        </div>
    </section>
</template>