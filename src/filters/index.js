export default {
    convertChainStatus(status) {
        if (status === "INIT") {
          return "等待提交"
        } else if (status === "PROCESSING") {
          return "进行中"
        } else if (status === "FAILED") {
          return "流程失败"
        } else if (status === "SUCCESSFUL") {
          return "成功完成"
        } else if (status === "CANCEL") {
          return "已取消"
        }
        return status
      },
      isInteger(obj) {
        return parseInt(obj, 10) == obj
      },
      percentage(value) {
        if (isNaN(value)) {
          return value
        }
        return Number(Number(value) * 100).toFixed(2) + '%';
      },
      emptyValue(value) {
        if ((!isNaN(value) && !parseFloat(value)) || !value || value== undefined || value == null) {
          return ''
        }
        return value;
      },
     
}