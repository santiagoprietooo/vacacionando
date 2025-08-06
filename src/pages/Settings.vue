<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, subscribeToAuthChanges } from '../services/auth';
import AlertMessage from '../components/AlertMessage.vue';

const router = useRouter();

const loggedUser = ref({
    id: null,
    email: null
});

onMounted(() => {
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);
});

const loadinStates = ref({
    loading: false,
    state: ''
});

function cleanLoadingState() {
    loadinStates.value = {
        loading: false,
        state: ''
    }
}

const handleLogout = async () => {
    loadinStates.value = {
        loading: true,
        state: 'logging_out'
    }

    try {
        await logout();

        loadinStates.value = {
            loading: true,
            state: 'logged_out'
        }

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadinStates.value = {
            loading: true,
            state: 'error_logging_out'
        }

        cleanLoadingState();

        console.error(error);
    }
}
</script>

<template>
    <HeaderTitle text="Ajustes"/>

    <section class="pb-48">
        <h2 class="p-4 w-full bg-slate-500/15">Cerrar sesión</h2>
        <p class="p-4 w-full text-sm text-slate-300">Al cerrar sesión, se eliminará tu sesión actual y tendrás que iniciar sesión nuevamente para acceder a tu cuenta.</p>

        <form @submit.prevent="handleLogout" class="p-4">
            <button 
                type="submit"
                :disabled="!loggedUser.id || loadinStates.loading && loadinStates.state === 'logging_out'" 
                class="flex place-self-end p-2 bg-red-800/70 font-semibold border-2 border-red-400 rounded-lg transition-colors hover:bg-red-700/70 focus:bg-red-900/70 :disabled:bg-red-600/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ loadinStates.loading ? "Cerrando sesión" : "Cerrar Sesión" }}
            </button>
        </form>
    </section>

    <AlertMessage message="Se cerró la sesión. Redirigiendo al inicio..." v-model="loadinStates.loading" />
</template>
