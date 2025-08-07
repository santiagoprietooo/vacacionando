<script setup>
import { useTextareaAutosize } from '@vueuse/core';

const val = defineModel({
    type: String,
    default: ''
});

const { textarea } = useTextareaAutosize({ input: val, styleProp: 'minHeight' });

const props = defineProps({
    useFor: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
        <label :for="useFor" class="w-max font-semibold">
            {{ text }}
        </label>

        <textarea
            :name="useFor"
            :id="useFor"
            :placeholder="placeholder"
            rows="1"
            class="p-2 w-full bg-slate-800 border-2 border-slate-500 rounded-lg outline-none overflow-hidden resize-none transition-colors hover:bg-slate-600/25 focus:bg-slate-700 placeholder:text-slate-400"
            ref="textarea"
            v-model="val"
        />
    </div>
</template>