<script setup>
defineProps({
    rounded : {
        type : String,
        default : 'normal'
    }
});
</script>

<template>
    <button
        type="submit"
        class="p-2 w-max bg-slate-300 text-black font-semibold transition-all border-2 border-transparent outline-none hover:bg-slate-200 focus:bg-slate-500 focus:text-slate-100 focus:border-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
        :class="{
            'place-self-end rounded-lg'          : rounded === 'normal',
            'px-4 rounded-s-none rounded-e-full max-md:px-2' : rounded === 'comment'
        }"
    >
        <slot/>
    </button>
</template>