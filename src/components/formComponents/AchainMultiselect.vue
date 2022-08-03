<template>
  <div>
    <div v-if="inError === true">
      <div>CHAIN-ERROR-请刷新页面重试或联系管理员chenkai</div>
    </div>
    <div v-if="inError === false">
        <template v-if="subType==='HTTP'">
            <template v-if="itemstyle==='read'">
              <template>
                <div>
                  {{selectedValue}}
                </div>
              </template>
            </template>
            <template v-if="itemstyle==='write'">
              <div v-if="valueSource==='SSO_USERS'">
                <a-select v-model="item.item_value" allowClear mode="multiple"  :placeholder="'请选择' + item.show_name">
                    <a-select-option
                        v-for="so in optiosData"
                        v-bind:value="so['key']"
                        :key="so.key"
                    >
                        {{ so["value"] }}
                    </a-select-option>
                </a-select>
              </div>
               <div v-if="valueSource==='CMDB_APPS'">
                  <a-select v-model="item.item_value" allowClear mode="multiple" :placeholder="'请选择' + item.show_name">
                      <a-select-option
                          v-for="so in optiosData"
                          v-bind:value="so['key']"
                          :key="so.key"
                      >
                          {{ so["value"] }}
                      </a-select-option>
                  </a-select>
              </div>
            </template>
          </template> <!--<template v-if="subType==='HTTP'">-->
         <template v-if="subType==='ARRAY'">
            <template v-if="itemstyle==='read'">
                <div class="col-xs-5">
                  {{selectedValue}}
                </div>
            </template>
            <template v-if="itemstyle==='write'">
              <div class="col-xs-5">
                  <a-select v-model="item.item_value" allowClear mode="multiple"  :placeholder="'请选择' + item.show_name">
                    <a-select-option
                        v-for="so in optiosData"
                        v-bind:value="so['key']"
                        :key="so.key"
                    >
                        {{ so["value"] }}
                    </a-select-option>
                </a-select>
              </div>
            </template>
          </template> <!--<template v-if="subType==='HTTP'">-->
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import debounce from "lodash/debounce";
export default {
  name: "ACHAIN-MULTISELECT",
  props: ["allSteps", "item", "itemstyle"],
  data() {

    return {
      inError: false,
      subType: "",
      optiosData: [],
      valueSource: "",
    };
  },
  methods: {
    ...mapActions([
        '_getallusers',
        '_getListcmdb'
    ]),
    initPlugin() {
        var pluginArgs = this.item['plugin_args']
        /* MULTISELECT类型的plugin的pluginArgs格式如下
        {
            subtype: "HTTP"
            data: //根据subtype的类型data会包含具体信息
        }

        一般data的格式为:
        data: {
            source: "XXX"
        }
        */
        console.log(`pluginArgs: ${pluginArgs}`)
        var subtype = JSON.parse(pluginArgs)['subtype']
        if (subtype === undefined) {
            console.log(`invalid subtype ${subtype}`)
            this.inError = true
            return
        }
        subtype = subtype.toUpperCase(subtype)
        if (subtype != "HTTP" && subtype != "ARRAY") {
            console.log(`invalid subtype ${subtype}`)
            this.inError = true
            return
        }
        this.subType = subtype
        this.valueSource = JSON.parse(pluginArgs)['data']['source']
    },
    async getOptionsDAta() {
      var pluginArgs = JSON.parse(this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      var oringinulr = pluginArgs['data']['source'];
      if (subtype == "HTTP") {
           if(oringinulr=='SSO_USERS'){
               const res = await this._getallusers();
                console.log('SSO_USERS',res)
                if (res.status === 200 && res.data.returnCode == 0) {
                    var obj = {};
                    var arr = res.data.returnMsg.reduce(function(item, next) {
                        obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                        return item;
                    }, []);
                for (var member of arr) {
                    this.optiosData.push({
                        key: member.id,
                        value: member.name,
                    });
                }
                console.log(' this.optiosData', this.optiosData)
                } else {
                this.inError = true
                this.optiosData = [];
                }
           }else if(oringinulr === "CMDB_APPS"){
             const res = await this._getListcmdb();
              console.log('_getListcmdb',res)
              if (res.status === 200 && res.data.length > 0) {
                 let result = []
                 for (var app of res.data) {
                  if (app.name=="default") {
                    continue
                  }
                  result.push(
                    {
                      key: `${app.name}`,
                      value: `${app.name}`
                    }
                  )
                }
                this.optiosData = result;
              }  else {
                this.inError = true
                this.optiosData = [];
              }
           }
        
      } else  if (subtype === "ARRAY") {
         this.optiosData = pluginArgs['data']
      } 
    }

  },
  computed: {
    getUrlSource() {
      var pluginArgs = this.item["plugin_args"];
      var pluginArgs = JSON.parse(pluginArgs);
      return pluginArgs["data"]["source"];
    },
    getType() {
      var pluginArgs = JSON.parse(this.item["plugin_args"]);
      var subtype = pluginArgs["subtype"];
      return subtype;
    },
    selectedValue: function() {
        return this.item.item_value
    }
  },
  created() {
    if (this.item.item_value == "") {
      this.item.item_value = undefined;
    }
    this.initPlugin();
    this.getOptionsDAta();
  },
};
</script>
<style lang="less">
</style>
