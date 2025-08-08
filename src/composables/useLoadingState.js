import { ref } from 'vue';

export function useLoadingState() {
    const loadingState = ref({
        loading: false,
        state: ''
    });

    function cleanLoadingState() {
        loadingState.value = {
            loading: false,
            state: ''
        }
    }

    return { loadingState, cleanLoadingState }
}