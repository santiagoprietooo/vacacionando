<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import ReturnBtn from "../components/ReturnBtn.vue";
import UserProfileComponent from '../components/UserProfileComponent.vue';
import { Pencil } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';

const loggedUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    traveledTo: null,
});

onMounted(() => {
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);  
});
</script>

<template>
    <HeaderTitle text="Mi Perfil">
        <template #content-before>
            <ReturnBtn />
        </template>

        <template #content-after>
            <RouterLink
                to="/profile/edit"
                class="p-2 flex justify-center items-center rounded-full transition-colors hover:bg-slate-600"
            >
                <Pencil class="text-white size-5"/>
            </RouterLink>
        </template>
    </HeaderTitle>

    <section class="pb-48">
        <template v-if="!loggedUser">
            <div class="flex items-center justify-center p-4">
                <p class="text-xl text-center font-semibold">
                    Cargando...
                </p>
            </div>
        </template>

        <template v-else>
            <UserProfileComponent :user-profile="loggedUser" />
        </template>
    </section>
</template>