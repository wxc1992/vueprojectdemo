
<template>
    <div>
         <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="40%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目" prop="project">
                    <a-select v-model="form.project" placeholder="请选择项目" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in costProjectData"
                            v-bind:value="item['name']+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="分摊比例" prop="costRatio">
                      <a-input v-model="form.costRatio" placeholder="请输入分摊比例" :disabled="updateType==1"/>
                </a-form-model-item>
            </a-form-model>  
            <template slot="footer">
                <a-button key="back" @click="handleCancel">
                    取消
                </a-button>
                <a-button key="submit" type="primary"  @click="handleOk" v-if="updateType!=1 || !itemstyle=='write'">
                    确定
                </a-button>
            </template>
          
         </a-modal>
         <div style="text-align: right">
             <a-button type="primary" size="small" v-if="itemstyle === 'write'" @click="showModal({},0,'新增')">
                    新增
            </a-button>
         </div>
         <a-table 
            :columns="columns" 
            :loading="loading"
            size="small"
            :pagination="false"
            v-if="itemstyle === 'write'"
            :data-source="tabledata" 
          >
            <span slot="project" slot-scope="project">
               {{project?project.split('/')[1]:''}}
            </span>
            <span slot="device" slot-scope="device">
               {{device!==undefined && device!==''?device.join(','):''}}
            </span>
            <span slot="action" slot-scope="scope">
                <a-button type="primary" size="small" @click="showModal(scope,1,'查看')">
                    查看
                </a-button>
                <a-button type="primary" size="small" v-if="itemstyle === 'write'" style="margin: 0 5px" @click="deleteIndex(scope)"> 
                    删除
                </a-button>
                <a-button type="primary" size="small" v-if="itemstyle === 'write'" @click="showModal(scope,2,'编辑')">
                    编辑
                </a-button>
            </span>
        </a-table>
        <a-table 
            :columns="columns" 
            :loading="loading"
            size="small"
            :pagination="false"
            v-if="itemstyle === 'read'"
            :data-source="tableDataRead" 
          >
            <span slot="action" slot-scope="scope">
                <a-button type="primary" size="small" @click="showModal(scope,1,'查看')">
                    查看
                </a-button>
            </span>
        </a-table>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
