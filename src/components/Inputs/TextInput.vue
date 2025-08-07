<script setup>
import InputLength from './InputLength.vue';

defineProps({
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
    },
    fill: {
        type: String,
        default: 'off'
    },
    showLimit: {
        type: Boolean,
        default: true
    },
    defineLimit: {
        type: Number,
        required: false
    }
});

const val = defineModel({
    type: String,
    default: ''
});
</script>

<template>
    <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
        <label :for="useFor" class="w-max font-semibold">
            {{ text }}
        </label>

        <input
            type="text"
            :name="useFor"
            :id="useFor"
            :placeholder="placeholder"
            :autocomplete="fill"
            :maxlength="defineLimit"
            class="p-2 w-full bg-slate-800 border-2 border-slate-500 rounded-lg outline-none transition-colors hover:bg-slate-600/25 focus:bg-slate-700 placeholder:text-slate-400"
            v-model="val"
        >

        <InputLength
            v-if="showLimit"
            :chars="val.length"
            :limit="defineLimit"
        />
    </div>
</template>