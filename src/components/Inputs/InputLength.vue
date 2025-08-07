<script setup>
defineProps({
    chars: {
        type: Number,
        default: 0,
        required: true
    },
    limit: {
        type: Number,
        required: true
    }
});
</script>

<template>
    <div class="flex items-center justify-end w-full">
        <span
            class="place-items-end text-sm"
            :class="chars >= limit ? 'text-red-500 font-medium' : 'text-slate-400 font-light'"
        >
            {{ chars }}/{{ limit }}
        </span>
    </div>
</template>