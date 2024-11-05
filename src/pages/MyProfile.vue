<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import UserItemTitle from '../components/UserItemTitle.vue'
import UserItemInfo from '../components/UserItemInfo.vue'
import { onMounted, ref } from 'vue';
import { subscribeToAuthChanges } from '../services/auth';
import { Pencil, User } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const loggedUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    traveledTo: null,
});

onMounted(() => {
    subscribeToAuthChanges(newUserData => loggedUser.value = newUserData);  
});
</script>

<template>
    <section class="px-5 pt-5 pb-48 flex flex-col items-center">
        <div class="flex flex-row justify-center gap-2">
            <HeaderTitle>Mi Perfil</HeaderTitle>
            <RouterLink
                to="/profile/edit"
                class="p-2 flex justify-center items-center rounded-full transition-colors hover:bg-slate-600"
            >
                <Pencil class="text-white size-5"/>
            </RouterLink>
        </div>

        <div class="
            w-full flex flex-col mt-8 bg-slate-100 border-8 border-slate-100 rounded-xl

            md:flex-row md:w-2/3
        ">
            <div class="
                p-10 flex flex-col items-center justify-center bg-slate-500 rounded-s-md
            ">
                <User class="text-white size-24"/>
            </div>
            
            <div class="flex flex-col bg-slate-100 text-black">
                <ul class="px-2 pt-2 md:px-8">
                    <UserItemTitle>Nombre:</UserItemTitle>
                    <UserItemInfo>{{ loggedUser.displayName || "No definido todavía..." }}</UserItemInfo>
                    
                    <UserItemTitle>Correo Electrónico:</UserItemTitle>
                    <UserItemInfo>{{ loggedUser.email || "No definido todavía..." }}</UserItemInfo>
                    
                    <UserItemTitle>Biografía:</UserItemTitle>
                    <UserItemInfo>{{ loggedUser.bio || "No definido todavía..." }}</UserItemInfo>
                    
                    <UserItemTitle>Viajé a:</UserItemTitle>
                    <UserItemInfo>{{ loggedUser.traveledTo ? loggedUser.traveledTo.join(', ') : "No definido todavía..." }}</UserItemInfo>
                </ul>
            </div>
        </div>
    </section>
</template>