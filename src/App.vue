<script setup>
import NavLink from './components/NavLink.vue';
import FooterItem from './components/FooterItem.vue';
import { House, User, LogIn, LogOut } from 'lucide-vue-next';
import { logout, subscribeToAuthChanges } from './services/auth';
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const loggedUser = ref({
    id: null,
    email: null
});

onMounted(() => {
    subscribeToAuthChanges(newUserData => loggedUser.value = newUserData);
});

const handleLogout = () => {
    logout();
    router.push('/sign-in');
}
</script>

<template>
    <nav class="fixed bottom-0 z-20 flex flex-row items-center justify-between w-screen bg-slate-800 border-t border-slate-500 lg:left-0 lg:flex-col lg:h-screen lg:w-44 lg:p-0 lg:py-5 lg:pr-6 lg:bg-slate-950/25 lg:border-t-0 lg:border-r">
        <RouterLink to="/" class="hidden lg:block">
            <img src="/icon/vacacionando-icon.png" alt='ícono de "Vacacionando".' class="w-20">
        </RouterLink>

        <ul class="flex flex-row items-center lg:flex-col lg:gap-2">
            <NavLink nav-to="Inicio" path="/" />

            <template v-if="loggedUser.id !== null">
                <NavLink nav-to="Perfil" path="/profile" />
            </template>

            <template v-else>
                <NavLink nav-to="Iniciar Sesión" path="/sign-in" />
                <NavLink nav-to="Crear Cuenta" path="/log-in" />
            </template>
        </ul>

        <template v-if="loggedUser.id !== null">
            <form action="#" @submit.prevent="handleLogout">
                <button 
                    type="submit" 
                        class="
                        p-4 bg-red-800/60 flex justify-center items-center hover:bg-red-700/60 focus:bg-red-900/60 transition-colors

                        lg:px-2 lg:justify-start lg:h-14 lg:w-40 lg:gap-2 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
                    >
                        <LogOut class="size-7"/> <span class="hidden lg:block">Cerrar Sesión</span>
                </button>
            </form>
        </template>
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