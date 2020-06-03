<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加搜索区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格数据区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column
          prop="account"
          label="账号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          width="200"
        ></el-table-column>
        <el-table-column prop="birthday" label="生日" width="150">
          <template v-slot="scope">
            {{ scope.row.birthday | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="地址" width="200">
          <template v-slot="scope">
            <el-popover trigger="hover" placement="top">
              <p>详细住址: {{ scope.row.addressDetail }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.address }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRole(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addFromReset"
      >
        <el-alert
          title="注意：添加完用户密码默认为:123456"
          type="warning"
          :closable="false"
          show-icon
          center
        >
        </el-alert>
        <!-- 对话框主体 -->
        <el-form
          ref="addFormRef"
          :rules="addFormRule"
          :model="addForm"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              type="date"
              placeholder="选择生日"
              v-model="addForm.birthday"
              style="width: 30%;"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
              ></el-date-picker
            >
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-cascader
              v-model="addForm.address"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressDetail">
            <el-input
              type="textarea"
              v-model="addForm.addressDetail"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%">
        <!-- 对话框主体 -->
        <el-form
          ref="editFormRef"
          :rules="addFormRule"
          :model="editForm"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="editForm.account"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              type="date"
              placeholder="选择生日"
              v-model="editForm.birthday"
              style="width: 30%;"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
              ></el-date-picker
            >
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-cascader
              v-model="editForm.address"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressDetail">
            <el-input
              type="textarea"
              v-model="editForm.addressDetail"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配用户角色对话框 -->
      <el-dialog
        title="分配角色权限"
        :visible.sync="setRoleDialogVisible"
        @close="resetCheckBox"
        width="50%"
      >
        <!-- 对话框主体 -->
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            :label="item.id"
            v-for="item in normalRoleList"
            :key="item.id"
            border
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setUserRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import citydata from './citydata'
import _ from 'loadsh'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      var rex = /^([1][3,4,5,6,7,8,9])\d{9}$/
      if (rex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }
    return {
      userList: [],
      roleList: [],
      checkList: [],
      userId: 0,
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
        name: ''
      },
      totalCount: 0,
      addForm: {
        name: '',
        account: '',
        phone: '',
        birthday: '',
        address: '',
        addressDetail: ''
      },
      editForm: {},
      addFormRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
        address: [{ required: true, message: '请选择地址', trigger: 'blur' }]
      },
      citydata,
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false
    }
  },
  methods: {
    //获取用户列表数据
    async getUserList() {
      const res = await this.$axios.get('user', {
        params: this.queryInfo
      })
      if (!res.data.success) {
        return this.$messsage.error('获取用户列表失败，请稍后重试！')
      }
      res.data.data.forEach((element) => {
        element.address = element.address.split(',').join('')
      })
      this.totalCount = JSON.parse(res.headers['x-pagination']).totalCount
      this.userList = res.data.data
    },
    async getRoleList() {
      const { data: res } = await this.$axios.get('role')
      this.roleList = res.data
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完整的信息')
        }
        this.addForm.pwd = '123456'
        const temp = _.cloneDeep(this.addForm)
        temp.address = temp.address.join(',')
        const { data: res } = await this.$axios.post('user', temp)
        if (!res.success) {
          return this.$message.error(res.msg)
        }
        this.$message.success('添加用户成功')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    //重置添加表单
    addFromReset() {
      this.$refs.addFormRef.resetFields()
    },
    //删除用户
    async deleteUser(row) {
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result != 'confirm') {
        return this.$message.info('取消了删除操作')
      }
      const { data: res } = await this.$axios.delete(`user/${row.id}`)
      if (!res.success) {
        return this.$message.erroe('删除异常，请稍后重试！')
      }
      this.$message.success('删除成功！')
      this.getUserList()
    },
    //展示编辑用户的对话框
    async showEditDialog(row) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get(`user/${row.id}`)
      this.editForm = res.data
      this.editForm.address = res.data.address.split(',')
    },
    //编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完整的信息')
        }
        this.editForm.pwd = '123456'
        const temp = _.cloneDeep(this.editForm)
        temp.address = temp.address.join(',')
        const { data: res } = await this.$axios.put('user', temp)
        if (!res.success) {
          return this.$message.error(res.msg)
        }
        this.$message.success('编辑用户成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    //当前pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    //当前页改变
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum
      this.getUserList()
    },
    //展示为用户设置角色的对话框
    async showSetRole(row) {
      const { data: res } = await this.$axios.get(`userRole/${row.id}`)
      res.data.forEach((element) => {
        this.checkList.push(element.roleId)
      })
      this.userId = row.id
      this.setRoleDialogVisible = true
    },
    //重置用户设置角色的对话框
    resetCheckBox() {
      this.checkList = []
    },
    //设置用户角色
    async setUserRole() {
      const { data: res } = await this.$axios.post(
        `userRole/${this.userId}`,
        this.checkList
      )
      if (!res.success) {
        return this.$message.error('设置用户角色异常，请稍后重试！！')
      }
      this.$message.success('设置用户角色成功！！')
      this.setRoleDialogVisible = false
    }
  },
  created() {
    this.getRoleList()
    this.getUserList()
  },
  computed: {
    normalRoleList() {
      return this.roleList.filter((item) => item.isDelete == false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
</style>
