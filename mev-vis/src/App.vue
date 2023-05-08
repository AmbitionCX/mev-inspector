<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header noselect">
          <div class="logo">
            <h1>MEV Inspector</h1>
          </div>
          <div class="filter">
            <input type="text" v-model="current_block" placeholder="Block Number" class="search-box" @change="getSelectedBlock"/>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div class="grid-content ep-bg-purple-dark">
              <overview />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="grid-content ep-bg-purple">
              <blockview />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content ep-bg-purple-light">
              <transactionview />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'

import overview from './components/OverView.vue';
import blockview from './components/BlockView.vue';
import transactionview from './components/TransactionView.vue';
// import selector from './components/Selector.vue';
// import recorder from './components/Recorder.vue';

export default {
  name: 'MEV-Inspector',
  components: {
    overview,
    blockview,
    transactionview
  },

  data() {
    return {
      current_block: '',
      current_arbitrages: []
    }
  },

  created() {
    this.getBlockBounds();
  },

  mounted() {
    // this.current_block = this.$store.state.current_selected_block
  },

  methods: {
    getSelectedBlock() {
        // if(isNaN(this.input)) {
        //   return;
        // }
        // const input_block = parseInt(this.input);
        if(this.current_block >= this.$store.state.LOW_BOUND_BLOCK && this.current_block <= this.$store.state.HIGH_BOUND_BLOCK) {
          this.$store.commit('set_current_block', this.current_block);
          this.current_block = ''
        }else{
          return;}
      },
    getBlockBounds() {

      const path = 'http://localhost:7070/get_block_bounds';
      axios
        .get(path)
        .then(result => {
          this.$store.commit('set_low_bound', result.data[0].min);
          this.$store.commit('set_high_bound', result.data[0].max);
          this.$store.commit('set_current_block', result.data[0].min);
          this.$store.commit('set_current_tx', result.data[0].min);
          this.$store.commit('queryTxSummary',  result.data[0].min);
          this.$store.commit('queryBlockSummary',  result.data[0].min);
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
}
</script>

<style>

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.search-box {
  width: 300px;
  font-size: 16px;
}
</style>
