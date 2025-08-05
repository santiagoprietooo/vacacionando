<script setup>
defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <li v-if="text !== '&copy; 2024 - Vacacionando'">
        <RouterLink to="#" class="hover:underline">
            {{ text }}
        </RouterLink>
    </li>

    <li class="mt-4 text-slate-400" v-else>
        <span class="mt-3">{{ text }}</span>
    </li>
</template>