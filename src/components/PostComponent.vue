<script setup>
import SubmitButton from './Buttons/SubmitButton.vue';
import CloseButton from './Buttons/CloseButton.vue';
import AlertMessage from './Messages/AlertMessage.vue';
import { MapPin, SendHorizontal, UserRound, X } from 'lucide-vue-next';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { saveComment, subscribeToComments } from '../services/comments';
import { getUserEmail } from '../services/user-profile';
import { useLoadingState } from '../composables/useLoadingState';

const props = defineProps({
    post: {
        type: Object,
        required: true
    },
    loggedUser: {
        type: Object,
        required: true
    }
});

const route = useRoute();
const postID = props.post.id;

const isOnThatProfile = computed(() => {
    return route.name === 'public_post' && postID === route.params.id;
});

const comment = ref('');
const comments = ref([]);
const userNames = ref([]);

const { loadingState, cleanLoadingState } = useLoadingState();

watch(comments, (newComment) => {
    if (!newComment) return;

    if (newComment && loadingState.value.loading === true && loadingState.value.state === 'loading_comments') {
        cleanLoadingState();
    }
});

async function handleSubmitComment() {
    loadingState.value = {
        loading: true,
        state: 'sending_comment'
    };

    try {
        await saveComment(postID, comment.value, props.loggedUser.id);

        loadingState.value = {
            loading: true,
            state: 'comment_sent'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);

        comment.value = '';
    } catch (error) {
        loadingState.value = {
            loading: false,
            state: 'error_saving_comment'
        };

        setTimeout(() => {
            cleanLoadingState();
        }, 3000);
    }
}

async function showUsersEmail(id) {
    const alreadyExists = userNames.value.find((u) => u.id === id);

    if (!alreadyExists) {
        const email = await getUserEmail(id);
        userNames.value.push({ id, email });
    }
}

const openedImage = ref('');
function openIMG(img) {
    if (!img) return;

    openedImage.value = img;
}

let unsubscribeComments = null;

onMounted(() => {
    loadingState.value = {
        loading: true,
        state: 'loading_comments'
    }

    unsubscribeComments = subscribeToComments(postID, async (newComments) => {
        comments.value = await newComments;

        for (const c of newComments) {
            await showUsersEmail(c.user_id);
        }
    });
});

onBeforeUnmount(() => {
    if (unsubscribeComments) {
        unsubscribeComments();
    }
});
</script>

