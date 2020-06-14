<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加搜索区域 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加班级</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格数据显示区域 -->
      <el-table :data="gradeList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="班级名称"></el-table-column>
        <el-table-column
          prop="teacherName"
          label="班级负责人"
        ></el-table-column>
        <el-table-column prop="phone" label="负责人电话"></el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGrade(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加班级的对话框 -->
      <el-dialog
        title="添加班级"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="resetAddForm"
      >
        <!-- 主体区域 -->
        <el-form
          ref="addFormRef"
          :rules="addFormRule"
          :model="addForm"
          label-width="80px"
        >
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="userId">
            <el-select
              v-model="addForm.userId"
              placeholder="请选择负责人"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in teacherList"
                :key="item.id"
              ></el-option>
            </el-select> </el-form-item
        ></el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGrade">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑班级的对话框 -->
      <el-dialog title="添加班级" :visible.sync="editDialogVisible" width="50%">
        <!-- 主体区域 -->
        <el-form
          ref="editFormRef"
          :rules="addFormRule"
          :model="editForm"
          label-width="80px"
        >
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="userId">
            <el-select
              v-model="editForm.userId"
              placeholder="请选择负责人"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in teacherList"
                :key="item.id"
              ></el-option>
            </el-select> </el-form-item
        ></el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGrade">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gradeList: [],
      teacherList: [],
      addForm: {
        name: '',
        userId: ''
      },
      editForm: {},
      addFormRule: {
        name: { required: true, message: '班级名称不能为空',trigger:'blur' },
        userId: {
          required: true,
          message: '请选择班级负责人',
          trigger: 'change'
        }
      },
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  methods: {
    //获取班级信息
    async getGradeList() {
      const { data: res } = await this.$axios.get('grade')
      if (!res.success) {
        return this.$message.error('获取班级列表失败，请稍后重试！！！')
      }
      this.gradeList = res.data
      console.log(this.gradeList)
    },
    //获取老师信息
    async getTeacherList() {
      const { data: res } = await this.$axios.get('user/teacher')
      this.teacherList = res.data
    },
    //添加班级
    addGrade() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完善的信息！！！')
        }
        const { data: res } = await this.$axios.post('grade', this.addForm)
        this.getGradeList()
        this.$message.success('添加班级成功！！！')
        this.addDialogVisible = false
      })
    },
    //重置添加表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields()
    },
    //删除班级
    async deleteGrade(row) {
      const result = await this.$confirm(
        '此操作将永久删除该班级, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result != 'confirm') {
        return this.$message.info('您取消了本次操作！！！')
      }
      const { data: res } = await this.$axios.delete(`grade/${row.id}`)
      if (!res.success) {
        return this.$message.error('删除异常，请稍后重试！！！')
      }
      this.getGradeList()
      this.$message.success('删除成功！！！')
    },
    //展示编辑班级的对话框
    async showEditDialog(row) {
      const { data: res } = await this.$axios.get(`grade/${row.id}`)
      console.log(res.data)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //编辑班级
    editGrade() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完善的信息！！！')
        }
        const { data: res } = await this.$axios.put('grade', this.editForm)
        this.getGradeList()
        this.$message.success('编辑班级成功！！！')
        this.editDialogVisible = false
      })
    }
  },
  created() {
    this.getGradeList()
    this.getTeacherList()
  }
}
</script>
