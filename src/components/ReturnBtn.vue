<script setup>
import { ChevronLeft } from 'lucide-vue-next';

const history = window.history.length;
</script>

<template>
    <button
        type="button"
        class="p-2 flex justify-center items-center rounded-full transition-colors hover:bg-slate-600"
        @click="history > 0 ? $router.back() : $router.push('/')"
    >
        <span class="sr-only">Volver atrás</span>
        <ChevronLeft class="size-5" />
    </button>
</template>