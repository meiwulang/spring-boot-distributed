<template>
  <div id="userinfo" class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <!--第一块-->
        <div class="userSaveBtn">
          <el-button @click="backUser" class="fr">关闭</el-button>
          <el-button @click="saveFun('form')" type="primary" class="fr" style="margin-right:10px;">保存并返回</el-button>
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
                <el-form-item label="用户名:" prop="uAccount">
                  <el-input v-model="fromData.uAccount"></el-input>
                </el-form-item>
                <el-form-item label="所属单位:" prop="uCompanyId" v-show='companyType==2'>
                  <el-select v-model="selectedOptions" :filterable="true" :remote-method="searchCompany" remote clearable @change="handleChange" placeholder="请选择单位名称" style="width: 100%;">
                    <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="选择部门:">
                  <el-select v-model="fromData.uDepartmentId" @change="userAll" :filterable="true" :remote-method="searchDepartment" clearable remote placeholder="全部部门" class="gz-Block">
                    <el-option v-for="item in userOptions" :key="item.id" :label="item.dName" :value="item.id">
                      <span>{{item.dName}}</span>
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="权限等级:" prop="uDataLimit">
                  <el-select v-model="fromData.uDataLimit" @change="uDataLimitFun" class="gz-Block">
                    <el-option label="用户级" value='0'></el-option>
                    <el-option label="部门级" value='1'></el-option>
                    <el-option label="单位级" value='2'></el-option>
                    <el-option label="系统级" value='3'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="真实姓名:" prop="uRealName">
                  <el-input v-model="fromData.uRealName"></el-input>
                </el-form-item>
                <el-form-item label="岗位职务:">
                  <el-input v-model="fromData.uPost"></el-input>
                </el-form-item>
                <el-form-item label="角色权限:" prop="uRoleId">
                  <el-select v-model="fromData.uRoleId" @change="uTpyeFun" class="gz-Block">
                    <el-option v-for="item in roleList" :key="item.id" :label="item.urRoleName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="地址:">
                  <el-input v-model="fromData.uAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
                <el-form-item label="紧急联系人:">
                  <el-input v-model="fromData.uContacts"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证:">
                  <el-input v-model="fromData.uIdcard"></el-input>
                </el-form-item>
                <el-form-item label="出生年月:">
                  <el-date-picker @change="uBirthdayFun" v-model="fromData.uBirthday" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="政治面貌:">
                  <el-select v-model="fromData.uPolitical" @change="politicalNameFun" class="gz-Block">
                    <el-option v-for="politicalList in political" :key="politicalList.id" :label="politicalList.dName" :value="politicalList.id">

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="传真:">
                  <el-input v-model="fromData.uFax"></el-input>
                </el-form-item>
                <el-form-item label="邮箱:">
                  <el-input v-model="fromData.uEmail"></el-input>
                </el-form-item>
                <el-form-item label="紧急联系:">
                  <el-input v-model="fromData.uContactsPhone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model="fromData.uRemark"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!--第二块-->
        <div class="gz-userinfo" v-if='companyType == 2 && isAdd == false'>
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
export default {
  data() {
    return {
      companyType: null,
      value1: '',
      sexTypes: [{ label: "男", value: false }, { label: "女", value: true }],
      selectList: [],//单位选择
      props: {
        value: 'id',
        label: 'cName',
        children: 'children'
      },//部门数据配置
      selectedOptions: null,//v-model绑定部门数据
      userOptions: [],//部门初始选择
      userVal: '',//部门双向绑定
      fromData: {
        uAccount: '',//用户名
        uCompanyId: '',//所属单位
        dName: '',//选择部门
        uDepartmentId: '',//选择部门id
        uDataLimit: '',//权限等级
        uRealName: '',//真实姓名
        uPost: '',//岗位职务
        uType: '',//角色权限
        uRoleId: '',//角色权限
        uAddress: '',//地址
        uTel: '',//手机号码
        uSex: '',//性别
        uDegree: '',//文化程度
        uPhone: '',//电话
        uQq: '',//QQ
        uContacts: '',//紧急联系人
        uIdcard: '',//身份证
        uBirthday: '',//出身年月
        uPolitical: '',//政治面貌
        uFax: '',//传真
        uEmail: '',//邮箱
        uContactsPhone: '',//紧急联系
        uRemark: '',//备注
        urRoleName: ''
        //          uPassword:''//密码
      },//初始显示数据,
      degreeName: [],//文化程度
      political: [],//政治面貌
      roleList: [],
      ruleForm: {
        id: '',//用户id
        uAccount: '',//用户名
        uCompanyId: '',//所属单位
        dName: '',//选择部门
        uDepartmentId: '',//选择部门id
        uDataLimit: '',//权限等级
        uRealName: '',//真实姓名
        uPost: '',//岗位职务
        uType: '',//角色权限
        uRoleId: '',//角色权限
        uAddress: '',//地址
        uTel: '',//手机号码
        uSex: '',//性别
        udegree: '',//文化程度
        uPhone: '',//电话
        uQq: '',//QQ
        uContacts: '',//紧急联系人
        uIdcard: '',//身份证
        uBirthday: '',//出身年月
        uPolitical: '',//政治面貌
        uFax: '',//传真
        uEmail: '',//邮箱
        uContactsPhone: '',//紧急联系
        uRemark: ''//备注
        //          uPassword:''//密码
      },//新增时做保存时数据
      newDegreeName: '',//初始文化程度数据
      newPoliticalName: '',//初始化政治面貌数据
      newUtype: '',//初始化角色权限数据
      newuSex: '',//初始化性别
      newuDataLimit: '',//权限等级
      num: true,
      rules: {
        uAccount: [
          { required: true, message: '请输入用户名' },
          { min: 1, max: 20, message: '用户名不能超过20字符！' }
        ],
        uRealName: [
          { required: true, message: '请输入真实姓名' },
          { min: 1, max: 5, message: '真实姓名不能超过5字符！' }
        ],
        uCompanyId: [
          { type: 'regexp', required: true, message: '请选择所属单位', trigger: 'change' }
        ],
        uDataLimit: [
          { required: true, message: '请选择权限等级', trigger: 'change' }
        ],
        uRoleId: [
          { type: 'regexp', required: true, message: '请选择角色权限', trigger: 'change' }
        ],
        uTel: [
          { required: true, message: '手机号不能为空' },
          { min: 11, message: '长度在 11 个数字' }
        ]
      },
      uTypeDefaultNum: 1,//角色权限判断
      uCompanyIdDefaultNum: 1,//所属单位判断
      uDataLimitDefaultNum: 1,//权限等级判断
      companyType: null,
      isAdd: this.$route.query.isAdd,
      departmentName:''
    }
  },
  computed: {
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData)
    this.companyType = logindata.cType
    if (this.$route.query.isAdd == false) {
      this.defaultFromData()
    } else {
      if (this.companyType != 2) {
        this.fromData.uCompanyId = logindata.uCompanyId
        console.log(this.fromData.uCompanyId, '当前用户Id')
        this.uCompanyIdDefaultNum += 1
        this.defaultAllSectors();
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkk')
        this.getRoleId();
        this.getuType()
      }
    }
    this.defaultCulture()
    this.defaultPolitical()
    this.defaultSelectList()
  },
  methods: {
    //重置密码
    resetPassword() {
      let id = this.$route.query.formDataIndex
      let url = api_prefix + 'user/reset/' + id + "/" + this.fromData.uAccount
      this.$http.get(url).then(response => {
        this.regexpsAlert('密码重置成功')
      }).then(response => {
        console.log(response)
      })
    },
    //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix + '/Company/index';
        let data = { pageIndex: 1 };
        if (name) {
          data['fastSearchStr'] = $.trim(name)
        }
        this.$http.post(url, data, { emulateJSON: true }).then(response => {
          let listData = response.body.body.list
          this.selectList = listData
        })
    },
    //初始化获取数据
    defaultFromData() {
      let index = this.$route.query.formDataIndex
      this.$http.get(api_prefix + 'user/get/' + index, ).then(response => {
        if (response.data.code == 0) {
          // Object.assign(this.fromData,response.body.body);
          this.getRoleId(response.body.body.uCompanyId);
          this.defaultAllSectors(response.body.body.uCompanyId);
          console.log('qqqqqqqqqqqqqqqqqqqqq')
          this.fromData.uDepartmentId = response.body.body.uDepartmentId
          this.fromData.uRoleId = response.body.body.uRoleId
          console.log(response.body.body.uDepartmentId, 'response.body.body.uDepartmentId')
          console.log(this.fromData.uDepartmentId, 'this.fromData.uDepartmentId')
          setTimeout(() => {
            this.fromData.uCompanyId = response.body.body.uCompanyId
            this.fromData.uType = response.body.body.cType;
            this.fromData = response.body.body
            console.log(this.fromData, '123')
            //编辑显示角色权限
            this.filterUtype()
            //编辑时权限等级
            this.filteruDataLimit()
            //编辑时性别选项
            this.filteruSex()
            console.log(this.fromData.uDepartmentId, 'this.fromData.uDepartmentId4')
          }, 1000);
          //默认初始化绑定单位
          if (index) {
            this.selectedOptions = null;
            this.selectedOptions = response.body.body.uCompanyId;
            this.uCompanyIdDefaultNum += 1;
          }
        } else {
          this.$alert(response.data.message, '温馨提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
    },
    //初始化全部部门
    defaultAllSectors(id) {
      this.$http.post(api_prefix + '/department/selectAllDepartmentByCompanyId', {
        pageIndex: 1,
        companyId: id || this.fromData.uCompanyId,
        fastSearchStr: this.departmentName
      }, { emulateJSON: true }).then(response => {
        if (response.data.code == 0) {
          this.userOptions = response.body.body.list
        } else {
          this.$alert(response.data.message, '温馨提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
    },
    //获取用户类型
    getuType() {
      this.$http.post(api_prefix + '/Company/selectCompany', {
        companyId: this.fromData.uCompanyId
      }, { emulateJSON: true }).then(response => {
        if (response.data.code == 0) {
          this.fromData.uType = response.body.body.cType
          console.log(this.fromData.uType, 'this.fromData.uType2')
        } else {
          this.$alert(response.data.message, '温馨提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
    },
    //初始化角色
    getRoleId(id) {
      this.$http.post(api_prefix + '/user_role/list', {
        urCompanyId: (id || this.fromData.uCompanyId)
      }).then(response => {
        if (response.data.code == 0) {
          this.roleList = response.body.body
        } else {
          this.$alert(response.data.message, '温馨提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
    },
    searchCompany(name) {
      console.log(name);
      this.defaultSelectList(name)
    },
     searchDepartment(name) {
      console.log(name);
      this.departmentName = name;
      if(name){
        this.defaultAllSectors()
      }
      console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
    },
    //初始化文化程度
    defaultCulture() {
      let url = api_prefix + '/Dictionaries/dictList'
      let data = {
        "companyId": 2,
        "dGroupId": 12
      }
      this.$http.post(url, data).then(response => {
        //          console.log(response)
        this.degreeName = response.body.body
      }).then(response => { })
    },
    //初始化政治面貌
    defaultPolitical() {
      let url = api_prefix + '/Dictionaries/dictList'
      let data = {
        "companyId": 2,
        "dGroupId": 11
      }
      this.$http.post(url, data).then(response => {
        //          console.log(response)
        this.political = response.body.body
      }).then(response => { })
    },
    //编辑时角色权限过滤
    filterUtype() {
      let Utype = this.fromData.uType
      this.newUtype = Utype
      switch (Utype) {
        case 0:
          this.fromData.uType = '供应商'
          break;
        case 1:
          this.fromData.uType = '分销商'
          break;
        case 2:
          this.fromData.uType = '管理公司'
          break;
      }
    },
    //编辑时权限等级
    filteruDataLimit() {
      let uDataLimit = this.fromData.uDataLimit
      this.newuDataLimit = uDataLimit
      switch (uDataLimit) {
        case 0:
          this.fromData.uDataLimit = '用户级'
          break
        case 1:
          this.fromData.uDataLimit = '部门级'
          break
        case 2:
          this.fromData.uDataLimit = '单位级'
          break
        case 3:
          this.fromData.uDataLimit = '系统级'
          break
      }

    },
    //编辑时性别选项
    filteruSex() {
      let uSex = this.fromData.uSex
      this.newuSex = uSex
      switch (uSex) {
        case false:
          this.fromData.uSex = '男'
          break
        case true:
          this.fromData.uSex = '女'
          break
      }
    },
    //单位选择后函数
    handleChange(value) {
      console.log(value, '0')
      this.fromData.uCompanyId = value
      value = $.trim(value)
      this.uCompanyIdDefaultNum += 1
      if(value){
        console.log('有只')
        this.getRoleId();
        this.getuType();
        this.defaultAllSectors();
      }else{
        console.log('meizhi')
        this.fromData.uDepartmentId = '';
        this.fromData.uRoleId = '';
      }
    },
    //选择部门
    userAll(value) {
      this.fromData.uDepartmentId = value
    },
    //角色权限
    uTpyeFun(value) {
      // this.fromData.uType = value
      this.fromData.uRoleId = value
      this.uTypeDefaultNum += 1
    },
    //权限等级
    uDataLimitFun(value) {
      console.log(value, '123');
      this.fromData.uDataLimit = value;
      this.uDataLimitDefaultNum += 1
    },
    //性别选择
    uSexFun(value) {
      this.fromData.uSex = value
    },
    //文化程度
    degreeNameFun(value, old) {
      console.log(value);
      console.log(old);
      // this.fromData.uDegree = value
    },
    //政治面貌
    politicalNameFun(value) {
      // this.fromData.uPolitical = value
    },
    //出生日期
    uBirthdayFun(value) {
      this.fromData.uBirthday = value
    },
    //返回
    backUser() {
      this.$router.push({ path: "/user" })
    },
    //保存
    saveFun(formName) {
      // this.saveParameter()
      console.log(this.fromData.uDepartmentId, 'this.fromData.uDepartmentId3')
      if (this.$route.query.isAdd == true) {
        var url = api_prefix + '/user/save'
      } else {
        var url = api_prefix + '/user/update'
      }
      let tahtFrom = this.fromData
      //用户名
      let uAccount = this.fromData.uAccount
      //真实姓名
      let uRealName = this.fromData.uRealName
      //紧急联系电话验证
      let uContactsPhone = ''
      if (this.fromData.uContactsPhone == '') {
        uContactsPhone = this.fromData.uContactsPhone
      } else {
        uContactsPhone = parseInt(this.fromData.uContactsPhone)
      }

      //邮箱
      let uEmail = this.fromData.uEmail
      //身份证
      let uIdcard = this.fromData.uIdcard
      //手机号码
      let uTel = this.fromData.uTel
      let rgExps = {
        ExpuContactsPhone: /(?:(\(\+?86\))(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|^(1[34578]\d{9})?$/,
        ReguEmail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
        ReguIdcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      }
      if (uAccount == '') {
        this.regexpsAlert("用户名不能为空")
        return
      }
      if (uRealName == '') {
        this.regexpsAlert("真实姓名不能为空")
        return
      }
      /*uCompanyIdDefaultNum:1,//所属单位判断
       uDataLimitDefaultNum:1//权限等级判断*/
      // if (this.uCompanyIdDefaultNum == 1) {
      //   this.regexpsAlert("所属单位未选择")
      //   return
      // }
      if (this.uDataLimitDefaultNum == 1) {
        this.regexpsAlert("权限等级未选择")
        return
      }
      if (this.uTypeDefaultNum == 1) {
        this.regexpsAlert("角色权限未选择")
        return
      }
      if (!rgExps.ExpuContactsPhone.test(uTel) || uTel == '') {
        this.regexpsAlert("手机号码信息不正确")
        return
      }
      if (!rgExps.ExpuContactsPhone.test(uContactsPhone) && uContactsPhone != '') {
        this.regexpsAlert("紧急联系电话不正确")
        return
      }
      if (!rgExps.ReguEmail.test(uEmail) && uEmail != '') {
        this.regexpsAlert("邮箱不正确")
        return
      }
      if (!rgExps.ReguIdcard.test(uIdcard) && uIdcard != '') {
        this.regexpsAlert("身份证信息不正确")
        return
      }
      if (this.fromData.uDataLimit == '用户级') {
        this.fromData.uDataLimit = "0"
      } else if (this.fromData.uDataLimit == '部门级') {
        this.fromData.uDataLimit = "1"
      } else if (this.fromData.uDataLimit == '单位级') {
        this.fromData.uDataLimit = "2"
      } else if (this.fromData.uDataLimit == '系统级') {
        this.fromData.uDataLimit = "3"
      }
      if (this.fromData.uType == '供应商') {
        this.fromData.uType = 0
      } else if (this.fromData.uType == '分销商') {
        this.fromData.uType = 1
      } else if (this.fromData.uType == '管理公司') {
        this.fromData.uType = 2
      }
      if (this.fromData.uSex == '女') {
        this.fromData.uSex = true
      } else if (this.fromData.uSex == '男') {
        this.fromData.uSex = false
      }
      console.log(this.fromData, '上传')
      this.fromData.id = this.fromData.userId
      console.log(this.fromData.uDepartmentId, 'this.fromData.uDepartmentId2')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(url, this.fromData).then(response => {
            console.log(response)
            if (response.body.code == 0) {
              this.fullscreenLoading = true;
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              });
              setTimeout(() => {
                this.fullscreenLoading = false;
                this.$router.push({ name: 'user' })
              }, 1000);
            } else {
              this.$alert(response.data.message, '温馨提示', {
                confirmButtonText: '确定',
                callback: action => { }
              });
            }
          }).then(response => {

          })
        } else {
          this.$message.error('提交失败了');
        }
      })
    },
    //验证提示
    regexpsAlert(info) {
      this.$confirm(info, '温馨提示', {
        type: 'warning'
      }).then(() => {
        return
      }).catch(() => {
        return
      });
    },
    //传参赋值函数
    // saveParameter() {
    //   let thatRuleForm = this.ruleForm
    //   let thatFromData = this.fromData

    //   for (let i in this.userOptions) {
    //     if (this.userOptions[i].dName == this.fromData.dName) {
    //       thatRuleForm.dName = this.userOptions[i].id
    //       thatRuleForm.uDepartmentId = this.userOptions[i].id
    //     }
    //   }
    //   for (let j in this.degreeName) {
    //     if (this.degreeName[j].dName == this.fromData.degreeName) {
    //       thatRuleForm.degreeName = this.degreeName[j].id
    //     }
    //   }
    //   for (let k in this.political) {
    //     if (this.political[k].dName == this.fromData.politicalName) {
    //       thatRuleForm.politicalName = this.political[k].id
    //     }
    //   }
    //   if (this.$route.query.formDataIndex && this.num) {
    //     thatRuleForm.uType = this.newUtype
    //     thatRuleForm.uRoleId = this.newUtype
    //     thatRuleForm.uSex = this.newuSex
    //     thatRuleForm.uDataLimit = this.newuDataLimit
    //     thatRuleForm.id = this.$route.query.formDataIndex
    //     this.num = false
    //   }


    //   thatRuleForm.uAccount = thatFromData.uAccount//用户名
    //   //        thatRuleForm.uCompanyId=thatFromData.selectedOptions//所属单位
    //   //        thatRuleForm.dName=thatFromData.dName//选择部门
    //   //        thatRuleForm.uDataLimit=thatFromData.uDataLimit//权限等级
    //   thatRuleForm.uRealName = thatFromData.uRealName//真实姓名
    //   thatRuleForm.uPost = thatFromData.uPost//岗位职务
    //   //        thatRuleForm.uType=thatFromData.uType//角色权限
    //   thatRuleForm.uAddress = thatFromData.uAddress//地址
    //   thatRuleForm.uTel = thatFromData.uTel//手机号码
    //   //        thatRuleForm.uSex=`${thatFromData.uSex}`//性别
    //   //        thatRuleForm.degreeName=thatFromData.degreeName//文化程度
    //   thatRuleForm.uPhone = thatFromData.uPhone//电话
    //   thatRuleForm.uQq = thatFromData.uQq//QQ
    //   thatRuleForm.uContacts = thatFromData.uContacts//紧急联系人
    //   thatRuleForm.uIdcard = thatFromData.uIdcard//身份证
    //   //        thatRuleForm.uBirthday=thatFromData.uBirthday//出身年月
    //   //        thatRuleForm.politicalName=thatFromData.politicalName,//政治面貌
    //   thatRuleForm.uFax = thatFromData.uFax//传真
    //   thatRuleForm.uEmail = thatFromData.uEmail//邮箱
    //   thatRuleForm.uContactsPhone = thatFromData.uContactsPhone//紧急联系
    //   thatRuleForm.uRemark = thatFromData.uRemark//备注
    //   //        thatRuleForm.uPassword=thatFromData.uPassword//密码
    // }
  }
}
</script>
<style scoped>
.gz-userinfo {
  width: 84%;
  margin: 35px auto 30px;
  border: 1px solid #d7dfe3;
  padding: 50px 40px 25px 0;
  position: relative
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
  background: #1f2d3d
}

.gz-Block {
  display: block;
}

.el-date-editor.el-input {
  width: 100%
}

.userSaveBtn {
  height: 50px;
  line-height: 50px;
  margin: 20px;
  padding-right: 105px;
}
</style>
