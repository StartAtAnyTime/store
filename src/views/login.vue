<template>
    <div class="login-wrap">
      <el-form :label-position="labelPosition" label-width="80px" :model="formdata" class="login-form">
        <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"  @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
  </el-form>
    </div>
</template>

<script>
import axios from 'axios';
  export default {
    data() {
      return {
        labelPosition: 'top',
        formdata: {
          name: '',
          password: '',
        }
      };
    },
    methods: {
      handleLogin(){
        axios
          .post('http://localhost:8888/api/private/v1/login',this.formdata)
          .then(res => {
            console.log(res)
            if(res.data.meta.status === 200){
              sessionStorage.setItem('token',res.data.data.token)
              this.$router.push('/');
              this.$message.success(res.data.meta.msg);
            }else{
              this.$message.success(res.data.meta.msg);
            }
          })
          .catch(err => {
            this.$message.error(err.status)
          })
      }
    }
  }
</script>


<style scoped>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
