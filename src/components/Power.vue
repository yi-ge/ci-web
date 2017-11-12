<template>
  <div class="users">
    <div class="right-region">
      <Button type="primary" size="small" icon="android-add" @click="modal = true">User</Button>
    </div>
    <Table stripe :columns="columns" :data="data"></Table>
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
          title: 'Email',
          key: 'email'
        },
        {
          title: 'Phone',
          key: 'phone'
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
      data: []
    }
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
