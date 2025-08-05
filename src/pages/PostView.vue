<script setup>
import HeaderTitle from '../components/HeaderTitle.vue';
import ReturnBtn from '../components/ReturnBtn.vue';
import PostComponent from '../components/PostComponent.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';
import { getPostById } from '../services/users-posts';

onMounted(() => {
    subscribeToAuthChanges((newUserData) => loggedUser.value = newUserData);
});

const loggedUser = ref({
    id: null,
    email: null
});

const route = useRoute();
const postId = route.params.id;
const postDetails = ref(null);
const postExists = ref(null);

onMounted(async () => {
    try {
        postDetails.value = await getPostById(postId);
        postExists.value = true;
    } catch (error) {
        console.error("Error fetching post:", error);
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

        <PostComponent v-if="postExists == true" :post="postDetails" :logged-user="loggedUser" />

        <p v-else-if="postExists == null" class="p-2">Cargando...</p>

        <p v-else>Este post no existe.</p>
    </section>
</template>