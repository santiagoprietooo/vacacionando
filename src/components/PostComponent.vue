<script setup>
import SubmitButton from './SubmitButton.vue';
import { MapPin, SendHorizontal, UserRound } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { saveComment } from '../services/comments';
import { getUserEmail } from '../services/user-profile';

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
const loading = ref(false);

async function handleSubmitComment() {
    loading.value = true;

    try {
        await saveComment(postID, comment.value, props.loggedUser.id);

        comment.value = '';
    } catch (error) {
        console.error("Error al enviar el comentario:", error);
        throw error;
    }

    loading.value = false;
}

const userNames = ref([]);
async function showUsersEmail(id) {
    userNames.value.push({ id, email: await getUserEmail(id) });
}

onMounted(async () => {
    if (props.post.comments.length > 0) {
        for (const comment of props.post.comments) {
            await showUsersEmail(comment.user_id);
        }
    }
})
</script>

<template>
    <div
        class="flex flex-col items-start gap-4 p-4 w-full border-b border-slate-500 transition-colors last:border-b-0"
        :class="{
            'hover:bg-slate-800': route.path === '/'
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
                    <RouterLink to="/profile" class="max-sm:max-w-[200px] max-sm:truncate text-xl font-bold">
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
                    <RouterLink :to="{ name: 'profile', params: { id: post?.user_id } }" class="max-sm:max-w-[200px] max-sm:truncate text-xl font-bold">
                        {{ post?.user_email }}
                    </RouterLink>
                </h2>
            </template>
        </div>

        <template v-if="!isOnThatProfile">
            <RouterLink :to="{ name: 'public_post', params: { id: post?.id } }" class="flex flex-col w-full border border-slate-500 rounded-2xl">
                <article class="p-4">
                    <h3 class="text-xl font-medium">{{ post?.title }}</h3>
                    <p class="text-base font-normal">{{ post?.description }}</p>

                    <div class="flex items-center gap-1 mt-4">
                        <MapPin class="size-4 stroke-[1.5]" aria-roledescription="ícono de ubicación" />
                        <p class="text-sm font-thin">{{ post?.location }}</p>
                    </div>
                </article>

                <div class="flex justify-end w-full">
                    <p
                        class="py-1 px-2 w-max bg-slate-500 text-xs font-medium border border-slate-500 rounded-ss-xl rounded-ee-xl">
                        {{ post?.created_at?.toDate().toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: 'h23',
                        }) }}
                    </p>
                </div>
            </RouterLink>
        </template>

        <template v-else>
            <div class="flex flex-col w-full border border-slate-500 rounded-2xl">
                <article class="p-4">
                    <h3 class="text-xl font-medium">{{ post?.title }}</h3>
                    <p class="text-base font-normal">{{ post?.description }}</p>

                    <div class="flex items-center gap-1 mt-4">
                        <MapPin class="size-4 stroke-[1.5]" aria-roledescription="ícono de ubicación" />
                        <p class="text-sm font-thin">{{ post?.location }}</p>
                    </div>
                </article>

                <div class="flex justify-end w-full">
                    <p
                        class="py-1 px-2 w-max bg-slate-500 text-xs font-medium border border-slate-500 rounded-ss-xl rounded-ee-xl">
                        {{ post?.created_at.toDate().toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: 'h23',
                        }) }}
                    </p>
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
                    :disabled="!loggedUser?.id || loading"
                    rows="1"
                    placeholder="Comentar..."
                    class="px-4 py-2 w-full min-h-[43.2px] transition-colors bg-transparent border-2 border-slate-300 rounded-s-full border-opacity-35 outline-none resize-none text-slate-400 placeholder:text-slate-400 focus:border-opacity-100 focus:text-white focus:placeholder:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <SubmitButton rounded="comment" width="max" v-if="loggedUser.id !== null" :disabled="comment.trim() === '' || loading">
                    <SendHorizontal class="block md:hidden" />
                    <span class="max-md:sr-only">Enviar</span>
                </SubmitButton>

                <SubmitButton rounded="comment" width="max" v-else disabled>
                    <SendHorizontal class="block md:hidden" />
                    <span class="max-md:sr-only">Enviar</span>
                </SubmitButton>
            </form>
        </div>

        <RouterLink
            v-if="post?.comments?.length > 0 && route.path === '/'"
            :to="{ name: 'public_post', params: { id: post?.id } }"
            class="w-max text-slate-400 text-sm font-medium transition-colors hover:text-white hover:underline"
        >
            Ver {{ post?.comments?.length }} {{ post?.comments?.length > 1 ? "comentarios" : "comentario" }}
        </RouterLink>
    </div>

    <section v-if="route.path !== '/'" aria-label="Comentarios" class="flex flex-col items-start w-full">
        <template v-if="!post?.comments || post?.comments?.length === 0">
            <p class="p-4 text-slate-400 text-sm">No hay comentarios aún.</p>
        </template>

        <template v-else>
            <h2 class="p-4 text-lg font-semibold">Comentarios</h2>

            <ul class="w-full">
                <li
                    v-for="(comment, index) in post?.comments?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))"
                    class="flex flex-col items-start gap-2 w-full p-4 odd:bg-slate-700/25 even:bg-slate-800/25"
                    :key="index"
                >
                    <div class="w-full">
                        <template v-if="loggedUser.id === post?.user_id">
                            <h3 class="flex items-center">
                                <RouterLink to="/profile" class="max-sm:max-w-[200px] max-sm:truncate text-xl font-bold">
                                    {{ userNames.find((user) => user.id === comment.user_id)?.email }}
                                </RouterLink>
                            </h3>
                        </template>

                        <template v-else>
                            <h3 class="flex items-center">
                                <RouterLink :to="{ name: 'profile', params: { id: comment.user_id } }" class="max-sm:max-w-[200px] max-sm:truncate text-xl font-bold">
                                    {{ userNames.find((user) => user.id === comment.user_id)?.email }}
                                </RouterLink>
                            </h3>
                        </template>

                        <p>{{ comment.comment }}</p>

                        <div class="flex justify-end w-full">
                            <time :datetime="comment.created_at" class="w-max text-xs font-normal">
                                {{ new Date(comment.created_at).toLocaleDateString('es-AR', {
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
    </section>
</template>