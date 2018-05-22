<template>
  <div class="jdy-content jdy-resources fleft">
    <div class="jdy-content-inner-trip">
      <div class="resources-tab">
        <div>
          <div class="inlineblock mr10 ">
            选择类型:
            <el-select v-model="search.dType" clearable placeholder="选择类型" class="jdy-search-edit hasbg mr10">
              <el-option v-for="type in originType" :key="type.code" :label="type.name" :value="type.code">
              </el-option>
            </el-select>
          </div>
          <div class="inlineblock mr10 ">
            快速搜索:
            <el-input placeholder="始发站名称" v-model="search.dName" class="w200">
            </el-input>
          </div>
          <el-button type="primary" @click="getTableData" class="el-button btnbg el-button--primary btnInTab">搜索</el-button>
        </div>
        <div>
          <el-button type="default" class="btnInTab" @click="refresh" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
          <el-button type="primary" class="btnInTab" @click="add">添加</el-button>
        </div>
      </div><!--jdy-search end-->


      <div class="jdy-table jdy-table-padding">
        <el-table :data="tableData" border class=" all">
          <el-table-column label="序号" type="index" width="60">
          </el-table-column>
          <el-table-column label="出发地点" width="">
            <template scope="scope">
              {{ scope.row.dName }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="">
            <template scope="scope">
              <span v-if="scope.row.dType==1">顺路站</span>
              <span v-if="scope.row.dType==2">班车站</span>
            </template>
          </el-table-column>
          <el-table-column label="所属区域" width="">
            <template scope="scope">
              {{ scope.row.dProvince }}-{{ scope.row.dCity }}-{{ scope.row.dArea }}
            </template>
          </el-table-column>
          <el-table-column label="班车情况" width="">
            <template scope="scope">
              去程：{{ scope.row.goCount }}&nbsp;&nbsp;返程：{{ scope.row.backCount }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="edit(scope.row)" class="mr15">
                编辑
              </el-button>
              <el-button type="default" class="red mr15" @click="carManage(scope.row.id,scope.row.dName,scope.row.dCity)" size="mini">
                班车管理
              </el-button>
              <el-button type="default" class="red" @click="del(scope.row.id)" size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper"
                         :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->

      </div>
      <!--jdy-table end-->

      <!--jdy-alert begin -->
      <jdy-alert title="添加/编辑出发地信息" @closeAlert="departurePlaceClose" v-if="departurePlaceFlag"
                 class="alertDeparturePlace alertTag dialog-lv" style="width:500px;">

        <el-form :model="departurePlaceForm" :rules="departurePlaceRule" ref="departurePlaceForm" label-width="90px" class="p10 pt20">
          <el-form-item label="出发地点:" prop="dName">
            <el-input v-model="departurePlaceForm.dName" placeholder="请输入出发地点"></el-input>
          </el-form-item>
          <el-form-item label="类型:" prop="dName">
            <el-select v-model="departurePlaceForm.dType" placeholder="请选择类型">
              <el-option v-for="type in originTypeAdd" :key="type.code" :label="type.name" :value="type.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省份:" prop="dProvince">
            <el-select v-model="departurePlaceForm.dProvince" placeholder="请选择省份" @change="provinceChange">
              <el-option :key="province.id" :label="province.name" :value="province.name" v-for="province in provinceList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:" prop="dCity">
            <el-select v-model="departurePlaceForm.dCity" placeholder="请选择城市"  @change="cityChange">
              <el-option v-for="item in cityList" :value="item.name" :label="item.name" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区/县:" prop="dArea">
            <el-select v-model="departurePlaceForm.dArea" placeholder="请选择区/县">
              <el-option v-for="item in AreaList" :value="item.name" :key="item.name" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="alertfoot1 clearfix">
          <el-button class="fright mt10 mr10" @click="departurePlaceClose">关闭</el-button>
          <el-button type="primary" class="fright mt10 mr10"  :disabled="btnFlag" @click="submitForm('departurePlaceForm')">保存</el-button>
        </div>
      </jdy-alert>

      <!--jdy-alert end-->

    </div><!--jdy-content-inner-trip end-->
  </div><!--jdy-content end-->
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import oData from './o.js';
  export default {
    name: 'Schedule',
    data() {
      return {
        btnFlag:false,
        search: {
          dType: 3,
          companyId: JSON.parse(sessionStorage.loginData).uCompanyId,
          dName: null,
          currPage: 0,
          pageSize: 20,
          dStatus: 0
        },
        originType: [{code: 3, name: '全部'}, {code: 1, name: '顺路站'}, {code: 2, name: '班车站'}],
        originTypeAdd: [ {code: 1, name: '顺路站'}, {code: 2, name: '班车站'}],
        tableData: [],
        currentPage: 1, //列表当前所在页,
        pageSize: 20,
        tableDataTotal: 0,
        departurePlaceFlag: false,
        departurePlaceForm: {
          id:null,
          dName:null,
          dType:null,
          dProvince:null,
          dCity:null,
          dArea:null,
          companyId:JSON.parse(sessionStorage.loginData).uCompanyId
        },
        departurePlaceRule:{
          dName:[{required: true,
            message: '请输入出发地点',
            trigger: 'blur'}],
          dType:[{required: true,
            message: '请选择类型',
            trigger: 'change'}],
          dProvince:[{required: true,
            message: '请选择省',
            trigger: 'change'}],
          dCity:[{required: true,
            message: '请选择市',
            trigger: 'change'}],
          dArea:[{required: true,
            message: '请选择区县',
            trigger: 'change'}]
        },
        loading: false,
        selectList: [],
        provinceList:[],
        cityList:[],
        AreaList:[],
        fullscreenLoading:false,
        companyType: null
      }
    },
    methods: {
        //查询单位
      searchCompany(value){
        this.loading = true;
        let url = api_prefix + '/Company/selectAllTopCompany';
        let data = {pageIndex: 1};
        if (value) {
          data.name = value;
        }
        this.$http.post(url, data, {emulateJSON: true}).then(response => {
          if (response.body.code === "-1") {
            this.$alert(response.body.message, "温馨提示", {type: 'warning'});
            return
          }
          this.selectList = response.body.body.list
          this.loading = false;
        }, response => {
          this.$alert("网络出错啦~", "温馨提示", {type: 'warning'});
          this.loading = false;
        });
      },
      //查询列表
      getTableData() {
        // if (!this.search.companyId) {
        //   this.$alert("请先选择单位哦~", "温馨提示", {type: "warning"});
        //   return;
        // }
        this.$http.post(api_prefix + 'departure/list', this.search).then(response => {
          if (response.body.body.code = "0") {
            var data = response.data.body;
            this.tableData = data.resultList;
            this.tableDataTotal = data.totalNum;
          } else {
            this.$alert(response.body.body.message, "温馨提示", {type: "error"});
          }
        }, response => {
          this.$alert("网络错误", "温馨提示", {type: "error"});
        });
      },
      //打开添加/编辑弹出框
      add() {
        var alertClass = 'alertDeparturePlace';
        this.departurePlaceFlag = true;

        if (this.departurePlaceFlag) {
          this.$nextTick(function () {
            jdyFn.setAlertStyle(alertClass);
            // this.search.addProduct = '';
          });
        }
      },
      //编辑按钮
      edit(form) {
        this.departurePlaceForm = JSON.parse(JSON.stringify(form));
        this.provinceChange(form.dProvince,true,()=>{
          this.cityChange(form.dCity,true);
        });
        this.add();
      },
      //删除
      del(id) {
        this.$confirm('此操作将永久删除该班车, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(api_prefix + 'departure/del', {"companyId": this.search.companyId, "id": id, "userId": 0}).then(response => {
            console.log(response)
            if(response.body.code == '0'){
              this.$message.success("删除成功");
              this.getTableData();
            }else{
              this.$message.error("删除失败");
            }
          }, response => {
            this.$message.error("网络错误");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //班车管理跳转
      carManage(id,name,city) {
        this.$router.push({name: 'origincar', query: {id: id,name:name,city:city}});
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //分页翻页
      handleCurrentChange(val) {
        if (val) {
          this.search.currPage = val;
          this.getTableData();
          this.currentPage = val;
        }
      },
      //关闭添加/编辑弹窗
      departurePlaceClose() {
        this.btnFlag = false;
        this.departurePlaceFlag = false;
        $('.alertbgg').remove();
        this.departurePlaceForm = {
          id:null,
          dName:null,
          dType:null,
          dProvince:null,
          dCity:null,
          dArea:null,
          companyId:JSON.parse(sessionStorage.loginData).uCompanyId
        }
      },
      //提交添加/编辑请求
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let url = null;
              if(this.departurePlaceForm.id){
                  url = 'departure/update'
              }else{
                  url = 'departure/save'
              }
            this.btnFlag = true;
            this.$http.post(api_prefix + url,this.departurePlaceForm
            ).then(response => {
              this.btnFlag = false;
              console.log(response);
              if(response.body.code == "0"){
                  this.$message.success("保存成功");
                  this.getTableData();
                  this.departurePlaceClose();
              }else{
                  this.$alert(response.body.message,"温馨提示",{type:"warning"});
              }
            }, response => {
                this.btnFlag = false;
                this.$alert("网络错误","温馨提示",{type:"warning"});
            });
          } else {
              this.$message.error("请完善表格后提交");
              return false;
          }
        });
      },
      //加载省列表
      defaultProvinceData() {
        let url = api_prefix + '/City/selectCities';
        let city = { level: 1 }
        this.$http.post(url, city).then(response => {
          if (response.body.code === "-1") {
            this.$alert(response.body.message, "温馨提示", { type: 'error' });
            return
          }
          this.provinceList = response.body.body
        }, response => {
          this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
        });
      },
      //省修改，并加载城市列表
      provinceChange(value,isEditFlag,fun) {
        let id = 0;
        for (var i in this.provinceList) {
          if (this.provinceList[i].name == value) {
            id = this.provinceList[i].id;
          }
        }
        if (id == 0) {
          return;
        }
        let url = api_prefix + '/City/selectCities';
        let city = { level: 2, pid: id }
        this.$http.post(url, city).then(response => {
          if (response.body.code === "-1") {
            this.$alert(response.body.message, "温馨提示", { type: 'error' });
            return
          }
          this.cityList = response.body.body;
          if(!isEditFlag){
            this.departurePlaceForm.dCity = null
            this.departurePlaceForm.dArea = null
          }
          fun && fun()
        }, response => {
          this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
        });
      },
      //城市修改回掉函数。 修改城市属性并加载区县列表
      cityChange(value,isEditFlag) {
        let id = 0;
        for (var i in this.cityList) {
          if (this.cityList[i].name == value) {
            id = this.cityList[i].id;
          }
        }
        if (id == 0) {
          return;
        }
        let url = api_prefix + '/City/selectCities';
        let city = { level: 3, pid: id }
        this.$http.post(url, city).then(response => {
          if (response.body.code === "-1") {
            this.$alert(response.body.message, "温馨提示", { type: 'error' });
            return
          }
          this.AreaList = response.body.body
          if(!isEditFlag){
            this.departurePlaceForm.dArea = null
          }
        }, response => {
          this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
        });
      },
      refresh(){
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
          this.$message({
            showClose: true,
            message: '刷新成功',
            type: 'success'
          });
          this.getTableData();
        }, 1000);
      }
    },
    created() {
      let logindata = JSON.parse(sessionStorage.loginData)
      this.companyType = logindata.cType
      this.search.companyId = logindata.uCompanyId
      console.log(this.search.companyId,'this.search.companyId')
      this.defaultProvinceData();
      this.searchCompany();
      this.getTableData();
    },
    components: {
      jdyAlert
    }
  }
</script>
<style scoped>
.alertDeparturePlace{
  height: 420px;
}

</style>
