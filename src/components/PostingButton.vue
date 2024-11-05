<script setup>
import { SquarePen } from 'lucide-vue-next';
</script>

<template>
    <button
        type="button"
        class="
        p-4 flex justify-center items-center bg-slate-200 rounded-full fixed text-slate-800 bottom-28 right-4
        
        lg:h-14 lg:gap-2 lg:bottom-5 lg:right-[12.3rem] lg:transition-all lg:opacity-40 lg:hover:opacity-100 lg:hover:shadow-md lg:hover:shadow-black"
    >
        <SquarePen class="block size-7"/>
        <span class="hidden lg:block lg:text-sm lg:font-bold lg:uppercase">
            <slot/>
        </span>
    </button>
</template>