<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import ReturnBtn from '../components/ReturnBtn.vue';
import SubmitButton from '../components/SubmitButton.vue';
import AlertMessage from '../components/AlertMessage.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { editMyProfile, subscribeToAuthChanges } from '../services/auth';

const router = useRouter();

const argProvinces = ref([]);

async function getProvinces() {
    try {
        const res = await fetch('/provincias.json');

        if (!res.ok) throw new Error('Error al cargar provincias');

        argProvinces.value = await res.json();
    } catch (err) {
        argProvinces.value = [];
        console.error('[getProvinces]', err);
    }
}

const loggedUser = ref({
    displayName: '',
    bio: '',
    traveledTo: []
});

onMounted(async () => {
    subscribeToAuthChanges(async (newUserData) => {
    loggedUser.value = await {
        ...loggedUser.value,
        ...newUserData,
        traveledTo: Array.isArray(newUserData.traveledTo)
            ? newUserData.traveledTo
            : []
    };
});

    await getProvinces();
});

const loadingStates = ref({
    loading: false,
    state: ''
});

function cleanLoadingState() {
    loadingStates.value = {
        loading: false,
        state: ''
    }
}

const handleSubmit = async () => {
    loadingStates.value = {
        loading: true,
        state: 'updating_profile'
    };

    try {
        await editMyProfile({ ...loggedUser.value });

        loadingStates.value = {
            loading: true,
            state: 'profile_updated'
        };

        setTimeout(() => {
            cleanLoadingState();
            router.push('/profile');
        }, 3000);
    } catch (error) {
        loadingStates.value = {
            loading: true,
            state: 'error_updating_profile'
        };

        cleanLoadingState();

        console.error("[MyProfileEdit handleSubmit] Error al actualizar el perfil: ", error);
    }
}
</script>

<template>
    <HeaderTitle text="Editar Mi Perfil">
        <template #content-before>
            <ReturnBtn />
        </template>
    </HeaderTitle>

    <section class="p-4 pb-48 md:pb-24">
        <h2 class="sr-only">Información actual de la cuenta</h2>

        <form action="#" @submit.prevent="handleSubmit" class="flex flex-col items-center gap-5">
            <div class="flex flex-col gap-1 w-2/3 max-sm:w-full">
                <label for="displayName" class="w-max font-bold">Nombre</label>
                <input type="text" id="displayName" v-model="loggedUser.displayName" autocomplete="off"
                    class="w-full p-2 bg-slate-800 border-2 border-slate-500 rounded-lg transition-colors outline-none focus:bg-slate-700 focus:text-white">
            </div>

            <div class="flex flex-col gap-1 w-2/3 max-sm:w-full">
                <label for="bio" class="w-max font-bold">Biografía</label>
                <textarea id="bio" rows="8" v-model="loggedUser.bio"
                    class="w-full p-2 bg-slate-800 border-2 border-slate-500 rounded-lg transition-colors outline-none focus:bg-slate-700 focus:text-white"></textarea>
            </div>

            <div class="flex flex-col gap-1 w-2/3 max-sm:w-full">
                <p class="font-bold">Viajé a...</p>
                <div v-for="(location, index) in argProvinces" :key="index">
                    <label :for="'province-' + index">
                        <input type="checkbox" v-model="loggedUser.traveledTo" :value="location.province"
                            :id="'province-' + index" />

                        {{ location.province }}
                    </label>
                </div>
            </div>

            <div class="flex flex-col w-2/3 gap-4 mt-4 max-sm:w-full">
                <SubmitButton :disabled="loadingStates.loading || !loggedUser.displayName || loggedUser.displayName.trim() === ''">
                    {{ loadingStates.loading && loadingStates.state === 'updating_profile' ?
                        'Actualizando...'
                        :
                        'Actualizar Perfil'
                    }}
                </SubmitButton>

                <button type="button" @click="router.push('/profile')" :disabled="loadingStates.loading"
                    class="flex justify-center items-center px-6 py-2 w-full border-2 border-slate-200 text-white font-semibold rounded-lg transition-all hover:bg-slate-200/10 focus:bg-slate-300/25 disabled:opacity-50 disabled:cursor-not-allowed">
                    Cancelar
                </button>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'profile_updated'"
        message="Perfil actualizado correctamente"
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_updating_profile'"
        message="Error al actualizar el perfil"
        v-model="loadingStates.loading"
    />
</template>