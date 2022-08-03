
<template>
    <div>
         <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="40%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="项目" prop="rsp">
                    <a-select v-model="form.rsp" placeholder="请选择项目" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in rspData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="镜像" prop="image">
                     <a-select v-model="form.image" placeholder="请选择镜像" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in imageData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"   :wrapper-col="{ span: 16}" label="规格" prop="size">
                    <a-select v-model="form.size" placeholder="请选择规格" :disabled="updateType==1">
                        <a-select-option value='2c-2g-40g'>2c-2g-40g</a-select-option>
                        <a-select-option value='4c-4g-40g'>4c-4g-40g</a-select-option>
                        <a-select-option value='1c-1g-40g'>1c-1g-40g</a-select-option>
                        <a-select-option value='8c-8g-40g'>8c-8g-40g</a-select-option>
                        <a-select-option value='8c-16g-40g'>8c-16g-40g</a-select-option>
                        <a-select-option value='8c-32g-40g'>8c-32g-40g</a-select-option>
                        <a-select-option value='4c-8g-40g'>4c-8g-40g</a-select-option>
                        <a-select-option value='8c-64g-40g'>8c-64g-40g</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="用途" prop="useto">
                     <a-select v-model="form.useto" placeholder="请选择用途" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in usetoData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="环境" prop="env">
                     <a-select v-model="form.env" placeholder="请选择环境" :disabled="updateType==1">
                         <a-select-option value='T/测试'>测试</a-select-option>
                         <a-select-option value='R/容灾'>容灾</a-select-option>
                         <a-select-option value='D/研发'>研发</a-select-option>
                         <a-select-option value='I/集成环境'>集成环境</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="区域" prop="zone">
                    <a-select v-model="form.zone" placeholder="请选择区域" :disabled="updateType==1">
                        <a-select-option value='A/互联网互访'>互联网互访</a-select-option>
                        <a-select-option value='B/互联网只出不进'>互联网只出不进</a-select-option>
                        <a-select-option value='C/互联网只进不出'>互联网只进不出</a-select-option>
                        <a-select-option value='D/与互联网隔离'>与互联网隔离</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="指定网段" prop="specificpool">
                    <a-select v-model="form.specificpool" placeholder="请先选择项目 镜像 用途" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in specificpoolData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="是否有额外硬盘需求" prop="otherdisk">
                    <a-select v-model="form.otherdisk" :placeholder="updateType==1?'':'请选择是否有额外硬盘需求'" :disabled="updateType==1">
                        <a-select-option value='Y/是'>是</a-select-option>
                        <a-select-option value='N/否'>否</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="额外硬盘大小(G)" prop="disk">
                    <a-input v-model="form.disk" :placeholder="updateType==1?'':'额外硬盘大小(G)'" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="是否开机" prop="openvm">
                    <a-select v-model="form.openvm" placeholder="请选择是否开机" :disabled="updateType==1">
                        <a-select-option value='Y/是'>是</a-select-option>
                        <a-select-option value='N/否'>否</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="使用期限(月)" prop="time">
                    <a-input v-model="form.time" placeholder="请输入使用期限" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="数量" prop="number">
                    <a-input v-model="form.number" placeholder="请输入数量" :disabled="updateType==1"/>
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
            :pagination="false"
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?500:800) }"
            size="small"
            v-if="itemstyle === 'write'"
            :data-source="tabledata" 
          >
           <span slot="rsp" slot-scope="rsp">
               {{rsp?rsp.split('/')[1]:''}}
           </span>
           <span slot="image" slot-scope="image">
               {{image?image.split('/')[1]:''}}
           </span>
           <span slot="useto" slot-scope="useto">
               {{useto?useto.split('/')[1]:''}}
           </span>
           <span slot="env" slot-scope="env">
               {{env?env.split('/')[1]:''}}
           </span>
           <span slot="zone" slot-scope="zone">
               {{zone?zone.split('/')[1]:''}}
           </span>
           <span slot="specificpool" slot-scope="specificpool">
               {{specificpool?specificpool.split('/')[1]:''}}
           </span>
           <span slot="otherdisk" slot-scope="otherdisk">
               {{otherdisk?otherdisk.split('/')[1]:''}}
           </span>
           <span slot="openvm" slot-scope="openvm">
               {{openvm?openvm.split('/')[1]:''}}
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
            v-if="itemstyle === 'read'"
            size="small"
            :scroll="{ x: columns.length>6?1300:(columns.length<=4?500:800) }"
            :pagination="false"
            :data-source="tableDataRead" 
          >
            <span slot="action" slot-scope="scope">
                <a-button type="primary" size="small" @click="showModal(scope,1,'查看')">
                    查看
                </a-button>
            </span>
        </a-table>
        <div  style="margin-top:10px">
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
    title: '项目',
    dataIndex: 'rsp',
    key: 'rsp',
    width: 100,
    scopedSlots: { customRender: 'rsp' },
  },
  {
    title: '镜像',
    dataIndex: 'image',
    key: 'image',
    scopedSlots: { customRender: 'image' },
  },
  {
    title: '规格',
    key: 'size',
    dataIndex: 'size',
    scopedSlots: { customRender: 'size' },
  },
 {
    title: '用途',
    key: 'useto',
    dataIndex: 'useto',
    scopedSlots: { customRender: 'useto' },
  },
 {
    title: '环境',
    key: 'env',
    dataIndex: 'env',
    scopedSlots: { customRender: 'env' },
  },
  {
    title: '区域',
    key: 'zone',
    dataIndex: 'zone',
    scopedSlots: { customRender: 'zone' },
  },
 {
    title: '指定网段',
    key: 'specificpool',
    dataIndex: 'specificpool',
    scopedSlots: { customRender: 'specificpool' },
  },
  {
    title: '是否有额外硬盘需求',
    key: 'otherdisk',
    dataIndex: 'otherdisk',
    scopedSlots: { customRender: 'otherdisk' },
  },
   {
    title: '是否开机',
    key: 'openvm',
    dataIndex: 'openvm',
    scopedSlots: { customRender: 'openvm' },
  },

  {
    title: 'time',
    key: '使用期限(月)',
    dataIndex: '使用期限(月)',
  },
  {
    title: '数量',
    key: 'number',
    dataIndex: 'number',
  }
];
const columnsShow = [
   {
    title: '项目',
    dataIndex: 'rsp',
    key: 'rsp',
    width: 100,
    scopedSlots: { customRender: 'rsp' },
  },
  {
    title: '镜像',
    dataIndex: 'image',
    key: 'image',
    scopedSlots: { customRender: 'image' },
  },
  {
    title: '规格',
    key: 'size',
    dataIndex: 'size',
    scopedSlots: { customRender: 'size' },
  },
 {
    title: '用途',
    key: 'useto',
    dataIndex: 'useto',
    scopedSlots: { customRender: 'useto' },
  },
 {
    title: '环境',
    key: 'env',
    dataIndex: 'env',
    scopedSlots: { customRender: 'env' },
  },
  {
    title: '区域',
    key: 'zone',
    dataIndex: 'zone',
    scopedSlots: { customRender: 'zone' },
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
    name:'CMDB_APPLYVM',
    props: ['allSteps', 'item', 'itemstyle','subType'],
    data(){
        let checkNumber= (rule, value, callback) => {
            if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }   
        };
        let checkDisk = (rule, value, callback) => {
            if(value=='' || value==undefined){
               callback(); 
            }
            if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }   
        };
        return {
           labelCol: { span: 8 },
            wrapperCol: { span: 14 },
            columns:columnsShow,
            columnsSelect: columns,
            tabledata: [],
            rspData:[],
            sizeData:[],
            usetoData:[],
            specificpoolData:[],
            imageData: [],
            form:{
                rsp: undefined,
                image:undefined,
                size: undefined,
                useto: undefined,
                env: undefined,
                zone: undefined,
                specificpool: undefined,
                otherdisk: undefined,
                openvm: undefined,
                time: undefined,
                number: undefined

            },
            rules:{
                rsp: [
                    { required: true, message: '请选择项目', trigger: 'change' },
                ],
                image: [
                    { required: true, message: '请选择镜像', trigger: 'change' },
                ],
                size: [
                    { required: true, message: '请选择规格', trigger: 'change' },
                ],
                useto: [
                    { required: true, message: '请选择用途', trigger: 'change' },
                ],
                env: [
                    { required: true, message: '请选择环境', trigger: 'change' },
                ],
                zone: [
                    { required: true, message: '请选择区域', trigger: 'change' },
                ],
                specificpool: [
                    { required: true, message: '请选择指定网段', trigger: 'change' },
                ],
                otherdisk: [
                    { required: true, message: '请选择是否有额外硬盘需求', trigger: 'change' },
                ],
                disk: [
                    { required: false},
                    { validator: checkDisk, trigger: 'change' },
                ],
                time: [
                    { required: true,message: '请输入时间', trigger: 'change'},
                    { validator: checkNumber, trigger: 'change' },
                ],
                number: [
                    { required: true,message: '请输入数量', trigger: 'change'},
                    { validator: checkNumber, trigger: 'change' },
                ],
                openvm: [
                     { required: true, message: '请选择是否开机', trigger: 'change' },
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
        // rsp: 34
        // zone: A
        // useto: K8M
        'form.rsp'(newVal,oldVal){
            if(this.itemstyle == 'read'){
                return
            }
            console.log('newVal--rsp',newVal)
            if(newVal==oldVal){
                return 
            }
            if(newVal=='' || newVal==undefined){
                return
            }
            let rsp = newVal.split('/')[0];
            let useto = this.form.useto=='' ||  this.form.useto== undefined?'':this.form.useto.split('/')[0];
            let zone = this.form.zone=='' ||  this.form.zone== undefined?'':this.form.zone.split('/')[0]
             console.log('rsp',rsp)
            this.getSelectData({rsp: rsp,zone: zone,useto: useto}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
           
        },
        'form.zone'(newVal,oldVal){
            if(this.itemstyle == 'read'){
                return
            }
           console.log('newnewVale',newVal,oldVal)
            if(newVal==oldVal){
                return 
            }
            if(newVal=='' || newVal==undefined){
                return
            }
              let zone = newVal.split('/')[0];
               console.log('newnewVale',zone)
              let useto = this.form.useto=='' ||  this.form.useto== undefined?'':this.form.useto.split('/')[0];
              let rsp = this.form.rsp=='' ||  this.form.rsp== undefined?'':this.form.rsp.split('/')[0];

           this.getSelectData({zone: zone,rsp: rsp,useto: useto}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
        },
        'form.useto'(newVal,oldVal){
            if(this.itemstyle == 'read'){
                return
            }
            console.log('useto',newVal,oldVal)
             if(newVal==oldVal){
                return 
            }
            if(newVal=='' || newVal==undefined){
                return
            }
            let useto = newVal.split('/')[0];
            let rsp = this.form.rsp=='' ||  this.form.rsp== undefined?'':this.form.rsp.split('/')[0];
            let zone = this.form.zone=='' ||  this.form.zone== undefined?'':this.form.zone.split('/')[0]

            this.getSelectData({useto: useto,zone:zone,rsp: rsp,}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
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
                    this.parsedata()
                    this.$refs.ruleForm.resetFields();
                    this.visible = false;
                } else {
                    return false;
                }
            });
            
        },
        parsedata(){
            let arr = []
            // disk: undefined
            // env: "I/集成环境"
            // image: "5/Ubuntu-16.04"
            // index: 0
            // number: "5"
            // openvm: "Y/是"
            // otherdisk: "N/否"
            // rsp: "25/Olympus"
            // size: "4c-4g-40g"
            // specificpool: "-1/使用默认分配策略"
            // time: "5"
            // useto: "K8N/k8s-node"
            // zone: "B/互联网只出不进"
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                     switch(key){
                         case 'rsp' :
                           obj.title = '项目' 
                            break;
                         case 'image' :
                           obj.title = '镜像' 
                            break;
                         case 'size' :
                           obj.title = '规格' 
                            break;
                        case 'useto' :
                           obj.title = '用途' 
                            break;
                        case 'env' :
                           obj.title = '环境' 
                            break;
                        case 'zone' :
                           obj.title = '区域' 
                            break;
                        case 'specificpool' :
                           obj.title = '指定网段' 
                            break;
                        case 'otherdisk' :
                           obj.title = '是否有额外硬盘需求' 
                            break;
                        case 'disk' :
                           obj.title = '额外硬盘大小(G)'
                            break;
                        case 'openvm' :
                           obj.title = '是否开机' 
                            break;
                        case 'time' :
                           obj.title = '使用期限(月)' 
                            break;
                        case 'number' :
                           obj.title = '数量'
                            break;
                    }
                    if(
                        key=='env' || 
                        key =='image' || 
                        key =='openvm' || 
                        key =='otherdisk' ||
                        key =='rsp' ||
                        key =='specificpool' ||
                        key =='useto' ||
                        key =='zone' 
                        ){
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
                                    tempvalue=='rsp' ||
                                    tempvalue=='image' || 
                                    tempvalue=='useto' ||
                                    tempvalue=='env' ||
                                    tempvalue=='zone'||
                                    tempvalue=='specificpool'||
                                    tempvalue=='otherdisk'||
                                    tempvalue=='openvm'){
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
            console.log('data',data)
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
        
                width: 180,
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
    computed:{
        tableDataRead(){
            let tableDa = []
            if(this.itemstyle=="read"){
                console.log('item-read-rtable',this.item)
                let arr = JSON.parse(this.item.item_value)
                console.log('item-read-rtable-arr',arr)
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
                        let obj2= Object.assign(warpObj,...arrIn)
                        tableDa.push({...obj2})
                        console.log('item-read-rtable-arr-warpObj',warpObj)
                })
                    
                    // console.log('item-read-rtable-tableArr',tableArr)

            }

            return tableDa;
        }
    },
    created(){
        this.setColumn()
        // console.log('CMDB_APPLYVM--allSteps',this.allSteps)
        // console.log('CMDB_APPLYVM--item',this.item)
        // console.log('CMDB_APPLYVM--itemstyle',this.itemstyle)
        // console.log('CMDB_APPLYVM--subType',this.subType)
        if(this.itemstyle !== 'read'){
                this.getTabledata()
                this.form ={
                rsp: undefined,
                image:undefined,
                size: undefined,
                useto: undefined,
                env: undefined,
                zone: undefined,
                specificpool: undefined,
                otherdisk: undefined,
                openvm: undefined,
                time: undefined,
                number: undefined

            }
                this.getSelectData({}, "/v2/ajax/cmdb/listrsp",'rsp')
                this.getSelectData({}, "/v2/ajax/cmdb/listimage",'image')
                this.getSelectData({}, "/v2/ajax/cmdb/listdeviceusage",'useto')
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

