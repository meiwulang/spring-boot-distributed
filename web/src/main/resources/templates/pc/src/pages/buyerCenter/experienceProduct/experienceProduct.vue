<template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <!-- <el-select v-model="ruleform.oBuyerCompanyId">
            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
        </el-select>   -->
        <div class="jdy-tab" v-if="logindata.uDataLimit==3">
          <div class="inlineblock ml10 mt10" >
            <el-select v-model="BuyerCompanyId" placeholder="请选择分公司" clearable >
              <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button @click="searchFn" type="primary" class="ml20 mt10 ">搜索</el-button>
        </div>

      </div>
      <div class="jdy-table">
        <div style="height: 20px;" v-if="logindata.uDataLimit==3"></div>
        <el-table :data="tableData" border style="width: 100%" >
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="aTitle" label="岗位">
            <template scope="scope">
              <!-- <span class="jl-noticeTitle" v-if="tableData.posId == 1">销售总</span>
              <span class="jl-noticeTitle" v-if="tableData.posId == 2">销售总监</span>
              <span class="jl-noticeTitle" v-if="tableData.posId == 3">销售经理</span>
              <span class="jl-noticeTitle" v-if="tableData.posId == 4">签约代理人</span>
              <span class="jl-noticeTitle" v-if="tableData.posId == 5">非销售岗</span> -->
              <span class="jl-noticeTitle">{{scope.row.posName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="areaList" label="需先体验再售卖产品个数">
            <template scope="scope">
              <router-link :to="{ name:'productView',query:{posId:scope.row.posId,companyId:BuyerCompanyId}}">
                <span class="jl-noticeTitle" style="color:#20a0ff">{{scope.row.num}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="aEndTime" label="操作" width="200">
            <template scope="scope">
              <el-button type="default" size="mini" class="mleft0" @click.native.prevent="getProductList(true,scope.row.posId)">配置产品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--jdy-content end-->
    <!-- 配置产品弹层 -->
    <jdy-alert title="配置产品" @closeAlert="closeAlert" v-if="alertFlag" class="alertCityList showtfcity" id="yjk-alert">
      <div class="alertHead">
        <div>
          <div class="inlineblock mr10">
						<el-input placeholder="输入线路编号、线路名称、产品经理搜索" v-model.trim="alertForm.str">
						</el-input>
          </div>
          <div class="inlineblock">
						<el-button type="primary" class="btnInTab" @click="getProductList(false,alertForm.posId)">搜索</el-button>
          </div>
        </div>
        <div>
          <el-button type="primary" class="btnInTab" @click="saveCheckCurrPage(true)">保存</el-button>
        </div>
      </div>
      <div class="alertBody">
        <el-table ref="multipleTable" :data="alertTableData" border @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column label="编号" >
                <template scope="scope">{{ scope.row.pno }}</template>
            </el-table-column>
            <el-table-column label="线路名称" min-width="100px">
                <template scope="scope">
                  {{ scope.row.pname }}
                </template>
            </el-table-column>
            <el-table-column prop="" label="产品经理" >
                <template scope="scope">{{ scope.row.manager }}</template>
            </el-table-column>
            <el-table-column prop="" label="行程天数" >
                <template scope="scope">{{ scope.row.tripDays }}</template>
            </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @current-change="alertPaging" :current-page.sync="alertPages.currentPage" :page-size="alertPages.pageSizeAll" :total="alertPages.tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->
      </div>
    </jdy-alert>
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
      logindata:{uDataLimit:null},
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [
        {
          num: 99,
          posId: 1,
          posName:'销售副总'
        },
        {
          num: 999,
          posId: 2,
          posName:'销售总监'
        },
        {
          num: 999,
          posId: 3,
          posName:'销售经理'
        },
        {
          num: 999,
          posId: 4,
          posName:'签约代理人'
        },
        {
          num: 999,
          posId: 5,
          posName:'非销售岗 '
        }
      ],
      ruleForm: {
        dateRange: [new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1),new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 16)],
        beginDate: dateChange(1),
        endDate: dateChange(16),
        pageSize: 20,
        currPage: 1,
        // oSalerCompanyId:null
      },
      // 弹层-相关数据
      alertForm:{
        currPage:1,
        pageSize:10,
        posId:1,
        str:"",
        companyId:null
      },
      alertTableData:[],
      alertFlag:false,
      alertPages:{
        currentPage:1,
        pageSizeAll:10,
        tableDataTotal:0,
      },
      multipleSelection:[],
      // 单位基础
      BuyerCompanyId:null,
      BuyerCompanyIdArr:[],
    };
  },
  mounted() {
    this.logindata = JSON.parse(sessionStorage.loginData);
//    this.logindata.uDataLimit==3&&this.remote_oBuyerCompanyId();
    this.BuyerCompanyId=this.logindata.uCompanyId;
    this.logindata.uDataLimit==3&&this.getBuyerCompanyId();
    this.getTableData();
  },
  methods: {
    searchFn(){
      this.getTableData();
    },
    getTableData() {
      //更新table数据
      let sendData = {
        companyId :this.BuyerCompanyId
      }
      this.$http
        .post(api_prefix + "pExperience/listPosAndNum",sendData,{ emulateJSON: true })
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
    //系统级查询公司
    getBuyerCompanyId(key){
      this.$http.post(api_prefix + 'Company/index', { pid:343 ,searchType:1, pageIndex: 1, fastSearchStr: $.trim(key)}, { emulateJSON: true }).then(response => {
        if(response.body.code==0){
          this.BuyerCompanyIdArr=response.body.body.list
        }else{

        };
      });
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.currPage = val;
      this.getTableData()
    },
    // 弹层-点击配置产品打开弹层
    setProduct(){
      const This = this;
      this.alertFlag = true;
      this.$nextTick(function(){
          jdyFn.setAlertStyle('showtfcity');
      });
      // 测试选中
    },
    // 弹层-关闭弹窗
    closeAlert(){
      this.alertFlag = false;
      this.alertForm.str="";
      this.alertForm.currPage=1;
      this.alertPages.currentPage=1;
      $('.alertbgg').remove();
    },
    // 弹层-获取配置产品列表接口
    getProductList(flag,posId){
      this.alertForm.posId=posId;
      this.alertForm.companyId = this.BuyerCompanyId;
      this.$http.post(api_prefix + "/pExperience/productConfigList",this.alertForm).then(response=>{
        if (response.data.code == 0) {
          flag&&this.setProduct();
          let data=response.data.body;
          this.alertTableData=data.list;
          this.alertPages.tableDataTotal=data.total;
          // 勾选被选中项
          setTimeout(() => {      //延时选中回显数据
            this.alertTableData.forEach(date => {
              if (date.chosen) {
                this.$refs.multipleTable.toggleRowSelection(date);
              }
            })
          }, 200);
        }else{
          this.$alert(response.data.message, "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      },response => {
        console.log("出错了");
      })
    },
    // 弹层-弹层内分页
    alertPaging(val){
      this.saveCheckCurrPage(false,()=>{
        this.alertForm.currPage = val;
        this.getProductList(false,this.alertForm.posId)
      })
    },
    // 弹层-获取被选择的产品索引
    handleSelectionChange(val){
      this.multipleSelection = val;
      // console.log("当前页选中数据",this.multipleSelection)
    },
    // 弹层-保存当前页的数据
    saveCheckCurrPage(flags,callback){
      // 提取选中数组
      // checkList被选中数组，unCheckList未被选中数组
      let checkList=[],unCheckList=[],pidList=[];
      this.multipleSelection.forEach(value=>{
        checkList.push(value.pid)
      });
      let tempList=this.alertTableData.filter(data=>{
        return checkList.indexOf(data.pid)==-1
      });
      console.log("this.multipleSelection",this.multipleSelection)
      tempList.forEach(value=>{
        unCheckList.push(value.pid)
      });
      checkList.forEach(value=>{
        pidList.push({
          id:value,
          flag:1
        })
      })
      unCheckList.forEach(value=>{
        pidList.push({
          id:value,
          flag:0
        })
      });
      let param={
        currPage:this.alertForm.currPage,
        pageSize:20,
        prods:pidList,
        posId:this.alertForm.posId,
        companyId:this.BuyerCompanyId
      }
      this.$http.post(api_prefix + "/pExperience/configPosProduct",param).then(response=>{
        if (response.data.code == 0) {
          if(flags){
            this.closeAlert();
            this.$message.info("保存成功！");
            this.getTableData()
          }
          if (callback && typeof(callback) === "function") {
              callback();
          }
        }else{
          this.$alert(response.data.message, "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      },response => {
        console.log("出错了");
      })
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
  padding: 10px;
  box-sizing: border-box;
}
/* 弹层样式 */
.alertHead{
  width: 100%-20px;
  height: 40px;
  padding: 10px;
  background: #f9fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap:nowrap;
}
.el-input, .el-input__inner{
  width:90%;
  min-width:300px;
}
.alertBody{
  width: 100%-20px;
  padding: 10px 10px 20px 10px;
}
#yjk-alert{
  width:1000px
}

</style>

