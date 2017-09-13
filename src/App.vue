<template>
  <div id="app">
    <keep-alive>
      <component :is="currentView">
        <div slot="content"><router-view></router-view></div>
      </component>
    </keep-alive>
  </div>
</template>

<script>
import manage from './layouts/manage'
import login from './layouts/login'

export default {
  name: 'app',
  components: {
    'layout': manage,
    'login': login
  },
  data () {
    return {
      currentView: this.$route.name === 'Login' ? 'login' : 'layout'
    }
  }
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin:0;
  padding:0;
}
</style>
