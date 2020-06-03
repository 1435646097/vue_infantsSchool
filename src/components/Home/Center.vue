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
        return this.$message.erro('更新用户数据异常，请稍后重试！！！')
      }
      this.$message.success('更新信息成功！！！')
      bus.$emit('changeName', this.userInfo.name)
      this.getSelfInfo()
    }
  },
  created() {
    this.getSelfInfo()
  }
}
</script>
