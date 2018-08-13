<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="MBX">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格部分 -->
    <el-table
      :data="data"
      border
      stripe
      class="table"
      style="width: 100%">
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level===0+''">一级</span>
          <span v-else-if="scope.row.level===1+''">二级</span>
          <span v-else-if="scope.row.level===2+''">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      data: []
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('rights/list');
      console.log(res)
      const { meta: { status, msg}} = res.data;
      if(status === 200){
        this.data = res.data.data;
      }else{
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.table{
  margin-top: 20px;
}

</style>
