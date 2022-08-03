<template>
  <div>
      <div v-if="notice!==''&& notice!== undefined" style="text-align:center;height:30px;line-height:30px; background: #ff4d4f;color:#fff;">{{notice}}</div>
      <div style="height:55px;line-height:52px; background: #0092D8;color:#fff;padding:0 10px;box-sizing:border-box;"  class="clearfix"> 
          <div class="fl" style="position: relative;cursor: pointer" @click="pushrouter">
            <a-icon type="gold" style="color:#fff;font-size: 28px;position:absolute;left:5px;top:15px"/>
            <span style="margin-left: 40px;font-size:20px;font-weight: 600;vertical-align:middle">XXX管理平台</span>
          </div>
          <div class="fr">
              <span>欢迎您登录&nbsp;&nbsp;{{currentUm}}</span>
              <!-- <a href="/v2/ajax/auth/logout">
                  注销
              </a> -->
              <a style="color:#fff;margin-left: 10px" @click.prevent="loginOut">注销</a>
          </div>
      </div>
      <a-layout id="components-layout-demo-side" style="min-height: 100vh;">
        <a-layout-sider v-model="collapsed" collapsible style="background: #fff" @collapse="toggleCollapsed">
          <Menu/>
        </a-layout-sider>
        <a-layout>
        <a-layout-content style="margin: 0 16px">
            <a-breadcrumb style="margin: 10px 0;text-align:left">
                <a-breadcrumb-item>XXX管理平台</a-breadcrumb-item>
                <a-breadcrumb-item>{{menutitle}}</a-breadcrumb-item>
            </a-breadcrumb>
            <!-- <div :style="{ padding: '5px 10px', background: '#fff'}"> -->
                 <div :style="{height:notice?scrollbarsHeight-145+'px':scrollbarsHeight-115+'px', padding: '5px 10px', background: '#fff',overflow:'hidden',overflowY:'scroll'}">
                    <!-- <transition name="slide"> -->
                        <router-view ></router-view>
                    <!-- </transition> -->
                </div>
            <!-- </div> -->
        </a-layout-content>
        </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { mapActions, mapGetters,mapMutations } from "vuex";
import Menu from '../components/menu';
export default {
  components:{
        Menu
    },
  data() {
    return {
      collapsed: false,
      menutitle:'',
      currentUser:'',
      scrollbarsHeight: 0,
     };
  },
  methods:{
    ...mapActions(['_getglobalnotice','_loginOut','_get_current_user_info']),
    ...mapMutations(["setNotice","setUm"]),
    loginOut(){
       localStorage.clear()
       window.location.href = `/v2/ajax/auth/logout`
    },
    pushrouter(){
      this.$router.push('/my_chains')
    },
    toggleCollapsed(collapsed) {
      console.log(collapsed)
      this.collapsed = collapsed
      localStorage.setItem('collapsed',collapsed)
    },
    async get_current_user_info(){
          const res = await this._get_current_user_info()
          console.log('get_current_user_info',res)
          if(res.status === 200){
              localStorage.setItem('currentUM',res.data.um)
              localStorage.setItem('userName',res.data.um)
              this.setUm(res.data.um)
          }
      },
  },
  mounted(){
     this.scrollbarsHeight = document.documentElement.clientHeight ||  document.body.clientHeight;
     let _this = this;
     window.onresize = function(){
       _this.scrollbarsHeight =  `${document.documentElement.clientHeight}`;
        // if(that.$refs.page){
        //     that.$refs.page.style.minHeight = clientHeight - 100 + 'px';
        // }
    }
    //  console.log(' document.documentElement.clientHeight', document.documentElement.clientHeight)
  },
  created(){
    if(localStorage.getItem('userName')==null || localStorage.getItem('userName')==undefined){
          this.get_current_user_info()
      }
    if(localStorage.getItem('collapsed')){
       this.collapsed = localStorage.getItem('collapsed')=='true'?true:false;
    } else {
       this.collapsed = false
    }
    console.log('this.$route--index.vue',this.$route)
      let path = this.$route.path.split('/')[1];
     
      if(path=='view_chain'){
        this.menutitle = '查看流程'
      }else if(path=='create_module'){
        this.menutitle = '创建流程模板'
      }else if(this.$route.query.orin){
          this.menutitle = '我的流程/查看流程 '
      } else {
         this.menutitle = this.$route.meta.title
      }
       document.title = this.menutitle
       this._getglobalnotice().then(res=>{
         console.log('_getglobalnotice',res)
         if(res.status === 200){
           this.setNotice(res.data)
         } else {
           this.setNotice('')
         }
       })
  },
  computed:{
      ...mapGetters(["getGloabal","getUm"]),
    key(){
       return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date();
    },
    notice:{
     get(){
        console.log('this.getGloabal',this.getGloabal)
        return this.getGloabal
     }
    },
    currentUm:{
     get(){
        console.log('this.getUm',this.getUm)
        return this.getUm
     }
    }
  }
};
</script>

<style lang="less" scoped>
  #components-layout-demo-side{
    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
    }
  }

</style>>
