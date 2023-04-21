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
        },
  //       setCurrentSelectedBlock: function(state, current_selected_block) {
  //           state.current_selected_block = current_selected_block
  //   //将状态信息保存在localStorage中
  //           localStorage.setItem('current_selected_block', JSON.stringify(current_selected_block))
  // }
        setCurrentSelectedBlock: function(state, current_selected_block) {
            state.current_selected_block = current_selected_block
            //将状态信息保存在localStorage中
            localStorage.setItem('current_selected_block', JSON.stringify(current_selected_block))
        },
        setH: function(state, HIGH_BOUND_BLOCK) {
            state.HIGH_BOUND_BLOCK = HIGH_BOUND_BLOCK
            //将状态信息保存在localStorage中
            localStorage.setItem('HIGH_BOUND_BLOCK', JSON.stringify(HIGH_BOUND_BLOCK))
        },
        setL: function(state, LOW_BOUND_BLOCK) {
            state.LOW_BOUND_BLOCK = LOW_BOUND_BLOCK
            //将状态信息保存在localStorage中
            localStorage.setItem('LOW_BOUND_BLOCK', JSON.stringify(LOW_BOUND_BLOCK))
        },
        setTxn: function(state, txn) {
            state.txn = txn
            //将状态信息保存在localStorage中
            localStorage.setItem('txn', JSON.stringify(txn))
  }
    }
})