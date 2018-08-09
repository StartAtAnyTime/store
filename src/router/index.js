import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
// 导入组件
import Login from '../views/login';

Vue.use(Router);

export default new Router({
  routes: [
    {name:'login', path:'/login', component:Login}
  ]
});
