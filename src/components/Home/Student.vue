<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索过滤区域 -->
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
          placeholder="请输入学生名称"
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
          >添加学生</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格数据显示区域 -->
    <el-table :data="studentList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column label="生日">
        <template v-slot="scope">
          {{ scope.row.birthday | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="gradeName" label="班级"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDailog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteStudent(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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

    <!-- 添加学生的对话框 -->
    <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%">
      <!-- 对话框的主体 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRule"
        label-width="80px"
      >
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="addForm.gender" :label="true">男</el-radio>
          <el-radio v-model="addForm.gender" :label="false">女</el-radio>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" :editable="false">
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
        <el-form-item label="班级">
          <el-select v-model="addForm.gradeId" @change="selectChang">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in gradeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 对话框的底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑学生的对话框 -->
    <el-dialog title="编辑学生" :visible.sync="editDialogVisible" width="50%">
      <!-- 对话框的主体 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRule"
        label-width="80px"
      >
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="editForm.gender" :label="true">男</el-radio>
          <el-radio v-model="editForm.gender" :label="false">女</el-radio>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" :editable="false">
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
        <el-form-item label="班级">
          <el-select v-model="editForm.gradeId" @change="selectChang">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in gradeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 对话框的底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStudent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentList: [],
      gradeList: [],
      queryInfo: {
        pageSize: 5,
        pageNum: 1,
        name: '',
        gradeId: 0
      },
      addForm: {
        name: '',
        gender: true,
        birthday: '',
        gradeId: 0
      },
      editForm: {},
      addFormRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }]
      },
      totalCount: 0,
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  created() {
    this.getGradeList()
  },
  methods: {
    //获取学生信息
    async getStudentList() {
      const res = await this.$axios.get('Student/GetStudents', {
        params: this.queryInfo
      })
      const pagination = JSON.parse(res.headers['x-pagination'])
      this.totalCount = pagination.totalCount
      this.studentList = res.data.data
    },
    //获取班级信息
    async getGradeList() {
      const { data: res } = await this.$axios.get('Student/GetGradesInfo')
      this.gradeList = res.data
      this.queryInfo.gradeId = this.gradeList[0].id
      this.addForm.gradeId = this.gradeList[0].id
      this.getStudentList()
    },
    //下拉框改变时触发
    selectChang() {
      this.getStudentList()
    },
    //清空搜索框的input时触发
    clearInput() {
      this.getStudentList()
    },
    //点击搜索按钮时触发
    btnSearch() {
      this.getStudentList()
    },
    //当前pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getStudentList()
    },
    //当前页改变
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum
      this.getStudentList()
    },
    //删除学生
    async deleteStudent(row) {
      const result = await this.$confirm(
        '此操作将永久删除该学生, 是否继续?',
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
        `Student/DeleteStudent/${row.id}`
      )
      if (!res.success) {
        return this.$message.error('删除异常，请联系管理员')
      }
      this.$message.success('删除成功！！！')
      this.getStudentList()
    },
    //添加学生
    addStudent() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写好完善的信息')
        }
        const { data: res } = await this.$axios.post(
          'Student/AddStudent',
          this.addForm
        )
        this.$message.success('添加学生成功')
        this.addDialogVisible = false
        this.getStudentList()
      })
    },
    //展示编辑学生的对话框
    async showEditDailog(row) {
      const { data: res } = await this.$axios.get(
        `Student/GetStudentById/${row.id}`
      )
      this.editForm = res.data
      this.editForm.gender = this.editForm.gender == '男' ? true : false
      this.editForm.gradeId = this.queryInfo.gradeId
      this.editDialogVisible = true
    },
    //编辑学生信息
    editStudent() {
      console.log(this.editForm)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填入完善的信息')
        }
        const { data: res } = await this.$axios.put(
          'student/editStudent',
          this.editForm
        )
        this.$message.success('修改学生信息成功！！！')
        this.getStudentList()
        this.editDialogVisible = false
      })
    }
  }
}
</script>
