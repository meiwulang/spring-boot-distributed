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
          <div class="page-header">
            <div>
              <h1>出团通知书</h1>
              <h3>{{tableData.oBuyerCompanyName}}</h3>
              <p>电话：{{tableData.buyerCompanyTel}}</p>
              <p>地址：{{tableData.salerCompanyAddress}}</p>
            </div>
            <div>
              <image src="" />
            </div>
          </div>
          <div class="table-wrap">
            <table class="table-custom" cellspacing="0" cellpadding="0">
              <tr>
                <th>线路名称</th>
                <td colspan="3">{{tableData.pName}}</td>
              </tr>
              <tr>
                <th>组团社名称</th>
                <td>{{tableData.oBuyerCompanyName}}</td>
                <th>组团联系人</th>
                <td>{{tableData.oBuyerName}}</td>
              </tr>
              <tr>
                <th>组团社电话</th>
                <td>{{tableData.buyerCompanyTel}}</td>
                <th>组团社手机</th>
                <td>{{tableData.buyerPhone}}</td>
              </tr>
              <tr>
                <th>出发日期</th>
                <td>{{tableData.sCalendar | dateFormat}}</td>
                <th>返程日期</th>
                <td>{{tableData.sCalendarBack | dateFormat}}</td>
              </tr>
              <tr>
                <th>游客名单</th>
                <td colspan="3">
                  <template v-for="item in tableData.tourists">
                    <p>{{item.otName}} - {{item.otLincese}}
                      <span v-if="item.otType == 0">（成人票）</span>
                      <span v-if="item.otType == 1">（儿童票）</span>- {{item.otPhone}}</p>
                  </template>
                </td>

              </tr>
              <tr>
                <th>游客明细</th>
                <td colspan="3">{{tableData.touristsNumInfo}}</td>

              </tr>
              <tr>
                <th>座位分布</th>
                <td colspan="3">
                  <span v-if="tableData.sSitType == 0">不对号入座</span>
                  <span v-if="tableData.sSitType == 1">对号入座(系统随机)</span>
                  <span v-if="tableData.sSitType == 2">对号入座(人工选择) </span>
                </td>

              </tr>
              <tr>
                <th>当团导游</th>
                <td colspan="3">导游提前一天通知 　</td>
              </tr>
              <tr>
                <th>全陪信息</th>
                <td colspan="3">导游提前一天通知 </td>
              </tr>
              <tr>
                <th>接送信息(去)</th>
                <td colspan="3">{{tableData.lvStopsTouristsNumInfo}}</td>

              </tr>
              <tr>
                <th>接送信息(返)</th>
                <td colspan="3">{{tableData.rtStopsTouristsNumInfo}}</td>

              </tr>
              <tr>
                <th>游客联系人</th>

                <td colspan="3"><p>{{tableData.tourists[0].otName}} - {{tableData.tourists[0].otPhone}}</p></td>
              </tr>
            </table>
          </div>
          <div class="table-wrap table2">
            <table class="table-custom" cellspacing="0" cellpadding="0">
              <template v-for="tripItem in tableData.trips">
                <tr>
                  <th class="blue-font">
                    <strong>{{tripItem.tripsDay}} {{tripItem.tFromTo}}</strong>
                  </th>
                </tr>
                <tr>
                  <td><p v-html="tripItem.tDetailTrip"></p></td>
                </tr>
                <tr>
                  <td class="div2">
                    <div class="borderR">
                      <strong>用餐：</strong> {{tripItem.mealsInfo}}  <strong class="ml20">[用餐备注]</strong>{{tripItem.tMealsRemark}}</div>
                    <div>
                      <strong>住宿：</strong> {{tripItem.hotelNames}} <strong class="ml20">[住宿备注]</strong>{{tripItem.tHotelRemark}}</div>
                  </td>
                </tr>
              </template>
              <tr>
                <th>线路特色</th>
              </tr>
              <tr>
                <td><p v-html="tableData.pSpecial" class="jl-pCostInclude"></p></td>
              </tr>
              <tr>
                <th>预订须知</th>
              </tr>
              <tr>
                <td><p v-html="tableData.pNotes" class="jl-pCostInclude"></p></td>
              </tr>
              <tr>
                <th>费用说明</th>
              </tr>
              <tr>
                <td>
                  <p>
                    <strong>【费用包含】</strong>
                  </p>
                  <p v-html="tableData.pCostInclude" class="jl-pCostInclude"></p>
                  <p>
                    <strong>【费用不含】</strong>
                  </p>
                  <p v-html="tableData.pCostExclude" class="jl-pCostExclude"></p>

                </td>
              </tr>
              <tr>
                <th>温馨提醒</th>
              </tr>
              <tr>
                <td>
                  <p>1.游客报名时，请务必提供准确姓名及身份证号码，以免产生不必要的经济损失。机票因享受团队折扣，一经确认出票，不予签改。火车票确认后就会立即出票，如取消行程或更换他人，会产生损失费，请自行承担。</p>
                  <p>2.70周岁以上老年人预订出游，须出示健康证明并有年轻的家属或朋友陪同出游。</p>
                  <p>3.出行期间，请随身携带本人有效身份证原件（出行前请务必检查自己证件的有效期），未满16周岁者请携带户口本原件。超过16周岁的游客若没有办理身份证，请在户籍所在地派出所开具相关身份证明，以免影响登机。</p>
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
        this.downLoadHref = api_prefix + '/Order/exportGroupNotice/'+ id
        console.log(this.downLoadHref,'downLoadHref')
      },
    //打印
    printFn() {
      const printpage = document.getElementById('ptintHtml');
      jdyFn.printHtml(printpage);
    },
    goForWord(){
      this.$http.get(api_prefix + 'Order/exportGroupNotice/' + this.$route.query.id).then(response => {
                if (response.data.code == 0) {} else {
                    this.$alert(response.data.message, '温馨提示', {
                        confirmButtonText: '确定',
                        callback: action => { }
                    });
                }
            }, response => {
                console.log('出错了');
            });
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

.page-header {
  overflow: hidden;
  margin-bottom: 10px;
}

.page-header div {
  float: left;
}

.page-header div:first-child {
  width: 70%;
}

.page-header h1 {
  font: 28px Microsoft YaHei, verdana, SimHei, sans-serif, '黑体';
  padding-bottom: 5px;
}

.page-header h3 {
  font: 18px Microsoft YaHei, verdana, SimHei, sans-serif, '黑体';
  padding-bottom: 5px;
}

.page-header p {
  padding-bottom: 5px;
  line-height: 20px;
}

.page-header image {
  width: 125px;
  height: 125px;
  vertical-align: top;
}

.table-wrap {
  padding-bottom: 10px;
}

.table-wrap .blue-font {
  color: #3f96f7;
}

.table-wrap th {
  font-weight: bold;
}

.table2 th {
  text-align: left;
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
  .page-header {
    overflow: hidden;
    margin-bottom: 0;
  }
  .page-header div {
    float: left;
  }
  .page-header div:first-child {
    width: 70%;
  }
  .page-header h1 {
    font: 28px Microsoft YaHei, verdana, SimHei, sans-serif, '黑体';
    padding-bottom: 5px;
  }
  .page-header h3 {
    font: 18px Microsoft YaHei, verdana, SimHei, sans-serif, '黑体';
    padding-bottom: 5px;
  }
  .page-header p {
    padding-bottom: 5px;
    line-height: 20px;
  }
  .page-header image {
    width: 125px;
    height: 125px;
    vertical-align: top;
  }
  .table-wrap {
    padding-bottom: 10px;
  }
  .table-wrap .blue-font {
    color: #3f96f7;
  }
  .table-wrap th {
    font-weight: bold;
  }
  .table2 th {
    text-align: left;
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
    padding: 3px 5px;
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
