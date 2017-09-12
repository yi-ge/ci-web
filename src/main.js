import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Request from './utils/request.js'

Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.$request = Request

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
