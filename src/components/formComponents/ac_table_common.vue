<template>
    <div>
        <div v-if="inError === true">
            <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
        </div>
        <div v-if="inError === false">
            <ComomTable @sendUpdateEdittable="sendUpdateEdittable" :columns="columns" :formConfigTable="formConfigTable" :formRulesTable="formRulesTable" :columnsShow="columnsShow" :item="item" :allSteps="allSteps" :subType="subType" :itemstyle="itemstyle"></ComomTable>
        </div>
    </div>
</template>
<script>
// import cloumnsConfg  from './tables/columns_config'
// import formConfig from './tables/table_form_config.js'
import tableConfig from './tables/config/table_config.js'
import formRules from './tables/table_form_rules'
import ComomTable from '../formComponents/tables/common_table.vue'
export default {
    name:'ACHAIN-CTABLE',
    components:{
        ComomTable
    },
    props: ['allSteps', 'item', 'itemstyle'],
    data(){
        return {
            inError: false,
            subType: "",
            columnsShow: [],
            columns: [],
            formConfigTable: [],
            formRulesTable: []
        }
    },
    computed: {
    //   subType_common(){
    //        var pluginArgs = this.item['plugin_args']
    //         console.log(`pluginArgs: ${pluginArgs}`)
    //         var subtype = JSON.parse(pluginArgs)['subtype']
    //         return subtype;
    //   }
    },
    methods:{
        sendUpdateEdittable(value){
             this.$emit('sendUpdateEdittable',value)
        },
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
            if ( subtype !== 'DNS_ANALYSISVALUE' && subtype !=="CMDB_APPLYHHVM" && subtype !=="CMDB_RELHHVM" && subtype !=="CMDB_RELVM" && subtype !== "CMDB_APPLYVM" && subtype !== "JUMPER_APPLY" && subtype !== "CMDB_ADDPROJECT" && subtype !== "CMDB_ADDRSP" && subtype !== "CMDB_ALIYUN_APPLYECS" && subtype !=='CMDB_ALIYUN_APPLYECS_COSTRATIO') {
                console.log(`invalid subtype ${subtype}`)
                this.inError = true
                return
            }
             this.subType = subtype
             let columns = []
             let forms = []
             tableConfig[subtype].columns.map(item=>{
                 columns.push({
                        title: item.title,
                        dataIndex: item.dataIndex,
                        key: item.dataIndex,
                        width: item.width?item.width:null,
                        type: item.type,
                        scopedSlots: item.scopedSlots?item.scopedSlots:{},
                 })
                 forms.push({
                        label: item.title,
                        prop: item.dataIndex,
                        type: item.type,
                        options: item.options,
                        multiple: item.multiple,
                        defaulOptions: item.defaulOptions,
                        defaultValue: item.defaultValue,
                        isShow: item.isShow?item.isShow:false,
                        dependOn: item.dependOn?item.dependOn:false,
                        dependOnProps: item.dependOnProps?item.dependOnProps:null,
                        dependOnName:item.dependOnName?item.dependOnName:null,
                        placeholder:item.placeholder?item.placeholder:null,
                        Vif: item.Vif?item.Vif:'',
                        showSearch: item.showSearch?item.showSearch:false
                 })
             })
             this.columns = [...columns];
             this.columnsShow = [
                    ...columns.splice(0,4),
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        fixed: 'right',
                        align: 'center',
                        scopedSlots: { customRender: 'action' },
                    }
                ];
             this.formConfigTable = [...forms];
             this.formRulesTable = formRules[subtype];
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
