<template>
  <div id="userinfo" class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <!--第一块-->
        <div class="gz-userinfo">
          <div class="gz-userInfoTitle">
          </div>
          <el-row>
            <el-form ref="form" label-width="130px" :model="fromData" :rules="rules">
              <div class="f16 mt22 c1f blod">个人信息</div>
              <div class="mt30"></div>
              <el-form-item label="头像：" style="margin-bottom: 10px">
                <div style="display:block;height:110px;width:110px;">
                  <img :src="fromData.uPic" v-show="fromData.uPic" class="fl ifImg" style="width:110px;height:110px;border-radius:5px;display:block">
                </div>
                <!-- <div class="jl-localPic" style="width:90px;">
                  <label for="fileUpload">
                    <a class="jl-uploadHead">上传头像</a>
                    <div>
                      <input type="file" name="file" id="fileUpload" class="el-upload__input" v-on:change="changecover($event)">
                    </div>
                  </label>
                </div> -->
              </el-form-item>
              <el-col :span="12">
                <el-form-item label="用户名：" style="margin-bottom: 10px">
                  <span>{{fromData.uAccount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属单位：" style="margin-bottom: 10px">
                  <span>{{fromData.cName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位职务：" style="margin-bottom: 10px">
                  <span>{{fromData.uPost}}</span>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="所属部门：" style="margin-bottom: 10px">
                  <span>{{fromData.dName}}</span>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="权限等级：" style="margin-bottom: 10px">
                  <span>{{fromData.uDataLimit}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色权限：" style="margin-bottom: 10px">
                  <span>{{fromData.urRoleName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="真实姓名：" prop="uRealName">
                  <el-input v-model="fromData.uRealName" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址：">
                  <el-input v-model="fromData.uAddress" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码：" prop="uTel">
                  <el-input v-model="fromData.uTel" ref="telPhone" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别：" prop="region">
                  <el-select v-model="fromData.uSex" @change="uSexFun" class="gz-Block" :disabled="true">
                    <el-option label="男" value="false"></el-option>
                    <el-option label="女" value="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>            
              <el-col :span="12">
                <el-form-item label="文化程度：" prop="region">
                  <el-select v-model="fromData.uDegree" @change="degreeNameFun" class="gz-Block" :disabled="true">
                    <el-option v-for="listdegreeName in degreeNameList" :key="listdegreeName.id" :label="listdegreeName.dName" :value="listdegreeName.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>   
              <el-col :span="12">
                <el-form-item label="电话：">
                  <el-input v-model="fromData.uPhone" :disabled="true"></el-input>
                </el-form-item>
              </el-col>   
              <el-col :span="12">
                <el-form-item label="QQ：">
                  <el-input v-model="fromData.uQq" :disabled="true"></el-input>
                </el-form-item>
              </el-col>   
              <el-col :span="12">
                <el-form-item label="紧急联系人：">
                  <el-input v-model="fromData.uContacts" :disabled="true"></el-input>
                </el-form-item>
              </el-col>   
              <el-col :span="12">
                <el-form-item label="身份证：">
                  <el-input v-model="fromData.uIdcard" :disabled="true"></el-input>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="出生年月：">
                  <el-date-picker @change="uBirthdayFun" v-model="fromData.uBirthday" type="date" placeholder="选择日期" :disabled="true">
                  </el-date-picker>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="政治面貌：" prop="region">
                  <el-select v-model="fromData.uPolitical" @change="politicalNameFun" class="gz-Block" :disabled="true">
                    <el-option v-for="politicalList in politicalList" :key="politicalList.id" :label="politicalList.dName" :value="politicalList.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="传真：">
                  <el-input v-model="fromData.uFax" :disabled="true"></el-input>
                </el-form-item>
              </el-col>   
              <el-col :span="12">
                <el-form-item label="邮箱：">
                  <el-input v-model="fromData.uEmail" :disabled="true"></el-input>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="紧急联系电话：">
                  <el-input v-model="fromData.uContactsPhone" :disabled="true"></el-input>
                </el-form-item>
              </el-col> 
              <!-- <el-button @click="saveFun" type="primary" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button> -->
              <div class="fright">
                <el-button type="primary">
                  <router-link :to="{ name: 'resetpassword',query: {loginname: fromData.uAccount,realname:fromData.uRealName,id:fromData.userId}}">修改密码</router-link>
                  </el-button>                
                <el-button @click="goback" type="default">返回</el-button>              
              </div>
              <!-- <el-button type="default">关闭</el-button> -->
            </el-form>
          </el-row>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: '',
      selectList: [],//单位选择
      props: {
        value: 'id',
        label: 'cName',
        children: 'children'
      },//部门数据配置
      fullscreenLoading:false,
      selectedOptions: [],//v-model绑定部门数据
      tableData: [],
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
      },//初始显示数据,
      degreeNameList: [],//文化程度
      politicalList: [],//政治面貌
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
        degreeName: '',//文化程度
        uPhone: '',//电话
        uQq: '',//QQ
        uContacts: '',//紧急联系人
        uIdcard: '',//身份证
        uBirthday: '',//出身年月
        politicalName: '',//政治面貌
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
          { required: true, message: '请输入用户名' }
        ],
        uRealName: [
          { required: true, message: '请输入真实姓名' }
        ],
        uCompanyId: [
          { type: 'regexp', required: true, message: '请选择所属单位', trigger: 'change' }
        ],
        uDataLimit: [
          { required: true, message: '请选择权限等级', trigger: 'change' }
        ],
        uType: [
          { required: true, message: '请选择角色权限', trigger: 'change' }
        ],
        uTel: [
          { required: true, message: '手机号不能为空' },
          { min: 11, message: '长度在 11 个数字' }
        ]
      },
      uTypeDefaultNum: 1,//角色权限判断
      uCompanyIdDefaultNum: 1,//所属单位判断
      uDataLimitDefaultNum: 1//权限等级判断
    }
  },
  computed: {
  },
  mounted() {
    this.defaultFromData()
    this.defaultAllSectors()
    this.defaultSelectList()
    this.defaultCulture()
    this.defaultPolitical()
  },
  methods: {
    //重置密码
    resetPassword() {
      let id = this.$route.query.formDataIndex
      let url = api_prefix + `/user/reset/${id}`
      this.$http.get(url).then(response => {
        //          console.log(response)
        this.regexpsAlert('密码重置成功')
      }).then(response => {
        console.log(response)
      })
    },
    //初始化所属单位
    defaultSelectList() {
      //        this.$refs.selectListRef.clearable=true
      let url = api_prefix + '/Company/selectAllCompanyWithTree?pageIndex=' + 1 + '&pageInteger=' + 1
      this.$http.post(url).then(response => {
        if (response.status === 200) {
          //            console.log(response)

          let listData = response.body.body.list
          for (let i in listData) {
            if (listData[i].children && listData[i].children.length <= 0) {
              delete listData[i].children
            }
          }
          this.selectList = listData
        }
      })
    },
    //初始化获取数据
    defaultFromData() {
      let index = this.$route.query.formDataIndex
      let url = api_prefix + `/user/getByAccount`
      this.$http.get(url).then(response => {
        if (response.status === 200 && response.body.body) {
          this.fromData = response.body.body
          console.log(this.fromData)
          //默认初始化绑定单位
          if (index) {
            this.selectedOptions = []
            this.selectedOptions.push(this.fromData.uCompanyId)
            this.ruleForm.uCompanyId = this.fromData.uCompanyId
            this.uCompanyIdDefaultNum += 1
          }
          //编辑时权限等级
          this.filteruDataLimit()
          //编辑时性别选项
          this.filteruSex()
        }
      }).then(response => {
      })
    },
    //初始化全部部门
    defaultAllSectors(pageIndex = 1, companyId = 2, fastSearchStr = '') {
      let url = api_prefix + '/department/selectAllDepartmentByCompanyId?pageIndex=' + pageIndex + '&companyId=' + companyId
      this.$http.post(url).then(response => {

        if (response.status === 200) {
          this.userOptions = response.body.body.list
          //            this.ruleForm.dName=response.body.body.id
        }
      }).then(response => {

      })
    },
    //初始化文化程度
    defaultCulture() {
      let url = api_prefix + '/Dictionaries/dictList'
      let data = {
        "dGroupId": 12
      }
      this.$http.post(url, data).then(response => {
        //          console.log(response)
        this.degreeNameList = response.body.body
      }).then(response => { })
    },
    //初始化政治面貌
    defaultPolitical() {
      let url = api_prefix + '/Dictionaries/dictList'
      let data = {
        "dGroupId": 11
      }
      this.$http.post(url, data).then(response => {
        //          console.log(response)
        this.politicalList = response.body.body
      }).then(response => { })
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
      this.ruleForm.uCompanyId = value[0]
      this.uCompanyIdDefaultNum += 1
    },
    //选择部门
    userAll(value) {
      this.ruleForm.dName = value
      this.ruleForm.uDepartmentId = value
    },
    //角色权限
    uTpyeFun(value) {
      this.ruleForm.uType = value
      this.ruleForm.uRoleId = value
      this.uTypeDefaultNum += 1
    },
    //权限等级
    uDataLimitFun(value) {
      this.ruleForm.uDataLimit = value
      this.uDataLimitDefaultNum += 1
    },
    //性别选择
    uSexFun(value) {
      this.ruleForm.uSex = value
    },
    //文化程度
    degreeNameFun(value) {
      this.fromData.udegree = value
    },
    //政治面貌
    politicalNameFun(value) {
      this.fromData.upolitical = value
    },
    //出生日期
    uBirthdayFun(value) {
      this.ruleForm.uBirthday = value
    },
    //返回
    backUser() {
      this.$router.push({ path: "/user" })
    },
    goback(){
      window.history.go(-1)
    },
    //保存
    saveFun() {
      // this.saveParameter()
      // let url = api_prefix + '/user/save'
      // let tahtFrom = this.ruleForm
      // //用户名
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
      if (uRealName == '') {
        this.regexpsAlert("真实姓名不能为空")
        return
      }
      if (!rgExps.ExpuContactsPhone.test(uContactsPhone) && uContactsPhone != '') {
        this.regexpsAlert("紧急联系电话不正确")
        return
      }
      if (uEmail) {
        console.log("正在检测邮箱");
        if (!rgExps.ReguEmail.test(uEmail)) {
          this.regexpsAlert("邮箱不正确");
          return;
        }
      }if (uIdcard) {
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
      // this.tahtFrom.uType = this.fromData.uType;
      // this.tahtFrom.cName = this.fromData.cName;
      // this.tahtFrom.uDataLimit = this.fromData.uDataLimit;
      if (this.fromData.uDataLimit == '用户级') {
        this.fromData.uDataLimit = 0
      } else if (this.fromData.uDataLimit == '部门级') {
        this.fromData.uDataLimit = 1
      } else if (this.fromData.uDataLimit == '单位级') {
        this.fromData.uDataLimit = 2
      } else if (this.fromData.uDataLimit == '系统级') {
        this.fromData.uDataLimit = 3
      }
      if (this.fromData.uSex == '女') {
        this.fromData.uSex = true
      } else if (this.fromData.uSex == '男') {
        this.fromData.uSex = false
      }
      this.fromData.id = this.fromData.userId
      console.log(this.fromData.uType,'this.fromData.uType')
      console.log(this.fromData)
      this.$http.post(api_prefix + '/user/update', this.fromData).then(response => {
        console.log(response)
          if (response.body.code == 0) {
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                });
            location.href="console.html#/main"
            }, 1000);
          } else {
            this.$alert(response.data.message, '温馨提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
          }
      }).then(response => {

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
    changecover($event) {
      console.log($event)
      var files = event.currentTarget.files || event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        this.createImage(files[i]);
      }
      event.currentTarget.value = '';
    },
    createImage(file) {
      let formData = new FormData();
      formData.append('fileType', 'jpg');
      formData.append('file', file);
      this.$http.post(api_prefix + "/common/file/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log(res)
        console.log(this.fromData.uPic, 'this.brandFrom.pOssName1')
        let picUrl = res.body.body.key;
        this.fromData.uPic = picUrl;
        console.log(this.fromData.uPic, 'this.brandFrom.pOssName2')
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
  margin: 35px auto 0px;
  padding: 0 40px 25px 0;
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
.jl-information a{
  color: #fff;
}
.jl-information a:hover{
  color: #fff;
}
</style>
