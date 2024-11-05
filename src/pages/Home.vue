<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import InputWarning from '../components/InputWarning.vue';
import SubmitButton from '../components/SubmitButton.vue';
import PostingButton from '../components/PostingButton.vue';
import CloseButton from '../components/CloseButton.vue';
import { UserRound, SendHorizontal } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { savePublicPost, readPublicPosts } from '../services/users-posts';
import { subscribeToAuthChanges } from '../services/auth';
import { RouterLink } from 'vue-router';

const posts = ref([]);
const newPosts = ref({
    title : '',
    description : '',
    location : ''
});

const argLocations = [
    {province: "Buenos Aires"},
    {province: "Buenos Aires Capital Federal"},
    {province: "Catamarca"},
    {province: "Chaco"},
    {province: "Chubut"},
    {province: "Córdoba"},
    {province: "Corrientes"},
    {province: "Entre Ríos"},
    {province: "Formosa"},
    {province: "Jujuy"},
    {province: "La Pampa"},
    {province: "La Rioja"},
    {province: "Mendoza"},
    {province: "Misiones"},
    {province: "Neuquen"},
    {province: "Río Negro"},
    {province: "Salta"},
    {province: "San Juan"},
    {province: "San Luís"},
    {province: "Santa Cruz"},
    {province: "Sante Fe"},
    {province: "Santiago del Estero"},
    {province: "Tierra del Fuego"},
    {province: "Tucumán"}
]

onMounted(() => {
    readPublicPosts(newPosts => posts.value = newPosts);
    subscribeToAuthChanges(newUserData => loggedUser.value = newUserData);
});


const loggedUser = ref({
    id: null,
    email: null
});

let isActive = ref(false);
let isActive2 = ref(false);

function handleSubmit() {
    savePublicPost({
        ...newPosts.value
    });

    isActive.value = false;
}

function handleForm() {
    isActive.value = true;
}
function closeForm() {
    isActive.value = false;
}

function handleModal() {
    isActive2.value = true;
}
function closeModal() {
    isActive2.value = false;
}
</script>

