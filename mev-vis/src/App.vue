<template>
  <div class="header noselect">
    <h1 class="logo" id="logo">MEV Inspector</h1>
      <div class="filter" id="filter">
        <div class="relative mb-3" data-te-input-wrapper-init>
          <input type="text"
            class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="Block Selector" placeholder="Block Selector" />
          <label for="Block Selector"
            class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">Block Selector</label>
        </div>
      </div>
  </div>
  <div>
    <overview />
    <blockview />
    <transactionview />
    <selector />
    <recorder />
    <p>{{ this.$store.state.HIGH_BOUND_BLOCK }}</p>
  </div>
</template>
<script>
import axios from 'axios'

import overview from './components/OverView.vue';
import blockview from './components/BlockView.vue';
import transactionview from './components/TransactionView.vue';
import selector from './components/Selector.vue';
import recorder from './components/Recorder.vue';

import { Input, initTE,} from "tw-elements";
initTE({ Input });


export default {
  name: 'MEV-Inspector',
  components: {
    // overview,
    blockview,
    // transactionview,
    // selector,
    // recorder
  },

  data() {
    return {
      block_summary_data: [],
      txn: []
    }
  },

  mounted() {

    this.getBlockBounds();
    this.queryBlockData();

  },

  methods: {
    getBlockBounds() {
      const path = 'http://localhost:7070/get_block_bounds';
      axios
        .get(path)
        .then(result => {
          this.$store.commit('set_low_bound', result.data[0].min);
          this.$store.commit('set_high_bound', result.data[0].max);
          this.$store.commit('set_current_block', result.data[0].min);
        })
        .catch(error => {
          console.error(error);
        });
    },
    queryBlockData() {
      const path = 'http://localhost:7070/block_summary';
      axios
        .get(path)
        .then(result => {
          this.block_summary_data = result.data;
        })
        .catch(error => {
          console.error(error);
        });
    },

  }
}
</script>

<style>
#Overview {
  position: absolute;
  top: 5px;
  left: 3px;
  background: #ffffff;
  z-index: 0;
  border: solid;
}

#Block-view {
  position: absolute;
  top: 200px;
  left: 823px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index: 0;
  border: solid;
}

#Transaction-view {
  position: absolute;
  top: 335px;
  left: 5px;
  background: #ffffff;
  border: solid;
}

#Selector {
  top: 400px;
  position: absolute;
  border: solid;
}

#Recorder {
  top: 500px;
  position: absolute;
  border: solid;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.panel-header {
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 0 8px;
  width: 45px;
  height: 18px;
  line-height: 18px;
  font-size: 8px;
  background: #415c68;
  color: #fcfcfc;
  display: flex;
  font-weight: bold;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(26 26 26 0.2);
  z-index: 99;
  text-align: left;
  text-decoration: inherit;
}

.panel-header-end {
  position: absolute;
  top: 0px;
  left: 60.5px;
  border-top: 18px solid #455a64;
  border-right: 18px solid #ffffff;
  border-bottom: 0px solid #ffffff;
  z-index: 98;
  text-decoration: inherit;
}
</style>
