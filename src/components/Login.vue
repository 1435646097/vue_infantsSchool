<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 图片区域 -->
        <img src="../assets/infants.jpg" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFromRules"
        label-width="70px"
        ref="loginForm"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="account" label="账号">
          <el-input
            v-model="loginForm.account"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwd" label="密码">
          <el-input
            v-model="loginForm.pwd"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha" label="验证码">
          <el-row>
            <el-col :span="15" style="margin-right:20px">
              <el-input v-model="loginForm.captcha"></el-input>
            </el-col>
            <el-col :span="4">
              <img src="" ref="vcode" @click="clickImg" />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginFormSubmit">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单所绑定的数据
      loginForm: {
        account: '',
        pwd: '',
        captcha: ''
      },
      //登录表单的校验规则
      loginFromRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    loginFormReset() {
      //重置登录表单
      this.$refs.loginForm.resetFields()
    },
    loginFormSubmit() {
      //提交登录表单
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入用户名或密码')
        }
        this.loginForm.cId = window.sessionStorage.getItem('cId')
        const { data: res } = await this.$axios.post(
          'Login/Login',
          this.loginForm
        )
        if (!res.success) {
          this.getvCode()
          return this.$message.error(res.msg)
        }
        this.$message.success('登录成功！！！')
        window.sessionStorage.setItem('token', res.data)
        this.$router.push('/home')
      })
    },
    async getvCode() {
      const { data: res } = await this.$axios.get('Login/GetVCode')
      window.sessionStorage.setItem('cId', res.data.cId)
      this.$refs.vcode.src = res.data.image
    },
    async clickImg() {
      this.getvCode()
    }
  },
  created() {
    this.getvCode()
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  height: 350px;
  width: 450px;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    img {
      widows: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
