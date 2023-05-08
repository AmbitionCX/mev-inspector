<template>
  <div class="blockchain">
    <div class="panel-header">Overview</div>
    <div class="slider-container">
      <input type="range" class="slider" min="1" max="5058" @mouseover="showData"  @mouseleave="hideData" v-model="sliderValue" />
      <div v-if="showInfo" class="slider-info">{{ sliderValue1+ '~' +sliderValue2 }}</div>
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
      showInfo: false,
      sliderValue:0,
      currentPage: 0, // 当前页数
      blockSize: 20, // 小方块边长
      blockMargin: 2, // 小方块间距
      blockCount: 60, // 小方块数量
      blocknum: 12930000 - 12914944 + 1,
      blocks: [], // 所有小方块的数据
      mev_amount: [],
      sliderValue1:12914944,
      sliderValue2:12914944+60,
    };
  },

  created() {
    this.queryMevAmount();
  },
  mounted() {
    this.queryMevAmount();
      setTimeout(() => {
        this.generateBlocks();
        this.drawBlocks(0,this.blockCount)
      }, 300);
  },

  methods: {
    showData() {
      this.showInfo = true;
    },
    hideData() {
      this.showInfo = false;
    },
    queryMevAmount() {
      const path = 'http://localhost:7070/get_mev_amount';
      axios
        .get(path)
        .then(result => {
          this.mev_amount = result.data;
        })
        .catch(error => {
          console.error(error);
        });
    },

    generateBlocks() {
      this.blocks = []; // Clear the existing blocks
      const i = 0
      for (let i = 0; i < 5058; i++) {
        const text = i + 12914944
        const num = this.mev_amount[i].total
        const lightness = Math.max(20, 90 - (num * 8)); // 计算亮度（使用 value 值作为参考）
        const color = `hsl(210, 90%, ${lightness}%)`; // 生成渐变色
        this.blocks.push({ color, text });
      }
    },

    drawBlocks(startIndex, endIndex) {
      const svg = d3.select(this.$refs.svg);
      svg.attr('width', (this.blockSize + this.blockMargin) * this.blockCount);
      svg.attr('height', 100)
      // const lines = svg.selectAll('line')
      //   .data(this.blocks.slice(startIndex, endIndex - 1))
      //   .enter()
      //   .append('line')
      //   .attr('x1', (d, i) => (i % this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2)
      //   .attr('y1', (d, i) => Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2)
      //   .attr('x2', (d, i) => {
      //     if (i % this.blockCount === this.blockCount - 1) {
      //       return 0;
      //     } else {
      //       return (i % this.blockCount + 1) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
      //     }
      //   })
      //   .attr('y2', (d, i) => {
      //     if (i % this.blockCount === this.blockCount - 1) {
      //       return (Math.floor(i / this.blockCount) + 1) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
      //     } else {
      //       return Math.floor(i / this.blockCount) * (this.blockSize + this.blockMargin) + this.blockSize / 2;
      //     }
      //   })
      //   .attr('stroke', 'blue')
      //   .attr('stroke-width', '1');
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
      watch: {
      sliderValue(newValue) {
        console.log(newValue)
        this.clearBlocks();
        const startIndex = parseInt(newValue);
        const lastIndex = Math.min(startIndex + this.blockCount - 1,5058);
        console.log(startIndex,lastIndex)
        this.drawBlocks(startIndex, lastIndex);
        this.sliderValue1 = startIndex+12914943
        this.sliderValue2 = lastIndex+12914943
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
.slider-container {
  max-width: 1000px;
  margin: auto;
}
.slider {
  width: 200%; /* 设置滑块的宽度为父容器的宽度 */
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
