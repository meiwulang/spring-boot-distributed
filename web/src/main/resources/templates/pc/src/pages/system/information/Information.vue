<template>
    <div class="jl-information">
        <div class="jdy-content jdy-transfer fleft noborder">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="类型：" prop="type" label-width="60px" style="margin-left:10px;">
                            <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快速搜索：" prop="quickSearch" label-width="100px">
                            <el-input placeholder="编号、角色名称等" @change="searchKeyWords" v-model="searchValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="handleIconClick" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="primary" class="btnbg fr addBtn">
                            <router-link :to="{ name: 'addnotice',query: {isNewNotice: true}}">添加</router-link>
                        </el-button>
                        <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label='状态' width='90'>
                        <template scope="scope">
                            <el-switch v-model="scope.row.nStatusB" @change='isStatus' @click.native='getId(scope.row.id)' on-color="#71dc1c" on-text="发布" off-text="未发布" :width='70'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题">
                        <template scope="scope">
                            <span class="jl-noticeTitle" @click="alertNotice(scope.row.nTitle,scope.row.nContent)" style="display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-top: 8px;">{{scope.row.nTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='nKeys' label="关键字" width="65">
                    </el-table-column>
                    <el-table-column label="类型" width="65">
                        <template scope="scope">
                            {{scope.row.nType | changeType}}
                        </template>
                    </el-table-column>
                    <el-table-column label="推荐" width="90">
                        <template scope="scope">
                            <el-switch v-model="scope.row.nRecommend" @change='isRecommend' @click.native='getId(scope.row.id)' on-color="#71dc1c" on-text="推荐" off-text="未推荐" :width='70'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop='createTime' label="添加时间" width="165">
                        <template scope="scope">
                            <span>{{scope.row.createTime | changeCreate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='updateTime' label="修改时间" width="165">
                        <template scope="scope">
                            <span>{{scope.row.updateTime | changeUpdateTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button type="default" size="mini">
                                <router-link :to="{ name: 'addnotice',query: {id: scope.row.id,isNewNotice: false}}">编辑</router-link>
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
            </div>
        </div>
        <!--jdy-content end-->

        <!--查看公告 弹窗 begin-->
        <jdy-alert title="查看公告" @closeAlert="alertNotice" v-if="alertNoticeFlag" class="alertNotice">
            <h1>{{alertTitle}}</h1>
            <p v-html="alertContent"></p>
        </jdy-alert>
        <!--查看公告 弹窗 end-->

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
                "type": "",
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
                return value = '--'
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
                pageSize:20,
                currPage: this.currentPage
            }).then(response => {
                let data = response.data.body;
                this.tableData = data.list;
                this.tableDataTotal = data.total;
            }, response => {
                console.log('出错了');
            });
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
            }, 1000);
            this.searchValue = '';
            this.changeTypeValue = '';
            this.getTableData();
        },
        getId(id) {//获取当前点击数据的Id
            this.currentId = id;
            console.log(this.currentId)
        },
        isStatus(value) {//当点击状态开关后获取当前状态并执行更新
            console.log(value)
            if (value == true) {
                this.currentStatus = 0;
            } else {
                this.currentStatus = 1;
            }
            console.log('this.currentStatus', this.currentStatus)
            this.updateStatus()
        },
        isRecommend(value) {//当点击推荐开关后获取当前推荐并执行更新
            console.log(value)
            this.isRecommendValue = value;
            console.log('this.isRecommendValue', this.isRecommendValue)
            this.updateRecommend()
        },
        updateRecommend() {//更新是否推荐上传服务器
            this.$http.post(api_prefix + '/News/updateRecommend', {
                id: this.currentId,
                nRecommend: this.isRecommendValue,
            }).then(response => {
            }, response => {
                console.log('出错了');
            });
        },
        updateStatus() {//更新状态改变上传服务器
            this.$http.post(api_prefix + '/News/updateStatus', {
                id: this.currentId,
                nStatus: this.currentStatus,
            }).then(response => {
            }, response => {
                console.log('出错了');
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
        alertNotice(title, content) {//关闭,打开查看公告弹窗
            console.log(title);
            console.log(content)
            this.alertTitle = title;
            this.alertContent = content;
            this.alertNoticeFlag = !this.alertNoticeFlag;
            if (this.alertNoticeFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertNotice');
                });
            }
        },
        alertJournal() {//关闭,打开日志弹窗
            this.alertJournalFlag = !this.alertJournalFlag;
            if (this.alertJournalFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertJournal');
                });
            }
        },
        handleCurrentJournalChange(index) { //日志  page
            var index = index - 1;
            this.journalCurrentData = listData.journalData[index]
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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
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

