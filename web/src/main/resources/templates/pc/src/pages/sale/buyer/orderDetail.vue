<template>
  <div class="jdy-content fleft jl-information">
      <!--jdy-tab begin-->
      <div class="jdy-tab">
        <a href="javascript:void(0)" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">订单详情
          <span></span>
        </a>
        <a href="javascript:void(0)" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }" v-show="tabFlag==true">支付记录
          <span></span>
        </a>
        <a href="javascript:void(0)" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }" v-show="tabFlag==true">凭证记录
          <span></span>
        </a>
        <a href="javascript:void(0)" title="" @click="jdytab(5)" :class="{ active: jdytabActive==5 }" v-show="tabFlag==true">改签记录
          <span></span>
        </a>
        <a href="javascript:void(0)" title="" @click="jdytab(6)" :class="{ active: jdytabActive==6 }" v-show="tabFlag==true">退票记录
          <span></span>
        </a>        
       <!-- <a href="javascript:void(0)" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">计划详情
          <span></span>
        </a>
        <a href="javascript:void(0)" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">操作日志
          <span></span>
        </a>-->
        <el-button type="default" class="fright mt10 mr10" @click="goback('buyerOrderAll')" >返回</el-button>
        <el-button type="default" class="fright mt10 mr10" @click="showJournal">系统日志</el-button>
      </div>
      <!--jdy-tab end-->
    <div class="jdy-content-inner">
      <!--jdy-title begin-->
      <el-row class="jdy-title"  >
        <div>{{ tableData.pName }}</div>
        <el-tag class="red-tag" close-transition v-if="tableData.ptypeName ">{{ tableData.ptypeName  }}</el-tag>
      </el-row>
      <!--jdy-title end-->

      <!--table begin-->
      <!--订单详情 begin-->
      <div class="jdy-table-wrap pb10" v-show="jdytabActive==0">
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>当前状态：{{ tableData.oStatus | orderStatus }}</span>
            <span>订单号：{{ tableData.oOrderNo }}</span>
          </el-row>
          <div class="cont">
            <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
              <tr>
                <th>产品编号</th>
                <td>{{ tableData.pNo }}</td>
                <th>行程时间</th>
                <td>{{ tableData.pDays }}天</td>
              </tr>
              <tr>
                <th>报名时间</th>
                <td>{{ tableData.createTime |dateFormat('time') }}</td>
                <th>确认时间</th>
                <td>{{ tableData.oConfirmTime |dateFormat('time') }}</td>
              </tr>
              <tr>
                <th>出团日期</th>
                <td>{{ tableData.sCalendar | dateFormat }} </td>
                <th>回团日期</th>
                <td class="red-font">{{ tableData.sCalendarBack  | dateFormat  }}</td>
              </tr>
              <tr>
                <th>外部订单号</th>
                <td>{{ tableData.oExternalNo }}</td>
                <th>合同号</th>
                <td>{{ tableData.oContractNo }}</td>
              </tr>
              <tr>
                <th>订单备注</th>
                <td>
                  {{ tableData.oRemark }}
                 <!-- <el-button @click="editBaseMark" size="mini" class="ml10">修改</el-button>-->
                </td>
                <th>订单类型</th>
                <td>{{ tableData.srcOrderId==null?"正常订单":(tableData.alterTicketId==null?"退款订单":"改签订单")}}</td>              
              </tr>             
            </table>
          </div>
        </div>
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>联系信息</span>
          </el-row>
          <div class="cont">
            <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
              <tr>
                <th>卖家名称</th>
                <td>{{ tableData.oSalerCompanyName }}</td>
                <th>买家信息</th>
                <td>{{ tableData.oBuyerCompanyName }}</td>
              </tr>
              <tr>
                <th>联系客服</th>
                <td>{{ tableData.oServicer }}（手机：{{ tableData.oServicerPhone }}）</td>
                <th>报名人信息</th>
                <td>{{ tableData.oBuyerName }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>游客信息 [联系人：{{ touristInfo.mainName }}]  [联系电话：{{ touristInfo.mainPhone }}] {{ touristInfo.bigNum }}大/ {{ touristInfo.smallNum }}小</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="touristInfo.touristsData" style="width: 100%"  border>
              <el-table-column label="票价类目" prop="categoryName" min-width="110">
                <template scope="scope">
                  <span>{{ scope.row.categoryName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="票种" prop="otTicketType"  width="120">
                <template scope="scope">
                  <p>{{ scope.row.otTicketType | ticketType }}</p>
                  <el-tag class="red-tag alignT" close-transition>{{ scope.row.otType | ticketPriceType}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="游客姓名" prop="otName" min-width="110">
                <template scope="scope">
                  <span>{{ scope.row.otName }}</span>
                  <el-tag class="red-tag alignT" close-transition v-if=" scope.row.otStatus == 1" style="vertical-align: middle;">已取消</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="票价名称" prop="otName" min-width="110">
                <template scope="scopeChild">
                  <span>{{ scopeChild.row.tName }}</span>
                </template>
              </el-table-column>              
              <el-table-column label="游客电话" prop="otPhone"  width="140"></el-table-column>
              <el-table-column label="证件类型" prop="otLicenceType" min-width="100">
                <template scope="scope">
                  {{ scope.row.otLicenceType | licenceType }}
                </template>
              </el-table-column>
              <el-table-column label="证件号" prop="otLincese" min-width="180"></el-table-column>
              <el-table-column label="接送信息" prop="stock" min-width="280">
                <template scope="scope" >
                  <div class="inlineblock"  v-if="scope.row.otLeaveType == '0'">去程:{{ scope.row.lvSbTime }} {{ scope.row.lvDepartureName }} </div>
                  <div class="inlineblock" v-else>去程:{{ scope.row.lvSbTime }} {{ scope.row.lvStopName }} </div>
                  <div class="inlineblock ml5" v-if="scope.row.otReturnType == '0'">返程:{{ scope.row.rtSbTime }} {{ scope.row.rtDepartureName }}</div>
                  <div class="inlineblock ml5" v-else>返程:{{ scope.row.rtSbTime }} {{ scope.row.rtStopName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="票价 " prop="otType"  class-name="red-font" width="180">
                <template scope="scope">
                  {{ scope.row.tPeerPrice | moneyTwoPoints}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>价格明细</span>
          </el-row>
          <div class="cont">
            <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
              <tr>
                <th>报名人数</th>
                <td>共{{ tableData.oPeopleNum }}人</td>
                <th>房差金额</th>
                <td>{{ tableData.oRoomAdjust | moneyTwoPoints }}元</td>
              </tr>
              <tr>
                <th>门市价总额</th>
                <td><span class="red-font">{{ tableData.oMarketPrice |moneyTwoPoints }}</span></td>
                <th>结算价总额</th>
                <td>
                  <span class="red-font">{{ tableData.oRealPrice |moneyTwoPoints}}</span>
                  <el-button type="text" style="padding: 0 10px;" @click="priceDetailViewFun">[查看价格组成]</el-button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!--订单详情 end-->

      <!--支付记录 begin-->
      <div class="jdy-table-wrap pb10" v-show="jdytabActive==1">
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>支付明细</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="payRecordData" style="width: 100%"  border>
              <el-table-column label="操作说明" prop="opComments"  width="220"></el-table-column>
              <el-table-column label="操作人" prop="opOprater"  min-width="90"></el-table-column>
              <el-table-column label="支付单号" prop="opPayNo"  min-width="130"></el-table-column>
              <el-table-column label="支付金额" prop="opPayAmount" min-width="100" class-name="red-font">
                <template scope="scope">
                  {{ scope.row.opPayAmount | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="支付方式" prop="opPayMethod" min-width="80">
                <template scope="scope">
                  {{ scope.row.opPayMethod | payType }}
                </template>
              </el-table-column>
              <el-table-column label="支付状态" prop="opPayStatus" min-width="80">
                <template scope="scope">
                  {{ tableData.oStatus | orderStatus }}
                </template>
              </el-table-column>
              <el-table-column label="操作时间 " prop="opPayTime" width="160">
                <template scope="scope">
                  {{ scope.row.opPayTime | dateFormat('time') }}
                </template>
              </el-table-column>
              <el-table-column label="备注 " prop="opPayRemark" min-width="100">
                <template scope="scope">
                  {{ scope.row.opPayRemark }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--支付记录 end-->

      <!--凭证记录 begin-->
      <div class="jdy-table-wrap pb10" v-show="jdytabActive==4">
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>凭证记录</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="getVouchers" style="width: 100%"  border>
              <el-table-column label="上传时间" prop="createTime"  width="220">
                <template scope="scope">
                  {{ scope.row.createTime | dateFormat('time') }}
                </template>
              </el-table-column>
              <el-table-column label="凭证" prop="url"  min-width="230" style="text-align:center">
                <template scope="scope">
                  <!-- <a :href="h5Url" target="_blank"> -->
                    <span @click="getImg(scope.row.url)">
                      <img :src='scope.row.url' alt="" style="width:200px;height:130px;vertical-align: middle;display:inline-block">
                    </span>
                  <!-- </a> -->
                </template>
              </el-table-column>
              <el-table-column label="凭证状态" prop="fStatus"  min-width="130">
                <template scope="scope">
                  <span v-if="scope.row.fStatus == 0">待确认</span>
                  <span v-if="scope.row.fStatus == 1">已驳回</span>
                  <span v-if="scope.row.fStatus == 2">已确认</span>
                </template>
              </el-table-column>
              <el-table-column label="上传说明" prop="uploadDesc" min-width="300" class-name="red-font">
                <template scope="scope">
                  {{ scope.row.uploadDesc }}
                </template>
              </el-table-column>
              <el-table-column label="支付金额" prop="money" min-width="100" class-name="red-font">
                <template scope="scope">
                  {{ scope.row.money | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="支付单号" prop="transNo" min-width="80">
                <template scope="scope">
                  {{ scope.row.transNo}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--凭证记录 end-->

      <!--改签记录 begin-->
      <div class="jdy-table-wrap pb10" v-show="jdytabActive==5">
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>改签记录</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="getChangeRecord" style="width: 100%"  border>
              <el-table-column type="expand">
                <template scope="scope">
                <div>
                  <div class="expandTitle">改签游客信息</div>
                  <div class="expandTitle">原票价</div>
                  <div class="expandTitle">现票价</div>
                </div>
                <div v-for="item in scope.row.touristInfo" :key="item">
                  <div class="expandTitle">{{item.touristName}}（{{item.touristLincese}}）</div>
                  <div class="expandTitle">{{item.touristName}} - （{{item.ticketName}}-票价：{{item.oldPrice | moneyTwoPoints}}）</div>
                  <div class="expandTitle">{{item.touristName}} - （{{item.ticketName}}-票价：{{item.nowPrice | moneyTwoPoints}}）</div>
                </div>
                </template>
              </el-table-column>
              <el-table-column label="原订单号" prop="oldOrderNo" min-width="150">
                <template scope="scope">
                  {{ scope.row.oldOrderNo }}
                </template>
              </el-table-column>
              <el-table-column label="现订单号" prop="newOrderNo" min-width="150">
                <template scope="scope">
                  {{ scope.row.newOrderNo }}
                </template>
              </el-table-column>
              <el-table-column label="原团号" prop="oldGroupNo" min-width="150">
                <template scope="scope">
                  {{ scope.row.oldGroupNo }}
                </template>
              </el-table-column>
              <el-table-column label="现团号" prop="targetGroupNo" min-width="150">
                <template scope="scope">
                  {{ scope.row.targetGroupNo }}
                </template>
              </el-table-column>
              <el-table-column label="改签申请人" prop="createUserName" min-width="100">
                <template scope="scope">
                  {{ scope.row.createUserName }}
                </template>
              </el-table-column>
              <el-table-column label="申请时间" prop="createTime" min-width="150">
                <template scope="scope">
                  {{ scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column label="改签审核人" prop="updateUserName" min-width="100">
                <template scope="scope">
                  {{ scope.row.updateUserName }}
                </template>
              </el-table-column>
              <el-table-column label="审核时间" prop="uploadDesc" min-width="150">
                <template scope="scope">
                  {{ scope.row.updateTime}}
                </template>
              </el-table-column>
              <el-table-column label="改签状态" prop="transNo" min-width="80">
                <template scope="scope">
                  <span v-if="scope.row.status == 0">待确认</span>
                  <span v-if="scope.row.status == 1">已确认</span>
                  <span v-if="scope.row.status == 2">已关闭</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->
          </div>
        </div>
      </div>
      <!--改签记录 end-->

      <!--退票记录 begin-->
      <div class="jdy-table-wrap pb10" v-show="jdytabActive==6">
        <div class="info-wrap">
          <el-row class="title" type="flex" justify="space-between">
            <span>退票记录</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="refundRecordList" style="width: 100%"  border>
              <el-table-column label="退款游客信息" prop="oldOrderNo" min-width="150">
                <template scope="scope">
                  <el-tooltip effect="light"  placement="bottom-start">
                    <div slot="content">
                      {{ scope.row.ticketInfo }}
                    </div>
                    <span class="blue">查看详情</span>
                  </el-tooltip>                   
                </template>
              </el-table-column>                            
              <el-table-column label="申请退款金额" prop="oldOrderNo" >
                <template scope="scope">
                  {{ scope.row.applyAmount | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="申请退款时间" prop="newOrderNo">
                <template scope="scope">
                  {{ scope.row.applyRefundTime }}
                </template>
              </el-table-column>
              <el-table-column label="申请退款人员" prop="oldGroupNo" >
                <template scope="scope">
                  {{ scope.row.refundableSalerName }}
                </template>
              </el-table-column>
              <el-table-column label="申请退款说明" prop="targetGroupNo">
                <template scope="scope">
                  {{ scope.row.refundExplain }}
                </template>
              </el-table-column>
              <el-table-column label="退款金额" prop="createUserName">
                <template scope="scope">
                  {{ scope.row.refundAmount | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="退款状态" prop="createTime">
                <template scope="scope">
                  {{ scope.row.status | statusFilter}}
                </template>
              </el-table-column>
              <el-table-column label="退款时间" prop="updateUserName">
                <template scope="scope">
                  {{ scope.row.refundableTime }}
                </template>
              </el-table-column>
              <el-table-column label="退款人员" prop="uploadDesc">
                <template scope="scope">
                  {{ scope.row.refundableSalerName}}
                </template>
              </el-table-column>
              <el-table-column label="帐单号" prop="transNo">
                <template scope="scope">
                  {{ scope.row.orderId}}
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->
          </div>
        </div>
      </div>
      <!--退票记录 end-->   




      <!--table end-->


      <!-- 修改订单备注 弹窗 begin-->
      <jdy-alert title="修改订单备注" v-if="editOrderRemarkFlag" @closeAlert="closeAlert" class="dialog-lv dialog-edit-mark">
        <el-row class="scroll-cont form-wrap p20 pb0">
          <el-form :model="editOrderRemarkForm" ref="editOrderRemarkForm">
            <el-form-item label="" prop="reason" :rules="[{ required: true, message: '请填写订单备注', trigger: 'blur' }]">
              <el-input type="textarea" v-model="editOrderRemarkForm.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="saveOrderRemark">保存</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 撤销发票 弹窗 end-->

      <!-- 订单价格明细 弹窗 begin-->
      <jdy-alert title="订单价格明细" @closeAlert="closeAlert" v-if="alertPriceDetailFlag" class="dialog-lv dialog-price-detail">
        <el-row class="scroll-cont table-wrap p10">
          <el-table :data="priceDetailData" style="width: 100%"  border height="200" :summary-method="getSummaries" show-summary sum-text="小计">
            <el-table-column label="价格名称" prop="opPriceName"  width="100"></el-table-column>
            <el-table-column label="个数" prop="opNum" width="70"></el-table-column>
            <el-table-column label="单价" prop="opPrice"  width="120" class-name="red-font">
              <template scope="scope">
                ￥{{ scope.row.opPrice | moneyTwoPoints }}
              </template>
            </el-table-column>
            <el-table-column label="金额" prop="opTotalPrice" width="120" class-name="red-font">
              <template scope="scope">
                ￥{{ scope.row.opTotalPrice | moneyTwoPoints }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="opRemark"></el-table-column>
          </el-table>
        </el-row>
      </jdy-alert>
      <!-- 订单价格明细 弹窗 end-->


      <!--系统日志查看 弹窗  begin-->
      <JdyJournal ref="jdyJournal" :logram = "logPram"></JdyJournal>
      <!--系统日志查看 弹窗  begin-->

    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
import listData from "./listData";
import jdyAlert from "@/components/Alert";
import JdyJournal from "@/components/Journal";
import orderApi from "./../api/index";

import { licenceTypeArr } from "./../js/comData";

$(function() {
  $(".jdy-main-scroll").scrollTop(0);
  // $('.jdy-main-scroll').scroll(function(){
  //  $(this).scrollTop(0)
  // })
});

export default {
  name: "orderDetail",
  data() {
    return {
      jdytabActive: 0, //tab的控制值
      pageId: null,
      //弹窗相关属性值
      alertPriceDetailFlag: false,
      editOrderRemarkFlag: false,
      //table数据
      tableData: {}, //列表数据
      touristInfo: {
        touristsData: []
      },
      priceDetailData: [],
      editOrderRemarkForm: {
        remark: ""
      },
      //支付记录
      payRecordData: [],
      billOrderData: [],
      planDetailsData: {
        pickupDetailLen: 0,
        pickupDetail: [""]
      },
      h5Url: "",
      operLogsData: [],
      //凭证记录
      getVouchers:[
        {
          url:'',
          fStatus:'',
          money:'',
          transNo:'',
          createTime:''
        }
      ],
      //改签记录
        getChangeRecord:[],
        recordForm:{
          orderId:'',
          currPage:1,
          pageSize:20
        },
        tableDataTotal:0,
        pageSize:20,
        currentPage: 1,
      //日志参数
      logPram: {
        pid: null,
        module: "Order",
        index: 1
      },
      //刷新
      fullscreenLoading: false,
      // 退款记录列表
      refundRecordList:[],
      tabFlag:true,
    };
  },
  mounted() {
    this.LicenceTypeArr = licenceTypeArr;
    this.pageId = this.$route.query.id || 17;
    this.getTableData();
    this.getSystermLog();
    if(this.$route.query.type==1 || this.$route.query.type==2){
      this.tabFlag=false
    }    
  },
  methods: {
    goback(url) {
      window.history.go(-1)
      // this.$router.push({ name: url });
    },
    //图片预览
    getImg(url) {
      window.open(url)
    },
    //tab点击
    jdytab(ind) {
      this.jdytabActive = ind;
      if (ind == "1") {
        this.getPayRecordData();
      } else if (ind == "2") {
        this.getPlanDetailsData();
      } else if (ind == "3") {
        this.getOperLogsData();
      } else if (ind == "4") {
        this.getVouchersData();
      } else if (ind == "5") {
        this.getChangeRecordData();
      } else if (ind == "6") {
        this.getRefundList();
      }
    },
    editBaseMark() {
      //编辑订单备注
      this.editOrderRemarkFlag = true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("dialog-edit-mark");
      });
    },
    saveOrderRemark() {
      //保存订单备注
      this.$refs.editOrderRemarkForm.validate(valid => {
        if (valid) {
          this.closeAlert();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //订单价格明细 弹窗
    getSummaries(param) {
      const vm = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            const prev1 = Number(prev);
            if (!isNaN(value)) {
              return jdyFn.moneyTwoPoints(prev1 + curr);
            } else {
              return jdyFn.moneyTwoPoints(prev1);
            }
          }, 0);
          sums[index] = "￥" + sums[index];
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    //---------弹窗相关逻辑 start-----
    closeAlert() {
      //关闭弹出框
      this.alertPriceDetailFlag = false;
      this.editOrderRemarkFlag = false;
      $(".alertbgg").remove();
    },

    //订单价格明细查看
    priceDetailViewFun() {
      this.alertPriceDetailFlag = true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("dialog-price-detail");
      });
    },
    //---------弹窗相关逻辑 end-----

    // ---------table列表相关逻辑 start-----
    //获取列表数据
    getTableData() {
      const vm = this;
      const sendData = {
        currPage: "1",
        pageSize: 1000,
        id: vm.pageId
      };
      orderApi.orderDetail(sendData).then(response => {
        if (response.data.code == "0") {
          let data = response.data.body;
          vm.tableData = data;
          vm.touristInfo.touristsData = vm.tableData.tourists;
          vm.getTouristInfo();
          vm.priceDetailData = data.priceDetails;
        } else {
          vm.$alert(response.data.message);
        }
      });
    },
    getTouristInfo() {
      const vm = this;
      const touristArr = vm.touristInfo.touristsData;
      let mainTouristInfo = [];
      touristArr.forEach((item, index, arr) => {
        if (Number(item.otType) == 0) {
          //大人
          const perData = jdyFn.deepCopy(item);
          perData.mainIndex = index;
          mainTouristInfo.push(perData);
        }
      });
      let bigNumArr = touristArr.filter((item, index, arr) => {
        return Number(item.otType) == 0;
      });
      let smallNumArr = touristArr.filter((item, index, arr) => {
        return Number(item.otType) == 1;
      });
      if (mainTouristInfo.length == 0) {
        vm.touristInfo.mainName = "null";
        vm.touristInfo.mainPhone = "null";
        vm.touristInfo.mainIndex = 0;
      } else {
        vm.touristInfo.mainName = mainTouristInfo[0].otName;
        vm.touristInfo.mainPhone = mainTouristInfo[0].otPhone;
        vm.touristInfo.mainIndex = mainTouristInfo[0].mainIndex;
      }
      vm.touristInfo.bigNum = bigNumArr.length;
      vm.touristInfo.smallNum = smallNumArr.length;
    },
    //获得支付记录列表
    getPayRecordData() {
      const vm = this;
      const sendData = {
        currPage: "1",
        pageSize: 1000,
        id: vm.pageId
      };
      orderApi.orderPayRecords(sendData).then(response => {
        if (response.data.code == "0") {
          let data = response.data.body;
          vm.payRecordData = data.pays;
          vm.billOrderData = [];
          vm.billOrderData.push(data.pays[0].bill);
        } else {
          vm.$alert(response.data.message);
        }
      });
    },
    //获得支凭证记录列表
    getVouchersData() {
      this.$http
        .post(api_prefix + "/Order/getVouchers", {
          orderId: this.$route.query.id
        })
        .then(
          response => {
            if (response.data.code == 0) {
              this.getVouchers = response.data.body;
            } else {
              this.$alert(response.data.message);
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //获得支凭证记录列表
    getChangeRecordData() {
      this.recordForm.orderId = this.$route.query.id;
      this.$http
        .post(api_prefix + "/alterTicket/alterTicketList",this.recordForm)
        .then(
          response => {
            if (response.data.code == 0) {
              this.getChangeRecord = response.data.body.list;
              this.tableDataTotal = response.data.body.total;
            } else {
              this.$alert(response.data.message);
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //获得计划详情列表
    getPlanDetailsData() {
      const vm = this;
      const sendData = {
        currPage: "1",
        pageSize: 1000,
        id: vm.pageId
      };
      orderApi.planDetails(sendData).then(response => {
        if (response.data.code == "0") {
          let data = response.data.body;
          vm.planDetailsData.pickupDetailLen = data.tourists.length;
          vm.planDetailsData.pickupDetail = vm.getPickupDetailData(
            data.tourists
          );
        } else {
          vm.$alert(response.data.message);
        }
      });
    },
    getPickupDetailData(data) {
      if (data.length == 0) {
        return [];
      }
      let arr = jdyFn.deepCopy(data);
      let newData = arr.reduce((pre, cur, index, arr) => {
        //console.log(999)
        cur.num = 1;
        if (index == 0) {
          pre.push(cur);
        }
        pre.forEach((item, ind, arr) => {
          if (
            item.otLeaveId == cur.otLeaveId &&
            item.otReturnId == cur.otReturnId
          ) {
            item.num = cur.num + 1;
          } else {
            pre.push(cur);
          }
        });
        return pre;
      }, []);
      return newData;
    },
    //分页
    handleCurrentChange(val) {
      if (val) {
        this.recordForm.currPage = val;
        this.jdytab(this.jdytabActive);
      }
    },
    //获得操作日志
    getOperLogsData() {
      const vm = this;
      const sendData = {
        currPage: "1",
        pageSize: 1000,
        id: vm.pageId
      };
      orderApi.operLogs(sendData).then(response => {
        if (response.data.code == "0") {
          let data = response.data.body;
          vm.operLogsData = data;
        } else {
          vm.$alert(response.data.message);
        }
      });
    },
    getRefundList(){
      this.$http.get(api_prefix + "orderRefundRecord/getRefundRecord/" + this.$route.query.id +"/0",).then(response => {
          if (response.body.code == 0) {
            this.refundRecordList = response.body.body;
          } else {
            this.$alert(response.data.message);
          }
        });
    },
    //---------table列表相关逻辑 end-----

    //日志相关逻辑
    getSystermLog() {
      this.logPram.pid = this.pageId;
      this.$refs.jdyJournal.getLogData(1);
    },
    showJournal() {
      this.$refs.jdyJournal.alertJournal();
    }
  },
  filters: {
    statusFilter: function(value) {
      switch(value){
        case 0:
          value="退款关闭";
          break;
        case 1:
          value="退款中";
          break;
        case 2:
          value="退款成功";
          break;                    
      }
      return value
    },
    // type 用来判断订单类型 0：正常，1：改签，2：退票
    filterStatus: function(value) {
      if(value==0){
        return "正常订单"
      }else if(value==1){
        return "改签订单"
      }else{
        return "退款订单"
      }
    }    
  },    
  components: {
    jdyAlert,
    JdyJournal
  },
  created() {
    jdyFn.scrollToTop();
  }
};
</script>
<style scoped>
.table-custom th {
  width: 20%;
}
.table-custom tr td {
  width: 30%;
}

.jdy-title {
  padding: 20px 0 15px;
}
.dialog-tourist {
  width: 1000px;
}
.dialog-tourist .dialog-title-custom {
  width: auto;
  max-width: 850px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dialog-price-detail {
  width: 900px;
}
.expandTitle{
  width: 30%;
  display: inline-block;
  text-align: center;
  line-height: 44px;
  height: 44px;;
}
</style>