const columns = [
  {
    title: '项目',
    dataIndex: 'project',
    key: 'project',
    width: 100,
    scopedSlots: { customRender: 'project' },
  },
  {
    title: '分摊比例',
    dataIndex: 'costRatio',
    key: 'costRatio',
  },
 {
    title: '操作',
    key: 'action',
    width: 180,
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
    name:'CMDB_ALIYUN_APPLYECS_COSTRATIO',
    props: ['allSteps', 'item', 'itemstyle','subType'],
    data(){
        let checkcostRatio = (rule, value, callback)=>{
             if (value !=='' && !( parseInt(value,10) <= 1 &&  parseInt(value,10) >=0)) {
                callback(new Error('分摊比例需在0-1之间'));
            } else {
                callback();
            } 
        }
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            columns:columns,
            tabledata: [],
            item_tabledata: [],
            costProjectData: [],
            form:{
                project: undefined,
                costRatio: undefined,
            },
            rules:{
                project: [
                    { required: true, message: '请选择项目', trigger: 'change' },
                ],
                costRatio: [
                    { required: true, message: '请输入分摊比率', trigger: 'change' },
                    {validator: checkcostRatio,trigger: 'change'}
                ],
            },
            loading: false,
            visible: false,
            editdata:{},
            allData:[],
            title:'',
            recordData: {},
            updateType: ''
        }
    },
    methods:{
        ...mapActions(['_getSelectOptions']),
        handleOk(e) {
             console.log('form',{...this.form})
            const _this = this
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if(_this.updateType==0){
                        _this.tabledata.push({..._this.form})
                    } else {
                      _this.tabledata.splice(_this.recordData.index,1,{..._this.form})  
                    }
                      _this.visible = false;
                      _this.$refs.ruleForm.resetFields();
                      _this.item_tabledata =  [..._this.tabledata]
                    console.log('_this.visible ',_this.visible )
                    _this.$nextTick(()=>{
                        _this.parsedata();
                    })
                   
                   
                } else {
                    return false;
                }
            });
            
        },
        handleCancel(e) {
            this.$refs.ruleForm.resetFields();
            this.visible = false;
        },
        deleteIndex(data){
            console.log('deleteIndex--data',data)
            this.tabledata.splice(data.index,1)
            this.tabledata.forEach((item,index)=>{
                item.index = index
            })
            this.item_tabledata = {...this.tabledata}
        },
        async getSelectData(params,url,type){
            let _url = url;
            let _params = {}
            _params.params = params;
            if (typeof(url) == 'undefined') {
                _url = "/cmdb/query"
            }
            _params.url = _url;
            const res = await this._getSelectOptions(_params)
            // console.log('res',res)
            if(res.status === 200 && res.data.returnCode==0){
                this[type+'Data'] = res.data.returnMsg
            }
            
        },
        getTabledata(){
            this.tabledata = []
            if(this.item.item_value==''){
                this.tabledata = []
            } else {
                // console.log('item-read-rtable',this.item)
                let arr = JSON.parse(this.item.item_value)
                // console.log('item-read-rtable-arr',arr)
                let tableArr = []
                let arrIn = []
                let warpObj = {}
                arr.forEach(item=>{
                    item.forEach(itenmIn=>{
                      let itemarr = []
                      let obj = {}
                      for(let key in itenmIn){
                           if(key == 'name'){
                               let tempvalue = itenmIn[key];
                                if(tempvalue=='project'){
                                        obj = {
                                            [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
                                        }
                                }  else {
                                     obj = {
                                        [tempvalue]: itenmIn['value']
                                    }
                                }
                           }
                      }
                    //   console.log('item-read-rtable-arr-obj',obj)
                      arrIn.push(obj)
                    })
                     let obj2 = Object.assign(warpObj,...arrIn)
                     this.tabledata.push({...obj2})
                    //  console.log('this.tabledata',this.tabledata)
                })
            }
        },
        parsedata(){
            let arr = []
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                    if( key =='costRatio'){
                        obj.title="分摊比例"
                        obj.value =  item[key]
                        obj.type = 'INPUT'
                        obj.text = item[key]
                       
                    }else if( key =='project'){
                        obj.title="项目"
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                        obj.type = 'SELECT'
                    } 
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
        },
        showModal(data,type,title) {
            this.visible = true;
            this.title = title
            this.updateType  = type
            this.recordData = data
            if(type==1 || type==2){
                this.form = {...data}
            }
        },
    },
    computed:{
        tableDataRead(){
            let tableDa = []
            if(this.itemstyle=="read"){
                // console.log('item-read-rtable',this.item)
                let arr = JSON.parse(this.item.item_value)
                // console.log('item-read-rtable-arr',arr)
                let tableArr = []
                let arrIn = []
                let warpObj = {}
                arr.forEach(item=>{
                    item.forEach(itenmIn=>{
                        let itemarr = []
                        let obj = {}
                        for(let key in itenmIn){
                            if(key == 'name'){
                                obj = {
                                    [itenmIn[key]]: itenmIn['text']
                                }
                            }
                        }
                        // console.log('item-read-rtable-arr-obj',obj)
                        arrIn.push(obj)
                    })
                       let obj2 =  Object.assign(warpObj,...arrIn)
                    
                        // console.log('item-read-rtable-arr-obj2',obj2)
                         tableDa.push({...obj2})
                })
                   
                    // console.log('item-read-rtable-tableArr',tableArr)

            }
            return tableDa;
        }
    },
    created(){
        
        if(this.itemstyle !== 'read'){
            this.getTabledata()
            this.form= {
                project: [],
                costRatio: undefined,
            },
            this.getSelectData({}, "/v2/ajax/cmdb/listproject",'costProject')
        }
        
    }
}
</script>
<style lang="less" scoped>
    .ant-table-small > .ant-table-content > .ant-table-body{
        margin: 0 auto!important;
    }
    .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr{
        background: #e6f7ff!important;
    }
</style>
