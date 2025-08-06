<script setup>
import { House, LogIn, Settings, User } from 'lucide-vue-next';

defineProps({
    navTo: {
        type: String,
        required: true
    },
    path: {
        type: String,
        default: '/'
    }
})
</script>

<template>
    <li>
        <RouterLink
            :to="path"
            class="flex justify-center items-center p-4 bg-slate-800 hover:bg-slate-700 focus:bg-slate-900 transition-colors lg:justify-start lg:gap-2 lg:px-2 lg:h-14 lg:w-40 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
        >
            <House class="size-5" v-if="navTo === 'Inicio'" /> 
            <User class="size-5" v-if="navTo === 'Perfil' || navTo === 'Crear Cuenta'" /> 
            <Settings class="size-5" v-if="navTo === 'Ajustes'" /> 
            <LogIn class="size-5" v-if="navTo === 'Iniciar Sesión'" /> 

            <span class="max-lg:sr-only">{{ navTo }}</span>
        </RouterLink>
    </li>
</template>