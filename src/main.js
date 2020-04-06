/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import CKEditor from '@ckeditor/ckeditor5-vue'
// import CKEditor  from '@ckeditor/ckeditor5-build-decoupled-document'
// import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import axios from '@/util/axiosConfig'
import store from '@/store/store'
import base from '@/util/base'
import api from '@/util/api'
import '@/css/base.css'

Vue.config.productionTip = false

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(CKEditor);
Vue.use(base);

const $ = require('jquery');
window.$ = $;

// $( ()=>{  //这里用到了jquery，所以要配置好jquery；
//   const configs = ['layer', 'laydate', 'laypage', 'laytpl', 'layedit', 
//    'form', 'upload', 'tree', 'table', 'element', 'util', 
//    'flow', 'carousel', 'rate'];
//   layui.config( { 
//        base : './public/static/layui-2.3.0/lay'   //配置 layui 第三方扩展组件存放的基础目录
// } ).use( configs, ()=>{ 
//   new Vue({
//     el: '#app',
//     store,
//     router,
//     components: { App },
//     template: '<App/>' })
//   } ) } )

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
