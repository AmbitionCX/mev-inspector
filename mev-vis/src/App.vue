<template>
  <div>
    <overview />
    <blockview />
    <transactionview />
    <selector />
    <recorder />
  </div>
</template>

<script setup>
  import overview from './components/OverView.vue';
  import blockview from './components/BlockView.vue';
  import transactionview from './components/TransactionView.vue';
  import selector from './components/Selector.vue';
  import recorder from './components/Recorder.vue';

</script>

<style>
#Overview{
  position: absolute;
  top:0px;
  left:3px;
  background: #ffffff;
  z-index:0;
}
#Block-view {
  position: absolute;
  top:0px;
  left:823px;
  background: #ffffff;
  border-radius: 2px;
  border-color: blueviolet;
  z-index:0;
}
#Transaction-view {
  position:absolute;
  top:335px;
  left:5px;
  background: #ffffff;
}
#Selector {
  position:absolute;
}
#Recorder {
  position:absolute;
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
  left:0px;
  top:0px;
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
  z-index:99;
  text-align: left;
}
.panel-header-end {
  position: absolute;
  top: 0px;
  left: 60.5px;
  border-top: 18px solid #455a64;
  border-right: 18px solid #ffffff;
  border-bottom: 0px solid #ffffff;
  z-index:98;
}
</style>
