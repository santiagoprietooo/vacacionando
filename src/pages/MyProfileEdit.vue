<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import ReturnBtn from '../components/ReturnBtn.vue';
import TextInput from '../components/TextInput.vue';
import TextareaInput from '../components/TextareaInput.vue';
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
        displayName: !loggedUser.value.displayName && !newUserData.displayName
            ? newUserData.email.slice(0, newUserData.email.indexOf("@"))
            : newUserData.displayName
        ,
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

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
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

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4">
            <TextInput
                use-for="nombre"
                text="Nombre"
                fill="on"
                placeholder="Usuario"
                v-model="loggedUser.displayName"
            />

            <TextareaInput
                use-for="sobre-mí"
                text="Sobre mí"
                placeholder="¡Soy un usuario de Vacacionando!"
                v-model="loggedUser.bio"
            />

            <div class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
                <p class="font-semibold">Viajé a...</p>
                <div v-for="(location, index) in argProvinces" :key="index">
                    <label :for="'province-' + index">
                        <input type="checkbox" v-model="loggedUser.traveledTo" :value="location.province"
                            :id="'province-' + index" />

                        {{ location.province }}
                    </label>
                </div>
            </div>

            <div class="flex flex-col gap-4 mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton :disabled="loadingStates.loading || !loggedUser.displayName || loggedUser.displayName.trim() === ''">
                    {{ loadingStates.loading && loadingStates.state === 'updating_profile' ?
                        'Actualizando...' : 'Actualizar Perfil'
                    }}
                </SubmitButton>

                <button
                    type="button"
                    class="flex justify-center items-center px-6 py-2 w-full border-2 border-slate-200 text-white font-semibold rounded-lg transition-all hover:bg-slate-200/10 focus:bg-slate-300/25 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="router.push('/profile')"
                    :disabled="loadingStates.loading"
                >
                    Cancelar
                </button>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'profile_updated'"
        message="Perfil actualizado correctamente. Redirigiendo..."
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_updating_profile'"
        message="Error al actualizar el perfil."
        v-model="loadingStates.loading"
    />
</template>