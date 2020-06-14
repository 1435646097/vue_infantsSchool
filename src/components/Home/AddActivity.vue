<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加活动</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 顶部提示 -->
      <el-alert
        title="添加活动信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="活动图片"></el-step>
        <el-step title="活动内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="tabsBeforeLeave"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="活动时间" prop="startTime">
              <el-date-picker
                type="date"
                placeholder="活动时间"
                v-model="addForm.startTime"
                style="width: 30%;"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动班级" prop="gradeId">
              <el-select v-model="addForm.gradeId">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in gradeList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="活动图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              :before-upload="beforeAvatarUpload"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过2MB
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="活动内容">
            <quill-editor v-model="addForm.remark"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addActivity"
              >添加活动</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPicturePath" alt="" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      gradeList: [],
      headerObj: { Authorization: sessionStorage.getItem('token') },
      uploadURL: 'http://localhost:5000/api/photo/uploadImg',
      previewVisible: false,
      previewPicturePath: '',
      addForm: {
        name: '',
        startTime: '',
        gradeId: 0,
        remark: '',
        pics: []
      },
      addFormRules: {
        name: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        gradeId: [
          { required: true, message: '请选择活动班级', trigger: 'change' }
        ]
      }
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
      this.addForm.gradeId = this.gradeList[0].id
    },
    //左侧页面改变之前
    tabsBeforeLeave(activeName, oldActiveName) {
      if (
        this.addForm.name == '' ||
        this.addForm.startTime == '' ||
        this.addForm.gradeId == ''
      ) {
        this.$refs.addFormRef.validate((valid) => {})
        this.$message.error('请填入完整的信息！！！')
        return false
      }
    },
    //预览图片
    handlePreview(file) {
      this.previewPicturePath = 'http://localhost:5000/' + file.response.data
      this.previewVisible = true
    },
    //移除图片
    handleRemove(file) {
      const fileIndex = this.addForm.pics.findIndex(
        (x) => x.pic == file.response.data
      )
      this.addForm.pics.splice(fileIndex, 1)
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      var isImg = true
      console.log(file)
      if (file.type != 'image/jpeg' && file.type != 'image/png') {
        this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!!')
        isImg = false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    //上传成功图片
    handleSuccess(res, file) {
      if (!res.success) {
        return this.$message.error('上传失败')
      }
      const picPath = { path:'http://localhost:5000/' + res.data }
      this.addForm.pics.push(picPath)
    },
    //添加活动
    async addActivity() {
      const {data:res}= await this.$axios.post('activity/addActivity', this.addForm)
      if(!res.success){
        return this.$message.error('添加活动异常，请稍后重试！！！')
      }
      this.$message.success('添加活动成功！！！')
      this.$router.push('/activity')
    }
  }
}
</script.>
