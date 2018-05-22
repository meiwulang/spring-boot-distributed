<template>
  <div class="jl-information">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已预约
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">已订购
            <span></span>
          </a>
          <el-button type="default" class="mt10 btnInTab fright mr10" @click="goBack()">返回</el-button>
        </div>
        <div class="jdy-searchPart">
          <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="80px">
              <el-row style="width: 100%;">
                  <el-form-item label="" label-width="100px">
                      <el-date-picker v-model="ruleForm.dateRange" type="daterange" @change="datetimerange" placeholder="选择时间范围" style="width:100%;">
                      </el-date-picker>
                  </el-form-item>
                  <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
              </el-row>
          </el-form>
        </div>
      </div>
      <div class="jdy-table p10">
        <div class="tableTitle">
            【{{pname}}{{time}}<span v-if="jdytabActive == 1">预约游客</span><span v-if="jdytabActive == 2">订购游客</span>出团计划表】
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
          <thead>
            <tr>
                <th width="10%">日期</th>
                <th width="10%" v-if="jdytabActive == 0">预约/订购</th>
                <th :width="70/(tableData.length + 1)" :key="index" v-for="(item,index) in tableData">{{item.tName}}</th>
                <th width="10%">合计游客人数</th>
            </tr>
          </thead>
          <tbody :key="cindex" v-for="(citem,cindex) in tableDataTwo">
            <tr v-if="jdytabActive != 2">
              <td width="10%">{{ citem.dateStr }}</td>
              <td width="10%" v-if="jdytabActive == 0">预约</td>
              <td :width="70/(tableData.length + 1)" :key="index" v-for="(item,index) in tableData">
                <div>
                  <router-link :to="{ name:'saleDetail',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 1,name:item.tName,id:item.id,time:citem.dateStr,productId:ruleForm.productId,pname:pname,dateRange:ruleForm.dateRange}}">
                    <span style="color:#20a0ff" v-if="citem.reservePlan.ttmap[item.id]">{{citem.reservePlan.ttmap[item.id]}}</span>
                  </router-link>
                  <span style="color:#20a0ff" v-if="!citem.reservePlan.ttmap[item.id]">0</span>
                </div>
              </td>
              <td width="10%">
                <div>
                  <router-link :to="{ name:'saleDetail',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 1,time:citem.dateStr,productId:ruleForm.productId,pname:pname,dateRange:ruleForm.dateRange}}">
                    <span style="color:#20a0ff" v-if="citem.reservePlan.singleTotal">{{citem.reservePlan.singleTotal}}</span>
                  </router-link>
                  <span style="color:#20a0ff" v-if="!citem.reservePlan.singleTotal">0</span>
                </div>
              </td>
            </tr>
            <tr v-if="jdytabActive != 1">
              <td width="10%">{{ citem.dateStr }}</td>
              <td width="10%" v-if="jdytabActive == 0">订购</td>
              <td :width="70/(tableData.length + 1)" :key="index" v-for="(item,index) in tableData">
                <div>
                  <router-link :to="{ name:'saleDetail',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 2,name:item.tName,id:item.id,time:citem.dateStr,productId:ruleForm.productId,pname:pname,dateRange:ruleForm.dateRange}}">
                    <span style="color:#20a0ff" v-if="citem.payPlan.ttmap[item.id]">{{citem.payPlan.ttmap[item.id]}}</span>
                  </router-link>
                  <span style="color:#20a0ff" v-if="!citem.payPlan.ttmap[item.id]">0</span>
                </div>
              </td>
              <td width="10%">
                <div>
                  <router-link :to="{ name:'saleDetail',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 2,time:citem.dateStr,productId:ruleForm.productId,pname:pname,dateRange:ruleForm.dateRange}}">
                    <span style="color:#20a0ff" v-if="citem.payPlan.singleTotal">{{citem.payPlan.singleTotal}}</span>
                  </router-link>
                  <span style="color:#20a0ff" v-if="!citem.payPlan.singleTotal">0</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td width="10%" v-if="jdytabActive == 0"></td>
              <td width="10%">本页合计</td>
              <td :width="70/(tableData.length + 1)" :key="index" v-for="(item,index) in tableData">
                <span v-if="jdytabActive == 0">{{tableDataThree.list['0'].sumMap[item.id].all}}</span>
                <span v-if="jdytabActive == 1">{{tableDataThree.list['0'].sumMap[item.id].reserve}}</span>
                <span v-if="jdytabActive == 2">{{tableDataThree.list['0'].sumMap[item.id].payed}}</span>
              </td>
              <td width="10%">
                <span v-if="jdytabActive == 0">{{tableDataThree.list['0'].sumMap['0'].pageTotalSum}}</span>
                <span v-if="jdytabActive == 1">{{tableDataThree.list['0'].sumMap['0'].pageReserveSum}}</span>
                <span v-if="jdytabActive == 2">{{tableDataThree.list['0'].sumMap['0'].pagePayedSum}}</span>
              </td>
            </tr>
            <tr>
              <td width="10%" v-if="jdytabActive == 0"></td>
              <td width="10%">合计</td>
              <td :width="70/(tableData.length + 1)" :key="index" v-for="(item,index) in tableData">
                <span v-if="jdytabActive == 0">{{tableDataFour.list['0'].sumMap[item.id].all}}</span>
                <span v-if="jdytabActive == 1">{{tableDataFour.list['0'].sumMap[item.id].reserve}}</span>
                <span v-if="jdytabActive == 2">{{tableDataFour.list['0'].sumMap[item.id].payed}}</span>
              </td>
              <td width="10%">
                <span v-if="jdytabActive == 0">{{tableDataFour.list['0'].sumMap['0'].allTotalSum}}</span>
                <span v-if="jdytabActive == 1">{{tableDataFour.list['0'].sumMap['0'].allReserveSum}}</span>
                <span v-if="jdytabActive == 2">{{tableDataFour.list['0'].sumMap['0'].allPayedSum}}</span>
              </td>
            </tr>
          </tfoot>
        </table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->            
      </div>

    </div>
    <!--jdy-content end-->
  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
