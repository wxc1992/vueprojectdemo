<template>
    <div class="tableComponent">
        <a-modal v-model="visible" :maskClosable="false" :title="title" on-ok="handleOk" width="40%" :selfUpdate='true' @cancel="handleCancel">
            <a-form-model
                ref="ruleForm"
                :model="form"
                :label-col="labelCol" 
                :rules="rules"
            >
                <a-form-model-item
                    v-for="(item,index) in formConfigTables"
                    :key="index"
                    style="margin-bottom:5px"  
                    :wrapper-col="{ span: 16}" 
                    :label="item.label"
                    :prop="item.prop">
                    <template>
                        <template v-if="item.type=='a-input'">
                            <a-input v-model="form[item.prop]" :placeholder="item.placeholder?item.placeholder:'请输入'+item.label" :disabled="updateType==1"/>
                        </template>
                        <template v-if="item.dependOn">
                            <template v-if="item.type=='a-select' && !item.defaulOptions">
                                <template 
                                    v-if=" item.prop == 'vswId' ||
                                    item.prop == 'secgroupIds' ||
                                    item.prop == 'image' ||
                                    item.prop == 'device' ">
                                    <a-select v-model="form[item.prop]"  :showSearch="item.showSearch" :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请先选择'+item.dependOnName" :disabled="updateType==1">
                                        <a-select-option
                                            v-for="option in selectData[item.options]"
                                            v-bind:value="option.name"
                                            :key="option.id"
                                        >
                                            {{ option["name"] }}
                                        </a-select-option>
                                    </a-select>
                                </template>
                                <template v-else>
                                    <a-select v-model="form[item.prop]"  :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请先选择'+item.dependOnName" :disabled="updateType==1">
                                        <a-select-option
                                            v-for="option in selectData[item.options]"
                                            v-bind:value="option.id+'/'+option.name"
                                            :key="option.id"
                                        >
                                            {{ option["name"] }}
                                        </a-select-option>
                                    </a-select>
                                </template>
                            </template>
                        </template>
                        <template v-if="!item.dependOn">
                            <template v-if="item.type =='a-select' && item.defaulOptions && item.defaulOptions.length>0">
                                <a-select v-if="item.prop!=='effectZone'" a-select v-model="form[item.prop]" :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请选择'+item.label" :disabled="updateType==1">
                                    <a-select-option  
                                        :value='option.id' 
                                        v-for="option in item.defaulOptions" 
                                        :key="option.id"
                                        >
                                        {{option.name}}
                                    </a-select-option>
                                </a-select>
                                 <a-select v-if="item.prop =='effectZone'" a-select v-model="form[item.prop]" :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请选择'+item.label" :disabled="updateType==1">
                                    <a-select-option  
                                        :value='option.id+"/"+option.name' 
                                        v-for="option in item.defaulOptions" 
                                        :key="option.id"
                                        >
                                        {{option.name}}
                                    </a-select-option>
                                </a-select>
                            </template>
                            <!-- 如果 item.type=='a-select' 后端的需要name 作为提交值  v-bind:value="option.name"-->
                            <template v-if="item.type=='a-select' && !item.defaulOptions">
                                <div  
                                    v-if="item.prop == 'instanceChargeType' ||
                                    item.prop == 'resourceGroup' ||
                                    item.prop == 'vpcId' ||
                                    (item.prop == 'project' && item.options == 'costProjectData')
                                    ">
                                    <a-select v-model="form[item.prop]"  :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请选择'+item.label" :disabled="updateType==1">
                                        <a-select-option
                                            v-for="option in selectData[item.options]"
                                            v-bind:value="option.name"
                                            :key="option.name"
                                        >
                                            {{ option["name"] }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <!-- 如果item.type=='a-select' 后端的需要id 作为提交值  v-bind:value="option.id+'/'+option.name" -->
                                <div v-else>
                                    <a-select v-model="form[item.prop]"  :mode="item.multiple?'multiple':''" :placeholder="updateType==1?'':'请选择'+item.label" :disabled="updateType==1">
                                        <a-select-option
                                            v-for="option in selectData[item.options]"
                                            v-bind:value="option.id+'/'+option.name"
                                            :key="option.id"
                                        >
                                            {{ option["name"] }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </template>
                        </template>
                        <template v-if="item.type=='a-select-input'">
                            <originselect :formmodel="form[item.prop]" :updateType="updateType" @senduser="(value)=>{form[item.prop] = value }"/>
                        </template>
                    </template>
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">
                    取消
                </a-button>
                <a-button key="submit" type="primary"  @click="handleOk" v-if="itemstyle === 'write'">
                    确定
                </a-button>
                <a-button  
                    key="submit" 
                    type="primary"  
                    @click="handleOk" 
                    v-if="( itemstyle === 'read' &&
                            allSteps.status !== 'FAILED' && 
                            allSteps.status !== 'SUCCESSFUL'&& 
                            (subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO' || subType == 'CMDB_ALIYUN_APPLYECS'))
                    ">
                    更新
                </a-button>
                
            </template>
        </a-modal>
        <div style="text-align: right">
            <a-button type="primary" size="small"  v-if="itemstyle === 'write'" @click="showModal({...form},0,'新增')">
                    新增
            </a-button>
             <!-- <a-button type="primary" size="small"  
             v-if="
             ((itemstyle === 'write' || itemstyle === 'read') && (subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO' || subType == 'CMDB_ALIYUN_APPLYECS')) &&
              allSteps.status !== 'FAILED' && 
              allSteps.status !== 'SUCCESSFUL'
             " 
             @click="showModal({...form},0,'新增')">
                    新增
            </a-button> -->
        </div>
        <div v-if="itemstyle === 'write' && subType !=='CMDB_ALIYUN_APPLYECS_COSTRATIO' && subType !== 'CMDB_ALIYUN_APPLYECS'">
             <a-table 
                :columns="tablecolumns" 
                :pagination="false"
                :loading="loading"
                size="small"
                :scroll="{ x: tablecolumns.length>6?1300:(tablecolumns.length<=4?500:800) }"
                :data-source="tabledata"
            >
              
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
                 <span slot="device" slot-scope="device">
                    {{device!==undefined && device!==''?device.join(','):''}}
                </span>
                <span slot="dcid" slot-scope="dcid">
                    {{dcid?dcid.split('/')[1]:''}}
                </span>
                 <span slot="rsp" slot-scope="rsp">
                    {{rsp?rsp.split('/')[2]:''}}
                </span>
                <span slot="business" slot-scope="business">
                    {{business?business.split('/')[1]:''}}
                </span>
                <span slot="dc" slot-scope="dc">
                    {{dc?dc.split('/')[1]:''}}
                </span>
                <span slot="cluster" slot-scope="cluster">
                    {{cluster?cluster.split('/')[1]:''}}
                </span>
                <span slot="datastore" slot-scope="datastore">
                    {{datastore?datastore.split('/')[1]:''}}
                </span>
                 <span slot="image" slot-scope="image">
                    {{image?image.split('/')[1]:''}}
                </span>
                 <span slot="project" slot-scope="project">
                    {{project?project.split('/')[1]:''}}
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
                <span slot="includeDataDisks" slot-scope="includeDataDisks">
                    {{includeDataDisks?includeDataDisks.split('/')[1]:''}}
                </span>
                 <span slot="eip" slot-scope="eip">
                    {{eip?eip.split('/')[1]:''}}
                </span>
                <!-- <span slot="internetChargeType" slot-scope="internetChargeType">
                    {{internetChargeType?internetChargeType.split('/')[1]:''}}
                </span> -->
                <span slot="period" slot-scope="period">
                    {{period?period.split('/')[1]:''}}
                </span>
                 <span slot="effectZone" slot-scope="effectZone">
                    {{effectZone?effectZone.split('/')[1]:''}}
                </span>
                <!-- <span slot="confUsage" slot-scope="confUsage">
                    {{confUsage?confUsage.split('/')[1]:''}}
                </span> -->
                <span slot="action" slot-scope="scope">
                    <a-button type="primary" size="small"  @click="showModal(scope,1,'查看')">
                        查看
                    </a-button>
                    <a-button type="primary" size="small"  style="margin: 0 5px" @click="deleteIndex(scope)"> 
                        删除
                    </a-button>
                    <a-button type="primary" size="small"  @click="showModal(scope,2,'编辑')">
                        编辑
                    </a-button>
                </span>
            </a-table>
        </div>
      
         <!-- 如果
            itemstyle === 'read' ||   itemstyle === 'write' && 
            当前的表格'CMDB_ALIYUN_APPLYECS_COSTRATIO' 或者'CMDB_ALIYUN_APPLYECS' 是阿里云相关的话 
            而且 allSteps.status !== 'FAILED' &&  allSteps.status !== 'SUCCESSFUL' 
            就让他可以编辑  -->
        <div v-else-if="(itemstyle === 'read' || itemstyle === 'write') && 
            ( subType == 'CMDB_ALIYUN_APPLYECS_COSTRATIO' ||  subType == 'CMDB_ALIYUN_APPLYECS') &&
             allSteps.status !== 'FAILED' &&  allSteps.status !== 'SUCCESSFUL'
        ">
             <a-table 
                :columns="tablecolumns" 
                :pagination="false"
                :loading="loading"
                size="small"
                :scroll="{ x: tablecolumns.length>6?1300:(tablecolumns.length<=4?500:800) }"
                :data-source="tabledata"
            >
                <!-- <span slot="instanceChargeType" slot-scope="instanceChargeType">
                    {{instanceChargeType?instanceChargeType.split('')[1]:''}}
                </span> -->
                <span slot="includeDataDisks" slot-scope="includeDataDisks">
                    {{includeDataDisks?includeDataDisks.split('/')[1]:''}}
                </span>
                 <span slot="eip" slot-scope="eip">
                    {{eip?eip.split('/')[1]:''}}
                </span>
                <span slot="internetChargeType" slot-scope="internetChargeType">
                    {{internetChargeType?internetChargeType.split('/')[1]:''}}
                </span>
                <span slot="period" slot-scope="period">
                    {{period?period.split('/')[1]:''}}
                </span>
                <span slot="effectZone" slot-scope="effectZone">
                    {{effectZone?effectZone.split('/')[1]:''}}
                </span>
                <!-- <span slot="confUsage" slot-scope="confUsage">
                    {{confUsage?confUsage.split('/')[1]:''}}
                </span> -->
                
                <span slot="action" slot-scope="scope">
                    <a-button v-if="itemstyle === 'write'" type="primary" size="small"  @click="showModal(scope,1,'查看')">
                        查看
                    </a-button>
                    <a-button  v-if="itemstyle === 'write'" type="primary" size="small"  style="margin: 0 5px" @click="deleteIndex(scope)"> 
                        删除
                    </a-button>
                    <a-button type="primary" size="small"  @click="showModal(scope,2,itemstyle === 'write'?'编辑':'更新')">
                        {{itemstyle === 'write'?'编辑':'更新'}}
                    </a-button>
                </span>
            </a-table>
        </div>
        <a-table 
            :columns="tablecolumns" 
            :loading="loading"
            size="small"
            :pagination="false"
             v-else
            :data-source="tableDataRead"
            :scroll="{ x: tablecolumns.length>6?1300:(tablecolumns.length<=4?500:800) }"
          >
            <span slot="rsp" slot-scope="rsp">
                {{rsp?rsp.split('/')[1]:''}}
            </span>
            <span slot="action" slot-scope="scope">
                <a-button type="primary" size="small" @click="showModal(scope,1,'查看')">
                    查看
                </a-button>
            </span>
        </a-table>
         <div  style="margin:10px auto">
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
import {mapActions} from 'vuex';
import originselect from '../originselect.vue'
export default {
     components:{
        originselect
    },
    props:['columns','allSteps', 'item', 'itemstyle','subType','columnsShow','formConfigTable','formRulesTable'],
    created(){
        this.columnsSelect = [...this.columns]
        this.tablecolumns= [...this.columnsShow]
        console.log('this.formConfigTable',this.allSteps);
        this.setColumn()
        this.innitStateData()
        
        this.rules = {...this.formRulesTable}
        let arr = []
        if(this.subType =='CMDB_ALIYUN_APPLYECS'){
            this.formConfigTable.forEach(item=>{
                if(item.Vif){
                    let obj = JSON.parse(item.Vif);
                    if(this.itemstyle !== obj.itemstyle){
                        return
                    }
                }
                arr.push(item)
            })
             this.formConfigTables = [...arr];
             console.log('formConfigTable', this.formConfigTables)
        } else {
             this.formConfigTables = [...this.formConfigTable];
        }
        this.innitFormProps()
        if(this.allSteps.status !== 'FAILED' &&  this.allSteps.status !== 'SUCCESSFUL'){
            this.getTabledata()
            // this.getSelectData()
        }
    },
    data(){
        return {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
            loading: false,
            tabledata: [],
            nowColumns:[],
            columnsSelect: [],
            tablecolumns: [],
            item_tabledata:[],
            visible: false,
            title:'',
            updateType: '',
            recordData: {},
            form:{},
            updateVps: true,
            rules:{},
            formConfigTables: [],
            showDataObj:{},
            selectData:{
                // allusersData: [] ,// 所有用户
                // businessData: [],//  业务线 下拉
                // //JUMPER_APPLY
                // deviceData: [],
                // //CMDB_APPLYVM 项目
                // rspData: [],
                // imageData: [],
                // usetoData: [],
                // specificpoolData: [],

                // //CMDB_ADDRSP
                // listdcData: [],
                // clusterData: [],
                // datastoreData: [],
                // projectData: [],
                // dependProps: {

                // },
                //  //CMDB_ALIYUN_APPLYECS
                // confUsageData: [],
                // vpcIdData: [],
                // //CMDB_ALIYUN_APPLYECS_COSTRATIO
                // costProjectData :[]
            },
            
        }
    },
    methods:{
        ...mapActions(['_getSelectOptions','_updateCMDBtable',"_getSelectOptionsdecode"]),
        innitStateData(){ 
            //初始化 selectData  把我们需要设置的响应式 options 代表 拿过来 
            // options: 'projectData', 例如这  我们需要在 我们当前的实例里面添加 projectData 作为下拉数据的存储方
             let obj = {}
             let showData= {}
            this.formConfigTable.forEach(item=>{
                for(let key in item){
                    if(key=='options' && item.options !==''  && item.options!== undefined){
                         obj[item.options] = []
                    }
                    if(key == 'isShow'){
                        let shows = {...item.isShow}
                       for(let ele in shows){
                           showData[ele] = shows[ele]
                       }
                    }

                }
               
            })
            this.showDataObj = {...showData}
            console.log('showData',this.showDataObj )
            this.selectData = {...obj}
        },
        handleCancel(e) {
            if(this.subType =='CMDB_ALIYUN_APPLYECS'){
                this.updateVps = false
            }
            this.$refs.ruleForm.resetFields();
            this.visible = false;
        },
        innitFormProps(){
            let obj = {}
            this.formConfigTable.forEach(item=>{
                for(let key in item){
                    if(key=='prop'){
                         obj[item.prop] = item.defaultValue?item.defaultValue:undefined
                    }
                }
            })
            this.form = {...obj}
             if(this.allSteps.status !== 'FAILED' &&  this.allSteps.status !== 'SUCCESSFUL'){
                // this.getTabledata()
                this.getSelectData()
            }
        },
        async handleOkUpdate(){
            console.log('this,form',this.form)
            // let params = {
            //     id: this.item.id,
            //     item_value: this.item.item_value
            // }
            // try{
            //     const res = await this._updateCMDBtable(params)
            //     if(res.status === 200){
            //         this.$message.success(this.item.show_name+'更新成功')
            //         this.$emit('sendUpdateEdittable',true)
            //          this.handleCancel()
            //     }
            // }catch(error){
            //     this.$message.error('更新表单失败')
            // }
           

        },
        getTabledata(){
            this.tabledata = []
            const _this = this
            if(this.item.item_value==''){
                this.tabledata = []
            } else {
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
                            if(_this.subType == 'CMDB_ADDPROJECT'){
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
                                
                            } else if(_this.subType =='CMDB_ADDRSP'){
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
                            } else if(_this.subType =='CMDB_APPLYVM' || _this.subType  == "CMDB_APPLYHHVM"){
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
                                            tempvalue == 'dcid' || 
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
                            } else if(_this.subType =='JUMPER_APPLY' ||  _this.subType=="CMDB_RELHHVM" || _this.subType=="CMDB_RELVM"){
                                if(key == 'name'){
                                    let tempvalue = itenmIn[key];
                                        if(tempvalue=='rsp' || tempvalue=='dcid' ){
                                                obj = {
                                                    [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
                                                }
                                        } else if(tempvalue=='device') {
                                            obj = {
                                                    [tempvalue]: itenmIn['value']=='' || itenmIn['value']== undefined?[]:itenmIn['value'].split(',')
                                                }
                                        } else {
                                            obj = {
                                                    [tempvalue]: itenmIn['value']
                                            }
                                        }
                                }
                            }else if(_this.subType =='CMDB_ALIYUN_APPLYECS'){
                               if(key == 'name'){
                                    let tempvalue = itenmIn[key];
                                        if(
                                            tempvalue == 'internetChargeType' ||
                                            tempvalue == 'includeDataDisks' || 
                                            tempvalue == 'eip' || 
                                            // tempvalue == 'instanceChargeType' ||
                                            tempvalue == 'period'
                                        ){
                                             obj = {
                                                [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
                                             }
                                            
                                        } else if(tempvalue == 'instanceChargeType' || tempvalue =="resourceGroup"){
                                            obj = {
                                                [tempvalue]: itenmIn['text'] +'|'+itenmIn['value']
                                             }
                                        }else {
                                           obj = {
                                                    [tempvalue]: itenmIn['value']
                                                }
                                        }
                                }
                            }else if(_this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO'){
                                if(key == 'name'){
                                    let tempvalue = itenmIn[key];
                                         obj = {
                                                [tempvalue]: itenmIn['value']
                                            }
                                }
                            } else if(_this.subType == 'DNS_ANALYSISVALUE'){
                                if(key == 'name'){
                                    let tempvalue = itenmIn[key];
                                    if(tempvalue == 'effectZone'){
                                        obj = {
                                            [tempvalue]: itenmIn['value']+'/'+itenmIn['text']
                                            }
                                    }else {
                                        obj = {
                                                [tempvalue]: itenmIn['value']
                                            }
                                    }
                                }
                            }
                      }
                      arrIn.push(obj)
                    })
                     let obj2 = Object.assign(warpObj,...arrIn)
                     this.tabledata.push({...obj2})
                })
                 this.tabledata.forEach((item,index)=>{
                     item.index = ''+index
                 })
            }
        },
        handleOk(e) {
            console.log('form',{...this.form})
            const _this = this
            this.$refs.ruleForm.validate(valid => {
                let arr = [..._this.tabledata];
                let sum = 0;
                if (valid) {
                    if(_this.updateType==0){
                        if(_this.subType == 'CMDB_ALIYUN_APPLYECS_COSTRATIO'){ // 分摊比例之和一定要等于1
                        let flag = arr.some(item =>_this.form.project == item.project)
                           if(flag){
                                this.$message.error('您选择的项目名存在重复')
                                return false
                           }
                           arr.push({..._this.form})
                           arr.map(item =>{
                               sum += Number(item.costRatio)
                           })
                        } 
                        if(_this.subType == 'DNS_ANALYSISVALUE'){
                            let flag = arr.some(item =>_this.form.effectZone == item.effectZone)
                           if(flag){
                                this.$message.error('您选择的作用域重复了！！！')
                                return false
                           }
                        }
                        _this.tabledata.push({..._this.form})
                    } else {
                        if(_this.subType == 'CMDB_ALIYUN_APPLYECS_COSTRATIO'){// 分摊比例之和一定要等于1
                            arr.splice(_this.recordData.index,1,{..._this.form})
                            let obj =  {}
                            let finds = false
                            arr.forEach(item =>{
                                sum += Number(item.costRatio)
                                if(obj.hasOwnProperty(item.project)){
                                   finds = true
                                }
                                obj[item.project] = ''
                            })
                            if(finds){
                                this.$message.error('您选择的项目名存在重复')
                                  return false
                            }
                            // if(sum !==1 ){
                            //     debugger
                            //      this.$message.error('分摊比例之和一定要等于1')
                            //     return false 
                            // }
                        }

                      _this.tabledata.splice(_this.recordData.index,1,{..._this.form})  
                    }
                    _this.tabledata.forEach((item,index)=>{
                        item.index = ''+index
                    })
                    _this.item_tabledata = _this.tabledata;
                    if(_this.subType == 'CMDB_ADDPROJECT'){
                         _this.parsedatacmdbAddProject()
                    } else if(_this.subType =='CMDB_ADDRSP'){
                        _this.parsedatacmdbRsp()
                    } else if(_this.subType == 'CMDB_APPLYVM' || _this.subType == "CMDB_APPLYHHVM" ){
                        _this.parsedatacmdbApplyvm()
                    } else if(_this.subType =='JUMPER_APPLY' ||  _this.subType=="CMDB_RELHHVM" || _this.subType=="CMDB_RELVM"){
                        _this.parsedataJUMPERAPPLY()
                    }else if(_this.subType =='CMDB_ALIYUN_APPLYECS'){
                        _this.parsedataAPPLYECS()
                    }else if(_this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO'){
                        _this.parsedataCOSTRATIO()
                        _this.$emit('sendTables', {data: _this.tabledata,type: 'CMDB_ALIYUN_APPLYECS_COSTRATIO'})
                    } else if(_this.subType =='DNS_ANALYSISVALUE'){
                         _this.parsedataDNSANALYSISVALUE()
                    }
                    _this.handleCancel()
                    
                } else {
                    return false;
                }
            });
        },
        parsedatacmdbAddProject(){
            let arr = []
            const _this = this
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){ //MULTI-SELECT
                    let obj = {}
                    obj.name = key;
                    _this.columns.map(item=>{
                        if(item.dataIndex==key){
                                obj.title = item.title
                                obj.type = item.type
                                return 
                            }
                    })
                    if(key=='dever' || key=='opser' || key=='owner' || key=='tester'){
                        obj.value = item[key]!=='' && item[key]!==undefined? item[key].join(','):'';
                        obj.text = item[key]!=='' && item[key]!==undefined? item[key].join(','): ''
                    } else {
                       if(key !=='business'){
                            obj.text =  item[key]
                            obj.value =  item[key]
                        }
                        if(key =='business'){
                            obj.value = item[key]!=='' && item[key]!==undefined? item[key].split('/')[0]:'';
                           obj.text = item[key]!=='' && item[key]!==undefined? item[key].split('/')[1]:'';
                        }

                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            this.$refs.ruleForm.resetFields();
        },
        parsedatacmdbRsp(){
            let arr = []
            const _this = this;
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                     _this.columns.map(item=>{
                        if(item.dataIndex==key){
                             obj.title = item.title
                             obj.type = item.type
                             return 
                        }
                    })
                    if(key=='dc' || key =='project' || key =='cluster' || key =='datastore'){
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                    } else {
                        obj.value =  item[key]
                        obj.text = item[key]
                        
                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            this.$refs.ruleForm.resetFields();
        },
        parsedatacmdbApplyvm(){
            let arr = []
            const _this = this;
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                    _this.columns.map(item=>{
                        if(item.dataIndex==key){
                             obj.title = item.title
                             obj.type = item.type
                             return 
                        }
                    })
                  
                    if(
                        key=='env' || 
                        key =='image' || 
                        key =='openvm' || 
                        key =='otherdisk' ||
                        key =='specificpool' ||
                        key =='useto' ||
                        key =='zone' || 
                        key == 'dcid' 
                        ){
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                       
                    } else if( key =='rsp'){
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1]+'/'+item[key].split('/')[2];
                        
                    }else {
                        obj.value =  item[key]
                        obj.text = item[key]
                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
           
            this.item.item_value  = JSON.stringify(arr)
            this.$refs.ruleForm.resetFields();
            // this.form.zone = undefined
        },
        parsedataJUMPERAPPLY(){
            let arr = []
            const _this = this;
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                    let arrin = []
                    for (let key in item){
                        let obj = {}
                        obj.name = key;
                        _this.columns.map(item=>{
                        if(item.dataIndex==key){
                                obj.title = item.title
                                obj.type = item.type
                                return 
                            }
                        })
                        if(key == 'dcid'){
                            obj.value = item[key].split('/')[0];
                            obj.text = item[key].split('/')[1];
                        }
                        if( key =='device'){
                            obj.value = item[key].join(',');
                            obj.text = item[key].join(',');
                        }else if( key =='rsp'){
                            obj.value = item[key].split('/')[0];
                            obj.text = item[key].split('/')[1]+'/'+item[key].split('/')[2];
                        } 
                        arrin.push(obj)
                    }
                    arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            this.$refs.ruleForm.resetFields();
        },
        parsedataCOSTRATIO(){
            let arr = []
            let sum = 0;
            const _this = this;
            console.log('this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                    _this.columns.map(item=>{
                        if(item.dataIndex==key){
                             obj.title = item.title
                             obj.type = item.type
                             return 
                        }
                    })
                    if(key=='costRatio'){
                        sum+= Number(item['costRatio'])
                    }
                    obj.value =  item[key]
                    obj.text = item[key]
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            if(this.itemstyle === 'read' && (this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO' || this.subType == 'CMDB_ALIYUN_APPLYECS')){
                 let params = {
                    id: this.item.id,
                    item_value: JSON.stringify(arr)
                }
                
                this._updateCMDBtable(params).then(res=>{
                     if(res.status === 200){
                        this.$message.success(this.item.show_name+'更新成功')
                        this.$emit('sendUpdateEdittable',true)
                        this.handleCancel()
                    }
                }).catch(res=>{
                    this.$message.error('更新表单失败')
                })
            }
            this.$refs.ruleForm.resetFields();
        },
        parsedataDNSANALYSISVALUE(){
            let arr = []
            let sum = 0;
            const _this = this;
            console.log('parsedataDNSANALYSISVALUE -- this.item_tabledata',this.item_tabledata)
            this.item_tabledata.forEach(item=>{
                let arrin = []
                for (let key in item){
                    let obj = {}
                    obj.name = key;
                    _this.columns.map(item=>{
                        if(item.dataIndex==key){
                             obj.title = item.title
                             obj.type = item.type
                             return 
                        }
                    })
                     if(key=='effectZone' ){
                        // || key=='instanceChargeType' 
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                        
                    } else {
                        obj.value =  item[key]
                        obj.text = item[key]
                    }
                    arrin.push(obj)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            this.$refs.ruleForm.resetFields();
        },
        parsedataAPPLYECS(){
            let arr = []
            const _this = this;
            console.log('this.item_tabledata',_this.item_tabledata)
            _this.item_tabledata.map(item=>{
                let arrin = []
                for (let key in item){//MULTI-SELECT
                    let obj = {}
                    obj.name = key;
                    _this.columns.map(item=>{
                        if(item.dataIndex==key){
                             obj.title = item.title
                              obj.type = item.type
                             return 
                        }
                    })
                    if(key=='internetChargeType'  || key=='includeDataDisks' || key=='eip' || key== 'period' ){
                        // || key=='instanceChargeType' 
                        obj.value = item[key].split('/')[0];
                        obj.text = item[key].split('/')[1];
                        
                    } else if( key=='instanceChargeType' || key=='resourceGroup' ){
                        obj.value = item[key].split('|')[1];
                        obj.text = item[key].split('|')[0];
                    } else {
                            obj.value =  item[key]
                            obj.text = item[key]
                    }
                    arrin.push(obj)
                    console.log('debugger',arrin)
                }
                arr.push(arrin)
            })
            console.log('arr',arr)
            this.item.item_value  = JSON.stringify(arr)
            if(this.itemstyle === 'read' && (this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO' || this.subType == 'CMDB_ALIYUN_APPLYECS')){
                 let params = {
                    id: this.item.id,
                    item_value: JSON.stringify(arr)
                }
                this._updateCMDBtable(params).then(res=>{
                     if(res.status === 200){
                        this.$message.success(this.item.show_name+'更新成功')
                        this.$emit('sendUpdateEdittable',true)
                        this.handleCancel()
                    }
                }).catch(res=>{
                    this.$message.error('更新表单失败')
                })
            }
            this.$refs.ruleForm.resetFields();
        },
        showModal(data,type,title){
            if(this.subType == 'CMDB_ALIYUN_APPLYECS'){
                this.updateVps = true
            }
            // this.formConfigTables = [...this.formConfigTable]
             console.log('data',data)
            this.visible = true;
            this.title = title
            this.updateType  = type
            this.recordData = data
            if(type==1 || type==2){
                this.form = {...data}
            }
        },
        setColumn(){
            this.tablecolumns.filter(item=>item.key!=='action').forEach(item => {
                this.nowColumns.push(item.key)
            })
        },
        handleChange(value) {
            let newArr = [];
             for (let i = 0; i < this.columns.length; i++) {
                 for (let j = 0; j < value.length; j++) {
                     if(value[j] === this.columns[i].key){
                         newArr.push(this.columns[i]);
                     }
                 }
             }
             this.tablecolumns = [...newArr,{
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 180,
                align: 'center',
                scopedSlots: { customRender: 'action' },
            }]
        },
        deleteIndex(data){
            console.log('deleteIndex--data',data)
             this.tabledata.splice(data.index,1)
            if( this.tabledata.length==0){
                this.item.item_value = ''
            } else {
                this.tabledata.forEach((item,index)=>{
                    item.index = ''+index
                })
                this.item_tabledata = [...this.tabledata]
                if(this.subType == 'CMDB_ADDPROJECT'){
                    this.parsedatacmdbAddProject()
                } else if(this.subType =='CMDB_ADDRSP'){
                    this.parsedatacmdbRsp()
                } else if(this.subType =='CMDB_APPLYVM' || this.subType == 'CMDB_APPLYHHVM'){
                    this.parsedatacmdbApplyvm()
                } else if(this.subType =='JUMPER_APPLY' ||  this.subType=="CMDB_RELHHVM" || this.subType=="CMDB_RELVM"){
                    this.parsedataJUMPERAPPLY()
                }else if(this.subType =='CMDB_ALIYUN_APPLYECS'){
                    this.parsedataAPPLYECS()
                }else if(this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO'){
                    this.parsedataCOSTRATIO()
                } else if(this.subType =='DNS_ANALYSISVALUE'){
                    this.parsedataDNSANALYSISVALUE()
                }
            }
        },
        async get_CMDB_ADDPROJECT(params,url,type){ // CMDB_ADDPROJECT   select
            let _url = url;
            let _params = {}
            _params.params = params;
            if (typeof(url) == 'undefined') {
                _url = "/cmdb/query"
            }
            _params.url = _url;
            const res = await this._getSelectOptions(_params)
            if(res.status === 200 && res.data.returnCode==0){
                if(type=='allusers'){
                    let obj = {};
                    let peon = res.data.returnMsg.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) 
                    this.selectData.allusersData= peon
                   
                   
                } else {
                     this.selectData.businessData = res.data.returnMsg
                  
                }
            }
            
        },
        async get_commonSelect(params,url,type){ //
            let _url = url;
            let _params = {}
            _params.params = params;
            if (typeof(url) == 'undefined') {
                _url = "/cmdb/query"
            }
            _params.url = _url;
            try {
                const res = await this._getSelectOptions(_params);
                if(res.status === 200 && res.data.returnCode == 0){
                   this.selectData[type+'Data'] = res.data.returnMsg
                   this.$forceUpdate()
                } 
            }catch(error) {
                  if(this.subType =='CMDB_ALIYUN_APPLYECS' && (type == 'vswId'  || type == 'secgroupIds')){
                        console.log(error.response.status)
                        if(error.response.status ===500 && error.response.data.msg){
                            this.selectData[type+'Data'] = []
                            this.$message.error(error.response.data.msg)
                        }
                    }
            }
            
        },
        async get_commonSelect_decode(params,url,type){ //
            let _url = url;
            let _params = {}
            _params.params = params;
            if (typeof(url) == 'undefined') {
                _url = "/cmdb/query"
            }
            _params.url = _url;
            try {
                const res = await this._getSelectOptionsdecode(_params);
                if(res.status === 200 && res.data.returnCode == 0){
                   this.selectData[type+'Data'] = res.data.returnMsg
                   this.$forceUpdate()
                } 
            }catch(error) {
                  if(this.subType =='CMDB_ALIYUN_APPLYECS' && (type == 'vswId'  || type == 'secgroupIds')){
                        console.log(error.response.status)
                        if(error.response.status ===500 && error.response.data.msg){
                            this.selectData[type+'Data'] = []
                            this.$message.error(error.response.data.msg)
                        }
                    }
            }
        },
        getSelectData(){
            if(this.subType == 'CMDB_ADDPROJECT'){
                this.get_CMDB_ADDPROJECT({},'/v2/ajax/cmdb/listbusiness','business')
                this.get_CMDB_ADDPROJECT({},'/v2/ajax/sso/getallusers','allusers')
            } else if(this.subType == 'CMDB_ADDRSP'){
                this.get_commonSelect({},"/v2/ajax/cmdb/listdc",'listdc')
                this.get_commonSelect({},"/v2/ajax/cmdb/listproject",'project')
            } else if(this.subType == 'CMDB_APPLYVM' ||  this.subType == 'CMDB_APPLYHHVM'){
                
                this.get_commonSelect({dcid: this.form.dcid.split('/')[0]}, "/v2/ajax/cmdb/listimage",'image')
                this.get_commonSelect({}, "/v2/ajax/cmdb/listdeviceusage",'useto')
                this.get_commonSelect({dcid: this.form.dcid.split('/')[0]}, "/v2/ajax/cmdb/listrsp",'rsp')
                // this.get_commonSelect({}, "/v2/ajax/cmdb/listdc",'dcid')
                this.selectData.zoneData =[
                    {
                        id: 'A/互联网互访' ,
                        name: '互联网互访'
                    },
                    {
                        id: 'B/互联网只出不进' ,
                        name: '互联网只出不进',
                        // Vif:  'dcid',
                    },
                    {
                        id: 'C/互联网只进不出' ,
                        name: '互联网只进不出'
                    },
                    {
                        id: 'D/与互联网隔离' ,
                        name: '与互联网隔离'
                    },
                ]
            } else if( this.subType=="CMDB_RELHHVM" || this.subType=="CMDB_RELVM"){
                this.get_commonSelect({dcid: this.form.dcid.split('/')[0]}, "/v2/ajax/cmdb/listrsp",'rsp')
            }else if(this.subType == 'JUMPER_APPLY'){
                //  this.get_commonSelect({}, "/v2/ajax/cmdb/listrsp",'rsp')
                 this.get_commonSelect({}, "/v2/ajax/cmdb/listdc",'dcid')
            } else if(this.subType =='CMDB_ALIYUN_APPLYECS'){
                this.get_commonSelect({},'/v2/ajax/mcras/aliyun/openapi/describeRegions','regionId')
                this.get_commonSelect_decode({regionId: this.form.regionId?this.form.regionId:'华东2(上海) | cn-shanghai'},'/v2/ajax/mcras/aliyun/openapi/describeVpcs','vpcId')
                this.get_commonSelect_decode({vpcId:  this.form.vpcId,regionId: this.form.regionId?this.form.regionId:'华东2(上海) | cn-shanghai'}, "/v2/ajax/mcras/aliyun/openapi/describeVswes",'vswId')
                this.get_commonSelect_decode({vpcId:  this.form.vpcId,regionId: this.form.regionId?this.form.regionId:'华东2(上海) | cn-shanghai'}, "/v2/ajax/mcras/aliyun/openapi/describeSecurityGroups",'secgroupIds')
                this.get_commonSelect_decode({instanceType: this.form.instanceType,regionId: this.form.regionId?this.form.regionId:'华东2(上海) | cn-shanghai'}, "/v2/ajax/mcras/aliyun/openapi/describeImages",'image')
                this.get_commonSelect_decode({},'/v2/ajax/mcras/aliyun/openapi/listResourceGroups','resourceGroup')
                this.get_commonSelect_decode(
                    {
                        cpu: +this.form.cpu,
                        mem: +this.form.mem,
                        instanceChargeType: this.form.instanceChargeType,
                        vswId: this.form.vswId,
                        regionId: this.form.regionId?this.form.regionId:'华东2(上海) | cn-shanghai'
                    },
                     "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
                )
                
            } else if(this.subType =='CMDB_ALIYUN_APPLYECS_COSTRATIO'){
                this.get_commonSelect({}, "/v2/ajax/cmdb/listproject",'costProject')
            } 
        }
    },
    computed:{
        tableDataRead(){
            let tableDa = []
            if(this.itemstyle =="read"){
                // console.log('item-read-rtable',this.item)
                let arr = JSON.parse(this.item.item_value)
                // console.log('item-read-rtable-arr',arr)
                let tableArr = []
                let arrIn = []
                let warpObj = {}
                arr.forEach(items=>{
                    items.forEach(itenmIn=>{
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
                   
                    console.log('item-read-rtable-tableArr',tableDa)

            }
            return tableDa;
        }
    },
    watch:{
        "form.dcid"(val,oldVal){
             if(this.itemstyle == 'read'){
                 return
             }
              console.log(val,oldVal)
              if(this.subType == 'CMDB_APPLYVM' || this.subType == 'CMDB_APPLYHHVM' || this.subType == "JUMPER_APPLY" ){
                  if(val == oldVal){
                     return
                  }
                 if(val == undefined){
                    return
                  }
                //  this.form.zone = ""
                  if(val.split('/')[0] == '8'){
                   this.selectData.zoneData =[
                            {
                                id: 'D/与互联网隔离' ,
                                name: '与互联网隔离',
                            },
                        ]
                   } else {
                        this.selectData.zoneData =[
                            {
                                id: 'A/互联网互访' ,
                                name: '互联网互访'
                            },
                            {
                                id: 'B/互联网只出不进' ,
                                name: '互联网只出不进',
                            },
                            {
                                id: 'C/互联网只进不出' ,
                                name: '互联网只进不出'
                            },
                            {
                                id: 'D/与互联网隔离' ,
                                name: '与互联网隔离'
                            },
                        ]
                }
                this.get_commonSelect({dcid: val.split('/')[0]}, "/v2/ajax/cmdb/listimage",'image')
                this.get_commonSelect({dcid: val.split('/')[0]}, "/v2/ajax/cmdb/listrsp",'rsp')
              }
            
        },
        'form.dc'(val){
             if(this.itemstyle == 'read'){
                 return
             }
             if( this.subType =="CMDB_ADDRSP"){
                this.get_commonSelect({dc: val.split('/')[0]}, "/v2/ajax/cmdb/listcluster",'cluster')
                this.get_commonSelect({dc: val.split('/')[0]}, "/v2/ajax/cmdb/listdatastore",'datastore')
             }
            console.log(val)
            /*
                this.get_commonSelect({dcid: val.split('/')[0]}, "/v2/ajax/cmdb/listcluster",'cluster')
                this.get_commonSelect({dcid: val.split('/')[0]}, "/v2/ajax/cmdb/listdatastore",'datastore')
            */
        },
        'form.rsp'(newVal,oldVal){
            if(this.subType =='CMDB_APPLYHHVM' || this.subType =='CMDB_APPLYVM'){
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
                this.get_commonSelect({rsp: rsp,zone: zone,useto: useto}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
            } else if(this.subType == "JUMPER_APPLY" ||  this.subType == 'CMDB_RELVM' || this.subType == 'CMDB_RELHHVM'){
                if(this.itemstyle === 'read'){
                    return
                }
                if(newVal==oldVal){
                    return 
                }
                if(newVal=='' || newVal==undefined){
                    return
                }
                console.log('rsp',newVal,oldVal)
                if(this.updateType==0){
                     this.form.device = undefined
                }   
                let rsp = newVal.split('/')[0];
                this.get_commonSelect({rsp: rsp,}, "/v2/ajax/cmdb/listdevices",'device')
            }
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
          
           this.get_commonSelect({zone: zone,rsp: rsp,useto: useto}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
        },
        'form.regionId'(newVal,oldVal){
             if(newVal=='' || newVal==undefined){
                return
            }
            if(newVal == oldVal){
                return
            }
            if(oldVal == undefined){
                return
            }
            if(!this.updateVps){
                return
            }
            let value1 = newVal.split('/').splice(0,1).join('|')
            this.get_commonSelect({},'/v2/ajax/mcras/aliyun/openapi/describeRegions','regionId')
            this.get_commonSelect_decode({regionId: value1},'/v2/ajax/mcras/aliyun/openapi/describeVpcs','vpcId')
            this.get_commonSelect_decode({vpcId:  this.form.vpcId,regionId: value1}, "/v2/ajax/mcras/aliyun/openapi/describeVswes",'vswId')
            this.get_commonSelect_decode({vpcId:  this.form.vpcId,regionId: value1}, "/v2/ajax/mcras/aliyun/openapi/describeSecurityGroups",'secgroupIds')
            this.get_commonSelect_decode({instanceType: this.form.instanceType, regionId: value1}, "/v2/ajax/mcras/aliyun/openapi/describeImages",'image')
            this.get_commonSelect_decode(
                {
                    cpu: +this.form.cpu,
                    mem: +this.form.mem,
                    instanceChargeType: this.form.instanceChargeType,
                    vswId: this.form.vswId,
                    regionId: value1
                },
                    "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
            )
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

            this.get_commonSelect({useto: useto,zone:zone,rsp: rsp,}, "/v2/ajax/cmdb/listrsprelatedpool",'specificpool')
        },
        'form.vpcId'(newVal,oldVal){
            if( 
                this.itemstyle == 'read' && 
                this.subType == 'CMDB_ALIYUN_APPLYECS' &&
                (this.allSteps.status == 'FAILED' || this.allSteps.status == 'SUCCESSFUL')
            )
            {
                return
            }
            console.log('newVal--vpcId',newVal)
            if(newVal =='' || newVal == undefined){
                return
            }
            if(newVal == oldVal){
                return
            }
            if(oldVal == undefined){
                return
            }
            if(!this.updateVps){
                return
            }
            let vpcId = newVal.split('/')[0];
            //  this.form.vswId = ''
            //  this.form.secgroupIds = ''
            this.get_commonSelect_decode({vpcId: vpcId,regionId: this.form.regionId}, "/v2/ajax/mcras/aliyun/openapi/describeVswes",'vswId')
            this.get_commonSelect_decode({vpcId: vpcId,regionId: this.form.regionId}, "/v2/ajax/mcras/aliyun/openapi/describeSecurityGroups",'secgroupIds')
        },
        'form.instanceType'(newVal,oldVal){
            if( 
                this.itemstyle == 'read' && 
                this.subType == 'CMDB_ALIYUN_APPLYECS' &&
                (this.allSteps.status == 'FAILED' || this.allSteps.status == 'SUCCESSFUL')
            )
            {
                return
            }
            console.log('newVal--vpcId',newVal)
            if(newVal=='' || newVal==undefined){
                return
            }
            if(newVal == oldVal){
                return
            }
            if(oldVal == undefined){
                return
            }
            if(!this.updateVps){
                return
            }
            let instanceType = newVal.split('/')[0];
            //  this.form.vswId = ''
            //  this.form.secgroupIds = ''
            this.get_commonSelect_decode({instanceType: instanceType,regionId: this.form.regionId}, "/v2/ajax/mcras/aliyun/openapi/describeImages",'image')
        },
        'form.cpu'(newVal,oldVal){
            if(!this.updateVps){
                return
            }
            if(this.itemstyle === 'write'){
                return
            }
            console.log('form.cpu',newVal,oldVal)
            if(newVal && this.form.mem && this.form.instanceChargeType && this.form.vswId){
                this.get_commonSelect_decode(
                    {
                        cpu: + newVal,
                        mem: + this.form.mem,
                        instanceChargeType: this.form.instanceChargeType,
                        vswId: this.form.vswId,
                        regionId: this.form.regionId
                    },
                     "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
                )
            }
            
        },
        'form.mem'(newVal,oldVal){
             if(!this.updateVps){
                return
            }
             if(this.itemstyle === 'write'){
                return
            }
            console.log('form.mem',newVal,oldVal)
             if(newVal && this.form.cpu && this.form.instanceChargeType && this.form.vswId){
               this.get_commonSelect_decode(
                    {
                        cpu: +this.form.cpu,
                        mem: +newVal,
                        instanceChargeType: this.form.instanceChargeType,
                        vswId: this.form.vswId,
                        regionId: this.form.regionId,
                    },
                     "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
                )
            }
        },
        'form.instanceChargeType'(newVal,oldVal){
             if(!this.updateVps){
                return
            }
             if(this.itemstyle === 'write'){
                return
            }
            console.log('form.instanceChargeType',newVal,oldVal)
             if(newVal && this.form.cpu && this.form.mem && this.form.vswId){
                this.get_commonSelect_decode(
                    {
                        cpu: +this.form.cpu,
                        mem: +this.form.mem,
                        instanceChargeType: newVal,
                        vswId: this.form.vswId,
                        regionId: this.form.regionId,
                    },
                     "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
                )
            }
        },
        'form.vswId'(newVal,oldVal){
            console.log('form.vswId',newVal,oldVal)
             if(!this.updateVps){
                return
            }
             if(this.itemstyle === 'write'){
                return
            }
            if(newVal && this.form.cpu && this.form.mem && this.form.instanceChargeType){
               this.get_commonSelect_decode(
                    {
                        cpu: +this.form.cpu,
                        mem: +this.form.mem,
                        instanceChargeType: this.form.instanceChargeType,
                        vswId: newVal,
                        regionId: this.form.regionId,
                    },
                     "/v2/ajax/mcras/aliyun/openapi/describeAvailableResource",'instanceType'
                )
            }
        }

    },
}
</script>
<style lang="less">
    
</style>