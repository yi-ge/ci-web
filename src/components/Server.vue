<template>
<div class="server">
  <div class="right-region">
    <Button type="primary" size="small" icon="android-add" @click="modal = true">Server</Button>
  </div>
  <Table stripe :columns="columns" :data="data"></Table>
  <Modal v-model="modal" title="Add Server" @on-ok="modalCommit('formValidate')" @on-cancel="modalCancel('formValidate')">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <FormItem label="Server Name" prop="name">
        <Input v-model="formValidate.name" placeholder="Custom"></Input>
      </FormItem>
      <FormItem label="Server IPv4" prop="ip">
        <Input v-model="formValidate.ip"></Input>
      </FormItem>
      <FormItem label="Authorization" prop="auth">
        <RadioGroup v-model="formValidate.auth">
          <Radio label="key" value="key">SSH KEY</Radio>
          <Radio label="password" value="password">Password</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="SSH KEY" prop="sshkey" v-show="formValidate.auth === 'key'">
        <Input v-model="formValidate.sshkey" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
      </FormItem>
      <FormItem label="Password" prop="password" v-show="formValidate.auth === 'password'">
        <Input v-model="formValidate.password" type="password"></Input>
      </FormItem>
      <FormItem label="Physical Address" prop="city">
        <Input v-model="formValidate.address" placeholder="Optional"></Input>
      </FormItem>
      <FormItem label="Note" prop="note">
        <Input v-model="formValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Optional"></Input>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'IP',
          key: 'ip'
        },
        {
          title: 'Status',
          key: 'status'
        },
        {
          title: 'Method',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, 'View'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, 'Delete')
            ])
          }
        }
      ],
      data: [],
      modal: false,
      formValidate: {
        name: '',
        ip: '',
        auth: 'key',
        address: '',
        note: ''
      },
      ruleValidate: {
        name: [{
          required: true,
          message: 'Not null',
          trigger: 'blur'
        }],
        ip: [
          {
            required: true,
            message: 'Not null',
            trigger: 'blur'
          }
        ],
        auth: [{
          required: true,
          message: 'Please select',
          trigger: 'change'
        }],
        date: [{
          required: true,
          type: 'date',
          message: '请选择日期',
          trigger: 'change'
        }],
        time: [{
          required: true,
          type: 'date',
          message: '请选择时间',
          trigger: 'change'
        }]
      }
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
  },
  methods: {
    modalCommit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('ok')
        } else {
          this.$Message.error('Fail')
        }
      })
    },
    modalCancel (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style scoped>
.right-region {
  position: absolute;
  top: 70px;
  right: 15px;
}
</style>
