import axios from 'axios';

const MyAxios = {};

MyAxios.install = function (Vue) {
  // 配置全局的axios 给Vue 实例的prototype下添加方法供Vue实例使用
  Vue.prototype.$http = axios;
  // axios的方法  全局配置发送请求地址的基地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 拦截器
  axios.interceptors.request.use(function (config) {
    if (config.url.toLocaleLowerCase() !== '/login') {
      const token = sessionStorage.getItem('token');
      config.headers.Authorization= token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
};

export default MyAxios;
