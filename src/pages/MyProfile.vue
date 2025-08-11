<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from "../components/Buttons/ReturnBtn.vue";
import UserProfileComponent from '../components/UserProfileComponent.vue';
import Loader from '../components/Loader/Loader.vue';
import { Pencil } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useLoggedUser } from '../composables/useLoggedUser';

const { loggedUser } = useLoggedUser();
</script>

<template>
    <HeaderTitle text="Mi Perfil">
        <template #content-before>
            <ReturnBtn />
        </template>

        <template #content-after>
            <RouterLink
                to="/profile/edit"
                class="flex items-center justify-center p-2 rounded-full outline-none transition-colors hover:bg-slate-50/15 focus:bg-slate-50/25"
            >
                <Pencil class="text-white size-5"/>
                <span class="sr-only">Ir a editar el perfil</span>
            </RouterLink>
        </template>
    </HeaderTitle>

    <section class="pb-48">
        <template v-if="!loggedUser">
            <Loader />
        </template>

        <template v-else>
            <UserProfileComponent :user-profile="loggedUser" />
        </template>
    </section>
</template>