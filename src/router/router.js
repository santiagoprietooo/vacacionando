import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import SignIn from '../pages/SignIn.vue';
import LogIn from '../pages/LogIn.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import UserProfile from '../pages/UserProfile.vue';

import { subscribeToAuthChanges } from '../services/auth';

const routes = [
    { path: '/',                 component: Home },
    { path: '/log-in',           component: LogIn },
    { path: '/sign-in',          component: SignIn },
    { path: '/profile',          component: MyProfile,     meta: { requiresAuth: true } },
    { path: '/profile/edit',     component: MyProfileEdit, meta: { requiresAuth: true } },
    { path: '/profile/:id',      component: UserProfile}
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    traveledTo: null,
}

subscribeToAuthChanges(newUserData => loggedUser = newUserData);

router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && loggedUser.id == null){
        return {
            path: '/'
        }
    }
})

export default router;