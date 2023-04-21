<template>
  <div class="container1">
    <div class="block-container">
    <p>BLOCK&nbsp;{{ this.$store.state.current_selected_block }}</p>
    </div>
    <div class="arrow-left" @click="moveLeft">
      <i class="fas fa-chevron-left"></i>
    </div>
    <div class="arrow-right" @click="moveRight">
      <i class="fas fa-chevron-right"></i>
    </div>
  </div>
  <div class="container">
    <div class="main-block">
      <div v-for="(item, index) in currentBlocks" :key="index" class="small-block" :style="{ background: item.color }">
        <span class="tooltip">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    block_summary: {
      required: true,
    }
  },
  data() {
    return {
      currentIndex: 0,
      blockCount: 10,
      blocksPerPage: 128,
      blocks: [],
      txn:[1],
    };
  },
  created() {
    //读取localStorage中之前保存的状态信息
    let current_selected_block = JSON.parse(localStorage.getItem('current_selected_block'))
    //将状态信息存储在全局状态管理器中，方便在组件中读取
    this.$store.commit('setCurrentSelectedBlock', current_selected_block)
    //读取localStorage中之前保存的状态信息
    let HIGH_BOUND_BLOCK = JSON.parse(localStorage.getItem('HIGH_BOUND_BLOCK'))
    //将状态信息存储在全局状态管理器中，方便在组件中读取
    this.$store.commit('setH', HIGH_BOUND_BLOCK)
    //读取localStorage中之前保存的状态信息
    let LOW_BOUND_BLOCK = JSON.parse(localStorage.getItem('LOW_BOUND_BLOCK'))
    //将状态信息存储在全局状态管理器中，方便在组件中读取
    this.$store.commit('setL', LOW_BOUND_BLOCK)

  },
  mounted() {
    this.tx();
    this.generateBlocks();
    this.txn
  },

   watch: {
    // Whenever `current_selected_block` changes, save it to the local storage
    '$store.state.current_selected_block': {
      handler(newValue) {
        localStorage.setItem('current_selected_block', newValue);
      },
      deep: true,
    },
  },
  computed: {
    currentBlocks() {
      const start = 0;
      const end = this.txn.length;
      return this.blocks.slice(start, end);
    },
  },

  methods: {
     tx() {
       const block_number = this.$store.state.current_selected_block
       console.log(block_number)
       const path = `http://localhost:7070/tx/${block_number}`;
      // `/arbitrages/${block_number}`
       axios
         .get(path)
         .then(result => {
          this.txn = result.data;
          this.generateBlocks(this.txn);
         })
         .catch(error => {
           console.error(error);
         });

    },
    generateBlocks(txn) {
      for (let i = 0; i < txn.length; i++) {
        const color1 = this.getRandomColor();
        const color2 = this.getRandomColor();
        this.blocks.push({
          color: `linear-gradient(45deg, ${color1}, ${color2})`,
          text: txn[i],
        }
        );
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
      // console.log(this.currentIndex)

      const d =this.$store.state.current_selected_block-1
      if (d >=12914944) {
        this.$store.commit('set_current_block',  d)
        location.reload();
     }
      else {
        this.$store.commit('set_current_block',  12914944)
        location.reload();
      }


    },

    moveRight() {
      // console.log("moveright")
      // console.log(this.currentIndex)
      const d =this.$store.state.current_selected_block+1
      if (d <=12930000) {
        this.$store.commit('set_current_block',  d)
        location.reload();
     }
    },

  },



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
.block-container {
    background-color: #c1e4f9;
    padding: 100px;
    display: inline-block;
  }
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  z-index: 10;
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
}
</style>
