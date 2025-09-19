import App from './App'



// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uviewPlus from '@/uni_modules/uview-plus'
import floatButtonMixin from './floatButtonMixin.js'; // 引入混入
import store from './tools/storage/VuexStorage.js'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  // 使用混入
  app.mixin(floatButtonMixin);
  app.use(store)
  return {
    app
  }
}
// #endif