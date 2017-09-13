<template>
<div class="container">
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
      <Menu active-name="1" theme="dark" width="auto">
        <slot name="header">
          <div class="layout-logo-left"></div>
        </slot>
        <MenuItem name="1">
        <Icon type="ios-navigate" :size="iconSize"></Icon>
        <span class="layout-text">选项 1</span>
        </MenuItem>
        <MenuItem name="2">
        <Icon type="ios-keypad" :size="iconSize"></Icon>
        <span class="layout-text">选项 2</span>
        </MenuItem>
        <MenuItem name="3">
        <Icon type="ios-analytics" :size="iconSize"></Icon>
        <span class="layout-text">选项 3</span>
        </MenuItem>
      </Menu>
      </Col>
      <Col :span="spanRight">
        <div class="right-content">
          <div class="layout-header">
            <Button type="text" @click="toggleClick">
                <Icon type="navicon" size="32"></Icon>
            </Button>
            <Avatar icon="person" size="large" />
          </div>
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem href="#">首页</BreadcrumbItem>
              <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
              <BreadcrumbItem>某应用</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div class="layout-content">
            <div class="layout-content-main">
              <slot name="content"></slot>
            </div>
          </div>
        </div>

        <footer>
          <slot name="footer">
            <div class="layout-copy">
              Continuous Integration System
            </div>
          </slot>
        </footer>
      </Col>
    </Row>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      spanLeft: 5,
      spanRight: 19
    }
  },
  computed: {
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24
    }
  },
  methods: {
    toggleClick () {
      if (this.spanLeft === 5) {
        this.spanLeft = 2
        this.spanRight = 22
      } else {
        this.spanLeft = 5
        this.spanRight = 19
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.layout-breadcrumb {
  padding: 10px 15px 0;
}

.layout-content {
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  height: 100%;
}

.layout-content-main {
  padding: 10px;
}

.layout-copy {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #9ea7b4;
}

.layout-menu-left {
  background: #464c5b;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.layout-ceiling-main a {
  color: #9ba7b5;
}

.layout-hide-text .layout-text {
  display: none;
}

.ivu-col {
  transition: width .2s ease-in-out;
}

.ivu-row-flex {
  height: 100%;
}

.right-content {
  min-height:100%;
  margin-bottom:-40px;
}
</style>
