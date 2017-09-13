<template>
  <div class="home">
    1111
  </div>
</template>

<script>
export default {
  data () {
    return {
      servrList: []
    }
  },
  async created () {
    // let { data } = this.$request.get('/serve/get')
    // if (data.status === 1) {
    //   this.servrList = data.result.lists
    // } else if (data.status === 403) {
    //   this.$router.push({name: 'Login'})
    // } else {
    //   this.$Message.warning(data.result.msg)
    // }
  }
}
</script>

<style scoped>
  .home {
    height: 100%;
  }
</style>
