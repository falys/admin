<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <el-row>
        <el-button type="primary" class="green-btn m-bt-20" size="small"  style="width: 120px" @click="handleCreate">添加用户角色</el-button>
      </el-row>
      <tree-table :data="data" :evalFunc="func"  :expandAll="expandAll" border>
        <el-table-column label="ID">
          <template slot-scope="scope">
            <span style="color:sandybrown">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户组名称">
          <template slot-scope="scope">
            <span style="color:sandybrown">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="text" @click="handleAccess">权限分配</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  autoComplete="on" :model="roleForm" :rules="roleRule" ref="roleForm"  label-position="left" label-width="80px" >
        <el-input type="hidden" v-model="roleForm.id"></el-input>
        <el-form-item label="角色名称"  prop="name">
          <el-input v-model="roleForm.name" placeholder="请输角色名称" ></el-input>
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

  export default {
    name: 'grouplist',
    components: { treeTable },
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        data: {
          id: 1,
          name: '系统管理员',
          children: [{
            id: 2,
            name: '操作员'
          },
          {
            id: 2,
            name: '普通用户'
          }]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑角色',
          create: '新建角色'
        },
        roleRule: {
          name: [{ required: true, message: '请输入用户组角色名称', trigger: 'blur' },
            { min: 1, max: 16, message: '长度在1到16中文字', trigger: 'blur' }]
        },
        roleForm: {
          id: '',
          name: ''
        }
      }
    },
    methods: {
      handleCreate() {
        console.log('create')
      },
      handleAccess() {
        console.log('create')
      },
      handleUpdate(row) {
        console.log('update')
      },
      handleDelete(id) {
        console.log('delete')
      },
      createData() {
        console.log('create')
      },
      updateData() {
        console.log('update')
      }
    }
  }
</script>

