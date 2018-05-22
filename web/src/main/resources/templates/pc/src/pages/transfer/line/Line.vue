<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner jdy-content-inner-pr30">
      <el-row class="jdy-content-inner-trip border p15 pl25">
        <el-col :span="16">
          <div class="jdy-content-trip">
            <el-steps :center="true" :align-center="true" :active="1">
              <el-step title="线路信息" icon="edit"></el-step>
              <el-step title="行程信息" icon="upload"></el-step>
              <el-step title="票价管理" icon="picture"></el-step>
              <el-step title="班期管理" icon="picture"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="fright mt10" @click="goback">返回</el-button>
          <el-button type="primary" @click="onSubmitGo('lineForm')" class="fright mr10 mt10" :disabled="btnFlag">下一步</el-button>
          <el-button @click="onSubmit('lineForm')" class="fright mt10" :disabled="btnFlag">保存</el-button>
        </el-col>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mt10"></div>
      <el-form class="" :model="lineForm" :rules="rules" ref="lineForm" label-width="100px">
        <el-row :gutter="20">
          <el-col>
            <el-row>
                <el-form-item prop="cover" label="上传封面：">
                  <el-upload class="upload-demo" drag :multiple="false" :action='imgUploadPath' :before-upload="checkFileType" :data="fileType" :on-success="uploadSuccess" :show-file-list="false" :on-error="uploadError" :headers="uploadHeader" :with-credentials=true>
                    <img :src="lineForm.cover" v-if="lineForm.cover" style="width:100%;height:100%"/>
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
               <el-form-item label="产品来源：" prop="pFrom" v-if="lineForm.pFrom == 0 || lineForm.pFrom == 2 || lineForm.pFrom == 3">
                <el-select v-model="lineForm.pFrom" class="all" clearable>
                    <el-option :key="item.value" v-for="item in comeList" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-col :span="12">
                <el-form-item label="产品来源：" prop="pFrom" v-if="lineForm.pFrom == 1">
                  <el-select v-model="lineForm.pFrom" class="all" clearable>
                      <el-option :key="item.value" v-for="item in comeList" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位名称：" prop="pFromName" v-if="lineForm.pFrom == 1">
                  <el-input v-model="lineForm.pFromName" placeholder="请输入供应商单位名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品类型：" prop="pType" placeholder="请选择产品类型">
                  <el-select v-model="lineForm.pType" class="all" @change="productTypeChange">
                    <el-option v-for="item in productTypes" :key="item.code" :label="item.label" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="大区：" prop="pGroup" placeholder="请选择大区">
                  <el-select v-model="lineForm.pGroup" class="all">
                    <el-option :key="item.id" v-for="item in groupList" :label="item.dName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品名称：" prop="pName">
                  <el-input v-model="lineForm.pName" placeholder="产品名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目的地：" prop="pDestination">
                  <el-select v-model="lineForm.pDestination" class="all">
                    <el-option :key="item.id" v-for="item in destinationList" :label="item.name_des" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品简称：" prop="pShortName">
                  <el-input v-model="lineForm.pShortName" placeholder="产品简称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属品牌：" prop="pBrand" placeholder="请选择所属品牌">
                  <el-select v-model="lineForm.pBrand" class="all" :filterable="true" :remote-method="searchBrand" clearable remote>
                    <el-option :key="brand.id" v-for="brand in brandList" :label="brand.bName" :value="brand.id">
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="lineForm.brand"></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品编号：" prop="pNo">
                  <el-input v-model="lineForm.pNo" placeholder="请填写字母、数字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人：" prop="pContacts">
                  <el-select v-model="lineForm.pContacts" class="all" :filterable="true" :remote-method="searchContacts" clearable remote @change="testChange123">
                    <el-option :key="person.puserId" :label="person.uRealName" v-for="person in peopleList" :value="person.userId">
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="lineForm.people"></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品排序：">
                  <el-input-number v-model="lineForm.pSort" type="number" placeholder="产品排序" :min=0 :max="1000000" :controls="false" style="width: 100%;"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系方式：">
                  <el-row :gutter="10">
                    <el-col :span="10">
                      <el-input data="pQq" v-model="lineForm.pQq" placeholder="qq"></el-input>
                    </el-col>
                    <el-col :span="10">
                      <el-input v-model="lineForm.pPhone" placeholder="tel"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付类型：">
                  <el-col :span="10">
                    <el-radio-group v-model="lineForm.pPayWay">
                      <el-radio :label="0">全款支付</el-radio>
                      <el-radio :label="1">首付款支付</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="lineForm.pPayWay == true">
                <el-form-item label="首付款类型：">
                  <el-col :span="10">
                    <el-radio-group v-model="lineForm.pFirstPayType" @change="clearPay">
                      <el-radio :label="1">固定金额（每人）</el-radio>
                      <el-radio :label="2">百分比（订单总额）</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model.number="lineForm.pPayAmount" clearable placeholder="请输入首款固定金额" v-if="lineForm.pFirstPayType == 1">
                      <template slot="append" v-if="lineForm.pFirstPayType == 1">元</template>
                    </el-input>
                    <el-input v-model.number="lineForm.pPayAmount" clearable placeholder="请输入首款百分比" v-if="lineForm.pFirstPayType == 2" :maxlength="2">
                      <template slot="append" v-if="lineForm.pFirstPayType == 2">%</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 产品归属地 -->
              <el-col :span="12">
                <el-form-item label="产品归属：">
                  <el-col :span="10">
                    <el-radio-group v-model="lineForm.ascription" :disabled="lineForm.ascriptionFlag==1">
                      <el-radio :label="0">本地产品</el-radio>
                      <el-radio :label="1">区域产品</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="lineForm.ascription">
                <el-form-item label="集结分公司：">
                  <el-col :span="20">
                    <el-checkbox-group v-model="lineForm.subCompany" @change="subCompanyChange">
                        <el-checkbox v-for="item in subCompanyArr" :label="item.id" :key="item.id" :disabled="lineForm.ascriptionFlag==1">{{item.cName}}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="线路特色：">
            <jdy-editor :content="lineForm.pSpecial" attr="pSpecial" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="费用包含：">
            <jdy-editor :content="lineForm.pCostInclude" attr="pCostInclude" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.cost" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="费用不包含：">
            <jdy-editor :content="lineForm.pCostExclude" attr="pCostExclude" @input="editorUpdate"></jdy-editor>
            <!--<el-input v-model="lineForm.nocost" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="预订须知：">
            <jdy-editor :content="lineForm.pNotes" attr="pNotes" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.notice" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20" v-if="lineForm.pType==20">
          <el-form-item label="签证信息：">
            <jdy-editor :content="lineForm.pVisa" attr="pVisa" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.visa" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <!-- <el-row class="pt20 mt10 line-border-top">
            <el-button @click="onSubmit('lineForm')">保存</el-button>
            <el-button type="primary" @click="onSubmitGo('lineForm')">下一步</el-button>
            <el-button>取消</el-button>
          </el-row> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import lData from './data.js';
