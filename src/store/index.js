import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const InitVuex = async store => {

}

export default new Vuex.Store({
  state: {
    userinfo: null
  },
  mutations: {
    setUserinfo (state, payload) {
      state.userinfo = payload
    }
  },
  plugins: [InitVuex]
})
