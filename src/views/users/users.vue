<template>
    <el-card class="card">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索框 -->
      <el-input clearable placeholder="请输入内容" class="input-with-select" v-model="serachValue">
       <el-button class="searchBtn" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <el-button type="success" plain @click= "AddDialogFormVisible=true" >添加用户</el-button>
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
            <!-- scope.row绑定的当前所属的数据对象 -->
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
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                <el-button type="success" icon="el-icon-check" size="mini"></el-button>
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
      <!-- 添加弹出框 -->
      <el-dialog title="添加用户" :visible.sync="AddDialogFormVisible">
        <el-form
        :model="form" 
        :rules="rules"
        ref="formRules"
        label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddUser">确 定</el-button>
        </div>
      </el-dialog>
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
      currentPage: 1,
      // 总共数据的条数
      totalPage: 0,
      // 每页显示的条数
      pageSize: 2,

      // 用户搜索的内容
      serachValue: '',

      // 添加用户部分
      // 添加数据中的绑定的数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      AddDialogFormVisible: false,
      // 添加表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.renderRequest();
  },
  methods: {
    // 请求页面数据
    async renderRequest () {
      // 获取token  并在请求头上设置Authorization=token
      var token = sessionStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = token;
      var response = await this.$http.get(`users?pagenum=${this.currentPage}
        &pagesize=${this.pageSize}&query=${this.serachValue}`);
      var status = response.data.meta.status;
      if (status === 200) {
        this.fromdata = response.data.data.users;
        // 总共的条数
        this.totalPage = response.data.data.total;
      } else {
        this.$message.error(response.data.meta.msg);
      }
    },
    // 当页面条数发生变化时
    // val指的是页面条数发生变化时所对应的条数
    handleSizeChange (val) {
      this.pageSize = val;
      this.renderRequest();
      console.log(val);
    },
    // 当当前页码发生变化时
    // val指的是页码发生变化时所对应的页码
    handleCurrentChange (val) {
      this.currentPage = val;
      this.renderRequest();
    },
    // 当点击搜索按钮时
    handleSearch () {
      this.renderRequest()
    },
    // 当点击添加用户  确定按钮时
    async handleAddUser () {
      this.$refs.formRules.validate(async (valid) => {
        if (valid) {
          var res = await this.$http.post('users',this.form);
          var {meta: {status, msg}} = res.data;
            console.log(res);
          if (status === 201) {
            this.$message.success(msg)
            this.renderRequest()
            this.AddDialogFormVisible = false;
            this.$refs.formRules.resetFields();
          }else{
            this.$message.error(msg)
          }
        } else {
          this.$message.warning('表单验证失败');
        }
      });
      
    }
  }
};
</script>

<style>
.input-with-select{
  width: 300px;
  margin:10px 0;
}
</style>
