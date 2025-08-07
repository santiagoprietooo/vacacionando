<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, subscribeToAuthChanges } from '../services/auth';

const router = useRouter();

const loggedUser = ref({
    id: null,
    email: null
});

onMounted(() => {
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);
});

const loadingStates = ref({
    loading: false,
    state: ''
});

function cleanLoadingState() {
    loadingStates.value = {
        loading: false,
        state: ''
    }
}

const handleLogout = async () => {
    loadingStates.value = {
        loading: true,
        state: 'logging_out'
    }

    try {
        await logout();

        loadingStates.value = {
            loading: true,
            state: 'logged_out'
        }

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadingStates.value = {
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
                :disabled="!loggedUser.id || loadingStates.loading && loadingStates.state === 'logging_out'" 
                class="flex place-self-end p-2 bg-red-800/70 font-semibold border-2 border-red-400 rounded-lg outline-none transition-colors hover:bg-red-700/70 focus:bg-red-800/80 focus:border-red-100 :disabled:bg-red-600/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ loadingStates.loading ? "Cerrando sesión" : "Cerrar Sesión" }}
            </button>
        </form>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'logged_out'"
        message="Se cerró la sesión. Redirigiendo..."
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_logging_out'"
        message="Error al cerrar sesión."
        v-model="loadingStates.loading"
    />
</template>
