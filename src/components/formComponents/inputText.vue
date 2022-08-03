<template>
    <div>
        <div v-if="inError===true">
          <div>
            CHAIN-ERROR-请刷新页面重试或联系管理员chenkai
          </div>
        </div>
        <div v-if="inError===false">
            
             <div v-if="subType==='USER_INPUT'">
                 <template v-if="itemstyle==='read'">
                    <div>
                        {{item.item_value}}
                    </div>
                </template>
                <div v-if="itemstyle==='write'">
                    <a-input
                        v-model="item.item_value"
                        :placeholder="'请输入'+item.show_name"
                    />
                </div>
            </div> <!--<div v-if="subType==='USER_INPUT'">-->
            <div v-if="subType==='STRING'">
                    <div v-if="itemstyle==='write'">
                        {{stringContentshow}}
                    </div>
                     <div v-if="itemstyle==='read'">
                        {{stringContentshow}}
                    </div>
            </div> <!--<div v-if="subType==='A_RECORD'">-->
            <div v-if="subType==='A_RECORD'">
                <div v-if="itemstyle==='write'">
                    <a-input
                        
                        v-model="item.item_value"
                        allowClear
                        placeholder="请填写A记录，注意不能包含下划线、不能包含区域名"
                    />
                </div>
            </div> <!--<div v-if="subType==='A_RECORD'">-->
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    name:'ACHAIN-TEXT',
    props: ['allSteps', 'item', 'itemstyle'],
    data(){
        return {
            inError: false,
            subType:'',
            stringContentshow: ''
        }
    },
    methods:{
        ...mapActions(['_get_user_id_by_um']),
        initPlugin: function() {
            var pluginArgs = this.item['plugin_args']
            /* TEXT类型的plugin的pluginArgs格式如下
                {
                subtype: "USER_INPUT","STRING","BADAO_URL",
                data: //根据subtype的类型data会包含具体信息
                }
            */
            console.log(`pluginArgs: ${pluginArgs}`)
            var subtype = JSON.parse(pluginArgs)['subtype']
            if (subtype === undefined) {
                // console.log(`invalid subtype ${subtype}`)
                this.inError = true
                return
            }
            subtype = subtype.toUpperCase(subtype)
            if (subtype != "MACHINE_IPS" && subtype != "USER_INPUT" && subtype != "STRING" && subtype != "BADAO_URL" && subtype != "A_RECORD") {
                // console.log(`invalid subtype ${subtype}`)
                this.inError = true
                return
            }
            this.subType = subtype
            this.parseArgs()
        },
        parseArgs() {
          var pluginArgs = this.item['plugin_args']
          if (this.subType == "USER_INPUT") {
            // do nothing
          } else if (this.subType == "STRING") {
            // data即为要显示的值
            if (this.item.item_value === "") {
                this.item.item_value = JSON.parse(pluginArgs).data
            }
          } else if (this.subType == "MACHINE_IPS") {

          } else if (this.subType == "BADAO_URL") {
            // data即为霸道ID列表，逗号分隔
            // 对于read只需要获取到数据即可
            // 对于write会从computed属性获取具体的内容
          } else if (this.subType == "A_RECORD") {
          }
        },
        async stringContent() {
           this.stringContentshow = this.item.item_value
          if (this.item.value_generator_type === "当前用户" || this.item.value_generator_type === "直线领导") {
            const res = await this._get_user_id_by_um(this.item.item_value);
            if(res.status ===200){
               this.stringContentshow = res.data.name+'/'+ res.data.um
            }
          }
        },
    },
    created(){
        this.initPlugin();
        // console.log(this.allSteps);
        // console.log(this.item)
       this.stringContent()
    }
}
</script>
<style lang="less">

</style>
