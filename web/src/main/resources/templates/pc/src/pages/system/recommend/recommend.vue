<template>
    <div class="jl-information">
        <div class="jdy-content jdy-transfer fleft noborder jl-recommend">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="类型：" prop="type" label-width="60px" style="margin-left:10px;">
                            <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType">
                                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="推荐类型：" prop="recommendtype" label-width="90px" style="margin-left:10px;">
                            <el-select v-model="ruleForm.recommendtype" placeholder="请选择" @change="changeReType">
                                <el-option v-for="item in recommendtype" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用城市:" prop="sets">
                            <div class="tfcity relative">
                                <div class="el-input">
                                    <input autocomplete="off" v-model="selectCityArr.name" placeholder="请选择城市" type="text" class="el-input__inner" @click="showtfCity">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="快速搜索：" prop="quickSearch" label-width="100px">
                            <el-input placeholder="产品名称" @change="getKeyValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="searchKeyWords" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label='产品编号' width='95'>
                        <template scope="scope">
                            {{scope.row.pNo}}
                        </template>
                    </el-table-column>
                    <el-table-column label="产品名称">
                        <template scope="scope">
                            <span class="jl-noticeTitle" style="display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-top: 8px;">{{scope.row.pName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="天数" width="65">
                        <template scope="scope">
                            {{scope.row.pDays}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="95">
                        <template scope="scope">
                            {{scope.row.uRealName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="目的地" width="165">
                        <template scope="scope">
                            <span>{{scope.row.destStrList | destStrList}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="推荐状态" width="105">
                        <template scope="scope">
                            <span>{{scope.row.pRecommend | pRecommend}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属单位" width="125">
                        <template scope="scope">
                            <span>{{scope.row.cName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="适用城市" width="255">
                        <template scope="scope">
                            <span class="jl-noticeTitle" style="display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-top: 8px;">{{scope.row.appliStrList | appliStrList}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-select v-model="recommendtypeCopyValue[scope.row.id]" placeholder="请选择" @change="changeRecommendtype">
                                <el-option v-for="item in recommendtypeCopy" :key="item.value" :label="item.label" :value="item.value">
                                    <div @click="getRecommendId(scope.row.id)">{{item.label}}</div>
                                </el-option>
                            </el-select>
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

        <jdy-alert title="投放城市选择" @closeAlert="closecfCity" v-if="showcfCityFlag" class="alertJournal showtfcity">
            <div class="showtfcityaa">
                <div class="showtfcityaa-scroll">
                    <div class="showtfcityaa-i">
                        <div class="showtfcityaaa" v-for="(value,key) in proviceArr" :key="value">
                            <div class="showtfcityaaa-head plr10 clearfix">
                                <span>{{key}}</span>
                                <el-button class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                                <el-button class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
                            </div>
                            <div class="showtfcityaaa-content plr10 clearfix">
                                <span v-for="ccitem in value" :key="ccitem.id" :dataId="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':selectCityArr.name.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alertfoot1 clearfix">
                <el-button type="primary" class="fright mt10 mr10" @click="closecfCity">取消</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="removeAll">刷新</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="selectAllAll">全选</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="saveCC">确认选择</el-button>
            </div>
        </jdy-alert>

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
            selectCityArr: { id: [], name: [] },
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
            ruleForm: {
                "type": "",
                "recommendtype": ''
            },
            searchInput: '',
            rules: {},
            type: [{
                value: 'null',
                label: '全部类型'
            }, {
                value: '10',
                label: '周边短线'
            }, {
                value: '11',
                label: '国内长线'
            }, {
                value: '20',
                label: '出境旅游'
            }, {
                value: '30',
                label: '邮轮'
            }, {
                value: '40',
                label: '特色游'
            }, {
                value: '50',
                label: '自助游'
            }, {
                value: '67',
                label: '单一资源+拍'
            }],
            recommendtype: [{
                value: '0',
                label: '未推荐'
            }, {
                value: '1',
                label: '推荐普通'
            }, {
                value: '2',
                label: '推荐精选'
            }],
            recommendtypeCopy: [{
                value: '0',
                label: '未推荐'
            }, {
                value: '1',
                label: '推荐普通'
            }, {
                value: '2',
                label: '推荐精选'
            }],
            tableData: [],
            fullscreenLoading: false,
            tableDataTotal: 0,
            showcfCityFlag: false,
            getReType: null,
            getType: null,
            recommendId: '',
            recommendtypeCopyValue: [],
            //日志相关参数
            pid: null,
            module: "Product",
            journalTotal: 0,
            journalCurrentData: [], //日志数据

        }
    },
    mounted() {
        this.defaultProviceArr();
        this.getTableData();
    },
    filters: {
        pRecommend: function (value) {
            if (value == '0') {
                return value = '未推荐'
            } else if (value == '1') {
                return value = '推荐普通'
            } else {
                return value = '推荐精选'
            }
        },
        destStrList: function (value) {
            value = value.toString();
            return value;
        },
        appliStrList: function (value) {
            value = value.toString();
            return value;
        }
    },
    methods: {
        getTableData(opt) {//更新table数据
            this.$http.post(api_prefix + '/productRecommend/list', {
                pageSize: 20,
                currPage: 1
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
            this.selectCityArr.name = '';
            this.pName = '';
            this.ruleForm.type = '';
            this.ruleForm.recommendtype = '';
            this.getReType = '';
            this.getType = '';
            this.getTableData();
        },
        showtfCity() { // 显示投放城市弹出框
            this.showcfCityFlag = true;
            this.$nextTick(function () {
                jdyFn.setAlertStyle('showtfcity');
                jdyFn.selectCity2();
                //                this.selectCityArr = arr;
            });
        },
        closecfCity() { //关闭投放城市弹出框
            this.showcfCityFlag = false;
            $('.alertbgg').remove();
        },
        saveCC() { // 保存投放城市
            this.selectCityArr = jdyFn.selectCity2(); //数据不是时时更新，只有保存的时候才赋值
            this.closecfCity();
        },
        removeAll() { //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
        },
        selectAllAll() { //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
        },
        defaultProviceArr() { //获取投放城市列表
            this.$http.post(api_prefix + '/City/selectCityPutList', { isopen: true }).then(response => {
                console.log(response.body.body);
                this.proviceArr = response.body.body;
            });
        },
        getKeyValue(value) {
            this.pName = value;
        },
        getRecommendId(id) {
            this.recommendId = id;
            console.log(this.recommendId, '99999999999')
        },
        changeRecommendtype(value) {
            console.log(value, '0000000000000000000000')
            console.log(this.recommendId, '0000000000000000000000')
            this.$http.post(api_prefix + '/product/updateRecommend', {
                id: this.recommendId,
                pRecommend: value
            }).then(response => {
                this.getTableData();
            }, response => {
                console.log('出错了');
            });
        },
        searchKeyWords() {
            this.$http.post(api_prefix + '/productRecommend/list', {
                "citys": this.selectCityArr.name,
                "currPage": this.currentPage,
                "pName": this.pName,
                "pPym": this.pName,
                "pRecommend": this.getReType,
                "pType": this.getType,
                "pageSize": 20
            }).then(response => {
                let data = response.data.body;
                this.tableData = data.list;
                this.tableDataTotal = data.total;
            }, response => {
                console.log('出错了');
            });
            console.log(this.selectCityArr.name, '1111111111111111111111111')
        },
        changeType(value) {//类型
            this.getType = value
        },
        changeReType(value) {//推荐类型
            this.getReType = value
        },
        handleCurrentChange(val) {
            if (val) {
                this.currentPage = val;
                this.getNewPage();
            }
        },
        getNewPage() {
            this.$http.post(api_prefix + '/productRecommend/list', {
                currPage: this.currentPage,
                pageSize: 20,
                citys: this.selectCityArr.name,
                pName: this.pName,
                pPym: this.pName,
                pRecommend: this.getReType,
                pType: this.getType
            }).then(response => {
                let data = response.data.body;
                this.tableData = data.list;
            }, response => {
                console.log('出错了');
            });
        } ,
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

