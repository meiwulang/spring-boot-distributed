<template>
  <div id="userinfo" class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <!--第一块-->
        <div class="userSaveBtn">
          <el-button @click="backUser" class="fr">返回</el-button>
          <el-button @click="saveFun('form')" type="primary" class="fr" style="margin-right:10px;">保存</el-button>
        </div>
        <div class="gz-userinfo">
          <div class="gz-userInfoTitle">
            <div class="leftline"></div>
            <span class="fontmain">基本信息</span>
            <div class="rightline"></div>
          </div>
          <el-row>
            <el-form ref="form" label-width="100px" :model="fromData" :rules="rules">
              <el-col :span="12">
                <el-form-item label="员工编号:">
                  <el-input v-model="fromData.uNo" :disabled="true"></el-input>  
                </el-form-item>
                <el-form-item label="用户账号:" prop="uAccount">
                  <el-input v-model="fromData.uAccount" :disabled="fromData.uAccount != '' && this.isAdd == false"></el-input>
                </el-form-item>
                <el-form-item label="单位名称:" prop="uCompanyId" v-show='companyType==2'>
                  <el-select v-model="selectedOptions" :filterable="true" :remote-method="searchCompany" remote clearable @change="handleChange" placeholder="请选择单位名称" style="width: 100%;">
                    <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="负责人:">
                      <el-checkbox-group 
                        v-model="udTypeValue"
                        :max="2">
                      <el-checkbox v-for="item in udTypes" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="地址:">
                  <el-input v-model="fromData.uAddress"></el-input>
                </el-form-item>
                <el-form-item label="手机号码:" prop="uTel">
                  <el-input v-model="fromData.uTel" ref="telPhone"></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="region">
                  <el-select v-model="fromData.uSex" @change="uSexFun" class="gz-Block">
                    <el-option :key="sex.value" :label="sex.label" :value="sex.value" v-for="sex in sexTypes"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文化程度:">
                  <el-select v-model="fromData.uDegree" @change="degreeNameFun" class="gz-Block">
                    <el-option v-for="listdegreeName in degreeName" :key="listdegreeName.id" :label="listdegreeName.dName" :value="listdegreeName.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电话:">
                  <el-input v-model="fromData.uPhone"></el-input>
                </el-form-item>
                <el-form-item label="QQ:">
                  <el-input v-model="fromData.uQq"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="真实姓名:" prop="uRealName">
                  <el-input v-model="fromData.uRealName"></el-input>
                </el-form-item>
                <el-form-item label="岗位职务:">
                  <el-input v-model="fromData.uPost"></el-input>
                </el-form-item>
                <el-form-item label="部门名称:">
                  <el-select v-model="fromData.uDepartmentId" @change="userAll" :filterable="true" :remote-method="searchDepartment" clearable remote placeholder="全部部门" class="gz-Block">
                    <el-option v-for="item in userOptions" :key="item.id" :label="item.dName" :value="item.id">
                      <span>{{item.dName}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="员工岗位:" prop="uStype">
                  <el-radio-group v-model="fromData.uStype">
                      <el-radio :label="0">非销售岗</el-radio>
                      <el-radio :label="1">销售岗</el-radio>
                   </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证:" prop="uIdcard">
                  <el-input v-model="fromData.uIdcard"></el-input>
                </el-form-item>
                <el-form-item label="出生年月:">
                  <el-date-picker @change="uBirthdayFun" v-model="fromData.uBirthday" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="邮箱:">
                  <el-input v-model="fromData.uEmail"></el-input>
                </el-form-item>
                <el-form-item label="微信号:">
                  <el-input v-model="fromData.uWxname"></el-input>
                </el-form-item>
                <el-form-item label="紧急联系人:">
                  <el-input v-model="fromData.uContacts"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model="fromData.uRemark"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!--第二块-->
        <!-- <div class="gz-userinfo" v-if='companyType == 2 && isAdd == false'>
          <div class="gz-userInfoTitle">
            <div class="leftline"></div>
            <span class="fontmain">修改密码</span>
            <div class="rightline"></div>
          </div>
          <el-form ref="formPass" label-width="100px">
            <el-form-item>
              <el-button @click="resetPassword" type="primary">重置密码</el-button>
            </el-form-item>
          </el-form>
        </div> -->

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      companyType: null,
      value1: "",
      sexTypes: [{ label: "男", value: false }, { label: "女", value: true }],
      selectList: [], //单位选择
      props: {
        value: "id",
        label: "cName",
        children: "children"
      }, //部门数据配置
      selectedOptions: null, //v-model绑定部门数据
      userOptions: [], //部门初始选择
      userVal: "", //部门双向绑定
      fromData: {
        uAccount: "", //用户名
        uCompanyId: "", //所属单位
        dName: "", //选择部门
        uDepartmentId: "", //选择部门id
        uRealName: "", //真实姓名
        uPost: "", //岗位职务
        uAddress: "", //地址
        uTel: "", //手机号码
        uSex: "", //性别
        uDegree: "", //文化程度
        uPhone: "", //电话
        uQq: "", //QQ
        uContacts: "", //紧急联系人
        uIdcard: "", //身份证
        uBirthday: "", //出身年月
        uEmail: "", //邮箱
        uRemark: "", //备注
        urRoleName: "",
        uWxname: "", //微信号
        uDtype: "",
        uStype: "",
        uNo: "",
        uType: ""
        //          uPassword:''//密码
      }, //初始显示数据,
      degreeName: [], //文化程度
      political: [], //政治面貌
      roleList: [],
      ruleForm: {
        id: "", //用户id
        uAccount: "", //用户名
        uCompanyId: "", //所属单位
        dName: "", //选择部门
        uDepartmentId: "", //选择部门id
        uDataLimit: "", //权限等级
        uRealName: "", //真实姓名
        uPost: "", //岗位职务
        uType: "", //角色权限
        uRoleId: "", //角色权限
        uAddress: "", //地址
        uTel: "", //手机号码
        uSex: "", //性别
        udegree: "", //文化程度
        uPhone: "", //电话
        uQq: "", //QQ
        uContacts: "", //紧急联系人
        uIdcard: "", //身份证
        uBirthday: "", //出身年月
        uPolitical: "", //政治面貌
        uFax: "", //传真
        uEmail: "", //邮箱
        uContactsPhone: "", //紧急联系
        uRemark: "" //备注
        //          uPassword:''//密码
      }, //新增时做保存时数据
      newDegreeName: "", //初始文化程度数据
      newPoliticalName: "", //初始化政治面貌数据
      newUtype: "", //初始化角色权限数据
      newuSex: "", //初始化性别
      newuDataLimit: "", //权限等级
      num: true,
      rules: {
        uStype: [
          { required: true, message: "请选择员工岗位" }
        ],
        uAccount: [
          { required: true, message: "请输入用户名" }
          // { min: 1, max: 20, message: '用户名不能超过20字符！' }
        ],
        uRealName: [
          { required: true, message: "请输入真实姓名" },
          { min: 1, max: 45, message: "真实姓名不能超过45字符！" }
        ],
        uCompanyId: [
          {
            type: 'regexp',
            required: true,
            message: "请选择所属单位",
            trigger: "change"
          }
        ],
        uDataLimit: [{ required: true, message: "请选择权限等级", trigger: "change" }],
        uRoleId: [
          {
            required: true,
            message: "请选择角色权限",
            trigger: "change"
          }
        ],
        uTel: [
          { required: true, message: "手机号不能为空" },
          { min: 11, message: "长度在 11 个数字" }
        ],
        uIdcard: [{ required: true, message: "身份证号不能为空" }]
      },
      uTypeDefaultNum: 1, //角色权限判断
      uCompanyIdDefaultNum: 1, //所属单位判断
      uDataLimitDefaultNum: 1, //权限等级判断
      companyType: null,
      isAdd: this.$route.query.isAdd,
      departmentName: "",
      udTypes: ["公司法人", "部门领导"],
      udTypeValue: []
    };
  },
  computed: {},
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.companyType = logindata.cType;
    console.log(this.companyType, "this.companyType");
    // this.defaultFromData()
    if (this.$route.query.isAdd == false) {
      this.defaultFromData();
    } else {
      if (this.companyType != 2) {
        this.fromData.uCompanyId = logindata.uCompanyId;
        console.log(this.fromData.uCompanyId, "当前用户Id");
        this.uCompanyIdDefaultNum += 1;
        // this.defaultAllSectors();
        this.getuType();
      }else{
        this.fromData.uCompanyId = '';
        this.selectList = [];
        console.log('----------------------------------')
      }
    }
    this.defaultCulture();
    this.defaultSelectList()
  },
  methods: {
    //初始化部门
    defaultFirstSectors(id) {
      this.$http.post(api_prefix + "department/queryDepartmentById/" + id).then(response => {
        let listData = response.body.body;
        this.userOptions = [listData];
        console.log(listData, "this.selectList11111");
      });
    },
    //初始化所属单位
    defaultSelectListFirst(id) {
      let url = api_prefix + "/Company/selectCompany";
      let data = { companyId: id };
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body;
        this.selectList = [listData];
        console.log(listData, "this.selectList11111");
      });
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
      });
    },
    //初始化获取数据
    defaultFromData() {
      let index = this.$route.query.formDataIndex;
      this.$http.get(api_prefix + "user/single/" + index).then(
        response => {
          if (response.data.code == 0) {
            this.fromData.uCompanyId = response.body.body.uCompanyId;
            this.fromData.uDepartmentId = response.body.body.uDepartmentId;
            if(this.fromData.uDepartmentId){
              this.defaultFirstSectors(this.fromData.uDepartmentId)
            }
            this.defaultSelectListFirst(this.fromData.uCompanyId);
              setTimeout(() => {//延时
                this.fromData.uType = response.body.body.cType;
                this.fromData = response.body.body;
                this.filteruSex();
                if (this.fromData.uDtype == 0) {
                  this.udTypeValue = [];
                }
                if (this.fromData.uDtype == 2) {
                  this.udTypeValue = ["公司法人"];
                }
                if (this.fromData.uDtype == 3) {
                  this.udTypeValue = ["公司法人", "部门领导"];
                }
                if (this.fromData.uDtype == 4) {
                  this.udTypeValue = ["部门领导"];
                }
              }, 1000);
            //默认初始化绑定单位
            if (index) {
              this.selectedOptions = null;
              this.selectedOptions = response.body.body.uCompanyId;
              this.uCompanyIdDefaultNum += 1;
            }
          } else {
            this.$alert(response.data.message, "温馨提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        },
        response => {
          console.log("出错了");
        }
      );
    },
    //初始化全部部门
    defaultAllSectors() {
      this.$http
        .post(
          api_prefix + "/department/selectAllDepartmentByCompanyId",
          {
            pageIndex: 1,
            companyId: this.fromData.uCompanyId,
            fastSearchStr: this.departmentName
          },
          { emulateJSON: true }
        )
        .then(
          response => {
            if (response.data.code == 0) {
              this.userOptions = response.body.body.list;
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //获取用户类型
    getuType() {
      this.$http
        .post(
          api_prefix + "/Company/selectCompany",
          {
            companyId: this.fromData.uCompanyId
          },
          { emulateJSON: true }
        )
        .then(
          response => {
            if (response.data.code == 0) {
              this.fromData.uType = response.body.body.cType;
              console.log(this.fromData.uType, "this.fromData.uType2");
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    searchCompany(name) {
      console.log(name);
      if(this.fromData.uCompanyId != ''){
        this.defaultSelectList(name);
      }
    },
    searchDepartment(name) {
      console.log(name);
      this.departmentName = name;
      if (this.fromData.uCompanyId != "") {
        this.defaultAllSectors();
      }
    },
    //初始化文化程度
    defaultCulture() {
      let url = api_prefix + "/Dictionaries/dictList";
      let data = {
        companyId: 2,
        dGroupId: 12
      };
      this.$http
        .post(url, data)
        .then(response => {
          //          console.log(response)
          this.degreeName = response.body.body;
        })
        .then(response => {});
    },
    //编辑时性别选项
    filteruSex() {
      let uSex = this.fromData.uSex;
      this.newuSex = uSex;
      if (this.fromData.uSex) {
        switch (uSex) {
          case false:
            this.fromData.uSex = "男";
            break;
          case true:
            this.fromData.uSex = "女";
            break;
        }
      }
    },
    //单位选择后函数
    handleChange(value) {
      console.log(value, "0");
      this.fromData.uCompanyId = value;
      value = $.trim(value);
      this.uCompanyIdDefaultNum += 1;
      if (value) {
        console.log("有只");
        this.getuType();
        this.defaultAllSectors();
      } else {
        console.log("meizhi");
        this.fromData.uDepartmentId = "";
        this.fromData.uRoleId = "";
      }
    },
    //选择部门
    userAll(value) {
      this.fromData.uDepartmentId = value;
    },
    //性别选择
    uSexFun(value) {
      this.fromData.uSex = value;
    },
    //文化程度
    degreeNameFun(value, old) {
      console.log(value);
      console.log(old);
      // this.fromData.uDegree = value
    },
    //出生日期
    uBirthdayFun(value) {
      this.fromData.uBirthday = value;
    },
    //返回
    backUser() {
      this.$router.push({ path: "/newuser" });
    },
    //保存
    saveFun(formName) {
      // this.saveParameter()
      console.log(this.fromData.uDepartmentId, "this.fromData.uDepartmentId3");
      if (this.$route.query.isAdd == true) {
        var url = api_prefix + "/user/save";
      } else {
        var url = api_prefix + "/user/update";
      }
      // var url = api_prefix + '/user/update'
      let tahtFrom = this.fromData;
      //用户名
      let uAccount = this.fromData.uAccount;
      //真实姓名
      let uRealName = this.fromData.uRealName;
      //紧急联系电话验证
      let uContactsPhone = "";
      if (this.fromData.uContactsPhone == "") {
        uContactsPhone = this.fromData.uContactsPhone;
      } else {
        uContactsPhone = parseInt(this.fromData.uContactsPhone);
      }
      //邮箱
      let uEmail = this.fromData.uEmail;
      //身份证
      let uIdcard = this.fromData.uIdcard;
      //手机号码
      let uTel = this.fromData.uTel;
      let rgExps = {
        ExpuContactsPhone: /(?:(\(\+?86\))(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|^(1[34578]\d{9})?$/,
        ReguEmail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
        ReguIdcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      };
      console.log(this.fromData.uEmail, "uEmail");
      console.log(this.fromData.uIdcard, "uIdcard");
      console.log(this.fromData.uTel, "uTel");
      if (uAccount == "") {
        this.regexpsAlert("用户名不能为空");
        return;
      }
      if (uRealName == "") {
        this.regexpsAlert("真实姓名不能为空");
        return;
      }
      if (uEmail) {
        console.log("正在检测邮箱");
        if (!rgExps.ReguEmail.test(uEmail)) {
          this.regexpsAlert("邮箱不正确");
          return;
        }
      }
      if (uIdcard) {
        if (!rgExps.ReguIdcard.test(uIdcard)) {
          this.regexpsAlert("身份证信息不正确");
          return;
        }
      }
      if (uTel) {
        if (!rgExps.ExpuContactsPhone.test(uTel)) {
          this.regexpsAlert("手机号码信息不正确");
          return;
        }
      }
      if (!rgExps.ExpuContactsPhone.test(uTel)) {
        this.regexpsAlert("手机号码信息不正确");
        return;
      }
      let udTypeValueTwo = this.udTypeValue.toString();
      if (udTypeValueTwo == "") {
        this.fromData.uDtype = 0;
      }
      if (udTypeValueTwo == "公司法人") {
        this.fromData.uDtype = 2;
      }
      if (udTypeValueTwo == "公司法人,部门领导" || udTypeValueTwo == "部门领导,公司法人") {
        this.fromData.uDtype = 3;
      }
      if (udTypeValueTwo == "部门领导") {
        this.fromData.uDtype = 4;
      }
      console.log(this.fromData.uDtype, "this.fromData.udType");
      if (this.fromData.uSex == "女") {
        this.fromData.uSex = true;
      } else if (this.fromData.uSex == "男") {
        this.fromData.uSex = false;
      }

      console.log(this.fromData, "上传");
      console.log(this.fromData.uType, "uType");
      this.fromData.id = this.$route.query.formDataIndex;
      console.log(this.fromData.uDepartmentId, "this.fromData.uDepartmentId2");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post(url, this.fromData)
            .then(response => {
              console.log(response);
              if (response.body.code == 0) {
                this.fullscreenLoading = true;
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.fullscreenLoading = false;
                  this.$router.push({ name: "newuser" });
                }, 1000);
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            })
            .then(response => {});
        } else {
          this.$message.error("提交失败了");
        }
      });
    },
    //验证提示
    regexpsAlert(info) {
      this.$confirm(info, "温馨提示", {
        type: "warning"
      })
        .then(() => {
          return;
        })
        .catch(() => {
          return;
        });
    }
  }
};
</script>
<style scoped>
.gz-userinfo {
  width: 84%;
  margin: 35px auto 30px;
  border: 1px solid #d7dfe3;
  padding: 50px 40px 25px 0;
  position: relative;
}

.gz-userInfoTitle {
  position: absolute;
  width: 150px;
  left: 0px;
  right: 0px;
  top: -8px;
  background: #fff;
  margin: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fontmain {
  padding: 0px 6px;
}

.leftline,
.rightline {
  width: 10px;
  height: 2px;
  background: #1f2d3d;
}

.gz-Block {
  display: block;
}

.el-date-editor.el-input {
  width: 100%;
}

.userSaveBtn {
  height: 50px;
  line-height: 50px;
  margin: 20px;
}
</style>
