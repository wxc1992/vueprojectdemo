
/**
 * A.
     * title: 表格的中文显示
     * dataIndex： 表格的字段暂时
     * key 用于vue的算法
     * width 宽度 
 * 
 * B.
    *  scopedSlots: { customRender: 'business' },  这是占用属性 用户渲染可能每个要求不一样 如果不是同意渲染 就单独使用插槽去渲染
    *   如果在设置了 scopedSlots: { customRender: 'cluster' },  在table 组件的页面 要这样去渲染   
    *  <span slot="tester" slot-scope="tester">
            {{tester?tester.join(','):''}}
        </span>
    * 这样做的原因是
    * 下拉选项有时候 id 和 name 的值不一样 
    *                  {
                            id: 'T/测试' ,
                            name: '测试'
                        },
            但是 前端 表格需要展示      name  后端需要的是id   就需要重新渲染   {{business?business.split('/')[1]:''}} 这样 截取 第 1 个作为展示 
    *       如果是id 和 name 一样的情况下 例如以下
    *                  {
                            id: '1c-1g-40g',
                            name: '1c-1g-40g'
                        }
    * <a-select-option
            v-for="item in clusterData"
            v-bind:id="item.id+'/'+item.name"
            :key="item.id"
            >
            {{ item["name"] }}
        </a-select-option>
        <a-select-option
            v-for="item in clusterData"
            v-bind:id="item.name"
            :key="item.id"
            >
            {{ item["name"] }}
        </a-select-option>

    C.

        如果有依赖 
            直接在 table 组件里面 的watch 添加 
             watch:{
                'form.dc'(val){
                    if(this.itemstyle == 'read'){
                        return
                    }
                    console.log(val)
                    this.get_commonSelect({dcid: val}, "/v2/ajax/cmdb/listcluster",'cluster') 
                    参数分别是 
                    {dcid: val} 参数
                    "/v2/ajax/cmdb/listcluster" 接口地址
                    cluster   配置项里面的  prop
                    this.get_commonSelect({dcid: val}, "/v2/ajax/cmdb/listdatastore",'datastore')
                },
            }
*   
*/
let tableConfig = {
    'DNS_ANALYSISVALUE':{
        columns: [
            {
                title: '作用区域',
                dataIndex: 'effectZone',
                prop:'effectZone',
                type:'a-select',
                defaulOptions:[
                    {
                        id:'huahong',
                        name:'华虹',
                    },
                    {
                        id:'wanxiang',
                        name:'万向',
                    },
                    {
                        id:'vpn',
                        name:'VPN',
                    },
                    {
                        id:'others',
                        name:'互联网',
                    }
                ],
                scopedSlots: { customRender: 'effectZone' },
            },
            {
                title: '解析值',
                dataIndex: 'analysisValue',
                prop:'analysisValue',
                type:'a-input',
                placeholder: '填写示例：192.168.0.10或destination.wx.bc'
            },
        ]
    },
    'CMDB_ADDPROJECT': {
        columns: [
            {
                title: '项目代号',
                dataIndex: 'name',
                prop:'name',
                width: 100,
                type:'a-input',
            },
            {
                title: '项目ID',
                dataIndex: 'cn',
                prop:'cn',
                type:'a-input'
            },
            {
                title: '立项名称',
                dataIndex: 'projectName',
                prop:'projectName',
                type:'a-input'
            },
            {
                title: '业务线',
                dataIndex: 'business',
                scopedSlots: { customRender: 'business' },
                type:'a-select',
                options: 'businessData',
                multiple: false,
            },
           {
                title: '项目负责人',
                dataIndex: 'owner',
                scopedSlots: { customRender: 'owner' },
                type:'a-select-input',
                options: 'allusersData',
                multiple: true
            },
            {
                title: '项目开发负责人',
                dataIndex: 'dever',
                scopedSlots: { customRender: 'dever' },
                type:'a-select-input',
                options: 'allusersData',
                multiple: true
            },
            {
                title: '项目测试负责人',
                dataIndex: 'tester',
                scopedSlots: { customRender: 'tester' },
                type:'a-select-input',
                options: 'allusersData',
                multiple: true
            },
            {
                title: '项目运维负责人',
                dataIndex: 'opser',
                scopedSlots: { customRender: 'opser' },
                type:'a-select-input',
                options: 'allusersData',
                multiple: true
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                prop:'remark',
                type:'a-input'
            }
        ],
    },
    'CMDB_ADDRSP':{
        columns : [
            {
                title: '机房',
                dataIndex: 'dc',
                width: 100,
                scopedSlots: { customRender: 'dc' },
                prop:'dc',
                type:'a-select',
                options: 'listdcData',
                multiple: false
            },
            {
                title: '集群',
                dataIndex: 'cluster',
                scopedSlots: { customRender: 'cluster' },
                prop:'cluster',
                type:'a-select',
                options: 'clusterData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'dc',
                dependOnName:'机房'
            },
            {
                title: '存储',
                dataIndex: 'datastore',
                scopedSlots: { customRender: 'datastore' },
                prop:'datastore',
                type:'a-select',
                options: 'datastoreData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'dc',
                dependOnName:'机房'
            },
            {
                title: '项目',
                dataIndex: 'project',
                scopedSlots: { customRender: 'project' },
                prop:'project',
                type:'a-select',
                options: 'projectData',
                multiple: false
            },
            {
                title: 'CPU配额',
                dataIndex: 'cpu',
                prop:'cpu',
                type:'a-input'
            },
            {
                title: 'MEM配额',
                dataIndex: 'mem',
                prop:'mem',
                type:'a-input'
            },
            {
                title: '磁盘配额',
                dataIndex: 'disk',
                prop:'disk',
                type:'a-input'
            },
            {
                title: '备注信息',
                dataIndex: 'remark',
                prop:'remark',
                type:'a-input'
            }
        ]
    },
    'CMDB_APPLYHHVM':{
        columns : [
            {
                title: '机房',
                dataIndex: 'dcid',
                width: 100,
                scopedSlots: { customRender: 'dcid' },
                prop:'dcid',
                type:'a-select',
                options: '',
                defaultValue:'8/华虹6F',
                defaulOptions:[
                    {
                        id:'8/华虹6F',
                        name:'华虹6F',
                    }
                ],
                multiple: false,
            },
            {
                title: '部门',
                dataIndex: 'rsp',
                width: 100,
                scopedSlots: { customRender: 'rsp' },
                prop:'image',
                type:'a-select',
                options: 'rspData',
                multiple: false,
            },
            {
                title: '镜像',
                dataIndex: 'image',
                scopedSlots: { customRender: 'image' },
                prop:'image',
                type:'a-select',
                options: 'imageData',
                multiple: false,
                // dependOn:"dcid"
            },
            {
                title: '规格',
                dataIndex: 'size',
                scopedSlots: { customRender: 'size' },
                prop:'size',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: '1c-1g-40g' ,
                        name: '1c-1g-40g'
                    },
                    {
                        id: '2c-2g-40g' ,
                        name: '2c-2g-40g'
                    },
                    {
                        id: '4c-4g-40g' ,
                        name: '4c-4g-40g'
                    },
                    {
                        id: '4c-8g-40g' ,
                        name: '4c-8g-40g'
                    },
                    {
                        id: '8c-8g-40g' ,
                        name: '8c-8g-40g'
                    },
                    {
                        id: '8c-16g-40g' ,
                        name: '8c-16g-40g'
                    },
                    {
                        id: '8c-32g-40g' ,
                        name: '8c-32g-40g'
                    },
                    {
                        id: '8c-64g-40g' ,
                        name: '8c-64g-40g'
                    }
                ],
                multiple: false,
            },
           {
                title: '用途',
                dataIndex: 'useto',
                scopedSlots: { customRender: 'useto' },
                prop:'useto',
                type:'a-select',
                options: '',
                defaultValue:'STU/study',
                defaulOptions:[
                    {
                        id:'STU/study',
                        name:'study'
                    },
                ],
                multiple: false,
            },
           {
                title: '环境',
                dataIndex: 'env',
                scopedSlots: { customRender: 'env' },
                prop:'env',
                type:'a-select',
                options: '',
                defaultValue:'S/学习环境',
                defaulOptions:[
                    {
                        id: 'S/学习环境' ,
                        name: '学习环境'
                    },
                ],
                multiple: false,
            },
            {
                title: '区域',
                dataIndex: 'zone',
                scopedSlots: { customRender: 'zone' },
                prop:'zone',
                type:'a-select',
                options: '',
                defaultValue:'D/与互联网隔离',
                defaulOptions:[
                    {
                        id: 'D/与互联网隔离' ,
                        name: '与互联网隔离',
                    },
                ],
                multiple: false,
            },
           {
                title: '指定网段',
                dataIndex: 'specificpool',
                scopedSlots: { customRender: 'specificpool' },
                prop:'specificpool',
                type:'a-select',
                options: 'specificpoolData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'useto',
                dependOnName:'用途',
                // dependOn:"dcid"
            },
            {
                title: '是否有额外硬盘需求',
                dataIndex: 'otherdisk',
                scopedSlots: { customRender: 'otherdisk' },
                prop:'otherdisk',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                multiple: false,
            },
            {
                title: '额外硬盘大小(G)',
               
                dataIndex: 'disk',
                prop:'disk',
                type:'a-input',
            },
            {
                title: '是否开机',
               
                dataIndex: 'openvm',
                scopedSlots: { customRender: 'openvm' },
                prop:'openvm',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                multiple: false,
            },
            {
                title: '使用期限(月)',
                dataIndex: 'time',
                prop:'time',
                type:'a-input',
            },
            {
                title: '数量',
               
                dataIndex: 'number',
                prop:'number',
                type:'a-input',
            }
        ]
    },
    'CMDB_APPLYVM':{
        columns : [
            {
                title: '机房',
                dataIndex: 'dcid',
                width: 100,
                scopedSlots: { customRender: 'dcid' },
                prop:'dcid',
                type:'a-select',
                options: '',
                defaultValue:'2/万向',
                defaulOptions:[
                    {
                        id:"2/万向",
                        name:'万向'
                    },
                ],
                multiple: false,
            },
            {
                title: '项目',
                dataIndex: 'rsp',
                width: 100,
                scopedSlots: { customRender: 'rsp' },
                prop:'image',
                type:'a-select',
                options: 'rspData',
                multiple: false,
            },
            {
                title: '镜像',
                dataIndex: 'image',
                scopedSlots: { customRender: 'image' },
                prop:'image',
                type:'a-select',
                options: 'imageData',
                multiple: false,
                // dependOn:"dcid"
            },
            {
                title: '规格',
                dataIndex: 'size',
                scopedSlots: { customRender: 'size' },
                prop:'size',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: '1c-1g-40g' ,
                        name: '1c-1g-40g'
                    },
                    {
                        id: '2c-2g-40g' ,
                        name: '2c-2g-40g'
                    },
                    {
                        id: '4c-4g-40g' ,
                        name: '4c-4g-40g'
                    },
                    {
                        id: '4c-8g-40g' ,
                        name: '4c-8g-40g'
                    },
                    {
                        id: '8c-8g-40g' ,
                        name: '8c-8g-40g'
                    },
                    {
                        id: '8c-16g-40g' ,
                        name: '8c-16g-40g'
                    },
                    {
                        id: '8c-32g-40g' ,
                        name: '8c-32g-40g'
                    },
                    {
                        id: '8c-64g-40g' ,
                        name: '8c-64g-40g'
                    }
                ],
                multiple: false,
            },
           {
                title: '用途',
                dataIndex: 'useto',
                scopedSlots: { customRender: 'useto' },
                prop:'useto',
                type:'a-select',
                options: 'usetoData',
                multiple: false,
            },
           {
                title: '环境',
               
                dataIndex: 'env',
                scopedSlots: { customRender: 'env' },
                prop:'env',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'T/测试' ,
                        name: '测试'
                    },
                    {
                        id: 'R/容灾' ,
                        name: '容灾'
                    },
                    {
                        id: 'D/研发' ,
                        name: '研发'
                    },
                    {
                        id: 'I/集成环境' ,
                        name: '集成环境'
                    },
                ],
                multiple: false,
            },
            {
                title: '区域',
                dataIndex: 'zone',
                scopedSlots: { customRender: 'zone' },
                prop:'zone',
                type:'a-select',
                options: 'zoneData',
                // defaulOptions:[
                //     {
                //         id: 'A/互联网互访' ,
                //         name: '互联网互访'
                //     },
                //     {
                //         id: 'B/互联网只出不进' ,
                //         name: '互联网只出不进',
                //         // Vif:  'dcid',
                //     },
                //     {
                //         id: 'C/互联网只进不出' ,
                //         name: '互联网只进不出'
                //     },
                //     {
                //         id: 'D/与互联网隔离' ,
                //         name: '与互联网隔离'
                //     },
                // ],
                multiple: false,
                // dependOn:"dcid"
            },
           {
                title: '指定网段',
                dataIndex: 'specificpool',
                scopedSlots: { customRender: 'specificpool' },
                prop:'specificpool',
                type:'a-select',
                options: 'specificpoolData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'useto',
                dependOnName:'用途',
                // dependOn:"dcid"
            },
            {
                title: '是否有额外硬盘需求',
               
                dataIndex: 'otherdisk',
                scopedSlots: { customRender: 'otherdisk' },
                prop:'otherdisk',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                multiple: false,
            },
            {
                title: '额外硬盘大小(G)',
               
                dataIndex: 'disk',
                prop:'disk',
                type:'a-input',
            },
            {
                title: '是否开机',
               
                dataIndex: 'openvm',
                scopedSlots: { customRender: 'openvm' },
                prop:'openvm',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                multiple: false,
            },
            {
                title: '使用期限(月)',
                dataIndex: 'time',
                prop:'time',
                type:'a-input',
            },
            {
                title: '数量',
               
                dataIndex: 'number',
                prop:'number',
                type:'a-input',
            }
        ]
    },
    'JUMPER_APPLY' :{
        columns:[
            {
                title: '机房',
                dataIndex: 'dcid',
                width: 100,
                scopedSlots: { customRender: 'dcid' },
                prop:'dcid',
                type:'a-select',
                options: 'dcidData',
                multiple: false,
            },
            {
                title: '项目',
                dataIndex: 'rsp',
                width: 100,
                scopedSlots: { customRender: 'rsp' },
                prop:'rsp',
                type:'a-select',
                options: 'rspData',
                multiple: false,
            },
            {
                title: '服务器',
                dataIndex: 'device',
                scopedSlots: { customRender: 'device' },
                prop:'device',
                type:'a-select',
                options: 'deviceData',
                multiple: true,
                dependOn: true,
                dependOnProps: 'rsp',
                dependOnName:'项目'
            }
        ]
    },
    'CMDB_RELVM' :{
        columns:[
            {
                title: '机房',
                dataIndex: 'dcid',
                width: 100,
                scopedSlots: { customRender: 'dcid' },
                prop:'dcid',
                type:'a-select',
                options: '',
                defaultValue:'2/万向',
                defaulOptions:[
                    {
                        id:"2/万向",
                        name:'万向'
                    },
                ],
                multiple: false,
            },
            {
                title: '项目',
                dataIndex: 'rsp',
                width: 100,
                scopedSlots: { customRender: 'rsp' },
                prop:'rsp',
                type:'a-select',
                options: 'rspData',
                multiple: false,
            },
            {
                title: '服务器',
                dataIndex: 'device',
                scopedSlots: { customRender: 'device' },
                prop:'device',
                type:'a-select',
                options: 'deviceData',
                multiple: true,
                dependOn: true,
                dependOnProps: 'rsp',
                dependOnName:'项目'
            }
        ]
    },
    'CMDB_RELHHVM' :{
        columns:[
            {
                title: '机房',
                dataIndex: 'dcid',
                width: 100,
                scopedSlots: { customRender: 'dcid' },
                prop:'dcid',
                type:'a-select',
                defaultValue:'8/华虹6F',
                defaulOptions:[
                    {
                        id:'8/华虹6F',
                        name:'华虹6F',
                    }
                ],
                options: '',
                multiple: false,
            },
            {
                title: '项目',
                dataIndex: 'rsp',
                width: 100,
                scopedSlots: { customRender: 'rsp' },
                prop:'rsp',
                type:'a-select',
                options: 'rspData',
                multiple: false,
            },
            {
                title: '服务器',
                dataIndex: 'device',
                scopedSlots: { customRender: 'device' },
                prop:'device',
                type:'a-select',
                options: 'deviceData',
                multiple: true,
                dependOn: true,
                dependOnProps: 'rsp',
                dependOnName:'项目'
            }
        ]
    },
    'CMDB_ALIYUN_APPLYECS' :{
        columns : [
          {
                title: '机房',
                dataIndex: 'dataCenter',
                scopedSlots: { customRender: 'dataCenter' },
                prop:'dataCenter',
                type:'a-select',
                options: '',
                defaultValue:'阿里云',
                defaulOptions:[
                    {
                        id: '阿里云' ,
                        name: '阿里云'
                    },
                ],
                multiple: false,
          },
          {
                title: '地域',
                dataIndex: 'regionId',
                scopedSlots: { customRender: 'regionId' },
                prop:'regionId',
                type:'a-select',
                options: "regionIdData",
                defaultValue:"华东2(上海) | cn-shanghai",
                multiple: false,
                Vif: '{"itemstyle": "read"}'
            },
          {
                title: 'CPU',
                dataIndex: 'cpu',
                scopedSlots: { customRender: 'cpu' },
                prop:'cpu',
                type:'a-input',
                options: '',
                multiple: false,
            },
            {
                title: 'MEM',
                dataIndex: 'mem',
                scopedSlots: { customRender: 'mem' },
                prop:'mem',
                type:'a-input',
                options: '',
                multiple: false,
            },
          {
                title: '实例付费类型',
                dataIndex: 'instanceChargeType',
                scopedSlots: { customRender: 'instanceChargeType' },
                prop:'instanceChargeType',
                type:'a-select',
                options: '',
                defaultValue:"包月付费 | PrePaid",
                defaulOptions:[
                    {
                        id: '包月付费 | PrePaid' ,
                        name: '包月付费 | PrePaid'
                    },
                    {
                        id: '按量付费 | PostPaid' ,
                        name: '按量付费 | PostPaid'
                    },
                ],
                multiple: false,
          },
          {
                title: '是否需要EIP',
                dataIndex: 'eip',
                scopedSlots: { customRender: 'eip' },
                prop:'eip',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                defaultValue:"N/否",
                multiple: false,
         },
         {
                title: '包月时长',
                dataIndex: 'period',
                scopedSlots: { customRender: 'period' },
                prop:'period',
                type:'a-select',
                options: '',
                defaultValue:'1/1个月',
                defaulOptions:[
                    {
                        id: '1/1个月' ,
                        name: '1个月'
                    },
                    {
                        id: '2/2个月' ,
                        name: '2个月'
                    },
                    {
                        id:'3/3个月',
                        name:'3个月'
                    },

                    {
                        id:'4/4个月',
                        name:'4个月'
                    },

                    {
                        id:'5/5个月',
                        name:'5个月'
                    },

                    {
                        id:'6/6个月',
                        name:'6个月'
                    },

                    {
                        id:'7/7个月',
                        name:'7个月'
                    },

                    {
                        id:'8/8个月',
                        name:'8个月'
                    },

                    {
                        id:'9/9个月',
                        name:'9个月'
                    },

                    {
                        id:'12/1年',
                        name:'1年'
                    },

                    {
                        id:'24/2年',
                        name:'2年'
                    },

                    {
                        id:'36/3年',
                        name:'3年'
                    },

                    {
                        id:'48/4年',
                        name:'4年'
                    },

                    {
                        id:'60/5年',
                        name:'5年'
                    },

                ],
                multiple: false,
         },
         {
            title: '系统盘大小(G)',
            dataIndex: 'systemDiskSize',
            scopedSlots: { customRender: 'systemDiskSize' },
            prop:'systemDiskSize',
            type:'a-input',
            options: '',
            defaultValue: '40',
            multiple: false,
      },
        {
                title: '是否有额外数据盘需求',
                dataIndex: 'includeDataDisks',
                scopedSlots: { customRender: 'includeDataDisks' },
                prop:'includeDataDisks',
                type:'a-select',
                options: '',
                defaulOptions:[
                    {
                        id: 'Y/是' ,
                        name: '是'
                    },
                    {
                        id: 'N/否' ,
                        name: '否'
                    },
                ],
                multiple: false,
          },
          {
                title: '额外数据盘大小(G)',
                dataIndex: 'dataDiskSize',
                scopedSlots: { customRender: 'dataDiskSize' },
                prop:'dataDiskSize',
                defaultValue: '200',
                type:'a-input',
                isShow:{'includeDataDisks': 'Y/是'}
          },
          {
                title: '网络付费类型',
                dataIndex: 'internetChargeType',
                scopedSlots: { customRender: 'internetChargeType' },
                prop:'internetChargeType',
                type:'a-select',
                options: '',
                defaultValue:'PayByBandwidth/按固定带宽计费',
                defaulOptions:[
                    {
                        id: 'PayByBandwidth/按固定带宽计费' ,
                        name: '按固定带宽计费'
                    },
                    {
                        id: 'PayByTraffic/按使用流量计费' ,
                        name: '按使用流量计费'
                    },
                ],
                multiple: false,
          },
          {
                title: '公网出带宽最大值',
                dataIndex: 'bandwidthOut',
                prop:'bandwidthOut',
                type:'a-input',
                defaultValue: '5',
          },
          {
                title: 'ECS服务器数量',
                dataIndex: 'amount',
                prop:'amount',
                type:'a-input',
        },
          {
                title: '专有网络',
                dataIndex: 'vpcId',
                scopedSlots: { customRender: 'vpcId' },
                prop:'vpcId',
                type:'a-select',
                defaultValue:"rocky-prod | vpc-uf6xogu6nd4wrb0p3ulb0 | 172.16.0.0/12",
                options: 'vpcIdData',
                multiple: false,
                Vif: '{"itemstyle": "read"}'
          },
          {
                title: '虚拟交换机',
                defaultValue:"sw-rocky | vsw-uf61dil65m3wcm3ak88n7 | cn-shanghai-d | 172.18.0.0/24",
                dataIndex: 'vswId',
                scopedSlots: { customRender: 'vswId' },
                prop:'vswId',
                type:'a-select',
                options: 'vswIdData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'vpcId',
                dependOnName:'专有网络ID',
                Vif: '{"itemstyle": "read"}'
          },
          {
                title: '安全组',
                defaultValue:"rocky_base | sg-uf6hcc0n8giuky3btwt6",
                dataIndex: 'secgroupIds',
                scopedSlots: { customRender: 'secgroupIds' },
                prop:'secgroupIds',
                type:'a-select',
                options: 'secgroupIdsData',
                multiple: false,
                dependOn: true,
                dependOnProps: 'vpcId',
                dependOnName:'专有网络ID',
                Vif: '{"itemstyle": "read"}'
          },
          
          {
            title: '资源组',
            dataIndex: 'resourceGroup',
            scopedSlots: { customRender: 'resourceGroup' },
            prop:'resourceGroup',
            type:'a-select',
            options: "resourceGroupData",
            defaultValue:"默认资源组 | rg-acfm3tp3agsywri",
            multiple: false,
            Vif: '{"itemstyle": "read"}'
        },
      
        {
            title: '实例类型',
            dataIndex: 'instanceType',
            scopedSlots: { customRender: 'instanceType' },
            prop:'instanceType',
            type:'a-select',
            // dependOn: true,
            // defaultValue: "ecs.n1.small",
            options: "instanceTypeData",
            multiple: false,
            Vif: '{"itemstyle": "read"}'
        },
        {
            title: '镜像',
            dataIndex: 'image',
            dependOn: true,
            dependOnProps: 'instanceType',
            dependOnName:'实例类型',
            scopedSlots: { customRender: 'image' },
            prop:'image',
            type:'a-select',
            options: 'imageData',
            defaultValue:"centos_7_9_x64_20G_alibase_20210521.vhd",
            multiple: false,
            showSearch: true,
            Vif: '{"itemstyle": "read"}'
        },
        {
                title: '实例名称(前缀)',
                defaultValue:"achain-aliyun-ecs",
                dataIndex: 'instanceName',
                prop:'instanceName',
                type:'a-input',
                Vif: '{"itemstyle": "read"}'
        },
        {
            title: '密码',
            dataIndex: 'password',
            prop:'password',
            type:'a-input',
            Vif: '{"itemstyle": "read"}'
      },
        ]
    },
    'CMDB_ALIYUN_APPLYECS_COSTRATIO':{
        columns : [
          {
                title: '项目',
                dataIndex: 'project',
                width: 100,
                scopedSlots: { customRender: 'costRatioproject' },
                prop:'project',
                type:'a-select',
                options: 'costProjectData',
                multiple: false,
          },
          {
                title: '分摊比例',
                dataIndex: 'costRatio',
                prop:'costRatio',
                type:'a-input',
          },
        ]
    }
}
export default  tableConfig;