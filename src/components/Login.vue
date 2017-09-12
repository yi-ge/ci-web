<template>
<div class="login">
  <h1>{{ msg }}</h1>
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
  </div>
</div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: 'Welcome to Continuous Integration System',
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
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Loading...')
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.form {
  padding: 30px;
}
</style>
