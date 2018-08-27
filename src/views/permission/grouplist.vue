<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <tree-table :data="data" :evalFunc="func"  :expandAll="expandAll" border>
        <el-table-column label="用户组名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户组中文名">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" v-if="btnGroupChildren" @click="handleCreate(scope.row.id)">增加子用户组</el-button>
            <el-button type="text" v-if="btnGroupEdit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" v-if="btnGroupDelete" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="25%" center >
      <el-form  autoComplete="on" :model="groupForm" :rules="groupRules" ref="groupForm"  label-position="left" label-width="120px" >
        <el-input type="hidden" v-model="groupForm.id"></el-input>
        <el-form-item label="用户组名称"  prop="name">
          <el-input v-model="groupForm.name" :disabled="edit" placeholder="请输入用户组名称" ></el-input>
        </el-form-item>
        <el-form-item label="用户组中文名称"  prop="title">
          <el-input v-model="groupForm.title" placeholder="请输入用户组名称" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" class="green-btn" v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button size="small" class="green-btn" v-else type="primary" @click="updateData">修改</el-button>
        <el-button size="small" class="w-130" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { in_array } from '@/utils/index'
import { getGroupList, groupDelete, groupSave } from '@/api/permission'

export default {
  name: 'grouplist',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: true,
      data: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户组',
        create: '新建用户组'
      },
      groupRules: {
        name: [{ required: true, message: '请输入用户组名称(2~10个字符)', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入用户组名称(2~10个字符)', trigger: 'blur' }],
        title: [{ required: true, message: '请输入用户组中文名称(2~10个字符)', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入用户组中文名称(2~10个字符)', trigger: 'blur' }]
      },
      groupForm: {
        id: '',
        name: '',
        title: '',
        pid: ''
      },
      edit: false,
      btnGroupChildren: false,
      btnGroupEdit: false,
      btnGroupDelete: false
    }
  },
  created() {
    this.getList()
    this.getButtonStatus()
  },
  methods: {
    getList() {
      getGroupList().then(response => {
        if (response.code === 1) {
          this.data = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleResetForm() {
      this.groupForm.id = ''
      this.groupForm.name = ''
      this.groupForm.title = ''
      this.groupForm.pid = ''
    },
    handleCreate(id) {
      this.handleResetForm()
      this.groupForm.pid = id
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.edit = true
      this.groupForm.id = row.id
      this.groupForm.name = row.name
      this.groupForm.title = row.title
      this.groupForm.pid = row.pid
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.id = id
        groupDelete(data).then(response => {
          if (response.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createData() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          groupSave(this.groupForm).then(response => {
            if (response.code === 1) {
              this.$message({
                title: '成功',
                message: '创建成功！',
                type: 'success',
                duration: 3000
              })
              this.dialogFormVisible = false
              this.getList()
              this.$refs.tagForm.resetFields()
            }
          })
        }
      })
    },
    updateData() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          console.log(this.groupForm)
          groupSave(this.groupForm).then(response => {
            if (response.code === 1) {
              this.$message({
                title: '成功',
                message: '修改成功！',
                type: 'success',
                duration: 3000
              })
              this.dialogFormVisible = false
              this.getList()
              this.$refs.groupForm.resetFields()
            }
          })
        }
      })
    },
    getButtonStatus() {
      const btnList = this.$store.getters.buttons
      if (in_array('groupChildren', btnList)) {
        this.btnGroupChildren = true
      }
      if (in_array('groupEdit', btnList)) {
        this.btnGroupEdit = true
      }
      if (in_array('groupDelete', btnList)) {
        this.btnGroupDelete = true
      }
    }
  }
}
</script>

<style scoped>

</style>
