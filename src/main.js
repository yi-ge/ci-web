import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Request from './utils/request.js'
import { getToken } from './utils/tool'

Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.$request = Request

router.beforeEach((to, from, next) => {
  // Authorization
  if (to.name === 'Login') {
    next()
  } else {
    if (getToken()) {
      next()
    } else {
      next({name: 'Login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
