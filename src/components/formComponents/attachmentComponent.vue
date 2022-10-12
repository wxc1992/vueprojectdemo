<template>
    <div id="attachments">
         <div v-if="inError===true">
            <div class="col-xs-5 ac-step-item-error">
                CHAIN-ERROR-请刷新页面重试或联系管理员chenkai
            </div>
         </div>
         <div v-if="inError===false">
               <div v-if="subType==='USER_INPUT'">
                    <div v-if="itemstyle==='write'">
                        <a-upload
                            action="/v2/ajax/file/upload"
                            :default-file-list="defaultFileList"
                            :multiple="true"
                            @change="handleChange"
                            @preview="handlePreview"
                            name="ac-file"
                        >
                            <a-button> <a-icon type="upload" />  上传附件 </a-button>
                        </a-upload>
                        <!-- <a-upload
                            :file-list="fileList" 
                            :remove="handleRemove" 
                            :before-upload="beforeUpload"
                        >
                            <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                        </a-upload>
                        <div v-if="item.item_value !== ''">
                            <a style="margin-right:5px;text-decoration:underline" :href="'/v2/ajax/file/download/'+file.path+'/'+file.file_name" v-for="(file,index) in fileName" :key="index">{{file.file_name}}</a>
                        </div>
                        <a-button
                                type="primary"
                                :disabled="fileList.length === 0"
                                :loading="uploading"
                                style="margin-top: 16px"
                                @click="handleUpload"
                            >
                            {{ uploading ? '正在上传' : '开始上传' }}
                        </a-button> -->
                    </div>
                    <div v-if="itemstyle==='read'">
                        <template v-if="item.item_value == ''">
                            <span>未上传文件</span>
                        </template>
                        <template v-if="fileName !== '未上传文件'">
                            <div v-for="(file,index) in fileName" :key="index" style="margin-right: 10px">
                                <a style="margin-right:5px;text-decoration:underline" :href="'/v2/ajax/file/download/'+file.path+'/'+file.file_name" >{{file.file_name}}</a>
                                <span style="font-size:12px;cursor:pointer" @click="showPreview(file)">预览</span>
                                <!-- <pdf v-if="file.file_name.indexOf('.pdf')" ref="pdf" :src="'/v2/ajax/file/download/'+file.path+'/'+file.file_name" style="width: 100%;" /> -->
                            </div>
                        </template>
                    </div>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel(0)" width="80%" id="previewVisible">
                            <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                     <a-modal :visible="showWord" :footer="null" @cancel="handleCancel(3)" width="80%" id="showWord">
                             <div v-html="wordstreams" style="width:90%;">
                             </div>
                    </a-modal>
                    <a-modal :visible="showTxt" :footer="null" @cancel="handleCancel(4)" width="80%" id="showTxt">
                             <div v-html="txtstreams" style="width:90%;min-height:200px">
                             </div>
                    </a-modal>
                     <a-modal :visible="showExcel" :footer="null" @cancel="handleCancel(2)" width="100%" id="showExcel">
                            <a-tabs default-active-key="1">
                                <a-tab-pane v-for="(item,index) in sheetslist" :key="index" :tab="item.name">
                                    <div v-html="item.html" style="width:100%;overflow:hidden;overflow-x:scroll"></div>
                                </a-tab-pane>
                            </a-tabs>
                    </a-modal>
                     <a-modal :visible="previewpdf" :footer="null" @cancel="handleCancel(1)" width="80%" id="previewpdf" v-if="previewpdf">
                        
                        <a-spin :spinning="spinning">
                            <div style="margin-bottom: 10px">
                                <a-space>
                                    <a-button  type="primary"  @click="prePage" > 上一页</a-button>
                                    <a-button  type="primary"  @click="nextPage" > 下一页</a-button>
                                    <div class="page" style="text-align:right;margin-top:10px"><span>{{pageNum}}</span>/<span>{{pdfnumbers}}</span> </div>
                                </a-space>
                            </div>
                            <pdf 
                                :src="pdfSrc" 
                                :page="pageNum"  
                                style="width: 100%;" 
                                @progress="loadedRatio = $event"
                                @page-loaded="pageLoaded($event)" 
                                @num-pages="pdfnumbers=$event" 
                                @error="pdfError($event)" 
                                @link-clicked="page = $event"
                            /> 
                        </a-spin>
                        
                       
                    </a-modal>
              </div> <!--<div v-if="subType==='USER_INPUT'">-->
         </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import pdf from 'vue-pdf'
