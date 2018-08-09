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
              v-model="scope.row.mg_status"
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
    </el-card>
</template>

 <script>
 import axios from 'axios';
    export default {
      data () {
        return {
          fromdata: []
        }
      },
      created () {
        this.renderRequest();
      },
      methods:{
        async renderRequest () {
          // 获取token  并在请求头上设置Authorization=token
          var token = sessionStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = token;
          var response = await axios.get('http://localhost:8888/api/private/v1/users?pagenum=1&pagesize=10')
          console.log(response)

          var status = response.data.meta.status;
          if(status===200){
            this.fromdata = response.data.data.users;
          }
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
