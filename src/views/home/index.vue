<template>
  <div class="app-container">
    <el-row class="row bg-white">
      <h1>欢迎进入管理后台</h1>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>
