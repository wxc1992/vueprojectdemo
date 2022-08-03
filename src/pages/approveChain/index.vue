<template>
    <div class="approveChain" :style="{height: approveChainHeight+'px'}">
        <a-tabs type="card" >
            <a-tab-pane key="1" tab="待我审批" :style="{height: approveChainHeight+'px'}">
                <a-alert message="注意:代理审批流程不会在此显示，若要审批请直接进入流程单审批" banner closable/>
                <div style="margin: 5px 0 ;">
                     <a-space>
                        <a-select  v-model="selected" placeholder="请选择类型" style="width: 230px">
                             <a-select-option v-for="item in listactiveData" :value="item.name" :key="item.id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                        <a-button type="primary" size="small" @click="doSeacher">查询</a-button>
                    </a-space>
                </div>
                <div>
                    <a-table 
                        :columns="columns" 
                        :loading="loading"
                        size="small"
                        :data-source="tabledata">
                        <span slot="status" slot-scope="status">
                            <span v-if="status=='PROCESSING'">进行中</span>
                            <span v-if="status=='FAILED'">流程失败</span>
                            <span v-if="status=='SUCCESSFUL'">成功完成</span>
                            <span v-if="status=='CANCEL'">进行中</span>
                        </span>
                        <span slot="action" slot-scope="record">
                            <a-button type="link" @click="goDetail(record.id)" size="small">
                                详情
                            </a-button>
                        </span>
                    </a-table>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '模板',
    dataIndex: 'template_name',
    key: 'template_name',
  },
  {
    title: '流程说明',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'create_time',
    dataIndex: 'create_time',
     width: 180,
  },
 {
    title: '当前状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '下一步步骤',
    key: 'next_steps_info_dec',
    dataIndex: 'next_steps_info_dec',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
    data(){
        return {
            selected: undefined,
            listactiveData:[],
            tabledata:[],
            columns,
            approveChainHeight: 0,
            loading: false,
        }
    },
    methods:{
         ...mapActions(['_getListactive','_getAllprocess']),
        doSeacher(){
             this.getAllprocess()
        },
        async getlistactive(){
            let params = {};
            const res = await  this._getListactive(params)
            console.log('res,',res)
            this.listactiveData = res.data
        },
        goDetail(id){
            // this.$router.push({
            //     path: "/view_chain",
            //     query: {
            //     chainid: id,
            //     orin: 'approve_chain'
            //     },
            // });
            let routeUrl = this.$router.resolve({
                path: "/view_chain",
                query: {
                    chainid: id,
                    orin: 'approve_chain'
                }
            });
            // let routeUrl = this.$router.resolve({
            //     name: "***",
            //     params:{id:78}
            // });
            window.open(routeUrl.href, '_blank');
        },
          async getAllprocess(){
             let params = {
                 seacher:{
                    template_name: this.selected==undefined?'':this.selected,
                    to_approve_um:  localStorage.getItem('currentUM')
                 },
                  page: 1
            }
            // this.loading = true
            const res =  await this._getAllprocess(params)
            console.log('getAllprocess',res)
            if(res.status===200 && res.data.length>0){
                res.data.forEach(item => {
                     let desc = []
                    if(item.next_steps_info.length>0){
                       item.next_steps_info.forEach(ele=>{
                           desc.push(ele.name)
                       })
                        item.next_steps_info_dec =  desc.join(',')
                    } else {
                        item.next_steps_info_dec = ''
                    }
                });
              
                this.loading = false;
                this.tabledata = res.data
                
            } else {
                this.loading = false;
                this.tabledata = []
             
            }
        },
    },
    mounted(){
        this.approveChainHeight = document.body.clientHeight
        console.log('approveChainHeight',this.approveChainHeight)
    },
    created(){
        this.getlistactive();
        this.getAllprocess();
        
    }
}
</script>
<style lang="less" scoped>
    .approveChain{
        height: 100%;
        background: #fff;
    }
</style>