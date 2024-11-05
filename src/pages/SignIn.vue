<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import InputWarning from '../components/InputWarning.vue';
import SubmitButton from '../components/SubmitButton.vue';
import { ref } from 'vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
    email: '',
    password: ''
});
const loading = ref(false);
const credentials = ref(false);
const showPassword = ref(false);

function isValidEmail(email){
    const invalidChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return invalidChars.test(email);
}

function handlePassword() {
    showPassword.value = !showPassword.value;
}

async function handleSubmit() {
    loading.value = true;

    try {
        await login({...user.value});
        router.push('/');
        
    } catch (error) {
        console.error("[SignIn handleSubmit] Error al iniciar sesión: ", error);
        credentials.value = true;
    }

    loading.value = false;
}
</script>

<template>
    <section class="p-5">
        <HeaderTitle>Iniciar Sesión</HeaderTitle>

        <form action="#" @submit.prevent="handleSubmit" class="mt-8 flex flex-col items-center">
            <div class="flex flex-col justify-center gap-1 mb-3 w-full md:w-2/3">
                <label for="email" class="w-max">Email</label>
                <input
                    type="email" id="email"
                    v-model="user.email"
                    class="px-3 py-2 w-full border-2 rounded-lg border-slate-500 bg-slate-500 transition-colors outline-none focus:bg-slate-800 focus:text-white"
                >
                <InputWarning v-if="!isValidEmail(user.email)">
                    Esta no es una dirección de correo valida.
                </InputWarning>
            </div>

            <div class="flex flex-col justify-center gap-1 mb-3 w-full md:w-2/3">
                <label for="password" class="w-max">Contraseña</label>
                <div class="flex flex-row gap-1">
                    <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="user.password"
                    class="px-3 py-2 w-full border-2 rounded-lg border-slate-500 bg-slate-500 transition-colors outline-none focus:bg-slate-800 focus:text-white"
                    >
                    <button
                        type="button"
                        @click="handlePassword"
                        class="w-24 bg-slate-800 font-semibold border-2 border-slate-600 rounded-lg transition-colors hover:bg-slate-600"
                    >
                        {{ showPassword ? 'Ocultar' : 'Mostrar' }}
                    </button>
                </div>
                <InputWarning v-if="!user.password">
                    Complete este campo.
                </InputWarning>
            </div>

            <div class="flex flex-col w-full md:w-2/3 mt-8">
                <SubmitButton
                    :disabled="!user.email || !user.password"
                    color="slate"
                >
                    Iniciar Sesión
                </SubmitButton>
                <InputWarning v-if="credentials">
                    Error en las credenciales. Revise los datos enviados.
                </InputWarning>
            </div>
        </form>
    </section>
</template>