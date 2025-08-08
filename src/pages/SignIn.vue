<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import TextInput from '../components/Inputs/TextInput.vue';
import PasswordInput from '../components/Inputs/PasswordInput.vue';
import SubmitButton from '../components/Buttons/SubmitButton.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import InputWarning from '../components/Messages/InputWarning.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth';
import { useLoadingState } from '../composables/useLoadingState';

const router = useRouter();
const user = ref({
    email: '',
    password: ''
});

function isValidEmail(email){
    const invalidChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return invalidChars.test(email);
}

const { loadingState, cleanLoadingState } = useLoadingState();

async function handleSubmit() {
    loadingState.value = {
        loading: true,
        state: 'signing_in'
    };

    try {
        await login({...user.value});

        loadingState.value = {
            loading: true,
            state: 'signed_in'
        };

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadingState.value = {
            loading: false,
            state: 'error_signing_in'
        };
    }
}
</script>

<template>
    <HeaderTitle text="Iniciar sesión"/>

    <section class="p-4">
        <h2 class="sr-only">Datos a completar</h2>

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4">
            <TextInput
                use-for="correo-electrónico"
                text="Correo Electrónico"
                placeholder="ejemplo@email.com"
                fill="on"
                v-model="user.email"
                :show-limit="false"
            />

            <PasswordInput v-model="user.password"/>

            <div class="flex flex-col mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton :disabled="user.email.trim() === '' || !isValidEmail(user.email) || !user.password || user.password.length < 6 || loadingState.loading">
                    {{ loadingState.loading ? "Iniciando Sesión..." : "Iniciar Sesión" }}
                </SubmitButton>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingState.loading && loadingState.state === 'signed_in'"
        message="Se ha iniciado sesión correctamente. Redirigiendo..."
        v-model="loadingState.loading"
    />

    <AlertMessage
        v-else-if="loadingState.loading && loadingState.state === 'error_signing_in'"
        message="Error al iniciar sesión."
        v-model="loadingState.loading"
    />
</template>