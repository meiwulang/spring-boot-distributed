<template>
    <div class="jl-information jl-dictionary">
        <div class="jdy-content jdy-transfer fleft noborder">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="快速搜索：" prop="quickSearch" label-width="100px">
                            <el-input placeholder="标题或关键字等" @change="searchKeyWords">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="handleIconClick" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="default" class="btnbg fr" style="margin-right: 10px" @click="alertJournal">日志</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="单位名称">
                        <template scope="scope">
                            <span class="jl-noticeTitle">{{scope.row.cName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="法人代表" width='80'>
                        <template scope="scope">
                            <span>{{scope.row.cChargeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" width='120'>
                        <template scope="scope">
                            <span>{{scope.row.cTel}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公司类型" width='80'>
                        <template scope="scope">
                            <span>{{scope.row.cType | companyStyle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态" width='80'>
                        <template scope="scope">
                            <span style='color: red'>待审核</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="身份证" width='160'>
                        <template scope="scope">
                            <span>{{scope.row.cIdcard}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="注册时间" width='120'>
                        <template scope="scope">
                            <span>{{scope.row.createTime | changeCreate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template scope="scope">
                            <el-button type="default" size="mini">
                                <router-link :to="{ name: 'unitauditudetail',query: {id: scope.row.id}}">审核</router-link>
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id)">
                                删除
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
                <!--系统日志查看 弹窗  begin-->
                <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
                    <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
                </jdy-alert>
                <!--系统日志查看 弹窗  begin-->
            </div>
        </div>
        <!--jdy-content end-->
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
    name: 'dictionary',
    data() {
        return {
            searchValue: '',//搜索框的值
            alertNoticeFlag: false,
            alertJournalFlag: false,
            currentPage: 1, //列表当前所在页,
            pageSizeAll: 20,
            journalCurrentData: {}, //日志数据ww
            ruleForm: {},
            searchInput: '',
            rules: {},
            tableData: [],
            tableDataTotal: 0,
            dictionaryForm: {},
            fullscreenLoading: false,
            //日志相关参数
            pid: null,
            module: "Company",
            journalTotal: 0,
            journalCurrentData: [], //日志数据
        }
    },
    filters: {
        companyStyle: function (value) {
            if (value == '0') {
                return value = '供应商'
            } else if (value == '1') {
                return value = '分销商'
            } else {
                return value = '管理公司'
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
            return value = oTime.substr(0, 10);
        }
    },
    mounted() {
        this.$http.post(api_prefix + '/Company/selectAuditingCompanies', {
            pageIndex: this.currentPage
        }, { emulateJSON: true }).then(response => {
            if (response.data.code == 0) {
                let data = response.data.body;
                this.tableData = data.list;
                console.log(data);
                this.tableDataTotal = data.total;
            } else {
                this.$alert(response.data.message, '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => { }
                });
            }
        }, response => {
            console.log('出错了');
        });
    },
    methods: {
        getUnitList() {//更新table数据
            this.$http.post(api_prefix + '/Company/selectAuditingCompanies', {
                pageIndex: this.currentPage,
                fastSearchStr: this.searchValue
            }, { emulateJSON: true }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = data.list;
                } else {
                    this.$alert(response.data.message, '温馨提示', {
                        confirmButtonText: '确定',
                        callback: action => { }
                    });
                }
            }, response => {
                console.log('出错了');
            });
        },
        updatePage() {//刷新页面
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    showClose: true,
                    message: '刷新成功',
                    type: 'success'
                });
            }, 1000);
            this.getUnitList();
        },
        searchKeyWords(value) {//获取快速搜索的值
            console.log(value)
            this.searchValue = value;
        },
        handleIconClick(ev) {//快速搜索点击搜索后请求服务器
            this.getUnitList();
        },
        deleteInfor(id) {//点击删除
            this.groupId = id;
            console.log('当前ID', this.groupId)
            let text = '你确定删除单位信息吗？这里删除了，信息将会彻底删除掉，请慎用！'
            this.$confirm(text, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/Company/del', {
                    id: this.groupId,
                }, { emulateJSON: true }).then(response => {
                    if (response.data.code == 0) {
                        this.fullscreenLoading = true;
                        this.getUnitList();
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        }, 1000);
                    } else {
                        this.$alert(response.data.message, '温馨提示', {//保存成功提示
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            }).catch(() => {

            });
        },
        handleCurrentChange(val) {//获取当前页
            if (val) {
                var obj = { 'currentPage': val }
                this.getNewPage();
                this.currentPage = val;
            }
        },
        getNewPage() {//翻页请求
            this.$http.post(api_prefix + '/Company/selectAuditingCompanies', {
                fastSearchStr: this.searchValue,
                pageIndex: this.currentPage,
            }, { emulateJSON: true }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = data.list;
                } else {
                    this.$alert(response.data.message, '温馨提示', {//保存成功提示
                        confirmButtonText: '确定',
                        callback: action => { }
                    });
                }
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

