<template>
    <div class="jl-information jl-dictionary">
        <div class="jdy-content jdy-transfer fleft noborder">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="分组名称：" prop="quickSearch" label-width="100px">
                            <el-input placeholder="标题或关键字等" @change="searchKeyWords" v-model="searchValue">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="handleIconClick" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="primary" class="btnbg fr addBtn" @click='alertNotice(null)'>添加</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all">
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="名称" width='130'>
                        <template scope="scope">
                            <span class="jl-noticeTitle">
                                <i class="icon-system" v-show="scope.row.dgLevel == 1"></i>
                                <i class="icon-person" v-show="scope.row.dgLevel == 0"></i>
                                {{scope.row.dgName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名词">
                        <template scope="scope">
                            <span class="jl-dicSubname">
                                {{scope.row.subName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click='alertNotice(scope.row.id)' v-if="scope.row.dgLevel == 1 && companyType == 2">
                                编辑
                            </el-button>
                            <el-button type="default" size="mini" @click='alertNotice(scope.row.id)' v-if="scope.row.dgLevel == 0">
                                编辑
                            </el-button>
                            <el-button type="default" size="mini" v-if="scope.row.dgLevel == 1 && companyType == 2">
                                <router-link :to="{ name: 'noun',query: {id: scope.row.id}}">名词管理</router-link>
                            </el-button>
                            <el-button type="default" size="mini" v-if="scope.row.dgLevel == 0">
                                <router-link :to="{ name: 'noun',query: {id: scope.row.id}}">名词管理</router-link>
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id)" v-if="scope.row.dgLevel == 1 && companyType == 2">
                                删除
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id)" v-if="scope.row.dgLevel == 0">
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

        <!--编辑/添加字典分组 begin-->
        <jdy-alert title="编辑/添加字典分组" @closeAlert="alertNotice" v-if="alertNoticeFlag" class="alertNotice">
            <el-form :model="dictionaryForm" :inline="true" :rules="rules" ref="dictionaryForm" label-width="80px" class="mt15">
                <el-row>
                    <el-form-item label="分组名称" label-width="100px" prop="dgName">
                        <el-input v-model='dictionaryForm.dgName' placeholder="分组名称" @change="dicGroupValue"></el-input>
                    </el-form-item>
                    <el-form-item label='级别' width='95'>
                        <el-radio-group v-model='dictionaryForm.dgLevel' @change='isLevel'>
                            <template scope="scope">
                                <el-radio :label="0">非系统级（允许用户自己管理）</el-radio>
                                <el-radio :label="1">系统级（仅限公司可管理）</el-radio>
                            </template>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="排序" label-width="100px" prop="dgSort">
                        <el-input type="number" v-model.number='dictionaryForm.dgSort' @change="dicGroupSort">
                        </el-input>
                    </el-form-item>
                </el-row>
                <el-button type="primary" class="btnbg fr addBtn" @click="saveAddDic('dictionaryForm')">
                    保存
                </el-button>
            </el-form>
        </jdy-alert>
        <!--编辑/添加字典分组 end-->
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    components: {
        jdyAlert
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
            rules: {
                dgName: [
                    { required: true, message: '请输入分组名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                dgSort: [
                    { required: true, message: '请输入排序' },
                    { type: 'number', message: '排序必须为数字值' }
                ],
            },
            tableData: [],
            tableDataTotal: 0,
            dictionaryForm: {
                dgLevel: 0
            },
            fullscreenLoading: false,
            companyType:''
        }
    },
    mounted() {
        this.getDicGroupList()
        let logindata = JSON.parse(sessionStorage.loginData)
        this.companyType = logindata.cType
    },
    methods: {
        
        getDicGroupList() {//更新table数据
            this.$http.post(api_prefix + '/Dictionaries/dictGroupList', {
                currPage: this.currentPage,
                dgName: this.searchValue,
                pageSize: 20
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = data.list;
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
            this.searchValue = '';
            this.getDicGroupList();
        },
        searchKeyWords(value) {//获取快速搜索的值
            console.log(value)
            this.searchValue = value;
        },
        handleIconClick(ev) {//快速搜索点击搜索后请求服务器
            this.getDicGroupList();
        },
        alertNotice(id) {//关闭,打开编辑/添加字典分组弹窗
            console.log(id);
            this.groupId = id;
            if (this.groupId != null) {
                this.$http.get(api_prefix + '/Dictionaries/getDictGroupById/' + this.groupId).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        this.dictionaryForm = data;
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
                this.dictionaryForm = { dgLevel: 0 };
            }
            this.alertNoticeFlag = !this.alertNoticeFlag;
            if (this.alertNoticeFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertNotice');
                });
            }
        },
        deleteInfor(id) {//点击删除
            this.groupId = id;
            console.log('当前ID', this.groupId)
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/Dictionaries/deleteDictGroup', {
                    id: this.groupId,
                    dgStatus: 1,
                }).then(response => {
                    if (response.data.code == 0) {
                        this.fullscreenLoading = true;
                        this.getDicGroupList();
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
        handleCurrentChange(val) {//获取当前页
            if (val) {
                var obj = { 'currentPage': val }
                this.getNewPage();
                this.currentPage = val;
            }
        },
        getNewPage() {//翻页请求
            this.getDicGroupList();
        },
        dicGroupValue(value) {//获取分组名称
            this.dgName = value
            console.log(this.dgName)
        },
        isLevel(value) {//获取级别
            this.dgLevelValue = value
            console.log(this.dgLevelValue)
        },
        dicGroupSort(value) {//获取排序
            this.dgSort = value
            console.log(this.dgSort)
        },
        saveAddDic(formName) {//点击保存
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.groupId != null) {
                        this.$http.post(api_prefix + '/Dictionaries/updateDictGroup', {
                            id: this.groupId,
                            dgLevel: this.dgLevelValue,
                            dgName: this.dgName,
                            dgSort: this.dgSort,
                            dgStatus: 0
                        }).then(response => {
                            if (response.data.code == 0) {
                                setTimeout(() => {
                                    this.alertNoticeFlag = false;
                                    $('.alertbgg').remove();
                                    this.getDicGroupList();
                                    this.$message({
                                        showClose: true,
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                }, 500)
                            } else {
                                this.$alert(response.data.message, '温馨提示', {//保存成功提示
                                    confirmButtonText: '确定',
                                    callback: action => { }
                                });
                            }
                        }, response => {
                            console.log('出错了');
                        });
                    } else {
                        if (!this.dgLevelValue) {
                            this.dgLevelValue = this.dictionaryForm.dgLevel
                        }
                        this.$http.post(api_prefix + '/Dictionaries/insertDictGroup', {
                            dgLevel: this.dgLevelValue,
                            dgName: this.dgName,
                            dgSort: this.dgSort,
                            dgStatus: 0
                        }).then(response => {
                            if (response.data.code == 0) {
                                setTimeout(() => {
                                    this.alertNoticeFlag = false;
                                    $('.alertbgg').remove();
                                    this.getDicGroupList();
                                    this.$message({
                                        showClose: true,
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                }, 500)
                            } else {
                                this.$alert(response.data.message, '温馨提示', {//保存成功提示
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
        }
    }
}
</script>

