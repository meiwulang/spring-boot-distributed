<template>
  <div class="jdy-resources fleft jdy-content">
    <!-- <div class="jdy-content jdy-transfer fleft jl-ad"> -->
      <div class="jdy-content-inner-trip">
          <div class="resources-tab">
				<div>
					<div class="inlineblock mr10 ">
					</div>
				</div>
				<div>
          <el-button type="default" @click="firstSearch" class="btnInTab">返回</el-button>
          <el-button type="default" class="btnInTab">
              <a :href="downLoadHref" download="出团计划管理" @click="changeHref" style="color:#000000">
                  导出取消名单
              </a>
          </el-button>
				</div>
            </div>
      </div>
      <div class="jdy-table jdy-table-padding">
        <el-table :data="tableData" ref="multipleTable" border style="width: 100%" @selection-change="cancelList">
          <el-table-column type="selection" width="55" >

          </el-table-column>
          <el-table-column label="状态">
              <template scope="scope">
                  <span class="jl-noticeTitle" v-if="scope.row.status == 0">正常</span>
                  <span class="jl-noticeTitle" v-if="scope.row.status == 1">已取消</span>
              </template>
          </el-table-column>
          <el-table-column prop="aTitle" label="票价类目">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.tCategory}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="areaList" label="票种">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.tName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aEndTime" label="游客姓名" width="100">
            <template scope="scope">
              <span>{{scope.row.touristName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="游客电话">
            <template scope="scope">
                <span>{{scope.row.touristTel}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="票价">
            <template scope="scope">
                <span>{{scope.row.tPrice | moneyTwoPoints}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="订单号" min-width="190">
            <template scope="scope">
                <span>{{scope.row.orderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="支付时间" min-width="130">
            <template scope="scope">
                <span>{{scope.row.payTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="取消原因">
            <template scope="scope">
                <span>{{scope.row.cancelReason}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="操作">
            <template scope="scope">
                <el-button type="default" class="red" size="mini" @click="goCancel(scope.row.id)" v-if="scope.row.status == 0">
                    取消
                </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--上传支付凭证 弹窗  begin-->
    <jdy-alert title="取消客人" @closeAlert="closeAlert" v-if="cancelFlag" class="alertCityList showtfcity" style="width:600px;height:180px">
        <el-form class="" :model="ruleform" ref="lineForm" label-width="100px" style="margin-top:20px;">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="取消原因：">
                      <el-select v-model="ruleform.cancelReason">
                            <el-option :key="1" label="客人退团" value="客人退团">
                            </el-option>
                            <el-option :key="2" label="取消团期" value="取消团期">
                            </el-option>
                            <el-option :key="3" label="超售" value="超售">
                            </el-option>                            
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
      </el-form>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        <el-button class="fright mt10 mr10" @click="cancelUser">确定</el-button>
      </div> 
    </jdy-alert>
    <!--上传支付凭证 弹窗  end-->
        <div class="clearfix">
            <el-button class="fright mt10" @click="goCancelList">取消客人</el-button>
        </div>
        <!-- 分页   begin-->
        <div class="clearfix">
            <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
            </el-pagination>
        </div>
        <!-- 分页end-->
      </div>
    <!-- </div> -->
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
      cancelFlag:false,
      downLoadHref: '',
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [],
      ruleform:{
          cancelReason:''
      },
      cancelIdList:[]
    };
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    this.getTableData();
    // this.defaultSelectList();
  },
  methods: {
    changeHref(){
      var scheduleId = this.$route.query.id
        this.downLoadHref = api_prefix + '/Order/exportCancelTourists'+ 
        '?scheduleId=' + scheduleId
        console.log(this.downLoadHref,'downLoadHref')
      },
    getTableData() {
      //更新table数据
      this.$http
        .post(api_prefix + '/Schedule/guestList/',{
            id: this.$route.query.id,
            currPage:this.currentPage,
            pageSize:20
        })
        .then(
          response => {
            let data = response.body.body;
            this.tableData = data.list;
            this.tableDataTotal = data.total
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.currentPage = val;
      this.getTableData()
    },
    goCancel(id){
        this.cancelIdList = [];
        this.cancelIdList.push(id);
        this.cancelFlag = true;
        console.log(this.cancelIdList,'this.cancelIdList')
    },
    goCancelList(){
        this.cancelFlag = true;
        console.log(this.cancelIdList,'this.cancelIdList222')
    },
    firstSearch(){
        this.$router.push({ name: "groupManage" });
    },
    //取消
    cancelUser(){
      if(this.ruleform.cancelReason == ''){
        this.$message.error("请选择取消原因");
        return;
      }
      if(this.cancelIdList == ''){
        this.$message.error("请选择客人");
        return;
      }
        this.btnFlag = true;
        this.$http
        .post(api_prefix + '/Schedule/batchCancelTourist/',{
            touristIds:this.cancelIdList,
            remark:this.ruleform.cancelReason
        })
        .then(
          response => {
            this.btnFlag = false;
            this.$message.success("取消游客成功");
            setTimeout(()=>{
                this.closeAlert()
                this.getTableData();
                this.cancelIdList = [];
            },500)
          },
          response => {
            this.btnFlag = false;
            console.log("出错了");
          }
        );
    },
    cancelList(val){
        console.log(val,'val')
        if(val){
            this.cancelIdList = [];
            for( let k = 0; k < val.length; k++){
                if(val[k].status == 1){
                    this.$message.error("请勿选择已取消的客人");
                    this.$refs.multipleTable.clearSelection();
                }else{
                    var arry = []
                    arry.push(val[k].id)
                    for( let j=0; j<arry.length; j++){
                        if(this.cancelIdList.indexOf(arry[j])==-1){
                            this.cancelIdList.push(arry[j])
                        }
                    }
                    console.log(this.cancelIdList,'this.cancelIdList')
                }
            }
        }else{
            console.log(this.cancelIdList,'this.cancelIdList2')
        }
    },
    closeAlert() {
      //关闭弹窗统一方法
      this.btnFlag = false;
      this.cancelFlag = false;
      this.ruleform.cancelReason = ''
      $(".alertbgg").remove();
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
.jdy-table-padding {
    padding: 10px 10px 20px 10px;
}
</style>

