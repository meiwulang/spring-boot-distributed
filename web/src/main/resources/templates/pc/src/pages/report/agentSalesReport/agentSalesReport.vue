<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-form :model="ruleForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-form-item label="单位名称：" prop="uCompanyId" v-show='uDataLimit == 3'>
              <el-select v-model="ruleForm.companyId" clearable placeholder="请选择单位名称" style="width: 100%;">
                <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账单日期：" label-width="70px">
              <el-date-picker v-model="ruleForm.dateRange" type="daterange" @change="datetimerange" placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="quickSearch" class="creditBillSearch">
              <el-input placeholder="代理人姓名/手机号码" v-model="ruleForm.searchStr" class="search-input-l">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="ml10 btnbg" @click="searchFn">搜索</el-button>
            <el-button type="default" class="btnbg mr10">
                <a :href="downLoadHref" download="代理人销售报表" @click="changeHref" class="normalA" :disabled="tableData.length==0 ?true:false">导出表格</a>
            </el-button>
            <el-button class="ml10 btnbg fright clearfix" @click="allTrend">销售总额趋势</el-button>
          </el-row>
        </el-form>

      </div>

      <div class="jdy-table pt20">
        <el-table class="table-alignC" :data="tableData" border>
          <el-table-column type='index' label="序号" width="50"></el-table-column>
          <el-table-column label="openId" prop="openId" min-width="250"></el-table-column>
          <el-table-column label="昵称" prop="realName" min-width="120"></el-table-column>
          <el-table-column label="真实姓名" prop="realName" min-width="100"></el-table-column>
          <el-table-column label="手机号码" prop="phone" min-width="110"></el-table-column>
          <el-table-column label="下线总人数" prop="followers" min-width="100" sortable>
            <template scope="scope">
              {{ scope.row.followers}}
            </template>
          </el-table-column>
          <el-table-column label="订单数" prop="orderCount" min-width="60" sortable>
            <template scope="scope">
            {{ scope.row.orderCount}}
            </template>
          </el-table-column>
          <el-table-column label="销售总金额" prop="moneyCount" min-width="120" sortable>
            <template scope="scope">
              {{ scope.row.moneyCount}}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" min-width="80">
            <template scope="scope">
              <router-link :to="{path:'saleTrendReport',query:{realName:scope.row.realName,id:scope.row.id}}" class="blue-font">趋势图</router-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix" v-if="tableData.length>0 ">
          <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->
      </div>

    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
import reportApi from "./../api/index";

export default {
  name: "agentReturnReport",
  data() {
    return {
      uDataLimit:'',
      currentPage: 1,
      pageSizeAll: 20,
      tableDataTotal: 0,
      ruleForm: {
        searchStr: "",
        dateRange: "",
        currPage: 1,
        pageSize: 20,
        minDate: "",
        maxDate: "",
        companyId: null
      },
      selectList:[],
      searchValue: "",
      tableData: [],
      publicId: "",
      accesstoken: "",
      time: "",
      downLoadHref: ""
    };
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    this.publicId = JSON.parse(sessionStorage.loginData).appId;
    this.ruleForm.companyId = JSON.parse(sessionStorage.loginData).uCompanyId;
    // this.publicId = 'gh_155170e9f6b2';
    //this.publicId = 'wx4f8c668abdd46305';
    this.getTableData();
    this.defaultSelectList();
  },
  methods: {
    allTrend() {
      this.$router.push({ name: "saleTrendReport" });
    },
    changeHref() {
      this.downLoadHref =
        api_prefix +
        "/agentinfo/export" +
        "?&minDate=" +
        this.ruleForm.minDate +
        "&maxDate=" +
        this.ruleForm.maxDate +
        "&searchStr=" +
        this.ruleForm.searchStr +
        "&companyId=" +
        this.ruleForm.companyId
        console.log(this.downLoadHref, "downLoadHref");
    },
    handleCurrentChange(val) {
      this.ruleForm.currPage = val;
      this.getTableData();
    },
    searchFn() {
      if (this.ruleForm.searchStr) {
        this.ruleForm.searchStr = $.trim(this.ruleForm.searchStr);
      }
      this.getTableData();
    },
    getTableData() {
      let formData = this.ruleForm;
      this.$http.post(api_prefix + "/agentinfo/list", formData).then(
        response => {
          let data = response.data.body;
          this.tableData = data.resultList;
          this.tableDataTotal = data.totalNum;
        },
        response => {
          console.log("出错了");
        }
      );
    },
    //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix + "/Company/index";
      let data = { pageIndex: 1 ,pid:343 ,searchType:1};
      if (name) {
        data["fastSearchStr"] = $.trim(name);
      }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body.list;
        this.selectList = listData;
        console.log(this.selectList, "this.selectList");
      });
    },
    datetimerange(value) {
      console.log(value, "时间范围");
      var trips = value.replace(/-/g, "").replace(/\s+/g, "");
      this.ruleForm.minDate = trips.substring(0, 8);
      this.ruleForm.maxDate = trips.substring(8);
      console.log(this.ruleForm.minDate, "this.ruleForm.createTimeS");
      console.log(this.ruleForm.maxDate, "this.ruleForm.createTimeE");
    }
  }
};
</script>
<style scoped>

</style>



