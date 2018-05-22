<template>
    <div class="jl-information">
        <div class="jdy-content jdy-transfer fleft jl-creditBill">
            <div class="jdy-content-inner">
                <div class="jdy-tab">
                    <a href="#" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
                        <span></span>
                    </a>
                    <a href="#" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">未还款
                        <span></span>
                    </a>
                    <a href="#" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">未还完
                        <span></span>
                    </a>
                    <a href="#" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已还完
                        <span></span>
                    </a>
                    <a href="#" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已撤销
                        <span></span>
                    </a>
                    <div style="height:60px;line-height:60px;margin-left:30px;" class="fl">
                        <el-switch v-model="includeRevoked" @change='isRevoked' on-color="#71dc1c" on-text="包含撤销" off-text="不包含撤销" :width='95' on-value="0" off-value="1">
                        </el-switch>
                    </div>
                    <el-button type="default" class="fright mt10 mr10" @click="alertJournal">日志</el-button>
                    <el-button type="default" class="fright mt10 mr10" @click="revokeBill">撤销账单</el-button>
                    <el-button type="default" class="fright mt10 mr10" @click="removeBill">移除订单</el-button>
                    <el-button type="default" class="fright mt10 mr10" @click="writeOff">销账</el-button>
                    <el-button type="default" class="fright mt10 mr10" @click="printBill">打印账单</el-button>
                </div>
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt30">
                    <el-row style="width: 70%;">
                        <el-form-item label="账单日期：" label-width="100px">
                            <el-date-picker v-model="ruleForm.dateRange" :picker-options="pickerOptions" type="daterange" @change="datetimerange" placeholder="选择时间范围" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="收款单位：" prop="type" label-width="100px">
                            <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="付款单位：" prop="type" label-width="100px">
                            <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生成方式：" prop="type" label-width="100px">
                            <el-select v-model="ruleForm.generate" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in generate" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="结算周期：" prop="type" label-width="100px">
                            <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="全局搜索：" prop="quickSearch" label-width="100px" class="creditBillSearch">
                            <el-input placeholder="账单号/分销商名称/编号/法人姓名/手机号" @change="searchKeyWords" v-model="searchValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="default" class="btnbg fr" @click="updatePage">清空条件</el-button>
                        <el-button type="primary" class="btnbg fr" @click="alertJournal">搜索</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table p10 pt0">
                <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="凭证编号" width="150">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            BL20179901000655
                        </template>
                    </el-table-column>
                    <el-table-column label="收款单位" width="200">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            杭州正太旅行社
                        </template>
                    </el-table-column>
                    <el-table-column label="付款单位" width="200">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            杭州德嘉旅行社有限公司
                        </template>
                    </el-table-column>
                    <el-table-column label="账单金额" width="90">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            ￥2448.00
                        </template>
                    </el-table-column>
                    <el-table-column label="已还金额" width="90">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            ￥2448.00
                        </template>
                    </el-table-column>
                    <el-table-column label="费用金额" width="90">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            ￥2448.00
                        </template>
                    </el-table-column>
                    <el-table-column label="未还金额" width="90">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            ￥2448.00
                        </template>
                    </el-table-column>
                    <el-table-column label="账单日期" width="100">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            2017-08-29
                        </template>
                    </el-table-column>
                    <el-table-column label="还款日期" width="200">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            2017-08-29 15：28：00
                        </template>
                    </el-table-column>
                    <el-table-column label="生成条件" width="80">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            手动
                        </template>
                    </el-table-column>
                    <el-table-column label="还款进度" width="200">
                        <template scope="scope">
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算周期" width="80">
                        <template scope="scope">
                            <!-- {{scope.row.nType}} -->
                            月结  一号
                        </template>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template scope="scope">
                            666
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
      <jdy-alert title="手动还款" @closeAlert="closeAlert" v-if="alertWriteOffFlag" class="dialog-lv dialog-credit">
        <el-row class="scroll-cont form-wrap p20 pb0">
          <el-form label-width="120px" :model="creditForm">
            <el-form-item label="单位名称：">
              <el-input v-model="creditForm.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="凭证编号：">
              <el-input v-model="creditForm.region" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="账单日期：">
              <el-date-picker type="date" placeholder="选择日期" v-model="creditForm.date1" :disabled="true"></el-date-picker>
            </el-form-item>
            <el-form-item label="账单金额：">
              <el-input v-model="creditForm.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="未还款金额：">
              <el-input v-model="creditForm.region" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="费用：">
              <el-input v-model="creditForm.region"></el-input>
            </el-form-item>
            <el-form-item label="本次还款：">
              <el-input v-model="creditForm.region"></el-input>
            </el-form-item>
            <el-form-item label="还款说明：">
              <el-input type="textarea" v-model="creditForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="">
              <p>还款说明中关于费用的说明请每项<span class="orange-font">单独一行</span>填写，格式[优惠：60] (不要方括号)</p>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="saveWriteOffBtn">确认还款</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 销账-手动还款 弹窗 end-->

        <!--系统日志查看 弹窗  begin-->
        <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
            <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
        </jdy-alert>
        <!--系统日志查看 弹窗  begin-->

    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
