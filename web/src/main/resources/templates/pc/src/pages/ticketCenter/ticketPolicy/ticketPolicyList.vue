<template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">待申报
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">已完成
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">销售中
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
                    <el-input placeholder="请输入产品名称、产品编号" v-model="ruleForm.searchString" class=""></el-input>
                  </el-form-item>
                  <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
              </el-row>
          </el-form>
        </div>
      </div>
      <div class="jdy-table p10">
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
              <span>{{scope.row.admissionStatus |filterStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="编辑时间" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.createrTime| dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template scope="scope">
                <el-button type="primary" @click="declaration(scope.row.id)" size="mini" v-show="scope.row.admissionStatus==1">申报确认</el-button>
                <el-button type="primary" @click="entreStore(scope.row.id)" size="mini" v-show="scope.row.admissionStatus==2">入库</el-button>
                <el-button type="primary" @click="outStore(scope.row.id)" size="mini" v-show="scope.row.admissionStatus==3">出库</el-button>
                <el-button type="primary" @click="getStore(scope.row.id)" size="mini" v-show="scope.row.admissionStatus==4">查看库存</el-button>
                <el-button type="primary" @click="editTicket(scope.row.id)" size="mini">配置票价</el-button>
                <!-- <el-button type="primary" @click="editExpand" size="mini">配置扩展</el-button>               -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->        
      </div>

    </div>
    <!--jdy-content end-->
    <!--查看库存记录 弹窗  begin-->
    <jdy-alert title="查看库存记录" @closeAlert="closeAlert" v-if="alertflag" class="alertCityList showtfcity refund" style="width:1000px;">
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
  name: "information",
  data() {
    return {
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [
        // {
        //   tNo: 'SC20180305',
        //   tName: '雪乡梦幻家园门票',
        //   tType: 1,
        //   pManager: '李小鹏',
        //   tStatus: 1,
        //   tTime: '2018-03-24 18:24',
        // }
      ],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      ruleForm: {
        admissionType:null,
        searchString: '',
        pageIndex: 1,
        status:[1,2,3,4]
      },
      //门票类型
      ticketList:[
        {
          id: 0,
          tName: "儿童票"
        },        
        {
          id: 1,
          tName: "成人票"
        }
      ],
      // 库存信息
      alertflag:false,
      stocktableParam:{
        "currPage": 1,
        "pageSize": 20,
        "pid": null     
      }, 
      stockcurrentPage:1,
      stockpageSizeAll:20, 
      stockTableDataTotal:0,           
      stockTableData:[],      
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      //更新table数据
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
    jdytab(index) {
      this.jdytabActive = index;
      switch (index) {
        case null:
          this.ruleForm.status=[1,2,3,4];
          break;
        case 1:
          this.ruleForm.status=[1];
          break;
        case 2:
          this.ruleForm.status=[2,3];
          break;
        case 4:
          this.ruleForm.status=[4];
          break;
      }
      this.getTableData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.pageIndex = val;
      this.getTableData()
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
    //申报
    declaration(id){
      this.$http.get(api_prefix + "admission/base/confirm/"+id).then(response => {
          if(response.body.code==0){
            this.$message.success("申报成功！")
          }else{
            this.$alert(response.body.message)
          }
          this.getTableData();
        },
        response => {
          console.log("出错了");
        }
      );      
    },
    // 入库
    entreStore(id){
      this.$http.get(api_prefix + "admission/base/enterStore/"+id).then(response => {
          if(response.body.code==0){
            this.$message.success("入库成功！")
          }else{
            this.$alert(response.body.message)
          }
          this.getTableData();
        },
        response => {
          console.log("出错了");
        }
      ); 
    },
    // 出库
    outStore(id){
      this.$http.get(api_prefix + "admission/base/outStore/"+id).then(response => {
          if(response.body.code==0){
            this.$message.success("出库成功！")
          }else{
            this.$alert(response.body.message)
          }
          this.getTableData();
        },
        response => {
          console.log("出错了");
        }
      ); 
    },
    // 查看库存
    getStore(id){
      this.alertflag=true;
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
    closeAlert() {
      this.alertflag=false;
      $(".alertbgg").remove();  
    },        
    //编辑票信息
    editTicket(id){
      this.$router.push({ name:'ticketPolicyPriceInfo',query:{id:id}})
    },
    // 编辑扩展
    editExpand(){
      this.$router.push({ name:'ticketPolicyExpandInfo',query:{id:id}})
    },   
    stockCurrentChange(val){
      this.stocktableParam.currPage = val;
      this.getStockTableData()
    },     
  },
  filters:{
    filterStatus(value) {
      var status="";
      switch(value){
          case 0:
            status = "无效";
            break;
          case 1:
            status = "待申报";
            break;
          case 2:
            status = "待入库";
            break;
          case 3:
            status = "已入库";
            break; 
          case 4:
            status = "销售中";
            break;
          case -1:
            status = "删除";
            break;                       
      }
      return status
    }
  },
  components: { 
    jdyAlert,
  },  
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
</style>

