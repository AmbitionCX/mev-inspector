<template>
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
