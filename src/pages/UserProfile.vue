<script setup>  
import HeaderTitle from '../components/HeaderTitle.vue';
import ReturnBtn from '../components/ReturnBtn.vue';
import UserProfileComponent from '../components/UserProfileComponent.vue';
import { UserRound } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';
import { getUserProfileById } from '../services/user-profile';

const route = useRoute();
const userId = route.params.id;
const userProfile = ref(null);

const loggedUser = ref({
    id: null,
    email: null
});

const loading = ref(false);
const error = ref({ state: false, message: '' });

onMounted(async () => {
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);

    userProfile.value = await getUserProfileById(userId, loading, error);
});
</script>  

<template>
    <HeaderTitle v-if="!userProfile?.email" text="Cargando perfil...">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <HeaderTitle v-else text="Perfil de usuario">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <section class="pb-48 flex flex-col items-center">
        <div v-if="loading" class="flex items-center justify-center h-96 w-full">
            <span>Cargando...</span>
        </div>

        <template v-else-if="!loading && userProfile?.id">
            <UserProfileComponent :user-profile="userProfile" />
        </template>

        <div v-else-if="!loading && error.state" class="flex items-center justify-center h-96 w-full">
            <p>Este usuario no existe.</p>
        </div>
    </section>
</template>