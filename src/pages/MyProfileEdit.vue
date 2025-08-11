<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import TextInput from '../components/Inputs/TextInput.vue';
import TextareaInput from '../components/Inputs/TextareaInput.vue';
import SubmitButton from '../components/Buttons/SubmitButton.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import Loader from '../components/Loader/Loader.vue';
import { UserRound } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFileSystemAccess } from '@vueuse/core';
import { editMyProfile } from '../services/auth';
import { useLoggedUser } from '../composables/useLoggedUser';
import { useLoadingState } from '../composables/useLoadingState';

const { loggedUser } = useLoggedUser();
const { loadingState, cleanLoadingState } = useLoadingState();

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

const { open, file: fileSelected } = useFileSystemAccess({
    types: [{
        description: 'Imágenes',
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
    }]
});

const file = ref({
    preview: null,
    photo: null
});

watch(fileSelected, (newFile) => {
    if (!newFile) return;

    file.value.photo = newFile;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
        file.value.preview = reader.result;
    });

    reader.readAsDataURL(file.value.photo);
});

const handleSubmit = async () => {
    loadingState.value = {
        loading: true,
        state: 'updating_profile'
    };

    try {
        await editMyProfile({ ...loggedUser.value }, file.value.photo);

        loadingState.value = {
            loading: true,
            state: 'profile_updated'
        };

        setTimeout(() => {
            cleanLoadingState();
            router.push('/profile');
        }, 3000);
    } catch (error) {
        loadingState.value = {
            loading: true,
            state: 'error_updating_profile'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
    }
}

onMounted(async () => {
    loadingState.value = {
        loading: true,
        state: 'loading_profile'
    }

    setTimeout(() => { cleanLoadingState() }, 3000)

    await getProvinces();
});
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
            <div class="flex items-end gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
                <span class="sr-only">Foto de perfil</span>

                <Loader v-if="loadingState.loading && loadingState.state === 'loading_profile'"/>

                <template v-else>
                    <div
                        v-if="loggedUser.photoURL && !file.preview"
                        class="size-[72px] bg-center bg-no-repeat bg-cover rounded-full"
                        :style="{ backgroundImage: `url(${loggedUser.photoURL})` }"
                        role="img"
                        :aria-label="`Foto de perfil del usuario`"
                    />

                    <div
                        v-else-if="!loggedUser.photoURL && file.photo || file.preview"
                        class="size-[72px] bg-center bg-no-repeat bg-cover rounded-full"
                        :style="{ backgroundImage: `url(${file.preview})` }"
                        role="img"
                        :aria-label="`Foto de perfil seleccionada`"
                    />

                    <div
                        v-else-if="!loggedUser.photoURL && !file.photo && !file.preview"
                        class="w-max p-4 bg-white text-slate-900 rounded-full"
                        role="img"
                        aria-label="Foto predeterminada del usuario"
                    >
                        <UserRound class="size-10"/>
                    </div>
                </template>

                <div class="flex items-center gap-1 max-[400px]:flex-col max-[400px]:items-start max-[400px]:gap-2" v-if="!loadingState.loading && loadingState.state !== 'loading_profile'">
                    <button
                        type="button"
                        class="text-slate-400 text-sm outline-none hover:underline focus:underline"
                        @click="open"
                    >
                        {{ !loggedUser.photoURL && !file.photo && !file.preview ?
                            'Agregar foto de perfil' :
                            'Editar foto de perfil'
                        }}
                    </button>

                    <template v-if="loggedUser.photoURL && !file.preview">
                        <span class="max-[400px]:hidden text-slate-400 text-sm">·</span>

                        <button
                            type="button"
                            class="text-slate-400 text-sm outline-none hover:underline focus:underline"
                            @click="loggedUser.photoURL = null"
                        >
                            Eliminar foto actual
                        </button>
                    </template>

                    <template v-if="file.preview">
                        <span class="max-[400px]:hidden text-slate-400 text-sm">·</span>

                        <button
                            type="button"
                            class="text-slate-400 text-sm outline-none hover:underline focus:underline"
                            @click="file = { preview: null, photo: null }"
                        >
                            Eliminar foto seleccionada
                        </button>
                    </template>
                </div>
            </div>

            <TextInput
                use-for="nombre"
                text="Nombre"
                fill="on"
                placeholder="Usuario"
                v-model="loggedUser.displayName"
                :show-limit="false"
            />

            <TextareaInput
                use-for="sobre-mí"
                text="Sobre mí"
                placeholder="¡Soy un usuario de Vacacionando!"
                v-model="loggedUser.bio"
                :define-limit="500"
            />

            <template v-if="!argProvinces">
                <Loader />
            </template>

            <template v-else>
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
            </template>

            <div class="flex justify-end gap-4 mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton :disabled="loadingState.loading || !loggedUser.displayName || loggedUser.displayName.trim() === ''">
                    {{ loadingState.loading && loadingState.state === 'updating_profile' ?
                        'Actualizando...' : 'Actualizar Perfil'
                    }}
                </SubmitButton>

                <button
                    type="button"
                    class="flex justify-center items-center px-6 py-2 w-max border-2 border-slate-200 text-white font-semibold rounded-lg outline-none transition-all hover:bg-slate-200/10 focus:bg-slate-300/25 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="router.push('/profile')"
                    :disabled="loadingState.loading"
                >
                    Cancelar
                </button>
            </div>
        </form>
    </section>

    <AlertMessage
        v-if="loadingState.loading && loadingState.state === 'profile_updated'"
        message="Perfil actualizado correctamente. Redirigiendo..."
        v-model="loadingState.loading"
    />

    <AlertMessage
        v-else-if="loadingState.loading && loadingState.state === 'error_updating_profile'"
        message="Error al actualizar el perfil."
        v-model="loadingState.loading"
    />
</template>