<template>
    <div class="jl-information">
        <div class="jdy-content jdy-transfer fleft">
            <div class="jdy-content-inner">
                <div class="jdy-tab">
                    <a href="javascript:;" title="" @click="yjk_jdytab(null)" :class="{ active: jdytabActive==null }">全部
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="yjk_jdytab(0)" :class="{ active: jdytabActive==0 }">已退款
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="yjk_jdytab(1)" :class="{ active: jdytabActive==1 }">未退款
                        <span></span>
                    </a>
                    <el-button @click="refresh" class="fright mr20 mt10" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    <el-button @click="alertJournal" class="fright mr20 mt10">日志</el-button>
                </div>
                <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="80px" class="mt30">
                    <el-row style="width: 100%;">
                        <el-form-item label="支付方式：" label-width="100px">
                            <el-select v-model="ruleForm.opPayMethod">
                                <el-option v-for="item in opPayMethodBase" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="100px">
                            <el-select v-model="ruleForm.orStauts" placeholder="请选择">
                                <el-option :key="1" label="全部" :value="null">
                                </el-option>                                
                                <el-option :key="0" label="未退款" :value="false">
                                </el-option>
                                <el-option :key="1" label="已退款" :value="true">
                                </el-option>
                                <!-- <el-option :key="2" label="已退款" :value="true">
                                </el-option>                             -->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快速搜索：" label-width="100px">
                            <el-input placeholder="订单号" v-model="ruleForm.orOrderNo">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" class="btnbg" @click="getTableData">搜索</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table p10 pt0">
                <el-table :data="tableData" border class="all" highlight-current-row @current-change="handleRowChange">
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="订单号" width="300">
                        <template scope="scope">
                            {{scope.row.orOrderNo}}&nbsp;&nbsp;
                            <span class="jl-tag">
                                <span class="jl-noticeTitle bkone" v-show='scope.row.lColor == 0'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bktwo" v-show='scope.row.lColor == 1'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bkthree" v-show='scope.row.lColor == 2'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bkfour" v-show='scope.row.lColor == 3'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bkfive" v-show='scope.row.lColor == 4'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bksix" v-show='scope.row.lColor == 5'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bkseven" v-show='scope.row.lColor == 6'>{{scope.row.lName}}</span>
                                <span class="jl-noticeTitle bkeight" v-show='scope.row.lColor == 7'>{{scope.row.lName}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款金额">
                        <template scope="scope">
                            ￥{{scope.row.orRefund}}&nbsp;&nbsp;{{scope.row.opPayMethod|filteropPayMethod}}
                        </template>
                    </el-table-column>
                    <el-table-column label="产品信息" width="400">
                        <template scope="scope">
                            【{{scope.row.orProductNo}}】{{scope.row.orProductName}}&nbsp;&nbsp;出发日期:{{scope.row.leaveDayStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商">
                        <template scope="scope">
                            {{scope.row.orSalerName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="分销商">
                        <template scope="scope">
                            {{scope.row.orBuyerName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="退款原因">
                        <template scope="scope">
                            {{scope.row.orReason}}
                        </template>
                    </el-table-column>
                    <el-table-column label="退款备注">
                        <template scope="scope">
                            {{scope.row.orRemark}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click="handleBtn(scope.row)">
                                处理
                            </el-button>
                            <el-select @change="setLabel" size="mini" class="yjk-handleBnt" placeholder="标记为" value="" v-model="labelType[scope.row.id]">
                                <el-option v-for="item in labelList" :key="item.id" :label="item.lName" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 列表信息汇总 -->
                <div class="table-total">
                    <span>总计:
                        <span>退款金额:
                            <span class="yjk-total">{{tableTotal.countRefund | moneyTwoPoints}}</span>元&nbsp;&nbsp;订单数:
                            <span class="yjk-total">{{tableTotal.countNum}}</span>
                        </span>
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>实际已退款:
                        <span>退款金额:
                            <span class="yjk-total">{{tableTotal.countRefundNow | moneyTwoPoints}}</span>元&nbsp;&nbsp;订单数:
                            <span class="yjk-total">{{tableTotal.countNumNow}}</span>
                        </span>
                    </span>
                </div>
                <!-- 分页   begin-->
                <div class="clearfix">
                    <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
                    </el-pagination>
                </div>
                <!-- 分页   end-->
            </div>

        </div>
        <!--系统日志查看 弹窗  begin-->
        <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
            <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
        </jdy-alert>
        <!--系统日志查看 弹窗  begin-->

        <!--处理信息 弹窗  begin-->
        <jdy-alert title="处理信息" @closeAlert="closeHandleAlert" v-if="handleDetailFlag" class="alertCityList showtfcity">
            <div class="yjk-alertInner">
                <el-input type="textarea" v-model="handleDetail" placeholder="请输入处理结果">
                </el-input>                                 
            </div>
            <div class="alertfoot1 clearfix">
                <el-button type="primary" class="fright mt10 mr10" @click="resetInfo">重置</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="submitInfo">提交</el-button>
            </div>    
        </jdy-alert> 
        <!--处理信息 弹窗  end-->
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
import refundAPI from '@/pages/finance/api/index';

import testdata from '@/pages/finance/offlineRefund/testdata';

export default {
    components: {
        jdyAlert,
        jdyLog
    },
    name: 'offlinerefund',
    data() {
        return {
            // 表格查询
            ruleForm: {
                currPage: 1,
                opPayMethod: null,
                orOrderNo: null,
                orStauts: null,
                pageSize: 10,
            },
            //标签查询
            labelParam: {
                currPage: 1,
                lGroupId: 305,
                pageSize: 20
            },
            // 标签修改
            labelUpdate: {
                currPage: 1,
                id: null,
                orLabelId: null,
                orRemark: null,
                orStauts: true,
                pageSize: 200
            },
            // 支付方式基础选项
            opPayMethodBase: [{
                value: null,
                label: '全部类型'
            }, {
                value: 0,
                label: '在线支付'
            }, {
                value: 1,
                label: '信用支付'
            }],
            labelList: [],//标签列表基础选项
            jdytabActive: null,//表头切换
            tableData: [],//表格
            tableTotal: {},//表格统计数据
            labelType: [],
            fullscreenLoading: false,//用于刷新
            //日志相关   
            alertJournalFlag: false,
            pid: null,
            module: "News",
            journalTotal: 0,
            journalCurrentData: [], //日志数据 
            //处理按钮相关
            handleDetailFlag:false, 
            handleDetail:"",
            //分页
            currentPage: 1, //列表当前所在页, 
            pageSizeAll: 20,            
            tableDataTotal: 0, 
        }
    },
    mounted() {
        this.getTableData();
        this.getLabelData();
    },
    computed: {
        // journalTotal() { //日志页数
        //     return listData.journalData.length * 10
        // }
    },
    filters: {
        filteropPayMethod: function(value) {
            return value == 0 ? "在线支付" : "信用支付";
        }
    },
    methods: {
        // 页头切换
        yjk_jdytab(index) {
            if (index == null) {
                this.ruleForm.orStauts = null;
            } else if (index == 0) {
                this.ruleForm.orStauts = true;
            } else {
                this.ruleForm.orStauts = false;
            }
            this.jdytabActive = index;
            this.getTableData()
        },
        // 获取表格
        getTableData() {
            refundAPI.refundList(this.ruleForm).then(response => {
                if (response.body.code == 0) {
                    let data=response.body.body;
                    this.tableData = data.pageInfo.list;
                    this.tableTotal = {
                        countNum: data.countNum,
                        countNumNow: data.countNumNow,
                        countRefund: data.countRefund,
                        countRefundNow: data.countRefundNow,
                    }
                    this.tableDataTotal = data.pageInfo.total;
                } else {

                }
            })
        },
        // 刷新按钮
        refresh() {
            this.ruleForm = {
                currPage: 1,
                opPayMethod: null,
                orOrderNo: "",
                orStauts: null,
                pageSize: 10,
            },
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
        //获取标签列表
        getLabelData() {
            refundAPI.refundLabel(this.labelParam).then(response => {
                if (response.body.code == 0) {
                    this.labelList = response.body.body.list;
                } else {

                }
            })
        },
        // 行修改标签
        setLabel(val) {  
            console.log("change",this.labelList);
            //产看按钮值
            let tempLabel=this.labelList.filter(data=>{
                return data.id==val
            });
            let paramStauts=null;
            if(tempLabel.length!=0){
                paramStauts=tempLabel[0].lName=="未退款"?false:true;
            }         
            let param={
                id:this.pid,
                orLabelId:val,
                orStauts:paramStauts
            };
            refundAPI.refundLabelUpdate(param).then(response => {
                if (response.body.code == 0) {
                    this.$message.success('标签修改成功!');
                    this.labelType=[]
                    this.getTableData();
                } else {
                    // this.$message.error('标签修改失败');
                }
            })
        },
        // ----------处理按钮相关-----------
        //按钮点击
        handleBtn(row) {
            console.log("btn",row);
            this.handleDetailFlag = true;
            this.selectStationArr=[];
            this.$nextTick(function(){
                jdyFn.setAlertStyle('showtfcity');
            }); 
            this.labelUpdate.id=row.id; 
            this.labelUpdate.orRemark=row.orRemark;  
            this.handleDetail=row.orRemark;        
        },
        // 提交按钮
        submitInfo(){
            let param={
                id:this.labelUpdate.id,
                orRemark:this.handleDetail
            };
            refundAPI.refundLabelUpdate(param).then(response => {
                if (response.body.code == 0) {
                    this.$message.success('处理信息编辑成功!');
                    this.getTableData();
                    this.closeHandleAlert();                    
                } else {
                    // this.$message.error('处理信息编辑失败!');
                }
            })
        },
        resetInfo(){
            this.handleDetail=""
        },
        closeHandleAlert(){ //关闭弹出框
            this.handleDetailFlag = false;
            $('.alertbgg').remove();
        },        
        // 分页
        handleCurrentChange(val) {
            if (val) {
                this.ruleForm.currPage = val;
                this.ruleForm.pageNum = val;
                this.getTableData();
            }
        },
        //
        closeAlert() {
            this.alertWriteOffFlag = false;
            $('.alertbgg').remove();
        },
        // handleIconClick(ev) {//快速搜索点击搜索后请求服务器
        //     this.getNoticeData();
        // },
        // 行点击事件
        handleRowChange(val) {
            // if (val) {
            //     var obj = { 'currentPage': val }
            //     this.currentPage = val;
            // }
            this.pid = val.id;
            if (!this.companyId) { this.companyId = val.companyId }
            this.getLogData(1);
        },

        //----------日志相关逻辑 start-----
        //关闭,打开日志弹窗
        alertJournal(alertJournalFlag) {
            if (!this.pid) { return this.$alert("请选择订单"); }
            this.alertJournalFlag = !this.alertJournalFlag
            if (this.alertJournalFlag) {
                this.$nextTick(function() {
                    jdyFn.setAlertStyle('alertJournal');
                });
            }
        },
        //获取日志数据
        getLogData(index) {
            this.$http.post(api_prefix + '/logs/selectLogs?pageIndex=' + index + '&module=' + this.module + '&pid=' + this.pid
            ).then(response => {
                let _self = this;
                this.journalTotal = response.data.body.total;
                this.journalCurrentData = []
                response.data.body.list.forEach(function(value) {
                    _self.journalCurrentData.push(value);
                });
                // this.journalCurrentData=response.data.body.list
            }, response => {
                console.log('获取日志出错了');
            });
        },
        //table行点击事件
        // rowclickHandler(row, event, column) {
        //     this.pid = row.id;
        //     if (!this.companyId) { this.companyId = row.companyId }
        //     this.getLogData(1)
        // },
        //----------日志相关逻辑 end-----
    }
}
</script>
<style scoped>
.yjk-handleBnt {
    width: 85px;
}
</style>
