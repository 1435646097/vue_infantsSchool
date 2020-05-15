<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-school"></i>
          <span>学院管理</span>
        </template>
        <el-menu-item index="/role">
          <i class="el-icon-s-check"></i>角色管理</el-menu-item
        >
        <el-menu-item index="/grade">
          <i class="el-icon-s-home"></i>班级管理</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import bus from './bus'
export default {
  data() {
    return {
      collapse: false
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
