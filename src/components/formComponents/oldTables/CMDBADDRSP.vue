<template>
    <div>
         <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="40%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="机房" prop="dc">
                    <a-select v-model="form.dc" placeholder="请选择机房" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in listdcData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="集群" prop="cluster">
                     <a-select v-model="form.cluster" placeholder="集群选择前请先选择机房" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in clusterData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"   :wrapper-col="{ span: 16}" label="存储" prop="datastore">
                    <a-select v-model="form.datastore" placeholder="存储选择前请先选择机房" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in datastoreData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目" prop="project">
                     <a-select v-model="form.project" placeholder="请选择项目" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in projectData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="CPU配额" prop="cpu">
                    <a-input v-model="form.cpu" placeholder="请输入CPU配额" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="MEM配额" prop="mem">
                    <a-input v-model="form.mem" placeholder="请输入MEM配额" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="磁盘配额" prop="disk">
                    <a-input v-model="form.disk" placeholder="请输入磁盘配额" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="备注信息" prop="remark">
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
             <!-- <a-button type="primary" size="small" v-if="itemstyle === 'write'" @click="parsedata">
                    提交
            </a-button> -->
         </div>
         <a-table 
            :columns="columns" 
            :loading="loading"
            size="small"
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?500:800) }"
            :pagination="false"
            :data-source="tabledata"
            v-if="itemstyle === 'write'"
          >
           <span slot="dc" slot-scope="dc">
               {{dc?dc.split('/')[1]:''}}
           </span>
           <span slot="cluster" slot-scope="cluster">
               {{cluster?cluster.split('/')[1]:''}}
           </span>
           <span slot="datastore" slot-scope="datastore">
               {{datastore?datastore.split('/')[1]:''}}
           </span>
           <span slot="project" slot-scope="project">
               {{project?project.split('/')[1]:''}}
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
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?500:800) }"
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
import debounce from 'lodash/debounce'
const columns = [
  {
    title: '机房',
    dataIndex: 'dc',
    key: 'dc',
    width: 100,
    scopedSlots: { customRender: 'dc' },
  },
  {
    title: '集群',
    dataIndex: 'cluster',
    key: 'cluster',
    scopedSlots: { customRender: 'cluster' },
  },
  {
    title: '存储',
    key: 'datastore',
    dataIndex: 'datastore',
    scopedSlots: { customRender: 'datastore' },
  },
 {
    title: '项目',
    key: 'project',
    dataIndex: 'project',
    scopedSlots: { customRender: 'project' },
  },
  {
    title: 'CPU配额',
    key: 'cpu',
    dataIndex: 'cpu',
  },
  {
    title: 'MEM配额',
    key: 'mem',
    dataIndex: 'mem',
  },
  {
    title: '磁盘配额',
    key: 'disk',
    dataIndex: 'disk',
  },
  {
    title: '备注信息',
    key: 'remark',
    dataIndex: 'remark',
  }
];
const columnsShow = [
  {
    title: '机房',
    dataIndex: 'dc',
    key: 'dc',
    width: 100,
    scopedSlots: { customRender: 'dc' },
  },
  {
    title: '集群',
    dataIndex: 'cluster',
    key: 'cluster',
    scopedSlots: { customRender: 'cluster' },
  },
  {
    title: '存储',
    key: 'datastore',
    dataIndex: 'datastore',
    scopedSlots: { customRender: 'datastore' },
  },
 {
    title: '项目',
    key: 'project',
    dataIndex: 'project',
    scopedSlots: { customRender: 'project' },
  },
  {
    title: 'CPU配额',
    key: 'cpu',
    dataIndex: 'cpu',
  },
  {
    title: '操作',
    key: 'action',
    fixed:'right',
    width: 180,
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
    name:'CMDB_ADDRSP',
    props: ['allSteps', 'item', 'itemstyle','subType'],
    data(){
        return {
           labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            columns:columnsShow,
            columnsSelect: columns,
            tabledata: [],
            listdcData: [],
            clusterData:[],
            datastoreData:[],
            projectData:[],
            allusersData:[],
            form:{
                dc: undefined,
                remark:'',
                cluster: undefined,
                datastore: undefined,
                project: undefined,
                cpu: undefined,
                mem: undefined,
                disk: undefined

            },
            rules:{
                dc: [
                    { required: true, message: '请选择机房', trigger: 'change' },
                ],
                cluster: [
                    { required: true, message: '请选择集群', trigger: 'change' },
                ],
                datastore: [
                    { required: true, message: '请选择存储', trigger: 'change' },
                ],
                project: [
                    { required: true, message: '请选择项目', trigger: 'change' },
                ],
            },
            loading: false,
            nowColumns:[],
            visible: false,
            editdata:{},
            allData:[],
            item_tabledata: [],
            title:'',
            recordData: {},
            updateType: ''
        }
    },
    watch:{
        'form.dc'(val){
             if(this.itemstyle == 'read'){
                 return
             }
            console.log(val)
            this.getSelectData({dcid: val}, "/v2/ajax/cmdb/listcluster",'cluster')
            this.getSelectData({dcid: val}, "/v2/ajax/cmdb/listdatastore",'datastore')
        }
    },
    methods:{
        ...mapActions(['_getSelectOptions']),
        handleOk(e) {
            console.log('form',{...this.form})
            const _this = this
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if(this.updateType==0){
                        this.tabledata.push({...this.form})
                    } else {
                      this.tabledata.splice(this.recordData.index,1,{...this.form})  
                    }
                    this.tabledata.forEach((item,index)=>{
                        item.index = index
                    })
                    this.item_tabledata = this.tabledata;
                    this.parsedata();
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
                                if(
                                    tempvalue=='dc' ||
                                    tempvalue=='cluster' || 
                                    tempvalue=='datastore' ||
                                    tempvalue=='project'){
                                        obj = {
                                            [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
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
        parsedata(){
            let arr = []
            console.log('this.item_tabledata',this.item_tabledata)
            let arr2 = [
                {
                    cluster: "9/WXDCP01",
                    cpu: "6",
                    datastore: "11/WXDCP01",
                    dc: "2/万向",
                    disk: "8",
                    mem: "7",
                    project: "18/Olympus",
                    remark: "YYYY",
                },
                {
                    cluster: "9/WXDCP01",
                    cpu: "5",
                    datastore: "11/WXDCP01",
                    dc: "2/万向",
                    disk: "3",
                    mem: "4",
                    project: "31/Chicago",
                    remark: "22222",
                }
            ]
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                    switch(key){
                         case 'dc' :
                           obj.title = '机房' 
                            break;
                         case 'cluster' :
                           obj.title = '集群' 
                            break;
                        case 'datastore' :
                           obj.title = '存储' 
                            break;
                        case 'project' :
                           obj.title = '项目' 
                            break;
                        case 'cpu' :
                           obj.title = 'CPU配额' 
                            break;
                        case 'mem' :
                           obj.title = 'MEM配额' 
                            break;
                        case 'disk' :
                           obj.title = '磁盘配额' 
                            break;
                        case 'remark' :
                           obj.title = '备注信息' 
                            break;
                    }
                    if(key=='dc' || key =='project' || key =='cluster' || key =='datastore'){
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                        obj.type = 'SELECT'
                    } else {
                        obj.value =  item[key]
                        obj.type = 'INPUT'
                        obj.text = item[key]
                        
                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
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
            // console.log('res'+type,res)
            if(res.status === 200 && res.data.returnCode==0){
                this[type+'Data'] = res.data.returnMsg
            }
            
        },
        showModal(data,type,title) {
            // console.log('data',data)
            this.visible = true;
            this.title = title
            this.updateType  = type
            this.recordData = data
            if(type==1 || type==2){
                this.form = {...data}
                // this.form.dc = (data.dc.split('/')[0]).toString()
                // this.form.cluster = data.cluster.split('/')[0]
                // this.form.datastore = data.datastore.split('/')[0]
                // this.form.project = data.project.split('/')[0]
            }
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
                fixed:'right',
                width: 180,
                align: 'center',
                scopedSlots: { customRender: 'action' },
            }]
             console.log('newArr',newArr)
        },
        setColumn(){
            this.columns.filter(item=>item.key!=='action').forEach(item => {
                this.nowColumns.push(item.key)
            })
        }
    },
    computed:{
        tableDataRead(){
            let tableDa = []
            if(this.itemstyle=="read"){
                // console.log('item-read-rtable',this.item)
                let arr = JSON.parse(this.item.item_value)
                // console.log('item-read-rtable-arr----cpu',arr)
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
                        let obj2 = Object.assign(warpObj,...arrIn)
                        tableDa.push({...obj2})
                        // console.log('item-read-rtable-arr-warpObj',warpObj)
                })
                    
                    // console.log('item-read-rtable-tableArr',tableArr)

            }

            return tableDa;
        }
    },
    created(){
        this.setColumn()
        // console.log('CMDB_ADDRSP--allSteps',this.allSteps)
        // console.log('CMDB_ADDRSP--item',this.item)
        // console.log('CMDB_ADDRSP--itemstyle',this.itemstyle)
        // console.log('CMDB_ADDRSP--subType',this.subType)
         if(this.itemstyle !== 'read'){
             this.getTabledata()
             this.form ={
                dc: undefined,
                remark:'',
                cluster: undefined,
                datastore: undefined,
                project: undefined,
                cpu: undefined,
                mem: undefined,
                disk: undefined

            }
            this.getSelectData({},"/v2/ajax/cmdb/listdc",'listdc')
            this.getSelectData({},"/v2/ajax/cmdb/listproject",'project')
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

