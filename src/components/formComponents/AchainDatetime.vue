<template>
    <div>
        <div v-if="inError === true">
            <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
        </div>
        <div v-if="inError === false">
             <template v-if="subType==='USER_INPUT'">
                <template v-if="itemstyle==='read'">
                    <div>
                        {{item.item_value}}
                    </div>
                </template>
                <template v-if="itemstyle==='write'">
                    <div>
                        <a-date-picker show-time :format="dateFormat" @change="timeChange" v-model="item.item_value">
                            <!-- <template slot="renderExtraFooter">
                                extra footer
                            </template> -->
                        </a-date-picker>
                    </div>
                </template>
            </template> <!--<template v-if="subType==='USER_INPUT'">-->
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ACHAIN-DATETIME',
    props: ["allSteps", "item", "itemstyle"],
    data(){
        return {
             inError: false,
             subType:'',
             dateFormat: 'YYYY/MM/DD HH:mm:ss',
             defaultValue: moment(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        }
    },
    methods:{
        timeChange(date){
            console.log(date)
            let nowDate = moment(date).format('YYYY/MM/DD HH:mm:ss')
            console.log(nowDate)
            this.item.item_value = nowDate
        },
        initPlugin() {
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
          console.log('this.item.item_value ',this.item.item_value)
          if(this.itemstyle ==='write'){
               if(this.item.item_value ==''){
                    this.item.item_value = ''
                } else {
                    this.item.item_value =  moment(''+this.item.item_value).format('YYYY/MM/DD HH:mm:ss')
                }
          }
         
        //   this.item.item_value =  this.item.item_value ==''?this.defaultValue: this.item.item_value;
        },
    },
    created(){
         this.initPlugin();
    }
}
</script>
<style lang="less" scoped>

</style>