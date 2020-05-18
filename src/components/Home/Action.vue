<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格显示区域 -->
    <el-table>
      <el-table-column></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actionList: []
    }
  },
  methods: {
    async getActionList() {
      const { data: res } = await this.$axios.get('Action/GetActionList')
      this.actionList = res.data
      console.log(this.actionList)
    }
  },
  created() {
    this.getActionList()
  }
}
</script>
