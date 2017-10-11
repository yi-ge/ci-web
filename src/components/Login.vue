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
      <FormItem prop="verfiycode">
        <Input type="text" v-model="formLogin.verfiycode" placeholder="Identifying Code" size="large" @keyup.enter.native="handleLoginSubmit('formLogin')">
          <div slot="append" class="varfiy" @click="reloadVerfiyCode">
            <img :src="verfiycodeImg" />
          </div>
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
        <Button type="primary" @click="handleLoginSubmit('formLogin')">Sign in</Button>
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
      <FormItem prop="verfiycode">
        <Input type="text" v-model="formRegister.verfiycode" placeholder="Identifying Code" size="large" @keyup.enter.native="handleRegisterSubmit('formRegister')">
          <div slot="append" class="varfiy" @click="reloadVerfiyCode">
            <img :src="verfiycodeImg" />
          </div>
        </Input>
      </FormItem>
      <FormItem>
        <div style="float: left">
          <Checkbox v-model="formRegister.accept">I have read and accepted the User Agreement.</Checkbox>
        </div>
        <div style="float: right;cursor: pointer;" @click="login">
          Sign in
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleRegisterSubmit('formRegister')">Sign up</Button>
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
import { setToken, delToken } from '../utils/tool'
import { config } from '../utils/request'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input password'))
      } else {
        if (!(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(value))) { // eslint-disable-line
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
          if (value.length < 5) {
            callback(new Error('The phone seems to be wrong.'))
          } else {
            let tmp = await this.$request.post('/public/user/dereplication', {type: 'phone', value: value})
            if (tmp.data.status === 2) {
              callback(new Error('Phone already exists, please try another.'))
            } else if (tmp.data.status === 1) {
              callback()
            } else {
              callback(new Error('Unknown error:' + tmp.data.status))
            }
          }
        } else {
          callback(new Error('Phone can not empty.'))
        }
      } catch (e) {
        console.log(e)
      }
    }

    const validateUsername = async (rule, value, callback) => {
      try {
        if (value) {
          if (!(/[a-zA-Z0-9]{3,20}/.test(value))) {
            callback(new Error('The phone seems to be wrong, 3-20 upper case and lower case and numbers.'))
          } else {
            let tmp = await this.$request.post('/public/user/dereplication', {type: 'username', value: value})
            if (tmp.data.status === 2) {
              callback(new Error('Username already exists, please try another.'))
            } else if (tmp.data.status === 1) {
              callback()
            } else {
              callback(new Error('Unknown error:' + tmp.data.status))
            }
          }
        } else {
          callback(new Error('Username can not empty.'))
        }
      } catch (e) {
        console.log(e)
      }
    }

    const validateEmail = async (rule, value, callback) => {
      try {
        let tmp = await this.$request.post('/public/user/dereplication', {type: 'email', value: value})
        if (tmp.data.status === 2) {
          callback(new Error('Email already exists, please try another.'))
        } else if (tmp.data.status === 1) {
          callback()
        } else {
          callback(new Error('Unknown error:' + tmp.data.status))
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
        remember: false,
        verfiycode: ''
      },
      formRegister: {
        username: '',
        password: '',
        repassword: '',
        phone: '',
        email: '',
        accept: false,
        verfiycode: ''
      },
      ruleLogin: {
        username: [{
          required: true,
          message: 'Please input username or email, phone.',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please input password.',
          trigger: 'blur'
        }],
        verfiycode: [{
          required: true,
          message: 'Please input Identifying Code.',
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
          { type: 'email', required: true, message: 'The email address seems to be wrong.', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        verfiycode: [{
          required: true,
          message: 'Please input Identifying Code.',
          trigger: 'blur'
        }]
      },
      time: null,
      spinShow: false,
      registerShow: false,
      progress: {
        percentage: 0,
        status: 'normal'
      },
      verfiycodeImg: null,
      code: null
    }
  },
  created () {
    this.reloadVerfiyCode()
  },
  mounted () {
    this.$request.get('/public/auth/loginCheck').then(r => {
      if (r.data.status !== 1) {
        this.$Message.error(r.data.result.msg)
      }
    }).catch(e => {
      this.$Message.error('服务器连接异常')
    })

    window.tmpThis = this

    this.$watch('formRegister.password', function (newVal, oldVal) {
      if (newVal.length === 0) {
        this.progress.percentage = 0
        this.progress.status = 'normal'
      } else if (newVal.length < 8 && newVal.length > 0) {
        this.progress.percentage = newVal.length * 2
        this.progress.status = 'wrong'
      } else {
        if (/[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) { // eslint-disable-line
          this.progress.percentage = 25
          this.progress.status = 'wrong'
        }
        if (/(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal) || /(?=.*[A-Z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal) || /(?=.*[0-9])(?=.*[a-z])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) { // eslint-disable-line
          this.progress.percentage = 50
          this.progress.status = 'active'
        }
        if (/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9A-Za-z\x00-\x2F\x3A-\x40\x5B-\xFF]{8,18}/.test(newVal)) { // eslint-disable-line
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
            let { data } = await this.$request.post('/public/auth/login', {
              username: this.formLogin.username,
              password: this.formLogin.password,
              code: this.code,
              verfiycode: this.formLogin.verfiycode
            })
            this.spinShow = false
            if (data.status === 1) {
              this.$Message.success('Success!')
              setToken(data.result.data.token, this.formLogin.remember ? '7d' : null)
              window.location.href = '/'
            } else {
              this.$Message.error(data.result.msg)
            }
          } catch (e) {
            this.$Message.error('Unable to connect to the network.')
            this.spinShow = false
          }
          this.reloadVerfiyCode()
        } else {
          this.$Message.info('Fail!')
        }
      })
    },
    handleRegisterSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (this.formRegister.accept) {
          if (valid) {
            this.spinShow = true
            try {
              let { data } = await this.$request.post('/public/auth/register', {
                username: this.formRegister.username,
                password: this.formRegister.password,
                phone: this.formRegister.phone,
                email: this.formRegister.email,
                code: this.code,
                verfiycode: this.formRegister.verfiycode
              })
              this.spinShow = false
              if (data.status === 1) {
                this.$Message.success('Loading...')
                delToken()
                setToken(data.result.data.token)
                window.location.href = '/'
              } else {
                this.$Message.error(data.result.msg)
              }
            } catch (e) {
              this.$Message.error('Unable to connect to the network.')
              this.spinShow = false
            }
            this.reloadVerfiyCode()
          } else {
            this.$Message.info('Fail!')
          }
        } else {
          this.$Message.info('You must accept the User Agreement.')
        }
      })
    },
    register () {
      this.registerShow = true
    },
    login () {
      this.registerShow = false
    },
    reloadVerfiyCode () {
      let tmp = new Date().getTime().toString()
      this.code = (tmp.substring(5, tmp.length) + Math.floor(Math.random() * 1000).toString()).toString()
      this.verfiycodeImg = config.baseURL + '/public/auth/verfiycode?code=' + this.code
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  text-align: center;
  padding-top: 60px;
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

.varfiy {
  margin: -7px;
  overflow: hidden;
  height: 36px;
  cursor: pointer;
}
</style>

<style>
.password .ivu-form-item-error-tip {
  text-align: left;
}

.ivu-input-group-append {
  overflow: hidden;
}
</style>
