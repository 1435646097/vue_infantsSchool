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
      <el-menu-item index="/welcome">
        <i class="el-icon-s-home"></i>
        <span slot="title">欢迎页</span>
      </el-menu-item>
      <el-submenu
        :index="oneAction.path"
        v-for="oneAction in menuList"
        :key="oneAction.id"
      >
        <template slot="title">
          <i :class="oneAction.icon"></i>
          <span>{{ oneAction.name }}</span>
        </template>
        <el-menu-item
          :index="twoAction.path"
          v-for="twoAction in oneAction.children"
          :key="twoAction.id"
        >
          <i :class="twoAction.icon"></i>{{ twoAction.name }}</el-menu-item
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
      collapse: false,
      menuList: []
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path
    }
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$axios.get('action/GetMenu')
      this.menuList = res.data
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
    //加载侧边栏数据
    this.getMenuList()
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
