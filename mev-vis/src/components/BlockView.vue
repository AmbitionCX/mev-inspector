<template>
  <div id="Blockview">
    <div class="panel-header">Block View</div>
    <el-icon>
      <ArrowLeftBold @click="moveLeft" />
    </el-icon>
    <el-icon class="arrow-right">
      <ArrowRightBold @click="moveRight" />
    </el-icon>
    <div class="block-container">
      <p>BLOCK&nbsp;{{ this.$store.state.current_block_summary }}</p>
    </div>
    <div class="container">
      <svg ref="svg" style="margin-left: 240px;"></svg>
    </div>

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
  },
  mounted() {
    setTimeout(() => {
      this.generateBlocks();
      this.drawBlocks();
    }, 500);
  },

  watch: {
    // Whenever `current_selected_block` changes, save it to the local storage
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

    '$store.state.current_selected_block': function () {
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
      }, 300);

    },
    '$store.state.recordarb': function () {
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
      }, 300);

    },
    '$store.state.recordliq': function () {
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
      }, 300);

    },
    '$store.state.recordsand': function () {
      console.log("sandwich")
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
      }, 300);

    },


  },

  methods: {
    generateBlocks() {
      const txAmount = this.$store.state.current_block_summary[0].tx_amount; // 获取交易数量
      for (let i = 0; i < txAmount; i++) {
        const data = this.$store.state.current_tx_summary[i]; // 获取交易数据
        const sandwiches = this.$store.state.current_sandwiches.find(tx => tx.frontrun_swap_transaction_hash === data.tx_hash || tx.backrun_swap_transaction_hash === data.tx_hash);
        const liquidations = this.$store.state.current_liquidations.find(tx => tx.transaction_hash === data.tx_hash);
        const arbitrages = this.$store.state.current_arbitrages.find(tx => tx.transaction_hash === data.tx_hash);
        if (sandwiches) {
          const lightness = 10
          const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
          this.blocks.push({ color, data });
        } else {
          if (liquidations) {
            const color = 'red';
            this.blocks.push({ color, data });
          } else {
            if (arbitrages) {
              const color = 'green';
              this.blocks.push({ color, data });
            } else {
              const lightness = Math.max(20, 90 - (data.paid_fee / 2000000)); // 计算亮度（使用 value 值作为参考）
              const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
              this.blocks.push({ color, data });
            }
          }
        }
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
        .on('click', (function (event, d) {
          this.$store.commit('set_current_tx', d.data);
        }).bind(this));
      blocks.filter(d => this.$store.state.recordsand.some(item => item.tx_hash === d.data.tx_hash))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.8);
      blocks.filter(d => this.$store.state.recordarb.some(item => item.tx_hash === d.data.tx_hash))
        .attr('stroke', 'green')
        .attr('stroke-width', 0.8);
      blocks.filter(d => this.$store.state.recordliq.some(item => item.tx_hash === d.data.tx_hash))
        .attr('stroke', 'red')
        .attr('stroke-width', 0.8);
      blocks.on('mouseover', function (event, d) {
        var table = '<table>';
        for (var key in d.data) {
          table += '<tr><th>' + key + '</th><td>:' + d.data[key] + '</td></tr>\n';
        }
        table += '</table>';
        d3.select(this)
          .append('title')
          .html(table);
        d3.select(this)
          .transition()
          .attr('height', 11)
          .attr('width', 11)
          .style('filter', 'brightness(200%)');
      }).on('mouseout', function (d) {
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
      const d = this.$store.state.current_selected_block - 1
      if (d >= 12914944) {
        this.$store.commit('set_current_block', d)
      }
      else {
        this.$store.commit('set_current_block', 12914944)
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
        this.$store.commit('set_current_block', d);
      }
    },
  }
};
</script>

<style scoped>
.container1 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 120px;

}

.block-container {
  background-color: hsl(210, 90%, 80%);
  padding: 50px;
  width: 100px;
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

.small-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: calc(8%);
  height: calc(7%);
  margin: 1px;
  transition: filter 0.2s ease;
  position: relative;
  border-radius: 50%;
  z-index: 1;
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

.arrow-left:before {
  transform: rotate(45deg);
  left: 200px;
  top: 16px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.tooltip {
  display: none;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  z-index: 999;
}

.small-block:hover .tooltip {
  display: block;

}

.small-block:hover {
  background-color: #fff;
  filter: brightness(200%);
}

.arrow-left,
.arrow-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
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
