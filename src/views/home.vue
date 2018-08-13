<template>
    <el-container class="container">
      <!-- 头部 -->
      <el-header class="header" style="height:100px">
        <el-row>
          <el-col :span="4">
            <img style="height:100px;width:200px" src="@/assets/logo2.png" alt="">
          </el-col>
          <el-col :span="18">
            <div class="title">东辉有限公司后台系统</div>
          </el-col>
          <el-col :span="2">
            <a class="logout" href="#" @click.prevent="handleLogout">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="inner">
        <!-- 侧边导航 -->
        <el-aside width="200px" class="aside">
          <el-menu
            unique-opened
            router
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#116063"
            text-color="#fff"
            active-text-color="rgba(255, 60, 0, 0.986)">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/users">
                 <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
               </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span slot="title">商品列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">分类参数</span>
              </el-menu-item>
              <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">商品分类</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="4-1">
                 <i class="el-icon-menu"></i>
                <span slot="title">订单列表</span>
               </el-menu-item>
            </el-submenu>

            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="5-1">
                 <i class="el-icon-menu"></i>
                <span slot="title">数据报表</span>
               </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <!-- 内容部分 -->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  beforeCreate () {
    var token = sessionStorage.getItem('token');
    if (!token) {
      this.$message.error('请先去登录哟！');
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout () {
      sessionStorage.clear();
      this.$message.success('退出成功！');
      this.$router.push('/login');
    }
  }
};
</script>
<style>
.container {
  height: 100%;
}

.header {
  background-color: #116063;
  padding:0 0;
}
.header .title{
  font-size: 28px;
  color: white;
  line-height: 100px;
  text-align: center;
}
.header .logout{
  text-decoration: none;
  color: rgba(255, 60, 0, 0.986);
  text-align: center;
  line-height: 100px;
  font-size: 20px;
}

.aside {
  background-color: #d3dce6;
}
.aside .inner{
  height: 100%;
}
.el-menu-vertical-demo{
  height: 100%;
}
.main {
  background-color: #e9eef3;
}
</style>
