<template>
  <div id="Blockview">
    <div class="panel-header">Block View</div>
    <el-icon >
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
      blockSize: 20, // 小方块边长
      blockMargin: 2, // 小方块间距
    };
  },
  created() {
    this.$store.commit('set_current_block', JSON.parse(localStorage.getItem('current_selected_block')));
    console.log(JSON.parse(localStorage.getItem('current_block_summary')));
  },
  mounted() {
    this.generateBlocks();
    this.drawBlocks();
  },

  watch: {
    // Whenever `current_selected_block` changes, save it to the local storage
    // '$store.state.current_selected_block': {
    //   handler(newValue) {
    //     localStorage.setItem('current_selected_block', newValue);
    //   },
    //   deep: true,
    // },
    //  '$store.state.current_tx_summary': {
    //   handler(newValue) {
    //     localStorage.setItem('current_tx_summary', newValue);
    //   },
    //   deep: true,
    // },
    //  '$store.state.current_block_summary': {
    //   handler(newValue) {
    //     localStorage.setItem('current_block_summary', newValue);
    //   },
    //   deep: true,
    // },

  },

  methods: {
    generateBlocks() {
      console.log("cre")
      console.log(this.$store.state.current_selected_block)
      console.log(this.$store.state.current_block_summary[0].tx_amount)
      for (let i = 0; i < this.$store.state.current_block_summary[0].tx_amount; i++) {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // 随机生成颜色
        const data = this.$store.state.current_tx_summary[i]; // 随机生成数据
        this.blocks.push({ color, data });
      }
    },
    drawBlocks() {
      console.log("draw")
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
        .attr('fill', d => d.color);
      blocks.on('mouseover', function (event, d) {
        d3.select(this)
          .append('title')
          .text(JSON.stringify(d.data))
          .style('opacity', 1);
      }).on('mouseout', function (d) {
        d3.select(this)
          .select('title')
          .remove();
      });
    },
    moveLeft() {
      const d = this.$store.state.current_selected_block - 1
      if (d >= 12914944) {
        this.$store.commit('set_current_block', d)
        this.blocks = []
        const svg = d3.select(this.$refs.svg);
        svg.html("");
        this.generateBlocks()
        this.drawBlocks()

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
      const d = this.$store.state.current_selected_block + 1
      if (d <= 12930000) {
        this.$store.commit('set_current_block', d)
        this.blocks = []
        const svg = d3.select(this.$refs.svg);
        svg.html("");
        this.generateBlocks()
        this.drawBlocks()
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
  height: 300px;

}

.block-container {
  background-color: #c1e4f9;
  padding: 100px;
  display: inline-block;
}

.container {
  position: center;
  width: 500px;
  height: 100%;
  left: 10%;
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
  left: 10%;
}

.arrow-right {
  right: 10%;
}

.fa-chevron-left,
.fa-chevron-right {
  font-size: 24px;
  color: #fff;
}</style>