import jdyEditor from '@/components/Quilleditor';
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
export default {
  name: 'line',
  data() {
    return {
      btnFlag:false,
      fileType: { fileType: "jpg" },
      uploadHeader: {
        'Authorization': sessionStorage.token
      },
      action: '/common/file/upload',
      productType: [],
      productTypes: {
        //        "0": "全部类型",
        "周边短线": { code: 10, label: "周边短线" },
        "国内长线": { code: 11, label: "国内长线" },
        "出境长线":{ code: 20, label: "出境长线" },
        "出境短线":{ code: 21, label: "出境短线" },
        "邮轮":{ code: 30, label: "邮轮" },
        "自由行":{ code: 50, label: "自由行" },
        "出境海岛":{ code: 51, label: "出境海岛" },
        "定制旅游":{ code: 52, label: "定制旅游" },
        "团队会奖":{ code: 54, label: "团队会奖" },
        "签证服务":{ code: 55, label: "签证服务" },
        "机票预订":{ code: 56, label: "机票预订" },
        "酒店预订":{ code: 57, label: "酒店预订" },
        "单项委托":{ code: 58, label: "单项委托" },
        "其他服务":{ code: 59, label: "其他服务" },
        "户外拓展":{ code: 60, label: "户外拓展" },
        "游学/研学":{ code: 61, label: "游学/研学" },
        "自驾游":{ code: 62, label: "自驾游" },
        "全球旅拍":{ code: 63, label: "全球旅拍" },
        "旅游金融":{ code: 64, label: "旅游金融" },
        "旅游地产":{ code: 65, label: "旅游地产" },
        "亲子":{ code: 66, label: "亲子" },
        "单一资源+拍":{ code: 67, label: "单一资源+拍" },
      },
      comeList: [{
                value: 0,
                label: '自营研发'
            }, {
                value: 1,
                label: '散拼'
            }, {
                value: 2,
                label: '自营定制'
            }, {
                value: 3,
                label: '单项资源'
            }],
      brandList: [], //品牌列表
      peopleList: [], //联系人列表
      lineForm: {
        companyId: JSON.parse(sessionStorage.loginData).uCompanyId,// 公司编号 ,
        cover: null,//产品封面url,save必填 ,
        pBrand: null,//产品品牌编号,save、update必填 ,
        pConfirm: null,// 产品确认状态,可选值 ,
        pContacts: JSON.parse(sessionStorage.loginData).userId,// 产品联系人编号,save、update必填，大小范围 ,
        // pContacts: JSON.parse(sessionStorage.loginData).pContacts,// 产品联系人编号,save、update必填，大小范围 , yjk
        pCostExclude: null,// 费用不包含 ,
        pCostInclude: null,// 费用包含 ,
        pName: null,// 产品名称,save、update必填，长度限制 = ['1-50'],
        pNo: null,// 产品编号,save、update必填，长度限制 = ['1-20'],
        pNotes: null,// 预订须知 ,
        pPhone: JSON.parse(sessionStorage.loginData).uTel,// 产品联系人手机号,save、update必填，数字长度范围 = ['8-20'],
        pQq: JSON.parse(sessionStorage.loginData).uQq,// 产品联系人qq,save、update必填，数字长度范围5-20位 ,
        pRecommend: null,// 产品推荐状态,可选值 推荐 0:不推荐 1:推荐普通 2:推荐精选 ,
        pShortName: null,// 产品简称,save、update必填，长度限制 ,
        pSort: null, //产品排序
        pSpecial: null,// 线路特色 ,
        pStatus: null,//
        pType: null,// 产品类型编号,save、update必填，可选值 = ['10', '11', '20', '30', '40', '50'],
        pVisa: null,// 签证信息
        puserId: JSON.parse(sessionStorage.loginData).userId,
        pFrom: '',
        pFromName: null,
        pDestination:'',  //目的地
        pDestinationPym:null,  //目的地拼音码
        pPayWay:0,
        pPayAmount:'',
        pFirstPayType:1,
        ascription:0,
        subCompany:[],
        assembleCompanyIds:[],
        areation:null,
        pGroup:null
      },
      ascriptionFlag:0,
      subCompanyArr:[],
      // 目的地初始化
      destinationList:[],
      rules: {
        pFrom:[{required: true, message: '请选择产品来源', trigger: 'change', type: "number"}],
        pFromName:[{ required: true, message: '请输入供应商单位名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }],
        pNo: [{ required: true, message: '请输入产品编号', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }],
        pDestination:[{ type: 'number', required: true, message: '请选择目的地', trigger: 'change' }],
        pName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        pShortName: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
        ],
        pType: [
          { required: true, message: '请选择类型', trigger: 'change', type: "number" }
        ],
        pGroup:[
          { required: true, message: '请选择大区', trigger: 'change', type: "number" }
        ],
        pBrand: [
          { type: 'number', required: true, message: '请输入品牌', trigger: 'change' }
        ],
        cover: [
          { required: true, message: '请上传封面', trigger: 'change' }
        ]// ,
        // days: [
        //   { required: true, message: '请输入天数', trigger: 'change' },
        //   { min: 1, max: 10, message: '1到10天', trigger: 'blur'}
        // ]
      },
      brandName: '',
      contactsName: '',
      lineCopyFormpQq:'',
      lineCopyFormpPhone:'',
      groupList:[]
    }
  },

  computed: {
    imgUploadPath() {
      return api_prefix + this.action;
    }
  },
  methods: {
    // 初始化目的地
    defaultDestinationList(){
      this.$http.post(api_prefix +"Dictionaries/dictList", {groupName: '产品目的地'}).then(response => {
        this.destinationList=response.body.body;
        this.destinationList.forEach(data=>{
          data.name_des=data.dName.split(",")[0];
          data.name_py=data.dName.split(",")[1]
        })
        // console.log(this.destinationList,"修改目的地数组")
      }, response => {
          this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
      });
    },
    defaultGroupList(){
      this.$http.post(api_prefix +"Dictionaries/dictList", {"dGroupId": 250}).then(response => {
        this.groupList=response.body.body;
      }, response => {
          this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
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
    testChange(id){
      if(!this.lineForm.pQq&&!this.lineForm.pPhone){
        if(id == ''){
          this.lineForm.pQq = '';
          this.lineForm.pPhone = '';
        }else{
          debugger;
          this.$http.get(api_prefix + '/user/get'+'/'+id).then(rsp => {
            if (rsp.body.code == 0) {
              let userData = rsp.body.body;
              this.lineForm.pQq = userData.uQq;
              this.lineForm.pPhone = userData.uTel;
            } else {
              this.defalutErrorMessage(rsp.body.message);
            }
          }, rsp => {
            this.defalutErrorMessage();
          });
        }
      }
    },
    testChange123(id){
        if(id == ''){
          this.lineForm.pQq = '';
          this.lineForm.pPhone = '';
        }else{
          let person=this.peopleList.filter(data=>{
            return data.userId==id
          })
          if(person.length!=0){
            this.lineForm.pQq = person[0].uQq
            this.lineForm.pPhone = person[0].uTel;
          }
        }
    },
    searchContacts(name) {
      this.contactsName = name;
      this.queryUserList(JSON.parse(sessionStorage.loginData).uCompanyId)
    },
    //获取品牌
    queryBrandList(companyId) {
      this.$http.post(api_prefix + '/brand/list', { "bCompanyId": companyId, "bName": this.brandName }).then(rsp => {
        if (rsp.body.code == 0) {
          this.brandList = rsp.body.body.resultList;
        } else {
          this.defalutErrorMessage(rsp.body.message);
        }
      }, rsp => {
        this.defalutErrorMessage();
      });
    },
    searchBrand(name) {
      this.brandName = name;
      this.queryBrandList(JSON.parse(sessionStorage.loginData).uCompanyId)
    },
    productTypeChange(value) {
      this.lineForm.pType = parseInt(value);
      if(this.$route.query.id==null){
          this.lineForm.pNo=this.typefilter(this.lineForm.pType)+window.FormatDate(new Date(), 'yyyy-MM-dd').replace(/-/g,"")+Math.floor(Math.random()*900+99);
      }
    },
    typefilter(value){
      if(value){
        switch(value){
          case 10:
            return "GD";
            break;
          case 11:
            return "GC";
            break;
          case 20:
            return "CC";
            break;
          case 21:
            return "CD";
            break;
          case 30:
            return "YL";
            break;
          case 50:
            return "ZY";
            break;
          case 51:
            return "HD";
            break;
          case 52:
            return "DZ";
            break;
          case 54:
            return "HJ";
            break;
          case 55:
            return "QZ";
            break;
          case 56:
            return "JP";
            break;
          case 57:
            return "JD";
            break;
          case 58:
            return "DX";
            break;
          case 59:
            return "QT";
            break;
          case 60:
            return "HW";
            break;
          case 61:
            return "YX";
            break;
          case 62:
            return "ZJ";
            break;
          case 63:
            return "LP";
            break;
          case 64:
            return "LJ";
            break;
          case 65:
            return "LD";
            break;
          case 66:
            return "QZ";
            break;
          case 67:
            return "DP";
            break;
        }
      }else{
        // 未获取产品类型
        return "XXXX"
      }
    },
    onSubmit(formName, successFun) {
      var pdtid = this.lineForm.id;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //          for(let p in this.lineForm){
          //            if($.trim(this.lineForm[p]) == ''){
          //              this.lineForm[p] = null;
          //            }
          //          }
          let idlist=this.lineForm.subCompany.filter((data)=>{
            return typeof data=="number"
          })
          this.lineForm.assembleCompanyIds=idlist;
          // 获取拼音码
          let target=this.destinationList.filter(data=>{
            return this.lineForm.pDestination==data.id
          })
          this.lineForm.pDestinationPym=target[0].name_py;
          if( this.lineForm.pPayAmount <= 0 && this.lineForm.pPayWay == 1){
              this.$message.error("首付款金额或比例需大于零");
          }else{
            if (pdtid) {
              this.lineForm.id = pdtid;
              this.lineForm.lineType = 0;
              if(this.lineForm.pFromName){
                this.lineForm.pFromName = $.trim(this.lineForm.pFromName)
              }
              this.btnFlag = true;
              this.$http.post(api_prefix + '/product/update', this.lineForm).then(response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  this.$message.success("保存成功");
                  successFun && successFun(pdtid);
                  this
                } else {
                  this.btnFlag = false;
                  this.defalutErrorMessage(response.body.message);
                }
              }, response => {
                this.defalutErrorMessage();
              });
            } else {
              this.lineForm.lineType = 0;
              if(this.lineForm.pFromName){
                this.lineForm.pFromName = $.trim(this.lineForm.pFromName)
              }
              this.btnFlag = true;
              this.$http.post(api_prefix + '/product/save', this.lineForm).then(response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  this.$message.success("保存成功");
                  this.lineForm.id = response.body.id[0];
                  successFun && successFun(response.body.id[0]);
                } else {
                  this.btnFlag = false;
                  this.defalutErrorMessage(response.body.message);
                }
              }, response => {
                this.defalutErrorMessage();
              });
            }
          }
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    goback() {
      this.$confirm('数据未保存，是否关闭？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        location.href = '/transfer.html#/list'
      }).catch(() => {

      });
    },
    onSubmitGo(formName) {
      this.onSubmit(formName, (id) => {
        let data = { id: id };
        if (this.$route.query.copyId) {
          data.copyId = this.$route.query.copyId
        }
        if (this.$route.query.id) {
          data.isAdd = false;
        } else {
          data.isAdd = true;
        }
        this.$router.push({ name: "Trip", query: data })
      });

    },
    uploadSuccess(response) { //封面上传成功
      if (response.code == 0) {
        this.lineForm.cover = response.body.key;
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
    defaultProcut(pdtid) {   //如果是修改默认加载产品信息
      if (pdtid) {
        this.$http.post(api_prefix + '/product/detail', { "id": pdtid, "lineType": 0 }).then(response => {
          if (response.data.body.code == 0) {
            response.data.body.body.product.pDestination=Number(response.data.body.body.product.pDestination);
            this.getSubCompanyId(response.data.body.body.product.companyId);
            let lineForm = {};
            Object.assign(lineForm, this.lineForm, response.data.body.body.product)
            lineForm.cover = lineForm.attach;
            if (lineForm.line) {
              lineForm.line.id = lineForm.line.tProductId
              Object.assign(lineForm, lineForm.line)
              Object.assign(lineForm, { line: null })
            }
            for (let p in lineForm) {
              if ($.trim(lineForm[p]) == '') {
                lineForm[p] = null;
              }
            }
            Object.assign(this.lineForm, lineForm);
            this.lineForm.ascriptionFlag=this.lineForm.ascription;
            setTimeout(()=>{
              response.data.body.body.product.assembleCompanyIds.forEach((data)=>{
                this.lineForm.subCompany.push(data)
              })
            },100)
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        }, response => {
          this.defalutErrorMessage(response.body.message);
        });
      }
    },
    copyProcut(copyId) { //复制 产品
      this.$http.post(api_prefix + '/product/detail', { "id": copyId, "lineType": 0 }).then(response => {
        if (response.data.body.code == 0) {
          // response.body.body.body.product.pDestination=Number(response.body.body.body.product.pDestination);
          response.data.body.body.product.pDestination=Number(response.data.body.body.product.pDestination);
          this.getSubCompanyId(response.data.body.body.product.companyId);
          response.data.body.body.product.subCompany=[];
          let lineForm = response.data.body.body.product;
          lineForm.cover = lineForm.attach;
          lineForm.id = null;
          lineForm.pName = null;
          lineForm.pNo = null;
          lineForm.pType = null;
          this.lineForm = lineForm;
          if (lineForm.line) {
            lineForm.line.id = null;
            Object.assign(lineForm, lineForm.line)
            Object.assign(lineForm, { line: null })
          }
          this.lineForm.ascriptionFlag=this.lineForm.ascription;
          this.lineForm.subCompany=JSON.parse(JSON.stringify(this.subCompanyArr));
          setTimeout(()=>{
            response.data.body.body.product.assembleCompanyIds.forEach((data)=>{
              this.lineForm.subCompany.push(data)
            })
          },100)
        } else {
          this.defalutErrorMessage("复制产品出错");
        }
      }, response => {
        this.defalutErrorMessage("复制产品出错");
      });
    },
    //    defaultProductType(){  //加载默认产品类型
    //      this.$http.post(api_prefix + '/product/get_product_type').then(rsp => {
    //        if(rsp.body.code == 0){
    //          this.productType=rsp.body.body;
    //        }else{
    //          this.defalutErrorMessage(rsp.body.message);
    //        }
    //      }, rsp => {
    //        this.defalutErrorMessage();
    //      });
    //    },
    defalutErrorMessage(message) { //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
    // defaultProductType(id) {
    //   this.$http.post(api_prefix + '/Company/selectCompany', { companyId: id }, { emulateJSON: true }).then(response => {
    //     console.log(response.body.body.cProductType);
    //     if ($.trim(response.body.body.cProductType)) {
    //       response.body.body.cProductType.split(',').forEach(t => {
    //         this.productType.push(this.productTypes[t]);
    //       })
    //       console.log(this.productType);
    //     } else {
    //       this.$alert("您的单位没有分配任何产品类型，请先在单位管理中为您的单位选择产品类型", "温馨提示", { type: "warning" });
    //     }
    //   }, response => {
    //     this.defalutErrorMessage();
    //   });
    // }
    clearPay(){
      this.lineForm.pPayAmount = '';
    },
    subCompanyChange(){
      // let idlist=this.lineForm.subCompany.filter((data)=>{
      //   return typeof data=="number"
      // })
      // this.lineForm.assembleCompanyIds=idlist;
      // console.log(this.lineForm.subCompany,'090909')
      // console.log(idlist)
    },
    /**
     * @description 获取分公司接口
     * 1.新增时剔除登陆者所属公司id
     * 2.编辑时剔除产品所属公司id
     * */
    getSubCompanyId(company_id) {
      this.$http.post(api_prefix + "Company/index",
          { pid: 343, searchType: 1, pageIndex: 1, fastSearchStr: "" },
          { emulateJSON: true }).then(response => {
            if (response.body.code == 0) {
              let templist=response.body.body.list.filter(data=>{
                // return data.id!=JSON.parse(sessionStorage.loginData).uCompanyId
                return data.id!=company_id
              })
              this.lineForm.subCompany=templist;
              this.subCompanyArr = templist;
            } else {
              this.$message.error("获取分公司失败！");
            }
        });
    },
  },
  components: {
    ElInputNumber,
    ElFormItem,
    jdyEditor
  },
  mounted(){
     this.defaultGroupList();
  },
  created() {
    this.defaultDestinationList();
    // this.defaultProductType(JSON.parse(sessionStorage.loginData).uCompanyId);
    let uCompanyId=JSON.parse(sessionStorage.loginData).uCompanyId;
    this.queryBrandList(uCompanyId);
    this.queryUserList(uCompanyId);
    if (this.$route.query.id) {
      this.defaultProcut(this.$route.query.id);
    } else if (this.$route.query.copyId) {
      this.copyProcut(this.$route.query.copyId);
    }else{
      this.getSubCompanyId(uCompanyId)
    }
  }
}
</script>

