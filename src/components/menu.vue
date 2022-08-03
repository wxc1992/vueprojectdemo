<template>
  <div>
    <a-menu theme="light" :selectedKeys="selectedKeys" mode="inline" >
        <a-menu-item  
           v-for="subItem in menuList"
            :key="subItem.path"
            @click="turnRouter(subItem.path)"
           
            :index="subItem.path">
            <div>
              <a-icon :type="subItem.icon" />
              <span  style="display: inline-block;">
                     {{ subItem.title }}
                    <!-- <router-link :to="subItem.path" style="display: inline-block;color:#fff">
                        {{ subItem.title }}
                    </router-link> -->
               </span>
            </div>
          
        </a-menu-item>
        <!-- <a-menu-item key="2">
           <a-icon type="login" />
           <span>提交流程</span>
        </a-menu-item>
        <a-menu-item key="3">
           <a-icon type="issues-close" />
           <span>审批流程</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="desktop" />
           <span>代理审批</span>
        </a-menu-item>
        <a-menu-item key="5">
          <a-icon type="build" />
           <span>自定义流程</span>
        </a-menu-item>
        <a-menu-item key="6">
          <a-icon type="cluster" />
           <span>平台统计</span>
        </a-menu-item>
        <a-menu-item key="7">
          <a-icon type="apartment" />
           <span>平台管理</span>
        </a-menu-item> -->
      </a-menu>
  </div>
</template>

<script>
import data from '../router/config'
export default {
  data() {
    return {
      warpheight: document.body.clientHeight,
      menuList: [],
      selectedKeys:[this.$route.path]
    };
  },
  methods: {
    turnRouter(path){
      this.$router.push(path)
    }
  },
 created(){
     console.log('data',data)
     if(this.$route.path == '/create_chain'){
         this.selectedKeys = ['/submit_chain']
     }
     if(this.$route.path == '/view_chain'){
         this.selectedKeys = ['/submit_chain']
     }
      if(this.$route.path == '/create_module'){
         this.selectedKeys = ['/manage_chain']
     }
     if(this.$route.path == '/view_module'){
         this.selectedKeys = ['/manage_chain']
     }
      if(this.$route.query.orin){
          this.selectedKeys = '/'+this.$route.query.orin
      } 
     this.menuList = data[0].children;
 },
watch: {
    $route(to) {
      console.log("home route to:", to);
      let nowSelect = '';
      if(to.path == '/create_chain'){
        nowSelect = '/submit_chain'
      }else if(to.path == '/view_chain'){
        nowSelect = '/submit_chain'
      } else if(to.path == '/create_module'){
        nowSelect = '/manage_chain'
      } else {
          nowSelect = to.path
      }
     this.selectedKeys = [nowSelect]
    
    }   
  },
};
</script>