<script setup>
import CloseButton from '../components/Buttons/CloseButton.vue';
import TextInput from '../components/Inputs/TextInput.vue';
import TextareaInput from '../components/Inputs/TextareaInput.vue';
import SelectInput from '../components/Inputs/SelectInput.vue';
import SubmitButton from '../components/Buttons/SubmitButton.vue';
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import PostComponent from '../components/PostComponent.vue';
import PostingButton from '../components/Buttons/PostingButton.vue';
import AlertMessage from '../components/Messages/AlertMessage.vue';
import Loader from '../components/Loader/Loader.vue';
import { ImagePlus, X } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useFileSystemAccess } from '@vueuse/core';
import { savePublicPost, readPublicPosts } from '../services/users-posts';
import { useLoadingState } from '../composables/useLoadingState';
import { useLoggedUser } from '../composables/useLoggedUser';

const { loggedUser } = useLoggedUser();

const posts = ref([]);
const newPosts = ref({
    title: '',
    description: '',
    location: ''
});
const file = ref({
    preview: null,
    photo: null
});

const { open, file: fileSelected } = useFileSystemAccess({
    types: [{
        description: 'Imágenes',
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
    }]
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

const { loadingState, cleanLoadingState } = useLoadingState();

onMounted(() => {
    loadingState.value = {
        loading: true,
        state: 'loading_posts'
    }

    readPublicPosts(async (newPosts) => posts.value = await newPosts);
});

watch(posts, (newPost) => {
    if (!posts.value || posts.value.length === 0) {
        cleanLoadingState();
    }

    if (newPost && loadingState.value.loading === true && loadingState.value.state === 'loading_posts') {
        cleanLoadingState();
    }
});

let isActive = ref(false);
let isActive2 = ref(false);

async function handleSubmit() {
    loadingState.value = {
        loading: true,
        state: 'saving_post'
    }

    try {
        await savePublicPost({
            ...newPosts.value
        }, file.value.photo);

        loadingState.value = {
            loading: true,
            state: 'post_saved'
        }

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);

        newPosts.value = {
            title: '',
            description: '',
            location: ''
        };

        file.value = {
            preview: null,
            photo: null
        }
    } catch (error) {
        loadingState.value = {
            loading: false,
            state: 'error_saving_post'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
    }

    isActive.value = false;
}
</script>

<template>
    <dialog v-if="isActive" class="relative z-30 flex min-h-screen w-full">
        <h1 class="sr-only">Crear una publicación</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4 p-4 w-full bg-slate-700 text-white">
            <div class="place-items-end w-full">
                <CloseButton
                    v-model="isActive"
                    @click="
                        newPosts = { title: '', description: '', location: '' };
                        file = { photo: null, preview: null }
                    "
                />
            </div>

            <TextInput
                use-for="título"
                text="Título de la publicación *"
                placeholder="Mi viaje a..."
                v-model="newPosts.title"
                :define-limit="50"
            />

            <TextareaInput
                use-for="descripción"
                text="Descripción *"
                placeholder="¡La pasé increíble!"
                v-model="newPosts.description"
                :define-limit="500"
            />

            <div v-if="file.photo" class="flex flex-col gap-1 max-md:w-full md:w-2/3 lg:w-2/4">
                <span class="w-max font-semibold">Foto</span>
                <div
                    class="relative size-[120px] bg-center bg-no-repeat bg-cover border-2 border-slate-500 rounded-lg max-sm:h-[320px] max-sm:w-full"
                    :style="{ backgroundImage: `url(${file.preview})` }"
                    role="img"
                    :aria-label="`Vista previa de la foto seleccionada`"
                >
                    <button
                        type="button"
                        class="absolute z-10 top-1 right-1 place-self-end p-1 rounded-full outline-none transition-colors hover:bg-slate-50/15 focus:bg-slate-50/25"
                        @click="file = { preview: null, photo: null }"
                        aria-label="Eliminar foto"
                    >
                        <X class="size-5 text-white"/>
                    </button>
                </div>
            </div>

            <SelectInput v-model="newPosts.location"/>

            <div class="flex items-center justify-between mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <button
                    type="button"
                    class="flex items-center justify-center w-max p-2 border-2 border-transparent rounded-full outline-none transition-colors text-slate-200 hover:bg-slate-800/75 focus:bg-slate-800"
                    @click="open"
                >
                    <span class="sr-only">Seleccionar una foto</span>
                    <ImagePlus class="size-6"/>
                </button>

                <SubmitButton
                    :disabled="loadingState.state !== '' || newPosts.title.trim() === '' || newPosts.description.trim() === '' || !newPosts.location || newPosts.location === 'Seleccionar una provincia'"
                >
                    {{ loadingState.state !== '' ? "Publicando..." : "Realizar publicación"}}
                </SubmitButton>
            </div>
        </form>
    </dialog>

    <section v-else class="pb-40 lg:pb-32">
        <HeaderTitle text="Vacacionando" />

        <div v-if="isActive2" class="h-full block fixed z-40 top-0 bottom-0 left-0 right-0 bg-slate-900 bg-opacity-90">
            <div class="flex flex-col gap-2 p-4 bg-slate-700">
                <div class="place-items-end w-full">
                    <CloseButton v-model="isActive2"/>
                </div>

                <div>
                    <div class="flex flex-col gap-2 text-center">
                        <p class="text-2xl font-semibold">¡No tenés una cuenta!</p>
                        <p class="text-lg">Para realizar publicaciones tenés que iniciar sesión o crear una cuenta.</p>
                    </div>

                    <div class="flex flex-col items-center gap-2 mt-8 mb-2 text-center">
                        <RouterLink
                            to="/sign-in"
                            class="p-2 w-3/4 lg:w-1/2 bg-slate-200 text-black font-semibold border-slate-200 rounded-full transition-all border-2 border-transparent outline-none hover:bg-slate-200 focus:bg-slate-500 focus:text-slate-100 focus:border-white"
                        >
                            Iniciar Sesión
                        </RouterLink>

                        <RouterLink
                            to="/log-in"
                            class="p-2 w-3/4 lg:w-1/2 border-2 border-slate-200 text-white font-semibold rounded-full outline-none transition-all hover:bg-slate-200/10 focus:bg-slate-300/25"
                        >
                            Crear Cuenta
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <section class="flex flex-col">
            <h2 class="sr-only">Posteos</h2>

            <template v-if="posts.length > 0" v-for="post in posts">
                <PostComponent :post="post" :logged-user="loggedUser" />
            </template>

            <template v-if="loadingState.loading && loadingState.state === 'loading_posts'">
                <Loader />
            </template>

            <template v-if="!posts || posts.length === 0 && !loadingState.loading && loadingState.state === ''">
                <div class="flex items-center justify-center p-4">
                    <p class="text-slate-400 text-sm">
                        No hay publicaciones aún. ¡Convertite en el primero en crear una!
                    </p>
                </div>
            </template>

            <PostingButton v-if="loggedUser.id !== null" :disabled="loadingState.state === 'post_saved'" v-model="isActive" />

            <PostingButton v-else v-model="isActive2" />
        </section>
    </section>

    <AlertMessage
        v-if="loadingState.loading && loadingState.state === 'post_saved'"
        v-model="loadingState.loading"
    />

    <AlertMessage
        v-else-if="loadingState.loading && loadingState.state === 'error_saving_post'"
        message="Error al crear la publicación."
        v-model="loadingState.loading"
    />
</template>