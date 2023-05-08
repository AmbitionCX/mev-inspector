<template>
  <div id="Blockview">
    <div class="panel-header">Block View</div>
    <div class="label-wrapper">
      <div class="color-block-wrapper">
        <div class="color-item red"></div>
        <span class="color-label">liquidations</span>
        <div class="break"></div>
        <div class="color-item green"></div>
        <span class="color-label">arbitrages</span>
        <div class="break"></div>
        <div class="color-item purple"></div>
        <span class="color-label">sandwich attacker</span>
        <div class="break"></div>
        <div class="color-item orange"></div>
        <span class="color-label">sandwich defender</span>
        <div class="break"></div>
        <div class="color-item blue"></div>
        <span class="color-label">norm</span>
      </div>
    </div>
    <div class="container1">
      <div class="block-container">
        <p>BLOCK&nbsp;{{ this.$store.state.current_selected_block }}</p>
        <p>{{ currentIndex }}</p>
        <canvas ref="canvas" @mousemove="highlightBlock"></canvas>
      </div>
      <button class="arrow-left" @click="moveLeft">
      </button>
      <button class="arrow-right" @click="moveRight">
      </button>
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
      like: 0,
      datalike: 0,
    };
  },
  created() {
    this.$store.commit('set_current_block', JSON.parse(localStorage.getItem('current_selected_block')));
  },
  mounted() {
    setTimeout(() => {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.generateBlocks();
      this.drawBlocks();
      this.drawHistogram();
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
        this.drawHistogram();
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
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.blocks = [];
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks();
      }, 300);

    },
    currentIndex(newIndex, oldIndex) {
      // 当 currentIndex 值发生变化时执行此函数
      // newIndex 是新的 currentIndex 值
      // oldIndex 是旧的 currentIndex 值
      const svg = d3.select(this.$refs.svg);
      svg.html("");
      this.drawBlocks();
      // 执行一些操作 ...
    }


  },

  methods: {
    islike(a, b) {
      if (a != 0 && b != 0) {
        if (Math.abs(a - b) / a < 0.05) {
          // console.log(1-Math.abs(a-b)/a)
          return 1 - Math.abs(a - b) / a

        }
        else { return 0 }
      } else { return 0 }
    },
    generateBlocks() {
      const txAmount = this.$store.state.current_block_summary[0].tx_amount; // 获取交易数量
      const PaidFeeArr = this.$store.state.current_tx_summary.map(item => item.paid_fee)
      const maxPaidFee = Math.max(...PaidFeeArr)
      const gasUsedArr = this.$store.state.current_tx_summary.map(item => item.gas_used)
      const maxGasUsed = Math.max(...gasUsedArr)
      for (let i = 0; i < txAmount; i++) {
        const data = this.$store.state.current_tx_summary[i]; // 获取交易数据
        const frontrun = this.$store.state.current_sandwiches.find(tx => tx.frontrun_swap_transaction_hash === data.tx_hash);
        const backtrun = this.$store.state.current_sandwiches.find(tx => tx.backrun_swap_transaction_hash === data.tx_hash);
        const liquidations = this.$store.state.current_liquidations.find(tx => tx.transaction_hash === data.tx_hash);
        const arbitrages = this.$store.state.current_arbitrages.find(tx => tx.transaction_hash === data.tx_hash);
        const sandefend = this.$store.state.current_sandwiches.find(tx => tx.sandwiched_transaction_hash.includes(data.tx_hash));
        const relationship = [];
        if (frontrun) {
          for (let j = 0; j < frontrun.sandwiched_transaction_hash.length; j++) { relationship.push(frontrun.sandwiched_transaction_hash[j]) }
          relationship.push(frontrun.backrun_swap_transaction_hash)
        }
        if (backtrun) {
          for (let j = 0; j < backtrun.sandwiched_transaction_hash.length; j++) { relationship.push(backtrun.sandwiched_transaction_hash[j]) }
          relationship.push(backtrun.frontrun_swap_transaction_hash)

        }
        if (sandefend) {
          relationship.push(sandefend.frontrun_swap_transaction_hash)
          relationship.push(sandefend.backrun_swap_transaction_hash)
        }

        if (frontrun || backtrun) {
          const lightness = 10
          const color = 'purple'; // 生成渐变色
          this.blocks.push({ color, data, i, relationship });
        } else {
          if (liquidations) {
            const color = 'red';
            this.blocks.push({ color, data, i, relationship });
          } else {
            if (arbitrages) {
              const color = 'green';
              this.blocks.push({ color, data, i, relationship });
            } else {
              if (sandefend) {
                const color = 'orange';
                this.blocks.push({ color, data, i, relationship });
              } else {
                this.like = 0
                this.datalike = 0
                const left = Math.max(0, i - 5)
                const right = Math.min(txAmount, i + 5)
                for (let j = left; j < right; j++) {
                  if (j != i && this.$store.state.current_tx_summary[j].to == data.to) {
                    this.like = 1
                  }
                  if (j != i) {
                    this.datalike = Math.max(this.datalike, this.islike(this.$store.state.current_tx_summary[j].gas_used, data.gas_used) * 0.8
                      + this.islike(this.$store.state.current_tx_summary[j].value, data.value) * 0.2)
                  }
                }

                const lightness = Math.max(30, 90 - this.datalike * 20 - this.like * 5 - 10 * (data.paid_fee / maxPaidFee) - 5 * (data.gas_used / maxGasUsed)); // 计算亮度（使用 value 值作为参考）
                const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
                this.blocks.push({ color, data, i, relationship });

              }

            }
          }
        }
      }
    },
    drawHistogram() {
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
      const blockWidth = this.canvas.width / this.$store.state.current_block_summary[0].tx_amount;
      const maxNum = Math.max(...this.blocks.map((block) => block.data.value));
      const highlightedIndex = this.highlightedIndex;
      const highlightedColor = this.highlightedColor;
      this.blocks.forEach((block, index) => {
        const x = index * blockWidth;
        const height = (block.data.value / maxNum) * canvasHeight;
        const y = canvasHeight - height;
        if (index === highlightedIndex) {
          this.ctx.fillStyle = highlightedColor;
        } else {
          this.ctx.fillStyle = block.color;
        }
        this.ctx.fillRect(x, y, blockWidth, height);
      });
    },
    highlightBlock(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const blockWidth = this.canvas.width / this.$store.state.current_block_summary[0].tx_amount;
      const index = Math.floor(mouseX / blockWidth);
      if (index >= 0 && index < this.blocks.length) {
        this.highlightedIndex = index;
        this.highlightedColor = 'black';
        this.currentIndex = index;
        this.$store.commit('set_current_tx', this.$store.state.current_tx_summary[index]);
        this.drawHistogram();
      }
      else {
        this.currentIndex = -1;
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
        .attr('height', (d, i) => i === this.currentIndex ? 11 : 10)
        .attr('width', (d, i) => i === this.currentIndex ? 11 : 10)
        .attr('fill', (d, i) => i === this.currentIndex ? 'lightblue' : d.color)
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
        // 将与当前块相同的块的选中状态更新为 true
        var currentData = d.relationship;
        blocks.each(function (d) {
          if (currentData.includes(d.data.tx_hash)) {
            d.selected = true;
          }
        });
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
        var selectedBlocks = blocks.filter(function (d) {
          return d.selected;
        });
        selectedBlocks
          .transition()
          .attr('height', 11)
          .attr('width', 11)
          .style('filter', 'brightness(200%)');
      }).on('mouseout', function (d) {
        blocks.each(function (d) {
          d.selected = false;
        });

        d3.select(this)
          .select('title')
          .remove();

        blocks.transition()
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


}

.block-container {
  /*background-color: hsl(210, 90%, 80%);*/
  padding: 50px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

canvas {
  display: flex;
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
  left: 2px;
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

.label-wrapper {
  position: absolute;
  top: 20px;
  left: 10px;
}

.color-item {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.red {
  background-color: red;
}

.green {
  background-color: green;
}

.purple {
  background-color: purple;
}

.orange {
  background-color: orange;
}

.blue {
  background-color: blue;
}

.color-label {
  margin-left: 5px;
  font-weight: bold;
}

/* 在小块换行 */
.color-block-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.break {
  flex-basis: 100%;
  height: 0;
}</style>
