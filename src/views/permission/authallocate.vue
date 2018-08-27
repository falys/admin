<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <el-table
        :data="data"
        border
        :highlight-current-row="false"
        style="width: 100%">
        <el-table-column width="300">
          <template slot-scope="scope"  >
            <el-checkbox-group v-model="checkedNode">
              <el-checkbox :label="scope.row.id" >{{scope.row.title}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-checkbox-group v-if="scope.row.children" v-model="checkedNode" >
              <div v-for="node in scope.row.children">
                <dl>
                  <dt>
                    <el-checkbox  :label="node.id" :key="node.id">{{node.title}}</el-checkbox>
                  </dt>
                  <dd v-if="node.children">
                    <el-checkbox v-for="node1 in node.children" :disabed="btnDisabeld"  :label="node1.id" :key="node1.id">{{node1.title}}</el-checkbox>
                  </dd>
                </dl>
              </div>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0;width: 100%;text-align: center">
        <el-button class="green-btn w-100" size="small" type="primary" @click="handleSave" >分配权限</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
  import { getNodeList, getRoleNodelist, roleNodeSave } from '@/api/permission'

  export default {
    name: 'auth_allocate',
    data() {
      return {
        role_id: '',
        nodes: [],
        checkedNode: [],
        data: [],
        btnDisabeld: false
      }
    },
    created() {
      if (this.$route.params.role_id) {
        this.role_id = parseInt(this.$route.params.role_id)
      }
      this.getList()
      this.getCheckNode()
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
      getCheckNode() {
        const data = {}
        data.role_id = this.role_id
        getRoleNodelist(data).then(response => {
          if (response.code === 1) {
            this.checkedNode = response.data
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        })
      },
      handleSave() {
        const data = {}
        data.role_id = this.role_id
        data.nodes = this.checkedNode
        this.btnDisabeld = true
        roleNodeSave(data).then(response => {
          this.btnDisabeld = false
          if (response.code === 1) {
            this.$message({
              type: 'success',
              message: '分配成功!'
            })
            setTimeout(() => {
              window.location.reload()
            }, 1.5 * 1000)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .box-card{
    width:50%;
  }
  tr:hover>td {
    background-color: #ffffff!important;
  }
</style>
