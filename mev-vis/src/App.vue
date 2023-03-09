<script setup>
  import overview from './components/OverView.vue';
  import blockview from './components/BlockView.vue';
  import transactionview from './components/TransactionView.vue';
  import selector from './components/Selector.vue';
  import recorder from './components/Recorder.vue';
</script>

<template>
  <div>home.vue</div>
  <overview />
  <blockview />
  <transactionview />
  <selector />
  <recorder />
</template>

<style scoped>
#app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