import mammoth from 'mammoth'
import XLSX from 'xlsx'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
    name:'ACHAIN-ATTACHMENT',
    props: ['chain', 'item', 'itemstyle'],
    components:{
        pdf,
    },
    data(){
        return {
            fileList:[],
            subType: "",
            inError: false,
            uploading: false,
            fileres: [],
            defaultFileList:[],
            previewImage: '',
            previewVisible: false,
            previewpdf: false,
            showExcel: false,
            showWord: false,
            file:"",
            loadedRatio: 0,
            pdfnumbers: 1,
            pageNum:1,
            curPageNum: 0,
            excelStream:"",
            wordstreams:"",
            txtstreams:"",
            sheetslist:[],
            showTxt: false,
            spinning: false
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
        IsPicture (name){
            //判断是否是图片 - strFilter必须是小写列举
            var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|.svg|"
            if(name.indexOf(".")>-1)
                {
                    var p = name.lastIndexOf(".");
                    var strPostfix=name.substring(p,name.length) + '|';
                    strPostfix = strPostfix.toLowerCase();
                    if(strFilter.indexOf(strPostfix)>-1)
                    {
                        return true;
                    }
                }
            return false;
        },
        showPreview(file){
            let isPic = this.IsPicture(file.file_name);
            this.file = file
            if(isPic){
                this.previewImage = '/v2/ajax/file/download/'+file.path+'/'+file.file_name;
                this.previewVisible = true;
            }
            else if(file.file_name.indexOf('.pdf')>=0){
                // debugger
                this.getNumPages('https://achain.baidu.com/v2/ajax/file/download/'+ file.path+'/'+ file.file_name)
                // this.$nextTick(()=>{
                //       this.previewpdf = true;
                // })
            }
            else if(file.file_name.indexOf('.xlsx')>=0 || file.file_name.indexOf('.xls')>=0){
                 this.getexcel('https://achain.baidu.com/v2/ajax/file/download/'+ file.path+'/'+ file.file_name)
                //  console.log('xlsx',file)
                //  this.getexcel(file)
                 this.showExcel = true
            }
            else if(file.file_name.indexOf('.doc')>=0){
                 this.getword('https://achain.baidu.com/v2/ajax/file/download/'+ file.path+'/'+ file.file_name)
                //  console.log('xlsx',file)
                //  this.getexcel(file)
                 this.showWord = true
            }
            else if(file.file_name.indexOf('.txt')>=0){
                 this.getTxt('https://achain.baidu.com/v2/ajax/file/download/'+ file.path+'/'+ file.file_name)
                //  console.log('xlsx',file)
                //  this.getexcel(file)
                 this.showTxt = true
            }
            else{
               this.$message.error(`只支持word、excel、pdf、img、txt预览`);
            }
        },
        async handlePreview(file) {
            console.log('preview',file)
            let isPic = this.IsPicture(file.name);
            if(isPic){
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            }
            else if(file.name.indexOf('.pdf')>=0){
                console.log('pdf',file)
                if(file.url){
                    this.getNumPages('https://achain.baidu.com'+ file.url)
                }
                if(file.response){
                   this.getNumPages('https://achain.baidu.com/v2/ajax/file/download/'+ file.response.path+'/'+ file.response.file_name)
                }
                //  this.previewpdf = true;
            }
            else if(file.name.indexOf('.xlsx')>=0 || file.name.indexOf('.xls')>=0){
                 if(file.response){
                    this.getexcel('https://achain.baidu.com/v2/ajax/file/download/'+ file.response.path+'/'+ file.response.file_name)
                 }
                  if(file.url){
                        this.getexcel('https://achain.baidu.com'+ file.url)
                    }
                //  console.log('xlsx',file)
                //  this.getexcel(file)
                 this.showExcel = true
            }
            else if(file.name.indexOf('.doc')>=0 || file.name.indexOf('.docx')>=0){
                 if(file.response){
                    this.getword('https://achain.baidu.com/v2/ajax/file/download/'+ file.response.path+'/'+ file.response.file_name)
                 }
                  if(file.url){
                    this.getword('https://achain.baidu.com'+ file.url)
                }
            }
            else if(file.name.indexOf('.txt')>=0){
                 if(file.response){
                    this.getTxt('https://achain.baidu.com/v2/ajax/file/download/'+ file.response.path+'/'+ file.response.file_name)
                 }
                  if(file.url){
                    this.getTxt('https://achain.baidu.com'+ file.url)
                }
            }
            else {
                 this.$message.error(`只支持word、excel、pdf、img、txt预览`);
            }
           
        },
        handleCancel(type) {
            if(type==0){
                this.previewVisible = false;
            }
            if( type == 1){
                this.previewpdf = false;
                this.pageNum = 1
            }
            if(type == 2){
                this.showExcel = false
            }
            if(type == 3){
                this.showWord = false
            }
            if(type == 4){
                this.showTxt = false
            }
            
        },
        handleChange(info) {
            // console.log(info)
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                this.$message.success(`${info.file.name} file uploaded successfully.`);
                
            } else if (status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
            }
            this.fileList = [...info.fileList]
            this.parseFiles()
        },
        geFileList(){
            const _this = this;
            const attachments = JSON.parse(this.item.item_value);
            attachments.forEach((item,index)=>{
                if(item.file_name!=='' && item.path!==''){
                    _this.defaultFileList.push({name: item.file_name, url: '/v2/ajax/file/download/'+item.path+'/'+item.file_name, uid: index, status: 'done'})
                }
            })
        },
        getTxt(url){
            this.axios.get(url,{
                responseType: "blob", // 设置响应体类型为arraybuffer
            }).then((response)=> {
                 const _this = this
                 const reader = new FileReader()
                 reader.onload = function () {
                    _this.txtstreams = reader.result//获取的数据data
                    _this.showTxt = true
                    console.log('reader.result', reader.result)
                }
                reader.readAsText(response.data);
            })
        },
        //处理excel文件
        getexcel(url) {
           this.axios.get(url,{
                responseType: "arraybuffer", // 设置响应体类型为arraybuffer
            }).then(({data})=> {
                let workbook = XLSX.read(new Uint8Array(data), {type:"array"}); // 解析数据
                console.log('workbook.SheetNames',workbook.SheetNames)
                let arr = []
                workbook.SheetNames.forEach((item,index) => {
                    let obj = {}
                    obj.name = item
                    obj.html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[index]])
                    arr.push(obj)
                })
                // var worksheet = workbook.Sheets[workbook.SheetNames[0]]; // workbook.SheetNames 下存的是该文件每个工作表名字,这里取出第一个工作表
                // this.excelStream = XLSX.utils.sheet_to_html(worksheet); // 渲染
                this.sheetslist = arr
            })
        },
        //处理word文件
        getword(url) {
            const _this = this;
            var styleMap =
            "p[style-name='Section Title'] => h1:fresh\n" +
            "p[style-name='Subsection Title'] => h2:fresh";
           this.axios.get(url,{
                responseType: "arraybuffer", // 设置响应体类型为arraybuffer
            }).then((response)=> {
                try{
                    mammoth.convertToHtml({ arrayBuffer: new Uint8Array(response.data) }).then((resultObject) => {
                        _this.$nextTick(() => {
                            _this.wordstreams = resultObject.value;
                            _this.showWord = true
                        });
                    });
                }catch(e){
                }
               
               
            })
        },
        //预览pdf
        getNumPages(url){
            console.log(this.file)
            this.pdfSrc = pdf.createLoadingTask(url)
            var url = "";
            this.spinning = true
            this.pdfSrc.promise.then(pdf => {
                this.pdfnumbers = pdf.numPages
                this.$nextTick(()=>{
                     this.previewpdf = true;
                     this.spinning = false
                })
            },(err)=>{
                console.log(err)
                this.$message.error(err)
                this.spinning = false
            })
        },
         //预览pdf
        prePage(){
             this.spinning = true
            var page = this.pageNum
				page = page > 1 ? page - 1 : this.pdfnumbers
				this.pageNum = page
                setTimeout(()=>{
                    this.spinning = false
                },200)
        },
         //预览pdf
        nextPage(){
               this.spinning = true
                var page = this.pageNum
				page = page < this.pdfnumbers ? page + 1 : 1
				this.pageNum = page
                 setTimeout(()=>{
                    this.spinning = false
                },200)
        },
         //预览pdf
        pageLoaded(e) {
                this.spinning = false
				this.curPageNum = e
        },
         //预览pdf
        pdfError(error) {
            console.error(error)
        },
        parseFiles(){
            let arr = []
            if( this.fileList&&this.fileList.length>0){
                    this.fileList.forEach(item=>{
                    if(item.response){
                        if(item.status && item.status =="done"){
                            arr.push({file_name: item.response.file_name,path: item.response.path})
                        }
                    } else {
                        arr.push({file_name: item.name,path: item.url.split('/')[5]})
                    }
                
                })
            }
            this.item.item_value = JSON.stringify(arr)
        },
    },
    created(){
        this.initPlugin()
        if(this.itemstyle == 'write' && this.item.item_value !== ""){
            this.geFileList()
        }
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
#showExcel{
    table {
        width: 90%;
        background: #ccc;
        margin: 10px auto;
        border-collapse: collapse;/*border-collapse:collapse合并内外边距(去除表格单元格默认的2个像素内外边距*/	
    }				
    th,td {
        height: 25px;
        line-height: 25px;
        text-align: center;
        border: 1px solid #52c41a;
    }		
    th {
        background: #eee;
        font-weight: normal;
    }		
    tr {
        background: #fff;
    }		
    tr:hover {
        background: #a7ff07;
    }		
    td a {
        color: #06f;
        text-decoration: none;
    }		
    td a:hover {
        color: #06f;
        text-decoration: underline;
    }
}
#showWord{
    img{
        width: 100%;
    }
}
</style>
