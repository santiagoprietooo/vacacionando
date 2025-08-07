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
        class="fixed right-4 bottom-20 flex items-center justify-center p-4 bg-slate-200 text-slate-800 rounded-full lg:right-[12.3rem] lg:bottom-5 lg:gap-2 lg:h-14 lg:opacity-40 lg:transition-all lg:hover:opacity-100 lg:hover:shadow-md lg:hover:shadow-black"
        @click="val = !val"
    >
        <SquarePen class="size-5"/>
        <span class="font-semibold max-lg:sr-only">
            Publicar
        </span>
    </button>
</template>