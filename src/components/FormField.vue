<script setup>
import { onMounted, ref } from 'vue';
import InputWarning from './InputWarning.vue';

const argProvinces = ref(null);

async function getProvinces() {
    const data = await fetch('/provincias.json');

    return argProvinces.value = await data.json();
}

onMounted(async () => {
    await getProvinces();
});

defineProps({
    useFor: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const val = defineModel();
</script>

<template>
    <div class="flex flex-col w-3/4 max-sm:w-full">
        <label :for="useFor" class="w-max font-semibold">
            {{ text }}
        </label>

        <input
            v-if="useFor === 'titulo'"
            type="text"
            :name="useFor"
            :id="useFor"
            autocomplete="off"
            maxlength="50"
            v-model="val"
            class="w-full p-2 bg-slate-800 border-2 border-slate-500 rounded-lg transition-colors outline-none focus:bg-slate-700 focus:text-white"
        >

        <textarea
            v-else-if="useFor === 'descripcion'"
            :name="useFor"
            :id="useFor"
            rows="8"
            v-model="val"
            class="w-full p-2 bg-slate-800 border-2 border-slate-500 rounded-lg transition-colors outline-none focus:bg-slate-700 focus:text-white"
        />

        <select
            v-else-if="useFor === 'provincia'"
            :name="useFor"
            :id="useFor"
            v-model="val"
            class="w-full p-2 bg-slate-800 border-2 border-slate-500 rounded-lg transition-colors outline-none focus:bg-slate-700 focus:text-white"
        >
            <option
                v-for="location in argProvinces"
                :value="location.province"
            >
                {{ location.province }}
            </option>
        </select>

        <template v-if="useFor === 'titulo'">
            <InputWarning v-if="val.length < 5 || val.length > 50">
                El campo debe tener entre 5 y 50 carácteres.
            </InputWarning>
        </template>

        <template v-if="useFor === 'descripcion'">
            <InputWarning v-if="val.length < 10 || val.length > 550">
                El campo debe tener entre 10 y 550 carácteres.
            </InputWarning>
        </template>

        <template v-if="useFor === 'provincia'">
            <InputWarning v-if="!val">
                Debe seleccionar una provincia.
            </InputWarning>
        </template>
    </div>
</template>