<template>
    <div :class=" isActive ? 'flex relative z-40 min-h-screen' : 'hidden' ">
        <form action="#" @submit.prevent="handleSubmit" class="w-screen p-3 flex flex-col justify-center items-center bg-slate-700">
            <div class="absolute top-4 right-4">
                <CloseButton @click="closeForm"/>
            </div>
            
            <div class="flex flex-col justify-center gap-1 mb-3 w-3/4">
                <label for="title" class="w-max">Título</label>
                <input
                    type="text" id="title"
                    v-model="newPosts.title"
                    class="px-3 py-2 w-full border-2 rounded-lg border-slate-500 bg-slate-500 transition-colors outline-none focus:bg-slate-800 focus:text-white"
                >        
                <InputWarning v-if="newPosts.title.length < 5 || newPosts.title.length > 50">
                    El campo debe tener entre 5 y 50 carácteres.
                </InputWarning>
            </div>

            <div class="flex flex-col justify-center gap-1 mb-3 w-3/4">
                <label for="description" class="w-max">Descripción</label>
                <textarea
                    id="description" rows="10"
                    v-model="newPosts.description"
                    class="px-3 py-2 w-full resize-none border-2 rounded-lg border-slate-500 bg-slate-500 transition-colors outline-none focus:bg-slate-800 focus:text-white"
                ></textarea>

                <InputWarning v-if="newPosts.description.length < 10 || newPosts.description.length > 550">
                    El campo debe tener entre 10 y 550 carácteres.
                </InputWarning>
            </div>

            <div class="flex flex-col justify-center gap-1 mb-3 w-3/4">
                <label for="location" class="w-max">Provincia</label>
                <select
                    id="location"
                    v-model="newPosts.location"
                    class="px-3 py-2 w-full border-2 rounded-lg border-slate-500 bg-slate-500 transition-colors outline-none focus:bg-slate-800 focus:text-white"
                >
                    <option
                        v-for="location in argLocations"
                        :value="location.province"
                    >
                        {{ location.province }}
                    </option>
                </select>

                <InputWarning v-if="!newPosts.location">
                    Debe seleccionar una provincia.
                </InputWarning>
            </div>

            <div class="flex flex-col w-3/4 mt-8">
                <SubmitButton
                    :disabled="newPosts.title.length < 5 || newPosts.title.length > 50 ||
                    newPosts.description.length < 10 || newPosts.description.length > 550 ||
                    !newPosts.location"
                    color="slate"
                >
                    Realizar posteo
                </SubmitButton>
            </div>
        </form>
    </div>

    <section :class=" isActive ? 'hidden' : 'py-5 pb-32' ">
        <HeaderTitle>Bienvenido a la Home</HeaderTitle>

        <div :class=" isActive2 ? 'h-full block fixed z-40 top-0 bottom-0 left-0 right-0 bg-slate-900 bg-opacity-90' : 'hidden' ">
            <div class="flex flex-col p-10 bg-slate-700">
                <div class="absolute top-1 right-1">
                    <CloseButton @click="closeModal"/>
                </div>
                <div class="mt-4">
                    <div class="flex- flex-col text-center">
                        <p class="text-2xl font-semibold">¡No tenés una cuenta!</p>
                        <p class="text-lg mt-2">Para poder postear tenés que iniciar sesión o crear una cuenta</p>
                    </div>
                    <div class="flex flex-col items-center text-center mt-8 gap-4">
                        <RouterLink to="/sign-in" class="p-2 w-full md:w-3/4 bg-transparente border-2 border-slate-200 rounded-full text-white font-semibold">Iniciar Sesión</RouterLink>
                        <RouterLink to="/log-in" class="p-2 w-full md:w-3/4 bg-slate-200 border-2 border-slate-200 rounded-full text-black font-semibold">Crear Cuenta</RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <section class="flex flex-col mt-8 border-t border-slate-500">
            <article
                v-for="post in posts"
                class="p-4 transition-all hover:bg-slate-800"
            >
                <div class="flex flex-row items-center gap-4">
                        <RouterLink :to="`/profile/${post.user_id}`">
                            <span class="flex flex-col justify-center items-center rounded-full bg-white size-10">
                                <UserRound class="text-black"/>
                            </span>
                        </RouterLink>
                        <RouterLink :to="`/profile/${post.user_id}`">
                            <p class="text-xl font-bold">{{ post.user_email }}</p>                        
                        </RouterLink>
                </div>

                <div class="relative p-4 mt-3 ml-[3.250rem] flex flex-col border border-slate-500 rounded-2xl">
                    <div class="px-2 py-1 absolute top-0 right-0 bg-slate-500 border border-slate-500 rounded-se-xl">
                        <p class="text-xs text-right font-medium">
                            {{
                                post.created_at.toDate().toLocaleString()
                            }}
                        </p>
                    </div>
                    <p class="text-xl font-medium">{{ post.title }}</p>
                    <p class="text-base font-normal">{{ post.description }}</p>
                    <p class="mt-4 text-sm font-semibold">{{ post.location }}</p>
                </div>

                <div class="mt-3 ml-[3.250rem] flex flex-col items-end gap-2">
                    <form action="#" class="w-full flex">
                        <textarea
                        id="comment"
                        rows="1"
                        placeholder="Comentar..."
                        class="px-4 py-2 w-full h-full transition-colors bg-transparent border-2 border-slate-300 rounded-s-full border-opacity-35 outline-none resize-none text-slate-400 placeholder:text-slate-400 focus:border-opacity-100 focus:text-white focus:placeholder:text-white"
                        ></textarea>

                        <SubmitButton rounded="comment" width="max" v-if="loggedUser.id !== null">
                            <SendHorizontal class="block md:hidden"/>
                            <p class="hidden md:block">Enviar</p>
                        </SubmitButton>

                        <SubmitButton rounded="comment" width="max" @click="handleModal" v-else>
                            <SendHorizontal class="block md:hidden"/>
                            <p class="hidden md:block">Enviar</p>
                        </SubmitButton>
                    </form>
                </div>
            </article>
        </section>

        <PostingButton @click="handleForm" v-if="loggedUser.id !== null">
            Postear
        </PostingButton>
        <PostingButton @click="handleModal" v-else>
            Postear
        </PostingButton>
    </section>
</template>