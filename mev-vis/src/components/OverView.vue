<template>
  <div class="blockchain">
    <div class="panel-header">Overview</div>
    <div class="arrows">
      <button class="arrow arrow-left" @click="move(-1)">左</button>
      <button class="arrow arrow-right" @click="move(1)">右</button>
    </div>
    <svg ref="svg"></svg>
  </div>
</template>



<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {

  data() {
    return {
      currentPage: 0, // 当前页数
      blockSize: 20, // 小方块边长
      blockMargin: 40, // 小方块间距
      blockCount: 20, // 小方块数量
      blocknum: 12930000 - 12914944 + 1,
      blocks: [], // 所有小方块的数据
      mev_amount: [],
    };
  },

  created() {
    this.queryMevAmount();
  },
  mounted() {
    this.generateBlocks();
    // this.drawBlocks();
  },

  methods: {
    queryMevAmount() {
      const path = 'http://localhost:7070/get_mev_amount';
      axios
        .get(path)
        .then(result => {
          console.log(result.data);
          this.mev_amount = result.data;
        })
        .catch(error => {
          console.error(error);
        });
    },

    generateBlocks() {
      this.blocks = []; // Clear the existing blocks
      const i = 0
      for (let i = 0; i < 20; i++) {
        const d = i + 12914944 + this.currentPage * this.blockCount
        this.$store.commit('queryBlockSummarytemp', d);
      }
      this.$watch(
        () => this.$store.state.temp_block_summary,
        (newValue, oldValue) => {
          const num = newValue[0].sandwiches + newValue[0].arbitrages + newValue[0].liquidations
          const text = newValue[0].block_number
          const lightness = Math.max(20, 90 - (num * 10)); // 计算亮度（使用 value 值作为参考）
          const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
          if (!this.blocks.some(block => block.text === text)) { this.blocks.push({ color, text }); }
        }
      );
      setTimeout(() => {
        this.blocks.sort((a, b) => a.text - b.text);
      }, 200);
      setTimeout(() => {
        this.drawBlocks();
      }, 300);
    },

    drawBlocks() {
      const svg = d3.select(this.$refs.svg);
      const startIndex = 0;
      const endIndex = Math.min(this.blockCount, this.blocknum - this.currentPage * this.blockCount);
      svg.attr('width', (this.blockSize + this.blockMargin) * this.blockCount);
      svg.attr('height', 100)
      const lines = svg.selectAll('line')
        .data(this.blocks.slice(startIndex, endIndex - 1))
        .enter()
        .append('line')
        .attr('x1', (d, i) => (i % this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2)
        .attr('y1', (d, i) => Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2)
        .attr('x2', (d, i) => {
          if (i % this.blockCount === this.blockCount - 1) {
            return 0;
          } else {
            return (i % this.blockCount + 1) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
          }
        })
        .attr('y2', (d, i) => {
          if (i % this.blockCount === this.blockCount - 1) {
            return (Math.floor(i / this.blockCount) + 1) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
          } else {
            return Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
          }
        })
        .attr('stroke', 'blue')
        .attr('stroke-width', '1');
      const blocks = svg.selectAll('rect')
        .data(this.blocks.slice(startIndex, endIndex)) // 根据当前页数筛选数据
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % this.blockCount) * (this.blockSize + this.blockMargin))
        .attr('y', (d, i) => Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin))
        .attr('width', this.blockSize)
        .attr('height', this.blockSize)
        .attr('fill', d => d.color)
        .on('click', (function (event, d) {
          this.$store.commit('set_current_block', d.text);
        }).bind(this));
      blocks.on('mouseover', function (event, d) {
        d3.select(this)
          .append('title')
          .text(JSON.stringify(d.text))
        d3.select(this)
          .transition()
          .attr('height', 22)
          .attr('width', 22)
          .style('filter', 'brightness(200%)');
      }).on('mouseout', function (d) {
        d3.select(this)
          .select('title')
          .remove()
        d3.select(this)
          .transition()
          .attr('height', 20)
          .attr('width', 20)
          .style('filter', 'brightness(100%)');
      });
      // 添加连线

    },

    clearBlocks() {
      const svg = d3.select(this.$refs.svg);
      svg.selectAll('rect').remove();
    },

    // 移动视图
    move(direction) {
      this.clearBlocks();
      let nextPage = this.currentPage + direction;
      if (nextPage < 0) {
        nextPage = 0;
      } else if (nextPage >= Math.ceil(this.blocknum / this.blockCount)) {
        nextPage = Math.ceil(this.blocknum / this.blockCount) - 1;
      }
      this.currentPage = nextPage;
      this.generateBlocks();
      // this.drawBlocks();
    },
  },
};
</script>
<style>
.blockchain {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arrows {
  display: flex;
  margin-top: 20px;
}

.arrow {
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  background-color: #007bff;
  border: none;
  margin-right: 10px;
}

.arrow:hover {
  background-color: #0069d9;
}

.arrow-left {
  margin-right: 0;
}
</style>
