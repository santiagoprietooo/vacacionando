<script setup>
defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>

<template>
    <header class="flex items-center justify-between gap-2 px-2 py-4 w-full border-b border-slate-500">
        <slot name="content-before" />

        <h1 class="flex items-center justify-center gap-2 w-full text-2xl text-center font-semibold uppercase">
            {{ text }}

            <slot name="content-after" />
        </h1>
    </header>
</template>