export default {
  components: {
    jdyAlert
  },
  name: "information",
  data() {
    return {
      time: this.$route.query.beginDate + "———" + this.$route.query.endDate,
      pname: this.$route.query.name,
      groupNone: "groupNone",
      tableData: [],
      tableDataTwo: [],
      tableDataThree: [],
      tableDataFour: [],
      jdytabActive: this.$route.query.jdytabActive,
      ruleForm: {
        productId: this.$route.query.productId,
        dateRange: [parseInt(this.$route.query.dateRange[0]),parseInt(this.$route.query.dateRange[1])],
        beginDate: this.$route.query.beginDate || dateChange(1),
        endDate: this.$route.query.endDate || dateChange(16),
        pageSize: 20,
        currPage: 1,
        flag: ""
      },
      currentPage: 1,
      pageSizeAll: 20,
      tableDataTotal: 0
    };
  },
  mounted() {
    this.getTableData();
    this.getTitle();
    setTimeout(() => {
      //延时
      if (this.ruleForm.dateRange[0] == NaN) {
        this.ruleForm.dateRange = this.$route.query.dateRange;
      }
      console.log(this.ruleForm.dateRange, "dateRange");
    }, 300);
  },
  methods: {
    getTitle() {
      this.$http
        .get(
          api_prefix + "/SchedulePlan/ticketList/" + this.$route.query.productId
        )
        .then(
          response => {
            let data = response.body.body;
            this.tableData = data;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getTableData() {
      //更新table数据
      if (this.$route.query.jdytabActive == 0) {
        this.ruleForm.flag = null;
      }
      if (this.$route.query.jdytabActive == 1) {
        this.ruleForm.flag = 0;
      }
      if (this.$route.query.jdytabActive == 2) {
        this.ruleForm.flag = 1;
      }
      this.$http
        .post(api_prefix + "/SchedulePlan/planList", this.ruleForm)
        .then(
          response => {
            let data = response.body.body;
            // this.tableData = data.pageInfo.list;
            this.tableDataTwo = data.pageInfo.list;
            this.tableDataThree = data.pageTotalInfo;
            // console.log(this.tableDataThree.list[0].sumMap['1'].reserve,'------------------')
            this.tableDataFour = data.totalInfo;
            this.tableDataTotal = data.pageInfo.total;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    datetimerange(value) {
      if (!value) {
        this.ruleForm.beginDate = "";
        this.ruleForm.endDate = "";
      } else {
        console.log(value, "时间范围");
        this.ruleForm.beginDate = value.substring(0, 10);
        this.ruleForm.endDate = value.substring(13);
        console.log(this.ruleForm.beginDate, "this.ruleForm.createTimeS");
        console.log(this.ruleForm.endDate, "this.ruleForm.createTimeE");
      }
    },
    jdytab(index) {
      this.jdytabActive = index;
      console.log(index, "index");
      this.getTableData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, "val");
      this.ruleForm.currPage = val;
      this.getTableData();
    },
    firstSearch() {
      this.getTableData();
    },
    // 返回按钮
      goBack(){
            this.$router.push({name:'groupPlanManage'})
      },
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
  left: 0px;
  right: 0px;
  margin: auto;
}

.gz-smallWidth {
  width: 122px;
}

.gz-largeWidth {
  width: 300px;
}

.jdy-content {
  min-height: initial;
  box-sizing: border-box;
}
/*订单详情下的自定义table*/
.table-custom {
  width: 100%;
  border-top: 1px solid #d7dfe3;
  border-left: 1px solid #d7dfe3;
}
.table-custom th,
.table-custom td {
  border-right: 1px solid #d7dfe3;
  border-bottom: 1px solid #d7dfe3;
  padding: 8px 18px;
  line-height: 24px;
  color: #475669;
  text-align: center;
  vertical-align: middle;
}
.table-custom th {
  background-color: #edf4f8;
}
.table-custom tr.tr-bg td {
  background-color: #f9fafc;
}
.el-table-custom {
  width: 100%;
  border-top: 1px solid #d7dfe3;
  border-left: 1px solid #d7dfe3;
}
/* .el-table-custom th,.el-table-custom td{
  border-right:1px solid #d7dfe3;
  border-bottom:1px solid #d7dfe3;
  padding: 8px;
  line-height: 24px;
  color:#475669;
  text-align: center;
  vertical-align: middle;
} */
.el-table-custom th {
  background-color: #edf4f8;
}
.el-table-custom tr.tr-bg td {
  background-color: #f9fafc;
}
.tableTitle {
  line-height: 36px;
  text-align: center;
  background-color: #edf4f8;
  border-right: 1px solid #d7dfe3;
  border-top: 1px solid #d7dfe3;
  border-left: 1px solid #d7dfe3;
}
</style>

