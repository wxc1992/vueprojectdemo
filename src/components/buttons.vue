<template>
  <div style="text-align: center; display: inline-block">
    <a-button
      v-if="cancelPrivilege === true && allSteps.status !== 'INIT'"
      style="margin-left: 5px"
      @click="cancelChain"
      >取消此流程</a-button
    >
    <a-button
      v-if="rerunPrivilege === true && chain.status === 'FAILED'"
      style="margin-left: 5px"
      @click="rerunChain"
      >重新执行此步骤</a-button
    >
    <a-button
      v-if="addStepPrivilege === true"
      style="margin-left: 5px"
      @click="addStep"
    >
      新增前置审批步骤</a-button
    >
    <a-button
      v-if="
        changeApproverPrivilege === true && allSteps.status === 'PROCESSING'
      "
      style="margin-left: 5px"
      @click="changeApprover"
      >修改步骤审批人</a-button
    >
    <a-popconfirm
      title="您确定重新编辑么？"
      ok-text="是"
      cancel-text="否"
      @confirm="confirm('EDIT')"
      style="margin-left: 5px"
      @cancel="cancel"
    >
      <a-button v-if="editPrivilege === true" @click="editChain" 
        >编辑流程</a-button
      >
    </a-popconfirm>
    <a-button
      v-if="allSteps.status === 'PROCESSING'"
      style="margin-left: 5px"
      @click="addChainExtraMailReceivers"
     
    >
      新增邮件接收人</a-button
    >

    <a-button
      v-if="editable_step_idsInfo.length === 0 && allSteps.status !== 'INIT'"
      type="primary"
      style="margin-left: 5px"
      @click="addChainComment"
      >新增备注</a-button
    >
    <div>
      <a-modal
        title="编辑"
        :visible="showEdit"
        @ok="(e) => handleOk(e, 'EDIT')"
        @cancel="(e) => handleCancel(e, 'EDIT')"
      >
        <a-alert
          style="margin-bottom: 10px"
          message="如果确定请输入编辑理由！！！若您点击确定则流程的当前审批链都会立刻被重置!"
          banner
        />
        <a-textarea
          placeholder="请输入编辑理由"
          :rows="4"
          v-model="edit_comment"
        />
      </a-modal>
      <a-modal
        title="新增前置审批步骤"
        :visible="showAddStepDiv"
        @ok="(e) => handleOk(e, 'ADD_STEP')"
        @cancel="(e) => handleCancel(e, 'ADD_STEP')"
      >
        <div>步骤说明:</div>
        <a-textarea
          placeholder="请输入步骤名"
          :rows="4"
          v-model="ADD_STEP_comment"
        />
        <div>审批人UM:</div>
        <a-select
          show-search
          :value="value"
          placeholder="输入审批人姓名"
          style="min-width: 160px"
          :show-arrow="false"
          allowClear
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="fetchUser"
          @change="handleChangeOriginSeacher"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in submituserdata" :key="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-modal>
      <a-modal
        title="修改审批人步骤"
        :visible="showChangeApproverDiv"
        @ok="(e) => handleOk(e, 'update_aprover')"
        @cancel="(e) => handleCancel(e, 'update_aprover')"
      >
        <div>
          <div style="line-height: 40px">选择要修改审批人的步骤:</div>
          <a-select
            placeholder="输入审批人姓名"
            allowClear
            v-model="changeApproverstep"
            style="min-width: 160px"
          >
            <a-select-option v-for="step in showSteps" :key="step.name">
              {{ step.name }}
            </a-select-option>
          </a-select>
          <div style="line-height: 40px">审批人UM:</div>
          <a-select
            show-search
            :value="value"
            placeholder="输入审批人姓名"
            style="min-width: 160px"
            :show-arrow="false"
            allowClear
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchUser"
            @change="handleChangeOriginSeacher"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in submituserdata" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </div>
      </a-modal>
      <a-modal
        title="备注"
        :visible="showAddcomment"
        @ok="(e) => handleOk(e, 'add_comment')"
        @cancel="(e) => handleCancel(e, 'add_comment')"
      >
        <a-textarea
          placeholder="请输入备注内容"
          :rows="4"
          v-model="Lastcomment"
        />
      </a-modal>
      <a-modal
        title="邮件接收人"
        :visible="showEmailDio"
        @ok="(e) => handleOk(e, 'update_Email')"
        @cancel="(e) => handleCancel(e, 'update_Email')"
      >
         <a-alert
          style="margin-bottom: 10px"
          message="请输入新增的邮件接收人邮箱地址。多个地址请用空格分隔，不要使用如分号、逗号等符号进行分隔"
          banner
        />
        <a-textarea
          placeholder="请输入邮件接收人"
          :rows="4"
          v-model="ADD_Email"
        />
      </a-modal>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import debounce from "lodash.debounce";
