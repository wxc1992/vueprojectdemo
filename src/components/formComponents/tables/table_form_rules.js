import check from '../tables/check'
let formRules = {
    'DNS_ANALYSISVALUE':{
        effectZone: [
            { required: true, message: '请选择作用区域', trigger: 'change' },
        ],
        analysisValue: [
            { required: true, message: '请输入解析值', trigger: 'blur' },
            { validator: check.checkDNS, trigger: 'change' },
        ],
    },
    'CMDB_ADDPROJECT':{
        name: [
            { required: true, message: '请输入项目代号', trigger: 'blur' },
        ],
        // cn: [
        //     { required: true, message: '请输入项目名称', trigger: 'blur' },
        // ],
        projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        business: [
            { required: true, message: '请选择业务线', trigger: 'change' },
        ],
        owner: [
            { required: true, message: '请输入项目负责人', trigger: 'change' },
        ],
        dever: [
            { required: true, message: '请输入项目开发负责人', trigger: 'change' },
        ],
        tester: [
            { required: true, message: '请输入项目测试负责人', trigger: 'change' },
        ],
        opser: [
            { required: true, message: '请输入项目运维负责人', trigger: 'change' },
        ],
    },
    'CMDB_ADDRSP':{
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
    'CMDB_APPLYVM':{
        dcid: [
            { required: true, message: '请选择机房', trigger: 'change' },
        ],
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
            { validator: check.checkDisk, trigger: 'change' },
        ],
        time: [
            { required: true,message: '请输入时间', trigger: 'change'},
            { validator: check.checkNumber, trigger: 'change' },
        ],
        number: [
            { required: true,message: '请输入数量', trigger: 'change'},
            { validator: check.checkNumber, trigger: 'change' },
        ],
        openvm: [
             { required: true, message: '请选择是否开机', trigger: 'change' },
        ],
    },
    'CMDB_APPLYHHVM':{
        dcid: [
            { required: true, message: '请选择机房', trigger: 'change' },
        ],
        rsp: [
            { required: true, message: '请先选择项目', trigger: 'change' },
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
            { validator: check.checkDisk, trigger: 'change' },
        ],
        time: [
            { required: true,message: '请输入时间', trigger: 'change'},
            { validator: check.checkNumber, trigger: 'change' },
        ],
        number: [
            { required: true,message: '请输入数量', trigger: 'change'},
            { validator: check.checkNumber, trigger: 'change' },
        ],
        openvm: [
             { required: true, message: '请选择是否开机', trigger: 'change' },
        ],
    },
    'JUMPER_APPLY':{
        dcid:[
            { required: true, message: '请选择机房', trigger: 'change' },
        ],
        rsp: [
            { required: true, message: '请选择项目', trigger: 'blur' },
        ],
        device: [
            { required: true, message: '请输入服务器', trigger: 'blur' },
        ],
    },
    'CMDB_ALIYUN_APPLYECS_COSTRATIO':{
         project: [
            { required: true, message: '请选择项目', trigger: 'change' },
        ],
        costRatio: [
            { required: true, message: '请输入分摊比率', trigger: 'change' },
            {validator: check.checkcostRatio,trigger: 'change'}
        ],
    },
    'CMDB_ALIYUN_APPLYECS':{
        dataCenter: [
                { required: true, message: '请选择机房', trigger: 'change' },
            ],
            // confUsage: [
            //     { required: true, message: '请选择用途', trigger: 'change' },
            // ],
            mem: [
                { required: true, message: '请选择MEM', trigger: 'blur' },
                {validator: check.checkNumber, trigger: 'blur'}
            ],
            cpu: [
                { required: true, message: '请选择CPU', trigger: 'blur' },
                {validator: check.checkNumber, trigger: 'blur'}
            ],
            eip: [
                { required: true, message: '请选择eip', trigger: 'change' },
            ],
            resourceGroup: [
                { required: true, message: '请选择资源组', trigger: 'change' },
            ],
            instanceType: [
                { required: true, message: '请选择实例类型', trigger: 'change' },
            ],
            image: [
                { required: true, message: '请选择镜像', trigger: 'change' },
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
                { validator: check.checkNumber, trigger: 'change' },
            ],
            systemDiskSize: [
                { required: true, message: '请输入系统盘大小', trigger: 'change' },
                { validator: check.checksystemDiskSize, trigger: 'change' },
            ],
            bandwidthOut:[
                { required: true, message: '请输入公网出带宽最大值', trigger: 'change' },
                { validator: check.checkNumber, trigger: 'change' },
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
                { validator: check.checkForamte, trigger: 'change' },
            ],
            amount:[
                { required: true, message: '请输入数量', trigger: 'change' },
                {validator: check.checkMax,trigger: 'change'}
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'change' },
                {validator: check. checkPassword,trigger: 'change'}
            ]
    }
}
export default formRules;