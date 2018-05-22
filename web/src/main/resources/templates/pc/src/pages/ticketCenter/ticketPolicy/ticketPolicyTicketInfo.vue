<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" @savedata="onSubmit('lineForm')" :title="headerData.title"></inner-header>
      <!--jdy-content-trip end-->
      <div class="h20 mt10"></div>
      <el-form class="" :model="lineForm" :rules="rules" ref="lineForm" label-width="100px">
        <el-row :gutter="20">
          <el-col>
            <el-row>
                <el-form-item prop="picture" label="门票图片：">
                  <el-upload :disabled="true" class="upload-demo" drag :multiple="false" :action='imgUploadPath' :before-upload="checkFileType" :data="fileType" :on-success="uploadSuccess" :show-file-list="false" :on-error="uploadError" :headers="uploadHeader" :with-credentials=true>
                    <img :src="lineForm.picture" v-if="lineForm.picture" style="width:100%;height:100%"/>
                    <div v-else>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将封面拖到此处，或
                        <em>点击上传</em>
                      </div>
                    </div>
                    <div class="el-upload__tip" slot="tip" style="margin-left:15px">建议尺寸:最小(550*350)，一般(715*455)，大小:不超过(5M)</div>
                  </el-upload>
                </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="门票编码：" prop="ticketProductCode">
                  <el-input v-model="lineForm.ticketProductCode" placeholder="请填写门票编码" :disabled="readOnly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门票名称：" prop="ticketProductName">
                  <el-input v-model="lineForm.ticketProductName" placeholder="门票名称" :disabled="readOnly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="门票类型：" prop="ticketProductType" placeholder="请选择门票类型">
                <el-select :disabled="readOnly" v-model="lineForm.ticketProductType" clearable placeholder="请选择门票类型" style="width: 100%;">
                  <el-option :key="value.id" v-for="value in ticketList" :label="value.tName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品经理：" prop="productManager">
                  <el-select :disabled="readOnly" v-model="lineForm.productManager" class="all" :filterable="true" :remote-method="searchContacts" clearable remote>
                    <el-option :key="person.puserId" :label="person.uRealName" v-for="person in peopleList" :value="person.userId">
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="lineForm.people"></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="入园须知：">
            <jdy-editor :readonly="readOnly" :content="lineForm.admissions" attr="admissions" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="费用包含：">
            <jdy-editor :readonly="readOnly" :content="lineForm.costInclude" attr="costInclude" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.cost" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="预定规则：">
            <jdy-editor :readonly="readOnly" :content="lineForm.reservationRule" attr="reservationRule" @input="editorUpdate"></jdy-editor>
            <!--<el-input v-model="lineForm.nocost" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="退票规则：">
            <jdy-editor :readonly="readOnly" :content="lineForm.refundRules" attr="refundRules" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.notice" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="补充说明：">
            <jdy-editor :readonly="readOnly" :content="lineForm.explanation" attr="explanation" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.notice" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="景点介绍：">
            <jdy-editor :readonly="readOnly" :content="lineForm.attractions" attr="attractions" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.notice" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// import lData from './data.js';
import jdyEditor from '@/components/Quilleditor';
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
// 通用tab页
import innerHeader from './header';
export default {
  name: 'line',
  data() {
    return {
      headerData:{
        name:"ticketPolicyTicketInfo",
        btnFlag:false,
      },
      btnFlag:false,
      fileType: { fileType: "jpg" },
      uploadHeader: {
        'Authorization': sessionStorage.token
      },
      action: '/common/file/upload',
      lineForm: {
        ticketProductCode:'',//编码 
        ticketProductName:'',//门票产品名称
        ticketProductType:'',//1:成人票 0：儿童票
        productManager:'',//产品经理
        reservationRule:'',//预定规则 
        refundRules:'',//退票规则 
        admissions:'',//入园须知
        attractions:'',//景点介绍 
        costInclude:'',//费用包含
        explanation:'',//补充说明 
        picture: null,//产品封面url,save必填 ,
      },
      peopleList:[],
      ticketList:[
        {
          id: 1,
          tName: "成人票"
        },
        {
          id: 0,
          tName: "儿童票"
        }
      ],
      rules: {
        ticketProductCode: [{ required: true, message: '请输入产品编号', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }],
        ticketProductName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
        ],
        productManager: [
          { required: true, message: '请输入产品经理', trigger: 'blur',type: "number" },
        ],
        ticketProductType: [
          { required: true, message: '请选择类型', trigger: 'change', type: "number" }
        ],
        picture: [
          { required: true, message: '请上传门票图片', trigger: 'change' }
        ]
      },
      readOnly:true,
    }
  },

  computed: {
    imgUploadPath() {
      return api_prefix + this.action;
    }
  },
  methods: {
    // 读取数据
    getTableData(){
      this.$http.get(api_prefix + "admission/base/getAdmissionBase/"+this.$route.query.id).then(response => {
          let data = response.body.body;
          if (response.body.code == 0){
            let data=response.data.body;
            this.lineForm = data;       
          }else{
            this.$alert(data.message)
          }     
        },
        response => {
          console.log("出错了");
        }
      );
    },
    //获取联系人列表
    queryUserList(companyId) {
      this.$http.post(api_prefix + '/user/list', { "uCompanyId": companyId, "uRealName": this.contactsName,"uStype":0 }).then(rsp => {
        if (rsp.body.code == 0) {
          this.peopleList = rsp.body.body.list;
        } else {
          this.defalutErrorMessage(rsp.body.message);
        }
      }, rsp => {
        this.defalutErrorMessage();
      });
    },
    checkFileType(file) {
      let startsWith = file.type.startsWith("image/");
      if (!startsWith) {
        this.$message.error("请选择图片上传");
      }
      let size = file.size < 5 * 1024 * 1024
      if (!size) {
        this.$message.error("文件太大了~请控制在5M以内");
      }
      return startsWith && size;
    },
    //获取当前已选中的合同信息
    getBaseList(){
      this.$http.post(api_prefix + '/admission/base/list',this.lineForm).then(response => {
        if (response.data.code == 0) {
          let data=response.data.body;
          this.lineForm = data;
          this.usefulDate = [data.lifeStartDate,data.lifeEndDate]
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    onSubmit(formName, successFun) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnFlag = true;
          this.$http.post(api_prefix + '/admission/base/saveAdmissionBase', this.lineForm).then(response => {
            if (response.body.code == 0) {
              this.btnFlag = false;
              this.$message.success("保存成功");
              successFun && successFun(response.body.id[0]);
            } else {
              this.btnFlag = false;
              this.defalutErrorMessage(response.body.message);
            }
          }, response => {
            this.defalutErrorMessage();
          });
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    uploadSuccess(response) { //封面上传成功
      if (response.code == 0) {
        this.lineForm.picture = response.body.key;
      } else {
        this.defalutErrorMessage(response.message);
      }
    },
    uploadError() {  //封面上传失败
      this.defalutErrorMessage();
    },
    editorUpdate(value, attr) {
      this.lineForm[attr] = value;
    },
    defaultProcut() {

    },
    defalutErrorMessage(message) { //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
  },
  components: { 
    ElInputNumber,
    ElFormItem,
    jdyEditor,
    innerHeader
  },
  mounted(){
    this.getTableData();
    this.queryUserList(JSON.parse(sessionStorage.loginData).uCompanyId)
  }
}
</script>

