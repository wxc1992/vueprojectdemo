<template>
    <div>
         <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="55%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="机房" prop="dataCenter">
                     <a-select v-model="form.dataCenter" placeholder="请选择机房" :disabled="updateType==1">
                        <a-select-option value='阿里云/阿里云'>阿里云</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="用途" prop="confUsage">
                    <a-select v-model="form.confUsage" placeholder="请选择用途" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in confUsageData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"   :wrapper-col="{ span: 16}" label="实例付费类型" prop="instanceChargeType">
                    <a-select v-model="form.instanceChargeType" placeholder="请选择实例付费类型" :disabled="updateType==1">
                         <a-select-option value='PrePaid/包月付费'>包月付费</a-select-option>
                         <a-select-option value='PostPaid/按量付费'>按量付费</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="包月时长" prop="period">
                    <a-select v-model="form.period" placeholder="请选择包月时长" :disabled="updateType==1">
                            <a-select-option value='1/1个月'>1个月</a-select-option>
                            <a-select-option value='2/2个月'>2个月</a-select-option>
                            <a-select-option value='3/3个月'>3个月</a-select-option>
                            <a-select-option value='4/4个月'>4个月</a-select-option>
                            <a-select-option value='5/5个月'>5个月</a-select-option>
                            <a-select-option value='6/6个月'>6个月</a-select-option>
                            <a-select-option value='7/7个月'>7个月</a-select-option>
                            <a-select-option value='8/8个月'>8个月</a-select-option>
                            <a-select-option value='9/9个月'>9个月</a-select-option>
                            <a-select-option value='12/1年'>1年</a-select-option>
                            <a-select-option value='24/2年'>2年</a-select-option>
                            <a-select-option value='36/3年'>3年</a-select-option>
                            <a-select-option value='48/4年'>4年</a-select-option>
                            <a-select-option value='60/5年'>5年</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"   :wrapper-col="{ span: 16}" label="是否有额外数据盘需求" prop="includeDataDisks">
                    <a-select v-model="form.includeDataDisks" placeholder="是否有额外数据盘需求" :disabled="updateType==1">
                         <a-select-option value='Y/是'>是</a-select-option>
                         <a-select-option value='N/否'>否</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px" :wrapper-col="{ span: 16}" label="额外数据盘大小(G)" prop="dataDiskSize">
                    <a-input v-model="form.dataDiskSize" placeholder="请输入额外数据盘大小(G)" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="网络付费类型" prop="internetChargeType">
                    <a-select v-model="form.internetChargeType" placeholder="请选择网络付费类型" :disabled="updateType==1">
                         <a-select-option value='PayByBandwidth/按固定带宽计费'>按固定带宽计费</a-select-option>
                         <a-select-option value='PayByTraffic/按使用流量计费'>按使用流量计费</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px" :wrapper-col="{ span: 16}" label="公网出带宽最大值" prop="bandwidthOut">
                    <a-input v-model="form.bandwidthOut" placeholder="请输入公网出带宽最大值" :disabled="updateType==1"/>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="专有网络ID" prop="vpcId">
                    <a-select v-model="form.vpcId" placeholder="请选择专有网络ID" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in vpcIdData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="虚拟交换机ID" prop="vswId">
                    <a-select v-model="form.vswId" placeholder="请选择虚拟交换机ID" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in vswIdData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <!-- var html = get_select_html_from_params({'vpcId':get_select_value_by_name('vpcId')}, false, "/v2/ajax/mcras/aliyun/openapi/describeVswes") -->
                <!-- var html = get_select_html_from_params({'vpcId':get_select_value_by_name('vpcId')}, false, "/v2/ajax/mcras/aliyun/openapi/describeSecurityGroups") -->
                 <a-form-model-item style="margin-bottom:5px"  :wrapper-col="{ span: 16}" label="安全组ID" prop="secgroupIds">
                    <a-select v-model="form.secgroupIds" placeholder="请选择安全组ID" :disabled="updateType==1">
                         <a-select-option
                            v-for="item in secgroupIdsData"
                            v-bind:value="item.id+'/'+item.name"
                            :key="item.id"
                         >
                            {{ item["name"] }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                 <a-form-model-item  style="margin-bottom:5px" :wrapper-col="{ span: 16}" label="实例名称(前缀)" prop="instanceName">
                    <a-input v-model="form.instanceName" placeholder="请输入实例名称(前缀)" :disabled="updateType==1"/>
                </a-form-model-item>
                 <a-form-model-item style="margin-bottom:5px" :wrapper-col="{ span: 16}" label="数量" prop="amount">
                    <a-input v-model="form.amount" placeholder="请输入数量" :disabled="updateType==1"/>
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
           <!-- <span slot="business" slot-scope="business">
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
           </span> -->
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
    title: '机房',
    dataIndex: 'dataCenter',
    key: 'dataCenter',
    width: 100,
  },
  {
    title: '用途',
    dataIndex: 'confUsage',
    key: 'confUsage',
  },
  {
    title: '实例付费类型',
    key: 'instanceChargeType',
    dataIndex: 'instanceChargeType',
  },
 {
    title: '包月时长',
    key: 'period',
    dataIndex: 'period',
    // scopedSlots: { customRender: 'owner' },
  },
  {
    title: '是否有额外数据盘需求',
    key: 'includeDataDisks',
    dataIndex: 'includeDataDisks',
  },
  {
    title: '额外数据盘大小(G)',
    key: 'dataDiskSize',
    dataIndex: 'dataDiskSize',
    // scopedSlots: { customRender: 'dataDiskSize' },
  },
  {
    title: '网络付费类型',
    key: 'internetChargeType',
    dataIndex: 'internetChargeType',
    // scopedSlots: { customRender: 'internetChargeType' },
  },
  {
    title: '公网出带宽最大值',
    key: 'bandwidthOut',
    dataIndex: 'bandwidthOut',
  },
 {
    title: '专有网络ID',
    key: 'vpcId',
    dataIndex: 'vpcId',
  },
   {
    title: '虚拟交换机ID',
    key: 'vswId',
    dataIndex: 'vswId',
  },
 {
    title: '安全组ID',
    key: 'secgroupIds',
    dataIndex: 'secgroupIds',
  },
  {
    title: '实例名称(前缀)',
    key: 'instanceName',
    dataIndex: 'instanceName',
  },
   {
    title: '数量',
    key: 'amount',
    dataIndex: 'amount',
  }
];
const columnsShow = [
 {
    title: '机房',
    dataIndex: 'dataCenter',
    key: 'dataCenter',
    width: 100,
  },
  {
    title: '用途',
    dataIndex: 'confUsage',
    key: 'confUsage',
  },
  {
    title: '实例付费类型',
    key: 'instanceChargeType',
    dataIndex: 'instanceChargeType',
  },
 {
    title: '包月时长',
    key: 'period',
    dataIndex: 'period',
    // scopedSlots: { customRender: 'owner' },
  },
  {
    title: '是否有额外数据盘需求',
    key: 'includeDataDisks',
    dataIndex: 'includeDataDisks',
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
    name:'CMDB_ALIYUN_APPLYECS',
    props: ['allSteps', 'item', 'itemstyle','subType'],
    components:{
        originselect
    },
    data(){
         let checkNumber= (rule, value, callback) => {
            if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }   
        };
        let checkForamte =(rule, value, callback)=>{
             if (value !=='' && !(/(^[A-Za-z][A-Za-z0-9_-]{1,127}$)/.test(value) )) {
                callback(new Error('实例名格式错误：以大小写字母开头，可包含大小写字母、数字、下划线(_)、短划线(-)'));
            } else {
                callback();
            } 
        };
        let checkMax = (rule, value, callback)=>{
             if (value !=='' && parseInt(value,10) > 100) {
                callback(new Error('单次创建不得超过100台'));
            } else {
                callback();
            } 
        }
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            columns:columnsShow,
            columnsSelect: columns,
            tabledata: [],
            item_tabledata:[],
            confUsageData: [],
            allusersData:[],
            vpcIdData: [],
            vswIdData: [],
            form:{
                dataCenter: '阿里云',
                confUsage:undefined,
                instanceChargeType: undefined,
                period:undefined,
                includeDataDisks:undefined,
                dataDiskSize:undefined,
                internetChargeType:undefined,
                bandwidthOut:undefined,
                vpcId:undefined,
                vswId:undefined,
                secgroupIds:undefined,
                instanceName:undefined,
                amount:undefined,
            },
            rules:{
                dataCenter: [
                    { required: true, message: '请选择机房', trigger: 'change' },
                ],
                confUsage: [
                    { required: true, message: '请选择用途', trigger: 'change' },
                ],
                instanceChargeType: [
                    { required: true, message: '请选择实例付费类型', trigger: 'change' },
                ],
                period: [
                    { required: true, message: '请选择包月时长', trigger: 'change' },
                ],
                includeDataDisks: [
                    { required: true, message: '请选择是否有额外数据盘需求', trigger: 'change' },
                ],
                dataDiskSize: [
                    { required: true, message: '请输入额外数据盘大小', trigger: 'change' },
                    { validator: checkNumber, trigger: 'change' },
                ],
                bandwidthOut:[
                    { required: true, message: '请输入公网出带宽最大值', trigger: 'change' },
                    { validator: checkNumber, trigger: 'change' },
                ],
                internetChargeType:[
                    { required: true, message: '请选择网络付费类型', trigger: 'change' },
                ],
                vpcId:[
                    { required: true, message: '请选择专有网络ID', trigger: 'change' },
                ],
                vswId:[
                     { required: true, message: '请选择虚拟交换机ID', trigger: 'change' },
                ],
                secgroupIds:[
                     { required: true, message: '请选择安全组ID', trigger: 'change' },
                ],
                instanceName:[
                     { required: true, message: '请输入实例名称', trigger: 'change' },
                     { validator: checkForamte, trigger: 'change' },
                ],
                amount:[
                     { required: true, message: '请输入数量', trigger: 'change' },
                     {validator: checkMax,trigger: 'change'}
                ]
            },
            loading: false,
            nowColumns:[],
            secgroupIdsData:[],
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
                dataCenter: form.dataCenter,
                confUsage:form.confUsage,
                instanceChargeType: form.instanceChargeType,
                period:form.period,
                includeDataDisks:form.includeDataDisks,
                dataDiskSize:form.dataDiskSize,
                internetChargeType:form.internetChargeType,
                bandwidthOut:form.bandwidthOut,
                vpcId:form.vpcId,
                vswId:form.vswId,
                secgroupIds:form.secgroupIds,
                instanceName:form.instanceName,
                amount:form.amount
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
                                if(
                                    tempvalue=='amount' ||
                                    tempvalue=='instanceName' || 
                                    tempvalue=='dataDiskSize' ||
                                    tempvalue=='bandwidthOut'
                                   ){
                                    obj = {
                                            [tempvalue]: itenmIn['value']
                                        }
                                } else {
                                     obj = {
                                        [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
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
                        case 'dataCenter' :
                           obj.title = '机房'
                            break;
                        case 'amount' :
                           obj.title = '数量'
                            break;
                        case 'instanceName' :
                           obj.title = '实例名称(前缀)'
                            break;
                        case 'dataDiskSize' :
                           obj.title = '额外数据盘大小(G)'
                            break;
                        case 'bandwidthOut' :
                            obj.title = '公网出带宽最大值'
                            break;
                         case 'confUsage' :
                           obj.title = '用途'
                            break;
                        case 'period' :
                           obj.title = '包月时长'
                            break;
                        case 'instanceChargeType' :
                           obj.title = '实例付费类型'
                            break;
                        case 'includeDataDisks' :
                           obj.title = '是否有额外数据盘需求'
                            break;
                        case 'vpcId' :
                            obj.title = '专有网络ID'
                            break;
                        case 'internetChargeType':
                             obj.title = '网络付费类型'
                        case 'vswId' :
                            obj.title = '虚拟交换机ID'
                            break;
                        case 'secgroupIds' :
                            obj.title = '安全组ID'
                            break;
                    }
                    if(key=='internetChargeType' || key=='dataCenter' || key=='secgroupIds' || key=='vswId' || key=='vpcId' || key=='confUsage' || key=='instanceChargeType' || key=='period' || key=='includeDataDisks'){
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
        showModal(data,type,title) {
            this.title = title
            this.updateType  = type
            if(type ==1 || type==2){
                this.recordData = data
                this.form = {
                    ...data
                }
            } 
            this.visible = true;
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
    watch:{
       'form.vpcId'(newVal,oldVal){
            if(this.itemstyle == 'read'){
                return
            }
            console.log('newVal--vpcId',newVal)
            if(newVal==oldVal){
                return 
            }
            if(newVal=='' || newVal==undefined){
                return
            }
            let vpcId = newVal.split('/')[0];
            this.getSelectData({vpcId: vpcId}, "/v2/ajax/mcras/aliyun/openapi/describeVswes",'vswIdData')
            this.getSelectData({vpcId: vpcId}, "/v2/ajax/mcras/aliyun/openapi/describeSecurityGroups",'secgroupIdsData')
        },
    },
    created(){
        this.setColumn()
        if(this.itemstyle !== 'read'){
            this.getTabledata()
            this.getSelectData({},'/v2/ajax/aliyun/ecs/listconf','confUsage')
            this.getSelectData({},'/v2/ajax/mcras/aliyun/openapi/describeVpcs','vpcId')
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

