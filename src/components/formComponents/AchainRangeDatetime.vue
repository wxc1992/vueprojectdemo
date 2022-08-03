<template>
    <div>
        <div v-if="inError === true">
            <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
        </div>
        <div v-if="inError === false">
             <template v-if="subType==='USER_INPUT'">
                <template v-if="itemstyle==='read'">
                    <div>
                        {{item.item_value?String(item.item_value).split(',').join('--'):''}}
                    </div>
                </template>
                <template v-if="itemstyle==='write'">
                    <div>
                        <a-range-picker show-time :format="dateFormat" @change="timeChange" v-model="item.item_value">
                            <!-- <template slot="renderExtraFooter">
                                extra footer
                            </template> -->
                        </a-range-picker>
                    </div>
                </template>
            </template> <!--<template v-if="subType==='USER_INPUT'">-->
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ACHAIN-RANGEDATETIME',
    props: ["allSteps", "item", "itemstyle"],
    data(){
        return {
             inError: false,
             subType:'',
             dateFormat: 'YYYY/MM/DD HH:mm:ss',
             defaultValue: moment(new Date(), 'YYYY/MM/DD HH:mm:ss'),
             datarange:[]
        }
    },
    methods:{
        timeChange(date){
            console.log(date)
            if(date.length>0){
                let startTime = moment(date[0]).format('YYYY/MM/DD HH:mm:ss')
                let endTime = moment(date[1]).format('YYYY/MM/DD HH:mm:ss')
                this.item.item_value = [startTime,endTime]
            } else {
                 this.item.item_value = ""
            }
            // console.log(nowDate)
            
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
          console.log('this.item.item_value ',String(this.item.item_value).split(','))
          if(this.itemstyle ==='write'){
               if(this.item.item_value == ''){
                   this.item.item_value =  ""
                } else {
                    this.item.item_value =  String(this.item.item_value).split(',')
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