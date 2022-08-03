import axios from 'axios';
import qs from 'qs';

export default {
    _addapproveproxy(context,param){ //新增代理审批
        return new Promise((resolve, reject) => {
            axios.post(`/v2/ajax/mgr/addapproveproxy`,param).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },
    _getlistapproveproxy(context,param){ //获取所有新增的代理审批人
        return new Promise((resolve, reject) => {
            axios.get(`/v2/ajax/mgr/listapproveproxy`,{params: {'{}':'',_: +new Date()}}).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },
    _delapproveproxy(context,param){ //删除代理审批人
        return new Promise((resolve, reject) => {
            axios.post(`/v2/ajax/mgr/delapproveproxy/${param.id}`,{'{}':''}).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },

}