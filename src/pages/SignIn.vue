<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import TextInput from '../components/TextInput.vue';
import PasswordInput from '../components/PasswordInput.vue';
import SubmitButton from '../components/SubmitButton.vue';
import AlertMessage from '../components/AlertMessage.vue';
import InputWarning from '../components/InputWarning.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth';

const router = useRouter();
const user = ref({
    email: '',
    password: ''
});

function isValidEmail(email){
    const invalidChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return invalidChars.test(email);
}

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

async function handleSubmit() {
    loadingStates.value = {
        loading: true,
        state: 'signing_in'
    };

    try {
        await login({...user.value});

        loadingStates.value = {
            loading: true,
            state: 'signed_in'
        };

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadingStates.value = {
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
            />

            <PasswordInput v-model="user.password"/>

            <div class="flex flex-col mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton width="max" :disabled="user.email.trim() === '' || !isValidEmail(user.email) || !user.password || user.password.length < 6 || loadingStates.loading">
                    {{ loadingStates.loading ? "Iniciando Sesión..." : "Iniciar Sesión" }}
                </SubmitButton>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'signed_in'"
        message="Se ha iniciado sesión correctamente. Redirigiendo..."
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_signing_in'"
        message="Error al iniciar sesión."
        v-model="loadingStates.loading"
    />
</template>