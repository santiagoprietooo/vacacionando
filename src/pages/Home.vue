<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import SubmitButton from '../components/SubmitButton.vue';
import PostComponent from '../components/PostComponent.vue';
import PostingButton from '../components/PostingButton.vue';
import CloseButton from '../components/CloseButton.vue';
import FormField from '../components/FormField.vue';
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { savePublicPost, readPublicPosts } from '../services/users-posts';
import { subscribeToAuthChanges } from '../services/auth';

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

const loading = ref(false);
const loading2 = ref(false);

onMounted(() => {
    loading2.value = true;

    readPublicPosts(async (newPosts) => posts.value = await newPosts);
    subscribeToAuthChanges(async (newUserData) => loggedUser.value = await newUserData);
});

watch(posts, (newPosts) => {
    if (newPosts.length > 0) {
        loading2.value = false;
    }
}, { immediate: true });

let isActive = ref(false);
let isActive2 = ref(false);

async function handleSubmit() {
    loading.value = true;

    try {
        await savePublicPost({
            ...newPosts.value
        });

        newPosts.value = {
            title: '',
            description: '',
            location: ''
        };
    } catch (error) {
        loading.value = false;

        console.error('Error al guardar el post:', error);
        throw error;
    }

    loading.value = false;
    isActive.value = false;
}
</script>

<template>
    <dialog v-if="isActive" class="relative z-30 flex min-h-screen w-full">
        <h1 class="sr-only">Crear una publicación</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-2 p-4 w-full bg-slate-700 text-white">
            <div class="place-items-end w-full">
                <CloseButton v-model="isActive"/>
            </div>

            <FormField
                use-for="titulo"
                text="Título"
                v-model="newPosts.title"
            />

            <FormField
                use-for="descripcion"
                text="Descripción"
                v-model="newPosts.description"
            />

            <FormField
                use-for="provincia"
                text="Provincia"
                v-model="newPosts.location"
            />

            <div class="flex flex-col mt-8 w-3/4 max-sm:w-full">
                <SubmitButton
                    :disabled="loading || newPosts.title.length < 5 || newPosts.title.length > 50 ||
                    newPosts.description.length < 10 || newPosts.description.length > 550 ||
                    !newPosts.location"
                    color="slate"
                >
                    {{ loading ? "Publicando..." : "Realizar posteo"}}
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

            <template v-if="loading2">
                <div class="flex items-center justify-center h-96">
                    <p class="text-center text-xl font-semibold">
                        Cargando...
                    </p>
                </div>
            </template>

            <PostingButton v-if="loggedUser.id !== null" @click="isActive = !isActive" />

            <PostingButton v-else @click="isActive2 = !isActive2" />
        </section>
    </section>
</template>