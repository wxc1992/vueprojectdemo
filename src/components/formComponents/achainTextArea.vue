<template>
    <div>
        <div v-if="inError===true">
          <div>
            CHAIN-ERROR-请刷新页面重试或联系管理员chenkai
          </div>
        </div>
        <div v-if="inError===false">

          <template v-if="subType==='USER_INPUT'">
            <template v-if="itemstyle==='read'">
              <template>
                <span>{{item.item_value}}</span>
              </template>
            </template>
            <div v-if="itemstyle==='write'">
              <div>
                <a-textarea :placeholder="placeholderContent" :rows="2" v-model="item.item_value" />
              </div>
            </div>
          </template> <!--<div v-if="subType==='USER_INPUT'">-->
        </div>
    </div>
</template>
<script>
export default {
  name: "ACHAIN-TEXTAREA",
  props: ["allSteps", "item", "itemstyle",'formvaule'],
  data(){
      return {
          inError: false,
          subType: "",
      }
  },
 computed: {
    placeholderContent: function() {
        var pluginArgs = this.item['plugin_args']
        var parsedPluginArgs = JSON.parse(this.item['plugin_args'])
        console.log('parsedPluginArgs',parsedPluginArgs)
        var content = "请尽可能详细的填写相关信息"
        if (parsedPluginArgs.data !== undefined && parsedPluginArgs.data.placeholder !== undefined) {
            content = parsedPluginArgs.data.placeholder
        }
        return content
    },
     thisvalue(){
      // if(this.item.name == 'alldomain'){
      //  console.log(' this.formvaule', this.formvaule)
      // }
       console.log(' this.formvaule', this.formvaule)
      return this.formvaule
    
    }
 },
 methods:{
     initPlugin: function() {
        var pluginArgs = this.item['plugin_args']
        /* TEXTAREA类型的plugin的pluginArgs格式如下
        {
            subtype: "USER_INPUT"
            data: //根据subtype的类型data会包含具体信息
        }
        */
        console.log(`pluginArgs: ${pluginArgs}`)
        var subtype = JSON.parse(pluginArgs)['subtype']
        if (subtype === undefined) {
          console.log(`invalid subtype ${subtype}`)
          this.inError = true
        return
        }
        subtype = subtype.toUpperCase(subtype)
        if (subtype != "USER_INPUT") {
          console.log(`invalid subtype ${subtype}`)
          this.inError = true
        return
        }
        this.subType = subtype
        // this.parseArgs()
    },
 },
 created(){
     this.initPlugin()
 }
};
</script>