export default {
    components: {
        jdyAlert,
        jdyLog
    },
    name: 'information',
    data() {
        return {
            alertWriteOffFlag:false,
           creditForm:{},
            msg: 'pivilege',
            commonTime: '',
            currentId: '',//当前数据的id
            changeTypeValue: '',//选择类型的值
            searchValue: '',//搜索框的值
            isRecommendValue: '',//是否推荐的值
            currentStatus: '',//当前选择后的状态
            alertNoticeFlag: false,
            alertJournalFlag: false,
            currentPage: 1, //列表当前所在页,
            alertTitle: '',//查看公告标题
            alertContent: '',//查看公告内容
            pageSizeAll: 20,
            journalCurrentData: {}, //日志数据ww
            ruleForm: {
                dateRange: ''
            },
            searchInput: '',
            rules: {},
            type: [{
                value: '1',
                label: '资讯'
            }, {
                value: '2',
                label: '公告'
            }, {
                value: '3',
                label: '全部类型'
            }],
            tableData: [],
            fullscreenLoading: false,
            tableDataTotal: 0,
            //日志相关参数
            pid: null,
            module: "News",
            journalTotal: 0,
            journalCurrentData: [], //日志数据


            //
            includeRevoked: 0,
            percentage:80
        }
    },
    mounted() {
        this.$http.post(api_prefix + '/News/list', {
            nType: '',
            searchKey: this.searchValue,
            currPage: this.currentPage,
            pageSize: 20
        }).then(response => {
            let data = response.data.body;
            this.tableData = data.list;
            this.tableDataTotal = data.total;
        }, response => {
            console.log('出错了');
        });
    },
    computed: {
        journalTotal() { //日志页数
            return listData.journalData.length * 10
        }
    },
    filters: {
        changeType: function (value) {
            if (value == '1') {
                return value = '资讯'
            } else {
                return value = '公告'
            }
        },
        changeCreate: function (value) {
            console.log(1)
            var unixTimestamp = new Date(value);
            var oYear = unixTimestamp.getFullYear();
            var oMonth = unixTimestamp.getMonth() + 1;
            var oDay = unixTimestamp.getDate();
            var oHour = unixTimestamp.getHours();
            var oMin = unixTimestamp.getMinutes();
            var oSen = unixTimestamp.getSeconds();
            var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
            //补0操作
            function getzf(num) {
                if (parseInt(num) < 10) {
                    num = '0' + num;
                }
                return num;
            }
            return value = oTime;
        },
        changeUpdateTime: function (value) {
            if (value == undefined) {
                return value = '暂无更新时间'
            } else {
                var unixTimestamp = new Date(value);
                var Year = unixTimestamp.getFullYear();
                var Month = unixTimestamp.getMonth() + 1;
                var Day = unixTimestamp.getDate();
                var Hour = unixTimestamp.getHours();
                var Min = unixTimestamp.getMinutes();
                var Sen = unixTimestamp.getSeconds();
                var Time = Year + '-' + getzf(Month) + '-' + getzf(Day) + ' ' + getzf(Hour) + ':' + getzf(Min) + ':' + getzf(Sen);//最后拼接时间
                //补0操作
                function getzf(num) {
                    if (parseInt(num) < 10) {
                        num = '0' + num;
                    }
                    return num;
                }
                return value = Time;
            }
        }
    },
    methods: {
        getTableData(opt) {//更新table数据
            this.$http.post(api_prefix + '/News/list', {
                nType: this.changeTypeValue,
                searchKey: this.searchValue,
                pageSize: 20,
                currPage: this.currentPage
            }).then(response => {
                let data = response.data.body;
                this.tableData = data.list;
                this.tableDataTotal = data.total;
            }, response => {
                console.log('出错了');
            });
        },


        //
        isRevoked(value) {
            this.includeRevoked = value;
            console.log(this.includeRevoked, 'this.includeRevoked')
        },
        //打印账单
        printBill(){
          this.$router.push({ name: "creditBillPrint",query:{type: 1}})
        },
        //移除账单
        removeBill(){
          this.$router.push({ name: "creditBillRemove",query:{type: 1}})
        },
        //销账
        writeOff(){
          this.alertWriteOffFlag = true;
          this.$nextTick(function(){
            jdyFn.setAlertStyle('dialog-lv');
          });
        },
        closeAlert(){
          this.alertWriteOffFlag = false;
          $('.alertbgg').remove();
        },
        saveWriteOffBtn(){
          this.closeAlert();
        },
        //撤销账单
        revokeBill(){
          this.$confirm('账单撤销后将无法恢复, 确认要操作?', '友情提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '撤销成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消撤销'
            });
          });
        },
        changeType(value) {//获取选择类型的值
            console.log(value)
            this.changeTypeValue = value;
            console.log(this.changeTypeValue)
        },
        searchKeyWords(value) {//获取快速搜索的值
            console.log(value)
            this.searchValue = value;
        },
        handleIconClick(ev) {//快速搜索点击搜索后请求服务器
            this.getNoticeData();
        },
        getNoticeData() {//选择类型或搜索后的请求事件
            if (this.changeTypeValue != 3) {
                this.$http.post(api_prefix + '/News/list', {
                    nType: this.changeTypeValue,
                    searchKey: this.searchValue,
                    currPage: this.currentPage,
                    pageSize: 20
                }).then(response => {
                    let data = response.data.body;
                    this.tableData = data.list;
                    this.tableDataTotal = data.total;
                }, response => {
                    console.log('出错了');
                });
            } else {
                this.$http.post(api_prefix + '/News/list', {
                    searchKey: this.searchValue,
                    currPage: this.currentPage,
                    pageSize: 20
                }).then(response => {
                    let data = response.data.body;
                    this.tableData = data.list;
                }, response => {
                    console.log('出错了');
                });
            }
        },
        deleteInfor(id) {//点击删除
            this.currentId = id;
            console.log('当前ID', this.currentId)
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/News/updateStatus', {
                    id: this.currentId,
                    nStatus: 2,
                }).then(response => {
                    this.fullscreenLoading = true;
                    this.getTableData();
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                    }, 1000);
                }, response => {
                    console.log('出错了');
                });
            }).catch(() => {

            });
        },
        handleCurrentChange(val) {
            if (val) {
                var obj = { 'currentPage': val }
                this.getNewPage();
                this.currentPage = val;
            }
        },
        getNewPage() {
            this.$http.post(api_prefix + '/News/list', {
                nType: this.changeTypeValue,
                searchKey: this.searchValue,
                currPage: this.currentPage,
                pageSize: 20
            }).then(response => {
                let data = response.data.body;
                this.tableData = data.list;
                this.tableDataTotal = data.total;
            }, response => {
                console.log('出错了');
            });
        },
        //----------日志相关逻辑 start-----
        //关闭,打开日志弹窗
        alertJournal(alertJournalFlag) {
            if (!this.pid) { this.$alert("请选择产品"); return }
            this.alertJournalFlag = !this.alertJournalFlag
            if (this.alertJournalFlag) {
                this.$nextTick(function () {
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
                response.data.body.list.forEach(function (value) {
                    _self.journalCurrentData.push(value);
                });
                // this.journalCurrentData=response.data.body.list
            }, response => {
                console.log('获取日志出错了');
            });
        },
        //table行点击事件
        rowclickHandler(row, event, column) {
            this.pid = row.id;
            if (!this.companyId) { this.companyId = row.companyId }
            this.getLogData(1)
        },
        //----------日志相关逻辑 end-----
    }
}
</script>
<style scoped>
  .dialog-credit{
    width: 660px;
  }
</style>
