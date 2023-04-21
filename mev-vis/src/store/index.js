import { createStore } from "vuex"
import axios from 'axios'

export default createStore({
    state() {
        return {
            LOW_BOUND_BLOCK: 0,
            HIGH_BOUND_BLOCK: 0,
            current_selected_block: 0,
            current_arbitrages: [],
            current_sandwiches: [],
            current_liquidations: [],
            current_nft_trades: [],
            current_block_summary: [],
            current_tx_summary: [],
            current_mevboost_data: [],
        }
    },

    mutations: {
        set_low_bound(state, payload) {
            state.LOW_BOUND_BLOCK = payload
            localStorage.setItem('HIGH_BOUND_BLOCK', JSON.stringify(state.HIGH_BOUND_BLOCK))
        },
        set_high_bound(state, payload) {
            state.HIGH_BOUND_BLOCK = payload
            localStorage.setItem('LOW_BOUND_BLOCK', JSON.stringify(state.LOW_BOUND_BLOCK))
        },

        // on the state of current_selected_block changes
        // read local storage
        // var item = JSON.parse(localStorage.getItem('itemKey'));
        set_current_block(state, payload) {
            state.current_selected_block = payload;
            localStorage.setItem('current_selected_block', JSON.stringify(state.current_selected_block));

            this.commit("queryArbitrages", payload);
            this.commit("querySandwiches", payload);
            this.commit("queryLiquidations", payload);
            this.commit("queryNFTTrades", payload);
            this.commit("queryBlockSummary", payload);
            this.commit("queryTxSummary", payload);
            this.commit("queryMevboostData", payload);
        },

        queryArbitrages: function (state, payload) {
            const path = 'http://localhost:7070/arbitrages';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_arbitrages = result.data;
                    localStorage.setItem('current_arbitrages', JSON.stringify(state.current_arbitrages))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        querySandwiches: function (state, payload) {
            const path = 'http://localhost:7070/sandwiches';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_sandwiches = result.data;
                    localStorage.setItem('current_sandwiches', JSON.stringify(state.current_sandwiches))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        queryLiquidations: function (state, payload) {
            const path = 'http://localhost:7070/liquidations';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_liquidations = result.data;
                    localStorage.setItem('current_liquidations', JSON.stringify(state.current_liquidations))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        queryNFTTrades: function (state, payload) {
            const path = 'http://localhost:7070/nft_trades';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_nft_trades = result.data;
                    localStorage.setItem('current_nft_trades', JSON.stringify(state.current_nft_trades))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        queryBlockSummary: function (state, payload) {
            const path = 'http://localhost:7070/block_summary';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_block_summary = result.data;
                    localStorage.setItem('current_block_summary', JSON.stringify(state.current_block_summary))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        queryTxSummary: function (state, payload) {
            const path = 'http://localhost:7070/tx_summary';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_tx_summary = result.data;
                    localStorage.setItem('current_tx_summary', JSON.stringify(state.current_tx_summary))
                })
                .catch(error => {
                    console.error(error);
                });
        },

        queryMevboostData: function (state, payload) {
            const path = 'http://localhost:7070/mevboost_eth_data';
            axios
                .get(path, {
                    params: {
                        block_number: payload
                    }
                })
                .then(result => {
                    state.current_mevboost_data = result.data;
                    localStorage.setItem('current_mevboost_data', JSON.stringify(state.current_mevboost_data))
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },

    getters: {
        arbitrages_length(state) {
            return state.current_arbitrages.length;
        },
        sandwiches_length(state) {
            return state.current_sandwiches.length;
        },
        arbitrages_length(state) {
            return state.current_liquidations.length;
        },
        arbitrages_length(state) {
            return state.current_nft_trades.length;
        },
        arbitrages_length(state) {
            return state.current_block_summary.length;
        },
        arbitrages_length(state) {
            return state.current_tx_summary.length;
        },
        arbitrages_length(state) {
            return state.current_mevboost_data.length;
        }
    }
})