<template>
    <div
        class="flex flex-col items-start gap-4 p-4 w-full border-b border-slate-500 transition-colors last:border-b-0"
        :class="{
            'hover:bg-slate-800/40': route.path === '/'
        }"
    >
        <div class="flex flex-row items-center gap-2 w-max hover:underline">
            <template v-if="loggedUser.id === post?.user_id">
                <RouterLink to="/profile" class="rounded-full">
                    <span class="flex flex-col items-center justify-center rounded-full bg-white size-10">
                        <UserRound class="text-black" />
                    </span>
                </RouterLink>

                <h2 class="flex items-center">
                    <RouterLink to="/profile" class="text-xl font-bold outline-none focus:underline max-sm:max-w-[200px] max-sm:truncate">
                        {{ post?.user_email }}
                    </RouterLink>
                </h2>
            </template>

            <template v-else>
                <RouterLink :to="{ name: 'profile', params: { id: post?.user_id } }" class="rounded-full">
                    <span class="flex flex-col items-center justify-center rounded-full bg-white size-10">
                        <UserRound class="text-black" />
                    </span>
                </RouterLink>

                <h2 class="flex items-center">
                    <RouterLink :to="{ name: 'profile', params: { id: post?.user_id } }" class="text-xl font-bold outline-none focus:underline max-sm:max-w-[200px] max-sm:truncate">
                        {{ post?.user_email }}
                    </RouterLink>
                </h2>
            </template>
        </div>

        <template v-if="!isOnThatProfile">
            <RouterLink :to="{ name: 'public_post', params: { id: post?.id } }" class="flex flex-col w-full border border-slate-500 rounded-2xl outline-none transition-all focus:bg-slate-700/50">
                <article class="p-4">
                    <h3 class="text-xl font-medium">{{ post?.title }}</h3>
                    <p class="text-base font-normal">{{ post?.description }}</p>

                    <figure v-if="post?.photo" class="mt-4">
                        <div
                            class="size-[420px] bg-center bg-no-repeat bg-cover border-2 border-transparent rounded-xl outline-none max-sm:h-[320px] max-sm:w-full cursor-pointer focus:border-slate-300/50"
                            tabindex="0"
                            role="img"
                            :style="{ backgroundImage: `url(${post?.photo})` }"
                            :aria-label="`Imagen de la publicación de ${post?.user_email}`"
                            @click="openIMG(post?.photo)"
                        />
                    </figure>

                    <div class="flex items-center gap-1" :class="!post?.photo ? 'mt-4' : 'mt-2'">
                        <MapPin class="size-4 stroke-[1.5]" aria-roledescription="ícono de ubicación" />
                        <p class="text-sm font-thin">{{ post?.location }}</p>
                    </div>
                </article>

                <div class="flex justify-end w-full">
                    <time :datetime="comment?.created_at" class="py-1 px-2 w-max bg-slate-500 text-xs font-medium border border-slate-500 rounded-ss-xl rounded-ee-xl">
                        {{ post?.created_at?.toDate().toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: 'h23',
                        }) }}
                    </time>
                </div>
            </RouterLink>
        </template>

        <template v-else>
            <div class="flex flex-col w-full border border-slate-500 rounded-2xl">
                <article class="p-4">
                    <h3 class="text-xl font-medium">{{ post?.title }}</h3>
                    <p class="text-base font-normal">{{ post?.description }}</p>

                    <figure v-if="post?.photo" class="mt-4">
                        <div
                            class="size-[420px] bg-center bg-no-repeat bg-cover border-2 border-transparent rounded-xl outline-none max-sm:h-[320px] max-sm:w-full cursor-pointer focus:border-slate-300/50"
                            tabindex="0"
                            role="img"
                            :style="{ backgroundImage: `url(${post?.photo})` }"
                            :aria-label="`Imagen de la publicación de ${post?.user_email}`"
                            @click="openIMG(post?.photo)"
                        />
                    </figure>

                    <div class="flex items-center gap-1" :class="!post?.photo ? 'mt-4' : 'mt-2'">
                        <MapPin class="size-4 stroke-[1.5]" aria-roledescription="ícono de ubicación" />
                        <p class="text-sm font-thin">{{ post?.location }}</p>
                    </div>
                </article>

                <div class="flex justify-end w-full">
                    <time :datetime="comment?.created_at" class="py-1 px-2 w-max bg-slate-500 text-xs font-medium border border-slate-500 rounded-ss-xl rounded-ee-xl">
                        {{ post?.created_at.toDate().toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: 'h23',
                        }) }}
                    </time>
                </div>
            </div>
        </template>

        <div class="flex flex-col items-end gap-2 w-full">
            <form @submit.prevent="handleSubmitComment" class="flex w-full">
                <label :for="`comment-${post?.id}`" class="sr-only">Comentar</label>
                <textarea
                    :name="`comment-${post?.id}`"
                    :id="`comment-${post?.id}`"
                    v-model="comment"
                    :disabled="!loggedUser?.id || loadingState.state === 'sending_comment'"
                    rows="1"
                    placeholder="Comentar..."
                    class="px-4 py-2 w-full min-h-[43.2px] transition-colors bg-transparent border-2 border-slate-300 rounded-s-full border-opacity-35 outline-none resize-none text-slate-400 placeholder:text-slate-400 focus:border-opacity-100 focus:text-white focus:placeholder:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <SubmitButton v-if="!loggedUser || !loggedUser.id" rounded="comment" disabled>
                    <SendHorizontal class="block md:hidden" />
                    <span class="max-md:sr-only">Enviar</span>
                </SubmitButton>

                <SubmitButton v-else rounded="comment" :disabled="comment.trim() === '' || loadingState.state === 'sending_comment'">
                    <SendHorizontal class="block md:hidden" />
                    <span class="max-md:sr-only">Enviar</span>
                </SubmitButton>
            </form>
        </div>

        <RouterLink
            v-if="comments?.length > 0 && route.path === '/'"
            :to="{ name: 'public_post', params: { id: post?.id } }"
            class="w-max text-slate-400 text-sm font-medium outline-none transition-all hover:text-slate-300 hover:underline focus:text-slate-300 focus:underline"
        >
            Ver {{ comments?.length }} {{ comments?.length > 1 ? "comentarios" : "comentario" }}
        </RouterLink>
    </div>

    <section v-if="route.path !== '/'" class="flex flex-col items-start w-full">
        <template v-if="comments.length > 0">
            <h2 class="p-4 text-lg font-semibold">Comentarios</h2>

            <ul class="w-full">
                <li
                    v-for="comment in comments"
                    class="flex flex-col items-start gap-2 w-full p-4 odd:bg-slate-700/25 even:bg-slate-800/25"
                    :key="comment.id"
                >
                    <div class="w-full">
                        <template v-if="loggedUser.id === post?.user_id">
                            <h3 class="flex items-center">
                                <RouterLink to="/profile" class="text-xl font-bold outline-none hover:underline focus:underline max-sm:max-w-[200px] max-sm:truncate">
                                    {{ userNames.find((user) => user.id === comment.user_id)?.email }}
                                </RouterLink>
                            </h3>
                        </template>

                        <template v-else>
                            <h3 class="flex items-center">
                                <RouterLink :to="{ name: 'profile', params: { id: comment.user_id } }" class="text-xl font-bold outline-none hover:underline focus:underline max-sm:max-w-[200px] max-sm:truncate">
                                    {{ userNames.find((user) => user.id === comment.user_id)?.email }}
                                </RouterLink>
                            </h3>
                        </template>

                        <p>{{ comment.comment }}</p>

                        <div class="flex justify-end w-full">
                            <time :datetime="comment?.created_at" class="w-max text-xs font-normal">
                                {{ comment?.created_at?.toDate().toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hourCycle: 'h23',
                                }) }}
                            </time>
                        </div>
                    </div>
                </li>
            </ul>
        </template>

        <template v-else-if="!comments && loadingState.loading && loadingState.state === 'loading_comments'">
            <div class="flex items-center justify-center p-4">
                <p class="text-xl text-center font-semibold">
                    Cargando...
                </p>
            </div>
        </template>

        <template v-else>
            <div class="flex items-center justify-center p-4">
                <p class="text-slate-400 text-sm">
                    No hay comentarios aún.
                </p>
            </div>
        </template>
    </section>

    <template v-if="openedImage !== ''">
        <div class="fixed z-50 inset-0 bg-black/75 overflow-auto flex items-center justify-center p-4">
            <button
                type="button"
                class="fixed z-50 top-4 right-4 place-self-end p-2 rounded-full outline-none transition-colors hover:bg-slate-50/15 focus:bg-slate-50/25"
                @click="openedImage = ''"
                aria-label="Cerrar foto"
            >
                <X class="text-white"/>
            </button>

            <figure class="px-4">
                <img
                    :src="openedImage"
                    :alt="'Imagen de publicación'"
                    class="max-h-[90vh] max-w-full object-contain"
                >
            </figure>
        </div>
    </template>

    <AlertMessage
        v-if="loadingState.loading && loadingState.state === 'comment_sent'"
        message="Se envió el comentario"
        v-model="loadingState.loading"
    />

    <AlertMessage
        v-else-if="!loadingState.loading && loadingState.state === 'error_saving_comment'"
        message="Error al haber enviado el comentario."
        v-model="loadingState.loading"
    />
</template>