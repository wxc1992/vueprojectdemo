<template>
    <div>
         <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="40%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目代号" prop="name">
                    <a-input v-model="form.name" placeholder="请输入项目代号" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目名称" prop="cn">
                    <a-input v-model="form.cn" placeholder="请输入项目名称" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"   :wrapper-col="{ span: 16}" label="业务线" prop="business">
                    <a-select v-model="form.business" placeholder="请选择业务线" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in businessData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目负责人" prop="owner">
                    <!-- <a-select mode="multiple" v-model="form.owner" placeholder="请选择项目负责人" :disabled="updateType==1">
                        <a-select-option
                            v-for="item in allusersData"
                            v-bind:value="item['id']"
                            :key="'owner/'+item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select> -->
                     <originselect :formmodel="form.owner" :updateType="updateType" @senduser="(value)=>{form.owner =value }"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目开发负责人" prop="dever">
                    <!-- <a-select mode="multiple" v-model="form.dever" placeholder="请选择项项目开发负责人" :disabled="updateType==1">
                        <a-select-option
                            v-for="item in allusersData"
                            v-bind:value="item['id']"
                            :key="'dever/'+item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select> -->
                    <originselect :formmodel="form.dever" :updateType="updateType" @senduser="(value)=>{form.dever =value }"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目测试负责人" prop="tester">
                    <!-- <a-select mode="multiple" v-model="form.tester" placeholder="请选择项项目测试负责人" :disabled="updateType==1">
                        <a-select-option
                            v-for="item in allusersData"
                            v-bind:value="item['id']"
                            :key="'tester/'+item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select> -->
                    <originselect :formmodel="form.tester" :updateType="updateType" @senduser="(value)=>{form.tester =value }"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目运维负责人" prop="opser">
                    <!-- <a-select mode="multiple" v-model="form.opser" placeholder="请选择项项目运维负责人" :disabled="updateType==1">
                        <a-select-option
                            v-for="item in allusersData"
                            v-bind:value="item['id']"
                            :key="'opser/'+item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select> -->
                    <originselect :formmodel="form.opser" :updateType="updateType" @senduser="(value)=>{form.opser = value }"/>
                </a-form-model-item>
                <a-form-model-item  :wrapper-col="{ span: 16}" label="备注信息" prop="remark">
                    <a-input v-model="form.remark" placeholder="请输入备注信息" :disabled="updateType==1"/>
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
            v-if="itemstyle === 'write'"
            :columns="columns" 
            :pagination="false"
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?500:800) }"
            :loading="loading"
            size="small"
           
            :data-source="tabledata" 
          >
           <span slot="business" slot-scope="business">
               {{business?business.split('/')[1]:''}}
           </span>
           <span slot="owner" slot-scope="owner">
               {{owner?owner.join(','):''}}
           </span>
           <span slot="dever" slot-scope="dever">
               {{dever?dever.join(','):''}}
           </span>
           <span slot="tester" slot-scope="tester">
               {{tester?tester.join(','):''}}
           </span>
           <span slot="opser" slot-scope="opser">
               {{opser?opser.join(','):''}}
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
            v-if="itemstyle === 'read'"
            :columns="columns" 
            :loading="loading"
            :pagination="false"
            size="small" 
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?400:800) }"
            :data-source="tableDataRead" 
          >
            <span slot="action" slot-scope="scope">
                <a-button type="primary" size="small" @click="showModal(scope,1,'查看')">
                    查看
                </a-button>
            </span>
        </a-table>
        <div style="margin-top:10px">
            <a-select 
                v-model="nowColumns" 
                mode="tags"   
                placeholder="选择需要展示的表头信息"
                @change="handleChange"
               >
              <a-select-option
                v-for="item in columnsSelect"
                v-bind:value="item['key']"
                :key="item.key"
              >
                {{ item["title"] }}
              </a-select-option>
            </a-select>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import originselect from '../originselect.vue'
