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
          v-loading="loading"
          :data="formdata"
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
                inactive-color="#ff4949"
                @change="handleStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEditUser(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelUser(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleRole(scope.row)"></el-button>
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

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑用户" :visible.sync="EditDialogFormVisible" @close="handleClose">
        <el-form
        :model="form"
        ref="editForm"
        label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditUserBtn">确 定</el-button>
        </div>
      </el-dialog>

    <!-- 分配权限弹出框 -->
      <el-dialog title="分配角色" :visible.sync="QuanXiandialogFormVisible">
        <el-form
        label-width="100px">
          <el-form-item label="当前用户" >
            {{currentName}}
          </el-form-item>
          <el-form-item label="请选择角色" >
            <el-select v-model="currentRoleId">
              <el-option label="请选择" :value="-1" disabled></el-option>
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="QuanXiandialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleRoleBtn">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
</template>

<script>
import axios from 'axios';
export default {
  data () {
    return {
      // 网络较慢时出现圆圈
      loading: false,
      // 用户列表数据
      formdata: [],

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
      // 控制添加弹出框显示与隐藏
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
      },

      // 编辑用户数据
      // 控制编辑弹出框显示与隐藏
      EditDialogFormVisible: false,

      // 分配角色数据
      QuanXiandialogFormVisible: false,
      // 当前角色名称
      currentName: '',
      // 当前角色id
      currentRoleId: -1,
      currentId: -1,
      roles: []
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
        this.formdata = response.data.data.users;
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
      this.renderRequest();
    },
    // 当点击添加用户  确定按钮时
    async handleAddUser () {
      this.$refs.formRules.validate(async (valid) => {
        if (valid) {
          var res = await this.$http.post('users', this.form);
          var {meta: {status, msg}} = res.data;
          console.log(res);
          if (status === 201) {
            this.$message.success(msg);
            this.renderRequest();
            this.AddDialogFormVisible = false;
            this.$refs.formRules.resetFields();
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.warning('表单验证失败');
        }
      });
    },
    // 当点击编辑按钮时
    async handleEditUser (user) {
      this.EditDialogFormVisible = true;
      const res = await this.$http.get(`users/${user.id}`);
      console.log(user);
      console.log(res);
      const {meta: {status, msg}} = res.data;
      if (status === 200) {
        this.form = res.data.data;
        this.form.id = user.id;
        console.log(this.form.id);

        this.form.email = user.email;
        this.form.mobile = user.mobile;
      } else {
        this.$message.error(msg);
      }
    },
    async handleEditUserBtn () {
      var res = await this.$http.put(`users/${this.form.id}`,
        { email: this.form.email,
          mobile: this.form.mobile});
      const {meta: {status, msg}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.renderRequest();
        this.EditDialogFormVisible = false;
        this.$refs.editForm.resetFields();
        for (var key in this.form) {
          this.form[key] = '';
        }
      } else {
        this.$message.error(msg);
      }
    },
    handleClose() {
      for (var key in this.form) {
        this.form[key] = '';
      }
    },
    async handleDelUser(user) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`);
        const {meta: {status, msg}} = res.data;
        if (status === 200) {
          // 如果当前页的用户只有一条并且不是第一页的时候，删除之后让页码调回一页
          if (this.formdata.length == 1 && this.currentPage != 1) {
            this.currentPage--;
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.renderRequest();
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async handleStatus (user) {
      console.log(user);
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const {meta: {status, msg}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 当点击分配角色按钮的时候
    async handleRole (user) {
      this.QuanXiandialogFormVisible = true;
      this.currentId = user.id;
      this.currentName = user.username;
      const response = await this.$http.get('roles');
      const { meta: {status, msg}} = response.data;
      if (status === 200) {
        this.roles = response.data.data;
        const userRoles = await this.$http.get(`users/${this.currentId}`);
        const { meta: {status, msg}} = userRoles.data;
        if (status === 200) {
          this.currentRoleId = userRoles.data.data.rid;
        }
      } else {
        this.$message.error(msg);
      }
    },
    // 当前分配角色确定按钮点击的时候
    async handleRoleBtn () {
      const res = await this.$http.put(`users/${this.currentId}/role`, {rid: this.currentRoleId});
      const { meta: {status, msg}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.QuanXiandialogFormVisible = false;
      } else {
        this.$message.error(msg);
      }
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
