<template>
  <a-config-provider :locale="locale">
     <div id="app">
      <transition name="slide">
        <router-view :key="key"></router-view>
      </transition>
    </div>
  </a-config-provider>
</template>

<script>
// 1.引入
import zhCn from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  data(){
    return {
      locale:zhCn
    }
  },
  methods:{
    // ...mapActions(['_get_user_id_by_um','_get_current_user_info']),
    async get_current_user_info(){
      // const res = await this._get_current_user_info()
      // console.log('get_current_user_info',res)
      // if(res.status === 200){
      //    localStorage.setItem('currentUM',res.data.um)
      //    localStorage.setItem('userName',res.data.um)
      // }
    }
  },
  created(){
   
    this.get_current_user_info()
  },
  computed: {
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