const columns = [
  {
    title: '项目代号',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '项目名称',
    dataIndex: 'cn',
    key: 'cn',
  },
  {
    title: '业务线',
    key: 'business',
    dataIndex: 'business',
    scopedSlots: { customRender: 'business' },
  },
 {
    title: '项目负责人',
    key: 'owner',
    dataIndex: 'owner',
    scopedSlots: { customRender: 'owner' },
  },
  {
    title: '项目开发负责人',
    key: 'dever',
    dataIndex: 'dever',
    scopedSlots: { customRender: 'dever' },
  },
  {
    title: '项目测试负责人',
    key: 'tester',
    dataIndex: 'tester',
    scopedSlots: { customRender: 'tester' },
  },
  {
    title: '项目运维负责人',
    key: 'opser',
    dataIndex: 'opser',
    scopedSlots: { customRender: 'opser' },
  },
  {
    title: '备注信息',
    key: 'remark',
    dataIndex: 'remark',
  }
];
const columnsShow = [
  {
    title: '项目代号',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '项目名称',
    dataIndex: 'cn',
    key: 'cn',
  },
  {
    title: '业务线',
    key: 'business',
    dataIndex: 'business',
    scopedSlots: { customRender: 'business' },
  },
 {
    title: '项目负责人',
    key: 'owner',
    dataIndex: 'owner',
    scopedSlots: { customRender: 'owner' },
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    align: 'center',
    fixed:'right',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
    name:'CMDB_ADDPROJECT',
    props: ['allSteps', 'item', 'itemstyle','subType'],
    components:{
        originselect
    },
    data(){
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            columns:columnsShow,
            columnsSelect: columns,
            tabledata: [],
            item_tabledata:[],
            businessData: [],
            allusersData:[],
            form:{
                name: '',
                cn:'',
                business:undefined,
                owner:[],
                dever:[],
                tester:[],
                opser:[],
                remark:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入项目代号', trigger: 'blur' },
                ],
                cn: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                ],
            },
            loading: false,
            nowColumns:[],
            visible: false,
            editdata:{},
            allData:[],
            title:'',
            recordData: {},
            updateType: ''
        }
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
                    //   console.log('item-read-rtable-arr-obj',obj)
                      arrIn.push(obj)
                    })
                     let obj2 = Object.assign(warpObj,...arrIn)
                     tableDa.push({...obj2})
                    //  console.log('item-read-rtable-arr-warpObj',warpObj)
                })
                 
                //  console.log('item-read-rtable-tableArr',tableArr)

            }

            return tableDa;
        }
    },
    methods:{
        ...mapActions(['_getSelectOptions']),
        senduseropser(value){
            this.form.opser = value
        },
        sendusertester(value){
            this.form.tester = value
        },
        senduserdever(value){
            this.form.dever = value
        },
        senduserowner(value){
            this.form.owner = value
        },
        handleOk(e) {
            const form = {...this.form};
            let form2= {
                name: form.name,
                cn:form.cn,
                business: form.business,
                owner:form.owner,
                dever:form.dever,
                tester:form.tester,
                opser:form.opser,
                remark:form.remark
            }
            const _this = this
            console.log(form2)
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if(this.updateType==0){
                        this.tabledata.push({...form2})
                    } else {
                      this.tabledata.splice(this.recordData.index,1,{...form2})  
                    }
                    this.tabledata.forEach((item,index)=>{
                        item.index = index
                    })
                    this.item_tabledata = this.tabledata;
                    this.parsedata()
                    this.$refs.ruleForm.resetFields();
                    this.visible = false;
                } else {
                    return false;
                }
            });
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
                                if(tempvalue=='business'){
                                    obj = {
                                        [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
                                    }
                                } else if(tempvalue=='owner' || tempvalue=='dever' || tempvalue=='tester' || tempvalue=='opser'){
                                         obj = {
                                            [tempvalue]: itenmIn['value']=='' || itenmIn['value']== undefined?[]:itenmIn['value'].split(',')
                                        }
                                } else {
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
        handleCancel(e) {
            this.$refs.ruleForm.resetFields();
            this.visible = false;
        },
        parsedata(){
            let arr = []
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){//MULTI-SELECT
                    let obj = {}
                    obj.name = key;
                    switch(key){
                         case 'name' :
                           obj.title = '项目代号'
                            break;
                         case 'cn' :
                           obj.title = '项目名称'
                            break;
                        case 'business' :
                           obj.title = '业务线'
                           obj.value = item[key]!=='' && item[key]!==undefined? item[key].split('/')[0]:'';
                           obj.text = item[key]!=='' && item[key]!==undefined? item[key].split('/')[1]:'';
                           obj.type = 'SELECT'
                            break;
                        case 'owner' :
                           obj.title = '项目负责人' 
                            break;
                        case 'dever' :
                           obj.title = '项目开发负责人' 
                            break;
                        case 'tester' :
                           obj.title = '项目测试负责人' 
                            break;
                        case 'opser' :
                           obj.title = '项目运维负责人' 
                            break;
                        case 'remark' :
                           obj.title = '备注信息' 
                            break;
                    }
                    if(key=='dever' || key=='opser' || key=='owner' || key=='tester'){
                        obj.value = item[key]!=='' && item[key]!==undefined? item[key].join(','):'';
                        obj.text = item[key]!=='' && item[key]!==undefined? item[key].join(','): ''
                        obj.type = 'MULTI-SELECT'
                    } else {
                       if(key !=='business'){
                            obj.text =  item[key]
                            obj.value =  item[key]
                            obj.type = 'INPUT'
                            
                        }
                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
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
                // this[type+'Data'] = res.data.returnMsg
                if(type=='allusers'){
                    let obj = {};
                    let peon = res.data.returnMsg.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                    this.allusersData = peon.slice(0,50)
                    this.allData = peon
                } else {
                     this.businessData = res.data.returnMsg
                }
                // console.log(this[type+'Data'])
            }
            
        },
        showModal(data,type,title) {
            this.visible = true;
            this.title = title
            this.updateType  = type
            this.recordData = data
            if(type==1 || type==2){
                this.form = {
                    ...data
                }
            }
        },
        deleteIndex(data){
            console.log('deleteIndex--data',data)
            this.tabledata.splice(data.index,1)
            this.tabledata.forEach((item,index)=>{
                item.index = index
            })
            this.item_tabledata = {...this.tabledata}
        },
        getArrEqual(arr1, arr2) {
             let newArr = [];
             for (let i = 0; i < arr2.length; i++) {
                 for (let j = 0; j < arr1.length; j++) {
                     if(arr1[j] === arr2[i]){
                         newArr.push(arr1[j]);
                     }
                 }
             }
            return newArr;
        },
        handleChange(value) {
            let newArr = [];
             for (let i = 0; i < columns.length; i++) {
                 for (let j = 0; j < value.length; j++) {
                     if(value[j] === columns[i].key){
                         newArr.push(columns[i]);
                     }
                 }
             }
             this.columns = [...newArr,{
                title: '操作',
                key: 'action',
                width: 180,
                fixed:'right',
                align: 'center',
                scopedSlots: { customRender: 'action' },
            }]
            //  console.log('newArr',newArr)
        },
        setColumn(){
            this.columns.filter(item=>item.key!=='action').forEach(item => {
                this.nowColumns.push(item.key)
            })
        }
    },
    created(){
        this.setColumn()
        // console.log('CMDB_ADDPROJECT--allSteps',this.allSteps)
        // console.log('CMDB_ADDPROJECT--item',this.item)
        // console.log('CMDB_ADDPROJECT--itemstyle',this.itemstyle)
        // console.log('CMDB_ADDPROJECT--subType',this.subType)
        if(this.itemstyle !== 'read'){
            this.getTabledata()
            this.form ={
                name: '',
                cn:'',
                business:undefined,
                owner:[],
                dever:[],
                tester:[],
                opser:[],
                remark:''
            },
            this.getSelectData({},'/v2/ajax/cmdb/listbusiness','business')
            this.getSelectData({},'/v2/ajax/sso/getallusers','allusers')
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

