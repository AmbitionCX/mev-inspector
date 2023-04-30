
<template>
  <div id="Transaction-view">
    <div class="radar-container">
      <div ref="radar" class="radar-chart" style="width: 50%; height: 200px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
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
    },
  },
  methods: {
    isClosedLoop() {
      const currentTxSummaries = this.$store.state.current_tx_summary;
      const firstTx = this.$store.state.current_tx; // 获取第一笔交易
      let currentSender = firstTx.from; // 当前交易的发起者
      let currentReceiver = firstTx.to; // 当前交易的接收者
      const closedLoopTx = [firstTx]; // 闭合交易的数组，包含第一笔交易

      while (currentReceiver !== firstTx.from) {

        const nextTx = currentTxSummaries.find(
          tx => tx.from === currentReceiver
        );

        if (!nextTx) {
          // 如果找不到下一笔交易，则说明交易不是闭环的
          console.log("No closed loop");
          return false;
        }

      // 更新当前发起者、接收者和交易索引
      currentSender = nextTx.from;
      currentReceiver = nextTx.to;

      // 将下一笔交易添加到闭合交易中
      closedLoopTx.push(nextTx);
    }
        console.log("Closed loop detected");
        closedLoopTx.forEach(tx => {
          console.log(`TX hash: ${tx.hash}`);
          console.log(`From: ${tx.from}`);
          console.log(`To: ${tx.to}`);
          console.log(`Value: ${tx.value}`);
          console.log(`Timestamp: ${tx.timestamp}\n`);
      });
  return true;
},
    islike(){
      const currentTxSummaries = this.$store.state.current_tx_summary;
      const firstTx = this.$store.state.current_tx;


    },
    drawRadarChart() {
      this.isClosedLoop()
      if(this.$store.state.current_sandwiches.length!=0){
        const sandwiches = this.$store.state.current_sandwiches.find(tx => tx.frontrun_swap_transaction_hash === this.$store.state.current_tx.tx_hash||tx.backrun_swap_transaction_hash === this.$store.state.current_tx.tx_hash);
        if(sandwiches){
        }
      }

      if(this.$store.state.current_liquidations!=[]){
        const liquidations = this.$store.state.current_liquidations.find(tx => tx.transaction_hash === this.$store.state.current_tx.tx_hash);
        if(liquidations){
        }
      }
       if(this.$store.state.current_arbitrages!=[]){
         const arbitrages = this.$store.state.current_arbitrages.find(tx => tx.transaction_hash === this.$store.state.current_tx.tx_hash);
        if(arbitrages){
        }
      }
      const radarChart = echarts.init(this.$refs.radar);
      const {
        legendData,
        indicator,
        seriesData
      } = this.radarData;

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