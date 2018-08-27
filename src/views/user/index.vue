<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <div class="chart-filter">
        <el-button class="green-btn w-100" size="small" v-if="btnUserAdd" type="primary" @click="handleCreate" >新增用户</el-button>
      </div>
      <el-table :data="list"  element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label='时间' align="center">
          <template slot-scope="scope">
            {{scope.row.created_at}}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">
            {{scope.row.phone}}
          </template>
        </el-table-column>
        <el-table-column label="email" align="center">
          <template slot-scope="scope">
            {{scope.row.email}}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center">
          <template slot-scope="scope">
            {{scope.row.status_str}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.status==0" size="mini" class="green-btn-min"  @click="handleEnable(scope.row)">启用</el-button>
            <el-button type="primary" v-else="scope.row.status==1"size="mini" class="green-btn-min"  @click="handleEnable(scope.row)">禁用</el-button>
            <el-button type="primary" size="mini" class="green-btn-min" @click="handleDelete(scope.row.id)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog
      title="新增用户"
      :visible.sync="showDialog"
      width="25%"
      center>
      <el-form center :model="userForm"  ref="userForm" :rules="userRules" label-position="left" label-width="120px">
        <el-form-item label="手机号码"  prop="phone" >
          <el-input size="small" v-model="userForm.phone" style="width: 230px;"></el-input>
        </el-form-item>
        <el-form-item label="用户名"  prop="username" >
          <el-input size="small" v-model="userForm.username" style="width: 230px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址"  prop="username" >
          <el-input size="small" v-model="userForm.email" style="width: 230px;"></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="group_id" >
          <el-select  size="small" style="width: 230px;"  v-model="userForm.group_id" filterable placeholder="选择用户组">
            <el-option v-for="item in  groupOptions" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="group_id" >
          <el-select  size="small" style="width: 230px;"  v-model="userForm.role_id" filterable placeholder="选择用户角色">
            <el-option v-for="item in  roleOptions" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" >
          <el-input type="password"  size="small" placeholder="请输入密码" style="width: 230px;" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" >
          <el-input type="password"  size="small" placeholder="确认密码" style="width: 230px;" v-model="userForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createUser">确 定</el-button>
        <el-button @click="showDialog=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, userStore, statusChange, userDelete } from '@/api/user'
import { validateMobile, validateEmail } from '@/utils/validate'
import { groupOptionsList } from '@/api/group'
import { roleOptionsList } from '@/api/role'
import { in_array } from '@/utils/index'

export default {
  name: 'index',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateEmailAddr = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      groupOptions: [],
      roleOptions: [],
      showDialog: false,
      userForm: {
        'phone': '',
        'username': '',
        'email': '',
        'group_id': '',
        'role_id': '',
        'password': '',
        'checkPass': ''
      },
      userRules: {
        phone: [{ required: true, message: '请输入正确的手机号', trigger: 'blur', validator: validatePhone }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmailAddr }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        checkPass: [{ required: true, trigger: 'blur', validator: validatePass1 }],
        group_id: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        role_id: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
      },
      btnUserAdd: false,
      btnReview: false,
      btnStatusChange: false
    }
  },
  created() {
    this.getList()
    this.getGroupOptions()
    this.getRoleOptions()
  },
  methods: {
    handleCreate() {
      this.showDialog = true
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleEnable(row) {
      var strMsg = ''
      var strStatus = ''
      const data = {}
      data.userid = row.id
      if (row.status === 0) {
        data.status = 1
        strMsg = '启用成功'
        strStatus = '启用'
      } else if (row.status === 1) {
        data.status = 0
        strMsg = '禁用成功'
        strStatus = '禁用'
      }
      statusChange(data).then(response => {
        if (response.code === 1) {
          for (const v of this.list) {
            if (v.id === row.id) {
              const index = this.list.indexOf(v)
              row.status = data.status
              row.status_str = strStatus
              this.list.splice(index, 1, row)
              break
            }
          }
          this.$message({
            title: '成功',
            message: strMsg,
            type: 'success',
            duration: 3000
          })
        } else {
          setTimeout(() => {
            this.$message.error(response.msg)
          }, 3 * 1000)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.userid = id
        userDelete(data).then(response => {
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code === 1) {
          this.total = response.data.total
          this.list = response.data.list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    getGroupOptions() {
      groupOptionsList().then(response => {
        if (response.code === 1) {
          this.groupOptions = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    getRoleOptions() {
      roleOptionsList().then(response => {
        if (response.code === 1) {
          this.roleOptions = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    createUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          userStore(this.userForm).then(response => {
            if (response.code === 1) {
              this.$message({
                title: '成功',
                message: '创建成功！',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getList()
              this.$refs.userForm.resetFields()
            }
          })
        }
      })
    },
    getButtonStatus() {
      const btnList = this.$store.getters.buttons
      if (in_array('userAdd', btnList)) {
        this.btnUserAdd = true
      }
      if (in_array('userReview', btnList)) {
        this.btnReview = true
      }
      if (in_array('enable_disable', btnList)) {
        this.btnStatusChange = true
      }
    }

  }
}
</script>

<style scoped>

</style>
