import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/svgicon.vue'
import './style.less'
import App from "./App.vue";
import router from "./router/index";


createApp(App).use(router).component('svg-icon', SvgIcon).mount("#app");
