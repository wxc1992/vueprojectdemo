<template>
    <div class="tableComponent">
        <div v-if="inError === true">
            <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
        </div>
        <div v-if="inError === false">
            <template v-if="subType=='CMDB_ADDPROJECT'">
                <CmdbAddpoject :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></CmdbAddpoject>
            </template>
            <template v-if="subType=='CMDB_ADDRSP'">
                <CmdbAddrsp :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></CmdbAddrsp>
            </template>
            <template v-if="subType=='CMDB_APPLYVM'">
                <CmdbApplyvm :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></CmdbApplyvm>
            </template>
            <template v-if="subType=='JUMPER_APPLY'">
                <JumperApply :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></JumperApply>
            </template>
            <template v-if="subType=='CMDB_ALIYUN_APPLYECS'">
                <CmdbAliyunApplyecs :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></CmdbAliyunApplyecs>
            </template>
             <template v-if="subType=='CMDB_ALIYUN_APPLYECS_COSTRATIO'">
                <CMDBALIYUNAPPLYECSCOSTRATIO :allSteps="allSteps" :subType="subType" :item="item" :itemstyle="itemstyle"></CMDBALIYUNAPPLYECSCOSTRATIO>
            </template>
        </div>
    </div>
</template>
<script>

import CmdbAddpoject from './CMDBADDPROJECT.vue'
import CmdbAddrsp from './CMDBADDRSP.vue'
import CmdbApplyvm from './CMDBAPPLYVM.vue'
import JumperApply from './JUMPERAPPLY.vue'
import CmdbAliyunApplyecs from './CMDBALIYUNAPPLYECS.vue'
import CMDBALIYUNAPPLYECSCOSTRATIO from './CMDBALIYUNAPPLYECSCOSTRATIO.vue'
export default {
    name:'ACHAIN-CTABLE',
    components:{
        CmdbAddpoject,
        CmdbAddrsp,
        CmdbApplyvm,
        JumperApply,
        CmdbAliyunApplyecs,
        CMDBALIYUNAPPLYECSCOSTRATIO
    },
    props: ['allSteps', 'item', 'itemstyle'],
    data(){
        return {
            inError: false,
            subType: "",
        }
    },
    computed: {
      
    },
    methods:{
        initPlugin() {
            var pluginArgs = this.item['plugin_args']
            console.log(`pluginArgs: ${pluginArgs}`)
            var subtype = JSON.parse(pluginArgs)['subtype']
            if (subtype === undefined) {
                console.log(`invalid subtype ${subtype}`)
                this.inError = true
                return
            }
            subtype = subtype.toUpperCase(subtype)
            if (subtype !== "CMDB_APPLYVM" && subtype !== "JUMPER_APPLY" && subtype !== "CMDB_ADDPROJECT" && subtype !== "CMDB_ADDRSP" && subtype !== "CMDB_ALIYUN_APPLYECS" && subtype !=='CMDB_ALIYUN_APPLYECS_COSTRATIO') {
                console.log(`invalid subtype ${subtype}`)
                this.inError = true
                return
            }
            this.subType = subtype
        },
    },
    created: function() {
        this.initPlugin();
        
    }   
}
</script>
<style lang="less" >
    .ant-select-disabled .ant-select-selection{
        background: #fff!important;
        color: #666!important;
    }
    .ant-input[disabled]{
        background: #fff!important;
         color: #666!important;
    }
</style>
