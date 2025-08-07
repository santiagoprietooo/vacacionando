<script setup>
defineProps({
    width : {
        type : String,
        default : 'full'
    },
    rounded : {
        type : String,
        default : 'normal'
    }
});
</script>

<template>
    <button
        type="submit"
        class="bg-slate-300 text-black font-semibold transition-all hover:bg-slate-200 focus:bg-slate-400 disabled:hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
            'py-2 px-6 w-full'              : width === 'full',
            'py-2 px-3 w-max md:px-6'       : width === 'max',
            'place-self-end rounded-lg'     : rounded === 'normal',
            'rounded-s-none rounded-e-full' : rounded === 'comment'
        }"
    >
        <slot/>
    </button>
</template>