<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import PostComponent from '../components/PostComponent.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';
import { getPostById } from '../services/users-posts';
import { getUserEmail } from '../services/user-profile';

onMounted(() => {
    subscribeToAuthChanges((newUserData) => loggedUser.value = newUserData);
});

const loggedUser = ref({
    id: null,
    email: null
});

const route = useRoute();
const postID = route.params.id;

const post = ref({
    id: postID,
    title: '',
    description: '',
    location: '',
    user_email: '',
    user_id: '',
    created_at: ''
});

const loadingStates = ref({
    loading: false,
    state: ''
});

onMounted(async () => {
    loadingStates.value = {
        loading: true,
        state: 'loading_post'
    };

    try {
        await getPostById(postID, async (p) => {
            post.value = await p;

            loadingStates.value = {
                loading: false,
                state: 'post_loaded'
            };

            for (const usersComments of post.value?.comments || []) {
                await getUserEmail(usersComments?.user_id)
            }
        });
    } catch (error) {
        loadingStates.value = {
            loading: false,
            state: 'error_finding_post'
        };
    }
});
</script>

<template>
    <section class="pb-48 flex flex-col items-center">
        <HeaderTitle text="Publicación">
            <template #content-before>
                <ReturnBtn />
            </template>
        </HeaderTitle>

        <PostComponent
            v-if="!loadingStates.loading && loadingStates.state === 'post_loaded' && post"
            :post="post"
            :logged-user="loggedUser"
        />

        <div v-else-if="loadingStates.loading && loadingStates.state === 'loading_post'" class="flex items-center justify-center p-4">
            <p class="text-xl text-center font-semibold">
                Cargando...
            </p>
        </div>

        <div v-else-if="!loadingStates.loading && loadingStates.state === 'error_finding_post'" class="flex items-center justify-center p-4">
            <p class="text-xl text-center font-semibold">
                Esta publicación no existe.
            </p>
        </div>
    </section>
</template>