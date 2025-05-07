import { createApp } from 'vue'
import App from '../src/view/App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
