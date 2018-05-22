<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft">
        <div class="jdy-tab">
            <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">全部
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">待审核&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_1}}</div>
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">已通过&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_2}}</div>
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">已驳回&nbsp;&nbsp;<div class="yjk-number">{{orderTotal.statuses_3}}</div>
                <span></span>
            </a>
            <!-- <el-checkbox v-model="isReturn" @change="isReturnFn" class="isreturn" v-show="jdytabActive==null">是否包括退票</el-checkbox> -->
            <el-button @click="refresh" class="fright mr10 mt10 btnInTab" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
        </div>
        <div class="jdy-searchPart">
            <el-form :model="ruleform" :inline="true" ref="ruleform" class="demo-form" label-width="150px">
                <el-row>
                    <el-form-item class=" yjk-ml100" v-show="uDataLimit==3">
                        <el-select v-model="ruleform.oSalerCompanyId" placeholder="请选择分公司">
                            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-select v-model="ruleform.dateType">
                            <el-option :key="1" label="出团日期" :value="1">
                            </el-option>
                            <el-option :key="2" label="下单日期" :value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-date-picker v-model="datePicker" type="daterange" placeholder="选择日期范围" @change="dateRangeChange">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class=" yjk-search">
                        <el-input v-model="ruleform.searchKey" placeholder="请输入订单号、游客姓名、手机号搜索"></el-input>
                    </el-form-item>
                    <el-form-item   v-show="searchType">
                        <el-select v-model="ruleform.pBrand" :remote-method="remote_pBrand" @change="remote_oProductId" :loading="loading" placeholder="请选择产品品牌" filterable remote clearable>
                            <el-option v-for="item in brandArr" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  v-show="searchType">
                        <el-select v-model="ruleform.oProductId" placeholder="请选择产品" :remote-method="remote_oProductId" :disabled="ruleform.pBrand==null||ruleform.pBrand==''" :loading="loading" filterable remote clearable>
                            <el-option v-for="item in productArr" :key="item.id" :label="item.pName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 " v-show="!searchType">
                        <el-button type="primary" @click="getTableData(true)">确认查询</el-button>
                        <el-button @click="refresh">清空筛选</el-button>
                    </el-form-item>
                </el-row>
                <el-row class="mt10" v-show="searchType">
                    <el-form-item label="产品类型:" class=" yjk-ml100">
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
                    <el-form-item label="计调:" class="yjk-ml100 ">
                        <el-select v-model="ruleform.oSalerId" :remote-method="remote_oSalerId" :loading="loading" filterable remote :disabled="ruleform.oSalerCompanyId==null||ruleform.oSalerCompanyId==''" clearable>
                            <el-option v-for="item in SalerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式:" class="yjk-ml100 ">
                        <el-select v-model="ruleform.oPayMethod">
                            <el-option v-for="item in payType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报名人:" class="yjk-ml100 ">
                        <el-select v-model="ruleform.oBuyerId" :remote-method="remote_oBuyerId" :loading="loading" filterable remote :disabled="ruleform.oBuyerCompanyId==null||ruleform.oBuyerCompanyId==''" clearable>
                            <el-option v-for="item in BuyerIdArr" :key="item.id" :label="item.urRoleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 ">
                        <el-button type="primary" @click="getTableData(true)" class="btnInTab">确认查询</el-button>
                        <el-button @click="refresh" class="btnInTab">清空筛选</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <!--jdy-table begin-->
        <div class="jdy-table p10 yjksell">
            <el-table :data="tableData" border class="all yjk-orderList" highlight-current-row @current-change="handleRowChange">
                <el-table-column label="产品信息" min-width="600" >
                    <template scope="scope" class="yjk-col">
                        <div class="yjk-cellExpand pInfo">
                           <span class="fleft">订单号:{{ scope.row.oOrderNo }}</span>
                           <span class="fleft">团号:{{ scope.row.oGroupOrderNo==null?'无':scope.row.oGroupOrderNo }}</span>
                           <span class="fright clearfix">预订时间:{{ scope.row.createTime|dateFormat('time')}}</span>
                           <!-- <span class="fright clearfix">游客联系:{{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otName}}({{ scope.row.tourists.length==0?"未设置":scope.row.tourists[0].otPhone}})</span> -->
                        </div>
                        <div class="ptlr20">
                            <div class="yjk-cellIN textHidden" :title="scope.row.pName">【{{ scope.row.pNo }}】{{ scope.row.pName }}</div>
                            <div class="yjk-cellIN">
                                <span class="yjk-width30">出团:{{ scope.row.sCalendar|dateFormat }}</span>
                                <span class="yjk-width30">回团:{{ scope.row.eCalendar|dateFormat }}</span>
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
                           <!-- {{ scope.row.oSalerCompanyName }} -->
                        </div>
                        <!-- <div class="ptlr20">
                            <div class="yjk-cellIN">
                                <span class="fontcolor-buy">买:</span>
                                {{ scope.row.oBuyerName  }}
                            </div>
                            <div class="yjk-cellIN">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.buyerPhone  }}
                            </div>
                            <div class="yjk-cellIN noborder">
                                <span class="fontcolor-sale">卖:</span>
                                {{ scope.row.oSalerName }}
                                <span class="saleCompanyColor">【{{ scope.row.oSalerCompanyName }}】</span>
                            </div>
                        </div> -->
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
                            <!-- <span>支付时间:{{ scope.row.payTime|dateFormat('time')}}</span> -->
                        </div>
                        <div class="ptlr20">
                            <div class="yjk-cellIN">
                                人数:{{scope.row.adultNum}}大/{{scope.row.childNum}}小
                            </div>
                            <div class="yjk-cellIN">
                                销售:{{ scope.row.oMarketPrice|moneyTwoPoints }}
                                <span>
                                    <span v-if="scope.row.oStatus==0" class="yjk-noticeTitle noticePink">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==1" class="yjk-noticeTitle noticeYellow">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==2" class="yjk-noticeTitle noticeOrange">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==3" class="yjk-noticeTitle noticeGreen">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==4" class="yjk-noticeTitle noticePurple">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==5" class="yjk-noticeTitle noticeBlue">{{ scope.row.oStatus|orderStatus }}</span>
                                    <span v-if="scope.row.oStatus==6" class="yjk-noticeTitle noticeGray">{{ scope.row.oStatus|orderStatus }}</span>
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
                           <!-- <el-button type="text" @click="QRcodeAlert(scope.row)" v-show="scope.row.oStatus==1||scope.row.oStatus==2">支付二维码</el-button> -->
                           <el-button type="text" v-show="scope.row.oStatus!=0">
                               <router-link :to="{ name: 'groupNoticePrint',query: {id: scope.row.id}}" class="yjk-link">出团通知书</router-link>
                            </el-button>
                           <el-button type="text" v-show="scope.row.oStatus!=4">
                               <router-link :to="{ name: 'groupConfirmPrint',query: {id: scope.row.id}}" class="yjk-link">组团社确认单</router-link>
                            </el-button>
                           <!-- <el-button type="text" @click="sendMessageAlert" v-show="scope.row.oStatus!=4">发送短信</el-button> -->
                        </div>
                        <div class="ptlr20 textCenter">
                            <el-button type="primary" @click="orderDetailGoto(scope.row.id)" class="yjk-orderDetailBtn">订单详情</el-button>
                            <el-button @click="getContractDetail(scope.row.id)" class="yjk-orderChangeSel">审核合同</el-button>
                            <el-select  @change="orderChange" placeholder="订单修改" value="" v-model="orderChangeType[scope.row.id]" class="yjk-orderChangeSel" v-show="scope.row.oStatus!=3&&scope.row.oStatus!=4" >
                                <!-- <el-option key="0" label="订单修改" value="0" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="1" label="调整金额" value="1" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="2" label="调整座位" value="2" v-show="scope.row.oStatus!=4&&scope.row.oStatus!=5"></el-option> -->
                                <!-- <el-option key="3" label="线下支付" value="3" v-show="scope.row.oStatus==0||scope.row.oStatus==1"></el-option> -->
                                <!-- <el-option key="4" label="订单审核" value="4" v-show="scope.row.oStatus==5"></el-option> -->
                                <el-option key="5" label="取消订单" value="4"></el-option>
                            </el-select>
                            <!-- <el-button type="primary" @click="quickPay(scope.row.id)" class="yjk-orderDetailBtn" v-show="scope.row.oStatus==0">立即支付</el-button>                             -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright pageMargin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->

        </div>
    </div>
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
                <span class="yjk-innerTitle">取消原因:</span>
                <span class="w70per inlineblock">
                    <!-- <el-select v-model="cancelOrder.reason">
                        <el-option v-for="item in brandArr" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
                    </el-select>                     -->
                    <el-input v-model="cancelOrderObj.reason"></el-input>
                </span>
            </div>
            <div>
                <span class="yjk-innerTitle fleft clearfix">违约金:</span>
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
            <el-button class="fright mt10 mr10 btnInTab" @click="contractUrl">查看合同</el-button>
        </div>
        <div class="yjk-alertInner">
            <div class="contentTitle">合同补充约定</div>
            <div class="contentBody">
                <div class="contentWord">{{checkContractObj.contractAgreement}}</div>
                <div class="contentBG passImg" v-if="checkContractObj.status==1||checkContractObj.status==2||checkContractObj.status==3"></div>
                <div class="contentBG unpassImg" v-if="checkContractObj.status==6"></div>
            </div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button class="fright mt10 mr10 btnInTab" @click="checkContract(1)" v-if="checkContractObj.status==0">不通过</el-button>
            <el-button type="primary" class="fright mt10 mr10 btnInTab" @click="checkContract(0)" v-if="checkContractObj.status==0">通过</el-button>
        </div>
    </jdy-alert>