export default {
  props: ["chainUserRelatedInfo", "allSteps", "editable_step_idsInfo"],
  data() {
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      fetching: false, //查询睡loading
      submituserdata: [],
      approved_um: "",
      value: undefined,
      // 修改步骤审批人提示框是否显示
      showChangeApproverDiv: false,
      //新增邮件收件人
      showEmailDio: false,
      ADD_Email: undefined,
      // 修改步骤审批人的步骤
      changeApproverstep: "",
      // 修改步骤审批人的修改后审批人
      changeApproverUM: "",
      // 新增步骤提示框是否显示
      showAddStepDiv: false,
      // 新增审批步骤步骤说明
      addStepStepComment: "",
      // 新增审批步骤审批人
      addStepApproverUM: "",
      edit_comment: undefined,
      showAddcomment: undefined, //显示新增备注
      Lastcomment: undefined,
      ADD_STEP_comment: undefined,
      showEdit: false, //编辑弹框
      // 权限信息
      changeApproverPrivilege: false,
      addStepPrivilege: false,
      cancelPrivilege: false,

      editPrivilege: false,
      rerunPrivilege: false,
    };
  },
  methods: {
    ...mapActions([
      "_changeApprover",
      "_addcomment",
      "_changeEmailReceivers",
      "_resetChian",
      "_getListssogroupmembers",
      "_get_current_user_info",
      "_getAllUsername",
      "_addstep",
      "_updatelProcess"
    ]),
    confirm(type) {
      console.log(type);
      if (type == "EDIT") {
        this.showEdit = true;
      }
    },
    async handleEdit() {
      const res = await this._resetChian({
        chain_id: this.allSteps.id,
        edit_comment: this.edit_comment,
      });
      if (res.status === 200) {
        this.showEdit = false;
        this.edit_comment = undefined;
        this.renderButton();
        this.$message.success(res.data.msg);
        this.$emit("resetProcess", true);
      }
    },
    handleOk(e, type) {
      console.log(type);
      if (type == "EDIT") {
        if (this.edit_comment == "" || this.edit_comment == undefined) {
          this.$message.warning("请填下您的理由");
        } else {
          this.edit_comment && this.handleEdit();
        }
      }
      if (type == "ADD_STEP") {
        if (this.approved_um == "") {
          this.$message.warning("请输入审批人");
          return;
        }
        if (this.ADD_STEP_comment.trim() == "") {
          this.$message.warning("请输入步骤说明");
          return;
        }
        var params = {
          chain_id: this.allSteps.id,
          new_step_name: this.ADD_STEP_comment,
          new_step_approver: this.approved_um,
          current_step_id: this.editable_step_idsInfo[0].id,
        };
        this._addstep({ ...params }).then((res) => {
          console.log("_addstep", res);
          if (res.status === 200) {
            this.$message.success("新增前置步骤成功");
            this.showAddStepDiv = false;
            this.$emit("resetProcess", true);
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(res=>{
           this.$message.error(res.response.data.msg);
        });
      }
      if (type == "update_aprover") {
        if (this.changeApproverstep.trim() == "") {
          this.$message.warning("请选择步骤");
          return;
        }
        if (this.changeApproverUM == "") {
          this.$message.warning("请输入审批人");
          return;
        }
        var params = {
          chain_id: this.allSteps.id,
          step_name: this.changeApproverstep,
          new_step_approver: this.changeApproverUM,
        };
        console.log("params", params);
        this._changeApprover({ ...params }).then((res) => {
          if (res.status === 200) {
            this.$message.success("修改步骤审批人成功");
            this.showChangeApproverDiv = false;
            this.$emit("resetProcess", true);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
      if (type == "update_Email") {
        let params = {
          chain_id: this.allSteps.id,
          emails: this.ADD_Email.trim().split(" "),
        };
        this._changeEmailReceivers({ ...params })
          .then((res) => {
            console.log("res_changeEmailReceivers", res);
            if (res.status === 200) {
              this.$message.success("新增邮件收件人成功");
              this.showEmailDio = false;
              this.$emit("resetProcess", true);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((res) => {
            // console.log('res.response',res.response)
            this.$message.error(res.response.data.msg);
          });
      }
      if (type == "add_comment") {
        // this.showAddcomment = false
        this._addcomment({
          chain_id: this.allSteps.id,
          comment: this.Lastcomment,
        })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("新增备注成功");
              this.showAddcomment = false;
              this.$emit("resetProcess", true);
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((res) => {
            // console.log('res.response',res.response)
            this.$message.error(res.response.data.msg);
          });
      }
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
      this.approved_um = value == undefined ? "" : value.split("/")[0];
      this.changeApproverUM = value == undefined ? "" : value.split("/")[0];
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
    handleCancel(e, type) {
      if (type == "EDIT") {
        this.showEdit = false;
      } else if (type == "ADD_STEP") {
        this.showAddStepDiv = false;
      } else if (type == "update_aprover") {
        this.showChangeApproverDiv = false;
      } else if (type == "update_Email") {
        this.showEmailDio = false;
      } else if (type == "add_comment") {
        this.showAddcomment = false;
      }
    },
    cancel(e) {
      this.$message.error("您已取消");
    },
    async get_changeApprover_users() {
      const res = await this._getListssogroupmembers({
        group_name: "CMDB_OPS",
      });
      console.log("res", res);

      if (res.status == 200) {
        //_get_current_user_info
        let currentUM = "";
        if (localStorage.getItem("currentUM")) {
          currentUM = localStorage.getItem("currentUM");
        } else {
          const res2 = await this._get_current_user_info();
          if (res2.status === 200) {
            localStorage.setItem("currentUM", res2.data.um);
            localStorage.setItem("userName", res2.data.um);
            currentUM = res2.data.um;
          }
        }
        this.changeApproverPrivilege = res.data.some(
          (item) => item.um == currentUM
        );
      }
    },
    cancelChain() {
      var chainId = this.allSteps.id;
      var params = {
        type:'CANCEL',
        params:{
            chain: this.allSteps,
            chain_info_by_user: this.chainUserRelatedInfo,
        }
      };
      this._updatelProcess(params).then((res) => {
            console.log("_updatelProcess", res);
            if (res.status === 200) {
              this.$message.success("取消流程成功");
            //   this.showEmailDio = false;
              this.$emit("resetProcess", true);
              
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((res) => {
            // console.log('res.response',res.response)
            this.$message.error(res.response.data.msg);
          });
    }, //取消流程
    rerunChain() {}, //重新执行此步骤
    addStep() {
      if (this.editable_step_idsInfo.length === 0) {
        this.$message.warning("当前无可编辑步骤");
        return;
      } else {
        this.showAddStepDiv = true;
      }
    }, //新增前置审批步骤
    editChain() {}, // 编辑流程
    changeApprover() {
      this.showChangeApproverDiv = true;
    },
    addChainComment() {
      this.showAddcomment = true;
    }, //新增备注
    addChainExtraMailReceivers() {
      this.showEmailDio = true;
    },
    renderButton() {
      // 生成审批按钮
     
      if(this.chainUserRelatedInfo==undefined){
        return
      }
       console.log(
        "this.chainUserRelatedInfo",
        this.chainUserRelatedInfo
      );
      if(this.chainUserRelatedInfo!==undefined && this.chainUserRelatedInfo["actions"].length>0){
          if (this.chainUserRelatedInfo["actions"].indexOf("CANCEL") !== -1) {
            this.cancelPrivilege = true;
          }
          if (this.chainUserRelatedInfo["actions"].indexOf("RERUN") !== -1) {
            this.rerunPrivilege = true;
          }
          if (this.chainUserRelatedInfo["actions"].indexOf("ADD_STEP") !== -1) {
            this.addStepPrivilege = true;
          }

          if (this.chainUserRelatedInfo["actions"].indexOf("EDIT") !== -1) {
            this.editPrivilege = true;
          }
        }
      
    },
  },
  computed: {
    showSteps() {
      return (
        this.allSteps.steps && this.allSteps.steps.filter((item) => item.status === "INIT")
      );
    },
  },
  watch:{
      chainUserRelatedInfo(oldvalue,newvalue){
        if(newvalue==undefined){
            return false
        }
          if(oldvalue !==newvalue){
              this.renderButton()
              this.get_changeApprover_users()
          }
      }
  },
  created() {
    this.renderButton();
    this.get_changeApprover_users();
    console.log("editable_step_idsInfo", this.editable_step_idsInfo);
  },
};
</script>
<style lang="less" scoped>
  .ant-btn-primary{
    background: #69aa46!important
  }
</style>