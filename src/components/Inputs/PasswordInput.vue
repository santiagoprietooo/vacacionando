<script setup>
import { Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';

const showPassword = ref(false);

const val = defineModel({
    type: String,
    default: ''
});
</script>

<template>
    <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
        <label for="contraseña" class="w-max font-semibold">
            Contraseña
        </label>

        <div class="flex flex-row gap-1">
            <input
                :type="showPassword ? 'text' : 'password'"
                name="contraseña"
                id="contraseña"
                autocomplete="off"
                class="p-2 w-full bg-slate-800 border-2 border-slate-500 rounded-lg outline-none transition-colors hover:bg-slate-600/25 focus:bg-slate-700 placeholder:text-slate-400"
                v-model="val"
            >

            <button
                type="button"
                @click="showPassword = !showPassword"
                class="p-2 bg-slate-500 font-semibold border-2 border-slate-500 rounded-lg outline-none transition-colors hover:bg-slate-600 focus:bg-slate-700"
            >
                <template v-if="!showPassword">
                    <Eye class="size-5"/>
                    <span class="sr-only">Mostrar contraseña</span>
                </template>

                <template v-else>
                    <EyeOff class="size-5"/>
                    <span class="sr-only">Ocultar contraseña</span>
                </template>
            </button>
        </div>
    </div>
</template>