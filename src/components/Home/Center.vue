<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        ref="formRef"
        :rules="formRule"
        :model="userInfo"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="userInfo.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="userInfo.gender" :label="true">男</el-radio>
          <el-radio v-model="userInfo.gender" :label="false">女</el-radio>
        </el-form-item>
        <el-form-item label="头像" prop="photo">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:5000/api/photo/uploadImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headerObject"
            :drag="true"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" :editable="false">
          <el-date-picker
            type="date"
            placeholder="选择生日"
            v-model="userInfo.birthday"
            style="width: 30%;"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
            ></el-date-picker
          >
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-cascader
            v-model="userInfo.address"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressDetail">
          <el-input type="textarea" v-model="userInfo.addressDetail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editUserInfo">更新</el-button>
          <el-button @click="resetInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import citydata from './citydata'
import bus from '../bus'
export default {
  data() {
    return {
      userInfo: {},
      formRule: {},
      headerObject: {
        authorization: ''
      },
      citydata
    }
  },
  methods: {
    //获取用户自己的数据
    async getSelfInfo() {
      const { data: res } = await this.$axios.get('user/self')
      this.userInfo = res.data
      this.userInfo.address = res.data.address.split(',')
    },
    //重置用户信息
    resetInfo() {
      this.getSelfInfo()
    },
    //编辑用户信息
    async editUserInfo() {
      const temp = _.cloneDeep(this.userInfo)
      temp.address = temp.address.join(',')
      const { data: res } = await this.$axios.put('user', temp)
      if (!res.success) {
        return this.$message.error('更新用户数据异常，请稍后重试！！！')
      }
      this.$message.success('更新信息成功！！！')
      bus.$emit('changeInfo', this.userInfo)
      this.getSelfInfo()
    },
    //图片上传成功后
    handleAvatarSuccess(res, file) {
      console.log(file)
      if (!res.success) {
        console.log('sss')
        return this.$message.error(res.msg)
      }
      this.userInfo.photo = 'http://localhost:5000/' + res.data
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
    }
  },
  created() {
    this.headerObject.authorization = window.sessionStorage.getItem('token')
    this.getSelfInfo()
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 360px;
  height: 178px;
  display: block;
}
</style>
