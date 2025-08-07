<script setup>
import { SquarePen } from 'lucide-vue-next';

const val = defineModel({
    type: Boolean,
    default: false,
    required: true
});
</script>

<template>
    <button
        type="button"
        class="fixed right-4 bottom-20 flex items-center justify-center p-4 bg-slate-200 text-slate-800 rounded-full outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40 lg:right-[12.3rem] lg:bottom-5 lg:gap-2 lg:h-14 lg:bg-slate-200/40 lg:hover:bg-slate-200 lg:focus:bg-slate-300 lg:hover:shadow-md lg:hover:shadow-black"
        @click="val = !val"
    >
        <SquarePen class="size-5" aria-label="Ícono de lapiz"/>
        <span class="font-semibold max-lg:sr-only">
            Publicar
        </span>
    </button>
</template>