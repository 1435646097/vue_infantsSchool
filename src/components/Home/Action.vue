<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 表格显示区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="queryInfo.level" @change="selectChang">
            <el-option label="请选择" :value="0"></el-option>
            <el-option label="一级权限" :value="1"></el-option>
            <el-option label="二级权限" :value="2"></el-option>
            <el-option label="三级权限" :value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input
            placeholder="请输入权限名称"
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
          <el-button type="primary" @click="addDialogVisible = true"
            >添加权限</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="actionList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="method" label="请求方式"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="级别">
          <template v-slot="scope">
            <el-tag type="primary" v-if="scope.row.level == 1">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 2"
              >二级权限</el-tag
            >
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAction(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteAction(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加权限对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="resetAddForm"
      >
        <el-alert
          title="注意：如果没有选择父级权限则添加的权限为一级权限"
          type="warning"
          show-icon
          center
        >
        </el-alert>
        <!-- 对话框主体 -->
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="父级权限" prop="pid">
            <el-cascader
              v-model="addForm.pid"
              :options="oneTwoActionTree"
              :props="actionOption"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="权限路径" prop="path">
            <el-input v-model="addForm.path"></el-input>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-select v-model="addForm.method" placeholder="请选择">
              <el-option label="GET" value="GET"> </el-option>
              <el-option label="POST" value="POST"> </el-option>
              <el-option label="DELETE" value="DELETE"> </el-option>
              <el-option label="PUT" value="PUT"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限图标" prop="icon">
            <el-input v-model="addForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="权限备注" prop="remark">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAction">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑权限对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="resetEditForm"
      >
        <el-alert
          title="注意：如果没有选择父级权限则添加的权限为一级权限"
          type="warning"
          :closable="false"
          show-icon
          center
        >
        </el-alert>
        <!-- 对话框主体 -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="父级权限" prop="pid">
            <el-cascader
              v-model="editForm.pid"
              :options="oneTwoActionTree"
              :props="actionOption"
              @change="changeCascader"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="权限路径" prop="path">
            <el-input v-model="editForm.path"></el-input>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-select v-model="editForm.method" placeholder="请选择">
              <el-option label="GET" value="GET"> </el-option>
              <el-option label="POST" value="POST"> </el-option>
              <el-option label="DELETE" value="DELETE"> </el-option>
              <el-option label="PUT" value="PUT"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限图标" prop="icon">
            <el-input v-model="editForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="权限备注" prop="remark">
            <el-input v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAction">确 定</el-button>
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
import _ from 'loadsh'
export default {
  data() {
    return {
      actionList: [],
      oneTwoActionTree: [],
      actionOption: {
        value: 'id',
        label: 'name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      queryInfo: {
        pageSize: 5,
        pageNum: 1,
        name: '',
        level: 0
      },
      totalCount: 0,
      addForm: {
        name: '',
        path: '',
        icon: '',
        pid: [],
        remark: '',
        method: ''
      },
      editForm: {},
      addFormRules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入权限路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入权限图标', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入权限备注', trigger: 'blur' }]
      },
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  methods: {
    //获取权限列表数据
    async getActionList() {
      const res = await this.$axios.get('Action/GetActionList', {
        params: this.queryInfo
      })
      const pagination = JSON.parse(res.headers['x-pagination'])
      this.totalCount = pagination.totalCount
      this.actionList = res.data.data
    },
    //获取所有的一级权限以及二级权限
    async getOneTwoActionTree() {
      const { data: res } = await this.$axios.get('Action/GetOneTwoActionTree')
      this.oneTwoActionTree = res.data
      console.log(this.oneTwoActionTree)
    },
    //重置添加表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    //添加权限
    addAction() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入完整的信息！')
        }
        const temp = _.cloneDeep(this.addForm)
        temp.level = temp.pid.length + 1
        temp.pid = temp.pid[temp.pid.length - 1]
        const { data: res } = await this.$axios.post('Action/AddAction', temp)
        if (!res.success) {
          return this.$message.error('添加异常，请稍后重试！')
        }
        this.$message.success('添加权限成功！')
        this.getActionList()
        this.getOneTwoActionTree()
        this.addDialogVisible = false
      })
    },
    //删除权限
    async deleteAction(row) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result != 'confirm') {
        return this.$message.info('您取消了本次操作')
      }
      const { data: res } = await this.$axios.delete(
        `Action/DeleteAction/${row.id}`
      )
      if (!res.success) {
        return this.$message.error('删除异常，请稍后重试！')
      }
      this.$message.success('删除成功！')
      this.getActionList()
      this.getOneTwoActionTree()
    },
    //当前pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getActionList()
    },
    //当前页改变
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum
      this.getActionList()
    },
    //下拉框改变时触发
    selectChang() {
      this.getActionList()
    },
    //点击搜索按钮时触发
    btnSearch() {
      this.getActionList()
    },
    //清楚输入框时触发
    clearInput() {
      this.getActionList()
    },
    //展示编辑权限的对话框
    async showEditAction(row) {
      //Action/GetActionById/17
      const { data: res } = await this.$axios.get(
        `Action/GetActionById/${row.id}`
      )
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //编辑对话框的级联选择器发生改变
    changeCascader() {
      if (!this.editForm.pid) {
        this.editForm.pid = 0
        return
      }
      this.editForm.level = this.editForm.pid.length + 1
      this.editForm.pid = this.editForm.pid[this.editForm.pid.length - 1]
    },
    //编辑权限
    editAction() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入完整的信息！')
        }
        const { data: res } = await this.$axios.put(
          'action/editAction',
          this.editForm
        )
        if (!res.success) {
          return this.$message.error('编辑权限异常，请稍后重试！')
        }
        this.$message.success('编辑权限成功！')
        this.editDialogVisible = false
        this.getActionList()
        this.getOneTwoActionTree()
      })
    },
    //重置权限表哦但
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    }
  },
  created() {
    this.getActionList()
    this.getOneTwoActionTree()
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
</style>
