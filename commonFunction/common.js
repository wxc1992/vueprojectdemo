import Vue from 'vue'
export default {
  current_datetime_str:function() {
    let date = new Date();
    var month = date.getMonth()+1
    month = '' + month
    if (month.length == 1) {
      month = '0' + month
    }
    var day = date.getDate()
    day = '' + day
    if (day.length == 1) {
      day = '0' + day
    }
    var hour = date.getHours()
    hour = '' + hour
    if (hour.length == 1) {
      hour = '0' + hour
    }
    var minute = date.getMinutes()
    minute = '' + minute
    if (minute.length == 1) {
      minute = '0' + minute
    }
    var second = date.getSeconds()
    second = '' + second
    if (second.length == 1) {
      second = '0' + second
    }
    return '' + date.getFullYear() + month + day + hour + minute + second + date.getMilliseconds();
  },
  current_datetime_mysql_str:function() {
    let date = new Date();
    var month = date.getMonth()+1
    month = '' + month
    if (month.length == 1) {
      month = '0' + month
    }
    var day = date.getDate()
    day = '' + day
    if (day.length == 1) {
      day = '0' + day
    }
    var hour = date.getHours()
    hour = '' + hour
    if (hour.length == 1) {
      hour = '0' + hour
    }
    var minute = date.getMinutes()
    minute = '' + minute
    if (minute.length == 1) {
      minute = '0' + minute
    }
    var second = date.getSeconds()
    second = '' + second
    if (second.length == 1) {
      second = '0' + second
    }
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
  },
  excel: (function () { //导出excel公用的方法
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    return function (data, fileName) {
       var  blob = new Blob([data], { type: "application/vnd.ms-excel"});
       var  url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
  }()),
  excel2: (function () { //导出excel公用的方法
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    return function (data, fileName) {
       var  blob = new Blob([data], { type: "application/vnd.ms-excel.sheet.macroEnabled.12"});
       var  url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
  }()),
  formatNum:function(strNum) {
    if(strNum.length <= 3) {
        return strNum;
    }
    if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum;
    }
    var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
    var re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while(re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c;
  }
}
