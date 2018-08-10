// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyAxios from './plugins/MyAxios'
// 导入全局样式
import './assets/css/index.css';

// 使用插件已经配置完毕
// // 配置全局的axios 给Vue 实例的prototype下添加方法供Vue实例使用
// Vue.prototype.$http = axios;
// // axios的方法  全局配置发送请求地址的基地址
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// 使用插件
Vue.use(MyAxios);

Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
