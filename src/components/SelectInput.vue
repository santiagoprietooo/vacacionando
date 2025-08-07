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

const val = defineModel();
</script>

<template>
    <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
        <label for="provincia" class="w-max font-semibold">
            Provincia
        </label>

        <select
            name="provincia"
            id="provincia"
            v-model="val"
            class="p-2 w-full bg-slate-800 border-2 border-slate-500 rounded-lg outline-none transition-colors hover:bg-slate-600/25 focus:bg-slate-700 placeholder:text-slate-400"
        >
            <option
                v-for="location in argProvinces"
                :value="location.province"
            >
                {{ location.province }}
            </option>
        </select>
    </div>
</template>