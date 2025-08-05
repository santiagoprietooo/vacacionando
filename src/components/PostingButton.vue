<script setup>
import { SquarePen } from 'lucide-vue-next';
</script>

<template>
    <button
        type="button"
        class="
        fixed right-4 bottom-20 flex items-center justify-center p-4 bg-slate-200 text-slate-800 rounded-full
        lg:right-[12.3rem] lg:bottom-5 lg:gap-2 lg:h-14 lg:transition-all lg:opacity-40 lg:hover:opacity-100 lg:hover:shadow-md lg:hover:shadow-black"
    >
        <SquarePen class="size-7 lg:size-6"/>
        <span class="text-lg font-semibold max-lg:sr-only">
            Postear
        </span>
    </button>
</template>