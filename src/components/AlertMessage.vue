<script setup>
defineProps({
    message: {
        type: String,
        default: 'Publicación creada exitosamente'
    }
});

const isActive = defineModel();
</script>

<template>
    <VSnackbar
        timeout="3000"
        :text="message"
        v-model="isActive"
    />
</template>