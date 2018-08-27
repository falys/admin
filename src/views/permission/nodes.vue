<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <el-row>
        <el-button type="primary" class="green-btn m-bt-20" size="small"  style="width: 120px" @click="handleCreate">添加权限节点</el-button>
      </el-row>
      <tree-table :data="data" :evalFunc="func"  :expandAll="expandAll" border>
        <el-table-column label="节点">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="节点名称">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="URL">
          <template slot-scope="scope">
            <span>{{scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="节点类型">
          <template slot-scope="scope">
            <span>{{scope.row.level_str}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" v-if="btnNodeChildren" @click="createChildren(scope.row.id)">添加子节点</el-button>
            <el-button type="text" v-if="btnNodeEdit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" v-if="btnRoleDelete" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="25%" center>
      <el-form  autoComplete="on" :model="nodeForm" :rules="nodeRule" ref="nodeForm"  label-position="left" label-width="80px" >
        <el-input type="hidden" v-model="nodeForm.id"></el-input>
        <el-form-item label="节点"  prop="name">
          <el-input size="small" v-model="nodeForm.name" :disabled="edit" placeholder="请输节点" ></el-input>
        </el-form-item>
        <el-form-item label="节点名称"  prop="title">
          <el-input size="small" v-model="nodeForm.title" placeholder="请输节点名称" ></el-input>
        </el-form-item>
        <el-form-item label="URL"  prop="url">
          <el-input size="small" v-model="nodeForm.url" placeholder="请输URL" ></el-input>
        </el-form-item>
        <el-form-item label="节点类型"  prop="level">
          <el-select  size="small" style="width: 350px;"  v-model="nodeForm.level" filterable placeholder="选择终端类型">
            <el-option v-for="item in  levelOptions" :key="item.key" :label="item.text" :value="item.key">
            </el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  import { getNodeList, nodeSave, nodeDelete } from '@/api/permission'
  import { in_array } from '@/utils/index'

  export default {
    name: 'node',
    components: { treeTable },
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        data: [],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑权限',
          create: '新建权限'
        },
        nodeRule: {
          name: [{ required: true, message: '请输入节点(2~20个字符)', trigger: 'blur' },
            { min: 2, max: 20, message: '请输入节点(2~20个字符)', trigger: 'blur' }],
          title: [{ required: true, message: '请输节点名称(2~20个字符)', trigger: 'blur' },
            { min: 2, max: 20, message: '请输节点名称(2~20个字符)', trigger: 'blur' }]
        },
        nodeForm: {
          id: '',
          name: '',
          title: '',
          url: '',
          sort: '',
          pid: '',
          level: ''
        },
        levelOptions: [
          { key: 1, text: '导航菜单' },
          { key: 2, text: '按钮' }
        ],
        edit: false,
        btnNodeChildren: false,
        btnNodeEdit: false,
        btnRoleDelete: false
      }
    },
    created() {
      this.getButtonStatus()
      this.getList()
    },
    methods: {
      getList() {
        getNodeList().then(response => {
          if (response.code === 1) {
            this.data = response.data
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        })
      },
      handleResetForm() {
        this.nodeForm.id = ''
        this.nodeForm.name = ''
        this.nodeForm.title = ''
        this.nodeForm.url = ''
        this.nodeForm.sort = ''
        this.nodeForm.pid = ''
        this.nodeForm.level = ''
        this.nodeForm.status = ''
      },
      handleCreate(id) {
        this.handleResetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['nodeForm'].clearValidate()
        })
      },
      createChildren(id) {
        this.edit = false
        this.handleResetForm()
        this.nodeForm.pid = id
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['nodeForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.edit = true
        this.nodeForm.id = row.id
        this.nodeForm.name = row.name
        this.nodeForm.title = row.title
        this.nodeForm.url = row.url
        this.nodeForm.sort = row.sort
        this.nodeForm.pid = row.pid
        this.nodeForm.level = row.level
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['nodeForm'].clearValidate()
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
          nodeDelete(data).then(response => {
            if (response.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.expandAll = true
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
        this.$refs.nodeForm.validate(valid => {
          if (valid) {
            nodeSave(this.nodeForm).then(response => {
              if (response.code === 1) {
                this.$message({
                  title: '成功',
                  message: '创建成功！',
                  type: 'success',
                  duration: 3000
                })
                this.expandAll = true
                this.dialogFormVisible = false
                this.getList()
                this.$refs.nodeForm.resetFields()
              }
            })
          }
        })
      },
      updateData() {
        this.$refs.nodeForm.validate(valid => {
          if (valid) {
            console.log(this.nodeForm)
            nodeSave(this.nodeForm).then(response => {
              if (response.code === 1) {
                this.$message({
                  title: '成功',
                  message: '修改成功！',
                  type: 'success',
                  duration: 3000
                })
                this.expandAll = true
                this.dialogFormVisible = false
                this.getList()
                this.$refs.nodeForm.resetFields()
              }
            })
          }
        })
      },
      getButtonStatus() {
        const btnList = this.$store.getters.buttons
        if (in_array('nodeChildren', btnList)) {
          this.btnNodeChildren = true
        }
        if (in_array('nodeDelete', btnList)) {
          this.btnRoleDelete = true
        }
        if (in_array('nodeEdit', btnList)) {
          this.btnNodeEdit = true
        }
      }
    }
  }
</script>

