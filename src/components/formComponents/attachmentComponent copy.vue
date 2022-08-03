<template>
    <div>
         <div v-if="inError===true">
            <div class="col-xs-5 ac-step-item-error">
                CHAIN-ERROR-请刷新页面重试或联系管理员chenkai
            </div>
         </div>
         <div v-if="inError===false">
               <div v-if="subType==='USER_INPUT'">
                    <div v-if="itemstyle==='write'">
                        <a-upload
                            :multiple="true"
                            :file-list="fileList" 
                            :remove="handleRemove" 
                            :before-upload="beforeUpload"
                        >
                            <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                        </a-upload>
                        <a-button
                                type="primary"
                                :disabled="fileList.length === 0"
                                :loading="uploading"
                                style="margin-top: 16px"
                                @click="handleUpload"
                            >
                            {{ uploading ? '正在上传' : '开始上传' }}
                        </a-button>
                    </div>
                    <div v-if="itemstyle==='read'">
                        <template v-if="item.item_value == ''">
                            <span>未上传文件</span>
                        </template>
                        <template v-if="fileName !== '未上传文件'">
                            <a style="margin-right:5px;text-decoration:underline" :href="'/v2/ajax/file/download/'+file.path+'/'+file.file_name" v-for="(file,index) in fileName" :key="index">{{file.file_name}}</a>
                        </template>
                    </div>
              </div> <!--<div v-if="subType==='USER_INPUT'">-->
         </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    name:'ACHAIN-ATTACHMENT',
    props: ['chain', 'item', 'itemstyle'],
    data(){
        return {
            fileList:[],
            subType: "",
            inError: false,
            uploading: false,
            fileres: []
        }
    },
    methods:{
        ...mapActions(['uploadFile']),
        initPlugin() {
          var pluginArgs = this.item['plugin_args']
          /* ATTACHMENT类型的plugin的pluginArgs格式如下
            {
              subtype: "USER_INPUT"
              data: //根据subtype的类型data会包含具体信息
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
          if (subtype != "USER_INPUT") {
            console.log(`invalid subtype ${subtype}`)
            this.inError = true
            return
          }
          this.subType = subtype
        },
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        beforeUpload(file) {
            console.log('beforeUpload--file',file)
            let isLoad =  this.fileList.some(item=>item.name == file.name);
            if(isLoad){
                this.$message.warning('此文件已经存在上传列表')
            } else {
                this.fileList = [...this.fileList, file];
            }
            return false;
        },
        handleUpload() {
            const { fileList } = this;
            const formData = new FormData();
             this.uploading = true;
            fileList.forEach(file => {
                formData.append('ac-file', file);
                this.uploadFile(formData).then(res => {
                    if (res.status == 200) {
                        this.$message.success("上传成功");
                        // this.fileList = [];
                        this.uploading = false;
                        this.fileres.push(res.data)
                        console.log(this.fileres)
                        this.item.item_value = JSON.stringify(this.fileres)
                        console.log('file--- this.item.item_value ', this.item.item_value )
                    } else {
                        this.$message.error("上传失败");
                        this.uploading = false;
                    }
                });
            });
            // this.uploadFile(formData).then(res => {
            //     if (res.status == 200) {
            //         this.$message.success("上传成功");
            //         // this.fileList = [];
                   
            //         this.uploading = false;
            //         this.fileres.push(res.data)
            //         console.log(this.fileres)
            //         this.item.item_value = JSON.stringify(this.fileres)
            //         console.log('file--- this.item.item_value ', this.item.item_value )
            //     } else {
            //         this.$message.error("上传失败");
            //         this.uploading = false;
            //     }
            // });
        },
    },
    created(){
        this.initPlugin()
    },
     computed: {
        fileName: function() {
            // console.log('this.item.item_value',JSON.parse(this.item.item_value))
          if (this.item.item_value == "") {
            return '未上传文件'
          } else {
            var info = JSON.parse(this.item.item_value)
            if(info instanceof Array){
                return info
            } else {
                 return [info]
            }
          }
        },
     }
}
</script>
<style lang="less">

</style>
