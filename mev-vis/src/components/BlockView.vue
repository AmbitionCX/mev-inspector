
<template>
  <div class="container1">
    <h1>BLOCK</h1>
    <p>{{testdata1}}</p>
    <div class="arrow-left" @click="moveLeft">
      <i class="fas fa-chevron-left"></i>
    </div>
    <div class="arrow-right" @click="moveRight">
      <i class="fas fa-chevron-right"></i>
    </div>
  </div>
  <div class="container">
    <div class="main-block">
      <div
        v-for="(item, index) in currentBlocks"
        :key="index"
        class="small-block"
        :style="{ background: item.color }"
      >
        <span class="tooltip">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    testdata: {
      required: true,
    },
    testdata1: {
      required: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      blockCount: 10,
      blocksPerPage: 128,
      blocks: [],
    };
  },
  mounted() {
    console.log(this.testdata1)
    this.generateBlocks(this.testdata1[this.currentIndex]);
  },

  computed: {
    currentBlocks() {
      const start = 0 ;
      let a = this.testdata1[this.currentIndex]
      const end = 222;
      return this.blocks.slice(start, end);
    },
  },
  methods: {
    generateBlocks(testdata) {
      console.log(testdata)
      for (let i = 0; i < testdata.length; i++) {
        const color1 = this.getRandomColor();
        const color2 = this.getRandomColor();
        const j = i + 1;
        this.blocks.push({
          color: `linear-gradient(45deg, ${color1}, ${color2})`,
          text: testdata[i],
        });
      }
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    moveLeft() {
      console.log("moveleft")
      // console.log(this.currentIndex)
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.blockCount=Math.random()*10  ;
      }
    },
    moveRight() {
      // console.log("moveright")
      // console.log(this.currentIndex)
      this.currentIndex++;
      this.blockCount=Math.random()*10 +Math.random()*20+Math.random()*30 ;
    },
  },
  watch(){

  }

};
</script>
<style>
.container1 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.main-block {
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  height: 100%;
  top: 0px;
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
  z-index: 1;
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
  position:absolute;
  top:50%;
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
}
</style>
