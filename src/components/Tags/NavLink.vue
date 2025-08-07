<script setup>
import { House, LogIn, Settings, User } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();

const getRoute = (r) => {
    return route.path === r
}

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
            class="flex justify-center items-center p-2 outline-none transition-colors lg:justify-start lg:gap-2 lg:px-2 lg:h-14 lg:w-40 lg:border-2 lg:border-transparent lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full"
            :class="getRoute(path) ?
                'lg:bg-white lg:text-slate-700 lg:text-lg lg:font-semibold lg:hover:bg-slate-200 lg:focus:bg-white/85' :
                'bg-slate-800 lg:text-white lg:text-base lg:font-normal lg:hover:bg-slate-700 lg:focus:border-slate-500'
            "
        >
            <House
                v-if="navTo === 'Inicio'"
                class="size-5 max-lg:size-9 max-lg:p-2" 
                :class="{
                    'max-lg:bg-white max-lg:text-slate-800 max-lg:rounded-full'
                    : getRoute(path)
                }"
            />

            <User
                v-if="navTo === 'Perfil' || navTo === 'Crear Cuenta'"
                class="size-5 max-lg:size-9 max-lg:p-2" 
                :class="{
                    'max-lg:bg-white max-lg:text-slate-800 max-lg:rounded-full'
                    : getRoute(path)
                }"
            />

            <Settings
                v-if="navTo === 'Ajustes'"
                class="size-5 max-lg:size-9 max-lg:p-2" 
                :class="{
                    'max-lg:bg-white max-lg:text-slate-800 max-lg:rounded-full'
                    : getRoute(path)
                }"
            />

            <LogIn
                v-if="navTo === 'Iniciar Sesión'"
                class="size-5 max-lg:size-9 max-lg:p-2" 
                :class="{
                    'max-lg:bg-white max-lg:text-slate-800 max-lg:rounded-full'
                    : getRoute(path)
                }"
            />

            <span class="max-lg:sr-only">{{ navTo }}</span>
        </RouterLink>
    </li>
</template>