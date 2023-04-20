import { createStore } from "vuex"

export default createStore({
    state() {
        return {
            LOW_BOUND_BLOCK: 0,
            HIGH_BOUND_BLOCK: 100,
            current_selected_block: 0,
        }
    },
    mutations: {
        set_low_bound(state, payload) {
            state.LOW_BOUND_BLOCK = payload
        },
        set_high_bound(state, payload) {
            state.HIGH_BOUND_BLOCK = payload
        },
        set_current_block(state, payload) {
            state.current_selected_block = payload
        }
    }
})