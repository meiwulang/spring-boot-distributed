<template>
  <div class="jdy-content jdy-transfer fleft jl-information">
    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" @savedata="onSubmit('lineForm')" :title="headerData.title"></inner-header>
      <div class="jdy-table p10">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="票价名称" min-width="150px">
              <template scope="scope">
                <span>{{scope.row.apName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="票价类型" min-width="350px">
            <template scope="scope">
              {{scope.row.apType == 0?"单票":"套票"}}     
            </template>
          </el-table-column>
          <el-table-column label="成本价" min-width="150px">
            <template scope="scope">
              {{scope.row.workdayCostPrice |moneyTwoPoints}}
            </template>
          </el-table-column>
          <el-table-column label="出厂价" min-width="150px">
            <template scope="scope">
              {{scope.row.workdayFactoryPrice |moneyTwoPoints}}
            </template>
          </el-table-column>
          <el-table-column label="销售价" min-width="150px"> 
            <template scope="scope">
              <span>{{scope.row.workdaySalePrice |moneyTwoPoints}}</span>
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
          <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button type="primary" @click="editPrice(scope.row.id)" size="mini">编辑</el-button>
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
      <!--jdy-content-trip end-->
    </div>
    <!--添加票价 弹窗  begin-->
    <jdy-alert title="添加票价" @closeAlert="closeAlert" v-if="alertflag" class="alertCityList showtfcity refund" style="width:800px;height:700px">
      <div class="produceWrap">
        <el-form :model="priceInfo" ref="priceInfo" style="margin-top:10px;" label-width="100px">
          <el-row>
              <el-col :span="24">
                  <el-form-item label="票价名称：" prop="ticketProductCode">
                    <el-input v-model="priceInfo.apName" :disabled="readOnly"></el-input>
                  </el-form-item>
                  <el-form-item label="票价类型：" prop="ticketProductType" placeholder="请选择门票类型">
                    <el-select v-model="priceInfo.apType"  :disabled="readOnly" placeholder="请选择门票类型" style="width: 100%;">
                      <el-option :key="value.id" v-for="value in ticketList" :label="value.tName" :value="value.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="价格信息：" prop="ticketProductCode" class="priceInfo">
                    <span>票价时段：</span>
                    <el-checkbox v-model="showNormalDay" :disabled="readOnly">平日</el-checkbox>
                    <el-checkbox v-model="showWeekend" :disabled="readOnly">周末</el-checkbox>
                    <el-checkbox v-model="showHolidays" :disabled="readOnly">节假日</el-checkbox>
                    <div v-if="showNormalDay">
                      <span class="priceTitle">平日</span>
                      <span class="priceText">预算成本</span>
                      <el-input v-model="priceInfo.workdayCostPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText">出厂价</span>
                      <el-input v-model="priceInfo.workdayFactoryPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText redstar">销售价</span>
                      <el-input-number :controls="false" :min="0" :max="99999999" v-model="priceInfo.workdaySalePrice"></el-input-number>元                        
                    </div>
                    <div v-if="showWeekend">
                      <span class="priceTitle">周末</span>
                      <span class="priceText">预算成本</span>
                      <el-input v-model="priceInfo.weekendCostPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText">出厂价</span>
                      <el-input v-model="priceInfo.weekendFactoryPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText redstar">销售价</span>
                      <el-input-number :controls="false" :min="0" :max="99999999" v-model="priceInfo.weekendSalePrice"></el-input-number>元                        
                    </div>
                    <div v-if="showHolidays">
                      <span class="priceTitle">节假日</span>
                      <span class="priceText">预算成本</span>
                      <el-input v-model="priceInfo.festivalCostPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText">出厂价</span>
                      <el-input v-model="priceInfo.festivalFactoryPrice" :disabled="readOnly"></el-input>元
                      <span class="priceText redstar">销售价</span>
                      <el-input-number :controls="false" :min="0" :max="99999999" v-model="priceInfo.festivalSalePrice"></el-input-number>元                      
                    </div>
                  </el-form-item>
                  <el-form-item label="有效日期：" class="redstar">
                      <el-date-picker v-model="usefulDate" type="daterange" placeholder="选择票有效日期范围" @change="dateRangeChange"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="价格说明：" prop="ticketProductCode">
                    <el-input type="textarea" :rows="3" :autosize="false" :maxlength="120" v-model="priceInfo.remark"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="savePrice('priceInfo')">保存</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
      </div>
    </jdy-alert>
    <!--添加票价 弹窗  end-->
  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
// 通用tab页
import innerHeader from './header';
export default {
  name: 'line',
  data() {
    return {
      headerData:{
        name:"ticketPolicyPriceInfo",
        btnFlag:false,
      },
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,      
      lineForm:{
        "id": 0,
        "market1stRebate": null,
        "market2ndRebate": null,
        "market3rdRebate": null,
        "marketPrice": null,
        "peer1stRebate": null,
        "peer2ndRebate": null,
        "peer3rdRebate": null,
        "peerPrice": null,
        "pid": 0,
        "remark": null,
        "supporter": null,
        "supporterTel": null,
        "currPage":1,
      },
      tableParam:{
        "currPage": 1,
        "pageSize": 20,
        "pid": this.$route.query.id || 7       
      },
      btnFlag:false,
      rules: {

      },
      priceInfo:{},
      alertflag:false,
      showNormalDay:true,
      showWeekend:true,
      showHolidays:true,
      usefulDate:"",
      readOnly:true,
      tableData:[],
      ticketList:[
        {
          id: 1,
          tName: "单票"
        },
        {
          id: 0,
          tName: "套票"
        }
      ],      
    }
  },
  methods: {
    getTableData(){
      this.$http.post(api_prefix + 'admission/price-list',this.tableParam).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.body.resultList;
          this.tableDataTotal=response.data.body.totalNum
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    editPrice(id){
      this.alertflag=true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });   
      this.$http.post(api_prefix + 'admission/price-info',id || 1).then(response => {
        if (response.body.code == 0) {
          let data = response.data.body;
          this.priceInfo = response.data.body;
          this.usefulDate = [data.lifeStartDate,data.lifeEndDate]
          let dataValue = data.suitRegion.split("");      
          this.showNormalDay=dataValue[0] == 1?true:false;
          this.showWeekend=dataValue[1] == 1?true:false;
          this.showHolidays=dataValue[2] == 1?true:false;
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        this.defalutErrorMessage();
      });      
    },
    dateRangeChange(value){
        if (value) {
            let values = value.split(" - ");
            this.priceInfo.lifeStartDate = values[0];
            this.priceInfo.lifeEndDate = values[1];
            // todo
        }
    },    
    savePrice(formName){     
      if(!this.priceInfo.lifeStartDate && !this.priceInfo.lifeStartDate ){
        return this.$message.info("请选择日期区间！")
      }
      if(this.showNormalDay && !this.priceInfo.workdaySalePrice ){
        return this.$message.info("请录入平日销售价！")
      }
      if(this.showWeekend && !this.priceInfo.weekendSalePrice ){
        return this.$message.info("请录入周末销售价！")
      }
      if(this.showHolidays && !this.priceInfo.festivalSalePrice ){
        return this.$message.info("请录入节假日销售价！")
      }                  
      this.$refs[formName].validate((valid) => {
        if (valid) {
              this.$http.post(api_prefix + 'admission/save-price', this.priceInfo).then(response => {
                if (response.body.code == 0) {
                  this.$message.success("保存成功");
                  this.closeAlert();
                  this.getTableData();                      
                } else {
                  this.$alert(response.data.message)
                }
              }, response => {
                this.defalutErrorMessage();
              });

        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    //读取成本价
    getCost(){
      this.$http.post(api_prefix + 'admission/cost-info',this.$route.query.id).then(response => {
        if (response.data.code == 0) {
          let data=response.data.body;
          this.costPrice = data.costPrice;
          this.lineForm.id=data.id;
          this.lineForm.pid=data.pid;
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    // 读取价格信息
    getPrice(){
      this.$http.post(api_prefix + 'admission/price-info',this.$route.query.id).then(response => {
        if (response.data.code == 0) {
          if(response.data.body){

          }
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    defalutErrorMessage(message) { //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
    handleCurrentChange(val){
      this.tableParam.currPage = val;
      this.getTableData()
    },
    closeAlert(){
      this.alertflag=false;
      $(".alertbgg").remove();      
    }
  },
  components: { 
    jdyAlert,
    innerHeader
  },
  mounted(){
    this.getTableData();
  }
}
</script>
<style lang="less" scoped>
.priceTitle{
  line-height: 30px;
  height: 30px;
  margin: 0 0 15px 10px;
  font-weight: 500;
  text-align: center;
  font-size: 16px;
}
.formcenter{
    width: 70%;
    min-width: 600px;
    margin: 0 auto;
}
.produceWrap{
  padding: 10px;
  overflow-y: scroll;
  height: 575px;
  .stockText{
    margin-left: 15px;
    color: #bfcbd9
  }
  .priceInfo{
    margin-bottom: 10px;
    .priceText{
      margin-left: 15px;
      display: inline-block;
      width: 70px;
      text-align: right;
    }
    .redstar:before{
      content: '*';
      color: #ff4949;
      margin-right: 4px;
    }
    .el-input-number{
      width: 70px;
      margin: 0 10px;
    }
    .el-input{
      width: 70px;
      margin: 0 10px;
    }
    .priceTitle{
      display: inline-block;
      width: 50px;
    }
  }
}
</style>


