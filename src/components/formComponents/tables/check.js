 let check = {
    checkNumber: function(rule, value, callback){
        if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
            callback(new Error('请输入正整数'));
        } else {
            callback();
        }  
    },
    checkDisk: function(rule, value, callback){
        if(value=='' || value==undefined){
            callback(); 
         }
         if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
             callback(new Error('请输入正整数'));
         } else {
             callback();
         } 
    },
    checkcostRatio: function (rule, value, callback){
        if (value !=='' && !( parseInt(value,10) <= 1 &&  parseInt(value,10) >=0)) {
            callback(new Error('分摊比例需在0-1之间'));
        } else {
            callback();
        } 
    },
    checkForamte:function(rule, value, callback){
        if (value !=='' && !(/(^[A-Za-z][A-Za-z0-9_-]{1,127}$)/.test(value) )) {
            callback(new Error('实例名格式错误：以大小写字母开头，可包含大小写字母、数字、下划线(_)、短划线(-)'));
        } else {
            callback();
        } 
    },
    checkDNS:function(rule, value, callback){
        if (value !=='' && !(/(^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$)/.test(value) )) {
            callback(new Error('解析值格式错误'));
        } else {
            callback();
        } 
    },
    checkMax:function (rule, value, callback){
        if (value !=='' && parseInt(value,10) > 100) {
            callback(new Error('单次创建不得超过100台'));
        } else {
            callback();
        } 
    },
    checksystemDiskSize:function (rule, value, callback){
        if (value !=='' && !(/(^[1-9]\d*$)/.test(value))) {
            callback(new Error('请输入正整数'));
        } else if(parseInt(value,10) > 500 || parseInt(value,10) < 40){
            callback(new Error('系统盘大小输入在40-500'));
        }else {
            callback();
        } 
    },
    checkPassword:function (rule, value, callback){
        if (value !=='' && !new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}").test(value) ){
            callback(new Error('密码必须包含大小写字母、数字和特殊字符（长度大于等于8位,小于等于30）'));
        } else if(value.length>30){
            callback(new Error('长度大于等于8位,小于等于30'));
        }else {
            callback();
        } 
    },
   
}
export default check;