<template>
  <div class="jl-sale">
    <div class="jdy-content fleft lv-creditBill">
      <div class="jdy-content-inner">
        <div>
          <el-button class="fright mt10 mr10">
            <a :href="downLoadHref" download="出团通知书" @click="changeHref">
              导出word
            </a>
          </el-button>
          <el-button class="fright mt10 mr10" @click="printFn">打印</el-button>
          <el-button class="fright mt10 mr10">
            <router-link :to="{name:'sellerOrderAll'}">
            返回
            </router-link>
            </el-button>
        </div>
        <div id="ptintHtml">
          <div class="page-title">{{tableData.oSalerCompanyName}}确认件(此确认件代合同)</div>
          <div class="table-wrap">
            <table class="table-txt" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:45px">甲方：</td>
                <td>{{tableData.oBuyerCompanyName}}</td>
                <td>联系人：</td>
                <td>{{tableData.oBuyerName}}</td>
                <td>联系电话：</td>
                <td>{{tableData.buyerPhone}}</td>
                <td style="width:45px">传真：</td>
                <td>{{tableData.buyerCompanyFax}}</td>
              </tr>
              <tr>
                <td style="width:45px">乙方：</td>
                <td>{{tableData.oSalerCompanyName}}</td>
                <td>联系人：</td>
                <td>{{tableData.oServicer}}</td>
                <td>联系电话：</td>
                <td>{{tableData.oServicerPhone}}</td>
                <td style="width:45px">传真：</td>
                <td>{{tableData.salerCompanyFax}}</td>
              </tr>
            </table>
          </div>
          <p class="el-p">经甲乙双方友好协商，现甲方委托乙方承办甲方所组旅游团队的游览事宜，达成如下协议，烦请仔细审核，核实无误后烦请签字盖章回传确认（本确认件视为业务合同，传真件具有同等法律效力）。订单号： {{tableData.oOrderNo}},协议内容如下：</p>
          <div class="table-wrap">
            <table class="table-custom" cellspacing="0" cellpadding="0">
              <tr>
                <th>线路名称</th>
                <td colspan="5">{{tableData.pNo}}【{{tableData.pName}}】</td>
              </tr>
              <tr>
                <th>发团日期</th>
                <td>{{tableData.sCalendar | dateFormat}}[跟团游]</td>
                <th>参团人数</th>
                <td>{{tableData.touristsNumInfo}}</td>
                <th>车号</th>
                <td>{{tableData.busNumInfo}}</td>
              </tr>
              <tr>
                <th>送团人员</th>
                <td>导游提前一天通知</td>
                <th>联系客服</th>
                <td>{{tableData.oServicer}} - {{tableData.oServicerPhone}}</td>
                <th>集合时间/地点</th>
                <td>{{tableData.lvDepartureTouristsNumInfo}}</td>
              </tr>
              <tr>
                <td colspan="8">
                  <p>
                    <strong>【游客名单】请仔细检查，名单一旦出错，航空公司规定不可更改名字，只能退票后再买，造成损失，我社不予负责。</strong>
                  </p>
                  <template v-for="item in tableData.tourists">
                    <p><span v-if="item.busNo">({{item.busNo}})</span> {{item.otName}} - {{item.otLincese}}
                      <span v-if="item.otType == 0">（成人票）</span>
                      <span v-if="item.otType == 1">（儿童票）</span>- {{item.otPhone}}</p>
                  </template>
                </td>
              </tr>
            </table>
            <table class="table-custom" cellspacing="0" cellpadding="0">
              <tr>
                <th style="width:20%">序号</th>
                <th>费用明细</th>
                <th style="width:20%">合计</th>
              </tr>
            </table>
            <table class="table-custom" cellspacing="0" cellpadding="0" v-for="(priceItem,index) in tableData.priceDetails" style="border-top:none">
              <tr>
                <td style="text-align:center;width:20%">{{index + 1}}</td>
                <td>{{priceItem.opPriceName}}：{{priceItem.opNum}}*{{priceItem.opPrice | moneyTwoPoints}}元/人 ,
                  <span v-if="tableData.sSitType == 0">不对号入座</span>
                  <span v-if="tableData.sSitType == 1">对号入座(系统随机)</span>
                  <span v-if="tableData.sSitType == 2">对号入座(人工选择) </span>
                </td>
                <td class="alignR" style="width:20%">
                  <span v-if="priceItem.opTotalPrice"></span>{{priceItem.opTotalPrice | moneyTwoPoints}}
                </td>
              </tr>
            </table>
            <table class="table-custom" cellspacing="0" cellpadding="0" style="border-top:none">
              <tr>
                <td colspan="2">结算总计：人民币大写：{{tableData.strTotalPrice}}</td>
                <td class="alignR">人民币小写：<span v-if="tableData.totalPrice"></span>{{tableData.totalPrice | moneyTwoPoints}}
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>结账日期: ______年 ______月 ______日</strong>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>备注：{{tableData.oRemark}}</strong>
                </td>
              </tr>
              <tr>

                <td colspan="3">
                  <p>
                    <strong>【行程安排】</strong>
                  </p>
                  <div v-for="tripItem in tableData.trips">
                    <p class="borderStyle">
                      <strong class="mr20">{{tripItem.tripsDay}}: </strong>
                      <strong>[住宿]</strong>{{tripItem.hotelNames}}
                      <strong class="ml20">[住宿备注]</strong>{{tripItem.tHotelRemark}}
                      <strong class="ml20">[用餐]</strong> {{tripItem.mealsInfo}}
                      <strong class="ml20">[用餐备注]</strong>{{tripItem.tMealsRemark}}
                    </p>
                    <p>{{tripItem.tSimpleTrip}}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <p class="mb20">
                    <strong>【费用包含】</strong>
                  </p>
                  <p v-html="tableData.pCostInclude" class="jl-pCostInclude"></p>

                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <p class="mb20">
                    <strong>【费用不包含】</strong>
                  </p>
                  <p v-html="tableData.pCostExclude" class="jl-pCostExclude"></p>

                </td>
              </tr>
              <tr>
                <td colspan="3" class="div2">
                  <div class="borderR">
                    <p>甲方（组团社）盖章：</p>
                    <p class="compName">{{tableData.oBuyerCompanyName}}</p>
                    <p>甲方（组团社）经办人签字： {{tableData.oBuyerName }}</p>
                    <p class="alignR mt10">年
                      <span class="ml20">月</span>
                      <span class="ml20">日</span>
                    </p>
                  </div>
                  <div>
                    <p>乙方（接团社）盖章：</p>
                    <p class="compName">{{tableData.oSalerCompanyName}}</p>
                    <p>乙方（接团社）经办人签字： {{tableData.oServicer}}</p>
                    <p class="alignR mt10">年
                      <span class="ml20">月</span>
                      <span class="ml20">日</span>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

    </div>
    <!--jdy-content end-->
  </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
