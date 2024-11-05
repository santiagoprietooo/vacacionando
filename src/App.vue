<script setup>
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
    <nav class="
    py-2 px-6 flex flex-row items-center justify-between fixed bottom-0 z-20 bg-slate-900 border-t border-slate-500 w-screen

    lg:p-0 lg:pr-6 lg:py-5 lg:h-screen lg:w-44 lg:flex-col lg:left-0 lg:border-r lg:border-t-0
    ">
        <RouterLink to="/" class="hidden lg:block">
            <img src="/icon/vacacionando-icon.png" alt='ícono de "Vacacionando".' width="80rem">
        </RouterLink>

        <ul class="flex flex-row items-center gap-8 lg:flex-col lg:gap-0">
            <li class="my-2">
                <RouterLink
                    to="/"
                    class="
                    p-4 bg-slate-800 flex justify-center items-center hover:bg-slate-700 focus:bg-slate-900 rounded-full transition-colors

                    lg:px-2 lg:justify-start lg:h-14 lg:w-40 lg:gap-2 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
                >
                    <House class="size-7"/> <span class="hidden lg:block">Home</span>
                </RouterLink>
            </li>

            <template v-if="loggedUser.id !== null">
                <RouterLink
                    to="/profile"
                    class="
                    p-4 bg-slate-800 flex justify-center items-center hover:bg-slate-700 focus:bg-slate-900 rounded-full transition-colors

                    lg:px-2 lg:justify-start lg:h-14 lg:w-40 lg:gap-2 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
                >
                    <User class="size-7"/> <span class="hidden lg:block">Perfil</span>
                </RouterLink>
            </template>
            <template v-else>
                <li class="my-2">
                    <RouterLink
                        to="/sign-in"
                        class="
                        p-4 bg-slate-800 flex justify-center items-center hover:bg-slate-700 focus:bg-slate-900 rounded-full transition-colors

                        lg:px-2 lg:justify-start lg:h-14 lg:w-40 lg:gap-2 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
                        >
                            <User class="size-7"/> <span class="hidden lg:block">Iniciar Sesión</span>
                    </RouterLink>
                </li>

                <li class="my-2">
                    <RouterLink
                        to="/log-in"
                        class="
                        p-4 bg-slate-800 flex justify-center items-center hover:bg-slate-700 focus:bg-slate-900 rounded-full transition-colors

                        lg:px-2 lg:justify-start lg:h-14 lg:w-40 lg:gap-2 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
                        >
                            <LogIn class="size-7"/> <span class="hidden lg:block">Crear Cuenta</span>
                    </RouterLink>
                </li>
            </template>
        </ul>

        <template v-if="loggedUser.id !== null">
            <form action="#" @submit.prevent="handleLogout">
                <button 
                    type="submit" 
                        class="
                        p-4 bg-red-800 flex justify-center items-center hover:bg-red-700 focus:bg-red-900 rounded-full transition-colors

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

    <footer class="hidden lg:px-3 lg:py-5 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-end lg:min-w-44 lg:fixed lg:right-0 lg:border-l lg:border-slate-500">
        <div>
            <ul class="text-xs text-center">
                <FooterItem>Condiciones de Servicio</FooterItem>
                <FooterItem>Política de Privacidad</FooterItem>
                <FooterItem>Política de Cookies</FooterItem>
                <li>
                    <span> <p class="mt-3">&copy; 2024 - Vacacionando</p> </span>
                </li>
            </ul>
        </div>
    </footer>
</template>