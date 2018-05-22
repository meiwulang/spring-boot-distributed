<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-form :model="ruleSearchForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-form-item label="单位名称：" prop="uCompanyId" v-show='uDataLimit == 3'>
              <el-select v-model="ruleSearchForm.companyId" clearable placeholder="请选择单位名称" style="width: 100%;">
                <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快速搜索：" prop="quickSearch" class="creditBillSearch">
              <el-input placeholder="昵称/真实姓名" v-model="searchValue" class="search-input-l">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="ml10 btnbg" @click="searchFn">搜索</el-button>
            <el-button type="default" class="ml10" @click="exportFn" :disabled="tableData.length==0 ?true:false">导出</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table pt20">
        <el-table class="table-alignC" :data="tableData" border >
          <el-table-column type='index' label="序号" width="50"></el-table-column>
          <el-table-column label="openId" prop="openId" min-width="250"></el-table-column>
          <el-table-column label="微信名" prop="nickName" min-width="120"></el-table-column>
          <el-table-column label="真实姓名" prop="name" min-width="100"></el-table-column>
          <el-table-column label="手机号码" prop="phone" min-width="110"></el-table-column>
          <el-table-column label="未结佣金" prop="unsettledNum" min-width="100">
            <template scope="scope">
              {{ scope.row.unsettledAmount| moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="已结佣金" prop="settledNum"  min-width="100">
            <template scope="scope">
             {{ scope.row.settledAmount | moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="订单数" prop="qty" min-width="60"></el-table-column>
          <el-table-column label="成交总金额" prop="totalAmount" min-width="120">
            <template scope="scope">
              {{ scope.row.totalAmount | moneyTwoPoints}}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" min-width="80">
            <template scope="scope">
              <router-link :to="{path:'agentReturnDetail',query:{openId:scope.row.openId}}" class="blue-font">查看</router-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
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
import api_prefix from "@/assets/js/apiUrl";

export default {
  name: "agentReturnReport",
  data() {
    return {
      currentPage: 1,
      pageSizeAll: 15,
      tableDataTotal: 0,
      ruleSearchForm: {
        companyId: ""
      },
      searchValue: "",
      tableData: [],
      publicId: "",
      accesstoken: "",
      time: "",
      selectList: [],
      uDataLimit:''
    };
  },
  created() {},
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    this.ruleSearchForm.companyId = JSON.parse(sessionStorage.loginData).uCompanyId;
    this.publicId = JSON.parse(sessionStorage.loginData).appId;
    this.getTableData();
    this.defaultSelectList();
  },
  methods: {
    getSendData() {
      const vm = this;
      let sendData = {
        publicId: vm.publicId,
        curPage: vm.currentPage,
        pageSize: vm.pageSizeAll,
        searchParam: vm.searchValue.trim(),
        companyId: vm.ruleSearchForm.companyId,
      };
      return filterSendData(sendData, "delete");
    },
    //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix.api_prefix + "/Company/index";
      console.log(api_prefix.api_prefix,'api_prefix')
      let data = { pageIndex: 1 ,pid:343 ,searchType:1};
      // if (name) {
      //   data["fastSearchStr"] = $.trim(name);
      // }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body.list;
        this.selectList = listData;
        console.log(this.selectList, "this.selectList");
      });
    },
    exportFn() {
      const vm = this;
      let sendData = {
        publicId: vm.publicId,
        curPage: 1,
        pageSize: 10000,
        searchParam: vm.searchValue.trim(),
        companyId: vm.ruleSearchForm.companyId,
        url: "/zjqd-web/channels/sp/rebate/getRebateList.do"
      };
      let prams = "";
      for (var key in sendData) {
        if (Object.prototype.hasOwnProperty.call(sendData, key)) {
          //过滤
          prams += key + "=" + sendData[key] + "&";
        }
      }
      prams = prams.substring(0, prams.length - 1);
      let url = api_prefix.api_prefix + "exportRebateList?" + prams;
      window.location.href = url;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    searchFn() {
      this.getTableData();
    },
    getTableData() {
      const vm = this;
      let sendData = vm.getSendData();
      sendData.url = "/zjqd-web/channels/sp/rebate/getRebateList.do";
      reportApi.getEncodingParam(sendData).then(response => {
        if (response.data.code == "0") {
          let data = response.data.body;
          if (data.resultList) {
            vm.tableDataTotal = data.rowsCount;
            vm.tableData = data.resultList;
          } else {
            if (response.data.message) {
              // vm.$alert(response.data.message);
            } else {
              vm.$alert("服务器重启");
            }
          }
        } else {
          vm.$alert(response.data.message);
        }
      });
    }
  }
};
</script>
<style scoped>

</style>



