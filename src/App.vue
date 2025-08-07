<script setup>
import NavLink from './components/Tags/NavLink.vue';
import FooterItem from './components/Tags/FooterItem.vue';
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { subscribeToAuthChanges } from './services/auth';

const loggedUser = ref({
    id: null,
    email: null
});

onMounted(() => {
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);
});
</script>

<template>
    <nav class="fixed bottom-0 z-20 flex flex-row items-center py-1 w-screen bg-slate-800 border-t border-slate-500 lg:left-0 lg:flex-col lg:justify-between lg:h-screen lg:w-44 lg:p-0 lg:py-5 lg:pr-6 lg:bg-slate-950/25 lg:border-t-0 lg:border-r">
        <RouterLink to="/" class="hidden rounded-full outline-none focus:shadow-md focus:shadow-white/50 lg:block">
            <img src="/icon/vacacionando-icon.png" alt='ícono de "Vacacionando".' class="w-20">
        </RouterLink>

        <ul class="flex flex-row items-center justify-evenly w-full lg:flex-col lg:gap-2">
            <NavLink nav-to="Inicio" path="/" />

            <template v-if="!loggedUser.id">
                <NavLink nav-to="Iniciar Sesión" path="/sign-in" />
                <NavLink nav-to="Crear Cuenta"   path="/log-in" />
            </template>

            <template v-else>
                <NavLink nav-to="Perfil"  path="/profile" />
                <NavLink nav-to="Ajustes" path="/settings" />
            </template>
        </ul>
    </nav>

    <main class="lg:absolute lg:left-44 lg:right-44 lg:z-20">
        <RouterView></RouterView>
    </main>

    <footer class="hidden bg-slate-950/25 lg:px-3 lg:py-5 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-end lg:min-w-44 lg:fixed lg:right-0 lg:border-l lg:border-slate-500">
        <div>
            <ul class="text-xs text-center">
                <FooterItem text="Condiciones de Servicio" />
                <FooterItem text="Política de Privacidad" />
                <FooterItem text="Política de Cookies" />
                <FooterItem text="&copy; 2024 - Vacacionando" />
            </ul>
        </div>
    </footer>
</template>