</div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import API from '@/pages/sale/api/index';

export default {
    name: 'orderbuyer',
    data() {
        return {
            btnFlag:false,
            searchType: 0,//搜索方式
            // 用于搜索条件筛选
            ruleform: {
                currPage: 1,
                pageSize: 10,
                statuses:[0,1,2,3,4],//状态
                dateType: 2,//日期类型
                dateStart: dateChange(-30),//起始日期
                dateEnd: dateChange(0),//结束日期
                oBuyerCompanyId:null,//报名社id
                oBuyerId:null,//报名人id
                orderType:0,//类型:卖家订单
                pBrand:null,//品牌id
                oProductId:null,//产品id
                // pTypes:[10,11,20,30,40,50],//产品类型
                pTypes:[],
                oSalerCompanyId:null,//供应商id
                oSalerId:null,//供应商计调人员id
                oPayMethod: null,//支付方式
                searchKey:"",//快速查询
                export:false,//是否导出
                contractStatus:0, //合同审核状态
            },
            datePicker:[new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],//查询日期
            // 产品类型基础
            productType:[{
                value: 10,
                label: '周边短线'
            }, {
                value: 11,
                label: '国内长线'
            },{
                value: 20,
                label: '出境旅游'
            },{
                value: 30,
                label: '邮轮'
            },{
                value: 40,
                label: '特色旅游'
            },{
                value: 50,
                label: '自助游'
            },{
                value: 67,
                label: "单一资源+拍"
            }],
            //支付方式基础
            payType: [{
                value: 0,
                label: '在线支付'
            }, {
                value: 1,
                label: '信用支付'
            },{
                value: 2,
                label: '线下支付'
            },{
                value: 3,
                label: '未支付'
            },{
                value: 4,
                label: '全部'
            }],
            brandArr:[],// 产品品牌基础
            productArr:[],//产品基础
            SalerCompanyIdArr:[],//单位基础
            SalerIdArr:[],//计调人员基础
            BuyerCompanyIdArr:[],//报名社基础
            BuyerIdArr:[],//报名人基础

            tableData:[],//表格
            jdytabActive: 0,  //是否被选中
            isReturn: false,   //是否退票
            orderChangeType:[],//订单修改按钮
            orderTotal:{
                statuses_0:0,
                statuses_1:0,
                statuses_2:0,
                statuses_3:0,
                statuses_4:0,
            },
            // 分页
            currentPage: 1, //列表当前所在页,
            pageSize: 10,
            tableDataTotal: 0,
            fullscreenLoading:false, //加载
            loading: false,   //select远程查询加载
            logindata:null,//登陆数据
            rowData:null,//被选中数据
            // 调整金额弹窗
            priceChangeObj:{
                flag:false,
                radio:null,
                money:null,
                promotion:null,
                remark:""
            },
            // 线下支付弹窗
            offlinePayObj:{
                flag:false,
                opPayTime:null,
                opComments:""
            },
            // 取消订单
            cancelOrderObj:{
                flag:false,
                money:null,
                reason:null
            },
            // 审核合同
            checkContractObj:{
                flag:false,
                contractId:null,
                contractAgreement:"",
                url:"",
                status:0,
            },
            downloadUrl:'',
            uDataLimit:null
        }
    },
    mounted() {
        this.logindata = JSON.parse(sessionStorage.loginData);
        this.ruleform.oSalerCompanyId=this.logindata.uCompanyId
        this.getTableData();
        this.remote_oSalerCompanyId();
        this.uDataLimit=this.logindata.uDataLimit;
        if(this.uDataLimit==3){
            this.remote_oBuyerCompanyId();
        }
    },
    methods: {
        // 获取表格
        getTableData() {
            if(arguments[0]){
                this.jdytabActive=null;
                console.log("123",arguments[0])
            }
            this.searchType==0&&(this.ruleform.pTypes=[]);
            var temptype=this.ruleform.pTypes;
            let params=JSON.parse(JSON.stringify(this.ruleform))
            for(let i=0; i < params.pTypes.length; i++){
                switch(params.pTypes[i]){
                    case "周边短线":
                        params.pTypes[i]=10;
                        break;
                    case "国内长线":
                        params.pTypes[i]=11;
                        break;
                    case "出境旅游":
                        params.pTypes[i]=20;
                        break;
                    case "邮轮":
                        params.pTypes[i]=30;
                        break;
                    case "特色旅游":
                        params.pTypes[i]=40;
                        break;
                    case "自助游":
                        params.pTypes[i]=50;
                        break;
                    case "单一资源+拍":
                        params.pTypes[i] = 67;
                        break;
                }
            };
            API.getContractList(params).then(response => {
                if (response.body.code == 0) {
                    let data=response.body.body;
                    this.orderTotal.statuses_1=data.extObj.review;
                    this.orderTotal.statuses_2=data.extObj.pass;
                    this.orderTotal.statuses_3=data.extObj.unPass
                    this.tableData=data.list;
                    this.tableData.forEach(value=>{
                        if(value.tourists.length!=0){
                            let tempCount=null;
                            tempCount=value.tourists.filter(cell=>{
                                return cell.otType==0
                            });
                            value.adultNum=tempCount.length!=0?tempCount.length:0;
                            tempCount=value.tourists.filter(cell=>{
                                return cell.otType==1
                            });
                            value.childNum=tempCount.length!=0?tempCount.length:0;
                        }else{
                            value.adultNum=0;
                            value.childNum=0;
                        }
                        //回程日期
                        value.eCalendar=value.sCalendar+(value.pDays-1)*3600 * 1000 * 24;
                    })
                    this.tableDataTotal = data.total;
                } else {

                }
            })
        },
        // 页头切换
        jdytab(index) {
            // if(index==null){
            //     // this.ruleform.statuses=this.isReturn?[0,1,2,3,4]:[0,1,2,3];
            //     this.ruleform.statuses=[0,1,2,3,4]
            // }else{
            //     this.ruleform.statuses=[];
            //     this.ruleform.statuses.push(index);
            // }
            this.jdytabActive = index;
            this.ruleform.contractStatus=index;
            this.getTableData();
        },
        //日期切换
        dateRangeChange(value){
            console.log(typeof(value),value)
            if (value) {
                let values = value.split(" - ");
                this.ruleform.dateStart = values[0];
                this.ruleform.dateEnd = values[1];
            }
        },
        // 是否选中退票
        isReturnFn() {
            this.ruleform.statuses=this.isReturn?[0,1,2,3,4]:[0,1,2,3];
            this.getTableData();
        },
        //分页
        handleCurrentChange(val){
            if (val) {
                this.ruleform.currPage = val;
                this.ruleform.pageNum = val;
                this.getTableData();
            }
        },
        // 订单修改
        orderChange(val){
            switch (val){
                case "1":
                    this.priceChangeObj.flag=true;
                    break;
                case "2":
                    // this.setChangeAlert();
                    break;
                case "3":
                    this.offlinePayObj.flag=true;
                    break;
                case "4":
                    this.cancelOrderObj.flag=true;
                    break;
            }
            this.$nextTick(function(){
                jdyFn.setAlertStyle('showtfcity');
            });
        },
        // 订单详情跳转
        orderDetailGoto(orderId){
            this.$router.push({name:'orderSellerDetail',query:{id:orderId}})
        },
        // 调整金额
        priceChange_submit(){
            console.log("123",this.rowData);
        },
        // 调整座位

        // 线下支付
        offlinePay_submit(){
            this.btnFlag = true;
            let param={
                opOrderId:this.rowData.id,
                opComments:this.offlinePayObj.opComments,
                opPayTime:this.offlinePayObj.opPayTime.FormatDate('yyyy-MM-dd'),
                pageSize: 10,
                currPage: 1,
            };
            API.offlinePay(param).then(response=>{
                this.btnFlag = false;
                if(response.body.success==true){
                    this.$message.success("线下支付成功");
                    this.getTableData();
                }else{

                };
                this.orderChangeType=[];
                this.offlinePayObj.opComments="";
                this.offlinePayObj.opPayTime=null;
                this.closeAlert()
            })
        },
        // 取消订单
        cancelOrder_submit(){
          this.btnFlag = true;
            let param={
                orderId:this.rowData.id,
                money:this.cancelOrderObj.money,
                remark:this.cancelOrderObj.reason,
                oOrderNo:this.rowData.oOrderNo,
                saler:true,
                pageSize: 20,
                currPage: 1
            };
            API.cancelOrder(param).then(response=>{
              this.btnFlag = false;
                if(response.body.success==true){
                    this.$message.success("取消订单操作成功");
                    this.getTableData();
                }else{
                    this.$message.error("取消订单操作失败");
                };
                this.orderChangeType=[];
                this.cancelOrderObj.money=null
                this.cancelOrderObj.reason=null
                this.closeAlert()
            })
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
        sendMessageAlert(){
            this.$confirm('确定发送短信?', '温馨提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                let param={
                    id:this.rowData.id,
                    pageSize: 20,
                    currPage: 1
                };
                API.sendMessage(param).then(response=>{
                    if(response.body.success==true){
                        this.$message.success("短信发送成功")
                    }else{
                        this.$message.error("短信发送失败")
                    };
                })
            }).catch(() => {

            });
        },
        closeAlert(){
            this.btnFlag = false;
            this.orderChangeType=[];
            this.priceChangeObj.flag=false;
            this.offlinePayObj.flag=false;
            this.cancelOrderObj.flag=false;
            this.checkContractObj.flag=false;
            $('.alertbgg').remove();
        },
        // 刷新按钮
        refresh() {
            this.ruleform= {
                currPage: 1,
                pageSize: 10,
                statuses:[0,1,2,3,4],//状态
                dateType: 2,//日期类型
                dateStart: dateChange(-30),//起始日期
                dateEnd: dateChange(0),//结束日期
                oBuyerCompanyId:null,//报名社id
                oBuyerId:null,//报名人id
                orderType:0,//类型:卖家订单
                pBrand:null,//品牌id
                oProductId:null,//产品id
                // pTypes:[],//产品类型
                pTypes:[],
                oSalerCompanyId:null,//供应商id
                oSalerId:null,//供应商计调人员id
                oPayMethod: null,//支付方式
                searchKey:"",//快速查询
                export:false,//是否导出
                contractStatus:0
            },
            this.jdytabActive=0
            this.datePicker=[new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()];//查询日期
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    showClose: true,
                    message: '刷新成功',
                    type: 'success'
                });
                this.currentPage=1
                this.getTableData();
            }, 1000);
        },
        // 订单导出
        orderOut(){
            // let params=this.ruleform;
            let params=JSON.parse(JSON.stringify(this.ruleform))
            for(let i=0; i < params.pTypes.length; i++){
                switch(params.pTypes[i]){
                    case "周边短线":
                        params.pTypes[i]=10;
                        break;
                    case "国内长线":
                        params.pTypes[i]=11;
                        break;
                    case "出境旅游":
                        params.pTypes[i]=20;
                        break;
                    case "邮轮":
                        params.pTypes[i]=30;
                        break;
                    case "特色旅游":
                        params.pTypes[i]=40;
                        break;
                    case "自助游":
                        params.pTypes[i]=50;
                        break;
                    case "单一资源+拍":
                        params.pTypes[i] = 67;
                        break;
                }
            };
            params.export=true;
            // API.exportOrder(params,{ emulateJSON: true }).then(response=>{
            //     if(response.body.code==0){
            //         // var disp = request.getResponseHeader('Content-Disposition');
            //         // if (disp && disp.search('attachment') != -1) {  //判断是否为文件
            //         //     var form = $('<form method="POST" action="' + url + '">');
            //         //     $.each(params, function(k, v) {
            //         //         form.append($('<input type="hidden" name="' + k +
            //         //                 '" value="' + v + '">'));
            //         //     });
            //         //     $('body').append(form);
            //         //     form.submit(); //自动提交
            //         // }
            //     }else{
            //     };
            // })
            this.downloadUrl=`${api_prefix}Order/export?`;
            if(params.statuses.length!=0){
                let tempstaut="statuses=";
                tempstaut+=params.statuses.join(",")
                this.downloadUrl+=`${tempstaut}&`;
            }
            if(params.pTypes.length!=0){
                let temppTypes="statuses=";
                temppTypes+=params.temppTypes.join(",")
                this.downloadUrl+=`${temppTypes}&`;
            }
            delete params.pTypes;
            delete params.statuses;
            for(let key in params){
                if(params[key]!==null&&params[key]!==""){
                    this.downloadUrl+=`${key}=${params[key]}&`
                }
            }
            // this.downloadUrl+=`orderType=0`
            console.log(this.downloadUrl)
            location.href= this.downloadUrl;
        },
        // 查询产品品牌
        remote_pBrand(key){
            let param={
                pageSize: 20,
                currPage: 1,
                bDel: 0,
                bCompanyId: this.logindata.uCompanyId,
                bName: $.trim(key)
            };
            this.loading = true;
            API.brandList(param).then(response=>{
                if(response.body.code==0){
                    this.brandArr=response.body.body.resultList
                }else{
                };
                this.loading = false;
            })
        },
        // 查询产品
        remote_oProductId(key){
            let param={
                puserId: null,
                companyId: this.logindata.uCompanyId,
                pName: $.trim(key),
                pBrand: this.ruleform.pBrand,
                pType: "null",
                pageSize: 20,
                currPage: 1
            };
            this.loading = true;
            API.productList(param).then(response=>{
                if(response.body.code==0){
                    this.productArr=response.body.body.resultList
                }else{

                };
                this.loading = false;
            })
        },
        // 查询供应商
        remote_oSalerCompanyId(key){
            this.$http.post(api_prefix + 'Company/index', { type: 343, pageIndex: 1, fastSearchStr: $.trim(key)}, { emulateJSON: true }).then(response => {
                if(response.body.code==0){
                    this.SalerCompanyIdArr=response.body.body.list
                }else{

                };
            });
        },
        // 查询计调人员
        remote_oSalerId(key){
            if(this.ruleform.oSalerCompanyId==''){
                return this.ruleform.oSalerId=null
            }
            let param={
                puserId: null,
                companyId: this.ruleform.oSalerCompanyId,
                pName: key,
                pBrand: this.ruleform.pBrand,
                pType: "null",
                pageSize: 20,
                currPage: 1
            };
            this.loading = true;
            API.userList(param).then(response=>{
                if(response.body.code==0){
                    this.SalerIdArr=response.body.body
                }else{

                };
                this.loading = false;
            })
        },
        // 查询报名社
        remote_oBuyerCompanyId(key){
            this.$http.post(api_prefix + 'Company/index', { pid:343 ,searchType:1, pageIndex: 1, fastSearchStr: $.trim(key)}, { emulateJSON: true }).then(response => {
                if(response.body.code==0){
                    this.BuyerCompanyIdArr=response.body.body.list
                }else{

                };
            });
        },
        // 查询报名人
        remote_oBuyerId(key){
            if(this.ruleform.oBuyerCompanyId==''){
                return this.ruleform.oBuyerId=null
            }
            let param={
                puserId: null,
                companyId: this.oBuyerCompanyId,
                pName: key,
                pBrand: this.ruleform.pBrand,
                pType: "null",
                pageSize: 20,
                currPage: 1
            };
            this.loading = true;
            API.userList(param).then(response=>{
                if(response.body.code==0){
                    this.BuyerIdArr=response.body.body
                }else{

                };
                this.loading = false;
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        // 行点击事件
        handleRowChange(row){
            console.log("行点击事件",row);
            this.rowData=row;
        },
        // // 审核合同弹窗
        // checkContractAlert(id){

        //     this.getContractDetail(id)
        // },
        // 是否审核
        checkContract(_status){
            let param={
                id:this.rowData.id,
                contractId:this.checkContractObj.contractId,
                status:_status
            }
            API.checkContract(param).then(response=>{
                if(response.body.code==0){
                    this.$message.success("审核状态已更新!")
                }else{
                    this.$message.error("审核状态更新失败!")
                };
                this.checkContractObj.url=""
                this.checkContractObj.contractAgreement=""
                this.checkContractObj.contractId=null
                this.checkContractObj.status=0
                this.closeAlert();
                this.getTableData()
            })
        },
        // 查看合同
        getContractDetail(id){
            this.$http.get(api_prefix + 'Order/selectContract/'+id).then(response => {
                if(response.body.code==0){
                    this.checkContractObj.flag=true;
                    this.$nextTick(function(){
                        jdyFn.setAlertStyle('showtfcity');
                    });
                    let data=response.body.body
                    this.checkContractObj.url=data.url
                    this.checkContractObj.contractAgreement=data.contractAgreement
                    this.checkContractObj.contractId=data.contractId
                    this.checkContractObj.status=data.status
                }else{
                    this.$message.error("获取审核信息失败!")
                };
            },response=>{
                console.log("失败！")
            });
        },
        // 合同路径
        contractUrl(){
            window.open(this.checkContractObj.url)
        },
    },
    filters: {

    },
    components: {
        jdyAlert,
    },

}
</script>

<style>
.jdy-tab div.yjk-number{
    display: inline-block;
    color:#ff7a33;
    height: inherit;
    position: absolute;
    bottom: 0;
    left: 70%;
}

.yjksell .el-table__row>td:nth-child(1),
.yjksell .el-table__row>td:nth-child(2),
.yjksell .el-table__row>td:nth-child(3){
    padding-bottom: 12px;
}
.yjksell .el-table__row>td:nth-child(4)>.cell{
    height:175px
}
.alertHead{
    width: 100%;
    height: 50px;
    background: #f9fafc;
    border-bottom: 1px solid #d7dfe3;
}
.yjk-alertInner .contentBody{
    padding: 0 0 70px 0;
    min-height: 100px;
    position: relative;
}
.yjk-alertInner .contentBG{
    padding: 0;
    width:200px;
    height: 200px;
    position: absolute;
    bottom: -50px;
    right: 0;
}
.yjk-alertInner .contentTitle{
    text-align: center;
    font-weight: 800;
}
.paddLeft{
    padding-left: 10px;
}
</style>
