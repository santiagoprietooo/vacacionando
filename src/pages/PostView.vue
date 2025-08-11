<script setup>
import HeaderTitle from '../components/Tags/HeaderTitle.vue';
import ReturnBtn from '../components/Buttons/ReturnBtn.vue';
import PostComponent from '../components/PostComponent.vue';
import Loader from '../components/Loader/Loader.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPostById } from '../services/users-posts';
import { getUserEmail } from '../services/user-profile';
import { useLoadingState } from '../composables/useLoadingState';
import { useLoggedUser } from '../composables/useLoggedUser';

const { loggedUser } = useLoggedUser();

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

const { loadingState } = useLoadingState();

onMounted(async () => {
    loadingState.value = {
        loading: true,
        state: 'loading_post'
    };

    try {
        await getPostById(postID, async (p) => {
            post.value = await p;

            loadingState.value = {
                loading: false,
                state: 'post_loaded'
            };

            for (const usersComments of post.value?.comments || []) {
                await getUserEmail(usersComments?.user_id)
            }
        });
    } catch (error) {
        loadingState.value = {
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
            v-if="!loadingState.loading && loadingState.state === 'post_loaded' && post"
            :post="post"
            :logged-user="loggedUser"
        />

        <Loader v-else-if="loadingState.loading && loadingState.state === 'loading_post'" />

        <div v-else-if="!loadingState.loading && loadingState.state === 'error_finding_post'" class="flex items-center justify-center p-4">
            <p class="text-xl text-center font-semibold">
                Esta publicación no existe.
            </p>
        </div>
    </section>
</template>