<script setup>
import { onMounted, ref } from 'vue';

const provinces = ref([]);
const model = defineModel({ default: 'Seleccionar una provincia' });

async function getProvinces() {
    const data = await fetch('/provincias.json');
    provinces.value = await data.json();

    if (!model.value) {
        model.value = 'Seleccionar una provincia';
    }
}

onMounted(getProvinces);
</script>

<template>
    <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
        <label for="provincia" class="w-max font-semibold">
            Provincia *
        </label>

        <select
            name="provincia"
            id="provincia"
            v-model="model"
            class="p-2 w-full bg-slate-800 border-2 border-slate-500 rounded-lg outline-none transition-colors hover:bg-slate-600/25 focus:bg-slate-700"
            :class="model === 'Seleccionar una provincia' ? 'text-slate-400' : 'text-white'"
        >
            <option
                value="Seleccionar una provincia"
                disabled
            >
                Seleccionar una provincia
            </option>
            <option
                v-for="location in provinces"
                :key="location.province"
                :value="location.province"
                :disabled="location.province === 'Seleccionar una provincia'"
                :class="location.province === 'Seleccionar una provincia' ? 'text-slate-400' : 'text-white'"
            >
                {{ location.province }}
            </option>
        </select>
    </div>
</template>