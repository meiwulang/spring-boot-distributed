<template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">未上架
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">已上架
            <span></span>
          </a>
          <el-button type="default" class="fr mt10 mr10 btnInTab" @click="refreshBtn">
            刷新
          </el-button>                             
        </div>
        <div class="jdy-searchPart">
          <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px">
              <el-row style="width: 100%;">
                  <el-form-item>
                    <el-select v-model="ruleForm.admissionType" clearable placeholder="请选择门票类型" style="width: 100%;">
                      <el-option :key="value.id" v-for="value in ticketList" :label="value.tName" :value="value.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" label-width="100px">
                    <el-input placeholder="请输入产品名称、产品编号" v-model.trim="ruleForm.searchString" class=""></el-input>
                  </el-form-item>
                  <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
              </el-row>
          </el-form>
        </div>
      </div>
      <div class="jdy-table p10 jl-onlinebill">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="产品编号" min-width="150px">
              <template scope="scope">
                  <span class="jl-noticeTitle">{{scope.row.ticketProductCode}}</span>
              </template>
          </el-table-column>
          <el-table-column label="产品名称" min-width="350px">
            <template scope="scope">
              <div style="text-align:left;padding:10px 0 10px 30px;">
              <span>{{scope.row.ticketProductName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门票类型" min-width="150px">
            <template scope="scope">
              <span>{{scope.row.ticketProductType==0?"儿童票":"成人票"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品经理" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.productManagerName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="150px"> 
            <template scope="scope">
              <span>{{scope.row.admissionStatus | filterStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="编辑时间" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.createrTime| dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template scope="scope">
              <el-button type="primary" @click="upTicket(scope.row.id)" size="mini" v-if="scope.row.admissionStatus == 3">上架</el-button>
              <el-button type="primary" @click="offTicket(scope.row.id)" size="mini" v-if="scope.row.admissionStatus == 4">下架</el-button>
                <!-- <el-button type="primary" @click="consumeDeatil(scope.row.id)" size="mini">查看消耗</el-button> -->
              <el-button type="primary" @click="stockDetail(scope.row.id)" size="mini">查看库存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看消耗记录 弹窗  begin-->
    <jdy-alert title="查看消耗记录" @closeAlert="closeAlert" v-if="consume.flag" class="alertCityList showtfcity refund" style="width:1000px;">
      <div class="produceWrap">
        <el-form :model="consume" ref="consume" style="margin-top:10px;">
          <el-row>
              <el-col :span="20">
                  <el-form-item>
                      <el-date-picker v-model="usefulDate" type="daterange" placeholder="选择票生产日期范围" @change="dateRangeChange"></el-date-picker>
                  </el-form-item>
                  <el-button type="primary" @click="searchProduce()" size="small">查看生产记录</el-button>
              </el-col>
          </el-row>
        </el-form>
        <el-table :data="produceData" border show-summary class="all produceList">
          <el-table-column label="门票名称" min-width="250px">
            <template scope="scope">
              <div style="text-align:left;padding:10px 0 10px 30px;">
              <span>【{{scope.row.ticketProductCode}}】{{scope.row.ticketProductName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品经理" min-width="100px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.productManagerName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="produceNum" min-width="100px" sortable>
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.produceNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100px">
            <template scope="scope">
              <span class="jl-noticeTitle" v-if="scope.row.pStatus == 0">已上架</span>
              <span class="jl-noticeTitle" v-if="scope.row.pStatus == 1">已下架</span>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.createrTime | dateFormat}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="produceHandleCurrentChange" :current-page.sync="produceCurrentPage" :page-size="producePageSizeAll" :total="stockTableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->
      </div>
    </jdy-alert>
    <!--查看消耗记录 弹窗  end--> 
    <!--查看库存记录 弹窗  begin-->
    <jdy-alert title="查看库存记录" @closeAlert="closeAlert" v-if="stock.flag" class="alertCityList showtfcity refund" style="width:1000px;">
      <div class="produceWrap">
        <el-table :data="stockTableData" border style="width: 100%">
          <el-table-column label="票价名称" min-width="120px">
              <template scope="scope">
                <span>{{scope.row.apName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="票价类型" min-width="80px">
            <template scope="scope">
              {{scope.row.apType == 0?"单票":"套票"}}     
            </template>
          </el-table-column>
          <el-table-column label="库存数量" > 
            <template scope="scope">
              <span>{{scope.row.apStock==-1?"无限制":scope.row.apStock}}</span>
            </template>
          </el-table-column>  
          <el-table-column label="适用时间" min-width="200px">
            <template scope="scope">
              {{scope.row.lifeStartDate}}~{{scope.row.lifeEndDate}}
            </template>
          </el-table-column>                  
          <el-table-column label="操作时间" min-width="200px">
            <template scope="scope">
              {{scope.row.updateTime | dateFormat('time')}}
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="stockCurrentChange" :current-page.sync="stockcurrentPage" :page-size="stockpageSizeAll" :total="stockTableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->
      </div>
    </jdy-alert>
    <!--查看库存记录 弹窗  end-->         
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
      currentPage:1,
      produceCurrentPage:1,
      pageSizeAll:20,
      tableData: [],

      producePageSizeAll:20,
      tableDataTotal:0,
      
      refundFlag:false,
      
      // 库存记录列表
      stockcurrentPage:1,
      stockpageSizeAll:20, 
      stockTableDataTotal:0,
      stocktableParam:{
        "currPage": 1,
        "pageSize": 20,
        "pid": this.$route.query.id       
      },             
      stockTableData:[],
      // 消耗记录列表
      consumecurrentPage:1,
      consumeproduceCurrentPage:1,
      consumepageSizeAll:20,  
      consumeTableDataTotal:0,     
      consumeTableData:[],

      produceData:[],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      usefulDate:'',
      admissionBaseId:'',
      ruleForm: {
        admissionType:null,
        status:[3,4],//销售状态 0:已上架 1:已下架 ,
        searchString: '',
        pageSize: 20,
        pageIndex: 1,
      },
      consume: {
        flag:false,
        admissionBaseId:'',
        searchEndDate:'',
        searchStartDate:'',
      },
      stock: {
        flag:false,
        admissionBaseId:'',
        searchEndDate:'',
        searchStartDate:'',
      },      
      //门票类型
      ticketList:[
        {
          id: 1,
          tName: "成人票"
        },
        {
          id: 0,
          tName: "儿童票"
        }
      ],
    
    };
  },
  mounted() {
    this.getTableData();
  },
  filters:{
    filterStatus(value) {
      var status="";
      switch(value){
          case 0:
            status = "无效";
            break;
          case 1:
            status = "已提交";
            break;
          case 2:
            status = "已完成";
            break;
          case 3:
            status = "未上架";
            break; 
          case 4:
            status = "已上架";
            break;
          case -1:
            status = "删除";
            break;                       
      }
      return status
    }
  },
  methods: {
    getTableData() {
      this.$http.post(api_prefix + "admission/base/list", this.ruleForm).then(response => {
          let data = response.body.body;
          if (response.body.code == 0){
            this.tableData = data.list;
            this.tableDataTotal = data.total;          
          }else{
            this.$alert(data.message)
          }     
        },
        response => {
          console.log("出错了");
        }
      );
    },
    consumeDeatil(id){
      this.consume.flag=true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    stockDetail(id){
      this.stock.flag=true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
      this.stocktableParam.pid=id;
      this.getStockTableData();
    },
    getStockTableData(){
        this.$http.post(api_prefix + 'admission/price-list',this.stocktableParam).then(response => {
          if (response.data.code == 0) {
            this.stockTableData = response.data.body.resultList;
            this.stockTableDataTotal=response.data.body.totalNum
          } else {
            this.$alert(response.data.message)
          }
        }, response => {
          console.log('出错了');
        }); 
    },
    stockCurrentChange(val){
      this.stocktableParam.currPage = val;
      this.getStockTableData()
    },
    getProduceData(val) {
      this.consume.admissionBaseId = val;
      //更新table数据
      this.$http
        .post(api_prefix + "/admission/produce/list", this.consume)
        .then(
          response => {
            let data = response.body.body;
            this.produceData = data;
            this.stockTableDataTotal = data.total;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    jdytab(index) {
      this.jdytabActive = index;
      if(index == null){
        this.ruleForm.status = [3,4];
      }else{
        this.ruleForm.status = [index];
      }
      this.getTableData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.currPage = val;
      this.getTableData()
    },
    produceHandleCurrentChange(val){
      this.consume.currPage = val;
      this.getProduceData()
    },
    firstSearch(){
        this.getTableData();
    },
    //刷新页面
    refreshBtn() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
        this.getTableData();
      }, 1000);
    },
    dropoff(id){
      this.refundFlag = true;
      this.getProduceData(id)
      this.admissionBaseId = id;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    searchProduce(){
      this.getProduceData(this.admissionBaseId)
    },
    dateRangeChange(value){
      if (value) {
          let values = value.split(" - ");
          this.consume.searchStartDate = values[0];
          this.consume.searchEndDate = values[1];
      }
    },
    closeAlert() {
      this.stock.flag=false;
      this.consume.flag=false;
      $(".alertbgg").remove();  
    },
    openStock(){
      this.stock.flag=true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    openConsume(){
      this.consume.flag=true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    upTicket(id){
      this.$http.get(api_prefix + 'admission/base/startSales/' + id).then(response => {
          if (response.data.code == 0) {
              this.$message({
              showClose: true,
              message: "上架成功",
              type: "success"
            });
            this.getTableData();
          } else {
            this.$alert(response.data.message)
          }
        }, response => {
          console.log('出错了');
        }); 
    },
    offTicket(id){
      this.$http.get(api_prefix + 'admission/base/stopSales/' + id).then(response => {
          if (response.data.code == 0) {
              this.$message({
              showClose: true,
              message: "下架成功",
              type: "success"
            });
            this.getTableData();
          } else {
            this.$alert(response.data.message)
          }
        }, response => {
          console.log('出错了');
        });
    }
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
.orderout{
  margin: 10px -10px 0 0;
}
.produceWrap{
  padding: 10px;
}
.produceList{
  height: 400px;
  overflow-y: scroll;
}
</style>

