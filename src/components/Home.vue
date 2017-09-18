<template>
<div class="home">
  <div class="right-region">
    <Button type="primary" size="small" icon="android-add" @click="modal = true">Server</Button>
  </div>
  <Table stripe :columns="columns" :data="data"></Table>
  <Modal v-model="modal" title="Add Server" @on-ok="modalCommit('formValidate')" @on-cancel="modalCancel('formValidate')">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="姓名" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
      </FormItem>
      <FormItem label="城市" prop="city">
        <Select v-model="formValidate.city" placeholder="请选择所在地">
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="shenzhen">深圳市</Option>
            </Select>
      </FormItem>
      <FormItem label="选择日期">
        <Row>
          <Col span="11">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
          <FormItem prop="time">
            <TimePicker type="time" placeholder="选择时间" v-model="formValidate.time"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="性别" prop="gender">
        <RadioGroup v-model="formValidate.gender">
          <Radio label="male">男</Radio>
          <Radio label="female">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="爱好" prop="interest">
        <CheckboxGroup v-model="formValidate.interest">
          <Checkbox label="吃饭"></Checkbox>
          <Checkbox label="睡觉"></Checkbox>
          <Checkbox label="跑步"></Checkbox>
          <Checkbox label="看电影"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
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
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        mail: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        city: [{
          required: true,
          message: '请选择城市',
          trigger: 'change'
        }],
        gender: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        interest: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '至少选择一个爱好',
            trigger: 'change'
          },
          {
            type: 'array',
            max: 2,
            message: '最多选择两个爱好',
            trigger: 'change'
          }
        ],
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
        }],
        desc: [
          {
            required: true,
            message: '请输入个人介绍',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 20,
            message: '介绍不能少于20字',
            trigger: 'blur'
          }
        ]
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
.home {
  height: 100%;
}

.right-region {
  position: absolute;
  top: 70px;
  right: 15px;
}
</style>
