<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <!--<el-row>-->
      <!--<el-button type="primary" class="green-btn m-bt-20" size="small"  style="width: 120px" @click="handleCreate">添加用户角色</el-button>-->
      <!--</el-row>-->
      <tree-table :data="data" :evalFunc="func"  :expandAll="expandAll" border>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="btnRoleChildren" @click="createChildren(scope.row.id)">添加子角色</el-button>
            <el-button type="text" v-if="btnRoleDelete" @click="handleDelete(scope.row.id)">删除</el-button>
            <router-link class="link-type" v-if="btnRoleAccess" :to="'/permission/authallocate/'+scope.row.id">
              <el-button type="text">权限分配</el-button>
            </router-link>
          </template>
        </el-table-column>
      </tree-table>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="25%" center >
      <el-form  autoComplete="on" :model="roleForm" :rules="roleRule" ref="roleForm"  label-position="left" label-width="80px" >
        <el-input type="hidden" v-model="roleForm.id"></el-input>
        <el-form-item label="角色"  prop="name">
          <el-input v-model="roleForm.name" placeholder="请输角色" ></el-input>
        </el-form-item>
        <el-form-item label="角色名称"  prop="title">
          <el-input v-model="roleForm.title" placeholder="请输角色名称" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" class="green-btn" type="primary" @click="createData">创建</el-button>
        <el-button class="w-130" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { getRoleList, roleSave, roleDelete } from '@/api/permission'
  import { in_array } from '@/utils/index'

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
          create: '新建角色',
          createChildren: '新建子角色'
        },
        roleRule: {
          name: [{ required: true, message: '请输入角色(2~10个字符)', trigger: 'blur' },
            { min: 2, max: 10, message: '请输入角色(2~10个字符)', trigger: 'blur' }],
          title: [{ required: true, message: '请输入角色名称(2~10个字符)', trigger: 'blur' },
            { min: 2, max: 10, message: '请输入角色名称(2~10个字符)', trigger: 'blur' }]
        },
        roleForm: {
          id: '',
          name: '',
          title: '',
          pid: '',
          status: ''
        },
        btnRoleChildren: false,
        btnRoleDelete: false,
        btnRoleAccess: false
      }
    },
    created() {
      this.getButtonStatus()
      this.getList()
    },
    methods: {
      getList() {
        getRoleList().then(response => {
          if (response.code === 1) {
            this.data = response.data
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        })
      },
      handleResetForm() {
        this.roleForm.id = ''
        this.roleForm.name = ''
        this.roleForm.status = ''
        this.roleForm.pid = ''
      },
      handleCreate() {
        this.handleResetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      },
      createChildren(id) {
        this.edit = true
        this.roleForm.pid = id
        this.dialogStatus = 'createChildren'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
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
          roleDelete(data).then(response => {
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
      handleAccess() {
        this.$router.push({ path: '/permission/role' })
      },
      createData() {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            roleSave(this.roleForm).then(response => {
              if (response.code === 1) {
                this.$message({
                  title: '成功',
                  message: '创建成功！',
                  type: 'success',
                  duration: 3000
                })
                this.dialogFormVisible = false
                this.getList()
                this.$refs.roleForm.resetFields()
              }
            })
          }
        })
      },
      updateData() {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            roleSave(this.roleForm).then(response => {
              if (response.code === 1) {
                this.$message({
                  title: '成功',
                  message: '修改成功！',
                  type: 'success',
                  duration: 3000
                })
                this.dialogFormVisible = false
                this.getList()
                this.$refs.roleForm.resetFields()
              }
            })
          }
        })
      },
      getButtonStatus() {
        const btnList = this.$store.getters.buttons
        if (in_array('roleChildren', btnList)) {
          this.btnRoleChildren = true
        }
        if (in_array('roleDelete', btnList)) {
          this.btnRoleDelete = true
        }
        if (in_array('roleAccess', btnList)) {
          this.btnRoleAccess = true
        }
      }
    }
  }
</script>

