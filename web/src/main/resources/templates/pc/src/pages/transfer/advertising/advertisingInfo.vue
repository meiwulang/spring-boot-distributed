<template>
  <div class="jl-information gz-paddingBottom">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="winCenter">
        <el-form :model="saveForm" :rules="saveFormRules" ref="saveForm">
          <el-form-item label="广告位置:" prop="aPlace" label-width="93px">
            <el-select v-model="saveForm.aPlace" class="gz-Block">
              <el-option v-for="item in OptionsList" :key="item.id" :label="item.dName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row type="flex">
            <el-form-item label="有效日期:" class="gz-Block" prop="aStartTime" label-width="93px">
              <el-col :span="50">
                <el-date-picker v-model="saveForm.aStartTime" type="date" placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="至" class="gz-Block" prop="aEndTime" label-width="93px">
              <el-col :span="50">
                <el-date-picker v-model="saveForm.aEndTime" type="date" placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-row>
          <el-form-item label="投放单位:" label-width="93px" prop="companyId" v-if="this.uCompanyId == 0">
            <el-select v-model="saveForm.companyId" :filterable="true" :remote-method="searchCompany" remote clearable placeholder="请选择单位名称" style="width: 100%;">
              <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示文字:" label-width="93px">
            <el-input v-model="saveForm.aTitle" :rows="1" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="链接地址:" label-width="93px">
            <el-input v-model="saveForm.aLink" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="其他内容:" label-width="93px">
            <el-input v-model="saveForm.aOther" :rows="1" placeholder="请输入内容"></el-input>
          </el-form-item>
          <span class="xing">*</span>
          <el-form-item label='上传图片:' label-width="93px" class="upload-attach">
            <div data-v-dbb7f45e="" class="upload-div" v-show="!saveForm.attachUrl">
              <ul class="el-upload-list el-upload-list--picture-card"></ul>
              <div class="el-upload el-upload--picture-card" @click.stop="openFileWindow">
                <i data-v-dbb7f45e="" class="el-icon-plus"></i><input type="file" id="uploadFile" name="file" @change="getFileAndUpload" class="el-upload__input"></div>
            </div>
            <div data-v-dbb7f45e="" style="" v-show="saveForm.attachUrl">
              <ul class="el-upload-list el-upload-list--picture-card" @click="deleteAttachUrl">
                <li class="el-upload-list__item is-success"><img :src="saveForm.attachUrl" alt="" class="el-upload-list__item-thumbnail">
                  <a class="el-upload-list__item-name">
                    <i class="el-icon-document"></i>
                  </a>
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <i class="el-icon-close"></i>
                  <!---->
                  <span class="el-upload-list__item-actions">
                    <!---->
                    <span class="el-upload-list__item-delete">
                      <i class="el-icon-delete2"></i>
                    </span>
                  </span>
                </li>
              </ul>
              <div class="el-upload el-upload--picture-card" style="display: none;">
                <i data-v-dbb7f45e="" class="el-icon-plus"></i><input type="file" name="file" class="el-upload__input"></div>
            </div>
          </el-form-item>
          <el-form-item label="广告说明:" label-width="93px">
            <el-input v-model="saveForm.aComment" :rows="1" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="打开类型:" label-width="93px" prop="aOpenType" v-model="saveForm.aOpenType">
            <div class="leftPadding">
              <el-radio class="radio" v-model="radio" label="0">本窗口</el-radio>
              <el-radio class="radio" v-model="radio" label="1">新窗口</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="是否显示:" label-width="93px" prop="aShow" v-model="saveForm.aShow">
            <div class="leftPadding">
              <el-radio class="radio" v-model="showradio" label="0">显示</el-radio>
              <el-radio class="radio" v-model="showradio" label="1">隐藏</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="排序位置:" label-width="93px">
            <el-input-number v-model="saveForm.aSort" :min="0"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div class="rightFlex">
      <router-link to="/advertising">
        <el-button>取消</el-button>
      </router-link>
      <el-button type="primary" :disabled="btnFlag" class="adverBtn" @click="saveNewAD">保存</el-button>
    </div>
    </div>
    <!--投放城市-->
    <jdy-alert title="投放城市选择" @closeAlert="closecfCity" v-if="showcfCityFlag" class="alertJournal showtfcity">
      <div class="showtfcityaa">
        <div class="showtfcityaa-scroll">
          <div class="showtfcityaa-i">
            <div class="showtfcityaaa" v-for="(value,key) in proviceArr" :key="value">
              <div class="showtfcityaaa-head plr10 clearfix">
                <span>{{key}}</span>
                <el-button class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                <el-button class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
              </div>
              <div class="showtfcityaaa-content plr10 clearfix">
                <span v-for="ccitem in value" :dataId="ccitem.id" :key="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':selectCityArr.name.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>
              </div>
              <div class="hide">
                <span v-for="ccitem in value" class="taCountry" :key="ccitem.type" v-show="false">{{ccitem.type}}</span>
                <span v-for="ccitem in value" class="taProvince" :key="ccitem.pName" v-show="false">{{ccitem.pName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" @click="closecfCity">取消</el-button>
        <el-button type="primary" class="fright mt10 mr10" @click="removeAll">刷新</el-button>
        <el-button type="primary" class="fright mt10 mr10" @click="selectAllAll" id="selectAll">全选</el-button>
        <el-button type="primary" class="fright mt10 mr10" @click="saveCC">保存</el-button>
      </div>
    </jdy-alert>
  </div>
</template>
<script>
import jdyAlert from "@/components/Alert";
export default {
  data() {
    return {
      btnFlag: false,
      id: this.$route.query.id,
      /*投放城市相关*/
      selectCityArr: { id: [], name: [] },
      showcfCityFlag: false,
      proviceArr: {},
      submitArr: [], //用于表单提交
      OptionsList: [], //广告位置
      tahtOption: "", //广告位置
      startTime: "", //开始时间
      endTime: "", //结束时间
      radio: "0", //打开类型单选绑定
      showradio: "0", //是否显示单选绑定
      saveFormRules: {
        companyId: [
          {
            type: "regexp",
            required: true,
            message: "请选择所属单位",
            trigger: "change"
          }
        ],
        aPlace: [
          {
            required: true,
            type: "number",
            message: "请选择广告位置",
            trigger: "change"
          }
        ],
        aStartTime: [
          {
            required: true,
            type: "date",
            message: "请选择有效时间",
            trigger: "change"
          }
        ],
        aEndTime: [
          {
            required: true,
            type: "date",
            message: "请选择有效时间",
            trigger: "change"
          }
        ],
        aOpenType: [
          {
            required: true,
            type: "number",
            message: "请选择打开方式",
            trigger: "change"
          }
        ],
        aShow: [
          {
            required: true,
            type: "number",
            message: "请选择是否显示",
            trigger: "change"
          }
        ],
        attachUrl: [
          {
            required: true,
            type: "string",
            message: "请添加图片",
            trigger: "change,blur,clearFiles,abort"
          }
        ],
        areaList: [
          {
            required: true,
            type: "object",
            message: "请选择投放市场",
            trigger: "change,blur"
          }
        ]
      },
      uCompanyId: "",
      selectList: "", //单位列表
      saveForm: {
        companyId: '',
        attachUrl: null,
        aComment: null,
        aEndTime: null,
        aLink: null,
        aOpenType: 0,
        aOther: null,
        aPlace: 15,
        aSort: null,
        aStartTime: null,
        aTitle: null,
        aStatus: 0,
        aShow: 0,
      },
      areaObj: {
        //投放点循环体
        taArea: null,
        taCity: null,
        taCountry: null,
        taProvince: null
      },
      areaList: [], //可选投放城市列表
      showPicHover: false,
      fileType: { fileType: "jpg" }
    };
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uCompanyId = logindata.uCompanyId;
    if(this.uCompanyId != 0 ){
      this.saveForm.companyId = this.uCompanyId
    }
    this.getLocation();
    this.defaultSelectList();
    if (this.$route.query.id) {
      this.$http
        .get(api_prefix + `advertisement/get/${this.$route.query.id}`)
        .then(res => {
          if (res.data.body) {
            this.saveForm = res.data.body;
            this.saveForm.aStartTime = new Date(this.saveForm.aStartTime);
            this.saveForm.aEndTime = new Date(this.saveForm.aEndTime);
            // 投放城市
            this.saveForm.areaList.forEach(data => {
              this.selectCityArr.name.push(data.taCity);
            });
            this.submitArr = this.saveForm.areaList;
          } else {
            this.$alert("查询详细失败");
          }
        });
    }
  },
  methods: {
    searchCompany(name) {
      //搜索单位
      if (this.saveForm.uCompanyId != "") {
        console.log("09090909090900909090900");
        this.defaultSelectList(name);
      }
    },
    //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix + "/Company/index";
      let data = { pageIndex: 1 };
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body.list;
        this.selectList = listData;
        console.log(this.selectList, "this.selectList");
      });
    },
    openFileWindow: function() {
      document.getElementById("uploadFile").click();
    },
    getFileAndUpload: function($event) {
      console.log($event);
      var files = event.currentTarget.files || event.dataTransfer.files;
      if (!files) {
        return;
      }
      let formData = new FormData();
      formData.append("fileType", "jpg");
      formData.append("file", files[0]);
      this.$http
        .post(api_prefix + "/common/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(
          res => {
            this.saveForm.attachUrl = res.body.body.key;
          },
          response => {
            console.log("出错了");
          }
        );
      document.getElementById("uploadFile").value = null;
    },
    deleteAttachUrl: function() {
      this.saveForm.attachUrl = null;
    },
    getLocation: function() {
      this.$http
        .post(api_prefix + "Dictionaries/dictList", { dGroupId: 133 })
        .then(
          response => {
            if (response.data.code == 0) {
              this.OptionsList = response.data.body;
            } else {
              this.$alert(response.data.message);
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    saveNewAD() {
      this.$refs["saveForm"].validate(valid => {
        if (valid) {
          if (this.saveForm.attachUrl.length < 1) {
            this.$message.error("请上传图片");
            return;
          }
          let apiUrl = this.id
            ? "/advertisement/update"
            : "/advertisement/save";
          this.btnFlag = true;
          console.log(this.btnFlag, "-----------------------------");
          this.$http.post(api_prefix + apiUrl, this.saveForm).then(res => {
            if (res.data.code == 0) {
              this.btnFlag = false;
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              let that = this;
              setTimeout(function() {
                that.$router.push({ name: "advertising" });
              }, 500);
            } else {
              this.btnFlag = false;
              this.$alert(res.data.message);
            }
          });
          console.log(this.saveForm);
        }
      });
    }
  },
  components: {
    jdyAlert
  },
  computed: {
    upload_action: function() {
      return api_prefix + "/common/file/upload";
    }
  }
};
</script>
<style scoped>
.winCenter {
  width: 84%;
  margin: 0 auto;
  padding: 30px 0px 0px 0px;
}

.gz-Block {
  display: block;
}

.CenterFt {
  text-align: center;
  display: block;
}

.leftPadding {
  padding-left: 150px;
}

.gz-paddingBottom {
  padding-bottom: 60px;
}

.rightFlex {
  width: 99%;
  margin: 0 auto;
  display: flex;
  flex-direction: row-reverse;
  margin: 30px 0;
}

.adverBtn {
  margin: 0 10px;
}

.el-date-editor.el-input {
  width: 100%;
}

span.xing {
  float: left;
  margin: 11px -15px 0px 8px;
  color: #ff4949;
}

.leftPadding {
  margin: 0px 0px 0px -150px;
}
</style>
