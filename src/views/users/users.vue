<template>
    <el-card class="card">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" class="input-with-select">
       <el-button class="searchBtn" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>成功按钮</el-button>
    <!-- 表格部分 -->
      <el-table
        stripe
        border
        :data="fromdata"
        style="width: 100%">
        <el-table-column
        type="index" >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="success" icon="el-icon-check" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
   
    <!-- 分页部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[2, 4, 6, 8]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>  
    </el-card>
</template>

 <script>
 import axios from 'axios';
    export default {
      data () {
        return {
          // 用户列表数据
          fromdata: [],
          // 分页部分数据
          // 当前页码
          currentPage:1,
          // 总共数据的条数
          totalPage:0,
          // 每页显示的条数
          pageSize:2
        }
      },
      created () {
        this.renderRequest();
      },
      methods:{
        // 请求页面数据
        async renderRequest () {
          // 获取token  并在请求头上设置Authorization=token
          var token = sessionStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = token;
          var response = await axios.get
            (`http://localhost:8888/api/private/v1/users?pagenum=${this.currentPage}&pagesize=${this.pageSize}`);
          console.log(response)

          var status = response.data.meta.status;
          if(status===200){
            this.fromdata = response.data.data.users;
            // 总共的条数
            this.totalPage = response.data.data.total;
          }else{
            this.$message.error(response.data.meta.msg)
          }
        },
        // 当页面条数发生变化时
        // val指的是页面条数发生变化时所对应的条数
        handleSizeChange (val) {
          this.pageSize = val;
          this.renderRequest();
          console.log(val)
        },
        // 当当前页码发生变化时
        // val指的是页码发生变化时所对应的页码
        handleCurrentChange (val) {
          this.currentPage = val;
          this.renderRequest();
          console.log(val)
        }
      }
    }
  </script>

<style>
.input-with-select{
  width: 300px;
  margin:10px 0;
}
</style>
