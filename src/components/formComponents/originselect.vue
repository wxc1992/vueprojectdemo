<template>
     <a-select
              show-search
              mode="multiple"
              v-model="shenpiName"
              placeholder="请输入姓名查询"
              style="min-width: 160px"
              :show-arrow="false"
              allowClear
              :filter-option="false"
              :disabled="updateType==1"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
              @change="handleChangeOriginSeacher"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in submituserdata" :key="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
</template>
<script>
import debounce from "lodash/debounce";
import {mapActions} from 'vuex'
export default {
    props:['formmodel','updateType'],
    data(){
         this.fetchUser = debounce(this.fetchUser, 800);
        return {
            fetching: false,
            submituserdata: [],
            shenpiName: this.formmodel,
        }
    },
   watch:{
       formmodel(newValue,oldValue){
           if(newValue[0]==undefined){
               this.shenpiName = undefined
           } else {
            this.shenpiName = newValue
           }
          
       }
   },
   mounted(){
       console.log('shenpiName',this.shenpiName)
   },
    methods:{
        ...mapActions(['_getAllUsername']),
         async fetchUser(value) {
            console.log("fetching user", value);
            this.submituserdata = [];
            this.fetching = true;
            const res = await this._getAllUsername({ q: value });
            console.log("fetching user", res);
            const data = JSON.parse(res.data.msg).map((user) => ({
                text: `${user.name}/${user.um}`,
                value: `${user.name}/${user.um}`,
            }));
            this.submituserdata = data;
            this.fetching = false;
        },
        handleChangeOriginSeacher(value) {
            console.log("value", value);
            this.$emit('senduser',value)
            Object.assign(this, {
                value,
                data: [],
                fetching: false,
            });
        },
    }
}
</script>