import orderApi from './../api/index';
export default {
  components: {
    jdyAlert,
    jdyLog
  },
  name: 'information',
  data() {
    return {
      tableData: {
        sCalendar: '',
        trips: [{
          tripsDay: ''
        }]
      },
      downLoadHref: ''
    }
  },
  mounted() {
    this.getTableData();
    const that = this;
    this.$nextTick(function() {
      window.addEventListener('keydown', function(evt) {
        if (!evt.ctrlKey || (evt.key !== 'p' && evt.keyCode !== 80)) { return }
        evt.preventDefault();
        that.printFn();
      })
    })
  },
  methods: {
    changeHref(){
      var id = this.$route.query.id
        this.downLoadHref = api_prefix + '/Order/exportGroupConfirmationForm/'+ id
        console.log(this.downLoadHref,'downLoadHref')
      },
    //打印
    printFn() {
      const printpage = document.getElementById('ptintHtml');
      jdyFn.printHtml(printpage);
    },
    //获取列表数据
    getTableData() {
      const vm = this;
      const sendData = {
        "id": this.$route.query.id
      }
      orderApi.getConfirmationForm(sendData).then((response) => {
        if (response.data.code == '0') {
          let data = response.data.body;
          vm.tableData = data;
          console.log('vm.tableData.sCalendar', vm.tableData.sCalendar)
          var day = vm.tableData.pDays
          console.log(day, 'day')
          var odate = vm.tableData.sCalendar;
          for (let i = 0; i < day; i++) {
            if (i == 0) {
              let date = new Date(odate);
              let oYear = date.getFullYear();
              let oMonth = date.getMonth() + 1;
              let oDay = date.getDate();
              let oHour = date.getHours();
              let oMin = date.getMinutes();
              let oSen = date.getSeconds();
              var oTime = oYear + '年' + getzf(oMonth) + '月' + getzf(oDay) + '日' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
              //补0操作
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = '0' + num;
                }
                return num;
              }
              oTime = oTime.substring(5, 11);
              console.log(oTime, 'oTime1')
              this.tableData.trips[i].tripsDay = oTime;
            } else {
              let ndate = odate + 24 * 60 * 60 * 1000
              let date = new Date(ndate);
              let oYear = date.getFullYear();
              let oMonth = date.getMonth() + 1;
              let oDay = date.getDate();
              let oHour = date.getHours();
              let oMin = date.getMinutes();
              let oSen = date.getSeconds();
              var oTime = oYear + '年' + getzf(oMonth) + '月' + getzf(oDay) + '日' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
              //补0操作
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = '0' + num;
                }
                return num;
              }
              var oTime = oTime.substring(5, 11);
              console.log(oTime, 'oTime2')
              odate = ndate
              console.log(odate,'odate')
              this.tableData.trips[i].tripsDay = oTime;
            }
          }
          // console.log(vm.tableData.trips[i].tripsDay, 'vm.tableData.trips[i].tripsDay')
        } else {
          vm.$alert(response.data.message)
        }
      });
    },
  }
}
</script>

