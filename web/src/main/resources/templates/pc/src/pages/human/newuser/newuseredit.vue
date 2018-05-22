<template>
  <div id="userinfo" class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <!--第一块-->
        <div class="userSaveBtn">
          <el-button @click="backUser" class="fr">返回</el-button>
          <el-button @click="saveFun('form')" type="primary" class="fr" :disabled="btnFlag" style="margin-right:10px;">保存</el-button>
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
                <el-form-item label="身份证:" prop="uIdcard">
                  <el-input v-model="fromData.uIdcard"></el-input>
                </el-form-item>                
                <el-form-item label="单位名称:" prop="uCompanyId" v-show='uDataLimit == 3'>
                  <el-select v-model="selectedOptions" :filterable="true" :remote-method="searchCompany" clearable remote @change="handleChange" placeholder="请选择单位名称" style="width: 100%;">
                    <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="员工岗位:" prop="uCompanyId" v-show='companyType==2'>
                  <el-select v-model="selectedOptions" :filterable="true" :remote-method="searchCompany" remote clearable @change="handleChange" placeholder="请选择单位名称" style="width: 100%;">
                    <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="负责人:">
                      <el-checkbox-group
                        v-model="udTypeValue"
                        :max="2">
                      <el-checkbox v-for="item in udTypes" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="员工岗位:" prop="uPositionId">
                  <el-select v-model="fromData.uPositionId" @change="positionChange" style="width: 100%;">
                    <el-option :key="value.id" v-for="value in uPositionIdList" :label="value.dName" :value="value.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上级总监:" v-if='!puserFlag'>
                  <el-select v-model="fromData.uPuserid"  style="width: 100%;" >
                    <el-option :key="value.id" v-for="value in uPuseridList" :label="value.uRealName" :value="value.id" :disabled="value.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>                                
                <el-form-item label="地址:">
                  <el-input v-model="fromData.uAddress"></el-input>
                </el-form-item>
                <el-form-item label="手机号码:" prop="uTel">
                  <el-input v-model="fromData.uTel" ref="telPhone"></el-input>
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
                  <el-input v-model.trim="fromData.uRealName"></el-input>
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
                <!-- <el-form-item label="员工岗位:" prop="uStype">
                  <el-radio-group v-model="fromData.uStype">
                      <el-radio :label="0">非销售岗</el-radio>
                      <el-radio :label="1">销售岗</el-radio>
                   </el-radio-group>
                </el-form-item> -->

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
        <div class="gz-userinfo" v-if="isAdd == false">
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
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import {validatePhone} from '@/assets/js/validate';

