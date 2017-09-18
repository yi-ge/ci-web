import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/dist/locale/en-US'
import Request from './utils/request.js'
import { getToken } from './utils/tool'
import Vuex from 'vuex'
import store from './store'

Vue.use(Vuex)
Vue.use(iView, { locale })

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
  store,
  template: '<App/>',
  components: { App }
})
