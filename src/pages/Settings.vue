<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { useLoadingState } from '../composables/useLoadingState';
import { useLoggedUser } from '../composables/useLoggedUser';

const router = useRouter();

const { loggedUser } = useLoggedUser();
const { loadingState, cleanLoadingState } = useLoadingState();

const handleLogout = async () => {
    loadingState.value = {
        loading: true,
        state: 'logging_out'
    }

    try {
        await logout();

        loadingState.value = {
            loading: true,
            state: 'logged_out'
        }

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadingState.value = {
            loading: false,
            state: 'error_logging_out'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 2000);
    }
}
</script>

<template>
    <HeaderTitle text="Ajustes">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <section class="pb-48">
        <h2 class="p-4 w-full bg-slate-500/15">Cerrar sesión</h2>
        <p class="p-4 w-full text-sm text-slate-300">Al cerrar sesión, se eliminará tu sesión actual y tendrás que iniciar sesión nuevamente para acceder a tu cuenta.</p>

        <form @submit.prevent="handleLogout" class="p-4">
            <button 
                type="submit"
                :disabled="!loggedUser.id || loadingState.loading && loadingState.state === 'logging_out'" 
                class="flex place-self-end p-2 bg-red-800/70 font-semibold border-2 border-red-400 rounded-lg outline-none transition-colors hover:bg-red-700/70 focus:bg-red-800/80 focus:border-red-100 :disabled:bg-red-600/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ loadingState.loading ? "Cerrando sesión" : "Cerrar Sesión" }}
            </button>
        </form>
    </section>

    <AlertMessage
        v-if="loadingState.loading && loadingState.state === 'logged_out'"
        message="Se cerró la sesión. Redirigiendo..."
        v-model="loadingState.loading"
    />

    <AlertMessage
        v-else-if="loadingState.loading && loadingState.state === 'error_logging_out'"
        message="Error al cerrar sesión."
        v-model="loadingState.loading"
    />
</template>
