<script setup>  
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import UserProfileComponent from '../components/UserProfileComponent.vue';
import Loader from '../components/Loader/Loader.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserProfileById } from '../services/user-profile';

const route = useRoute();
const userId = route.params.id;

const userProfile = ref(null);

const loading = ref(false);
const error = ref({ state: false, message: '' });

onMounted(async () => userProfile.value = await getUserProfileById(userId, loading, error));
</script>  

<template>
    <HeaderTitle v-if="loading" text="Cargando perfil...">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <HeaderTitle v-else-if="!loading && userProfile?.id" text="Perfil de usuario">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <HeaderTitle v-else-if="!loading && error.state" text="Usuario no encontrado">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <section class="pb-48 flex flex-col items-center">
        <Loader v-if="loading"/>

        <template v-else-if="!loading && userProfile?.id">
            <UserProfileComponent :user-profile="userProfile" />
        </template>

        <div v-else-if="!loading && error.state" class="flex items-center justify-center p-4">
            <p class="text-xl text-center font-semibold">
                Este usuario no existe.
            </p>
        </div>
    </section>
</template>