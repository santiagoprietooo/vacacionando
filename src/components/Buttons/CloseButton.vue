<script setup>
import { X } from 'lucide-vue-next';

const val = defineModel({
    type: Boolean,
    default: false
});
</script>

<template>
    <button
        type="button"
        class="flex items-center justify-center p-2 rounded-full outline-none transition-colors hover:bg-slate-50/15 focus:bg-slate-50/25"
        @click="val = !val"
        aria-label="Cerrar"
    >
        <X class="text-white"/>
    </button>
</template>