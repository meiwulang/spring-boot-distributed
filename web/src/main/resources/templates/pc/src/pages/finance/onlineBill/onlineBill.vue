<template>
    <div class="jl-information jl-onlinebill">
        <div class="jdy-content jdy-transfer fleft jl-creditBill">
            <div class="jdy-content-inner">
                <div class="jdy-tab">
                    <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: bStatus==null }">全部
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: bStatus==3 }">已提现
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: bStatus==1 }">处理中
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: bStatus==4 }">已失败
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: bStatus==0 }">已合并
                        <span></span>
                    </a>
                    <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: bStatus==2 }">已受理
                        <span></span>
                    </a>
                </div>
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt30">
                    <el-row style="width: 100%;">
                        <el-form-item label="账单日期：" label-width="100px">
                            <el-date-picker v-model="ruleForm.dateRange" :picker-options="pickerOptions" type="daterange" @change="datetimerange" placeholder="选择时间范围" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="type" label="收款单位：" label-width="100px">
                            <el-select v-model="selectedOptions" :filterable="true" :remote-method="searchCompany" remote clearable @change="handleChange" placeholder="请选择收款单位">
                                <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="全局搜索：" prop="quickSearch" label-width="100px" class="creditBillSearch">
                            <el-input placeholder="请输入凭证编号搜索" v-model="searchValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" class="btnbg fr" @click="handleIconClick">搜索</el-button>
                        <el-button type="default" class="btnbg fr" @click="getBill">导出明细</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table p10 pt0">
                <el-table :data="tableData" border style="text-again: center" class="all" highlight-current-row>
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-table :data="props.row.subBillList" border style="text-again: center" class="all childBill">
                                <el-table-column width="113">
                                </el-table-column>
                                <el-table-column label="账单日期" width="200">
                                    <template scope="scope">
                                        {{scope.row.createTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="收款单位" width="200">
                                    <template scope="scope">
                                        {{scope.row.bSalerCompanyName}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="凭证编号" width="199">
                                    <template scope="scope">
                                        {{scope.row.bBillNo}}
                                        <span style="color:red;margin-left:10px" v-if="scope.row.bBillType == 0">自动</span>
                                        <span style="color:red;margin-left:10px" v-if="scope.row.bBillType == 1">手动</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="实收金额 | 明细" width="150">
                                    <template scope="scope">
                                        <span v-if="scope.row.bPayedAmount">￥</span>{{scope.row.bPayedAmount | moneyTwoPoints}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="账单金额" width="90">
                                    <template scope="scope">
                                        <span v-if="scope.row.bAmount">￥</span>{{scope.row.bAmount | moneyTwoPoints}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="手续费" width="90">
                                    <template scope="scope">
                                        <span v-if="scope.row.bBrokerage">￥</span>{{scope.row.bBrokerage | moneyTwoPoints}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="提现日期" width="200">
                                    <template scope="scope">
                                        {{scope.row.bCashTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="状态" width="80">
                                    <template scope="scope">
                                        <span class="billTagTwo billTag">已合并</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注">
                                    <template scope="scope">
                                        {{scope.row.bRemark}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="79">
                                    <template scope="scope">
                                        <el-button type="default" size="mini">
                                            <router-link :to="{ name: 'onlineBillPrint',query: {id: scope.row.id,isNewNotice: false}}">账单详情</router-link>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="账单日期" width="200">
                        <template scope="scope">
                            {{scope.row.createTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="收款单位" width="200">
                        <template scope="scope">
                            {{scope.row.bSalerCompanyName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="凭证编号" width="200">
                        <template scope="scope">
                            {{scope.row.bBillNo}}
                            <span style="color:red;margin-left:10px" v-if="scope.row.bBillType == 0">自动</span>
                            <span style="color:red;margin-left:10px" v-if="scope.row.bBillType == 1">手动</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="实收金额 | 明细" width="150">
                        <template scope="scope">
                            <span v-if="scope.row.bPayedAmount">￥</span>{{scope.row.bPayedAmount | moneyTwoPoints}}
                        </template>
                    </el-table-column>
                    <el-table-column label="账单金额" width="90">
                        <template scope="scope">
                            <span v-if="scope.row.bAmount">￥</span>{{scope.row.bAmount | moneyTwoPoints}}
                        </template>
                    </el-table-column>
                    <el-table-column label="手续费" width="90">
                        <template scope="scope">
                            <span v-if="scope.row.bBrokerage">￥</span>{{scope.row.bBrokerage | moneyTwoPoints}}
                        </template>
                    </el-table-column>
                    <el-table-column label="提现日期" width="200">
                        <template scope="scope">
                            {{scope.row.bCashTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="80">
                        <template scope="scope">
                            <span class="billTagOne billTag" v-if="scope.row.bBillPid == 0 && scope.row.bStatus == 3">已提现</span>
                            <span class="billTagThree billTag" v-if="scope.row.bBillPid == 0 && scope.row.bStatus == 2">已受理</span>
                            <span class="billTagFour billTag" v-if="scope.row.bBillPid == 0 && scope.row.bStatus == 4">已失败</span>
                            <span class="billTagFive billTag" v-if="scope.row.bBillPid == 0 && scope.row.bStatus == 1">处理中</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template scope="scope">
                            {{scope.row.bRemark}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button type="default" size="mini">
                                <router-link :to="{ name: 'onlineBillPrint',query: {id: scope.row.id,isNewNotice: false}}">账单详情</router-link>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页   begin-->
                <div class="clearfix">
                    <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
                    </el-pagination>
                </div>
                <!-- 分页   end-->
            </div>
        </div>
        <!--jdy-content end-->

        <!-- 销账-手动还款 弹窗 begin-->

        <jdy-alert title="导出账单明细" @closeAlert="getBill" v-if="alertWriteOffFlag" class="alertTag" style="min-height:500px">
            <div class="gz-userinfo">
                <div class="gz-userInfoTitle">
                    <div class="leftline"></div>
                    <span class="fontmain">查询条件</span>
                    <div class="rightline"></div>
                </div>
                <el-row class="scroll-cont form-wrap p10">
                    <el-form label-width="120px" :model="creditForm">
                        <el-form-item prop="type" label="分销商：" label-width="100px">
                            <el-select v-model="selectedOptionsTwo" :filterable="true" :remote-method="searchCompanyTwo" remote clearable @change="handleChangeTwo" placeholder="请选择收款单位" style="width:100%">
                                <el-option :key="value.id" v-for="value in selectListTwo" :label="value.cName" :value="value.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="账单日期：" label-width="100px">
                            <el-date-picker v-model="creditForm.dateRange" type="daterange" @change="datetimerangeTwo" placeholder="选择时间范围" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="gz-userinfo" style="padding-bottom:10px;">
                <div class="gz-userInfoTitle">
                    <div class="leftline"></div>
                    <span class="fontmain">温馨提示</span>
                    <div class="rightline"></div>
                </div>
                <p class="tips">
                    1、分销商可选，但日期区间必选；
                </p>
                <p class="tips">
                    2、日期指订单的付款时间，查询结果按付款时间为准。
                </p>
            </div>
            <el-button type="primary" class="btnbg fr mr10" @click="getBill">关闭</el-button>
            <el-button type="primary" class="btnbg fr mr10">
                <a :href="downLoadHref" download="账单明细" style="color:#fff" @click="changeHref">导出表格</a>
            </el-button>
        </jdy-alert>

        <!-- 销账-手动还款 弹窗 end-->

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
    data() {
        return {
            currentPage: 1, //列表当前所在页,
            pageSizeAll: 20,
            rules: {},
            creditForm: {
                buyerCompanyId: 0,
                dateRange: '',
                createTimeE: '',
                createTimeS: '',
            },
            ruleForm: {
                dateRange: '',
                bBillNo: '',
                bBillType: '',
                bSalerCompanyId: 0,
                bStatus: '',
                createTimeE: '',
                createTimeS: '',
                currPage: 1,
                pageSize: 20
            },
            tableData: [{
                bBillPid: '',
                bAmount: 999,
                bStatus: 1,
                subBillList: [
                    { bAmount: 999 },
                    { bAmount: 999 }
                ]
            }],
            fullscreenLoading: false,
            tableDataTotal: 0,

            //
            bStatus: null,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            searchValue: '',
            selectedOptions: null,//双向绑定部门数据
            selectedOptionsTwo:null,
            selectList: [],
            selectListTwo: [],
            alertWriteOffFlag: false,
            downLoadHref:''
        }
    },
    mounted() {
        // this.getTableData()
        this.defaultSelectList(name)
        this.defaultSelectListTwo(name)
    },
    methods: {
        changeHref(){
            if(this.selectedOptionsTwo){
                this.downLoadHref = api_prefix + '/bill/downloadOnlineBillList/' + '?salerCompanyId=' + this.selectedOptionsTwo + '&startDate=' + this.creditForm.createTimeE + '&endDate=' + this.creditForm.createTimeS
            }else{
                this.downLoadHref = api_prefix + '/bill/downloadOnlineBillList/'+'?&startDate=' + this.creditForm.createTimeE + '&endDate=' + this.creditForm.createTimeS
            }
            console.log(this.downLoadHref,'downLoadHref')
        },
        //获取列表数据
        getTableData() {
            const sendData = this.ruleForm
            orderApi.getOnlineBill(sendData).then((response) => {
                if (response.data.code == '0') {
                    let data = response.data.body;
                    this.tableData = data.list;
                    console.log("11", data);
                } else {
                    this.$alert(response.data.message)
                }
            });
        },
        //打印账单
        printBill() {
            this.$router.push({ name: "creditBillPrint", query: { type: 1 } })
        },
        handleIconClick(ev) {//快速搜索点击搜索后请求服务器
            this.ruleForm.bBillNo = this.searchValue;
            this.getTableData();
        },
        handleCurrentChange(val) {
            if (val) {
                var obj = { 'currentPage': val }
                this.getNewPage();
                this.currentPage = val;
            }
        },
        datetimerange(value) {
            console.log(value, '时间范围')
            var trips = value.replace(/-/g, "").replace(/\s+/g, "");
            this.ruleForm.createTimeS = trips.substring(0, 8)
            this.ruleForm.createTimeE = trips.substring(8)
            console.log(this.ruleForm.createTimeS, 'this.ruleForm.createTimeS')
            console.log(this.ruleForm.createTimeE, 'this.ruleForm.createTimeE')
        },
        datetimerangeTwo(value) {
            console.log(value, '时间范围')
            // var trips = value.replace(/-/g, "").replace(/\s+/g, "");
            this.creditForm.createTimeS = value.substring(0, 10)
            this.creditForm.createTimeE = value.substring(10, 10)
            console.log(this.creditForm.createTimeS, 'this.creditForm.createTimeS')
            console.log(this.creditForm.createTimeE, 'this.creditForm.createTimeE')
        },
        searchCompany(name) {
            console.log(name);
            this.defaultSelectList(name)
        },
        searchCompanyTwo(name){
            console.log(name);
            this.defaultSelectListTwo(name)
        },
        //初始化单位选择
        defaultSelectList(name) {
            let url = api_prefix + '/Company/index';
            let data = { pageIndex: 1, type: 0 };
            if (name) {
                data['fastSearchStr'] = $.trim(name)
            }
            this.$http.post(url, data, { emulateJSON: true }).then(response => {
                let listData = response.body.body.list
                this.selectList = listData
            })
        },
        defaultSelectListTwo(name) {
            let url = api_prefix + '/Company/index';
            let data = { pageIndex: 1, type: 1 };
            if (name) {
                data['fastSearchStr'] = $.trim(name)
            }
            this.$http.post(url, data, { emulateJSON: true }).then(response => {
                let listData = response.body.body.list
                this.selectListTwo = listData
            })
        },
        //单位选择后查询数据
        handleChange(value) {
            console.log(value, '收款单位ID')
            this.ruleForm.bSalerCompanyId = value;
        },
        handleChangeTwo(value){
            console.log(value, '分销单位ID')
            this.creditForm.buyerCompanyId = value;
        },
        jdytab(val) {
            this.ruleForm.bStatus = val;
            this.bStatus = val;
            console.log(this.ruleForm.bStatus, 'this.ruleForm.bStatus')
            this.getTableData()
        },
        getBill() {
            this.alertWriteOffFlag = !this.alertWriteOffFlag
            if (this.alertWriteOffFlag) {
                this.$nextTick(function() {
                    jdyFn.setAlertStyle('getBill');
                });
            }
        },
    }
}
</script>
<style scoped>
.dialog-credit {
    width: 660px;
}

.billTag {
    display: inline-block;
    width: 50px;
    height: 20px;
    line-height: 20px;
    border-radius: 5px;
    text-align: center;
    color: #ffffff;
}

.billTagOne {
    background-color: #70D64C;
}

.billTagTwo {
    background-color: #F765CF;
}

.billTagThree {
    background-color: #3F95F7;
}

.billTagFour {
    background-color: #FF0000;
}

.billTagFive {
    background-color: #FF8F00;
}
.gz-userinfo {
  width: 84%;
  margin: 35px auto 30px;
  border: 1px solid #d7dfe3;
  padding: 20px 10px 25px 0;
  position: relative
}

.gz-userInfoTitle {
  position: absolute;
  width: 150px;
  left: 0px;
  right: 0px;
  top: -8px;
  background: #fff;
  margin: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leftline,
.rightline {
  width: 20px;
  height: 1px;
  background: #1f2d3d
}
.fontmain {
  padding: 0px 6px;
}
.tips{
    margin: 20px;
    color: #ff0000;
    font-size: 14px;
}
</style>
