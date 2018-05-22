<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft noborder">
        <div class="jdy-tab" style="margin:0;padding-right:0">
            <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">所有订单
                <span></span>
            </a>
            <!-- <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">待确认&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_0}}</div>
                <span></span>
            </a> -->
            <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已报名&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_1}}</div>
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(10)" :class="{ active: jdytabActive==10 }">已首款&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_10}}</div>
                <span></span>
            </a>
            <!-- <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">收款中&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_2}}</div>
                <span></span>
            </a> -->
            <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">已全款&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_3}}</div>
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">已取消&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_4}}</div>
                <span></span>
            </a>
            <!-- <el-checkbox v-model="isReturn" @change="isReturnFn" class="isreturn" v-show="jdytabActive==null">是否包括退票</el-checkbox> -->
            <el-button @click="refresh" class="fright mr20 mt10" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            <el-button @click="orderOut" class="fright mr20 mt10">订单导出</el-button>
            <!-- <el-button @click="DownLoadFile" class="fright mr20 mt10">post导出</el-button> -->
        </div>
        <div>
            <el-form :model="ruleform" :inline="true" ref="ruleform" class="demo-form" label-width="150px">
                <el-row class="mt10">
                    <el-form-item class="yjk-mb10 yjk-ml100" style="padding-left:10px;" v-show="logindata.uDataLimit == 3">
                        <el-select v-model="ruleform.oBuyerCompanyId" placeholder="请选择分公司">
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
                    <el-form-item class="yjk-mb10">
                        <el-select v-model="ruleform.alterTicketStatus">
                            <el-option :key="0" label="改签申请中" :value="0">
                            </el-option>
                            <el-option :key="1" label="已改签" :value="1">
                            </el-option>
                            <el-option :key="2" label="改签失败" :value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10">
                        <el-select v-model="ruleform.pBrand" :remote-method="remote_pBrand" @change="remote_oProductId" :loading="loading" placeholder="请选择产品品牌" v-show="searchType" filterable remote clearable>
                            <el-option v-for="item in brandArr" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10" v-show="searchType">
                        <el-select v-model="ruleform.oProductId" placeholder="请选择产品" :remote-method="remote_oProductId" :disabled="ruleform.pBrand==null||ruleform.pBrand==''" :loading="loading" filterable remote clearable>
                            <el-option v-for="item in productArr" :key="item.id" :label="item.pName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 yjk-mb10" v-show="!searchType">
                        <el-button type="primary" @click="getTableData(true)">确认查询</el-button>
                        <el-button @click="refresh">清空筛选</el-button>
                    </el-form-item>
                    <el-form-item class="yjk-mb10 yjk-ml100 fright clearfix">
                        <!-- <el-select v-model="searchType">
                            <el-option :key="0" label="简易搜索" :value="0">
                            </el-option>
                            <el-option :key="1" label="精确搜索" :value="1">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                </el-row>
                <el-row class="mt10" v-show="searchType">
                    <el-form-item label="产品类型:" class="yjk-mb10 yjk-ml100">
                        <el-checkbox-group v-model="ruleform.pTypes">
                            <el-checkbox label="周边短线" name="pTypes"></el-checkbox>
                            <el-checkbox label="国内长线" name="pTypes"></el-checkbox>
                            <el-checkbox label="出境旅游" name="pTypes"></el-checkbox>
                            <el-checkbox label="邮轮" name="pTypes"></el-checkbox>
                            <el-checkbox label="特色旅游" name="pTypes"></el-checkbox>
                            <el-checkbox label="自助游" name="pTypes"></el-checkbox>
                            <el-checkbox label="单一资源+拍" name="pTypes"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-row>
                <el-row class="mt10" v-show="searchType">
                    <el-form-item label="计调:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oSalerId" :remote-method="remote_oSalerId" :loading="loading" filterable remote :disabled="ruleform.oSalerCompanyId==null||ruleform.oSalerCompanyId==''" clearable>
                            <el-option v-for="item in SalerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="支付方式:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oPayMethod">
                            <el-option v-for="item in payType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="报名社:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oBuyerCompanyId" :remote-method="remote_oBuyerCompanyId" @change="remote_oBuyerId" :loading="loading" filterable remote clearable>
                            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="报名人:" class="yjk-ml100 yjk-mb10">
                        <el-select v-model="ruleform.oBuyerId" :remote-method="remote_oBuyerId" :loading="loading" filterable remote :disabled="ruleform.oBuyerCompanyId==null||ruleform.oBuyerCompanyId==''" clearable>
                            <el-option v-for="item in BuyerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 yjk-mb10">
                        <el-button type="primary" @click="getTableData(true)">确认查询</el-button>
                        <el-button @click="refresh">清空筛选</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <!--jdy-table begin-->
        <div class="jdy-table p10 yjksell">
            <el-table :data="tableData" border class="mt20 all yjk-orderList" highlight-current-row @current-change="handleRowChange">
                <el-table-column type="expand">
                  <template scope="scope">
                    <el-table :data="scope.row.subOrders" border class="all yjk-orderList" highlight-current-row @current-change="handleRowChangeIn">
                        <el-table-column label="产品信息" min-width="600" >
                            <template scope="scope" class="yjk-col">
                                <div class="yjk-cellExpand pInfo">
                                  <span class="fleft">
                                      <span class="otypeTip" v-show="scope.row.oType == 2">企</span>
                                      <span class="otypeTip" v-show="scope.row.oType == 1">个</span>
                                  </span>
                                  <span class="fleft">订单号:{{ scope.row.oOrderNo }}</span>
                                  <span class="fleft">团号:{{ scope.row.oGroupOrderNo==null?'无':scope.row.oGroupOrderNo }}</span>
                                  <span class="fleft clearfix">预订时间:{{ scope.row.createTime|dateFormat('time')}}</span>
                                  <!-- <span class="fright clearfix">游客联系:{{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otName}}({{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otPhone}})</span> -->
                                </div>
                                <div class="ptlr20">
                                    <div class="yjk-cellIN textHidden" :title="scope.row.pName">【{{ scope.row.pNo }}】{{ scope.row.pName }}</div>
                                    <div class="yjk-cellIN">
                                        <span class="yjk-width30">出团:{{ scope.row.sCalendar | dateFormat }}</span>
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
                                      <span class="otypeTip" v-show="scope.row.orderNegId!=null">负</span>
                                  </span>
                                  <!-- {{ scope.row.oSalerCompanyName }} -->
                                </div>
                                <div class="personinfo">
                                    <div class="yjk-cellIN noborder">
                                        <span class="fontcolor-buy">买:</span>
                                        <span class="link" @click="getSaleManage(scope.row.oBuyerId,scope.row.buyerStype)"><a href="javascript:;" class="link">{{ scope.row.oBuyerName  }}</a></span>&nbsp;&nbsp;{{ scope.row.buyerPhone  }}
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
                                      <el-tooltip effect="light"  placement="bottom-start">
                                        <div slot="content">
                                          <div v-for="item in scope.row.priceDetails" :key="item.id">
                                            <span>{{item.opPriceName}}：{{item.opNum}}份  x {{item.opPrice|moneyTwoPoints}}</span>
                                          </div>
                                        </div>
                                        <span>人数:{{scope.row.adultNum}}大/{{scope.row.childNum}}小</span>
                                      </el-tooltip>
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
                                    <el-button type="primary" @click="orderDetailGoto(scope.row)" class="yjk-orderDetailBtn">订单详情</el-button>
                                    <!-- <el-button @click="checkContractAlert(scope.row.id)" class="yjk-orderChangeSel">审核合同</el-button> -->
                                    <el-select  @change="orderChange" placeholder="订单修改" value="" v-model="orderChangeType[scope.row.id]" class="yjk-orderChangeSel"  v-show="scope.row.alterTicketId!=null">
                                      <el-option key="5" label="取消订单" value="4" v-show="(scope.row.oStatus==1 && scope.row.offlineStatus == null)|| scope.row.oStatus==0 || scope.row.oStatus == 6"></el-option>
                                      <el-option key="6" label="编辑游客" value="6" v-show="scope.row.oStatus != 0 && scope.row.oStatus != 6"></el-option>
                                      <el-option key="7" label="上传支付凭证" value="7"
                                          v-show="scope.row.isBuyerVoucher == 1">
                                      </el-option>
                                      <el-option key="8" label="申请退款" value="8" v-if="scope.row.applyRefundFlag == 1"></el-option>
                                      <el-option key="9" label="申请改签" value="9" v-show="showEndorse==true && scope.row.alterTicketFlag==true"></el-option>
                                    </el-select>
                                    <!-- <el-button type="primary" @click="quickPay(scope.row.id)" class="yjk-orderDetailBtn" v-show="scope.row.oStatus==0">立即支付</el-button>                             -->
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>                 
                <el-table-column label="产品信息" min-width="600" >
                    <template scope="scope" class="yjk-col">
                        <div class="yjk-cellExpand pInfo">
                           <span class="fleft">
                               <span class="otypeTip" v-show="scope.row.oType == 2">企</span>
                               <span class="otypeTip" v-show="scope.row.oType == 1">个</span>
                           </span>
                           <span class="fleft">订单号:{{ scope.row.oOrderNo }}</span>
                           <span class="fleft">团号:{{ scope.row.oGroupOrderNo==null?'无':scope.row.oGroupOrderNo }}</span>
                           <span class="fleft clearfix">预订时间:{{ scope.row.createTime|dateFormat('time')}}</span>
                           <!-- <span class="fright clearfix">游客联系:{{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otName}}({{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otPhone}})</span> -->
                        </div>
                        <div class="ptlr20">
                            <div class="yjk-cellIN textHidden" :title="scope.row.pName">【{{ scope.row.pNo }}】{{ scope.row.pName }}</div>
                            <div class="yjk-cellIN">
                                <span class="yjk-width30">出团:{{ scope.row.sCalendar | dateFormat }}</span>
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
                                <span class="link" @click="getSaleManage(scope.row.oBuyerId,scope.row.buyerStype)"><a href="javascript:;" class="link">{{ scope.row.oBuyerName  }}</a></span>&nbsp;&nbsp;{{ scope.row.buyerPhone  }}
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
                              <el-tooltip effect="light"  placement="bottom-start">
                                <div slot="content">
                                  <div v-for="item in scope.row.priceDetails" :key="item.id">
                                    <span>{{item.opPriceName}}：{{item.opNum}}份  x {{item.opPrice|moneyTwoPoints}}</span>
                                  </div>
                                </div>
                                <span>人数:{{scope.row.adultNum}}大/{{scope.row.childNum}}小</span>
                              </el-tooltip>
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
                           <!-- <el-button type="text" v-show="scope.row.oStatus!=0">
                               <router-link :to="{ name: 'groupNoticePrint',query: {id: scope.row.id}}" class="yjk-link">出团通知书</router-link>
                            </el-button>
                           <el-button type="text" v-show="scope.row.oStatus!=4">
                               <router-link :to="{ name: 'groupConfirmPrint',query: {id: scope.row.id}}" class="yjk-link">组团社确认单</router-link>
                            </el-button> -->
                        </div>
                        <div class="ptlr20 textCenter">
                            <el-button type="primary" @click="orderDetailGoto(scope.row)" class="yjk-orderDetailBtn">订单详情</el-button>
                            <!-- <el-button @click="checkContractAlert(scope.row.id)" class="yjk-orderChangeSel">审核合同</el-button> -->
                            <el-select  @change="orderChange" placeholder="订单修改" value="" v-model="orderChangeType[scope.row.id]" class="yjk-orderChangeSel" :disabled="scope.row.oStatus==4">
                                <el-option key="5" label="取消订单" value="4" v-show="(scope.row.oStatus==1 && scope.row.offlineStatus == null)|| scope.row.oStatus==0 || scope.row.oStatus == 6"></el-option>
                                <el-option key="6" label="编辑游客" value="6" v-show="scope.row.oStatus != 0 && scope.row.oStatus != 6"></el-option>
                                <el-option key="7" label="上传支付凭证" value="7"
                                    v-show="scope.row.isBuyerVoucher == 1">
                                </el-option>
                                <el-option key="8" label="申请退款" value="8" v-if="scope.row.applyRefundFlag == 1"></el-option>
                                <el-option key="9" label="申请改签" value="9" v-show="showEndorse==true && scope.row.alterTicketFlag==true"></el-option>
                            </el-select>
                            <!-- <el-button type="primary" @click="quickPay(scope.row.id)" class="yjk-orderDetailBtn" v-show="scope.row.oStatus==0">立即支付</el-button>                             -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表信息汇总 -->
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->

        </div>
    </div>
    <!--申请改签 弹窗  begin-->
    <jdy-alert title="改签申请" @closeAlert="closeAlert" v-if="changeSignFlag" class="alertCityList showtfcity refund" style="width:800px;">
      <div class="touristHead">
          <div class="tourist-title">订单详情：</div>
      </div>
      <table border="1" class="signlist">
        <tr>
          <td class="borderR borderB">线路名称：{{signConfirmData.lineName}}</td>
          <td class="borderR borderB">团号：{{signConfirmData.sNo}}</td>
          <td class="borderB">出团日期：{{signConfirmData.startDate | dateFormat}}</td>
        </tr>
        <tr>
          <td class="borderR borderB">订单号：{{signConfirmData.oOrderNo}}</td>
          <td class="borderR borderB">订单游客数：{{signConfirmData.pNum}}</td>
          <td class="borderB"></td>
        </tr>
      </table>
      <div class="touristHead">
          <div class="tourist-title">请选择改签的游客：</div>
      </div>
      <div class="signlist signTouristsList" style="padding-top:15px;">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChangeSign" style="margin-left:15px">全选</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group v-model="getScheduleData.ticketList" @change="getSchedule" style="height:125px;overflow-y:scroll">
            <el-checkbox v-for="item in ticketsListTwo" :label="item.touristId" :key="item.touristId" :value="item.touristId" class="ticketsLists">
              {{item.touristName}}-{{item.licence}}-{{item.ticketName}}
            </el-checkbox>
          </el-checkbox-group>
      </div>
      <div class="touristHead">
          <div class="tourist-title">请选择需要改签的出团时间：</div>
      </div>
      <!-- <div class="p15">
        <el-date-picker v-model="getScheduleData.time" type="date" placeholder="选择日期时间" @change="getSchedule" :picker-options="pickerOptions"></el-date-picker>
      </div>           -->
      <div class="signDate">
        <el-form class="signForm" :model="signForm" :rules="rules" ref="signForm" style="margin-top:20px;padding:0 15px;">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="signDate">
                <el-select v-model="signForm.signDate" :loading="loading" placeholder="请选择日期" clearable @change="changeSchedule" filterable remote :remote-method="getScheduleforTime">
                  <el-option v-for="item in signDateList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <el-select v-model="signForm.signSchedule" :loading="loading" placeholder="请选择班期" clearable>
                  <el-option v-for="item in signSchedule.list" :key="item.id" :label="'班期编号：'+item.sScheduleNo+'（出发时间：'+item.sLeaveTime+'）'" :value="item.id"></el-option>
              </el-select>
              <span class="signTips">支持日期搜索，<span class="red">格式如：</span>2018.01.01</span>
              </el-form-item>
              <!-- <div class="">友情提示：支持日期搜索，格式如：2018.01.01</div> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="signTip">
        <p>温馨提示：您好，若此时改签订单，依据旅游有关法律法规、与游客签署的旅游合同、与接待方签署的协议和确认单以及与此业务有关的其他协议和文件中所规定条款，可能产生相应费用。</p>
      </div>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="saveSign()" type="primary">申请改签</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!--申请改签 弹窗  end-->
    <!--申请退款 弹窗  begin-->
    <jdy-alert title="申请退款" @closeAlert="closeAlert" v-if="refundFlag" class="alertCityList showtfcity refund" style="width:800px;">
      <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
        <el-tab-pane label="游客退票" :disabled="tabShowFlag" name="tabOne">
          <el-form class="refundForm" :model="refundForm" :rules="rules" ref="refundForm" label-width="100px" style="margin-top:20px;padding:0 15px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item prop="" label="请选择需要退票的游客：" label-width="200">
                      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                      <div style="margin: 10px 0;"></div>
                      <el-checkbox-group v-model="refundForm.touristIds" @change="handleCheckedCitiesChange" style="height:155px;overflow-y:scroll">
                        <el-checkbox v-for="item in ticketsListTwo" :label="item.touristId" :key="item.touristId" class="ticketsList">{{item.touristName}}-{{item.ticketName}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item prop="refundExplain" label="退款说明：">
                      <el-input type="textarea" :autosize=" { minRows: 3 }" v-model="refundForm.refundExplain"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他退款情况" name="tabTwo">
          <el-form class="" :model="refundFormTwo" :rules="rules" ref="refundFormTwo" label-width="130px" style="margin-top:20px;padding:0 15px;height:155px">
            <el-row>
                <el-col :span="24">
                    <el-form-item prop="applyRefundAmount" label="申请退款金额：" style="margin-top:1px">
                      <el-input v-model.number="refundFormTwo.applyRefundAmount" clearable placeholder="请输入大于0的整数或者保留两位小数"></el-input>
                    </el-form-item>
                    <el-form-item prop="refundExplain" label="退款说明：">
                      <el-input type="textarea" :autosize=" { minRows: 3 }" v-model="refundFormTwo.refundExplain"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="saveRefund('refundForm')" type="primary" v-if="tabFlag == 1" :disabled="btnFlag">提交</el-button>
        <el-button class="fright mt10 mr10" @click="saveRefund('refundFormTwo')" type="primary" v-if="tabFlag == 2" :disabled="btnFlag">提交</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!--申请退款 弹窗  end-->
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
    <!--上传支付凭证 弹窗  begin-->
    <jdy-alert title="上传支付凭证" @closeAlert="closeAlert" v-if="payedFlag" class="alertCityList showtfcity" style="width:600px">
        <el-form class="" :model="lineForm" :rules="rules" ref="lineForm" label-width="100px" style="margin-top:20px;">
            <el-row>
                <el-col :span="20">
                    <el-form-item prop="money" label="首款金额：" v-if="this.lineForm.type == 1">
                        <el-input v-model.number="lineForm.money" clearable placeholder="请输入大于0的整数或者保留两位小数">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="money" label="尾款金额：" v-if="this.lineForm.type == 2">
                        <el-input v-model.number="lineForm.money" clearable placeholder="请输入大于0的整数或者保留两位小数">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="money" label="全款金额：" v-if="this.lineForm.type == 0">
                        <el-input v-model.number="lineForm.money" :disabled="this.lineForm.money != ''">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="uploadDesc" label="上传说明：">
                        <el-input
                          type="textarea"
                          :rows="3"
                          placeholder="请输入内容"
                          v-model="lineForm.uploadDesc">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="url" label="上传封面：">
                    <el-upload class="upload-demo" drag :multiple="false" :action='imgUploadPath' :before-upload="checkFileType" :data="fileType" :on-success="uploadSuccess" :show-file-list="false" :on-error="uploadError" :headers="uploadHeader" :with-credentials = 'true'>
                        <img :src="lineForm.url" v-if="lineForm.url" style="width:100%;height:100%"/>
                        <div v-else>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将封面拖到此处，或
                            <em>点击上传</em>
                        </div>
                        </div>
                        <div class="el-upload__tip" slot="tip" style="margin-left:15px">建议尺寸:最小(550*350)，一般(715*455)，大小:不超过(500kb)，
                                  <br>格式（JPG\PNG）</div>
                    </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
      </el-form>
      <div class="alertfoot1 clearfix">
        <el-button class="fright mt10 mr10" @click="savePay('lineForm')" type="primary" :disabled="btnFlag">保存</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
      </div>
    </jdy-alert>
    <!--上传支付凭证 弹窗  end-->
    <!--查看买家信息 弹窗  begin-->
    <jdy-alert title="买家信息" @closeAlert="closeAlert" v-if="alertFlag" class="alertCityList showtfcity">
            <div class="yjk-alertInner">
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">用户账号：</span>
                        <span>{{userInfo.uAccount}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">真实姓名：</span>
                        <span>{{userInfo.uRealName}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">员工编号：</span>
                        <span>{{userInfo.uNo}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">职务：</span>
                        <span>{{userInfo.uPost}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">单位名称：</span>
                        <span>{{userInfo.cName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">部门名称：</span>
                        <span>{{userInfo.dName}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">上级：</span>
                        <span>{{userInfo.upName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">身份证：</span>
                        <span>{{userInfo.uIdcard}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">手机号：</span>
                        <span>{{userInfo.uTel}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">出生年月：</span>
                        <span>{{userInfo.uBirthday| dateFormat}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">性别：</span>
                        <span>{{userInfo.uSex | sexNameTwo}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">文化程度：</span>
                        <span>{{userInfo.degreeName}}</span>
                    </span>
                </div>
                <div>
                    <!-- <span class="infoLine">
                        <span class="infoTitle">政治面貌：</span>
                        <span>{{userInfo.uAccount}}</span>
                    </span> -->
                    <span class="infoLine">
                        <span class="infoTitle">紧急联系人：</span>
                        <span>{{userInfo.uContacts}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">地址：</span>
                        <span>{{userInfo.uAddress}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">电话：</span>
                        <span>{{userInfo.uPhone}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">微信号：</span>
                        <span>{{userInfo.uWxname}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">QQ：</span>
                        <span>{{userInfo.uQq}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">邮箱：</span>
                        <span>{{userInfo.uEmail}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">备注：</span>
                        <span>{{userInfo.uRemark}}</span>
                    </span>
                </div>
            </div>
        </jdy-alert>
        <jdy-alert title="买家信息" @closeAlert="closeAlert" v-if="alertTwoFlag" class="alertCityList showtfcity">
            <div class="yjk-alertInner">
                <div>
                    <span class="infoLine" v-if="userInfoTwo.upName">
                        <span class="infoTitle">上级：</span>
                        <span>{{userInfoTwo.upName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">联系方式：</span>
                        <span>{{userInfoTwo.upTel}}</span>
                    </span>
                </div>
                <div>
                    <span class="infoLine" v-if="userInfoTwo.managerName">
                        <span class="infoTitle">销售经理：</span>
                        <span>{{userInfoTwo.managerName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">联系方式：</span>
                        <span>{{userInfoTwo.managerTel}}</span>
                    </span>
                </div>
            </div>
        </jdy-alert>
    <!--查看买家信息 弹窗  end-->
     <!--补录乘客信息  -->
    <jdy-alert title="补录游客信息" @closeAlert="closeAlert" v-if="toutistInfo.flag" class="alertCityList showtfcity tourinfo" style="width:1150px;height:650px">
        <div class="touristHead">
            <div class="tourist-title">该团人数：<span class="red">{{toutistInfo.tableDataTotal}}</span></div>
        </div>
        <div class="yjk-alertInner sPadding">
            <el-form>
                <span class="inputtips">支持直接从Excel里复制内容,誊抄到下面，<span class="red">格式：</span>姓名 证件号码 手机号 类目 类型 票名</span>
                <el-button type="primary" size="small" class="ml10" @click.native.prevent="saveAllToutist()">
                  批量保存
                </el-button>
                <el-button type="primary" size="small" @click="changeHref" class="mb10">导出excel模板</el-button>     
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3,maxRows: 4 }"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="toutistInfo.text"
                  @change="getText">
                </el-input>
                <el-table ref="multipleTable"  :data="toutistInfo.infoList" border tooltip-effect="dark" style="width: 100%" max-height="360">
                    <el-table-column type="index" label="序号">
                    </el-table-column>
                    <el-table-column label="姓名" min-width="150" >
                        <template scope="scope">
                        <el-input v-model="toutistInfo.infoList[scope.$index].otName" placeholder="请输入姓名"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="电话"  min-width="100">
                        <template scope="scope">
                        <el-input class="inputGeneral"  v-model="toutistInfo.infoList[scope.$index].otPhone" placeholder="请输入电话"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="证件类型" min-width="80">
                        <template scope="scope">
                            <el-select v-model="toutistInfo.infoList[scope.$index].otLicenceType">
                                <el-option :key="0" label="身份证" :value="0">
                                </el-option>
                                <el-option :key="1" label="护照" :value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="证件号码" min-width="150">
                        <template scope="scope">
                        <el-input v-model="toutistInfo.infoList[scope.$index].otLincese" placeholder="请输入相应的证件号"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="票价信息" min-width="180">
                        <template scope="scope">
                            <el-select v-model="toutistInfo.infoList[scope.$index].otTicketId" size="mini">
                              <el-option v-for="item in touristTicketList" :key="item.ticketId" :label="item.title" :value="item.ticketId"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                  <el-table-column label="操作" min-width="100">
                    <template scope="scope">
                      <el-button type="default" size="mini" @click.native.prevent="saveTouristInfo(scope.row)">
                        保存
                      </el-button>
                      <el-button type="default" class="red" size="mini" @click.native.prevent="deleteRow(scope.row)">
                        清空
                      </el-button>

                    </template>
                  </el-table-column>
                </el-table>
            </el-form>
            <!-- <div class="clearfix">
                <el-pagination class="fright" @size-change="handleSizeChange" @current-change="tourist_handleCurrentChange" :current-page.sync="toutistInfo.currentPage" :page-size="toutistInfo.pageSize" layout="prev, pager, next, jumper" :total="toutistInfo.tableDataTotal">
                </el-pagination>
            </div> -->
        </div>
        <div class="alertfoot1 clearfix touristfoot">
            <el-button class="fright mt10 mr10" @click="closeAlert">关闭</el-button>
        </div>
    </jdy-alert>
    <!--补录游客信息 弹窗  end-->
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
import listData from "./listData";
const ticketOptions = ['上海', '北京', '广州', '深圳'];
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
        oStatus: "",
        dateType: 2, //日期类型
        oPayMethod: null, //支付类型
        oType: null, //用户类型
        dateStart: null, //起始日期
        dateEnd: null, //结束日期
        oBuyerCompanyId: null, //报名社id
        oBuyerId: null, //报名人id
        orderType: 1, //类型:卖家订单
        pBrand: null, //品牌id
        oProductId: null, //产品id
        // pTypes:[10,11,20,30,40,50],//产品类型
        pTypes: [],
        oSalerCompanyId: null, //供应商id
        oSalerId: null, //供应商计调人员id
        // oPayMethod: null, //支付方式
        searchKey: "", //快速查询
        export: false, //是否导出
        alterTicketStatus:null
      },
      datePicker: null, //查询日期
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
        },
        {
          value: 67,
          label: "单一资源+拍"
        },
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
        statuses_10: 0
      },
      // 分页
      currentPage: 1, //列表当前所在页,
      pageSize: 10,
      tableDataTotal: 0,
      fullscreenLoading: false, //加载
      loading: false, //select远程查询加载
      logindata: "", //登陆数据
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
      //申请改签
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
        signDate:'',
        signSchedule:'',
      },
      signDateList:[],
      signScheduleList:[],
      signSchedule:{
        date:null,
        list:[]
      },
      //申请退款
      refundFlag: false,
      checkAll: false,
      isIndeterminate: false,
      ticketsList: [],
      ticketsListTwo:[],
      refundForm:{
        touristIds: [],
        applyRefundAmount:'',
        refundExplain:'',
        orderId:'',
        type:0,
        ticketId:null
      },
      refundFormTwo:{
        touristIds: [],
        applyRefundAmount:'',
        refundExplain:'',
        orderId:'',
        type:1,
      },
      activeName:'tabOne',
      tabFlag: 1,
      tabShowFlag:false,
      //退款记录
      refundRecordFlag: false,
      refundRecordList:[],
      //上传支付凭证
      oUnPayChange: "",
      payedFlag: false,
      lineForm: {
        type: "", //0-全款 1-首款 2-尾款 ,
        orderId: "", //订单id ,
        url: "", //凭证url
        money: "", //金额 ,
        uploadDesc: "", //
        vNo:''
      },
      fileType: { fileType: "jpg" },
      uploadHeader: {
        Authorization: sessionStorage.token
      },
      action: "/common/file/upload",
      rules: {
        money: [
          {
            type: "number",
            required: true,
            message: "请输入金额",
            trigger: "change"
          }
        ],
        uploadDesc: [
          {
            // type: "text",
            required: true,
            message: "请输入上传说明",
            trigger: "blur"
          },
          { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
        ],
        applyRefundAmount: [
          {
            type: "number",
            required: true,
            message: "请输入金额",
            trigger: "change"
          }
        ],
        refundExplain: [
          {
            // type: "text",
            required: true,
            message: "请输入退款说明",
            trigger: "blur"
          },
          { min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" }
        ]
      },
      // 补录乘客信息
      toutistInfo: {
        flag: false,
        infoList: [],
        currentPage: 1,
        pageSize: 9999,
        tableDataTotal: 0,
        text:'',
      },
      //买家信息
      alertFlag: false,
      alertTwoFlag: false,
      userInfo: null,
      userInfoTwo: null,
      //
      idCardArry:[],
      phoneArry:[],
      nameArry:[],
      inputText:null,
      touristTicketList:[],
      showPay:false,
      showEndorse:false,
      touristTicketList:[],
      // 申请改签获取
      getScheduleData:{
        ticketList:[],
        time:null
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    };
  },
  computed: {
    imgUploadPath() {
      return api_prefix + this.action;
    }
  },
  mounted() {
    this.logindata = JSON.parse(sessionStorage.loginData);
    this.ruleform.oBuyerCompanyId = this.logindata.uCompanyId;
    setTimeout(()=>{
      this.menuData = window.menuData;
      if(this.menuData.indexOf("refund") != -1){
        this.showPay = true;
      }
      if(this.menuData.indexOf("applyEndorse") != -1){
        this.showEndorse = true;
      }      
    },500)
    this.getTableData();
    this.remote_oSalerCompanyId();
    this.logindata.uDataLimit == 3 && this.remote_oBuyerCompanyId();
  },
  methods: {
    /**
     * @description 从textarea识别内容并插入编辑框
     * @todo
     * 1.组装来自excel的数据（idCardArry）
     * 2.组装出来自接口的票基础list（touristTicketList）
     * 3.从游客坑位（infoList）中补全信息（插入导入的信息）
    */
    getText(val){
      if(!val){
        return;
      }
      let arr = val.split('\n')
      arr.pop();
      for( var i = 0;i<arr.length;i++){
        var a = arr[i].split("	")
        this.idCardArry.push(a);
      }
      // 票基础（touristTicketList），游客坑位（infoList），来自excel数据（idCardArry）
      var j=0;
      for(let i=0;i<this.toutistInfo.infoList.length;i++){
        // infoList里如果名字，电话，身份证号码都没有，则插入新数据
        // 插入新数据根据title名称切换票id
        let infocell=this.toutistInfo.infoList[i];
        if(!infocell.otName && !infocell.otPhone && !infocell.otLincese){
          let excelcell=this.idCardArry[j];
          // 更新票id
          let priceId=this.touristTicketList.filter((data)=>{
            return data.title==`${excelcell[3]}-${excelcell[4]}-${excelcell[5]}`;
          })
          if(priceId.length!=0){
            this.toutistInfo.infoList[i].otTicketId=priceId[0].ticketId;
            this.toutistInfo.infoList[i].otName=excelcell[0];
            this.toutistInfo.infoList[i].otLincese=excelcell[1];
            // 根据证件号长度来判断是否为身份证or护照
            this.toutistInfo.infoList[i].otLicenceType=excelcell[1].length>=15?0:1;
            this.toutistInfo.infoList[i].otPhone=excelcell[2];
          }
          // 只是向后插入，j++控制
          j++
        }
        // 如果j长度大于录入的信息，则跳出循环
        if(j>this.idCardArry.length-1){
          break;
        }
      }
      this.idCardArry=[];
    },
    //买家信息
    getSaleManage(userid, uStype) {
        this.$http.get(api_prefix + "user/get/" + userid).then(
          response => {
            if (response.data.code == 0) {
              this.userInfo = response.data.body;
              this.alertFlag = true;
              this.$nextTick(function() {
                jdyFn.setAlertStyle("showtfcity");
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );      
    },
    // 获取表格
    getTableData() {
      if (arguments[0]) {
        this.jdytabActive = null;
      }
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
          case "单一资源+拍":
            params.pTypes[i] = 67;
            break;
        }
      }
      API.orderList(params).then(response => {
        if (response.body.code == 0) {
          let data = response.body.body;
          for (let i = 0; i < data.extObj.length; i++) {
            switch (data.extObj[i].status) {
              case 0:
                this.orderTotal.statuses_0 = data.extObj[i].number;
                break;
              case 1:
                this.orderTotal.statuses_1 = data.extObj[i].number;
                break;
              case 2:
                this.orderTotal.statuses_2 = data.extObj[i].number;
                break;
              case 3:
                this.orderTotal.statuses_3 = data.extObj[i].number;
                break;
              case 4:
                this.orderTotal.statuses_4 = data.extObj[i].number;
                break;
              case 6:
                this.orderTotal.statuses_6 = data.extObj[i].number;
                break;
              case 10:
                this.orderTotal.statuses_10 = data.extObj[i].number;
                break;
            }
          }
          this.tableData = data.list;
          this.tableData.forEach(value => {
            // if (value.tourists.length != 0) {
            //   let tempCount = null;
            //   tempCount = value.tourists.filter(cell => {
            //     return cell.otType == 0;
            //   });
            //   value.adultNum = tempCount.length != 0 ? tempCount.length : 0;
            //   tempCount = value.tourists.filter(cell => {
            //     return cell.otType == 1;
            //   });
            //   value.childNum = tempCount.length != 0 ? tempCount.length : 0;
            // } else {
            //   value.adultNum = 0;
            //   value.childNum = 0;
            // }
            //回程日期
            value.eCalendar =
              value.sCalendar + (value.pDays - 1) * 3600 * 1000 * 24;
          });
          this.tableDataTotal = data.total;
        } else {
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
        case "6":
          this.toutistInfo.flag = true;
          this.getTouristInfo(this.rowData.id);
          break;
        case "7":
          this.uploadPayed(
            this.rowData.id,
            this.rowData.oSource,
            this.rowData.oRealPay,
            this.rowData.oFirstPay,
            this.rowData.oStatus,
            this.rowData.oUnPay
          );
          break;
        case "8":
          this.refundFun(this.rowData.id);
          this.refundForm.orderId = this.rowData.id;
          this.refundFormTwo.orderId = this.rowData.id;
          this.refundForm.applyRefundAmount = '';
          this.refundForm.refundExplain = '';
          this.refundForm.touristIds = [];
          this.refundFormTwo.applyRefundAmount = '';
          this.refundFormTwo.refundExplain = '';
          this.refundFormTwo.touristIds = [];
          break;
        case "9":
          this.changeSignFun(this.rowData.id);
          // this.signForm.signDate = '';
          // this.signForm.signSchedule = '';
          this.signConfirmData.lineName=this.rowData.pName
          this.signConfirmData.sNo=this.rowData.oGroupOrderNo
          this.signConfirmData.startDate=this.rowData.sCalendar
          this.signConfirmData.oOrderNo=this.rowData.oOrderNo
          this.signConfirmData.pNum=this.rowData.oPeopleNum
          this.refundForm.touristIds = [];
          break;
      }
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    // 订单详情跳转
    orderDetailGoto(order) {
      // type 用来判断订单类型 0：正常，1：改签，2：退票
      let type=null
      if(order.srcOrderId==null){
        type=0;
      }else{
        type=order.alterTicketId==null?2:1;
      }
      this.$router.push({ name: "orderBuyerDetail", query: { id: order.id,type:type } });
    },
    // 调整金额
    priceChange_submit() {
      console.log("123", this.rowData);
    },
    // 调整座位

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
    //申请改签相关
    changeSignFun(id){
      this.changeSignFlag = true;

      this.$http
        .get(
          api_prefix + "/orderRefundRecord/getOtherRefundTypeForOrder/" + id,
        )
        .then(response => {
          if (response.body.code == 0) {
            let tabFlag = response.body.body
            if(tabFlag == 1){
              this.activeName = 'tabTwo',
              this.tabShowFlag = true;
              this.refundFormTwo.type = 1;
              this.refundForm.touristIds = [];
              this.refundForm.refundExplain = '';
              this.tabFlag = 2;
            }else{
              // this.tabShowTwoFlag = true;
              this.$http
                .get(
                  api_prefix + "/orderRefundRecord/getTouristListForRefund/" + id,
                )
                .then(response => {
                  if (response.body.code == 0) {
                    this.ticketsList=[];
                    for(let i = 0;i<response.body.body.length;i++){
                      this.ticketsList.push(response.body.body[i].touristId)
                    }
                    this.ticketsListTwo = response.body.body;
                    console.log(this.ticketsList,'this.ticketsList')
                  } else {
                    this.defalutErrorMessage(response.body.message);
                  }
                });
            }
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        });
    },
    // 申请改签相关获取班期接口
    getSchedule(value){
        var _flag_=true;
        if(typeof value == "object"){
          // ticketList
          let checkedCount = value.length;
          // console.log("value.length",value)
          this.checkAll = checkedCount === this.ticketsListTwo.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.ticketsListTwo.length;
          this.getScheduleData.ticketList=value;
          if(value.length==0){
            this.signDateList=[];
            this.signScheduleList=[];
            this.signForm.signDate=null;
            this.signForm.signSchedule=null;
            return;
          }
        }else{
          // date
          // 如果是今天则获取当前时间的时间戳，否则获取其他日期的0点的时间戳
          let date=new Date();
          let year=date.getFullYear();
          let month=(date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
          let day=date.getDate()<10?"0"+(date.getDate()):(date.getDate());
          let todayTime=`${year}-${month}-${day}`;
          if(!value){
            _flag_=true;
            this.getScheduleData.time=date.getTime()
          }else{
            _flag_=false;
            this.getScheduleData.time=value == todayTime?date.getTime():new Date(value).getTime();
          }
        }
        // 通过touristid得到tickid
        let tickTargetList=[];
        if(this.getScheduleData.ticketList.length!=0){
          this.getScheduleData.ticketList.forEach(data=>{
            let targetList=this.ticketsListTwo.filter(cell=>{
              return cell.touristId==data
            })
            if(targetList.length!=0){
              tickTargetList.push(targetList[0].ticketId)
            }
          })
        }
        this.getScheduleData.time=this.getScheduleData.time==null?new Date().getTime():this.getScheduleData.time;
        let param={
          oldScheduleId:this.rowData.oScheduleId,
          ticketList:tickTargetList,
          time:this.getScheduleData.time,
          flag:_flag_
        }
        this.$http.post(api_prefix + "alterTicket/getScheduleListByTicket/",param).then(response => {
          if (response.body.code == 0) {
            // 从结构里整理出
            this.signDateList=[];
            this.signScheduleList=[];
            response.body.body.forEach((item,index)=>{
              this.signDateList.push(item.date);
            })
            this.signScheduleList=response.body.body
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        });
    },
    changeSchedule(value){
      this.signForm.signSchedule=null;
      let targetSchedule=this.signScheduleList.filter(data=>{
        return data.date==value
      })
      this.signSchedule.list=targetSchedule[0].scheduleList;
      this.signSchedule.list.forEach(data=>{
        let getTime=new Date(data.sLeaveTime);
        let hour=getTime.getHours()<10?'0'+getTime.getHours():getTime.getHours()
        let minute=getTime.getHours()<10?'0'+getTime.getHours():getTime.getHours()
        data.sLeaveTime=hour+":"+minute
      })
    },
    getScheduleforTime(value){
      if(value!=""){
        let reg = /^[1-9]\d{3}\.(0[1-9]|1[0-2])\.(0[1-9]|[1-2][0-9]|3[0-1])$/;
        let regExp = new RegExp(reg);
        // 判断日期格式是否满足，满足则转成时间戳并调用接口
        if(!regExp.test(value)){
        　return;
        }else{
          this.getSchedule(value);
        }
      }else{

      }
    },
    saveSign(){
        var touristInfoArr=[];
        for(let i=0;i<this.getScheduleData.ticketList.length;i++){
          let target=this.ticketsListTwo.filter(data=>{
            return data.touristId==this.getScheduleData.ticketList[i]
          })
          touristInfoArr.push({
            touristId:target[0].touristId,
            ticketId:target[0].ticketId
          })
        }
        if(touristInfoArr.length==0){
          return this.$message.info("请选择游客！")
        }
        if(!this.signForm.signSchedule){
          return this.$message.info("请选择班期！")
        }
        let param={
          orderId:this.rowData.id,
          targetScheduleId:this.signForm.signSchedule,
          touristInfo:touristInfoArr
        }
        this.$http.post(api_prefix + "alterTicket/applyAlterTicketRecord",param).then(response => {
          if (response.body.code == 0) {
            this.closeAlert();
            this.getTableData();
            this.$message.success("改签申请成功！")
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        });
    },
    //申请退款相关
    refundFun(id){
      this.refundFlag = true;
      this.$http
        .get(
          api_prefix + "/orderRefundRecord/getOtherRefundTypeForOrder/" + id,
        )
        .then(response => {
          if (response.body.code == 0) {
            let tabFlag = response.body.body
            if(tabFlag == 1){
              this.activeName = 'tabTwo',
              this.tabShowFlag = true;
              this.refundFormTwo.type = 1;
              this.refundForm.touristIds = [];
              this.refundForm.refundExplain = '';
              this.tabFlag = 2;
            }else{
              // this.tabShowTwoFlag = true;
              this.$http
                .get(
                  api_prefix + "/orderRefundRecord/getTouristListForRefund/" + id,
                )
                .then(response => {
                  if (response.body.code == 0) {
                    for(let i = 0;i<response.body.body.length;i++){
                      this.ticketsList.push(response.body.body[i].touristId)
                    }
                    this.ticketsListTwo = response.body.body;
                    console.log(this.ticketsList,'this.ticketsList')
                  } else {
                    this.defalutErrorMessage(response.body.message);
                  }
                });
            }
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        });
    },
    handleCheckAllChange(event) {
        this.refundForm.touristIds = event.target.checked ? this.ticketsList : [];
        this.isIndeterminate = false;
      },
    handleCheckAllChangeSign(){
      this.getScheduleData.ticketList = event.target.checked ? this.ticketsList : [];
      this.isIndeterminate = false;
      this.getSchedule(this.getScheduleData.ticketList)
    },
    handleCheckedCitiesChange(value){
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.ticketsList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.ticketsList.length;
    },
    tabClick(tab,event){
      if(tab.label == '游客退票'){
        this.refundForm.type = 0;
        this.refundFormTwo.applyRefundAmount = '';
        this.refundFormTwo.refundExplain = '';
        this.tabFlag = 1;
      }else{
        this.refundFormTwo.type = 1;
        this.refundForm.touristIds = [];
        this.refundForm.refundExplain = '';
        this.tabFlag = 2;
      }
    },
    saveRefund(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnFlag = true;
          if(this.tabFlag == 2){
            var unpay = this.refundFormTwo.applyRefundAmount;
            var reg = /^\d+(?:\.\d{1,2})?$/; //输入框金额校验规则
            //判断保存时是否为尾款支付，需要进行金额校验
            if (!reg.test(unpay)) {
              this.$message.error("请输入大于0的整数或者保留两位小数");
            } else {
              this.$http
                .post(
                  api_prefix + "/orderRefundRecord/applyOrderRefund",
                  this.refundFormTwo
                )
                .then(
                  response => {
                    if (response.body.code == 0) {
                      setTimeout(() => {
                        this.closeAlert();
                        this.getTableData();
                        this.btnFlag = false;
                      }, 500);
                      this.$message.success("保存成功");
                    } else {
                      this.btnFlag = false;
                      this.defalutErrorMessage(response.body.message);
                    }
                  },
                  response => {
                    this.defalutErrorMessage();
                  }
                );
            }
          }else{
            this.$http
                .post(
                  api_prefix + "/orderRefundRecord/applyOrderRefund",
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
                      this.$message.success("保存成功");
                    } else {
                      this.btnFlag = false;
                      this.defalutErrorMessage(response.body.message);
                    }
                  },
                  response => {
                    this.defalutErrorMessage();
                  }
                );
          }
        } else {
          this.$message.error("保存失败");
          return false;
        }
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
            this.defalutErrorMessage(response.body.message);
          }
        });
    },
    //上传支付凭证相关
    uploadPayed(id, oSource, realPay, firstPay, oStatus, oUnPay) {
      this.payedFlag = true;
      this.lineForm.orderId = id;
      if (oSource == 4) {
        if (oStatus == 1) {
          this.lineForm.money = '';
          this.lineForm.type = "1";
        } else {
          this.lineForm.money = "";
          this.lineForm.type = "2";
          this.oUnPayChange = oUnPay;
        }
      } else {
        this.lineForm.money = realPay;
        this.lineForm.type = "0";
      }
    },
    setDays(value) {
      // var pDays = this.ruleForm.pDays;
      // let str = JSON.stringify(this.tripObj);
      // if (this.ruleForm.trips.length > value) {
      //   console.log(this.ruleForm.trips.length, "this.ruleForm.trips.length");
      //   for (let i = this.ruleForm.trips.length; i > value; i--) {
      //     this.ruleForm.trips.pop();
      //   }
      // } else {
      //   for (let a = this.ruleForm.trips.length; a < value; a++) {
      //     this.ruleForm.trips.push(JSON.parse(str));
      //   }
      // }
      // console.log(this.ruleForm.trips);
      // console.log(pDays);
    },
    savePay(formName) {
      //保存上传凭证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnFlag = true;
          var unpay = this.lineForm.money;
          var reg = /^\d+(?:\.\d{1,2})?$/; //输入框金额校验规则

          if (this.lineForm.type == 2 || this.lineForm.type == 1) {
            //判断保存时是否为尾款支付，需要进行金额校验
            if (!reg.test(unpay)) {
              this.$message.error("请输入大于0的整数或者保留两位小数");
              this.btnFlag = false;
            } else if (this.lineForm.type == 2 && unpay > this.oUnPayChange) {
              this.$message.error("输入的金额超出剩余需要支付的金额");
              this.btnFlag = false;
            } else if (this.lineForm.url == "") {
              this.$message.error("请上传凭证图片");
              this.btnFlag = false;
            } else {
              this.$http
                .post(
                  api_prefix + "/orderOffline/saveOrderOffline",
                  this.lineForm
                )
                .then(
                  response => {
                    if (response.body.code == 0) {
                      this.btnFlag = false;
                      setTimeout(() => {
                        this.closeAlert();
                        this.getTableData();
                      }, 500);
                      this.$message.success("保存成功");
                    } else {
                      this.btnFlag = false;
                      this.defalutErrorMessage(response.body.message);
                    }
                  },
                  response => {
                    this.defalutErrorMessage();
                  }
                );
            }
          } else {
            //首款支付和全款支付 走这边
            this.$http
              .post(
                api_prefix + "/orderOffline/saveOrderOffline",
                this.lineForm
              )
              .then(
                response => {
                  if (response.body.code == 0) {
                    this.btnFlag = false;
                    setTimeout(() => {
                      this.closeAlert();
                      this.getTableData();
                    }, 500);
                    this.$message.success("保存成功");
                  } else {
                    this.btnFlag = false;
                    this.defalutErrorMessage(response.body.message);
                  }
                },
                response => {
                  this.defalutErrorMessage();
                }
              );
          }
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    checkFileType(file) {
      //上传凭证图片
      console.log(file, "file");
      let startsWith = file.type.startsWith("image/");
      if (!startsWith) {
        this.$message.error("请选择图片上传");
      }
      let isJPG = file.type === "image/jpeg" || "image/png";
      let size = file.size < 0.5 * 1024 * 1024;
      if (!size) {
        this.$message.error("上传凭证图片大小不能超过 500KB!");
      }
      if (!isJPG) {
        this.$message.error("上传凭证图片不支持" + file.type + "格式!");
      }
      return startsWith && size && isJPG;
    },
    uploadSuccess(response) {
      //凭证图片上传成功
      if (response.code == 0) {
        this.lineForm.url = response.body.key;
      } else {
        this.defalutErrorMessage(response.message);
      }
    },
    uploadError() {
      //凭证图片上传失败
      this.defalutErrorMessage();
    },
    defalutErrorMessage(message) {
      //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
    //
    closeAlert() {
      //关闭弹窗统一方法
      this.alertFlag = false;
      this.alertTwoFlag = false;
      this.btnFlag = false;
      this.orderChangeType = [];
      this.priceChangeObj.flag = false;
      this.offlinePayObj.flag = false;
      this.cancelOrderObj.flag = false;
      this.checkContractObj.flag = false;
      this.payedFlag = false;
      this.refundFlag = false;
      this.changeSignFlag = false;
      this.refundRecordFlag = false;
      //支付凭证
      this.lineForm.url = "";
      this.lineForm.uploadDesc = "";
      // 乘客补录信息
      this.toutistInfo.flag = false;
      this.toutistInfo.text=null
      this.toutistInfo.infoList=[];
      this.touristTicketList=[];
      // 改签
      this.getScheduleData.ticketList=[];
      this.signForm.signDate=null;
      this.signForm.signSchedule=null;
      this.getScheduleData.time=null;
      this.signDateList=[];
      this.signScheduleList=[];
      this.checkAll=false;
      this.isIndeterminate = false;
      $(".alertbgg").remove();
    },
    // 刷新按钮
    refresh() {
      (this.ruleform = {
        currPage: 1,
        pageSize: 10,
        statuses: [], //状态
        oStatus: "",
        dateType: 2, //日期类型
        oPayMethod: null, //支付类型
        oType: null, //用户类型
        dateStart: null, //起始日期
        dateEnd: null, //结束日期
        oBuyerCompanyId: "", //报名社id
        oBuyerId: null, //报名人id
        orderType: 1, //类型:卖家订单
        pBrand: null, //品牌id
        oProductId: null, //产品id
        // pTypes:[],//产品类型
        pTypes: [],
        oSalerCompanyId: null, //供应商id
        oSalerId: null, //供应商计调人员id
        // oPayMethod: null, //支付方式
        searchKey: "", //快速查询
        export: false, //是否导出
        alterTicketStatus:null
      }),
        (this.datePicker = null); //查询日期
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
      if(this.ruleform.dateStart==null){
        return this.$message.info("请选择一个时间范围！");
      }      
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
          case "单一资源+拍":
            params.pTypes[i] = 67;
            break;
          case "主题游":
            params.pTypes[i] = 68;
            break;
        }
      }
      params.export = true;
      this.downloadUrl = `${api_prefix}Order/export?`;
      if (params.statuses.length != 0) {
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
          { pid: 343, searchType: 1, pageIndex: 1, fastSearchStr: $.trim(key) },
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
      this.rowData = row;
    },
    handleRowChangeIn(row){
      console.log("111111行点击事件", row);
      this.rowData = row;     
    },    
    //
    changeHref(){
        this.downLoadHref = api_prefix + 'Order/downloadTourists?orderId=' + this.rowData.id
        + '&pageNo=' + 1 
        + '&pageSize=' + 9999
        location.href = this.downLoadHref;
    },
    // 批量保存游客
    saveAllToutist(){
      let infolist=[];
      let cardlist=[];
      let flag={
        phone:false,
        card:false,
        passport:false,
      }
      this.toutistInfo.infoList.forEach((data,index)=>{
        // 校验电话与身份证号码
        if (data.otPhone && !RegExObj.mobildPhone(data.otPhone)) {
          flag.phone=true;
          return
        }
        if (data.otLicenceType) {
          if (data.otLincese && !RegExObj.passport(data.otLincese)) {
            flag.passport=true;
            return
          }
        } else {
          //修改验证身份证
          if(data.otLincese){
            let rst = RegExObj.idCard(data.otLincese);
            if ( rst.start == 0) {
              flag.card=true;
              return false;
            }
          }
        }
        let cell={
          "id":data.id,
          "otTicketId":data.otTicketId,
          "otName":data.otName==null?"":data.otName,
          "otPhone":data.otPhone==null?"":data.otPhone,
          "otLicenceType":data.otLicenceType,
          "otLincese":data.otLincese==null?"":data.otLincese,
          "otTicketType":data.otTicketType,
          "otType":data.otType
        };
        infolist.push(cell);
        if(data.otLincese){
          cardlist.push(data.otLincese)
        }
      })
      if(flag.phone){
        this.$message.error("请输入正确的手机号格式！");
        return
      }
      if(flag.passport){
        this.$message.error("请输入正确的护照格式！");
        return
      }
      if(flag.card){
        this.$message.error("请输入正确的身份证格式！");
        return
      }
      // 判断身份证是否有重复
      if(cardlist.unique().length!=cardlist.length){
        return this.$message.info("出现重复的身份证号！");
      }
      let param={
        otOrderId:this.rowData.id,
        touristInfo:infolist
      }
      API.saveAllToutist(param).then(response => {
        if (response.body.code == 0) {
          this.$message.success("游客信息编辑成功！");
        } else {
          this.$alert(response.body.message)
        }
      });

    },
    // 补录游客信息-保存
    saveTouristInfo(value) {
      if (!value.otName) {
        return this.$message.error("请输入游客姓名！");
      }
      // 验证规则
      if (!RegExObj.mobildPhone(value.otPhone)) {
        return this.$message.error("请输入正确的手机号格式！");
      }
      if (value.otLicenceType) {
        if (!RegExObj.passport(value.otLincese)) {
          return this.$message.error("请输入正确的护照格式！");
        }
      } else {
        //修改验证身份证
        let rst = RegExObj.idCard(value.otLincese);
        if (rst.start == 0) {
          this.$message.error(rst.info);
          return false;
        }
      }
      API.saveTouristInfo(value).then(response => {
        if (response.body.code == 0) {
          this.$message.success("游客信息编辑成功！");
        } else {
          this.$alert(response.body.message)
        }
      });
    },
    // 补录游客信息-读取
    getTouristInfo(value) {
      API.getTouristInfo(
        value,
        this.toutistInfo.currentPage,
        this.toutistInfo.pageSize
      ).then(response => {
        if (response.body.code == 0) {
          this.toutistInfo.infoList = response.body.body.body.resultList;
          // 票类型
          var ticketInfo=response.body.body.body.ticketInfo
          for(let key in ticketInfo){
            if((typeof ticketInfo[key])=="object"){
              this.touristTicketList.push(ticketInfo[key]);
            };
          }
          this.toutistInfo.tableDataTotal = response.body.body.body.totalNum;
        } else {
        }
      });
    },
    // 补录游客信息-清空
    deleteRow(value) {
      value.otName = null;
      value.otPhone = null;
      value.otLincese = null;
    },
    // 补录游客信息-分页
    tourist_handleCurrentChange(val) {
      if (val) {
        this.toutistInfo.currPage = val;
        this.toutistInfo.pageNum = val;
        this.getTouristInfo(this.rowData.id);
      }
    }
  },
  filters: {
    sexNameTwo: function(value) {
      return value ? "女" : "男";
    }
  },
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
.sPadding {
  padding: 20px 15px 0 15px;
  margin-bottom: 0;
}
/* 弹窗 */
.yjk-alertInner {
  padding: 20px;
  margin-bottom: 0;
}
.yjk-alertInner .yjk-innerTitle {
  text-align: center;
}
.yjk-alertInner .infoLine {
  width: 49%;
  text-align: left;
  display: inline-block;
}
.yjk-alertInner .infoLine .infoTitle {
  display: inline-block;
  width: 30%;
  text-align: right;
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
.link {
  color: #467cd4 !important;
}
.toutistInfotext{
  height: 180px;
}
.inputtips{
  font-size: 14px;
  padding: 10px 0;
  display: inline-block
}
.signTips{
  font-size: 14px;
  display: block;
  margin-top:-5px
}
.touristfoot{
  position: absolute;
  bottom: 0;
  width: 100%
}
.el-table__expanded-cell{
  padding: 0 0 20px 48.5px;
}
</style>
