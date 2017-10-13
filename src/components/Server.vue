<template>
<div class="server">
  <div class="right-region">
    <Button type="primary" size="small" icon="android-add" @click="modal = true">Server</Button>
  </div>
  <Table stripe :columns="columns" :data="servrList"></Table>
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
      <FormItem label="Physical Address" prop="address">
        <Input v-model="formValidate.address" placeholder="Optional"></Input>
      </FormItem>
      <FormItem label="Note" prop="note">
        <Input v-model="formValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Optional"></Input>
      </FormItem>
      <FormItem label="Status" prop="status">
        <AutoComplete
          v-model="formValidate.status"
          :data="statusData"
          :filter-method="filterMethod"
          placeholder="Input Or Select">
        </AutoComplete>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
export default {
  data () {
    const sshkeyCheck = (rule, value, callback) => {
      if (window.tmpThis.formValidate.auth === 'key' && !value) {
        callback(new Error('Not null'))
      } else {
        callback()
      }
    }

    const passwordCheck = (rule, value, callback) => {
      if (window.tmpThis.formValidate.auth === 'password' && !value) {
        callback(new Error('Not null'))
      } else {
        callback()
      }
    }

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
          width: 138,
          render: (h, params) => {
            return h('div',
              [
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
                      this.deleteServer(params.index, params.row.id)
                    }
                  }
                }, 'Delete')
              ]
            )
          }
        }
      ],
      servrList: [],
      modal: false,
      formValidate: {
        name: '',
        ip: '',
        auth: 'key',
        sshkey: '',
        password: '',
        address: '',
        note: '',
        status: ''
      },
      statusData: ['正常', '异常', '糟糕'],
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
        sshkey: [
          { validator: sshkeyCheck, trigger: 'blur' }
        ],
        password: [
          { validator: passwordCheck, trigger: 'blur' }
        ]
      }
    }
  },
  async created () {
    let { data } = await this.$request.get('/server/list')
    if (data.status === 1) {
      this.servrList = data.result.data
    } else if (data.status === 403) {
      this.$router.push({name: 'Login'})
    } else {
      this.$Message.warning(data.result.msg)
    }
  },
  mounted () {
    window.tmpThis = this
  },
  methods: {
    modalCommit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let { data } = await this.$request.post('/server/add', this.formValidate)
          if (data && data.status === 1) {
            this.$Message.success('Ok')
          } else {
            this.$Message.warning(data.result.msg)
          }
        } else {
          this.$Message.error('Fail')
        }
      })
    },
    modalCancel (name) {
      this.$refs[name].resetFields()
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    async deleteServer (index, id) {
      let { data } = await this.$request.post('/server/del', {id: id})
      if (data && data.status === 1) {
        this.servrList.splice(index, 1)
        this.$Message.success('Ok')
      } else {
        this.$Message.warning(data.result.msg)
      }
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
