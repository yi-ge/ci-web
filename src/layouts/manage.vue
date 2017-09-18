<template>
<div class="container">
  <div class="layout" :class="showMenu ? 'layout-show-text' : 'layout-hide-text'">
      <div class="layout-menu-left" :style="showMenu ? 'width: ' + showWidth + 'px' : 'width: ' + hideWith + 'px'">
        <Menu :active-name="this.$route.name" theme="dark" width="auto" @on-select="clickMenu">
          <slot name="header">
            <div class="layout-logo-left">CI</div>
          </slot>
          <MenuItem name="Home">
            <div class="menu-item-content">
              <Icon type="home" :size="iconSize"></Icon>
              <span class="layout-text">Home</span>
            </div>
          </MenuItem>
          <MenuItem name="Timing">
            <div class="menu-item-content">
              <Icon type="ios-timer" :size="iconSize"></Icon>
              <span class="layout-text">Timing</span>
            </div>
          </MenuItem>
          <MenuItem name="Plugin">
            <div class="menu-item-content">
              <Icon type="cube" :size="iconSize"></Icon>
              <span class="layout-text">Plugin</span>
            </div>
          </MenuItem>
          <MenuItem name="Users">
            <div class="menu-item-content">
              <Icon type="person-stalker" :size="iconSize"></Icon>
              <span class="layout-text">Users</span>
            </div>
          </MenuItem>
          <MenuItem name="Setting">
            <div class="menu-item-content">
              <Icon type="gear-b" :size="iconSize"></Icon>
              <span class="layout-text">Setting</span>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="layout-right" :style="showMenu ? 'margin-left: ' + showWidth + 'px' : 'margin-left: ' + hideWith + 'px'">
        <div class="right-content">
          <div class="layout-header">
            <Button type="text" @click="toggleClick">
                <Icon type="navicon" size="32"></Icon>
            </Button>
            <div class="right-menu">
              <div class="right-menu-item">
                <Avatar icon="person" />
              </div>
              <div class="right-menu-item user-info">
                张三
              </div>
              <div class="right-menu-item log-out">
                <Icon type="log-out" size="20"></Icon>
              </div>
            </div>
          </div>
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem :href="this.$route.path">{{ this.$route.name }}</BreadcrumbItem>
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
      </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      showMenu: true,
      showWidth: 109,
      hideWith: 69
    }
  },
  created () {
    if (document.body.clientHeight <= 768) {
      this.showMenu = false
      this.hideWith = 0
    }
  },
  computed: {
    iconSize () {
      return this.showMenu ? 14 : 24
    }
  },
  methods: {
    toggleClick () {
      this.showMenu = !this.showMenu
    },
    clickMenu (name) {
      this.$router.push({name: name})
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
  margin: 15px;
  overflow: hidden;
  padding-bottom: 137px;
  height: 100%;
}

.layout-content-main {
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  height: 100%;
  overflow: auto;
}

.layout-copy {
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #9ea7b4;
}

.layout-menu-left {
  height: 100%;
  float: left;
  background: #464c5b;
  overflow: hidden;
  transition: width 1s;
  -moz-transition: width .3s;	/* Firefox 4 */
  -webkit-transition: width .3s;	/* Safari 和 Chrome */
  -o-transition: width .3s;	/* Opera */
}

.layout-right {
  height: 100%;
  transition: margin-left .3s;
  -moz-transition: margin-left.3s;	/* Firefox 4 */
  -webkit-transition: margin-left .3s;	/* Safari 和 Chrome */
  -o-transition: margin-left .3s;	/* Opera */
}

.layout-header {
  height: 60px;
  background: #fff;
  line-height: 60px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  box-sizing: border-box;
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
  text-align: center;
  line-height: 30px;
  color: #fff;
}

.layout-ceiling-main a {
  color: #9ba7b5;
}

.menu-item-content {
  overflow: hidden;
  height: 24px;
  line-height: 24px;
}

.layout-show-text .layout-text {
  display: show;
}

.layout-hide-text .layout-text {
  display: none;
}

.right-content {
  min-height:100%;
  height: 100%;
  margin-bottom: -30px;
}

.right-menu {
  float: right;
  line-height: 60px;
  height: 60px;
}

.right-menu-item {
  float: left;
  line-height: 32px;
  height: 60px;
  padding: 14px;
  cursor: pointer;
}

.right-menu-item:hover {
  background-color: #e4e4e4;
}

.log-out {
  line-height: 20px;
  padding: 20px 10px;
}

.user-info {
  font-weight: 600;
  font-size: 14px;
}

@media screen and (max-width: 768px){

}
</style>
