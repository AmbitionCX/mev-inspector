import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './index.css'
import { Carousel, initTE } from "tw-elements";
initTE({ Carousel });

createApp(App).use(store).mount('#app')
