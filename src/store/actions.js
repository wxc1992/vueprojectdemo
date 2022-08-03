import axios from 'axios';
import approveproxy from './modules/approveproxy'
// let Authorization = localStorage.getItem('token')
export default {
    ...approveproxy,
    _Addglobalnotice(context,param){ //增加全局通知
        return new Promise((resolve, reject) => {
            axios.post(`/v2/ajax/mgr/globalnotice`,param).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },
    _getglobalnotice(context,param){ //获取全局通知
        return new Promise((resolve, reject) => {
            axios.post(`/v2/ajax/mgr/getglobalnotice`,{'{}':''}).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },

    _loginOut(context,param){ //退出登录
        return new Promise((resolve,reject)=>{
            axios.get('/v2/ajax/auth/logout').then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },

    

}
//

