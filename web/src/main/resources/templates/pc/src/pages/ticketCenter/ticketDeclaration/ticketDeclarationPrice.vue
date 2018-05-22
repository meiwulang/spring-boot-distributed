<template>
  <div class="jdy-content jdy-transfer jl-information fleft">
    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :showBtnInTab="headerData.showBtnInTabFlag" :title="headerData.title"></inner-header>
      <!--jdy-content-trip end-->
        <el-button type="primary" @click="dropoff" icon="plus" class="mb10">添加票价</el-button>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="票价名称" min-width="150px">
              <template scope="scope">
                  <span class="jl-noticeTitle">{{scope.row.apName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="票价类型" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle" v-if="scope.row.apType == 0">单票</span>
              <span class="jl-noticeTitle" v-if="scope.row.apType == 1">套票</span>
            </template>
          </el-table-column>
          <el-table-column label="成本价" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.workdayCostPrice | moneyTwoPoints}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出厂价" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.workdayFactoryPrice | moneyTwoPoints}}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存数量" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle" v-if="scope.row.apStock != -1">{{scope.row.apStock}}</span>
              <span class="jl-noticeTitle" v-if="scope.row.apStock == -1">不限</span>
            </template>
          </el-table-column>
          <el-table-column label="适用时间" min-width="250px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.lifeStartDate}}~{{scope.row.lifeEndDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.updateTime | dateFormat('time')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="primary" @click="editPrice(scope.row.id)" size="mini">编辑</el-button>
              <el-button type="default" @click="deleteTicket(scope.row.id)" size="mini" class="red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->   
        <!--添加票价 弹窗  begin-->
        <jdy-alert title="添加票价" @closeAlert="closeAlert" v-if="refundFlag" class="alertCityList showtfcity refund" style="width:800px;height:700px">
          <div class="produceWrap">
            <el-form :model="produceForm" ref="produceForm" :rules="rules" style="margin-top:10px;" label-width="100px">
              <el-row>
                  <el-col :span="24">
                      <el-form-item label="票价名称：" prop="apName">
                        <el-input v-model="produceForm.apName" :maxlength="50" placeholder="请填写票价名称"></el-input>
                      </el-form-item>
                      <el-form-item label="票价类型：" prop="apType" placeholder="请选择门票类型">
                        <el-select v-model="produceForm.apType" clearable placeholder="请选择门票类型" style="width: 100%;">
                          <el-option :key="value.id" v-for="value in ticketList" :label="value.tName" :value="value.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="价格信息：" class="priceInfo">
                        <span>票价时段：</span>
                        <el-checkbox v-model="showNormalDay">平日</el-checkbox>
                        <el-checkbox v-model="showWeekend">周末</el-checkbox>
                        <el-checkbox v-model="showHolidays">节假日</el-checkbox>
                        <div v-if="showNormalDay">
                          <span class="priceTitle">平日</span>
                          <span class="priceText redstar">预算成本</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.workdayCostPrice"></el-input-number>元
                          <span class="priceText redstar">出厂价</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.workdayFactoryPrice"></el-input-number>元
                        </div>
                        <div v-if="showWeekend">
                          <span class="priceTitle">周末</span>
                          <span class="priceText">预算成本</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.weekendCostPrice"></el-input-number>元
                          <span class="priceText">出厂价</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.weekendFactoryPrice"></el-input-number>元
                        </div>
                        <div v-if="showHolidays">
                          <span class="priceTitle">节假日</span>
                          <span class="priceText">预算成本</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.festivalCostPrice"></el-input-number>元
                          <span class="priceText">出厂价</span><el-input-number :controls="false" :min="0" :max="99999999" v-model="produceForm.festivalFactoryPrice"></el-input-number>元
                        </div>
                      </el-form-item>
                      <el-form-item prop="apStock" label="库存量：">
                          <el-input-number v-model="produceForm.apStock" :controls="false" :min="-1" :max="1000000"></el-input-number><span class="stockText">-1代表无限制</span>
                      </el-form-item>
                      <el-form-item label="有效日期：">
                          <el-date-picker v-model="usefulDate" type="daterange" placeholder="选择票有效日期范围" @change="dateRangeChange"></el-date-picker>
                      </el-form-item>
                      <el-form-item label="价格说明：" prop="ticketProductCode">
                        <el-input type="textarea" :rows="3" :autosize="false" :maxlength="120" v-model="produceForm.remark"></el-input>
                      </el-form-item>
                      <el-form-item label="供应商：" prop="ticketProductCode">
                        <el-input v-model="produceForm.supplier" :maxlength="30" placeholder="请填写供应商"></el-input>
                      </el-form-item>
                      <el-form-item label="联系电话：" prop="ticketProductCode">
                        <el-input v-model="produceForm.supplierTel" placeholder="请填写联系电话"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="alertfoot1 clearfix">
            <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="savePrice('produceForm')">保存</el-button>
            <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
          </div>
        </jdy-alert>
        <!--添加票价 弹窗  end-->
    </div>
  </div>
</template>

<script>
// import lData from './data.js';
import jdyEditor from '@/components/Quilleditor';
import jdyAlert from "@/components/Alert";
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
// 通用tab页
import innerHeader from './header';
export default {
  name: 'line',
  data() {
    return {
      headerData:{
        name:"ticketDeclarationPrice",
        btnFlag:false,
        title:'保存',
        showBtnInTabFlag:false
      },
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      ruleForm:{
        pid:'',
        pageSize: 20,
        currPage: 1,
      },
      tableData:[

      ],
      produceForm:{
      },
      ticketList:[
        {
          id: 0,
          tName: "单票"
        },
        {
          id: 1,
          tName: "套票"
        }
      ],
      showNormalDay:true,
      showWeekend:false,
      showHolidays:false,
      refundFlag:false,
      usefulDate:'',
      btnFlag:false,
      rules: {
        apName: [
          { required: true, message: '请输入票价名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur' }
        ],
        apStock: [
          { required: true, type:"number", message: '请输入库存数量', trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    getTableData(){//获取出厂价列表
      this.ruleForm.pid = this.$route.query.id;
      this.$http.post(api_prefix + '/admission/price-list',this.ruleForm).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.body.resultList;
          this.tableDataTotal = response.data.body.totalNum;
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    dateRangeChange(value){
        if (value) {
            let values = value.split(" - ");
            this.produceForm.lifeStartDate = values[0];
            this.produceForm.lifeEndDate = values[1];
        }
    },
    editPrice(id){
      this.refundFlag = true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
      this.$http.post(api_prefix + '/admission/price-info',id).then(response => {
        if (response.data.code == 0) {
          let data = response.data.body;
          this.produceForm = response.data.body;
          this.usefulDate = [data.lifeStartDate,data.lifeEndDate]
          let dataValue = data.suitRegion.split("")
          console.log(dataValue,'dataValue')
          if(dataValue[0] == 1){
            this.showNormalDay = true;
          }else{
            this.showNormalDay = false;
          }
           if(dataValue[1] == 1){
            this.showWeekend = true;
          }else{
            this.showWeekend = false;
          }
           if(dataValue[2] == 1){
            this.showHolidays = true;
          }else{
            this.showHolidays = false;
          }
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    dropoff(id){
      this.refundFlag = true;
      this.produceForm.apStock = -1;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    savePrice(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
              this.btnFlag = true;
              //手机号码
              let uTel = this.produceForm.supplierTel;
              let rgExps = {
                ExpuContactsPhone: /(?:(\(\+?86\))(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|^(1[3|5|6|8]\d{9})?$/,
              };
              if (!rgExps.ExpuContactsPhone.test(uTel)) {
                this.regexpsAlert("请填写正确的联系方式！");
                this.btnFlag = false;
                return;
              }
              if(this.produceForm.workdayCostPrice == ''){
                this.$message.error("请输入平日预算成本价！");
              }else if(this.produceForm.workdayFactoryPrice == ''){
                this.$message.error("请输入平日出厂价！");
              }else{
                let dataValue = new Array;
                if(this.showNormalDay == true){
                  dataValue[0] = 1
                }else{
                  dataValue[0] = 0
                }
                if(this.showWeekend == true){
                  dataValue[1] = 1
                }else{
                  dataValue[1] = 0
                }
                if(this.showHolidays == true){
                  this.showHolidays = true;
                  dataValue[2] = 1
                }else{
                  this.showHolidays = false;
                  dataValue[2] = 0
                }
                this.produceForm.suitRegion = dataValue.join("")
                this.produceForm.pid = this.$route.query.id;
                this.$http.post(api_prefix + '/admission/save-price', this.produceForm).then(response => {
                  if (response.body.code == 0) {
                    this.btnFlag = false;
                    setTimeout(() => {
                      this.closeAlert();
                      this.getTableData();
                      this.$message.success("保存成功");
                    }, 500);
                    this.produceForm.id = response.body.id[0];
                  } else {
                    this.btnFlag = false;
                    this.defalutErrorMessage(response.body.message);
                  }
                }, response => {
                  this.defalutErrorMessage();
                });
              }
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    closeAlert() {
      //关闭弹窗统一方法
      this.refundFlag = false;
      this.produceForm = {};
      this.showWeekend = false;
      this.showHolidays = false;
      this.usefulDate = ''
      $(".alertbgg").remove();
    },
    //验证提示
    regexpsAlert(info) {
      this.$message({
        showClose: true,
        message: info,
        type: "error"
      });
    },
    deleteTicket(index) {
      //点击删除
      let url = api_prefix + "/admission/delete-price";
      this.$confirm("你确定要删除该票价？", "温馨提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.$http.post(url,index).then(
            response => {
              if (response.data.code == 0) {
                this.getTableData();
                setTimeout(() => {
                  this.$message({
                    showClose: true,
                    message: "删除成功",
                    type: "success"
                  });
                }, 500);
              } else {
                this.$alert(response.data.message);
              }
            },
            response => {
              console.log("出错了");
            }
          );
        })
        .catch(() => {});
    },
    //分页相关
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.currPage = val;
      this.getTableData()
    },
    defalutErrorMessage(message) { //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
  },
  components: { 
    ElInputNumber,
    ElFormItem,
    jdyEditor,
    innerHeader,
    jdyAlert
  },
  mounted(){
    if(this.$route.query.id){
      this.getTableData();
    }
  },
  created(){
    if(this.$route.query.id){
      this.headerData.showBtnInTabFlag = true;
    }
  }
}
</script>
<style lang="less" scoped>
.priceTitle{
  line-height: 30px;
  height: 30px;
  margin: 0 0 15px 10px;
  font-weight: 500;
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
    .priceTitle{
      display: inline-block;
      width: 50px;
    }
  }
}
</style>


