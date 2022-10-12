import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment'; 
import 'moment/locale/zh-cn';
//设置语言 或 moment.lang('zh-cn'); 

import LocaleProvider from 'ant-design-vue'

import Scrollerbars from '@zhangzhengyi12/vue-scrollbars'
import './assets/css/base.css'
import qs from 'qs'

import App from './App.vue'

import common from '../commonFunction/common.js'
moment.locale('zh-cn'); 
Vue.use(LocaleProvider)
Vue.use(Antd);
Vue.use(Scrollerbars);
import router from './router'
import axios from 'axios'
import store from './store'
import filters from './filters/index'
Vue.prototype.qs = qs
Vue.prototype.axios = axios
Vue.prototype.$moment = moment;//挂载到当前vue实例对象
Vue.config.productionTip = false
Vue.prototype.common = common
//注册全局filter
for(let funcName in filters){
  Vue.filter(funcName,filters[funcName]);
}
// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   const {Authorization} = config.headers;
//   if(!Authorization){
//       config.headers.Authorization = localStorage.getItem('token')
//   }
//   console.log(config)
//   console.log('###################get route in axios:',router);
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// });
let promptId = null;
let ENV = process.env.NODE_ENV;
axios.interceptors.response.use(function (response) {
  console.log('process.env.NODE_ENV',process.env.NODE_ENV);
    // Do something with response data
    console.log('@@@@@@@@@@@@response:',response);
    const {request:{responseURL}} = response;
    const status = response.status;
    console.log('response',status)
    console.log('responseURL',responseURL)
    // const matchLogout = responseURL&&responseURL.match('/sso/api/logout');
    // console.log('matchLogout',matchLogout)
    // console.log('matchLogout',matchLogout)
    // if(matchLogout&&matchLogout.length>0){
    //     console.log('match log return')
    //     return response;
    // }
    // if(status === '9998'){
    //     if(promptId){
    //         clearTimeout(promptId);
    //     }
    //     promptId = setTimeout(()=>{
    //         ElementUI.Message.warning(response.data.msg);
    //     },200);
    //     localStorage.clear();
    //     router.push('/login');
    //     return '';
    // } else{
    //   return response;
    // }
    return response;
  }, function (res) {
    // Do something with response error
    console.log(res.response)
    if(res.response.status===400 && res.response.data.msg=='请求中未包含token'){
      // window.location.href = `https://sso.baidu.com/user/login?redirectUrl=${ENV=='development'?'http://achain-test.baidu.com:3000':'https://achain.baidu.com'}`
    }
    return Promise.reject(res);
  });


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
