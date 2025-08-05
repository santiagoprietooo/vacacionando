<script setup>
defineProps({
    color : {
        type : String,
        default : 'slate'
    },
    rounded : {
        type : String,
        default : 'normal'
    },
    width : {
        type : String,
        default : 'full'
    }
});
</script>

<template>
    <button
        type="submit"
        class="transition-all text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
            'bg-slate-300'                : color == 'slate',
            'hover:bg-slate-200'          : color == 'slate',
            'focus:bg-slate-400'          : color == 'slate',

            'w-full px-6 py-2'              : width == 'full',
            'w-max px-3 p-2 md:px-6 py-2'   : width == 'max',

            'rounded-lg'                    : rounded == 'normal',
            'rounded-e-full rounded-s-none' : rounded == 'comment'
        }"
    >
        <slot/>
    </button>
</template>