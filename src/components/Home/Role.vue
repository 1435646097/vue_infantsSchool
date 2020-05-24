<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加区域 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddDialog">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格显示区域 -->
    <el-table :data="roleList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column prop="isDelete" label="角色状态">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isDelete"
            active-color="#ff4949"
            inactive-color="#13ce66"
            @change="editStatus(scope.row)"
          >
          </el-switch>
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
            @click="deleteRole(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showActionDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的dialog -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的dialog -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置权限区域 -->
    <el-dialog
      title="设置角色权限"
      :visible.sync="setActionDialogVisible"
      width="50%"
      @close="resetAction()"
    >
      <!-- 对话框的主体部分 -->
      <el-tree
        :data="actionList"
        :props="actionProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="delKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 对话框的底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setActionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleAction()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'role',
  data() {
    return {
      roleList: [],
      actionList: [],
      actionProps: {
        children: 'children',
        label: 'name'
      },
      delKeys: [],
      roleId: 0,
      addForm: {
        name: '',
        remark: '',
        isDelete: false
      },
      editForm: {},
      addFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入角色备注', trigger: 'blur' }]
      },
      editFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入角色备注', trigger: 'blur' }]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      setActionDialogVisible: false
    }
  },
  methods: {
    //获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$axios.get('role')
      this.roleList = res.data
    },
    //获取角色权限
    async getActionList() {
      const { data: res } = await this.$axios.get('action/GetActionTree')
      this.actionList = res.data
      console.log(this.actionList)
    },
    //修改角色状态
    async editStatus(row) {
      const { data: res } = await this.$axios.put('role', row)
      if (!res.success) {
        return this.$message.error('修改状态失败,请稍后重试！')
      }
      this.$message.success('修改角色状态成功！')
      this.getRoleList()
    },
    //展示添加角色的对话框
    async showAddDialog(row) {
      this.addDialogVisible = true
    },
    //监听添加角色对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完善的信息！')
        }
        const { data: res } = await this.$axios.post('role', this.addForm)
        if (!res.success) {
          return this.$message.error('添加角色失败,请稍后重试！')
        }
        this.$message.success('添加角色成功！')
        this.getRoleList()
        this.addDialogVisible = false
      })
    },
    //显示编辑角色得对话框
    async showEditDialog(row) {
      const { data: res } = await this.$axios.get(`role/${row.id}`)
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //编辑角色
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完善的信息！')
        }
        const { data: res } = await this.$axios.put('role', this.editForm)
        if (!res.success) {
          return this.$message.error('编辑角色失败,请稍后重试！')
        }
        this.$message.success('编辑角色成功！')
        this.getRoleList()
        this.editDialogVisible = false
      })
    },
    //重置编辑角色得对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //删除角色
    async deleteRole(row) {
      const result = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$axios.delete(`role/${row.id}`)
      if (!res.success) {
        return this.$message.erroe('删除异常，请稍后重试！')
      }
      this.$message.success('删除成功！')
      this.getRoleList()
    },
    //展示角色权限
    async showActionDialog(row) {
      const { data: res } = await this.$axios.get('Action/GetActionByRoleId', {
        params: { id: row.id }
      })
      this.delKeys = res.data
      this.roleId = row.id
      this.setActionDialogVisible = true
    },
    //重置角色权限
    resetAction() {
      //重置树的选中节点
      this.$refs.treeRef.setCheckedKeys([])
    },
    //设置角色权限
    async setRoleAction() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$axios.post(
        `action/setActionByRoleId/${this.roleId}`,
        keys
      )
      if (!res.success) {
        return this.$message.error('设置角色权限异常，请稍后重试！')
      }
      this.$message.success('设置角色权限成功！')
      this.setActionDialogVisible = false
    }
  },
  created() {
    this.getRoleList()
    this.getActionList()
  }
}
</script>
