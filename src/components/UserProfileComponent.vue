<script setup>
import { UserRound } from 'lucide-vue-next';

defineProps({
    userProfile: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <h2 class="sr-only">Detalles del perfil</h2>

    <div class="w-full">
        <div class="p-4">
            <div
                v-if="userProfile?.photoURL && userProfile?.photoURL !== null"
                class="size-28 bg-center bg-no-repeat bg-cover rounded-full"
                :style="{ backgroundImage: `url(${userProfile.photoURL})` }"
                role="img"
                :aria-label="`Foto de perfil del usuario`"
            />

            <div v-else class="p-6 w-max bg-white rounded-full">
                <UserRound class="text-black size-12" aria-label="Foto de perfil del usuario" />
            </div>
        </div>

        <article>
            <h3 class="sr-only">Información del usuario</h3>

            <dl>
                <dt class="p-4 w-full bg-slate-500/15 font-semibold">Nombre del usuario</dt>
                <dd class="p-4 w-full">
                    {{
                        userProfile?.displayName
                        || userProfile?.email?.slice(0, userProfile?.email?.indexOf("@"))
                    }}
                </dd>

                <dt class="p-4 w-full bg-slate-500/15 font-semibold">Correo electrónico</dt>
                <dd class="p-4 w-full">
                    {{ userProfile?.email || "Cargando..." }}
                </dd>

                <dt class="p-4 w-full bg-slate-500/15 font-semibold">Sobre mí</dt>
                <dd class="p-4 w-full">
                    {{ userProfile?.bio || "No especifíca." }}
                </dd>

                <dt class="p-4 w-full bg-slate-500/15 font-semibold">Viajé a</dt>
                <dd class="p-4 w-full">
                    {{ 
                        userProfile?.traveledTo?.join(', ').replace(/,([^,]*)$/, " y$1")
                        || "No especifíca."
                    }}
                </dd>
            </dl>
        </article>
    </div>
</template>