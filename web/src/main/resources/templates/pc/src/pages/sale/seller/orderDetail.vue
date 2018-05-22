<template>
  <div class="jdy-content fleft jl-information">
    <!-- <div class="jdy-content-inner"> -->
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
        <el-button type="default" class="fright mt10 mr10" @click="goback('sellerOrderAll')" >返回</el-button>
        <el-button type="default" class="fright mt10 mr10" @click="showJournal">系统日志</el-button>
        <!--<el-button type="primary" class="fright mt10 mr10" v-show="jdytabActive==0" @click="confirmOrder"  v-loading.fullscreen.lock="fullscreenLoading">确认订单</el-button>-->
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
                <td class="red-font">{{ tableData.sCalendarBack | dateFormat  }}</td>
              </tr>
             <!-- <tr>
                <th>外部订单号</th>
                <td>{{ tableData.oExternalNo }}</td>
                <th>合同号</th>
                <td>{{ tableData.oContractNo }}</td>
              </tr>-->
              <tr>
                <th>团号</th>
                <td>{{ tableData.oGroupOrderNo }}</td>
                <th>订单备注</th>
                <td>{{ tableData.oRemark }}</td>
              </tr>
              <tr>
                <th>订单类型</th>
                <td>{{ tableData.srcOrderId==null?"正常订单":(tableData.alterTicketId==null?"退款订单":"改签订单")}}</td>
                <th></th>
                <td></td>
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
                <th>买家名称</th>
                <td>{{ tableData.oBuyerName }}</td>
              </tr>
              <tr>
                <th>联系客服</th>
                <td>{{ tableData.oServicer }}（手机：{{ tableData.oServicerPhone }}）</td>
                <th>联系手机号</th>
                <td>{{ tableData.buyerPhone }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="info-wrap">
          <el-row class="title">游客信息
            <span v-if="touristInfo.mainTouristData.mainName !==''"> [联系人：{{ touristInfo.mainTouristData.mainName }}]  [联系电话：{{ touristInfo.mainTouristData.mainPhone }}] {{ touristInfo.mainTouristData.adultNum }}大/ {{ touristInfo.mainTouristData.childrenNum }}小</span>
            <div class="btn-wrap fr">
              <!--<el-button type="text" @click="seatChangeFun" v-if="tableData.oBusSeat !==''">【座位调整】</el-button>-->
              <!--<el-button type="text" @click="touristInfoEditFun">【编辑游客信息】</el-button>-->
            </div>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="touristInfo.singleTicketData" class="table-border table-heigt0"  >
              <el-table-column label="票价类目" prop="categoryName" min-width="110"></el-table-column>
              <el-table-column label="票种" prop="otTicketType"  width="120">
                <template scope="scopeChild">
                  <p>{{ scopeChild.row.otTicketType | ticketType }}</p>
                  <el-tag class="red-tag alignT" close-transition>{{ scopeChild.row.otType | ticketPriceType}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="游客姓名" prop="otName" min-width="110">
                <template scope="scopeChild">
                  <span>{{ scopeChild.row.otName }}</span>
                  <el-tag class="red-tag alignT" close-transition v-if="scopeChild.row.otStatus == 1" style="vertical-align: middle;">已取消</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="票价名称" prop="otName" min-width="110">
                <template scope="scopeChild">
                  <span>{{ scopeChild.row.tName }}</span>
                </template>
              </el-table-column>              
              <el-table-column label="游客电话" prop="otPhone"  min-width="140"></el-table-column>
              <el-table-column label="证件类型" prop="otLicenceType" width="100">
                <template scope="scopeChild">
                  {{ scopeChild.row.otLicenceType | licenceType }}
                </template>
              </el-table-column>
              <el-table-column label="证件号" prop="otLincese" min-width="180"></el-table-column>
              <el-table-column label="接送信息" prop="stock" min-width="280">
                <template scope="scopeChild" >
                  <div class="pickupStationTxt">
                    <div class="mr5">
                      <span v-if="scopeChild.row.otLeaveType === 0">去程:{{ scopeChild.row.lvSbTime | dateFormat('hm') }} {{ scopeChild.row.lvDepartureName }} </span>
                      <span v-else>去程:{{ scopeChild.row.lvSbTime | dateFormat('hm') }} {{ scopeChild.row.lvStopName  }} </span>
                    </div>
                    <div>
                      <span v-if="scopeChild.row.otReturnType === 0">返程:{{ scopeChild.row.rtSbTime | dateFormat('hm') }} {{ scopeChild.row.rtDepartureName }}</span>
                      <span v-else>返程:{{ scopeChild.row.rtSbTime | dateFormat('hm') }} {{ scopeChild.row.rtStopName }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="票价 " prop="tPeerPrice"  class-name="red-font" width="120">
                <template scope="scopeChild">
                  {{ scopeChild.row.tPeerPrice | moneyTwoPoints}}
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="touristInfo.packageTicketData" v-if="touristInfo.packageTicketData.length !== 0" :showHeader="false" class="table-border table-expand" default-expand-all   :row-class-name="tableRowClassName">
              <el-table-column  type="expand" width="2">
                <template scope="scope" >
                  <div>
                    <el-table :data="scope.row.children" class="border-table" :showHeader="false" >
                      <el-table-column label="票价类目" prop="categoryName" min-width="110"></el-table-column>
                      <el-table-column label="票种" prop="otTicketType"  width="120">
                        <template scope="scopeChild">
                          <p>{{ scopeChild.row.otTicketType | ticketType }}</p>
                          <el-tag class="red-tag alignT" close-transition>{{ scopeChild.row.otType | ticketPriceType}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="游客姓名" prop="otName" min-width="110">
                        <template scope="scopeChild">
                          <span>{{ scopeChild.row.otName }}</span>
                          <el-tag class="red-tag alignT" close-transition v-if="scopeChild.row.otStatus == 1" style="vertical-align: middle;">已取消</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="游客电话" prop="otPhone"  min-width="140"></el-table-column>
                      <el-table-column label="证件类型" prop="otLicenceType" width="100">
                        <template scope="scopeChild">
                          {{ scopeChild.row.otLicenceType | licenceType }}
                        </template>
                      </el-table-column>
                      <el-table-column label="证件号" prop="otLincese" min-width="180"></el-table-column>
                      <el-table-column label="接送信息" prop="stock" min-width="280">
                        <template scope="scopeChild" >
                          <div class="pickupStationTxt">
                            <div class="mr5">
                              <span v-if="scopeChild.row.otLeaveType === 0">去程:{{ scopeChild.row.lvSbTime | dateFormat('hm') }} {{ scopeChild.row.lvDepartureName }} </span>
                              <span v-else>去程:{{ scopeChild.row.lvSbTime | dateFormat('hm') }} {{ scopeChild.row.lvStopName  }} </span>
                            </div>
                            <div>
                              <span v-if="scopeChild.row.otReturnType === 0">返程:{{ scopeChild.row.rtSbTime | dateFormat('hm') }} {{ scopeChild.row.rtDepartureName }}</span>
                              <span v-else>返程:{{ scopeChild.row.rtSbTime | dateFormat('hm') }} {{ scopeChild.row.rtStopName }}</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="票价 " prop=""  class-name="red-font" width="120"></el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="票种" prop="otTicketType"  width="117">
                <template scope="scope">
                  <p>{{ scope.row.otTicketType | ticketType }}</p>
                </template>
              </el-table-column>
              <el-table-column label="游客姓名" prop="otName" min-width="110">
                <template scope="scope">
                  <span>{{ scope.row.otName }}</span>
                  <el-tag class="red-tag alignT" close-transition v-if="scope.row.otStatus == 1" style="vertical-align: middle;">已取消</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="游客电话" prop="otPhone"  min-width="140"></el-table-column>
              <el-table-column label="证件类型" prop="otLicenceType" width="100"></el-table-column>
              <el-table-column label="证件号" prop="otLincese" min-width="180"></el-table-column>
              <el-table-column label="接送信息" prop="stock" min-width="280"></el-table-column>
              <el-table-column label="票价 " prop="tPeerPrice"  class-name="red-font" width="120">
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
                <th>票价总额</th>
                <td>{{ tableData.ticketSum  | moneyTwoPoints }}</td>
                <th>首款金额</th>
                <td>{{ tableData.oFirstPay  | moneyTwoPoints }}</td>
                <!-- <th>房差金额</th>
                <td>{{ tableData.oRoomAdjust | moneyTwoPoints }}</td> -->
              </tr>
              <tr>
                <th>接送总额</th>
                <td>{{ tableData.pickUpSum  | moneyTwoPoints }}</td>
                <th>尾款金额</th>
                <td>{{ tableData.oUnPay  | moneyTwoPoints }}</td>
              </tr>
              <tr>
                <th>门市价总额</th>
                <td><span class="red-font">{{ tableData.oMarketPrice |moneyTwoPoints }}</span></td>
                <th>结算价总额</th>
                <td>
                  <span class="red-font">{{ tableData.oRealPrice |moneyTwoPoints}}</span>
                 <!-- <el-button type="text" style="padding: 0 10px;" @click="priceDetailViewFun">[查看价格组成]</el-button>-->
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
              <el-table-column label="备注 " prop="opPayRemark" min-width="210">
                <template scope="scope">
                  {{ scope.row.opPayRemark }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="info-wrap" v-if="orderCards.length>0">
          <el-row class="title" type="flex" justify="space-between">
            <span>订单礼品卡</span>
          </el-row>
          <div class="cont table-wrap">
            <el-table :data="orderCards" style="width: 100%"  border>
              <el-table-column label="卡号" prop="cardNo"  min-width="260"></el-table-column>
              <el-table-column label="截止有效时间" prop="validTime"  min-width="260"></el-table-column>
             <!-- <el-table-column label="可抵扣人数" prop="custNum"  min-width="120"></el-table-column>-->
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
              <el-table-column label="凭证" prop="url"  min-width="230">
                <template scope="scope">
                  <!-- <a :href="h5Url" target="_blank"> -->
                    <span @click="getImg(scope.row.url)">
                      <img :src='scope.row.url' alt="" style="width:200px;height:130px;vertical-align: middle;">
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
      <!--table end-->
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

      <!-- 游客信息 弹窗 begin-->
      <ToutristInfo ref="touristInfo" :touristInfo="touristInfo"></ToutristInfo>
      <!-- 游客信息 弹窗 end-->

      <!-- 订单价格明细 弹窗 begin-->
      <PriceDetail ref="priceDetail" :priceDetail="priceDetailData"></PriceDetail>
      <!-- 订单价格明细 弹窗 end-->

      <!-- 游客座位调整 弹窗 begin-->
      <jdy-alert title="游客座位调整" @closeAlert="closeAlert" v-if="alertSeatChangeFlag" class="dialog-lv dialog-seat-change">
        <el-row class="dialog-title-custom">
          调整游客座位表：{{ seatData.seatLen }}人；[订单号：{{ tableData.oOrderNo  }}]
        </el-row>
        <el-row class="scroll-cont p20">
          <p class="red-tag">座位调整会导致系统内部信息与游客手中的通知书信息不一致，从而产生投诉， 请慎用！</p>
          <el-row class="seat-wrap">
            <el-row>
              <el-col :span="6">
                <span class="icon3 icon3-seat"></span>空座
              </el-col>
              <el-col :span="6">
                <span  class="icon3 icon3-seat-success"></span>选中
              </el-col>
              <el-col :span="6">
                <span  class="icon3 icon3-seat-temporary"></span>原座位
              </el-col>
              <el-col :span="6">
                <span  class="icon3 icon3-seat-lock"></span>已占
              </el-col>
            </el-row>
            <SeatOfBus ref="seatOfBus" :seat-temporary="seatData"></SeatOfBus>
          </el-row>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="saveSeatChange">确认</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 游客座位调整 弹窗 end-->

      <!--系统日志查看 弹窗  begin-->
      <JdyJournal ref="jdyJournal" :logram = "logPram"></JdyJournal>
      <!--系统日志查看 弹窗  begin-->
      </div>
    </div>
  <!-- </div> -->
  <!--jdy-content end-->
</template>

<script>
import listData from './listData';
import jdyAlert from '@/components/Alert';
import JdyJournal from '@/components/Journal';
import orderApi from './../api/index';
import SeatOfBus from './../component/seatOfBus';
import PriceDetail from './../component/DiaPriceDetail';
import ToutristInfo from './../component/DiaTouristInfo';


import touristFormOption from './../js/touritInfoEdit';

$(function () {
  $('.jdy-main-scroll').scrollTop(0)
})

export default {
  name: 'orderDetail',
  data() {
    return {

      jdytabActive:0,//tab的控制值
      pageId:null,
      //弹窗相关属性值
      alertSeatChangeFlag:false,
      //table数据
      tableData: {}, //列表数据
      priceDetailData:[],
      seatData:{
        bScheduleId:'',
        oBuyerCompanyId:'',
        changeSeatArr:[],
        seatLen:0
      },
      touristInfo:{
        allData:[],
        oScheduleId:null,
        singleTicketData:[],
        packageTicketData:[],
        mainTouristData:touristFormOption.mainTouristData
      },
      seatsListData:[],
      //支付记录
      orderCards:[],
      payRecordData:[],
      billOrderData:[],
      planDetailsData:{
        pickupDetailLen:0,
        pickupDetail:['']
      },
      //凭证记录
      h5Url:'',
      getVouchers:[
        {
          url:'',
          fStatus:'',
          money:'',
          transNo:'',
          createTime:''
        }
      ],
      operLogsData:[],
      //日志参数
      logPram:{
        pid:null,
        module:"OrderOperation",
        index:1,
      },
      //刷新
      fullscreenLoading:false,
      // 退款记录列表
      refundRecordList:[],  
      //改签记录
        getChangeRecord:[],
        recordForm:{
          orderId:'',
          currPage:1,
          pageSize:20
        },    
        tabFlag:true,      
    }
  },
  mounted(){
    this.pageId = this.$route.query.id ;
    this.getTableData();
    this.getSystermLog();
    if(this.$route.query.type==1 || this.$route.query.type==2){
      this.tabFlag=false
    }
  },
  methods: {
    //图片预览
    getImg(url) {
      window.open(url)
    },
    tableRowClassName(row, index) {
      if (row.type != 0) {
        return 'no-expend-row';
      }
      return '';
    },
    goback(url) {
      window.history.go(-1)
      // this.$router.push({name:url});
    },
    //tab点击
    jdytab(ind){
      this.jdytabActive = ind;
      if(ind == '1'){
        this.getPayRecordData();
      }
      else if(ind == '2'){
        this.getPlanDetailsData();
      }
      else if(ind == '3'){
        this.getOperLogsData();
      }
      else if (ind == "4") {
        this.getVouchersData();
      }else if (ind == "5") {
        this.getChangeRecordData();
      } else if (ind == "6") {
        this.getRefundList();
      }
    },
    //订单确认
    confirmOrder(){
      this.$confirm('是否确认订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmOrderReq();
      }).catch(() => {});
    },
    updatePage() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
        this.getTableData();
        this.getSystermLog();
      }, 1000);
    },
    confirmOrderReq(){
      const vm = this;
      const sendData = {
        currPage:1,
        pageSize:1000,
        "id": vm.pageId
      }
      orderApi.orderConfirm(sendData).then((response) => {
        if(response.data.code == '0')
        {
         vm.updatePage();
        }else{
          vm.$alert(response.data.message)
        }
      });
    },

    //---------弹窗相关逻辑 start-----
    closeAlert(){ //关闭弹出框
      this.alertSeatChangeFlag =false;
      $('.alertbgg').remove();
    },
    //调整座位
    seatChangeFun(){
      const vm = this;
      this.alertSeatChangeFlag = true;
      this.$nextTick(function () {
        jdyFn.setAlertStyle('dialog-seat-change');
      });
    },
    //保存调整座位
    saveSeatChange(){
      this.alertSeatChangeFlag = false;
      $('.alertbgg').remove();
    },
    //编辑游客信息
    touristInfoEditFun(){
      this.$refs.touristInfo.showTouristInfoDia();
    },
    //订单价格明细查看
    priceDetailViewFun(){
      this.$refs.priceDetail.priceDetailDialogShow();
    },
    //---------弹窗相关逻辑 end-----

    // ---------table列表相关逻辑 start-----
    //获取列表数据
    getTableData(){
      const vm = this;
      const sendData = {
        currPage:'1',
        pageSize:1000,
        "id": vm.pageId
      }
      orderApi.orderDetail(sendData).then((response) => {
        if(response.data.code == '0')
        {
          let data = response.data.body;
          vm.tableData = data;
          vm.priceDetailData = data.priceDetails;
          vm.getPickUpAndTicketOfPriceSum();

          vm.touristInfo.bScheduleId = vm.tableData.oScheduleId;
          vm.touristInfo.allData = vm.tableData.tourists;
          vm.touristInfo.singleTicketData = touristFormOption.turnTableData(vm.tableData.tourists).singleTicket;
          vm.touristInfo.packageTicketData = touristFormOption.turnTableData(vm.tableData.tourists).packageTicket;
          vm.touristInfo.mainTouristData = touristFormOption.getMainTouristData(vm.tableData.tourists);

          if(data.oBusSeat !==''){//不为空，如果座位为对号入座，则计算有关座位业务
            const seatData = eval('('+data.oBusSeat+')');
            vm.getSeatChangeInfo(seatData);
          }
        }else{
          vm.$alert(response.data.message)
        }
      });
    },
    getPickUpAndTicketOfPriceSum(){
      let pickUpSum = 0;
      let ticketSum = 0;
      this.priceDetailData.forEach((item)=>{
        if(item.opType === 0 ){
          ticketSum += Number(item.opTotalPrice);
        }
        if(item.opType ===5){
          pickUpSum += Number(item.opTotalPrice);
        }
      });

      this.tableData.ticketSum = ticketSum;
      this.tableData.pickUpSum = pickUpSum;

    },
    getSeatChangeInfo(arrData){
      if(arrData.length==0) return;
      const vm =this;
      vm.seatData.bScheduleId = vm.tableData.oScheduleId;
      vm.seatData.oBuyerCompanyId = vm.tableData.oBuyerCompanyId;
      vm.seatData.changeSeatArr = jdyFn.deepCopy(arrData);
      let len = 0;
      arrData.forEach((item,index,arr) =>{
        const perLen = item.seat.split(',').length;
        len += perLen;
      });
      vm.seatData.seatLen = len;
    },
    //获得支付记录列表
    getPayRecordData(){
      const vm = this;
      const sendData = {
        currPage:'1',
        pageSize:1000,
        "id": vm.pageId
      }
      orderApi.orderPayRecords(sendData).then((response) => {
        if(response.data.code == '0')
        {
          let data = response.data.body;
          vm.payRecordData = data.pays;
          vm.orderCards = data.orderCards?data.orderCards:[];
          vm.billOrderData = [];
          vm.billOrderData.push(data.pays[0].bill);
        }else{
          vm.$alert(response.data.message)
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
    getRefundList(){
      this.$http.get(api_prefix + "orderRefundRecord/getRefundRecord/" + this.$route.query.id +"/0",).then(response => {
          if (response.body.code == 0) {
            this.refundRecordList = response.body.body;
          } else {
            this.$alert(response.data.message);
          }
        });
    },      
    //获得计划详情列表
    getPlanDetailsData(){
      const vm = this;
      const sendData = {
        currPage:'1',
        pageSize:1000,
        "id": vm.pageId
      }
      orderApi.planDetails(sendData).then((response) => {
        if(response.data.code == '0')
        {
          let data = response.data.body;
          vm.planDetailsData.pickupDetailLen = data.tourists.length;
          vm.planDetailsData.pickupDetail = vm.getPickupDetailData(data.tourists);
        }else{
          vm.$alert(response.data.message)
        }
      });
    },
    getPickupDetailData(data){
      if(data.length==0) {
        return [];
      }
      let arr = jdyFn.deepCopy(data);
      let newData = arr.reduce((pre,cur,index,arr)=>{
        //console.log(999)
        cur.num = 1;
        if(index == 0){
          pre.push(cur);
        }
        pre.forEach((item,ind,arr)=>{
          if(item.otLeaveId == cur.otLeaveId && item.otReturnId == cur.otReturnId){
            item.num = cur.num +1;
          }
          else{
            pre.push(cur);
          }
        });
        return pre;
      },[]);
      return newData;

    },
    //获得操作日志
    getOperLogsData(){
      const vm = this;
      const sendData = {
        currPage:'1',
        pageSize:1000,
        "id": vm.pageId
      }
      orderApi.operLogs(sendData).then((response) => {
        if(response.data.code == '0')
        {
          let data = response.data.body;
          vm.operLogsData = data;
        }else{
          vm.$alert(response.data.message)
        }
      });
    },
    //---------table列表相关逻辑 end-----
    //日志相关逻辑
    getSystermLog() {
      this.logPram.pid = this.pageId;
      this.$refs.jdyJournal.getLogData(1);
    },
    showJournal(){
      this.$refs.jdyJournal.alertJournal();
    }
  },
  filters: {
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
    JdyJournal,
    SeatOfBus,
    PriceDetail,
    ToutristInfo
  },
  created() {
    jdyFn.scrollToTop()
  },

}


</script>
<style scoped>
  .table-custom th{
    width: 20%;
  }
  .table-custom tr td{
    width: 30%;
  }

  .jdy-title{
    padding: 20px 0 15px;
  }

</style>



