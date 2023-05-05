
<template>
  <div id="Transaction-view">
    <div class="panel-header">Transaction View</div>
    <button @click="toggleButtonsand()">{{ buttonTexts[0] }}</button>
    <br>
    <button @click="toggleButtonarb()">{{ buttonTexts[1] }}</button>
    <br>
    <button @click="toggleButtonliq()">{{ buttonTexts[2] }}</button>
    <div class="radar-container">
      <div ref="radar" class="radar-chart" style="width: 50%; height: 400px;margin: 0 auto;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    data() {
      return {buttonTexts: ['sandwiches', 'liquidations', 'arbitrages'],}
  },
  computed: {
    radarData() {
      const GasPriceArr = this.$store.state.current_tx_summary.map(item => item.gas_price)
      const maxGasPrice = Math.max(...GasPriceArr)
      const gasUsedArr = this.$store.state.current_tx_summary.map(item => item.gas_used)
      const maxGasUsed = Math.max(...gasUsedArr)
      const PriorityFeeArr = this.$store.state.current_tx_summary.map(item => item.priority_fee_per_gas)
      const maxPriorityFee = Math.max(...PriorityFeeArr)
      const gasMaxFee = this.$store.state.current_tx_summary.map(item => item.max_fee_per_gas)
      const maxMaxFee = Math.max(...gasMaxFee)
      const PaidFeeArr = this.$store.state.current_tx_summary.map(item => item.paid_fee)
      const maxPaidFee = Math.max(...PaidFeeArr)
      const BurntFeeArr = this.$store.state.current_tx_summary.map(item => item.burnt_fee)
      const maxBurntFee = Math.max(...BurntFeeArr)
      const {
        gas_price,
        gas_used,
        priority_fee_per_gas,
        max_fee_per_gas,
        paid_fee,
        burnt_fee,
      } = this.$store.state.current_tx;
      return {
        legendData: ['Gas Price', 'Gas Used', 'Priority Fee/Gas', 'Max Fee/Gas', 'Paid Fee', 'Burnt Fee'],
        indicator: [
          { name: 'Gas Price', max: maxGasPrice },
          { name: 'Gas Used', max: maxGasUsed },
          { name: 'Priority Fee/Gas', max: maxPriorityFee },
          { name: 'Max Fee/Gas', max: maxMaxFee },
          { name: 'Paid Fee', max: maxPaidFee }, // Round up to nearest 10
          { name: 'Burnt Fee', max: maxBurntFee }, // Round up to nearest 10
        ],
        seriesData: [
          {
            value: [gas_price, gas_used, priority_fee_per_gas, max_fee_per_gas, paid_fee, burnt_fee],
            name: 'Transaction',
          },
        ],
      };
    }
  },
  mounted() {
    this.drawRadarChart();
  },
  watch: {
    '$store.state.current_tx': function() {
      this.drawRadarChart();
      this.fuzhi();
    },
  },
  methods: {
      toggleButtonsand() {
        const data = this.$store.state.current_tx
        const sandwiches1 = this.$store.state.recordsand.find(tx => tx.tx_hash === data.tx_hash);
        if (sandwiches1) {
          const data = this.$store.state.current_tx
          this.buttonTexts[0] = 'sandwiches';
          const a = this.$store.state.recordsand.filter(item => item.tx_hash != data.tx_hash);
          this.$store.commit('set_record_sand',  a)
        } else {
          const data = this.$store.state.current_tx
          const a = this.$store.state.recordsand.slice()
          a.push(data)
          console.log(a.length)
          console.log(this.$store.state.recordsand.length)
          this.$store.commit('set_record_sand',  a)
          this.buttonTexts[0] = 'remove' ;
          console.log(this.$store.state.recordsand)
        }
    },
    toggleButtonarb() {
        const data = this.$store.state.current_tx
        const arbitrages1 = this.$store.state.recordarb.find(tx => tx.tx_hash === data.tx_hash);
        if (arbitrages1) {
          const data = this.$store.state.current_tx
          this.buttonTexts[1] = 'arbitrages';
          const a = this.$store.state.recordarb.filter(item => item.tx_hash != data.tx_hash);
          this.$store.commit('set_record_arb',  a)
        } else {
          const data = this.$store.state.current_tx
          const a = this.$store.state.recordarb.slice()
          a.push(data)
          this.$store.commit('set_record_arb',  a)
          this.buttonTexts[1] = 'remove' ;
        }
    },
    toggleButtonliq() {
        const data = this.$store.state.current_tx
        const liq = this.$store.state.recordliq.find(tx => tx.tx_hash === data.tx_hash);
        if (liq) {
          const data = this.$store.state.current_tx
          this.buttonTexts[2] = 'liquidations';
          const a = this.$store.state.recordliq.filter(item => item.tx_hash != data.tx_hash);
          this.$store.commit('set_record_liq',  a)
        } else {
          const data = this.$store.state.current_tx
          const a = this.$store.state.recordliq.slice()
          a.push(data)
          this.$store.commit('set_record_liq',  a)
          this.buttonTexts[2] = 'remove' ;
        }
    },

     fuzhi(){const data = this.$store.state.current_tx
      const sandwiches1 = this.$store.state.recordsand.find(tx => tx.tx_hash === data.tx_hash);
      if (sandwiches1) {this.buttonTexts[0]='remove'}else{this.buttonTexts[0]='sandwiches'}
      const arbitrages1 = this.$store.state.recordarb.find(tx => tx.tx_hash === data.tx_hash);
      if (arbitrages1) {this.buttonTexts[1]='remove'}else{this.buttonTexts[1]='arbitrages'}
      const liquidations1 = this.$store.state.recordliq.find(tx => tx.tx_hash === data.tx_hash);
      if (liquidations1) {this.buttonTexts[2]='remove'}else{this.buttonTexts[2]='liquidations'}
    },
    drawRadarChart() {
      const radarChart = echarts.init(this.$refs.radar);
      const {
        legendData,
        indicator,
        seriesData
      } = this.radarData;
      const front = this.$store.state.current_sandwiches.find(
            tx => tx.frontrun_swap_transaction_hash === this.$store.state.current_tx.tx_hash
                );
        if(front){
          seriesData[0].name = 'front'
          console.log(front)
          const back = this.$store.state.current_tx_summary.find(
             tx => tx.tx_hash === front.backrun_swap_transaction_hash
          )
          console.log(back)
          const {
            gas_price,
            gas_used,
            priority_fee_per_gas,
            max_fee_per_gas,
            paid_fee,
            burnt_fee,
          } = back;
          seriesData.push(
              {
            value: [gas_price, gas_used, priority_fee_per_gas, max_fee_per_gas, paid_fee, burnt_fee],
            name: 'back',
          },
          )
        }
        const back = this.$store.state.current_sandwiches.find(
            tx => tx.backrun_swap_transaction_hash === this.$store.state.current_tx.tx_hash
                );
        if(back){
          seriesData[0].name = 'back'
          const front = this.$store.state.current_tx_summary.find(
             tx => tx.tx_hash === back.frontrun_swap_transaction_hash
          )
          console.log(back)
          const {
            gas_price,
            gas_used,
            priority_fee_per_gas,
            max_fee_per_gas,
            paid_fee,
            burnt_fee,
          } = front;
          seriesData.push(
              {
            value: [gas_price, gas_used, priority_fee_per_gas, max_fee_per_gas, paid_fee, burnt_fee],
            name: 'front',
          },
          )
        }
        const liquidations = this.$store.state.current_liquidations.find(tx => tx.transaction_hash === this.$store.state.current_tx.tx_hash);
        if(liquidations){seriesData[0].name = 'liquidations'
        }
      const arbitrages = this.$store.state.current_arbitrages.find(tx => tx.transaction_hash === this.$store.state.current_tx.tx_hash);
        if(arbitrages){seriesData[0].name = 'arbitrages'
        }
      const option = {
        grid: {
          containLabel: true, // 将包括坐标轴的标签在内的图形绘制在容器的内部
        },
        tooltip: {},
        legend: {
          data: legendData,
          textStyle: {
            color: '#333'
          },
          left: 'right'
        },
        radar: {
          indicator,
          name: {
            textStyle: {
              color: '#333'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ddd']
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(250, 250, 250, 0.6)', 'rgba(200, 200, 200, 0.6)'],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
            }
          },
        },
        series: [{
          type: 'radar',
          data: seriesData,
          label: {
            normal: {
              show: true,
              formatter: (params) => {
                return params.value;
              },
              textStyle: {
                color: '#333',
              },
            },
          },
        }]
      }
      radarChart.setOption(option);
    },

  },
};
</script>

<style scoped>
.radar-container {
  height: 500px;
}

.radar-chart {
  height: 100%;
  width: 100%;
}
</style>