import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Server from '@/components/Server'
import Timing from '@/components/Timing'
import Plugin from '@/components/Plugin'
import Users from '@/components/Users'
import Setting from '@/components/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Server',
      name: 'Server',
      component: Server
    },
    {
      path: '/Timing',
      name: 'Timing',
      component: Timing
    },
    {
      path: '/Plugin',
      name: 'Plugin',
      component: Plugin
    },
    {
      path: '/Users',
      name: 'Users',
      component: Users
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
