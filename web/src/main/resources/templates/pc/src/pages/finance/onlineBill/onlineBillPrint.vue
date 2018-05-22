<template>
  <div class="jl-sale">
    <div class="jdy-content fleft lv-creditBill">
      <div class="jdy-content-inner">
        <div class="jdy-tab">
          <el-button type="default" class="fright mt10 mr10" @click="printFn">打印</el-button>
        </div>
        <div id="ptintHtml">
          <div class="page-title">【环球视界】在线支付对账单</div>
          <div class="table-wrap">
            <table class="table-txt" cellspacing="0" cellpadding="0">
              <tr>
                <td>凭证编号：</td>
                <td>{{tableData.bBillNo}}</td>
                <td>账单日期：</td>
                <td>{{tableData.createTime | dateFormat}}</td>
              </tr>
              <tr>
                <td>账单金额：</td>
                <td><span v-if="tableData.bAmount">￥{{tableData.bAmount | moneyTwoPoints}}元</span></td>
                <td>打印时间：</td>
                <td>{{nowDate | dateFormat("time")}}</td>
              </tr>
              <tr>
                <td>查 看 者：</td>
                <td>{{uRealName}}</td>
                <td>账单状态：</td>
                <td>
                  <span v-if="tableData.bBillPid == 0 && tableData.bStatus == 3">已提现</span>
                  <span v-if="tableData.bBillPid == 0 && tableData.bStatus == 2">已受理</span>
                  <span v-if="tableData.bBillPid == 0 && tableData.bStatus == 4">已失败</span>
                  <span v-if="tableData.bBillPid == 0 && tableData.bStatus == 1">处理中</span>
                  <span v-if="tableData.bBillPid == 0 && tableData.bStatus == 0">生成</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="table-wrap">
            <table class="table-custom detail-list" cellspacing="0" cellpadding="0">
              <tr>
                <th width="30%">订单号</th>
                <th>付款日期</th>
                <th>游玩日期</th>
                <th>交易金额</th>
                <th>支付手续费</th>
                <th>佣金</th>
                <th>实收金额</th>
              </tr>
              <template v-for="item in tableData.orderPayGroupByCompanyDtos">
                <tr style="background-color:#fbfbfb">
                  <td><strong>{{item.company.cName}}  {{item.company.cPhone}}</strong></td>
                  <td></td>
                  <td>合计：</td>
                  <td><span v-if="item.opPayAmounts">￥</span>{{item.opPayAmounts | moneyTwoPoints}}</td>
                  <td><span v-if="item.bBrokerages">￥</span>{{item.bBrokerages | moneyTwoPoints}}</td>
                  <td><span v-if="item.commissions">￥</span>{{item.commissions | moneyTwoPoints}}</td>
                  <td><span v-if="item.bPayedAmount">￥</span>{{item.bPayedAmount-item.bBrokerages-item.commissions | moneyTwoPoints}}</td>
                </tr>
                <template v-for="childItem in item.orders">
                  <tr>
                    <td>{{childItem.oOrderNo}}
                      <p></p>
                    </td>
                    <td>付款日期</td>
                    <td><p>去：{{childItem.startDate}}</p>
                        <p>回：{{childItem.endDate}}</p>
                    </td>
                    <td><span v-if="childItem.opPayAmounts">￥</span>{{childItem.opPayAmounts | moneyTwoPoints}}</td>
                    <td><span v-if="childItem.bBrokerages">￥</span>{{childItem.bBrokerages | moneyTwoPoints}}</td>
                    <td><span v-if="childItem.commissions">￥</span>{{childItem.commissions | moneyTwoPoints}}</td>
                    <td><span v-if="childItem.bPayedAmount">￥</span>{{childItem.bPayedAmount-childItem.bBrokerages-childItem.commissions | moneyTwoPoints}}</td>
                  </tr>
                </template>
              </template>
              <tr class="tr-bg" style="background-color:#f1ecec;">
                <td></td>
                <td></td>
                <td>总合计：</td>
                <td><span v-if="tableData.bAmount">￥</span>{{tableData.bAmount | moneyTwoPoints}}</td>
                <td><span v-if="tableData.bBrokerage">￥</span>{{tableData.bBrokerage | moneyTwoPoints}}</td>
                <td><span v-if="tableData.commission">￥</span>{{tableData.commission | moneyTwoPoints}}</td>
                <td><span v-if="tableData.bPayedAmount">￥</span>{{tableData.bPayedAmount-tableData.bBrokerage-tableData.commission | moneyTwoPoints}}</td>
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
      tableData: [],
      nowDate: '',
      uRealName: ''
    }
  },
  mounted() {
    this.nowDate = new Date();
    let logindata = JSON.parse(sessionStorage.loginData)
    this.uRealName = logindata.uRealName
    this.getTableData()
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
    //打印
    printFn() {
      const printpage = document.getElementById('ptintHtml');
      jdyFn.printHtml(printpage);
    },
    //获取列表数据
    getTableData() {
      this.$http.post(api_prefix + "/bill/queryOnlineBill/" + 4, { emulateJSON: true }).then(response => {
        if (response.body.code === "-1") {
          this.$alert(response.body.message, '温馨提示', {
            type: 'warning'
          })
          return
        }
        this.tableData = response.body.body
      }, response => {
        console.log('出错了');
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
  margin-bottom: 20px;
  border: 0;
}

.table-txt tr td {
  border: 0;
  padding-top: 20px;
  color: #8691a1;
  line-height: 22px;
}

.table-txt tr td:first-child {
  width: 72px;
}

.table-txt tr td:nth-child(odd) {
  text-align: right;
  min-width: 70px;
  border-color: #fff;
}

.table-txt tr td:nth-child(even) {
  width: 40%;
  border-bottom: 1px solid #bfcbd9;
  padding-left: 5px;
  color: #1f2d3d;
}

.el-input.is-disabled .el-input__inner {
  background-color: #fff;
}

.table-wrap .table-title {
  line-height: 30px;
}

.table-custom td {
  vertical-align: middle;
}

.detail-list tr td {
  text-align: center;
}

.detail-list tr td:first-child {
  text-align: left;
}

.payRecord tr td:first-child {
  text-align: center;
}

.payRecord tr td:last-child {
  text-align: center;
}

.payRecord tr.tr-summary td:first-child {
  border-right: 0;
  text-align: left;
}

.payRecord tr.tr-summary td:nth-child(2) {
  border-right: 0;
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
    margin-bottom: 20px;
    border: 0;
  }
  .table-txt tr td {
    border: 0;
    padding-top: 20px;
    color: #8691a1;
    line-height: 22px;
  }
  .table-txt tr td:first-child {
    width: 80px;
  }
  .table-txt tr td:nth-child(odd) {
    text-align: right;
    min-width: 80px;
    border-color: #fff;
  }
  .table-txt tr td:nth-child(even) {
    width: 35%;
    border-bottom: 1px solid #bfcbd9;
    padding-left: 5px;
    color: #1f2d3d;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
  }
  .table-wrap .table-title {
    line-height: 30px;
  }
  .table-custom td {
    vertical-align: middle;
  }
  .detail-list tr td {
    text-align: center;
  }
  .detail-list tr td:first-child {
    text-align: left;
  }
  .payRecord tr td:first-child {
    text-align: center;
  }
  .payRecord tr td:last-child {
    text-align: center;
  }
  .payRecord tr.tr-summary td:first-child {
    border-right: 0;
    text-align: left;
  }
  .payRecord tr.tr-summary td:nth-child(2) {
    border-right: 0;
  }
  table tr th,
  table tr td {
    padding: 3px 5px;
    font-size: 13px;
  }
  p {
    font-size: 13px;
  }
}
</style>
