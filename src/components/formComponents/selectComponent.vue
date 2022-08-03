<template>
  <div>
    <div v-if="inError === true">
      <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
    </div>
    <div v-if="inError === false">
      <template v-if="subType === 'ARRAY'">
        <div v-if="itemstyle === 'read'">
          <div v-if="item.highlight === 1">
            <div>
              {{ selectedValue }}
            </div>
          </div>
          <div v-if="item.highlight !== 1">
            <div>
              {{ selectedValue }}
            </div>
          </div>
        </div>
        <div v-if="itemstyle === 'write'">
          <a-row>
              <a-col :span="24">
                  <a-select v-model="item.item_value" allowClear  :placeholder="'请选择' + item.show_name">
                    <a-select-option
                      v-for="selectItem in selectOptions"
                      :key="selectItem.key"
                      :value="selectItem.key"
                    >
                      <!-- <span v-if="selectItem.desc" @click="mouseenter(selectItem)">
                        {{ selectItem.value }}
                      </span> -->
                      <span>{{ selectItem.value }}</span>
                    </a-select-option>
                  </a-select>
                </a-col>
          </a-row>
          <!-- <a-row v-if="selectOptions[0].hasOwnProperty('desc')">
            <a-col :span="24" style="line-height: 20px;"><a href="https://www.baidu.com" target="_black">如需查看申请类型,请点击连接查看</a></a-col>
          </a-row> -->
        </div>
      </template>
      <!--<template v-if="subType==='ARRAY'">-->
      <template v-if="subType === 'AJAX'">
        <template v-if="itemstyle === 'read'">
          <div v-if="getUM !== 'UM'">
            {{selectedValue}}
          </div>
          <div v-if="getUM == 'UM'">
              {{ showCnName[selectedValue]+'/'+ selectedValue}}
          </div>
        </template>
        <template v-if="itemstyle === 'write'">
          <div v-if="getUM == 'UM'">
            <a-select
              show-search
              v-model="shenpiName"
              placeholder="请输入姓名查询"
              style="min-width: 160px"
              :show-arrow="false"
              allowClear
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
              @change="handleChangeOriginSeacher"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="(d,index) in submituserdata" :key="index" :value="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
          </div>
        </template>
      </template>
      <!--<template v-if="subType==='AJAX'">-->
      <template v-if="subType === 'SSO_GROUP'">
        <div v-if="itemstyle === 'read'">
          <div>
            {{ showCnName[selectedValue]+'/'+ selectedValue }}
          </div>
        </div>
        <div v-if="itemstyle === 'write'">
          <div>
            <a-select v-model="item.item_value" allowClear  :placeholder="'请选择' + item.show_name">
              <a-select-option
                v-for="so in optiosData"
                v-bind:value="so['key']"
                :key="so.key"
              >
                {{ so["value"] }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </template>
      <!--<template v-if="subType==='CMDB_APP'">-->
      <template v-if="subType === 'CMDB_APP'">
        <div v-if="itemstyle === 'read'">
          <div>
            <span>{{selectedValue}}</span>
          </div>
        </div>
        <div v-if="itemstyle === 'write'">
          <div>
            <a-select v-model="item.item_value" allowClear  :placeholder="'请选择' + item.show_name">
              <a-select-option
                v-for="so in optiosData"
                v-bind:value="so['name']"
                :key="so.name"
              >
                {{ so["name"] }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </template>
      <!--<template v-if="subType==='CMDB_APP'">-->
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import debounce from "lodash/debounce";
const tips= {
  'LV0': "可访问 外部堡垒机",
  'LV1': "可访问 wiki、jira、Nextcloud、files",
  'LV3': "可访问 LV1 + git、jenkins、办公网堡垒机、nexus、achain、nacos、harbor、测试平台、用例平台、Mock平台、某些项目的集成/验收环境/数据库资源",
  'LV5': "可访问 LV3 + 生产堡垒机",
  'LV7': "可访问 LV5 + 安全平台服务",
  'admin': '管理员账号',
  'add': '新增访问策略'
}
export default {
  name: "ACHAIN-SELECT",
  props: ["allSteps", "item", "itemstyle","showCnName"],
  data() {
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      inError: false,
      subType: "",
      submituserdata: [],
      fetching: false,
      optiosData: [],
      shenpiName:''
    };
  },
  methods: {
    ...mapActions([
      "_getAllUsername",
      "_get_user_id_by_um",
      "_getListssogroupmembers",
      "_getListcmdb",
    ]),
    initPlugin() {
      var pluginArgs = this.item["plugin_args"];
      /* SELECT类型的plugin的pluginArgs格式如下
            {
              subtype: "ARRAY", "AJAX"
              data: //根据subtype的类型data会包含具体信息
            }

            如果subtype为ARRAY，则data的格式类似于:
            [
              {
                "key": "XXX", -- 内部值
                "value": "YYY", -- 显示值
              },
              {
                "key": "XXX", -- 内部值
                "value": "YYY", -- 显示值
              }
            ]

            如果subtype为AJAX，则data的格式类似于:
            {
              source: "CMDB_APP_LIST"
            }
          */
      //   console.log(`select-----@@@@@pluginArgs: ${pluginArgs}`);
      var subtype = JSON.parse(pluginArgs)["subtype"];
      if (subtype === undefined) {
        // console.log(`select-----@@@@@  invalid subtype ${subtype}`);
        this.inError = true;
        return;
      }
      subtype = subtype.toUpperCase(subtype);
      if (
        subtype != "ARRAY" &&
        subtype != "AJAX" &&
        subtype != "SSO_GROUP" &&
        subtype != "EXPORTED_FILE" &&
        subtype != "DBS" &&
        subtype != "SPECIFIC_USER" &&
        subtype != "PADB_APP_DEV_USER" &&
        subtype != "DEV_VERSIONS" &&
        subtype != "APP_DOMAINS" &&
        subtype != "CMDB_APP" &&
        subtype != "CFGC_APP" &&
        subtype != "CFGC_APPS" &&
        subtype != "CFGC_PLANS" &&
        subtype != "DUTY"
      ) {
        // console.log(`select-----@@@@@invalid subtype ${subtype}`);
        this.inError = true;
        return;
      }
      this.subType = subtype;
    },
    getAjaxOption() {
      var pluginArgs = this.item["plugin_args"];
      var pluginArgs = JSON.parse(pluginArgs);
      var basicOption = SELECT_AJAX_URL_MAPPING[pluginArgs["data"]["source"]];
      if (basicOption === undefined) {
        this.inError = true;
        return;
      }
      var option = {};
      option["ajax"] = {};
      option["ajax"]["url"] = basicOption["url"];
      option["ajax"]["type"] = "GET";
      option["ajax"]["dataType"] = "json";
      option["ajax"]["data"] = { q: "{{{q}}}" };
      option["locale"] = {
        emptyTitle: "请输入字符进行查找",
        currentlySelected: "当前选择项",
        errorText: "发生错误",
        searchPlaceholder: "请输入字符进行查找",
        statusInitialized: "请输入字符进行查找",
        statusSearching: "查找中...",
        statusNoResults: "没有满足条件的结果",
      };
      option["preprocessData"] = basicOption["preprocessFunc"];
      return option;
    },
    async fetchUser(value) {
      console.log("fetching user", value);
      this.submituserdata = [];
      this.fetching = true;
      const res = await this._getAllUsername({ q: value });
      console.log("fetching user", res);
      const data = JSON.parse(res.data.msg).map((user) => ({
        text: `${user.um}/${user.name}`,
        value: `${user.um}/${user.name}`,
      }));
      this.submituserdata = data;
      this.fetching = false;
    },
    handleChangeOriginSeacher(value) {
      console.log("value", value);
      this.shenpiName = value
      this.item.item_value = value?value.split('/')[0]:''
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
    async getOptionsDAta() {
      var pluginArgs = JSON.parse(this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      if (subtype == "SSO_GROUP") {
        const res = await this._getListssogroupmembers({
          group_name: pluginArgs.data.source,
        });
        if (res.status === 200 && res.data.length > 0) {
          for (var member of res.data) {
            this.optiosData.push({
              key: member.um,
              value: `${member.name}/${member.um}`,
            });
          }
        } else {
           this.inError = true
          this.optiosData = [];
        }
      }else if (subtype == "CMDB_APP") {
        const res = await this._getListcmdb();
        console.log('_getListcmdb',res)
        if (res.status === 200 && res.data.length > 0) {
           this.optiosData = res.data;
        }  else {
           this.inError = true
           this.optiosData = [];
        }
        
      }else {

      }
    },
    mouseenter(item){
      this.$notification.open({
        message: item.value,
        description:
          tips[item.desc],
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
    
  },
  computed: {
    getUM() {
      var pluginArgs = this.item["plugin_args"];
      var pluginArgs = JSON.parse(pluginArgs);
      // if(itemstyle === 'read'){
      //    if(this.item.item_value){
      //     this.shenpiName = this.item.item_value+'/'+this.showCnName[this.item.item_value];
      //   } else {
      //     this.shenpiName = undefined
      //   }
      // }
      return pluginArgs["data"]["source"];
    },
    getType() {
      var pluginArgs = JSON.parse(this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      return subtype;
    },
    selectedValue() {
      var pluginArgs = JSON.parse(this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      if (subtype === "ARRAY") {
        var data = pluginArgs["data"];
        for (var target of data) {
          if (target["key"] == this.item.item_value) {
            return target["value"];
          }
        }
       
        return "";
      } else if (subtype === "AJAX") {
        //目前先返回 当前的值 后面如果加斜杠 例如 ：伍雪程/wuxuecheng 调用 action --_get_user_id_by_um
        return this.item.item_value;
      } else if (subtype === "SSO_GROUP") {
        //目前先返回 当前的值 后面如果加斜杠 例如 ：伍雪程/wuxuecheng 调用 action --_get_user_id_by_um
        return this.item.item_value;
      } else if (subtype === "CMDB_APP") {
        return this.item.item_value;
      } else {
        return "";
      }
    },
    selectOptions() {
      //   console.log('select ----item,,,,,',this.item)
      const _this = this;
      var pluginArgs = JSON.parse(_this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      if (subtype === "ARRAY") {
        return pluginArgs["data"];
      } else {
        return "";
      }
    },
    showCnNameprops(){
      console.log('computed --- showCnNameprops---',this.showCnName)
      return this.showCnName
    }
  },
  watch:{
    showCnNameprops(oldValue,newValue){
      if(newValue!==oldValue){
        if(this.item.item_value){
            this.shenpiName = this.item.item_value+'/'+this.showCnName[this.item.item_value];
        } else {
            this.shenpiName = undefined
        }
      }
    }
  },
  mounted() {
   console.log('mounted --- showCnName---',this.showCnName)
     if(this.item.item_value){
            this.shenpiName = this.item.item_value+'/'+this.showCnName[this.item.item_value];
        } else {
            this.shenpiName = undefined
        }
      
    this.initPlugin();
    this.getOptionsDAta();
  },
};
</script>
<style lang="less">
</style>
