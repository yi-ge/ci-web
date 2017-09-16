<template>
  <div id="app">
    <keep-alive>
      <login v-if="this.$route.name === 'Login'">
        <div slot="content"><router-view></router-view></div>
      </login>
      <layout else>
        <div slot="content"><router-view></router-view></div>
      </layout>
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
