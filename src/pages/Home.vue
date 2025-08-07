<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import SubmitButton from '../components/SubmitButton.vue';
import PostComponent from '../components/PostComponent.vue';
import PostingButton from '../components/PostingButton.vue';
import CloseButton from '../components/CloseButton.vue';
import FormField from '../components/SelectInput.vue';
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { savePublicPost, readPublicPosts } from '../services/users-posts';
import { subscribeToAuthChanges } from '../services/auth';
import AlertMessage from '../components/AlertMessage.vue';
import TextInput from '../components/TextInput.vue';
import TextareaInput from '../components/TextareaInput.vue';

const loggedUser = ref({
    id: null,
    email: null
});

const posts = ref([]);
const newPosts = ref({
    title : '',
    description : '',
    location : ''
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

onMounted(() => {
    loadingStates.value = {
        loading: true,
        state: 'loading_posts'
    };

    readPublicPosts(async (newPosts) => posts.value = await newPosts);
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);
});

watch(posts, (newPosts) => {
    if (newPosts.length > 0) {
        cleanLoadingState();
    }
}, { immediate: true });

let isActive = ref(false);

watch(isActive, (activeModal) => {
    if (activeModal === false) {
        newPosts.value = {
            title: '',
            description: '',
            location: ''
        }
    }
}, { immediate: true });

let isActive2 = ref(false);

async function handleSubmit() {
    loadingStates.value = {
        loading: true,
        state: 'saving_post'
    }

    try {
        await savePublicPost({
            ...newPosts.value
        });

        loadingStates.value = {
            loading: true,
            state: 'post_saved'
        }

        setTimeout(() => {
            isActive.value = false;
            cleanLoadingState();
        }, 3000);

        newPosts.value = {
            title: '',
            description: '',
            location: ''
        };
    } catch (error) {
        loadingStates.value = {
            loading: false,
            state: 'error_saving_post'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
    }
}
</script>

<template>
    <dialog v-if="isActive" class="relative z-30 flex min-h-screen w-full">
        <h1 class="sr-only">Crear una publicación</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4 p-4 w-full bg-slate-700 text-white">
            <div class="place-items-end w-full">
                <CloseButton v-model="isActive"/>
            </div>

            <TextInput
                use-for="título"
                text="Título de la publicación"
                placeholder="Mi viaje a..."
                v-model="newPosts.title"
            />

            <TextareaInput
                use-for="descripción"
                text="Descripción"
                placeholder="¡La pasé increíble!"
                v-model="newPosts.description"
            />

            <FormField v-model="newPosts.location"/>

            <div class="flex flex-col mt-4 max-md:w-full md:w-2/3 lg:w-2/4">
                <SubmitButton
                    width="max"
                    :disabled="loadingStates.loading && loadingStates.state === 'saving_post' || newPosts.title.trim() === '' || newPosts.description.trim() === '' || !newPosts.location"
                >
                    {{ loadingStates.loading && loadingStates.state === 'saving_post' ? "Publicando..." : "Realizar publicación"}}
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
                            class="p-2 w-3/4 lg:w-1/2 bg-slate-200 text-black font-semibold border-2 border-slate-200 rounded-full"
                        >
                            Iniciar Sesión
                        </RouterLink>

                        <RouterLink
                            to="/log-in"
                            class="p-2 w-3/4 lg:w-1/2 text-white font-semibold border-2 border-slate-200 rounded-full"
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

            <template v-if="loadingStates.loading && loadingStates.state === 'loading_posts'">
                <div class="flex items-center justify-center p-4">
                    <p class="text-xl text-center font-semibold">
                        Cargando...
                    </p>
                </div>
            </template>

            <PostingButton v-if="loggedUser.id !== null" v-model="isActive" />

            <PostingButton v-else v-model="isActive2" />
        </section>
    </section>

    <AlertMessage
        v-if="loadingStates.loading && loadingStates.state === 'post_saved'"
        v-model="loadingStates.loading"
    />

    <AlertMessage
        v-else-if="loadingStates.loading && loadingStates.state === 'error_saving_post'"
        message="Error al crear la publicación."
        v-model="loadingStates.loading"
    />
</template>