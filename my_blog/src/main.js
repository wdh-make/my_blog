import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'normalize.css'
import 'element-plus/dist/index.css'

// REM
import "@/assets/rem";

import '@/assets/css/global.scss'
import axios from "@/assets/js/axios";
import { errMessage, successMessage } from '@/assets/js/utils'

const app = createApp(App)

app.config.globalProperties.$http = axios
app.config.globalProperties.$error = errMessage
app.config.globalProperties.$success = successMessage

app.use(ElementPlus).use(store).use(router).mount('#app')
