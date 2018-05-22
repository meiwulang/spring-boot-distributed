<template>
    <div class="jl-tag jl-information">
        <div class="jdy-content jdy-transfer fleft noborder" style='width: 15%;margin-right: 10px;'>
            <div class="jl-treeList">
                <div class="jl-firstList" v-for="(item,index) in firstListData" @click="clickFirstList($event,item.id)">
                    <i class="el-icon-caret-right rightIcon" style="margin-left: 10px;"></i>
                    <i class="el-icon-caret-top topIcon" style="margin-left: 10px"></i>
                    {{item.dName}}
                    <i class="el-icon-plus addChildList" @click.stop="alertChildList(null,item.companyId,item.id,null)"></i>
                    <template v-for="(item,index) in childListData">
                        <div class="jl-childList" @click.stop='getTagDetail($event,item.id)'>{{item.lgName}}
                            <i class="el-icon-delete2 childIconDelete" @click.stop='deleteChildList(item.id,item.lgPid)'></i>
                            <i class="el-icon-edit childIconEdit" @click.stop='alertChildList(item.id,item.companyId,item.lgPid,item.lgName)'></i>
                        </div>
                    </template>
                </div>
                <div class='jl-firstList' @click="getKeyWords($event)">
                    <span style='padding-left: 15px;'>关键词管理</span>
                </div>
            </div>
        </div>
        <div class="jdy-content jdy-transfer fleft noborder" style='width: 83%;min-height: 800px;margin-left: 0;margin-right: 0;padding-right: 10px;'>
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="快速搜索：" prop="quickSearch" label-width="100px" style="margin-left:10px;">
                            <el-input placeholder="标签名称等" @change="searchKeyWords" v-model="searchValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="handleIconClick" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="primary" class="btnbg fr addBtn" @click="alertTag(null,childId,firstId,null,null)" v-show="showAddBtn">
                            添加
                        </el-button>
                        <el-button type="primary" :disabled="true" class="btnbg fr" @click="alertTag(null,childId,firstId,null,null)" v-show="showDisAddBtn">
                            添加
                        </el-button>
                        <el-button type="primary" class="btnbg fr addBtn" @click="alertTag(null,childId,firstId,null,null)" v-show="showAddKeyBtn">
                            添加
                        </el-button>
                        <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all" v-show='showTag' @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="名称">
                        <template scope="scope">
                            <span class="jl-noticeTitle bkone" v-show='scope.row.lColor == 0'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bktwo" v-show='scope.row.lColor == 1'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bkthree" v-show='scope.row.lColor == 2'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bkfour" v-show='scope.row.lColor == 3'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bkfive" v-show='scope.row.lColor == 4'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bksix" v-show='scope.row.lColor == 5'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bkseven" v-show='scope.row.lColor == 6'>{{scope.row.lName}}</span>
                            <span class="jl-noticeTitle bkeight" v-show='scope.row.lColor == 7'>{{scope.row.lName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='dName' label="所属模块" width="200">
                    </el-table-column>
                    <el-table-column prop='lgName' label="所属分组" width="200">
                    </el-table-column>
                    <el-table-column prop='lSort' label="排序" width="55">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click="alertTag(scope.row.id,scope.row.lGroupId,scope.row.lModuleId,scope.row.lSort,scope.row.lName)">
                                编辑
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="keyWordsData" border style="text-again: center" class="all" v-show='showKeyWords' @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="名称">
                        <template scope="scope">
                            <span class="jl-noticeTitle bkone" v-show='scope.row.kColor == 0'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bktwo" v-show='scope.row.kColor == 1'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bkthree" v-show='scope.row.kColor == 2'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bkfour" v-show='scope.row.kColor == 3'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bkfive" v-show='scope.row.kColor == 4'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bksix" v-show='scope.row.kColor == 5'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bkseven" v-show='scope.row.kColor == 6'>{{scope.row.kName}}</span>
                            <span class="jl-noticeTitle bkeight" v-show='scope.row.kColor == 7'>{{scope.row.kName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属模块" width="200">
                        <template scope="scope">
                            <span>关键词管理</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='lSort' label="排序" width="55">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click="alertKeyWords(scope.row.id,scope.row.companyId)">
                                编辑
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteKeyWords(scope.row.id,scope.row.companyId)">
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

        <!--改变标签样式 begin-->
        <jdy-alert title="添加/编辑标签" @closeAlert="alertTag" v-if="alertTagFlag" class="alertTag">
            <el-form :model="addTagStyle" :rules="rules" ref="addTagStyle" label-width="100px">
                <el-row class="alertTagTop">
                    <el-col :span="8">
                        <el-form-item label="名称：" prop='lName'>
                            <el-input v-model="addTagStyle.lName" placeholder="请输入名称" @change="getTagName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排序：" prop='lSort'>
                            <el-input type="number" v-model.number="addTagStyle.lSort" placeholder="请输入排序" @change="getSort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <div class="fr jl-TagViewBtn">{{changeTagName || '预览样式'}}</div>
                    </el-col>
                </el-row>
                <el-row class="alertTagMain">
                    <ul>
                        <a href="javascript:;">
                            <li class="bkone" @click="changeColor(0)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bktwo" @click="changeColor(1)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bkthree" @click="changeColor(2)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bkfour" @click="changeColor(3)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bkfive" @click="changeColor(4)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bksix" @click="changeColor(5)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bkseven" @click="changeColor(6)"></li>
                        </a>
                        <a href="javascript:;">
                            <li class="bkeight" @click="changeColor(7)"></li>
                        </a>
                    </ul>
                </el-row>
                <el-row class="alertTagFooter">
                    <el-col :span="8">
                        <el-button type="primary" class="btnbg fr addBtn" @click="saveAddTag('addTagStyle')" v-show='!showKeyWords'>
                            保存
                        </el-button>
                        <el-button type="primary" class="btnbg fr addBtn" @click="saveAddKeyTag('addTagStyle')" v-show='showKeyWords'>
                            保存
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </jdy-alert>
        <!--改变标签样式 end-->

        <!--添加/编辑分组 弹窗 begin-->
        <jdy-alert title="添加/编辑标签分组" @closeAlert="alertChildList" v-if="alertChildListFlag" class="alertChildList">
            <el-form :model="addChildListData" :rules="rules" ref="addChildListData" label-width="100px">
                <el-row class="alertTagTop">
                    <el-col :span="20">
                        <el-form-item label="名称：">
                            <el-input placeholder="请输入内容" @change="getchildName" v-model="childName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="alertTagFooter">
                    <el-col :span="8">
                        <el-button type="primary" class="btnbg fr addBtn" @click="saveAddChildList('addChildListData')" v-loading.fullscreen.lock="fullscreenLoading">
                            保存
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </jdy-alert>
        <!--添加/编辑分组 end-->

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
    name: 'tag',
    data() {
        return {
            firstListData: [],
            childListData: [],
            showTag: true,
            showKeyWords: false,
            showUp: false,
            showChild: false,
            showAddBtn: false,
            showAddKeyBtn: false,
            showDisAddBtn: true,
            childListId: '',//获取二级菜单的Id
            childListModuleId: '',//获取一级菜单的Id
            changeTagId: '',//点击编辑获取当前id
            addTagValue: '',//点击第几个标签的标识
            addTagNameValue: '',//添加编辑标签名称输入框的值
            addTagSort: '',//添加编辑标签排序的值
            tagViewBtnColor: '',//用户选择的标签样式颜色
            currentId: '',//当前数据的id
            changeTypeValue: '',//选择类型的值
            searchValue: '',//搜索框的值
            isRecommendValue: '',//是否推荐的值
            currentStatus: '',//当前选择后的状态
            alertJournalFlag: false,//控制日志弹窗
            alertTagFlag: false,//控制添加编辑标签弹窗
            alertChildListFlag: false,
            currentPage: 1, //列表当前所在页,
            alertTitle: '',//查看公告标题
            alertContent: '',//查看公告内容
            pageSizeAll: 20,
            journalCurrentData: {}, //日志数据ww
            ruleForm: {},
            addTagStyle: {},
            searchInput: '',
            rules: {
                lName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                lSort: [
                    { required: true, message: '请输入排序' },
                    { type: 'number', message: '排序必须为数字值' }
                ]
            },
            tableData: [],
            addChildListData: {},
            firstId: '',//一级菜单Id
            childId: '',//二级菜单Id
            fullscreenLoading: false,
            tableDataTotal: 0,
            keyWordsData: [],
            changeTagName: '',
            dName: '',
            isKeyWords: false,
            //日志相关参数
            pid: null,
            module: "label",
            journalTotal: 0,
            journalCurrentData: [], //日志数据
            childName: ''
        }
    },
    mounted() {
        this.getFirstTagList();
        this.getChildTagList();
        // this.getTagDetailContent();
        // this.firstId = 5;
        setTimeout(() => {
            $(".jl-firstList").children('.jl-childList,.topIcon,.addChildList').hide();
            $(".jl-firstList").children('.rightIcon').show();
        },300)
    },
    methods: {
        getFirstTagList() {//获取一级标签数据
            this.$http.post(api_prefix + '/Dictionaries/dictList', {
                dGroupId: '3'
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.firstListData = data;
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
        getChildTagList() {//获取二级标签数据
            console.log('上传this.firstId', this.firstId)
            this.$http.post(api_prefix + '/label_group/list', {
                lgPid: this.firstId
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.childListData = data;
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
        getTagDetailContent() {//获取标签列表数据
            this.$http.post(api_prefix + '/label/list', {
                lGroupId: this.childId,
                lModuleId: this.firstId,
                lName: this.searchValue,
                currPage: this.currentPage,
                pageSize: 20
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = data.list;
                    this.tableDataTotal = response.data.body.total;
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
            this.searchValue = ''
            this.getTagDetailContent();
        },
        searchKeyWords(value) {//获取快速搜索的值
            console.log(value)
            this.searchValue = value;
        },
        handleIconClick(ev) {//快速搜索点击搜索后请求服务器
            if (this.isKeyWords == true) {
                console.log(1)
                this.getKeyWords()
            } else {
                console.log(2)
                this.getTagDetailContent();
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
        getNewPage() {//分页请求
            this.$http.post(api_prefix + '/label/list', {
                lName: this.searchValue,
                lGroupId: this.childId,
                lModuleId: this.firstId,
                currPage: this.currentPage,
                pageSize: 20
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = [];
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
        clickFirstList(event, id) {//点击左侧一级菜单获取相应标签详情列表并获取二级菜单的数据
        console.log(this.childListData,'childListData')
            let el = event.currentTarget;
            this.isKeyWords = false;
            this.firstId = id;
            this.childId = '';
            this.showAddBtn = false;
            this.showDisAddBtn = true;
            this.showAddKeyBtn = false;
            console.log('this.firstId', this.firstId)
            // this.$nextTick(() => {
                this.getChildTagList();
                this.getTagDetailContent();
                this.showTag = true;
                this.showKeyWords = false;
            // })
            $(".jl-firstList").removeClass('correntf');
            $(el).addClass('correntf')
            console.log(this.childListData, 'this.childListDatatest')
            if (this.childListData == {}) {
                console.log(1212)
                if ($(el).children('.rightIcon,.addChildList').siblings().css('display') == 'none') {
                    $(el).children('.rightIcon,.addChildList').siblings().show();
                    $(el).children('.topIcon').siblings().hide();
                } else {
                    $(el).children('.rightIcon,.addChildList').siblings().hide();
                    $(el).children('.topIcon').siblings().show();
                }
            }
            setTimeout(() => {
                console.log(11111111)
                console.log($(el).children('.jl-childList').siblings().css('display'), '88')
                if ($(el).children('.jl-childList').siblings().css('display') == 'inline-block') {
                    console.log(22222222)
                    $(".jl-firstList").children('.jl-childList,.topIcon,.addChildList').siblings().hide();
                    $(".jl-firstList").children('.rightIcon').show();
                    $(el).children('.jl-childList,.topIcon,.addChildList').siblings().show();
                    $(el).children('.rightIcon').hide();
                } else {
                    console.log(333333)
                    $(el).children('.jl-childList,.topIcon,.addChildList').siblings().hide();
                    $(el).children('.rightIcon').show();
                }
            }, 100)
        },
        getTagDetail(event, id) {//点击左侧二级菜单获取相应标签详情列表
            let eltwo = event.currentTarget;
            $(".jl-childList").removeClass('corrent');
            $(eltwo).addClass('corrent')
            this.childId = id
            console.log('this.childId', this.childId)
            this.showAddBtn = true;
            this.showDisAddBtn = false;
            this.showAddKeyBtn = false;
            this.getTagDetailContent();
        },
        alertTag(id, groupId, moduleId, sort, lName) {//关闭,打开添加/编辑标签弹窗
            this.changeTagId = id;
            this.groupId = groupId;
            this.moduleId = moduleId;
            this.addTagSort = sort;
            this.addTagNameValue = lName;
            this.changeTagName = '';
            console.log('this.changeTagId', this.changeTagId)
            console.log('this.groupId', this.groupId)
            console.log('this.moduleId', this.moduleId)
            if (this.changeTagId) {
                this.$http.get(api_prefix + '/label/get/' + this.changeTagId).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        this.addTagStyle = data;
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            } else {
                this.addTagStyle = {};
                this.addTagValue = '';
            }
            this.alertTagFlag = !this.alertTagFlag;
            if (this.alertTageFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertTag');
                });
            }
        },
        alertKeyWords(id, companyId) {//关闭,打开添加/编辑标签弹窗
            this.changeKetWordsId = id;
            this.companyId = companyId;
            console.log('this.changeKetWordsId', this.changeKetWordsId)
            this.$http.post(api_prefix + '/productKey/getKey',
                {
                    id: this.changeKetWordsId,
                    companyId: this.companyId
                }).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        this.addTagStyle = data;
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            this.alertTagFlag = !this.alertTagFlag;
            if (this.alertTageFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertTag');
                });
            }
        },
        alertChildList(id, companyId, moduleId, childName) {//关闭,打开添加/编辑标签弹窗
            this.addChildListData = {};
            this.companyId = companyId;
            this.groupId = id;
            this.childName = childName,
                this.moduleId = moduleId;
            console.log('this.companyId', this.companyId)
            console.log('this.groupId', this.groupId)
            console.log('this.moduleId', this.moduleId)
            console.log('this.childName', this.childName)
            this.alertChildListFlag = !this.alertChildListFlag;
            if (this.alertChildListFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertChildList');
                });
            }
        },
        getchildName(value) {//获取添加/编辑标签分组输入框的值
            this.childName = value;
            console.log(this.childName)
        },
        changeColor(val) {//点击样式标签并获取对应的val
            $('.alertTagMain a li').removeClass('current');
            $('.alertTagMain a li').eq(val).addClass('current');
            this.addTagValue = val;
            console.log(this.addTagValue)
            this.changeViewBtn();
        },
        changeViewBtn() {//预览标签样式
            switch (this.addTagValue) {
                case 0:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkone')
                    break;
                case 1:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bktwo')
                    break;
                case 2:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkthree')
                    break;
                case 3:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkfour')
                    break;
                case 4:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkfive')
                    break;
                case 5:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bksix')
                    break;
                case 6:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkseven')
                    break;
                case 7:
                    $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
                    $('.alertTagTop .jl-TagViewBtn').addClass('bkeight')
                    break;
            }
            this.tagViewBtnColor = $(".jl-TagViewBtn").css('color');
            console.log(this.tagViewBtnColor);
        },
        getTagName(value) {//获取名称输入框中的值
            this.addTagNameValue = value;
            this.changeTagName = this.addTagNameValue;
            console.log('this.addTagNameValue', this.addTagNameValue)
        },
        getSort(value) {//获取排序输入框中的值
            this.addTagSort = value;
            console.log('this.addTagSort', this.addTagSort)
        },
        saveAddTag(formName) {//点击保存标签样式
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.lColor, 'this.lColor')
                    if (this.addTagValue == '') {
                        this.$alert('必须选择一个样式！', '温馨提示', {//保存成功提示
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    } else {
                        if (this.changeTagId != null) {
                            this.$http.post(api_prefix + '/label/update', {
                                lColor: this.addTagValue,
                                lName: this.addTagNameValue,
                                lStatus: 0,
                                lSort: this.addTagSort,
                                lGroupId: this.groupId,
                                lModuleId: this.moduleId,
                                id: this.changeTagId,
                                companyId: 1
                            }).then(response => {
                                if (response.data.code == 0) {
                                    setTimeout(() => {
                                        this.alertTagFlag = false;
                                        this.getTagDetailContent();
                                        this.$message({
                                            showClose: true,
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                    }, 500)
                                } else {
                                    this.$alert(response.data.message, '温馨提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                                }
                            }, response => {
                                console.log('出错了');
                            });
                        } else {
                            this.$http.post(api_prefix + '/label/save', {
                                lColor: this.addTagValue,
                                lName: this.addTagNameValue,
                                lStatus: 0,
                                lSort: this.addTagSort,
                                lGroupId: this.groupId,
                                lModuleId: this.moduleId,
                                id: this.changeTagId,
                                companyId: 1
                            }).then(response => {
                                if (response.data.code == 0) {
                                    setTimeout(() => {
                                        this.alertTagFlag = false;
                                        this.getTagDetailContent();
                                        this.$message({
                                            showClose: true,
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                    }, 500)
                                } else {
                                    this.$alert(response.data.message, '温馨提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                                }
                            }, response => {
                                console.log('出错了');
                            });
                        }
                    }
                } else {
                    this.$message.error('提交失败了');
                }
            })
        },
        saveAddChildList(formName) {//点击保存标签分组
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.groupId != null) {
                        this.$http.post(api_prefix + '/label_group/update', {
                            lgName: this.childName,
                            lgPid: this.moduleId,
                            id: this.groupId,
                            companyId: this.companyId
                        }).then(response => {
                            if (response.data.code == 0) {
                                setTimeout(() => {
                                    this.alertChildListFlag = false;
                                    $('.alertbgg').remove();
                                    this.childId = this.groupId;
                                    this.firstId = this.moduleId;
                                    this.getTagDetailContent();
                                    this.getChildTagList();
                                    this.$message({
                                        showClose: true,
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                }, 500)
                            } else {
                                this.$alert(response.data.message, '温馨提示', {
                                    confirmButtonText: '确定',
                                    callback: action => { }
                                });
                            }
                        }, response => {
                            console.log('出错了');
                        });
                    } else {
                        this.$http.post(api_prefix + '/label_group/save', {
                            lgName: this.childName,
                            lgPid: this.moduleId,
                            id: this.groupId,
                            companyId: this.companyId
                        }).then(response => {
                            if (response.data.code == 0) {
                                this.alertChildListFlag = false;
                                $('.alertbgg').remove();
                                this.childId = this.groupId;
                                this.firstId = this.moduleId;
                                this.$nextTick(() => {
                                    this.fullscreenLoading = true;
                                    setTimeout(() => {
                                        this.fullscreenLoading = false;
                                        // this.clickFirstList();
                                        // this.getFirstTagList();
                                        // this.getChildTagList();
                                        // this.getTagDetailContent();
                                        this.$router.go(0)
                                        this.$message({
                                            showClose: true,
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                    }, 1000);
                                })
                            } else {
                                this.$alert(response.data.message, '温馨提示', {
                                    confirmButtonText: '确定',
                                    callback: action => { }
                                });
                            }
                        }, response => {
                            console.log('出错了');
                        });
                    }
                } else {
                    this.$message.error('提交失败了');
                }
            })
        },
        deleteInfor(id) {//删除标签
            this.tagId = id
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(api_prefix + '/label/delete/' + this.tagId).then(response => {
                    if (response.data.code == 0) {
                        this.fullscreenLoading = true;
                        this.getTagDetailContent();
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        }, 1000);
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
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
        deleteChildList(id, lgPid) {//删除标签分组
            this.tagGroupId = id
            console.log(this.tagGroupId, 'this.tagGroupId')
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                this.$http.get(api_prefix + '/label_group/delete/' + this.tagGroupId).then(response => {
                    if (response.data.code == 0) {
                        this.childId = this.groupId;
                        this.firstId = lgPid;
                        this.getTagDetailContent();
                        this.$nextTick(() => {
                            this.getChildTagList();
                        })
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
                this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                });
            }).catch(() => {

            });
        },
        deleteKeyWords(id, companyId) {
            this.changeKetWordsId = id;
            this.companyId = companyId;
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/productKey/deleteKey', {
                    id: this.changeKetWordsId,
                    companyId: this.companyId
                }).then(response => {
                    if (response.data.code == 0) {
                        this.fullscreenLoading = true;
                        this.getKeyWordsData();
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        }, 1000);
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
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
        getKeyWords(event) {
            console.log(event, 'event')
            let elthree = event.currentTarget;
            this.isKeyWords = true;
            $(".jl-firstList").removeClass('correntf')
            $(elthree).addClass('correntf')
            $(".jl-firstList").children('.jl-childList,.topIcon,.addChildList').siblings().addClass('hidden');
            $(".jl-firstList").children('.rightIcon').show();
            this.showTag = false;
            this.showKeyWords = true;
            this.showAddKeyBtn = true;
            this.showAddBtn = false;
            this.showDisAddBtn = false;
            this.getKeyWordsData()
        },
        getKeyWordsData() {
            this.$http.post(api_prefix + '/productKey/selectKeyListByCompanyId', {
                companyId: 0,
                currPage: this.currentPage,
                pageSize: 20,
                kName: this.searchValue
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.keyWordsData = data.resultList;
                    this.tableDataTotal = response.data.body.totalNum;
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
        saveAddKeyTag(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addTagValue == '') {
                        this.$alert('必须选择一个样式！', '温馨提示', {//保存成功提示
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    } else {
                        if (this.changeKetWordsId == null) {
                            this.$http.post(api_prefix + '/productKey/saveNewKey', {
                                lSort: this.addTagSort,
                                kColor: this.addTagValue,
                                kName: this.addTagNameValue,
                                id: this.changeKetWordsId,
                            }).then(response => {
                                if (response.data.code == 0) {
                                    setTimeout(() => {
                                        this.alertTagFlag = false;
                                        $('.alertbgg').remove();
                                        this.getKeyWordsData()
                                        this.$message({
                                            showClose: true,
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                    }, 500)
                                } else {
                                    this.$alert(response.data.message, '温馨提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                                }
                            }, response => {
                                console.log('出错了');
                            });
                        } else {
                            this.$http.post(api_prefix + '/productKey/updateKey', {
                                lSort: this.addTagSort,
                                kColor: this.addTagValue,
                                kName: this.addTagNameValue,
                                id: this.changeKetWordsId,
                                companyId: this.companyId
                            }).then(response => {
                                if (response.data.code == 0) {
                                    setTimeout(() => {
                                        this.alertTagFlag = false;
                                        $('.alertbgg').remove();
                                        this.getKeyWordsData()
                                        this.$message({
                                            showClose: true,
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                    }, 500)
                                } else {
                                    this.$alert(response.data.message, '温馨提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                                }
                            }, response => {
                                console.log('出错了');
                            });
                        }
                    }
                } else {
                    this.$message.error('提交失败了');
                }
            })
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
            if (this.isKeyWords == true) {
                this.module = 'ProductKey'
            } else {
                this.module = 'label'
            }
            if (!this.companyId) { this.companyId = row.companyId }
            this.getLogData(1)
        },
        //----------日志相关逻辑 end-----
    }
}
</script>

