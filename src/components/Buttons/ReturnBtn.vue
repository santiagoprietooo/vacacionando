<script setup>
import { ChevronLeft } from 'lucide-vue-next';

const history = window.history.length;
</script>

<template>
    <button
        type="button"
        class="flex items-center justify-center p-2 rounded-full outline-none transition-colors hover:bg-slate-50/15 focus:bg-slate-50/25"
        @click="history > 0 ? $router.back() : $router.push('/')"
    >
        <span class="sr-only">Volver atrás</span>
        <ChevronLeft class="size-5" />
    </button>
</template>