<style scoped>
#ptintHtml {
  padding-top: 30px;
}

.page-title {
  text-align: center;
  font-size: 16px;
  color: #ffa600;
  padding: 10px 0;
}

.table-wrap {
  padding-bottom: 10px;
}

.table-txt {
  width: 100%;
  margin-bottom: 10px;
  border: 0;
  table-layout: fixed;
}

.table-txt tr td {
  border: 0;
  padding-top: 20px;
  color: #8691a1;
  line-height: 22px;
  word-wrap: break-word;
}

.table-txt tr td:nth-child(odd) {
  text-align: right;
  width: 80px;
  border-color: #fff;
}

.table-txt tr td:nth-child(even) {
  padding-left: 5px;
  color: #1f2d3d;
  width: 20%;
}

.table-txt tr td:first-child {
  text-align: left;
  width: 40px;
}

.table-txt tr td:nth-last-child(2) {
  text-align: left;
  width: 40px;
}

.table-txt tr td:last-child {
  width: 15%;
}

.el-p {
  line-height: 26px;
  margin-bottom: 20px;
}

.table-wrap table:first-child tr:last-child td {
  border-bottom: 0;
}

.table-wrap .alignR {
  text-align: right;
}

.table-wrap .borderR {
  border-right: 1px solid #d7dfe3;
}

.table-wrap .borderStyle {
  border-top: 1px solid #d7dfe3;
  border-bottom: 1px dashed #d7dfe3;
}

.table-custom td {
  vertical-align: middle;
}

.table-custom td.div2 {
  overflow: hidden;
  padding: 0;
}

.table-custom td.div2 div {
  box-sizing: border-box;
  width: 50%;
  float: left;
  padding: 8px 20px;
}

@media print {
  #app {
    display: none;
    opacity: 0;
  }
  .page-title {
    text-align: center;
    font-size: 16px;
    color: #ffa600;
    padding: 10px 0;
  }
  .table-wrap {
    padding-bottom: 10px;
  }
  .table-txt {
    width: 100%;
    margin-bottom: 0px;
    border: 0;
    table-layout: fixed;
  }
  .table-txt tr td {
    border: 0;
    padding: 10px 1px;
    color: #8691a1;
    line-height: 22px;
    word-wrap: break-word;
  }
  .table-txt tr td:nth-child(odd) {
    text-align: right;
    width: 80px;
    border-color: #fff;
  }
  .table-txt tr td:nth-child(even) {
    padding-left: 5px;
    color: #1f2d3d;
    width: 25%;
  }
  .table-txt tr td:first-child {
    text-align: left;
    width: 50px;
  }
  .table-txt tr td:nth-last-child(2) {
    text-align: left;
    width: 50px;
  }
  .table-txt tr td:last-child {
    width: 10%;
  }
  .el-p {
    line-height: 26px;
    margin-bottom: 10px;
    margin-top: -15px;
  }
  .table-wrap table:first-child tr:last-child td {
    border-bottom: 0;
  }
  .table-wrap .alignR {
    text-align: right;
  }
  .table-wrap .borderR {
    border-right: 1px solid #d7dfe3;
  }
  .table-wrap .borderStyle {
    border-top: 1px solid #d7dfe3;
    border-bottom: 1px dashed #d7dfe3;
  }
  .table-custom td {
    vertical-align: middle;
  }
  .table-custom td.div2 {
    overflow: hidden;
    padding: 0;
  }
  .table-custom td.div2 div {
    box-sizing: border-box;
    width: 50%;
    float: left;
    padding: 8px 20px;
  }
  table th,
  table td {
    padding: 3px 5px;
    font-size: 13px;
  }
  p {
    font-size: 13px;
  }
}
</style>
