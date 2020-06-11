<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索过滤区域 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select v-model="gradeId" @change="selectChang">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in gradeList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加相册</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gradeList: [],
      gradeId: 0
    }
  },
  created() {
    this.getGradeList()
  },
  methods: {
    //获取班级信息
    async getGradeList() {
      const { data: res } = await this.$axios.get('Student/GetGradesInfo')
      this.gradeList = res.data
      this.gradeId = this.gradeList[0].id
    },
    selectChang() {}
  }
}
</script>
