<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft noborder">
        <div class="jdy-tab" style="margin:0;padding-right:0">
            <el-button @click="refresh" class="fright mr20 mt10" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            <!-- <el-button @click="orderOut" class="fright mr20 mt10">订单导出</el-button> -->
        </div>
        <div>
            <el-form :model="ruleform" :inline="true" ref="ruleform" class="demo-form" label-width="150px">
                <el-row class="mt10">
                    <el-form-item class="yjk-mb10 yjk-ml100" style="padding-left:10px;" v-show="logindata.uDataLimit == 3">
                        <el-select v-model="ruleform.oSalerCompanyId" placeholder="请选择分公司">
                            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
                        </el-select>                         
                    </el-form-item>
                    <el-form-item class="yjk-mb10" :class="{ paddLeft: logindata.uDataLimit != 3 }">
                        <el-select v-model="ruleform.dateType">
                            <el-option :key="1" label="出团日期" :value="1">
                            </el-option>
                            <el-option :key="2" label="下单日期" :value="2">
                            </el-option>
                            <el-option :key="3" label="支付日期" :value="3">
                            </el-option>                            
                        </el-select>                       
                    </el-form-item>    
                    <el-form-item class="yjk-mb10">
                        <el-date-picker v-model="datePicker" type="daterange" placeholder="选择日期范围" @change="dateRangeChange">
                        </el-date-picker>
                    </el-form-item>                                     
                    <el-form-item class="yjk-mb10 yjk-search">
                        <el-input v-model="ruleform.searchKey" placeholder="请输入产品编号、产品名称、订单号、游客姓名、手机号搜索"></el-input>
                    </el-form-item>
                    <el-form-item class="yjk-mb10" :class="{ paddLeft: logindata.uDataLimit!=3 }">
                        <el-select v-model="ruleform.oPayMethod">
                            <el-option :key="2" label="线下支付" :value="2">
                            </el-option>
                            <el-option :key="3" label="微信支付" :value="3">
                            </el-option>                            
                        </el-select>                       
                    </el-form-item> 
                    <el-form-item class="yjk-mb10" :class="{ paddLeft: logindata.uDataLimit!=3 }">
                        <el-select v-model="ruleform.oType">
                            <el-option :key="1" label="个人" :value="1">
                            </el-option>
                            <el-option :key="2" label="企业" :value="2">
                            </el-option>                            
                        </el-select>                       
                    </el-form-item>
                    <!-- <el-form-item class="yjk-mb10">
                        <el-select v-model="ruleform.pBrand" :remote-method="remote_pBrand" @change="remote_oProductId" :loading="loading" placeholder="请选择产品品牌" v-show="searchType" filterable remote clearable>
                            <el-option v-for="item in brandArr" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10" v-show="searchType">
                        <el-select v-model="ruleform.oProductId" placeholder="请选择产品" :remote-method="remote_oProductId" :disabled="ruleform.pBrand==null||ruleform.pBrand==''" :loading="loading" filterable remote clearable>
                            <el-option v-for="item in productArr" :key="item.id" :label="item.pName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item class="yjk-ml100 yjk-mb10" v-show="!searchType">
                        <el-button type="primary" @click="getTableData(true)">确认查询</el-button>
                        <el-button @click="refresh">清空筛选</el-button>
                    </el-form-item>
                </el-row>
                <!-- <el-row class="mt10" v-show="searchType">
                    <el-form-item label="产品类型:" class="yjk-mb10 yjk-ml100">
                        <el-checkbox-group v-model="ruleform.pTypes">
                            <el-checkbox label="周边短线" name="pTypes"></el-checkbox>
                            <el-checkbox label="国内长线" name="pTypes"></el-checkbox>
                            <el-checkbox label="出境旅游" name="pTypes"></el-checkbox>
                            <el-checkbox label="邮轮" name="pTypes"></el-checkbox>
                            <el-checkbox label="特色旅游" name="pTypes"></el-checkbox>
                            <el-checkbox label="自助游" name="pTypes"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-row>
                <el-row class="mt10" v-show="searchType">
                    <el-form-item label="计调:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oSalerId" :remote-method="remote_oSalerId" :loading="loading" filterable remote :disabled="ruleform.oSalerCompanyId==null||ruleform.oSalerCompanyId==''" clearable>
                            <el-option v-for="item in SalerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报名人:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oBuyerId" :remote-method="remote_oBuyerId" :loading="loading" filterable remote :disabled="ruleform.oBuyerCompanyId==null||ruleform.oBuyerCompanyId==''" clearable>
                            <el-option v-for="item in BuyerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 yjk-mb10">
                        <el-button type="primary" @click="getTableData(true)">确认查询</el-button>
                        <el-button @click="refresh">清空筛选</el-button>
                    </el-form-item>
                </el-row> -->
            </el-form>
        </div>
        <!--jdy-table begin-->
        <div class="jdy-table p10 yjksell">
            <el-table :data="tableData" border class="mt20 all yjk-orderList" highlight-current-row @current-change="handleRowChange">
                <el-table-column label="产品信息" min-width="600" >
                    <template scope="scope" class="yjk-col">
                        <div class="yjk-cellExpand pInfo">
                          <span class="fleft">
                              <span class="otypeTip" v-show="scope.row.oType == 2">企</span>
                              <span class="otypeTip" v-show="scope.row.oType == 1">个</span>
                          </span>
                           <span class="fleft">订单号:{{ scope.row.oOrderNo }}</span>
                           <span class="fleft">团号:{{ scope.row.oGroupOrderNo==null?'无':scope.row.oGroupOrderNo }}</span>
                           <span class="fleft clearfix">预订时间:{{ scope.row.createTime | dateFormat('time')}}</span>
                           <!-- <span class="fright clearfix">游客联系:{{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otName}}({{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otPhone}})</span> -->
                        </div>
                        <div class="ptlr20">
                            <div class="yjk-cellIN textHidden" :title="scope.row.pName">【{{ scope.row.pNo }}】{{ scope.row.pName }}</div>
                            <div class="yjk-cellIN">
                                <span class="yjk-width30">出团:{{ scope.row.sCalendar|dateFormat }}</span>
                                <span class="yjk-width30" v-if="!scope.row.sCalendarBack">回团:{{ scope.row.eCalendar | dateFormat }}</span>
                                <span class="yjk-width30" v-if="scope.row.sCalendarBack">回团:{{ scope.row.sCalendarBack | dateFormat }}</span>
                            </div>
                            <div class="yjk-cellIN noborder">
                                <span class="yjk-width30">出发城市:{{ scope.row.leaveCity }}</span>
                                <span class="yjk-width30">天数:{{ scope.row.pDays }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="买家卖家信息" min-width="300">
                    <template scope="scope">
                        <div class="yjk-cellExpand">
                          <span class="fl clearfix">
                              <span class="otypeTipTwo" v-show="scope.row.ascription == 1">集结</span>
                              <span class="otypeTipTwo" v-show="scope.row.ascription == 0">本地</span>
                          </span>
                           <!-- {{ scope.row.oSalerCompanyName }} -->
                        </div>
                        <div class="personinfo">
                            <div class="yjk-cellIN noborder">
                                <span class="fontcolor-buy">买:</span>
                                {{ scope.row.oBuyerName  }}&nbsp;&nbsp;{{ scope.row.buyerPhone  }}
                                <span class="saleCompanyColor">【{{ scope.row.oBuyerCompanyName }}】</span>
                            </div>
                            <div class="yjk-cellIN noborder">
                                <span class="fontcolor-sale">卖:</span>
                                {{ scope.row.oSalerName  }}&nbsp;&nbsp;{{ scope.row.salerPhone  }}
                                <span class="saleCompanyColor">【{{ scope.row.oSalerCompanyName }}】</span>
                            </div>
                            <div class="yjk-cellIN noborder">
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" min-width="280">
                    <template scope="scope">
                        <div class="yjk-cellExpand">
                            <!-- <el-button type="text" v-show="false">发送短信</el-button> -->
                            <span>支付时间:{{ scope.row.payTime==null?(scope.row.isSallerVoucher==1?"待财务确认":"未支付"):scope.row.payTime}}</span>
                        </div>
                        <div class="ptlr20">
                            <div class="yjk-cellIN">
                                人数:{{scope.row.adultNum}}大/{{scope.row.childNum}}小
                            </div>
                            <div class="yjk-cellIN">
                                销售:{{ scope.row.oMarketPrice|moneyTwoPoints }}
                                <span>
                                    <span v-if="scope.row.oStatus==0" class="yjk-noticeTitle noticePink">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==1 || scope.row.oStatus==11" class="yjk-noticeTitle noticeYellow">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==2" class="yjk-noticeTitle noticeOrange">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==3" class="yjk-noticeTitle noticeGreen">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==4" class="yjk-noticeTitle noticePurple">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==5" class="yjk-noticeTitle noticeBlue">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==6" class="yjk-noticeTitle noticeGray">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==10" class="yjk-noticeTitle noticeBlue">{{ scope.row.oStatus|orderStatus }}</span>
                                </span>
                            </div>
                            <div class="yjk-cellIN noborder">
                                结算:{{ scope.row.oTotalPrice|moneyTwoPoints }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单操作" min-width="250">
                    <template scope="scope" >
                        <div class="yjk-cellExpand">
                          <span class="fright clearfix">
                            <el-button type="success" class="fright mt5 mr10" size="small" @click="showRecord(scope.row.id)" v-if="scope.row.refundRecordStatus != null">退款记录</el-button>
                          </span>
                        </div>
                        <div class="ptlr20 textCenter">
                            <el-button type="primary" @click="orderDetailGoto(scope.row.id)" class="yjk-orderDetailBtn">订单详情</el-button>
                            <!-- <el-button @click="checkContractAlert(scope.row.id)" class="yjk-orderChangeSel">审核合同</el-button> -->
                            <el-select  @change="orderChange" placeholder="订单修改" value="" v-model="orderChangeType[scope.row.id]" class="yjk-orderChangeSel" v-show="scope.row.oStatus!=4" >
                                <!-- <el-option key="0" label="订单修改" value="0" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="1" label="调整金额" value="1" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="2" label="调整座位" value="2" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="3" label="线下支付" value="3" v-show="scope.row.oStatus==0||scope.row.oStatus==1"></el-option> -->
                                <!-- <el-option key="4" label="订单审核" value="4" v-show="scope.row.oStatus==5"></el-option> -->
                                <el-option key="5" label="取消订单" value="4" v-show="scope.row.oStatus != 3 && scope.row.oStatus != 11 && scope.row.oStatus != 10 && scope.row.isSallerVoucher == 0"></el-option>
                                <el-option key="7" label="确认收款" value="7" v-show="showPay == true && scope.row.isSallerVoucher == 1"></el-option>
                                <el-option key="8" label="关闭退款" value="8" v-show="scope.row.refundRecordStatus != null && scope.row.refundRecordStatus == 1"></el-option>
                                <el-option key="9" label="退款确认" value="9" v-show="scope.row.refundRecordStatus != null && scope.row.refundRecordStatus == 1"></el-option>      
                                <!-- <el-option key="10" label="改签确认" value="10"></el-option>
                                <el-option key="11" label="关闭改签" value="11"></el-option> -->
                            </el-select>
                            <!-- <el-button type="primary" @click="quickPay(scope.row.id)" class="yjk-orderDetailBtn" v-show="scope.row.oStatus==0">立即支付</el-button>                             -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->

        </div>
    </div>
    <!--改签确认 弹窗  begin-->
    <jdy-alert title="改签确认" @closeAlert="closeAlert" v-if="changeSignFlag" class="alertCityList showtfcity refund" style="width:800px;">
      <div class="touristHead">
          <div class="tourist-title">订单详情：</div>
      </div>
      <table border="1" class="signlist">
        <tr>
          <td class="borderR borderB">线路名称：{{signConfirmData.lineName}}</td>
          <td class="borderR borderB">团号：{{signConfirmData.sNo}}</td>
          <td class="borderB">出团日期：{{signConfirmData.startDate}}</td>
        </tr>
        <tr>
          <td class="borderR borderB">订单号：{{signConfirmData.pNo}}</td>
          <td class="borderR borderB">订单游客数：{{signConfirmData.pNum}}</td>
          <td class="borderB"></td>
        </tr>
      </table>
      <div class="touristHead">
          <div class="tourist-title">改签游客信息：</div>
      </div>
      <div class="signlist signConfirmTouristsList" style="padding-top:15px;">
          <div class="signConfirmList" v-for="item in signConfirmList" :key="item">
            <span>{{item.ConfirmValue}}</span>
          </div>
      </div>
      <div class="touristHead">
          <div class="tourist-title">改签的出团时间：</div>
      </div>
      <table border="1" class="signlist" style="height:52px;">
        <tr>
          <td class="borderR borderB">出团日期：{{signConfirmData.signStartDate}}</td>
          <td class="borderR borderB">班期编号：{{signConfirmData.scheduleNo}}</td>
          <td class="borderB">出发时间：{{signConfirmData.signStartTime}}</td>
        </tr>
      </table>
      <div class="touristHead">
          <div class="tourist-title">填写核损金额：</div>
      </div>
      <el-form class="signForm" :model="signForm" :rules="rules" ref="signForm" style="margin-top:20px;padding:0 15px;">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="signAmount">
                <el-input v-model.number="signForm.signAmount" clearable placeholder="请输入大于0的整数或者保留两位小数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="saveSignForm('signForm')" type="primary">确认改签</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div> 
    </jdy-alert>
    <!--改签确认 弹窗  end-->
     <!--退款记录 弹窗  begin-->
    <jdy-alert title="退款记录" @closeAlert="closeAlert" v-if="refundRecordFlag" class="alertCityList showtfcity" style="width:800px">
      <div class="jl-alertInnerWrap">
        <div class="jl-alertInner" v-for="item in refundRecordList" :key="item.id">
          <div>
            <span class="infoLine" v-if="item.status != 1">
                <span class="infoTitle">退款金额：</span>
                <span class="redText">{{item.refundAmount | moneyTwoPoints}}</span>
            </span>
            <span class="infoLine">
                <span class="infoTitle">退款状态：</span>
                <span v-if="item.status == 0">退款关闭</span>
                <span v-if="item.status == 1" class="isingText">退款中</span>
                <span v-if="item.status == 2" class="successText">退款成功</span>
            </span>  
            <span class="infoLine" v-if="item.status != 1">
                <span class="infoTitle">退款时间：</span>
                <span>{{item.refundableTime}}</span>
            </span>    
            <span class="infoLine" v-if="item.status != 1">
                <span class="infoTitle">退款人员：</span>
                <span>{{item.refundableSalerName}}</span>
            </span> 
            <span class="infoLine">
                <span class="infoTitle infoContent" v-if="item.type == 1">退款信息：</span>
                <span class="infoTitle infoContent" v-if="item.type == 0">退票信息：</span>
                <span class="infoBlockTwo" v-html="item.ticketInfo"></span>
            </span>    
            <span class="infoLine">
                <span class="infoTitle">申请退款金额：</span>
                <span class="redText">{{item.applyAmount | moneyTwoPoints}}</span>
            </span> 
            <span class="infoLine">
                <span class="infoTitle">申请退款时间：</span>
                <span>{{item.applyRefundTime}}</span>
            </span> 
            <span class="infoLine">
                <span class="infoTitle">申请退款人员：</span>
                <span>{{item.refundableBuyerName}}</span>
            </span>
            <span class="infoLine">
                <span class="infoTitle">申请退款说明：</span>
                <span>{{item.refundExplain}}</span>
            </span>
          </div> 
        </div>
      </div>
    </jdy-alert>
    <!--退款记录 弹窗  end-->
    <!--退款确认 弹窗  begin-->
    <jdy-alert title="退款确认" @closeAlert="closeAlert" v-if="refundConfirmFlag" class="alertCityList showtfcity" style="width:800px">
      <div class="jl-alertInnerWrap">
        <div class="jl-alertInner" style="border:none">
          <div>
            <span class="infoLine">
                  <span class="infoTitle">退款状态：</span>
                  <span v-if="refundRecordListTwo.status == 0">退款关闭</span>
                  <span v-if="refundRecordListTwo.status == 1" class="isingText">退款中</span>
                  <span v-if="refundRecordListTwo.status == 2" class="successText">退款成功</span>
              </span>  
            <span class="infoLine">
                  <span class="infoTitle infoContent">退款信息：</span>
                  <span class="infoBlockTwo" v-html="refundRecordListTwo.ticketInfo"></span>
              </span>    
            <span class="infoLine">
                <span class="infoTitle">申请退款金额：</span>
                <span class="redText">{{refundRecordListTwo.applyAmount | moneyTwoPoints}}</span>
            </span> 
            <span class="infoLine">
                <span class="infoTitle">申请退款时间：</span>
                <span>{{refundRecordListTwo.applyRefundTime}}</span>
            </span> 
            <span class="infoLine">
                <span class="infoTitle">申请退款人员：</span>
                <span>{{refundRecordListTwo.refundableBuyerName}}</span>
            </span>
            <span class="infoLine">
                <span class="infoTitle">申请退款说明：</span>
                <span>{{refundRecordListTwo.refundExplain}}</span>
            </span>
            <span class="infoLine">
                <span class="infoTitle">退款金额：</span>
                <el-form class="infoBlockTwo" :model="refundForm" :rules="rules" ref="refundForm" style="margin-top:20px;">
                  <el-row>
                      <el-col :span="24">
                          <el-form-item prop="refundAmount" style="margin-top:1px">
                            <el-input v-model.number="refundForm.refundAmount" clearable placeholder="请输入大于0的整数或者保留两位小数"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                </el-form>
            </span>
          </div> 
        </div>
      </div>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        <el-button class="fright mt10 mr10" @click="saveConfirm('refundForm')" :disabled="btnFlag">确认</el-button>
      </div>
    </jdy-alert>
    <!--退款确认 弹窗  end-->
    <!--上传支付凭证 弹窗  begin-->
    <jdy-alert title="确认收款：" @closeAlert="closeAlert" v-if="payedFlag" class="alertCityList showtfcity" style="width:1200px">
      <el-table :data="getVouchers" style="width: 100%"  border>
              <el-table-column label="上传时间" prop="createTime"  width="220">
                <template scope="scope">
                  {{ scope.row.createTime | dateFormat('time') }}
                </template>
              </el-table-column>
              <el-table-column label="凭证" prop="url"  min-width="130">
                <template scope="scope">
                  <a :href="h5Url" target="_blank">
                    <span @click="getImg(scope.row.url)">
                      <img :src='scope.row.url' alt="" style="width:150px;height:90px;vertical-align: middle;">
                    </span>
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="凭证状态" prop="fStatus"  min-width="100">
                <template scope="scope">
                  <span v-if="scope.row.fStatus == 0">待确认</span>
                  <span v-if="scope.row.fStatus == 1">已驳回</span>
                  <span v-if="scope.row.fStatus == 2">已确认</span>
                </template>
              </el-table-column>
              <el-table-column label="全款金额" prop="money" min-width="100" class-name="red-font" v-if="this.getVouchers.length > 0 && this.getVouchers[0].type == 0">
                <template scope="scope">
                  {{ scope.row.money | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="首款金额" prop="money" min-width="100" class-name="red-font" v-if="this.getVouchers.length > 0 && this.getVouchers[0].type == 1">
                <template scope="scope">
                  {{ scope.row.money | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="尾款金额" prop="money" min-width="100" class-name="red-font" v-if="this.getVouchers.length > 0 && this.getVouchers[0].type == 2">
                <template scope="scope">
                  {{ scope.row.money | moneyTwoPoints }}
                </template>
              </el-table-column>
              <el-table-column label="上传说明" prop="uploadDesc" min-width="300" class-name="red-font">
                <template scope="scope">
                  {{ scope.row.uploadDesc }}
                </template>
              </el-table-column>
              <el-table-column label="支付单号" prop="transNo" min-width="80">
                <template scope="scope">
                  {{ scope.row.transNo}}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="80">
                <template scope="scope">
                    <el-button type="default" size="mini" @click.native.prevent="voucherError(scope.row)" v-if="scope.row.fStatus == 0">
                        凭证错误
                    </el-button>   
                </template>
              </el-table-column>
            </el-table>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        <el-button class="fright mt10 mr10" @click="savePay" v-show="showSave" :disabled="btnFlag">确认</el-button>
      </div> 
    </jdy-alert>
    <!--上传支付凭证 弹窗  end-->
    <!--调整金额 弹窗  begin-->
    <jdy-alert title="调整金额" @closeAlert="closeAlert" v-if="priceChangeObj.flag" class="alertCityList showtfcity">
        <div class="yjk-alertInner">
            <div>
                <span class="yjk-innerTitle">订单原结算金额:</span>
                <span>￥{{rowData.oRealPrice| moneyTwoPoints}}</span>
            </div>
            <div>
                <span class="yjk-innerTitle">结算金额:</span>
                <span>￥{{rowData.oRealPrice| moneyTwoPoints}}</span>
            </div>
            <div>
                <span class="yjk-innerTitle">调整方式:</span>
                <span>
                    <el-radio class="radio" v-model="priceChangeObj.radio" label="1">订单优惠</el-radio>
                    <el-radio class="radio" v-model="priceChangeObj.radio" label="2">订单补差</el-radio>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle">调整金额:</span>
                <span>
                    <el-input v-model="priceChangeObj.money" placeholder="调整金额" class="yjk-w30"></el-input>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle">参与活动:</span>
                <span>
                    <el-checkbox v-model="priceChangeObj.promotion" ></el-checkbox>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle fleft clearfix">备注:</span>
                <span>
                    <el-input type="textarea" v-model="priceChangeObj.remark" class="yjk-w70">
                    </el-input>
                </span>
            </div>
        </div>
        <div class="alertfoot1 clearfix yjk-alertFoot">
            <div class="pl15 mt5">优惠金额:￥</div>
            <div class="pl15 mt5">调整后结算金额:￥</div>
            <el-button type="primary" class="fright mb25 mr10" :disabled="btnFlag" @click="priceChange_submit">提交</el-button>
            <el-button class="fright mb25 mr10" @click="closeAlert">关闭</el-button>
        </div>
    </jdy-alert>
    <!--调整金额 弹窗  end-->
    <!--取消订单 弹窗  begin-->
    <jdy-alert title="取消订单" @closeAlert="closeAlert" v-if="cancelOrderObj.flag" class="alertCityList showtfcity">
        <div class="yjk-alertInner">
            <div>
                <span class="yjk-innerTitle">订单编号:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oOrderNo" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">订单状态:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oStatus" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">结算价格:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oRealPrice" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">买家:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oBuyerName" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle redstar">取消原因:</span>
                <span class="w70per inlineblock">
                    <el-input v-model="cancelOrderObj.reason"></el-input>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle">违约金:</span>
                <span class="w70per inlineblock">
                    <el-input v-model="cancelOrderObj.money"></el-input>
                </span>
            </div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="cancelOrder_submit">提交</el-button>
            <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        </div>
    </jdy-alert>
    <!--取消订单 弹窗  end-->
    <!--线下支付 弹窗  begin-->
    <jdy-alert title="线下支付" @closeAlert="closeAlert" v-if="offlinePayObj.flag" class="alertCityList showtfcity">
        <div class="yjk-alertInner">
            <div>
                <span class="yjk-innerTitle">订单编号:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oOrderNo" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">产品名称:</span>
                <span class="textHidden w70per inlineblock" :title="rowData.pName"><el-input v-model="rowData.pName" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">结算价格:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oRealPrice" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">买家:</span>
                <span class="w70per inlineblock"><el-input v-model="rowData.oBuyerCompanyName" :disabled="true"></el-input></span>
            </div>
            <div>
                <span class="yjk-innerTitle">支付日期:</span>
                <span>
                    <span class="w70per inlineblock"><el-date-picker v-model="offlinePayObj.opPayTime" type="date" placeholder="支付日期"></el-date-picker></span>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle fleft clearfix">备注:</span>
                <span>
                    <el-input type="textarea" v-model="offlinePayObj.opComments" class="yjk-w70">
                    </el-input>
                </span>
            </div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="offlinePay_submit">提交</el-button>
            <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        </div>
    </jdy-alert>
    <!--线下支付 弹窗  end-->
    <!-- 审核合同 -->
    <jdy-alert title="审核合同" @closeAlert="closeAlert" v-if="checkContractObj.flag" class="alertCityList showtfcity">
        <div class="alertHead">
            <el-button class="fright mt10 mr10 btnInTab" @click="closeAlert">查看合同</el-button>
        </div>        
        <div class="yjk-alertInner">
            <div class="contentTitle">合同补充约定</div>
            <div class="contentBody"></div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button class="fright mt10 mr10 btnInTab" @click="closeAlert">不通过</el-button>
            <el-button type="primary" class="fright mt10 mr10 btnInTab" @click="closeAlert">通过</el-button>
        </div>        
    </jdy-alert>    

</div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import API from "@/pages/sale/api/index";

export default {
  name: "orderbuyer",
  data() {
    return {
      btnFlag: false,
      searchType: 0, //搜索方式
      // 用于搜索条件筛选
      ruleform: {
        currPage: 1,
        pageSize: 10,
        statuses: [], //状态
        oStatus:'',
        dateType: 2, //日期类型
        oPayMethod: null,//支付类型
        oType: null,//用户类型
        dateStart: dateChange(-30), //起始日期
        dateEnd: dateChange(0), //结束日期
        oBuyerCompanyId: null, //报名社id
        oBuyerId: null, //报名人id
        orderType: 0, //类型:卖家订单
        pBrand: null, //品牌id
        oProductId: null, //产品id
        // pTypes:[10,11,20,30,40,50],//产品类型
        pTypes: [],
        oSalerCompanyId: null, //供应商id
        oSalerId: null, //供应商计调人员id
        // oPayMethod: null, //支付方式
        searchKey: "", //快速查询
        export: false //是否导出
      },
      datePicker: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30),
        new Date()
      ], //查询日期
      // 产品类型基础
      productType: [
        {
          value: 10,
          label: "周边短线"
        },
        {
          value: 11,
          label: "国内长线"
        },
        {
          value: 20,
          label: "出境旅游"
        },
        {
          value: 30,
          label: "邮轮"
        },
        {
          value: 40,
          label: "特色旅游"
        },
        {
          value: 50,
          label: "自助游"
        }
      ],
      //支付方式基础
      payType: [
        {
          value: 0,
          label: "在线支付"
        },
        {
          value: 1,
          label: "信用支付"
        },
        {
          value: 2,
          label: "线下支付"
        },
        {
          value: 3,
          label: "未支付"
        },
        {
          value: 4,
          label: "全部"
        }
      ],
      rules: {
        refundAmount: [
          {
            type: "number",
            required: true,
            message: "请输入金额",
            trigger: "change"
          }
        ],
        signAmount: [
          {
            type: "number",
            required: true,
            message: "请输入金额",
            trigger: "change"
          }
        ],
      },
      brandArr: [], // 产品品牌基础
      productArr: [], //产品基础
      SalerCompanyIdArr: [], //单位基础
      SalerIdArr: [], //计调人员基础
      BuyerCompanyIdArr: [], //报名社基础
      BuyerIdArr: [], //报名人基础

      tableData: [], //表格
      jdytabActive: null, //是否被选中
      isReturn: false, //是否退票
      orderChangeType: [], //订单修改按钮
      orderTotal: {
        statuses_0: 0,
        statuses_1: 0,
        statuses_2: 0,
        statuses_3: 0,
        statuses_4: 0,
        statuses_6: 0,
        statuses_10: 0,
        statuses_11: 0
      },
      // 分页
      currentPage: 1, //列表当前所在页,
      pageSize: 10,
      tableDataTotal: 0,
      fullscreenLoading: false, //加载
      loading: false, //select远程查询加载
      logindata: '', //登陆数据
      rowData: null, //被选中数据
      // 调整金额弹窗
      priceChangeObj: {
        flag: false,
        radio: null,
        money: null,
        promotion: null,
        remark: ""
      },
      // 线下支付弹窗
      offlinePayObj: {
        flag: false,
        opPayTime: null,
        opComments: ""
      },
      // 取消订单
      cancelOrderObj: {
        flag: false,
        money: null,
        reason: null
      },
      // 审核合同
      checkContractObj: {
        flag: false
      },
      downloadUrl: "",
      //改签确认
      changeSignFlag:false,
      signConfirmData:{
        lineName:'马尔代夫5日游',
        sNo:'GC-LBL-18050101-0192',
        startDate:'2018/3/1',
        pNo:'JDY201802271055070789',
        pNum:'4',
        signStartDate:'2018/3/1',
        scheduleNo:'GC-LBL-18050101-0192',
        signStartTime:'08：00：00'
      },
      signForm:{
        signAmount:'',
      },
      signConfirmList:[
        {
          ConfirmValue:'张三-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张四-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张五-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张刘-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张七-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张八-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张三-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张四-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张五-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张刘-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张七-330810198912011234-成人票'
        },
        {
          ConfirmValue:'张八-330810198912011234-成人票'
        }
      ],
      //退款记录
      refundRecordFlag: false,
      refundRecordList:[],
      //退款确认
      refundConfirmFlag:false,
      refundForm:{
        refundAmount:'',
        orderId:'',
      },
      refundRecordListTwo:[],
      //上传支付凭证
      payedFlag: false,
      h5Url: "",
      getVouchers: [
        {
          url: "",
          fStatus: "",
          money: "",
          transNo: "",
          createTime: ""
        }
      ],
      showSave:true,
      menuData:null,
      showPay: false
    };
  },
  mounted() {
    setTimeout(()=>{
      console.log(window.menuData,'menuData')
      this.menuData = window.menuData;
      if(this.menuData.indexOf("comfirmPay") != -1){
        this.showPay = true;
      }
    },500)
    this.logindata = JSON.parse(sessionStorage.loginData);
    this.ruleform.oSalerCompanyId = this.logindata.uCompanyId;
    this.getTableData();
    this.remote_oSalerCompanyId();
    this.logindata.uDataLimit == 3 && this.remote_oBuyerCompanyId();
  },
  methods: {
    //图片预览
    getImg(url) {
      this.h5Url = url;
    },
    // 获取表格
    getTableData() {
      this.searchType == 0 && (this.ruleform.pTypes = []);
      var temptype = this.ruleform.pTypes;
      let params = JSON.parse(JSON.stringify(this.ruleform));
      for (let i = 0; i < params.pTypes.length; i++) {
        switch (params.pTypes[i]) {
          case "周边短线":
            params.pTypes[i] = 10;
            break;
          case "国内长线":
            params.pTypes[i] = 11;
            break;
          case "出境旅游":
            params.pTypes[i] = 20;
            break;
          case "邮轮":
            params.pTypes[i] = 30;
            break;
          case "特色旅游":
            params.pTypes[i] = 40;
            break;
          case "自助游":
            params.pTypes[i] = 50;
            break;
        }
      }
      API.orderProdList(params).then(response => {
        if (response.body.code == 0) {
          let data = response.body.body;
          this.tableData = data.list;
          this.tableData.forEach(value => {
            //回程日期
            value.eCalendar = value.sCalendar + (value.pDays - 1) * 3600 * 1000 * 24;
          });
          this.tableDataTotal = data.total;
        } else {
          this.$alert(response.body.message)
        }
      });
    },
    // 页头切换
    jdytab(index) {
      if (index == null) {
        // this.ruleform.statuses=this.isReturn?[0,1,2,3,4]:[0,1,2,3];
        this.ruleform.oStatus = '';
      } else {
        this.ruleform.oStatus = index;
      }
      this.jdytabActive = index;
      this.getTableData();
    },
    //日期切换
    dateRangeChange(value) {
      console.log(typeof value, value);
      if (value) {
        let values = value.split(" - ");
        this.ruleform.dateStart = values[0];
        this.ruleform.dateEnd = values[1];
      }
    },
    // 是否选中退票
    isReturnFn() {
      this.ruleform.statuses = this.isReturn ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
      this.getTableData();
    },
    //分页
    handleCurrentChange(val) {
      if (val) {
        this.ruleform.currPage = val;
        this.ruleform.pageNum = val;
        this.getTableData();
      }
    },
    // 订单修改
    orderChange(val) {
      switch (val) {
        case "1":
          this.priceChangeObj.flag = true;
          break;
        case "2":
          // this.setChangeAlert();
          break;
        case "3":
          this.offlinePayObj.flag = true;
          break;
        case "4":
          this.cancelOrderObj.flag = true;
          break;
        case "7":
          this.uploadPayed(this.rowData.id);
          break;
        case "8":
          this.closeRefund(this.rowData.id)
          break;
        case "9":
        console.log(this.rowData.id,'this.rowData.id')
          this.refundConfirm(this.rowData.id);
          break;
        case "10":
          this.changeSignFun(this.rowData.id);
          break;
        case "11":
          this.closeSignFun(this.rowData.id);
          break;
      }
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    // 订单详情跳转
    orderDetailGoto(orderId) {
      this.$router.push({ name: "orderSellerDetail", query: { id: orderId } });
    },
    // 调整金额
    priceChange_submit() {
      console.log("123", this.rowData);
    },
    //改签确认相关
    changeSignFun(id){
      this.changeSignFlag = true;
    },
    saveSignForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnFlag = true;
          var unpay = this.signForm.signAmount;
          var reg = /^\d+(?:\.\d{1,2})?$/; //输入框金额校验规则
            //判断保存时是否为尾款支付，需要进行金额校验
            if (!reg.test(unpay)) {
              this.$message.error("请输入大于0的整数或者保留两位小数");
            } else {
              this.$http
                .post(
                  api_prefix + "/orderRefundRecord/confirmRefundRecord",
                  this.signForm
                )
                .then(
                  response => {
                    if (response.body.code == 0) {
                      setTimeout(() => {
                        this.closeAlert();
                        this.getTableData();
                        this.btnFlag = false;
                      }, 500);
                      this.$message.success("改签成功");
                    } else {
                      this.btnFlag = false;
                      this.$alert(response.data.message, "温馨提示", {
                        confirmButtonText: "确定",
                        callback: action => {}
                      });
                    }
                  },
                  response => {
                      this.$alert(response.data.message, "温馨提示", {
                      confirmButtonText: "确定",
                      callback: action => {}
                    });
                  }
                );
            }
        } else {
          this.$message.error("改签失败");
          return false;
        }
      });
    },
    //关闭改签
    closeSignFun(id){
      this.$confirm("确定关闭改签？为避免纠纷，请确保游客已同意关闭改签", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.post(api_prefix + "/orderRefundRecord/closeOrderRefundRecord",{
            orderId:id
          }).then(
            response => {
              if (response.data.code == 0) {
                this.closeAlert();
                this.getTableData();
                setTimeout(() => {
                  this.$message({
                    showClose: true,
                    message: "关闭改签成功",
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
        .catch(() => {
          this.closeAlert();
          this.$message({
            type: 'info',
            message: '已取消关闭改签'
          }); 
        });
    },
    //关闭退款
    closeRefund(id){
      this.$confirm("确定关闭退款？为避免纠纷，请确保游客已同意关闭退款", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.post(api_prefix + "/orderRefundRecord/closeOrderRefundRecord",{
            orderId:id
          }).then(
            response => {
              if (response.data.code == 0) {
                this.closeAlert();
                this.getTableData();
                setTimeout(() => {
                  this.$message({
                    showClose: true,
                    message: "关闭退款成功",
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
        .catch(() => {
          this.closeAlert();
          this.$message({
            type: 'info',
            message: '已取消关闭退款'
          }); 
        });
    },
    //退款记录相关
    showRecord(id){
      this.refundRecordFlag = true;
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
      this.$http
        .get(
          api_prefix + "/orderRefundRecord/getRefundRecord/" + id +"/0",
        )
        .then(response => {
          if (response.body.code == 0) {
            this.refundRecordList = response.body.body;
            console.log(this.refundRecordList,'this.refundRecordList')
          } else {
              this.$alert(response.data.message, "温馨提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        });
    },
    //退款确认相关
    refundConfirm(id){
      this.refundConfirmFlag = true;
      this.refundForm.orderId = id;
      console.log(this.refundConfirmFlag,'this.refundConfirmFlag')
      this.$http
        .get(
          api_prefix + "/orderRefundRecord/getRefundRecord/" + id +"/1",
        )
        .then(response => {
          if (response.body.code == 0) {
            this.refundRecordListTwo = response.body.body;
            console.log(this.refundRecordListTwo,'this.refundRecordListTwo')
          } else {
              this.$alert(response.data.message, "温馨提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        });
    },
    saveConfirm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnFlag = true;
          var unpay = this.refundForm.refundAmount;
          var reg = /^\d+(?:\.\d{1,2})?$/; //输入框金额校验规则
            //判断保存时是否为尾款支付，需要进行金额校验
            if (!reg.test(unpay)) {
              this.$message.error("请输入大于0的整数或者保留两位小数");
            } else {
              this.$http
                .post(
                  api_prefix + "/orderRefundRecord/confirmRefundRecord",
                  this.refundForm
                )
                .then(
                  response => {
                    if (response.body.code == 0) {
                      setTimeout(() => {
                        this.closeAlert();
                        this.getTableData();
                        this.btnFlag = false;
                      }, 500);
                      this.$message.success("退款成功");
                    } else {
                      this.btnFlag = false;
                      this.$alert(response.data.message, "温馨提示", {
                        confirmButtonText: "确定",
                        callback: action => {}
                      });
                    }
                  },
                  response => {
                      this.$alert(response.data.message, "温馨提示", {
                      confirmButtonText: "确定",
                      callback: action => {}
                    });
                  }
                );
            }
        } else {
          this.$message.error("退款失败");
          return false;
        }
      });
    },
    //上传支付凭证相关
    uploadPayed(id) {
      this.getVouchersData(id);
      this.payedFlag = true;
    },
    //获得支凭证记录列表
    getVouchersData(id) {
      this.$http
        .post(api_prefix + "/Order/getVouchers", {
          orderId: id,
          fStatus: 0
        })
        .then(
          response => {
            if (response.data.code == 0) {
              this.getVouchers = response.data.body;
              if(this.getVouchers.length == 1){
                  if(this.getVouchers[0].fStatus == 1){
                      this.showSave == false;
                  }else{
                      this.showSave == true;
                  }
              }
            } else {
              this.$alert(response.data.message);
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //驳回凭证
    voucherError(row) {
      row.fStatus = 1;
      let a = new Array(row);
      this.$http.post(api_prefix + "/Order/reviewVoucher", a).then(
        response => {
          if (response.data.code == 0) {
            this.$message.success("驳回成功");
          } else {
            this.$alert(response.data.message);
          }
        },
        response => {
          console.log("出错了");
        }
      );
    },
    //确认收款
    savePay(){
        this.$confirm('确认所有凭证信息无误? 确认后将无法修改！', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.btnFlag = false;
            for (var k = 0, length = this.getVouchers.length; k < length; k++) {
            this.getVouchers[k].fStatus=2
            }
            this.$http.post(api_prefix + "/Order/reviewVoucher", this.getVouchers).then(
                response => {
                if (response.data.code == 0) {
                    setTimeout(() => {
                    this.closeAlert();
                    this.getTableData();
                    this.btnFlag = true;
                    }, 500);
                    this.$message.success("确认成功");
                } else {
                    this.btnFlag = false;
                    this.$alert(response.data.message);
                }
                },
                response => {
                console.log("出错了");
                }
            );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          });          
        });
    },
    // 线下支付
    offlinePay_submit() {
      this.btnFlag = true;
      let param = {
        opOrderId: this.rowData.id,
        opComments: this.offlinePayObj.opComments,
        opPayTime: this.offlinePayObj.opPayTime.FormatDate("yyyy-MM-dd"),
        pageSize: 10,
        currPage: 1
      };
      API.offlinePay(param).then(response => {
        this.btnFlag = false;
        if (response.body.success == true) {
          this.$message.success("线下支付成功");
          this.getTableData();
        } else {
        }
        this.orderChangeType = [];
        this.offlinePayObj.opComments = "";
        this.offlinePayObj.opPayTime = null;
        this.closeAlert();
      });
    },
    // 取消订单
    cancelOrder_submit() {
      this.btnFlag = true;
      //取消原因为必填
      if (!this.cancelOrderObj.reason) {
        this.btnFlag = false;
        return this.$message.info("请填写取消订单原因！");
      } else {
        if (this.cancelOrderObj.reason.length > 100) {
          this.btnFlag = false;
          return this.$message.info("取消订单原因不要超过100个字！");
        }
      }
      let param = {
        orderId: this.rowData.id,
        money: this.cancelOrderObj.money,
        remark: this.cancelOrderObj.reason,
        oOrderNo: this.rowData.oOrderNo,
        saler: true,
        pageSize: 20,
        currPage: 1
      };
      API.cancelOrder(param).then(response => {
        this.btnFlag = false;
        if (response.body.success == true) {
          this.$message.success("取消订单操作成功");
          this.getTableData();
        } else {
          this.$message.error("取消订单操作失败");
        }
        this.orderChangeType = [];
        this.cancelOrderObj.money = null;
        this.cancelOrderObj.reason = null;
        this.closeAlert();
      });
    },
    // // 出团通知书
    // ProofAlert(){
    //     this.$router.push({name:'groupNoticePrint',query:{id:this.rowData.id}})
    // },
    // // 组团社通知单
    // GroupProofAlert(){
    //     this.$router.push({name:'groupConfirmPrint',query:{id:this.rowData.id}})
    // },
    //发送短信
    sendMessageAlert() {
      this.$confirm("确定发送短信?", "温馨提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: this.rowData.id,
            pageSize: 20,
            currPage: 1
          };
          API.sendMessage(param).then(response => {
            if (response.body.success == true) {
              this.$message.success("短信发送成功");
            } else {
              this.$message.error("短信发送失败");
            }
          });
        })
        .catch(() => {});
    },
    closeAlert() {
      this.btnFlag = false;
      this.orderChangeType = [];
      this.priceChangeObj.flag = false;
      this.offlinePayObj.flag = false;
      this.cancelOrderObj.flag = false;
      this.checkContractObj.flag = false;
      this.payedFlag = false;
      this.changeSignFlag = false;
      this.refundRecordFlag = false;
      this.refundConfirmFlag = false;
      this.refundForm.refundAmount = '';
      this.getTableData();
      $(".alertbgg").remove();
    },
    // 刷新按钮
    refresh() {
      (this.ruleform = {
        currPage: 1,
        pageSize: 10,
        statuses: [], //状态
        oStatus:'',
        dateType: 2, //日期类型
        oPayMethod: null,//支付类型
        oType: null,//用户类型
        dateStart: dateChange(-30), //起始日期
        dateEnd: dateChange(0), //结束日期
        oBuyerCompanyId: null, //报名社id
        oBuyerId: null, //报名人id
        orderType: 0, //类型:卖家订单
        pBrand: null, //品牌id
        oProductId: null, //产品id
        // pTypes:[],//产品类型
        pTypes: [],
        oSalerCompanyId: '', //供应商id
        oSalerId: null, //供应商计调人员id
        oPayMethod: null, //支付方式
        searchKey: "", //快速查询
        export: false //是否导出
      }),
        (this.datePicker = [
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30),
          new Date()
        ]); //查询日期
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
        this.currentPage = 1;
        this.getTableData();
      }, 1000);
    },
    // 订单导出
    orderOut() {
      let params = JSON.parse(JSON.stringify(this.ruleform));
      let days = window.DateDiff(params.dateEnd, params.dateStart);
      if (days > 31) {
        return this.$message.info("订单导出时间跨度不能超过31天！");
      }
      for (let i = 0; i < params.pTypes.length; i++) {
        switch (params.pTypes[i]) {
          case "周边短线":
            params.pTypes[i] = 10;
            break;
          case "国内长线":
            params.pTypes[i] = 11;
            break;
          case "出境旅游":
            params.pTypes[i] = 20;
            break;
          case "邮轮":
            params.pTypes[i] = 30;
            break;
          case "特色旅游":
            params.pTypes[i] = 40;
            break;
          case "自助游":
            params.pTypes[i] = 50;
            break;
        }
      }
      params.export = true;
      this.downloadUrl = `${api_prefix}Order/export?`;
      if (params.oStatus != '') {
        let tempstaut = "oStatus=";
        tempstaut += params.oStatus;
        this.downloadUrl += `${tempstaut}&`;
      }
    //   if (params.pTypes.length != 0) {
    //     let temppTypes = "statuses=";
    //     temppTypes += params.temppTypes.join(",");
    //     this.downloadUrl += `${temppTypes}&`;
    //   }
      delete params.pTypes;
      delete params.statuses;
      for (let key in params) {
        if (params[key] !== null && params[key] !== "") {
          this.downloadUrl += `${key}=${params[key]}&`;
        }
      }
      location.href = this.downloadUrl;
    },
    // 查询产品品牌
    remote_pBrand(key) {
      let param = {
        pageSize: 20,
        currPage: 1,
        bDel: 0,
        bCompanyId: this.logindata.uCompanyId,
        bName: $.trim(key)
      };
      this.loading = true;
      API.brandList(param).then(response => {
        if (response.body.code == 0) {
          this.brandArr = response.body.body.resultList;
        } else {
        }
        this.loading = false;
      });
    },
    // 查询产品
    remote_oProductId(key) {
      let param = {
        puserId: null,
        companyId: this.logindata.uCompanyId,
        pName: $.trim(key),
        pBrand: this.ruleform.pBrand,
        pType: "null",
        pageSize: 20,
        currPage: 1
      };
      this.loading = true;
      API.productList(param).then(response => {
        if (response.body.code == 0) {
          this.productArr = response.body.body.resultList;
        } else {
        }
        this.loading = false;
      });
    },
    // 查询供应商
    remote_oSalerCompanyId(key) {
      this.$http
        .post(
          api_prefix + "Company/index",
          { type: 0, pageIndex: 1, fastSearchStr: $.trim(key) },
          { emulateJSON: true }
        )
        .then(response => {
          if (response.body.code == 0) {
            this.SalerCompanyIdArr = response.body.body.list;
          } else {
          }
        });
    },
    // 查询计调人员
    remote_oSalerId(key) {
      if (this.ruleform.oSalerCompanyId == "") {
        return (this.ruleform.oSalerId = null);
      }
      let param = {
        puserId: null,
        companyId: this.ruleform.oSalerCompanyId,
        pName: key,
        pBrand: this.ruleform.pBrand,
        pType: "null",
        pageSize: 20,
        currPage: 1
      };
      this.loading = true;
      API.userList(param).then(response => {
        if (response.body.code == 0) {
          this.SalerIdArr = response.body.body;
        } else {
        }
        this.loading = false;
      });
    },
    // 查询报名社
    remote_oBuyerCompanyId(key) {
      this.$http
        .post(
          api_prefix + "Company/index",
          { pid: 0, searchType: 1, pageIndex: 1, fastSearchStr: $.trim(key) },
          { emulateJSON: true }
        )
        .then(response => {
          if (response.body.code == 0) {
            this.BuyerCompanyIdArr = response.body.body.list;
          } else {
          }
        });
    },
    // 查询报名人
    remote_oBuyerId(key) {
      if (this.ruleform.oBuyerCompanyId == "") {
        return (this.ruleform.oBuyerId = null);
      }
      let param = {
        puserId: null,
        companyId: this.oBuyerCompanyId,
        pName: key,
        pBrand: this.ruleform.pBrand,
        pType: "null",
        pageSize: 20,
        currPage: 1
      };
      this.loading = true;
      API.userList(param).then(response => {
        if (response.body.code == 0) {
          this.BuyerIdArr = response.body.body;
        } else {
        }
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 行点击事件
    handleRowChange(row) {
      console.log("行点击事件", row);
      if(row){
        this.rowData = row;
      }
      // switch(this.rowData.oStatus){
      //     case 0:
      //         this.rowData.oStatus='待确认';
      //         break;
      //     case 1:
      //         this.rowData.oStatus='已预约';
      //         break;
      //     case 2:
      //         this.rowData.oStatus='收款中';
      //         break;
      //     case 3:
      //         this.rowData.oStatus='已订购';
      //         break;
      //     case 4:
      //         this.rowData.oStatus='已退票';
      //         break;
      // }
    }
  },
  filters: {},
  components: {
    jdyAlert
  }
};
</script>

<style>
.jdy-tab div.yjk-number {
  display: inline-block;
  color: #ff7a33;
  height: inherit;
  position: absolute;
  bottom: 0;
  left: 70%;
}

.yjksell .el-table__row > td:nth-child(1),
.yjksell .el-table__row > td:nth-child(2),
.yjksell .el-table__row > td:nth-child(3) {
  padding-bottom: 12px;
}
.yjksell .el-table__row > td:nth-child(4) > .cell {
  height: 175px;
}
.alertHead {
  width: 100%;
  height: 50px;
  background: #f9fafc;
  border-bottom: 1px solid #d7dfe3;
}
.touristHead {
  width: 100%;
  height: 50px;
  background: #f9fafc;
  border-bottom: 1px solid #d7dfe3;
  /* display: flex;
    flex-direction: column;  
    position: relative;   */
}
.tourist-title {
  /* flex:1; */
  padding-left: 15px;
  line-height: 50px;
  font-size: 14px;
}
.paddLeft {
  padding-left: 10px;
}
.jl-alertInnerWrap{
  max-height:601px;
  overflow-y:scroll;
}
.jl-alertInner{
  border-bottom: 2px solid #999999;
}
.jl-alertInner:last-child{
  border: none;
}
.jl-alertInner .infoLine .infoTitle{
  height: 100%;
  float: left;
  margin-right: 15px;
  text-align: center;
  line-height: 50px;
  background-color: #F0F0F0;
  width: 25%;
}
.jl-alertInner .infoLine .infoContent{
  overflow:hidden; 
  padding-bottom:9999px; 
  margin-bottom:-9999px;
}
.jl-alertInner .infoLine {
  width: 100%;
  min-height: 50px;
  display: inline-block;
  border-bottom: 1px solid #EDF3F7;
  line-height: 50px;
}
.jl-alertInner .infoBlock{
  width: 65%;
  float: right;
  line-height: 50px;
}
.jl-alertInner .infoBlockTwo{
  width: 65%;
  line-height: 30px;
  display: inline-block;
}
.isingText{
  color:#13CD65;
}
.successText{
  color: #467BD3;
}
.redText{
  color: #FF4500;
}
</style>
