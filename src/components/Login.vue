<template>
<div class="login">
  <h2>{{ pageTitle }}</h2>
  <div class="form">
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" v-show="!registerShow">
      <FormItem prop="username">
        <Input type="text" v-model="formLogin.username" placeholder="Username / Email / Phone">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formLogin.password" placeholder="Password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <div style="float: left">
          <Checkbox v-model="formLogin.remember">Remember</Checkbox>
        </div>
        <div style="float: right;cursor: pointer;" @click="register">
          Sign up
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleLoginSubmit('formInline')">Sign in</Button>
      </FormItem>
    </Form>
    <Form ref="formRegister" :model="formRegister" :rules="ruleRegister" v-show="registerShow">
      <FormItem prop="username">
        <Input type="text" v-model="formRegister.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password" class="password">
        <Input type="password" v-model="formRegister.password" placeholder="Password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
        <Progress :percent="progress.percentage" :stroke-width="5" :status="progress.status"></Progress>
      </FormItem>
      <div class="lip"></div>
      <FormItem prop="repassword">
        <Input type="password" v-model="formRegister.repassword" placeholder="Re-enter password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="phone">
        <Input type="text" v-model="formRegister.phone" placeholder="Phone">
          <Icon type="iphone" slot="prepend" style="width: 7.5px"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="email">
        <Input type="text" v-model="formRegister.email" placeholder="Email">
          <Icon type="ios-email-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <div style="float: left">
          <Checkbox v-model="formRegister.accept">I have read and accepted the "user's agreement".</Checkbox>
        </div>
        <div style="float: right;cursor: pointer;" @click="login">
          Sign in
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleRegisterSubmit('formInline')">Sign up</Button>
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
import { setToken } from '../utils/tool'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input password'))
      } else {
        if (!(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(value))) {
          callback(new Error('The password you entered does not meet the minimum password strength requirements，Strong passwords are at 8-18 characters long, and they contain letters in mixed case (upper-case, lower-case), numbers, and even symbols for additional security.'))
        }
        if (window.tmpThis.formRegister.repassword !== '') {
          window.tmpThis.$refs.formRegister.validateField('repassword')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input password again'))
      } else if (value !== window.tmpThis.formRegister.password) {
        callback(new Error('Two input password must be consistent'))
      } else {
        callback()
      }
    }

    const validatePhone = async (rule, value, callback) => {
      try {
        if (value) {
          if (value.length !== 11) {
            callback(new Error('长度不符合要求，暂不支持非中国大陆手机号'))
          } else {
            let tmp = await this.$request.post('/public/user/dereplication', {type: 'phone', phone: value})
            if (tmp.data.status === 2) {
              callback(new Error('手机号已存在!'))
            } else if (tmp.data.status === 1) {
              callback()
            } else {
              callback(new Error('未知错误! ' + tmp.data.status))
            }
          }
        } else {
          callback(new Error('请输入手机号'))
        }
      } catch (e) {
        console.log(e)
      }
    }
    const validateUsername = async (rule, value, callback) => {
      try {
        if (value) {
          if (!(/[a-zA-Z0-9]{3,20}/.test(value))) {
            callback(new Error('用户名不符合要求，应为3-20位大小写字母或数字'))
          } else {
            let tmp = await this.$request.post('/public/user/dereplication', {type: 'username', username: value})
            if (tmp.data.status === 2) {
              callback(new Error('用户名已存在!'))
            } else if (tmp.data.status === 1) {
              callback()
            } else {
              callback(new Error('未知错误! ' + tmp.data.status))
            }
          }
        } else {
          callback(new Error('请输入用户名'))
        }
      } catch (e) {
        console.log(e)
      }
    }

    const validateEmail = async (rule, value, callback) => {
      try {
        let tmp = await this.$request.post('/public/user/dereplication', {type: 'email', email: value})
        if (tmp.data.status === 2) {
          callback(new Error('邮箱已存在!'))
        } else if (tmp.data.status === 1) {
          callback()
        } else {
          callback(new Error('未知错误!'))
        }
      } catch (e) {
        console.log(e)
      }
    }

    return {
      pageTitle: 'Welcome to Continuous Integration System',
      formLogin: {
        username: '',
        password: '',
        remember: false
      },
      formRegister: {
        username: '',
        password: '',
        repassword: '',
        phone: '',
        email: '',
        accept: false
      },
      ruleLogin: {
        username: [{
          required: true,
          message: 'Please input username or email, phone',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please input password',
          trigger: 'blur'
        }]
      },
      ruleRegister: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'change' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      },
      time: null,
      spinShow: false,
      registerShow: false,
      progress: {
        percentage: 0,
        status: 'normal'
      }
    }
  },
  mounted () {
    window.tmpThis = this

    this.$watch('formRegister.password', function (newVal, oldVal) {
      if (newVal.length === 0) {
        this.progress.percentage = 0
        this.progress.status = 'normal'
      } else if (newVal.length < 8 && newVal.length > 0) {
        this.progress.percentage = newVal.length * 2
        this.progress.status = 'wrong'
      } else {
        if (/[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) {
          this.progress.percentage = 25
          this.progress.status = 'wrong'
        }
        if (/(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal) || /(?=.*[A-Z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal) || /(?=.*[0-9])(?=.*[a-z])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) {
          this.progress.percentage = 50
          this.progress.status = 'active'
        }
        if (/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) {
          this.progress.percentage = 100
          this.progress.status = 'success'
        }
      }
    })

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
    handleLoginSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.spinShow = true
          try {
            let { data } = this.$request.post('/login')
            this.spinShow = false
            if (data.status === 1) {
              this.$Message.success('Loading...')
              setToken(data.result.data.token, this.remember ? '7d' : null)
            } else {
              this.$Message.error(data.result.msg)
            }
          } catch (e) {
            this.$Message.error('Unable to connect to the network...')
            this.spinShow = false
          }
        } else {
          this.$Message.info('Fail!')
        }
      })
    },
    register () {
      this.registerShow = true
    },
    login () {
      this.registerShow = false
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
  max-width: 500px;
  margin: auto;
}

.password {
  height: 110px;
}

.lip {
  height: 80px;
  border-top: 1px solid #d2d2d2;
  width: 100%;
  margin: auto;
}
</style>

<style>
.password .ivu-form-item-error-tip {
  text-align: left;
}
</style>
