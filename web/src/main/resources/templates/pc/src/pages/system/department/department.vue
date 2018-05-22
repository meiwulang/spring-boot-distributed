<template>
  <div class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <el-form ref="ruleForm" label-width="20px" class="gz-itemMragin">
          <el-row>
            <el-form-item prop="type">
              <!-- <el-select v-model="selectedOptions" v-show='companyType==2' :filterable="true" :filter-method="searchCompany" :loading="loading" remote clearable placeholder="请选择单位">
                <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                </el-option>
              </el-select>
              <el-button @click="defaultTableData" type="primary" v-show='companyType==2' class="btnbg addBtn">搜索</el-button> -->

              <el-button @click="addDepInfo" type="primary" class="btnbg fr addBtn">添加</el-button>
              <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
              <el-button @click="updatePage" type="default" class="btnbg fr" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table">
        <el-table :data="tableData" border style="width: 100%" @row-click="rowclickHandler" highlight-current-row>
          <el-table-column prop="dName" label="部门名称">
          </el-table-column>
          <el-table-column prop="dNo" label="部门编号">
          </el-table-column>
          <el-table-column prop="dPhone" label="部门电话">
          </el-table-column>
          <el-table-column prop="dFax" label="传真号码">
          </el-table-column>
          <el-table-column prop="dIntroduce" label="简介" width="600">
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button @click="editInfo(scope.$index,tableData)" type="default" size="mini">编辑</el-button>
              <el-button @click="deleteRow(scope.$index, tableData)" type="default" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @size-change="sizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->
      </div>
    </div>
    <!--jdy-content end-->

    <!--添加部门信息-->
    <div class="gz-Bg" v-show="departurePlaceFlag">
      <jdy-alert :title="alertTitle" @closeAlert="departurePlaceClose" v-show="departurePlaceFlag" class="alertAddProduct alertDeparturePlace" style="width:400px;top:30px;">
        <el-form :inline="true" :model="ruleForm" :rules="rules" class="demo-form-inline" label-width="90px">
          <div class="clearfix p10 mt15">
            <el-row>
              <!-- <el-form-item label="所属单位:">
                <el-select v-model="ruleForm.companyId" :filterable="true" :remote-method="searchCompany" :loading="loading" remote clearable :disabled="companyType==2 || companyType==0">
                  <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="一级部门:">
                <el-select v-model="ruleForm.departmentId" @change="departmentId" :filterable="true" :remote-method="searchDepartment" remote clearable :disabled="showEditInfo == true">
                  <el-option :key="value.id" v-for="value in departmentList" :label="value.dName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="二级部门:" v-if="ruleForm.departmentId">
                <el-select v-model="ruleForm.departmentIdTwo" @change="departmentIdTwo" :filterable="true" :remote-method="searchDepartmentTwo" remote clearable :disabled="showEditInfo == true">
                  <el-option :key="value.id" v-for="value in departmentListTwo" :label="value.dName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="三级部门:" v-if="ruleForm.departmentIdTwo">
                <el-select v-model="ruleForm.departmentIdThr" @change="departmentIdThr" :filterable="true" :remote-method="searchDepartmentThr" remote clearable :disabled="showEditInfo == true">
                  <el-option :key="value.id" v-for="value in departmentListThr" :label="value.dName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="四级部门:" v-if="ruleForm.departmentIdThr">
                <el-select v-model="ruleForm.departmentIdFour" @change="departmentIdFour" :filterable="true" :remote-method="searchDepartmentFour" remote clearable :disabled="showEditInfo == true">
                  <el-option :key="value.id" v-for="value in departmentListFour" :label="value.dName" :value="value.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门编号:" prop="dNo">
                <el-input placeholder="请填写你的部门编号" v-model="ruleForm.dNo">
                </el-input>
              </el-form-item>
              <el-form-item label="部门名称:" prop="dName">
                <el-input placeholder="请填写你的部门名称" v-model="ruleForm.dName">
                </el-input>
              </el-form-item>
              <el-form-item label="部门电话:">
                <el-input v-model="ruleForm.dPhone">
                </el-input>
              </el-form-item>
              <el-form-item label="传真号码:">
                <el-input v-model="ruleForm.dFax">
                </el-input>
              </el-form-item>
              <el-form-item label="部门简介">
                <el-input type="textarea" v-model="ruleForm.dIntroduce" class='departmentTxt'></el-input>
              </el-form-item>
            </el-row>
          </div>
          <div class="alertfoot1 clearfix">
            <el-button type="primary" class="fright mt10 mr10" @click="departurePlaceClose">关闭</el-button>
            <el-button type="primary" class="fright mt10 mr10" @click="submitForm()">提交</el-button>
          </div>
        </el-form>
      </jdy-alert>
    </div>
    <!--系统日志查看 弹窗  begin-->
    <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
      <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
    </jdy-alert>
    <!--系统日志查看 弹窗  begin-->
  </div>
