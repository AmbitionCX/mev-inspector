<template>
  <div id="Block-view">
  <div class="container1">
    <div class="block-container">
    <p>BLOCK&nbsp;{{ this.$store.state.current_selected_block }}</p>
    </div>
    <div class="arrow-left" @click="moveLeft">
    </div>
    <div class="arrow-right" @click="moveRight">
    </div>
  </div>
    <svg ref="svg" style="margin: 0 auto;"></svg>

  </div>
</template>
<script>
import axios from "axios";
import * as d3 from 'd3';

export default {
  data() {
    return {
      currentIndex: 0,
      blockCount: 10,
      blocks: [],
      blockSize: 10, // 小方块边长
      blockMargin: 1, // 小方块间距
    };
  },
  created() {
    this.$store.commit('set_current_block', JSON.parse(localStorage.getItem('current_selected_block')));
    // this.$store.commit('queryTxSummary', JSON.parse(localStorage.getItem('current_selected_block')));
    // this.$store.commit('queryBlockSummary', JSON.parse(localStorage.getItem('current_selected_block')));

    // 加载tx——summery
  },
 mounted() {
  setTimeout(() => {
    this.generateBlocks();
    this.drawBlocks();
  }, 500);
},

   watch: {
    // Whenever `current_selected_block` changes, save it to the local storage
    '$store.state.current_selected_block': {
      handler(newValue) {
        localStorage.setItem('current_selected_block', newValue);
      },
      deep: true,

    },
     '$store.state.current_tx_summary': {
      handler(newValue) {
        localStorage.setItem('current_tx_summary', newValue);
      },
      deep: true,
    },
     '$store.state.current_block_summary': {
      handler(newValue) {
        localStorage.setItem('current_block_summary', newValue);
      },
      deep: true,
    },

  },

  methods: {
    generateBlocks() {
       const txAmount = this.$store.state.current_block_summary[0].tx_amount; // 获取交易数量
       for (let i = 0; i < txAmount; i++) {
        const data = this.$store.state.current_tx_summary[i]; // 获取交易数据
        const sandwiches = this.$store.state.current_sandwiches.find(tx => tx.frontrun_swap_transaction_hash === data.tx_hash||tx.backrun_swap_transaction_hash === data.tx_hash);
        const liquidations = this.$store.state.current_liquidations.find(tx => tx.transaction_hash === data.tx_hash);
        const arbitrages = this.$store.state.current_arbitrages.find(tx => tx.transaction_hash === data.tx_hash);
        if(sandwiches||liquidations||arbitrages){
          const lightness = 10
          const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
          this.blocks.push({ color, data });
        }else{
          const lightness = Math.max(20, 90 - (data.paid_fee/2000000)  ); // 计算亮度（使用 value 值作为参考）
        const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
        this.blocks.push({ color, data });}
  }

    },
 drawBlocks() {

      const svg = d3.select(this.$refs.svg);
      svg.attr('width', (this.blockSize + this.blockMargin) * this.blockCount);
      svg.attr('height', (this.blockSize + this.blockMargin) * Math.ceil(this.blocks.length / this.blockCount));
      svg.attr('x', 100);
      const blocks = svg.selectAll('rect')
        .data(this.blocks)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i % this.blockCount * (this.blockSize + this.blockMargin))
        .attr('y', (d, i) => Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin))
        .attr('width', this.blockSize)
        .attr('height', this.blockSize)
        .attr('fill', d => d.color)
        .on('click', (function(event, d) {
          this.$store.commit('set_current_tx',  d.data);
          }).bind(this));
        blocks.on('mouseover', function(event,  d) {
          d3.select(this)
            .append('title')
            .text(JSON.stringify(d.data))
          d3.select(this)
            .transition()
            .attr('height', 11)
            .attr('width', 11)
            .style('filter', 'brightness(200%)');
        }).on('mouseout', function(d) {
          d3.select(this)
            .select('title')
            .remove()
          d3.select(this)
            .transition()
            .attr('height', 10)
            .attr('width', 10)
            .style('filter', 'brightness(100%)');
        });
    },
    moveLeft() {
      const d =this.$store.state.current_selected_block-1
      if (d >=12914944) {
        this.$store.commit('set_current_block',  d)
        this.blocks = []
        const svg = d3.select(this.$refs.svg);
        svg.html("");
         setTimeout(() => {
    this.generateBlocks();
    this.drawBlocks();
  }, 300);
     }
      else {
        this.$store.commit('set_current_block',  12914944)
      }


    },
    clearBlocks() {
      d3.selectAll("rect")
          .transition()
          .duration(300)
          .attr("display", "none")
          .remove();
    },
    moveRight() {
    const d = this.$store.state.current_selected_block + 1;
    if (d <= 12930000) {
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.$store.commit('set_current_block', d);
      this.$store.commit("queryBlockSummary", d);
      this.$store.commit("queryTxSummary", d);
      this.blocks = [];
      setTimeout(() => {
    this.generateBlocks();
    this.drawBlocks();
  }, 300);

}
},
  },

};
</script>

<style scoped>
.container1 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  weight: 100px;
  height: 120px;

}
.block-container {
    background-color: hsl(210, 90%, 80%);;
    padding: 50px;
    weight: 100px;
    display: inline-block;
  }
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.main-block {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  height: 100%;
  top: 0px;
}
rect {
  transition: transform 350ms;
  transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
}





.arrow-left:before,
.arrow-right:after {
    content: "";
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: #ccc;
}
.arrow-left:before
 {
    transform: rotate(45deg);
    left: 200px;
    top: 16px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
}


.arrow-right:after {
    transform: rotate(-45deg);
    right: 200px;
    top: 16px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
}

.arrow-left:hover,
.arrow-right:hover {
  background-color: #aaa;
}

.arrow-left {
  left: 20%;
}

.arrow-right {
  right: 20%;
}

.fa-chevron-left,
.fa-chevron-right {
  font-size: 5px;
  color: #fff;
}
</style>
