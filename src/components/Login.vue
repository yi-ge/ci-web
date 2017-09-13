<template>
<div class="login">
  <h2>{{ pageTitle }}</h2>
  <div class="form">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password" placeholder="Password">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">Sign in</Button>
      </FormItem>
    </Form>
    <p>
      {{ time }}
    </p>
    <Spin fix v-if="spinShow"></Spin>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      pageTitle: 'Welcome to Continuous Integration System',
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [{
          required: true,
          message: 'Please input username',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please input password',
          trigger: 'blur'
        },
        {
          type: 'string',
          min: 6,
          message: 'Password is to low',
          trigger: 'blur'
        }]
      },
      time: null,
      spinShow: false
    }
  },
  mounted () {
    let getTime = () => {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + 1
      let day = today.getDate()
      let hours = today.getHours()
      let minutes = today.getMinutes()
      let seconds = today.getSeconds()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      this.time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    getTime()

    setInterval(getTime, 1000)
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.spinShow = true
          try {
            let { data } = this.$request.post('/login')
            this.spinShow = false
            if (data.status === 1) {
              this.$Message.success('Loading...')
            } else {
              this.$Message.error(data.result.msg)
            }
          } catch (e) {
            this.$Message.error('请检查网络连接')
            this.spinShow = false
          }
        } else {
          this.$Message.info('Fail!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  text-align: center;
  margin-top: 60px;
}

h2 {
  font-weight: normal;
}

.form {
  padding: 30px;
}
</style>