export default {
  data() {
    return {
      uDataLimit:'',
      btnFlag: false,
      companyType: null,
      value1: "",
      sexTypes: [{ label: "男", value: false }, { label: "女", value: true }],
      selectList: [], //单位选择
      NewFromData: null,
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
        uType: "",
        //          uPassword:''//密码
        uPositionId: null, //员工岗位
        uPuserid: null //上级总监
      }, //初始显示数据,
      uPositionIdList: [], //员工岗位数组
      uPuseridList: [], //上级领导数组
      puserFlag: true,
      dataChange: null,
      // 临时
      temp: {
        posiName: null,
        id: null,
        name: null
      },
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
      // 定义非销售岗id
      salesId: 999999,
      rules: {
        uStype: [{ required: true, message: "请选择员工岗位" }],
        uAccount: [
          { required: true, message: "请输入用户名" }
          // { min: 1, max: 20, message: '用户名不能超过20字符！' }
        ],
        uRealName: [
          { required: true, message: "请输入真实姓名" },
          { min: 1, max: 45, message: "真实姓名不能超过45字符！" }
        ],
        uPositionId: [
          {
            type: "number",
            required: true,
            message: "请输入员工岗位",
            trigger: "change"
          }
        ],
        // uPuserid:[
        //   { required: true, message: "请输入上级总监" }
        // ],
        uDepartmentId: [{ required: true, message: "请选择部门" }],
        uCompanyId: [
          {
            type: "regexp",
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
          { validator: validatePhone, trigger: 'blur' },
          {required: true,message: '请输入正确的手机号'}          
        ],
        uIdcard: [{ required: true, message: "身份证号不能为空" }]
      },
      uTypeDefaultNum: 1, //角色权限判断
      uCompanyIdDefaultNum: 1, //所属单位判断
      uDataLimitDefaultNum: 1, //权限等级判断
      isAdd: this.$route.query.isAdd,
      departmentName: "",
      udTypes: ["公司法人", "部门领导"],
      udTypeValue: [],
      resOfPuserid: {
        companyId: null,
        departmentId: null,
        userId: null
      },
      copyCompanyId:null,
    };
  },
  computed: {},
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    // this.companyType = logindata.cType;
    this.uDataLimit = logindata.uDataLimit;
    // this.defaultFromData()
    this.defaultPositionIdList();
    if (this.$route.query.isAdd == false) {
      this.defaultFromData();
    } else {
      this.defaultSelectList();
      if (this.$route.query.companyId != null) {
          // this.defaultSelectListFirst(this.$route.query.companyId)
          this.selectedOptions = null;
          this.selectedOptions = this.$route.query.companyId;
          this.uCompanyIdDefaultNum += 1;
          this.fromData.uCompanyId = this.$route.query.companyId;
          this.copyCompanyId = this.$route.query.companyId;
          this.fromData.uDepartmentId = this.$route.query.departmentId;
          this.$route.query.departmentId &&
          this.defaultFirstSectors(this.fromData.uDepartmentId);
          this.defaultAllSectors();
      } else {
        if (this.companyType != 2) {
          this.fromData.uCompanyId = logindata.uCompanyId;
          this.uCompanyIdDefaultNum += 1;
          this.defaultAllSectors();
          // this.getuType();
        } else {
          this.fromData.uCompanyId = "";
          this.selectList = [];
          // console.log('----------------------------------')
        }
      }
    }
    this.defaultCulture();
  },
  methods: {
    //初始化部门
    defaultFirstSectors(id) {
      this.$http
        .post(api_prefix + "department/queryDepartmentById/" + id)
        .then(response => {
          let listData = response.body.body;
          this.userOptions = [listData];
        });
    },
    //初始化所属单位
    defaultSelectListFirst(id) {
      let url = api_prefix + "/Company/selectCompany";
      let data = { companyId: id };
      this.$http.post(url, data,{ emulateJSON: true }).then(response => {
        let listData = response.body.body;
        this.selectList = [listData];
        console.log(this.selectList, "this.selectList122222");
      });
    },
    searchPosition() {
      this.defaultPositionIdList();
    },
    // 初始化员工岗位
    defaultPositionIdList(callback) {
      this.$http
        .post(api_prefix + "Dictionaries/dictList", { groupName: "岗位职务" })
        .then(
          response => {
            this.uPositionIdList = response.body.body;
            let target = this.uPositionIdList.filter(data => {
              return data.dName == "非销售岗";
            });
            target[0].id = this.salesId;
            //  console.log("员工岗位",this.uPositionIdList)
            if (callback && typeof callback === "function") {
              callback(this.uPositionIdList);
            }
          },
          response => {
            this.$alert("网络出错啦~", "温馨提示", { type: "error" });
          }
        );
    },
    // 初始化上级总监(查销售总flag为false)
    defaultPuseridList(flag, callback) {
      let param = {
        currPage: 1,
        // 新增时需要从路由取数据
        companyId:
          this.resOfPuserid.companyId == null
            ? this.$route.query.companyId
            : this.resOfPuserid.companyId,
        // departId: this.resOfPuserid.departmentId,
        departId:
          this.resOfPuserid.departmentId == null
            ? this.$route.query.departmentId
            : this.resOfPuserid.departmentId,
        pageSize: 20,
        positionId: this.temp.id,
        positionName: this.temp.name,
        userId: this.resOfPuserid.userId
      };
      this.$http
        .post(api_prefix + "user/querySuperUsersByPosition", param)
        .then(
          response => {
            this.uPuseridList = response.body.body;
            if (callback && typeof callback === "function") {
              callback(this.uPuseridList);
            }
          },
          response => {
            // this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
          }
        );
    },
    // 员工岗位切换
    positionChange(value) {
      if (value) {
        let positionUser = null,
          perUser = null;
        positionUser = this.uPositionIdList.filter(data => {
          return value == data.id;
        });
        if (positionUser.length != 0) {
          this.temp.posiName = positionUser[0].dName;
          perUser = this.uPositionIdList.filter(data => {
            return positionUser[0].dPid == data.id;
          });
          if (positionUser[0].dName == "非销售岗" || positionUser[0].dName == "指导员") {
            this.fromData.uStype = 0;
            this.fromData.uType = 0;
            this.puserFlag = true;
          } else if (positionUser[0].dName == "销售总") {
            this.fromData.uStype = 1;
            this.fromData.uType = 1;
            this.puserFlag = true;
          } else {
            this.fromData.uStype = 1;
            this.fromData.uType = 1;
            this.puserFlag = false;
            this.temp.id = perUser[0].id;
            this.temp.name = perUser[0].dName;
            // 如果为销售总监则查销售总不需要传部门id
            this.defaultPuseridList(
              positionUser[0].dName == "销售总监" ? false : true
            );
          }
        }
        this.fromData.uPuserid = null;
      } else {
        this.fromData.uPuserid = null;
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
    //初始化获取数据
    defaultFromData() {
      let index = this.$route.query.formDataIndex;
      this.$http.get(api_prefix + "user/single/" + index).then(
        response => {
          if (response.data.code == 0) {
            this.fromData = JSON.parse(JSON.stringify(response.body.body));
            this.NewFromData = JSON.parse(JSON.stringify(response.body.body));
            let tempData = jdyFn.deepCopy(response.body.body);
            this.dataChange = Number(tempData.uPuserid);
            // 把上级名字带过来
            // 获取临时上级岗位id并存起来
            this.defaultPositionIdList(list => {
              // 如果为销售总或非销售岗
              if (
                this.fromData.uPositionId == null ||
                this.fromData.uPositionId == 200
              ) {
                this.puserFlag = true;
                this.fromData.uPositionId =
                  this.fromData.uPositionId == 200
                    ? this.fromData.uPositionId
                    : this.salesId;
              } else {
                this.puserFlag = false;
              }
              if (this.fromData.uPuserid != null) {
                this.fromData.uPuserid = Number(this.fromData.uPuserid);
                this.fromData.uPuserid =
                  this.fromData.uPuserid == 0 ? null : this.fromData.uPuserid;
              }
              let positionUser = list.filter(data => {
                return this.fromData.uPositionId == data.id;
              });
              this.temp.posiName = positionUser[0].dName;
              this.resOfPuserid.companyId = this.NewFromData.uCompanyId;
              this.resOfPuserid.departmentId = this.NewFromData.uDepartmentId;
              this.resOfPuserid.userId = this.NewFromData.id;
              // 非销售岗和销售总都没有dpid
              if (positionUser[0].dPid) {
                let perUser = list.filter(data => {
                  return positionUser[0].dPid == data.id;
                });
                this.temp.id = perUser[0].id;
                this.temp.name = perUser[0].dName;
                // 获取查上级总监参数
                this.defaultPuseridList(true, list => {
                  // 判断读取过来的上级总监id是否在列表里，没有的话push，有的话不操作
                  let targetList = list.filter(value => {
                    return this.NewFromData.uPuserid == value.id;
                  });
                  if (targetList.length == 0) {
                    // 复制第一条数据
                    let tempList = null;
                    if (list.length != 0) {
                      tempList = JSON.parse(JSON.stringify(list[0]));
                    } else {
                      tempList = {
                        id: "",
                        uRealName: "",
                        disabled: true
                      };
                    }
                    tempList.id = Number(this.NewFromData.uPuserid);
                    tempList.uRealName = this.NewFromData.uPuserName;
                    tempList.disabled = true;
                    list.push(tempList);
                  }
                });
              }
            });
            this.fromData.uCompanyId = response.body.body.uCompanyId;
            this.copyCompanyId = response.body.body.uCompanyId;
            this.fromData.uDepartmentId = response.body.body.uDepartmentId;
            // response.body.body.uPuserid=Number(response.body.body.uPuserid);
            if (this.fromData.uDepartmentId) {
              this.defaultFirstSectors(
                this.fromData.uDepartmentId || this.$route.query.uDepartmentId
              );
            }
            this.defaultSelectListFirst(this.fromData.uCompanyId);
            setTimeout(() => {
              //延时
              this.fromData.uType = response.body.body.uType;
              // console.log("formdata",this.fromData)
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
              this.fromData.uPuserid = this.dataChange;
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
              // console.log(this.fromData.uType, "this.fromData.uType2");
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
      // console.log(name);
      if (this.fromData.uCompanyId != "" || this.fromData.uCompanyId == 0) {
        console.log("09090909090900909090900")
        this.defaultSelectList(name);
      }
    },
    searchDepartment(name) {
      // console.log(name);
      this.departmentName = name;
      if (this.fromData.uCompanyId != "" || this.fromData.uCompanyId == 0) {
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
      // console.log(value, "0");
      this.userOptions = [];
      this.fromData.uCompanyId = value;
      value = $.trim(value);
      this.uCompanyIdDefaultNum += 1;
      if (value) {
        console.log(value,'value')
        console.log(this.copyCompanyId,'this.copyCompanyId')
        if(this.copyCompanyId != value){
          this.fromData.uPositionId = '';
          this.fromData.uDepartmentId = "";
          this.fromData.uRoleId = "";
        }
        // console.log("有只");
        // this.getuType();
        this.defaultAllSectors();
        this.resOfPuserid.companyId = value;
      } else {
        // console.log("meizhi");
        this.fromData.uPositionId = '';
        this.fromData.uDepartmentId = "";
        this.fromData.uRoleId = "";
      }
    },
    //选择部门
    userAll(value) {
      if(value){
        this.fromData.uDepartmentId = value;
        this.resOfPuserid.departmentId = value;
        this.defaultPuseridList(true);
      }else{
        this.fromData.uPositionId = '';
      }
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
      this.$router.push({ path: "/staffList" });
    },
    // 重置密码
    resetPassword() {
      this.$confirm("你确定要重置该用户密码？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get(
              api_prefix +
                "user/reset/" +
                this.fromData.id +
                "/" +
                this.fromData.uAccount
            )
            .then(
              response => {
                if (response.body.code == 0) {
                  this.$message.success("该用户密码重置成功!");
                } else {
                  this.$message.error("该用户密码重置失败!");
                }
              },
              response => {}
            );
        })
        .catch(() => {});
    },
    //保存
    saveFun(formName) {
      // this.saveParameter()
      // 如果员工岗位是销售经理或销售总监，则必须要上级总监
      if (
        (this.temp.posiName == "销售总监" || this.temp.posiName == "销售经理") &&
        this.fromData.uPuserid == null
      ) {
        return this.regexpsAlert("当前员工岗位为" + this.temp.posiName + ",上级总监不能为空");
      }
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
        ExpuContactsPhone: /(?:(\(\+?86\))(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|^(1[3|5|6|8]\d{9})?$/,
        ReguEmail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
        ReguIdcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      };
      if (!uTel) {
        this.regexpsAlert("请填写手机号");
        return;
      }
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
      if (this.fromData.uSex == "女") {
        this.fromData.uSex = true;
      } else if (this.fromData.uSex == "男") {
        this.fromData.uSex = false;
      }
      this.fromData.id = this.$route.query.formDataIndex;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果员工岗位id等于salesId。则置空
          if (this.fromData.uPositionId == this.salesId) {
            this.fromData.uPositionId = null;
          }
          this.btnFlag = true;
          this.$http
            .post(url, this.fromData)
            .then(response => {
              this.btnFlag = false;
              if (this.fromData.uPositionId == null) {
                this.fromData.uPositionId = this.salesId;
              }
              // console.log(response);
              if (response.body.code == 0) {
                this.fullscreenLoading = true;
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.fullscreenLoading = false;
                  this.$router.push({ name: "staffList" });
                }, 1000);
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            })
            .then(response => {
              this.btnFlag = false;
            });
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
  padding-right: 105px;
}
</style>
