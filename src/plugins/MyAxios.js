import axios from 'axios';

const MyAxios = {};

MyAxios.install = function (Vue) {
  // 配置全局的axios 给Vue 实例的prototype下添加方法供Vue实例使用
  Vue.prototype.$http = axios;
  // axios的方法  全局配置发送请求地址的基地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
};

export default MyAxios;
