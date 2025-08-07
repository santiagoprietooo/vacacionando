<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import TextInput from '../components/Inputs/TextInput.vue';
import PasswordInput from '../components/Inputs/PasswordInput.vue';
import SubmitButton from '../components/Buttons/SubmitButton.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import InputWarning from '../components/Messages/InputWarning.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { newUser } from '../services/auth';

const router = useRouter();
const createUser = ref({
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
        state: 'logging_in'
    };

    try {
        await newUser({ ...createUser.value });

        loadingStates.value = {
            loading: true,
            state: 'logged_in'
        };

        setTimeout(() => {
            cleanLoadingState();
            router.push('/');
        }, 2000);
    } catch (error) {
        loadingStates.value = {
            loading: false,
            state: 'error_logging_in'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
    }
}
</script>

<template>
    <HeaderTitle text="Crear Cuenta" />

    <section class="p-4">
        <h2 class="sr-only">Datos a completar</h2>

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4">
            <TextInput
                use-for="correo-electrónico"
                text="Correo Electrónico"
                placeholder="ejemplo@email.com"
                fill="on"
                v-model="createUser.email"
                :show-limit="false"
            />

            <PasswordInput v-model="createUser.password"/>

            <div class="flex flex-col mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton :disabled="createUser.email.trim() === '' || !isValidEmail(createUser.email) || !createUser.password || createUser.password.length < 6 || loadingStates.loading">
                    {{ loadingStates.loading ? "Creando Cuenta..." : "Crear Cuenta" }}
                </SubmitButton>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'logged_in'"
        message="Se creó la cuenta correctamente. Redirigiendo..."
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_logging_in'"
        message="Error al crear la cuenta."
        v-model="loadingStates.loading"
    />
</template>
