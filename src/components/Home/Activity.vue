<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索过滤区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="queryInfo.gradeId" @change="selectChang">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in gradeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input
            placeholder="请输入活动名称"
            v-model="queryInfo.name"
            class="input-with-select"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="btnSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="redirectAddActivity"
            >添加活动</el-button
          >
        </el-col>
      </el-row>
      <!-- 时间轴区域 -->
      <div class="block topMargin">
        <el-timeline>
          <el-timeline-item
            :timestamp="item.startTime | dateFormat"
            placement="top"
            type="success"
            v-for="item in activityList"
            :key="item.id"
          >
            <el-card>
              <h2>{{ item.name }}</h2>

              <el-image
                style="width: 100px; height: 100px"
                :src="item.onePicture"
                :preview-src-list="item.pictureList"
              >
              </el-image>
              <p v-html="item.remark"></p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <!-- 大图预览 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gradeList: [],
      activityList: [],
      queryInfo: {
        name: '',
        gradeId: 0
      },
      gradeId: 0,
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
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
      this.queryInfo.gradeId = this.gradeList[0].id
      this.getActivityList()
    },
    //获取班级活动列表数据
    async getActivityList() {
      const { data: res } = await this.$axios.get(
        `Activity/GetActivityByParams`,
        {
          params: this.queryInfo
        }
      )
      this.activityList = res.data
    },
    //班级下拉框改变时触发
    selectChang() {
      this.getActivityList()
    },
    //清空输入框
    clearInput() {
      this.getActivityList()
    },
    //点击搜索按钮
    btnSearch() {
      this.getActivityList()
    },
    //跳转到添加活动页面
    redirectAddActivity() {
      this.$router.push('/addActivity')
    }
  }
}
</script>

<style lang="scss" scoped>
.topMargin {
  margin-top: 30px;
}
</style>