</template>

<script>
//  import listData from '../../transfer/list/listData.js';
import jdyAlert from "@/components/Alert";
import jdyLog from "@/components/Log";
export default {
  components: {
    jdyAlert,
    jdyLog
  },
  name: "information",
  data() {
    return {
      oneHasChild: false,
      TwoHasChild: false,
      ThrHasChild: false,
      companyType: null,
      alertTitle: "添加部门信息",
      selectList: [], //部门单位select
      selectedOptions: null,
      selectListAlert: [], //弹窗单位select
      selectedOptionsAlert: [], //弹窗显示单位匹配
      props: {
        value: "id",
        label: "cName",
        children: "children"
      },
      tableData: [], //table数据,
      currentId: "", //table当前索引
      currentPage: 1, //当前页数
      pageSizeAll: 0, //显示分页个数，
      tableDataTotal: 0, //显示页码总数，
      departurePlaceFlag: false, //弹窗默认隐藏
      alertJournalFlag: false,
      ruleForm: {
        companyId: "999999",
        dWei: "",
        dName: "",
        dPhone: "",
        dFax: "",
        dIntroduce: "",
        dNo: "",
        dName: "",
        departmentId: 399,
        departmentIdTwo: "",
        departmentIdThr: "",
        departmentIdFour: "",
        departmentIdFive: "",
        dPid: "",
        dLevel: ""
      }, //添加部门弹窗数据
      rules: {
        dNo: [
          {
            type: "string",
            required: true,
            message: "请填写你的部门编号",
            trigger: "blur"
          }
        ],
        dName: [{ required: true, message: "请填写你的部门名称", trigger: "blur" }]
      }, //验证规则
      addcompanyId: 0, //添加部门弹窗时默认的单位id
      isUpdate: false,
      fullscreenLoading: false,
      loading: false,
      //日志相关参数
      pid: null,
      module: "department",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      //部门相关
      departmentList: [],
      departmentListTwo: [],
      departmentListThr: [],
      departmentListFour: [],
      departmentListFive: [],
      showEditInfo: false
    };
  },
  mounted() {
    this.defaultSelectList();
    this.defaultDepartmentList();
    let logindata = JSON.parse(sessionStorage.loginData);
    this.companyType = logindata.cType;
    this.selectedOptions = logindata.uCompanyId;
    this.defaultTableData();
  },
  computed: {},
  filters: {},
  methods: {
    handleItemChange(value) {
      console.log(value);
      this.defaultSelectList();
    },
    //初始化请求获取部门信息
    defaultTableData() {
      this.ruleForm.dLevel = "";
      let url = api_prefix + "/department/selectAllDepartmentByCompanyId";
      let data = {
        pageIndex: this.currentPage
      };
      if (this.selectedOptions) {
        data.companyId = 999999;
      } else {
        this.$alert("请选择单位", "温馨提示", { type: "warning" });
        return;
      }
      this.$http.post(url, data, { emulateJSON: true }).then(
        response => {
          if (response.body.code === "-1") {
            this.$alert(response.body.message, "温馨提示", {
              type: "warning"
            });
            return;
          }
          this.tableData = response.body.body.list;
          this.currentPage = response.body.body.pageNum;
          this.pageSizeAll = response.body.body.pageSize;
          this.tableDataTotal = response.body.body.total;
        },
        response => {
          console.log("出错了");
        }
      );
    },
    test(val) {
      console.log(11222);
      console.log(val);
    },
    searchCompany(name) {
      console.log(name);
      this.defaultSelectList(name);
    },
    searchDepartment(name) {
      console.log(name);
      this.defaultDepartmentList(name);
    },
    searchDepartmentTwo(name) {
      console.log(name);
      this.defaultDepartmentListTwo(name);
      this.oneHasChild = true;
    },
    searchDepartmentThr(name) {
      console.log(name);
      this.defaultDepartmentListThr(name);
      this.TwoHasChild = true;
    },
    searchDepartmentFour(name) {
      console.log(name);
      this.defaultDepartmentListFour(name);
      this.ThrHasChild = true;
    },
    //清除各级部门
    clearDepartmentId(level){
      console.log(level)
      if(level===1){
        this.oneHasChild=false;
        this.TwoHasChild=false;
        this.ThrHasChild=false;
        this.ruleForm.departmentIdTwo = '';
        this.ruleForm.departmentIdThr = '';
        this.ruleForm.departmentIdFour = '';
        this.departmentListTwo = [];
        this.departmentListThr = [];
        this.departmentListFour = [];
      }
      else if(level===2){
        this.TwoHasChild=false;
        this.ThrHasChild=false;
        this.ruleForm.departmentIdThr = '';
        this.ruleForm.departmentIdFour = '';
        this.departmentListThr = [];
        this.departmentListFour = [];
      }
      else if(level===3){
        this.ThrHasChild=false;
        this.ruleForm.departmentIdFour = '';
        this.departmentListFour = [];
      }
      else if(level===4){
        this.ruleForm.departmentIdFive = '';
        this.departmentIdFive = [];
      }
    },
    //选择某级别部门后
    departmentId(val) {
      if (val) {
        this.ruleForm.dLevel = 2;
        this.ruleForm.dPid2 = val;
        this.defaultDepartmentListTwo();
        this.oneHasChild = true;
        console.log(this.ruleForm.dPid2, "this.ruleForm.dPid2");
        console.log(this.oneHasChild, "this.oneHasChild");
      }
      else{
        this.ruleForm.dLevel = 1;
        this.clearDepartmentId(1);
      }
    },
    departmentIdTwo(val) {
      if (val) {
        this.oneHasChild = true;
        this.ruleForm.dLevel = 3;
        this.ruleForm.dPid3 = val;
        this.defaultDepartmentListThr();
        console.log(this.ruleForm.dPid3, "this.ruleForm.dPid3");
        console.log(this.TwoHasChild, "this.TwoHasChild");
      }
      else{
        this.ruleForm.dLevel = 2;
        this.clearDepartmentId(2);
      }
    },
    departmentIdThr(val) {
      if (val) {
        this.oneHasChild = true;
        this.TwoHasChild = true;
        this.ruleForm.dLevel = 4;
        this.ruleForm.dPid4 = val;
        this.defaultDepartmentListFour();
        console.log(this.ruleForm.dPid4, "this.ruleForm.dPid4");
        console.log(this.ThrHasChild, "this.ThrHasChild");
      }
      else{
        this.ruleForm.dLevel = 3;
        this.clearDepartmentId(3);
      }
    },
    departmentIdFour(val) {
      if (val) {
        this.oneHasChild = true;
        this.TwoHasChild = true;
        this.ThrHasChild = true;
        this.ruleForm.dLevel = 5;
        this.ruleForm.dPid5 = val;
      }
      else{
        this.ruleForm.dLevel = 4;
        this.clearDepartmentId(4);
      }
    },
    //初始化单位选择
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
    //初始化一级部门
    defaultDepartmentList(name) {
      let url = api_prefix + "/department/queryChildDepartmentByPid";
      let data = {
        pageIndex: 1,
        companyId: 999999,
        departmentPid: 0,
        pageSize: 15
      };
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.data.data.list;
        this.departmentList = listData;
        /*  this.ruleForm.departmentId = 399; */
      });
    },
    //请求二级部门
    defaultDepartmentListTwo(name) {
      let url = api_prefix + "/department/queryChildDepartmentByPid";
      let data = { pageIndex: 1, companyId: 999999,departmentPid: this.ruleForm.dPid2};
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.data.data.list;
        this.departmentListTwo = listData;
        if (listData.length != 0) {
          this.oneHasChild = true;
        } else {
          this.oneHasChild = false;
        }
      });
    },
    //请求三级部门
    defaultDepartmentListThr(name) {
      let url = api_prefix + "/department/queryChildDepartmentByPid";
      let data = { pageIndex: 1, companyId: 999999,departmentPid: this.ruleForm.dPid3};
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.data.data.list;
        this.departmentListThr = listData;
        if (listData.length != 0) {
          this.TwoHasChild = true;
        } else {
          this.TwoHasChild = false;
        }
      });
    },
    //请求四级部门
    defaultDepartmentListFour(name) {
      let url = api_prefix + "/department/queryChildDepartmentByPid";
      let data = { pageIndex: 1, companyId: 999999,departmentPid: this.ruleForm.dPid4};
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.data.data.list;
        this.departmentListFour = listData;
        if (listData.length != 0) {
          this.ThrHasChild = true;
        } else {
          this.ThrHasChild = false;
        }
      });
    },
    //刷新按钮
    updatePage() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
      }, 1000);
      this.defaultTableData();
    },

    //弹窗
    handleChangeAlert(value) {
      this.addcompanyId = value[0];
    },
    getPidByLevel(){
      let form = this.ruleForm;
      const level = form.dLevel;
      if(level === '' &&form.dPid === ''){
        form.dPid = 0;
        form.dLevel = 1;
      }
      else if(level === 1){
        form.dPid = 0;
      }
      else if(level === 2){
        form.dPid = form.dPid2;
      }
      else if(level === 3){
        form.dPid = form.dPid3;
      }
      else if(level === 4){
        form.dPid = form.dPid4;
      }
      else if(level === 5){
        form.dPid = form.dPid5;
      }
    },
    //部门信息弹窗提交
    submitForm() {
      //根据level获取对应的dPid
      this.getPidByLevel();
      let tableDataList = this.ruleForm;
      console.log(tableDataList);
      let data = {
        companyId: tableDataList.companyId | 999999,
        dName: tableDataList.dName,
        dPhone: tableDataList.dPhone,
        dFax: tableDataList.dFax,
        dIntroduce: tableDataList.dIntroduce,
        dNo: tableDataList.dNo,
        dPid: tableDataList.dPid,
        dLevel: tableDataList.dLevel
      };
      if (this.ruleForm) {
        data.id = tableDataList.id;
      }
      if (data.dNo === "") {
        this.$confirm("请输入部门编号!")
          .then(_ => {
            return;
          })
          .catch(_ => {});
        return;
      }
      if (data.dName === "") {
        this.$confirm("请输入部门名称!")
          .then(_ => {
            return;
          })
          .catch(_ => {});
        return;
      }
      //手机格式校验
      let dPhone = data.dPhonedPhone;
      let rgExps = {
        ExpuContactsPhone: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      };
      if (dPhone) {
        if (!rgExps.ExpuContactsPhone.test(dPhone)) {
          this.$confirm("号码格式不正确或者位数不正确")
            .then(_ => {
              return;
            })
            .catch(_ => {});
          return;
        }
      }
      if (this.isUpdate == false) {
        var url = api_prefix + "/department/createDepartmentGroup";
      } else {
        var url = api_prefix + "/department/updateDepartment";
      }
      this.$http.post(url, data).then(
        response => {
          if (response.body.code === "-1") {
            this.$confirm(response.body.message)
              .then(_ => {
                return;
              })
              .catch(_ => {});
            return;
          } else {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
          }
          this.defaultTableData();
          this.departurePlaceClose();
        },
        response => {
          this.$message.error("网络错误");
        }
      );
    },
    //删除行
    deleteRow(index, rows) {
      //点击删除
      this.currentId = rows[index].id;
      console.log("当前ID", this.currentId);
      this.$confirm("你确定要删除该内容？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              api_prefix +
                "/department/logicallyDeleteDepartment?departmentId=" +
                this.currentId
            )
            .then(
              response => {
                if (response.data.code == 0) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  console.log(response);
                  rows.splice(index, 1);
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
        })
        .catch(() => {});
    },
    //编辑部门信息
    editInfo(index, data) {
      this.$http.post(api_prefix + '/department/queryAllParentDepartment', {
        departmentId: data[index].id,
        companyId: this.ruleForm.companyId,
      }, { emulateJSON: true }).then(response => {
        if (response.data.code == 200) {
          if(response.body.data.length>1){
            response.body.data.pop();
            var newData = response.body.data;
            if(newData[0]){
              this.ruleForm.departmentId = newData[0].id;
              this.ruleForm.dPid2 = this.ruleForm.departmentId
              this.defaultDepartmentListTwo();
              console.log(this.ruleForm.dPid2,'this.ruleForm.dPid22')
            }
            if(newData[1]){
              this.ruleForm.departmentIdTwo = newData[1].id;
              this.ruleForm.dPid3 = this.ruleForm.departmentIdTwo
              this.defaultDepartmentListThr();
              console.log(this.ruleForm.dPid3,'this.ruleForm.dPid33')
            }
            if(newData[2]){
              this.ruleForm.departmentIdThr = newData[2].id;
              this.ruleForm.dPid4 = this.ruleForm.departmentIdThr
              this.defaultDepartmentListFour();
              console.log(this.ruleForm.dPid4,'this.ruleForm.dPid44')
            }
            if(newData[3]){
              this.ruleForm.departmentIdFour = newData[3].id
              this.ruleForm.dPid5 = this.ruleForm.departmentIdFour
              console.log(this.ruleForm.dPid5,'this.ruleForm.dPid55')
            }
          }
          console.log(response.body.data,'response.body.data')

        } else {
          this.$alert(response.data.message, '温馨提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
      this.showEditInfo = true;
      let tahtData = data[index];
      // this.ruleForm.dPid = tahtData.dPid;
      // this.ruleForm.dPid2 = this.ruleForm.departmentId;
      // this.ruleForm.dPid3 = this.ruleForm.departmentIdTwo;
      // this.ruleForm.dPid4 = this.ruleForm.departmentIdThr;
      // this.ruleForm.dPid5 = this.ruleForm.departmentIdFour;
      this.ruleForm.dLevel = tahtData.dLevel;
      this.ruleForm.id = tahtData.id;
      this.ruleForm.companyId = tahtData.companyId;
      this.ruleForm.dName = tahtData.dName;
      this.ruleForm.dPhone = tahtData.dPhone;
      this.ruleForm.dFax = tahtData.dFax;
      this.ruleForm.dIntroduce = tahtData.dIntroduce;
      this.ruleForm.dNo = tahtData.dNo;
      this.ruleForm.dName = tahtData.dName;
      this.departurePlaceFlag = true;
      this.selectedOptionsAlert = [];
      this.selectedOptionsAlert.push(tahtData.companyId);
      this.alertTitle = "编辑部门信息";
      this.isUpdate = true;
      console.log(tahtData);
    },
    //分页pageSize 改变时会触发
    sizeChange(size) {
      console.log(size);
    },
    //分页currentPage 改变时会触发
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.defaultTableData();
    },
    //部门信息弹窗显示
    addDepInfo() {
      this.showEditInfo = false;
      let logindata = JSON.parse(sessionStorage.loginData);
      this.isUpdate = false;
      this.alertTitle = "添加部门信息";
      this.departurePlaceFlag = true;
      this.selectedOptionsAlert = [];
      this.ruleForm = {
        companyId: null,
        dWei: "",
        dName: "",
        dPhone: "",
        dFax: "",
        dIntroduce: "",
        dNo: "",
        dName: "",
        departmentId: "",
        departmentIdTwo: "",
        departmentIdThr: "",
        departmentIdFour: "",
        departmentIdFive: "",
        dPid: "",
        dLevel: ""
      };
    },
    //部门信息弹窗关闭
    departurePlaceClose() {
      this.departurePlaceFlag = false;
      this.ruleForm.departmentId = '';
      this.ruleForm.departmentIdTwo = '';
      this.ruleForm.departmentIdThr = '';
      this.ruleForm.departmentIdFour = '';
      this.ruleForm.departmentIdFive = '';
    },
    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) {
        this.$alert("请选择产品");
        return;
      }
      this.alertJournalFlag = !this.alertJournalFlag;
      if (this.alertJournalFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle("alertJournal");
        });
      }
    },
    //获取日志数据
    getLogData(index) {
      this.$http
        .post(
          api_prefix +
            "/logs/selectLogs?pageIndex=" +
            index +
            "&module=" +
            this.module +
            "&pid=" +
            this.pid
        )
        .then(
          response => {
            let _self = this;
            this.journalTotal = response.data.body.total;
            this.journalCurrentData = [];
            response.data.body.list.forEach(function(value) {
              _self.journalCurrentData.push(value);
            });
            // this.journalCurrentData=response.data.body.list
          },
          response => {
            console.log("获取日志出错了");
          }
        );
    },
    //table行点击事件
    rowclickHandler(row, event, column) {
      this.pid = row.id;
      this.getLogData(1);
    }
    //----------日志相关逻辑 end-----
  }
};
</script>
<style scoped>
.gz-itemMragin {
  margin-top: 10px;
}

.gz-Bg {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 99;
}

.alertAddProduct {
  margin: auto;
  position: absolute;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}
</style>

