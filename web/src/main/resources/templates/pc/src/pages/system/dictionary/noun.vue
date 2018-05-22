<template>
    <div class="jl-information jl-dictionary">
        <div class="jdy-content jdy-transfer fleft noborder">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15 mb15">
                    <el-row>
                        <el-button type="primary" class="btnbg fr addBtn" @click='alertNotice(null)'>添加</el-button>
                        <router-link :to="{ name: 'dictionary'}">
                            <el-button type="default" class="btnbg fr">
                                返回
                            </el-button>
                        </router-link>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all">
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column prop='dName' label="名词">
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click='alertNotice(scope.row.id)'>
                                编辑
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id)" v-loading.fullscreen.lock="fullscreenLoading">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->
        </div>
        <!--jdy-content end-->

        <!--编辑/添加名词 begin-->
        <jdy-alert title="编辑/添加名词" @closeAlert="alertNotice" v-if="alertNoticeFlag" class="alertNotice">
            <el-form :model="dictionaryForm" :inline="true" :rules="rules" ref="dictionaryForm" label-width="80px" class="mt15">
                <el-row>
                    <el-form-item label="名词" label-width="100px" prop='dName'>
                        <el-input v-model='dictionaryForm.dName' @change="dicGroupValue"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" label-width="100px" prop="dSort">
                        <el-input type="number" v-model.number='dictionaryForm.dSort' @change="dicGroupSort">
                        </el-input>
                    </el-form-item>
                </el-row>
                <el-button type="primary" class="btnbg fr addBtn" @click="saveAddDic('dictionaryForm')">
                    保存
                </el-button>
            </el-form>
        </jdy-alert>
        <!--编辑/添加名词 end-->
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    components: {
        jdyAlert
    },
    name: 'noun',
    data() {
        return {
            alertNoticeFlag: false,
            ruleForm: {},
            rules: {
                dName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                dSort: [
                    { required: true, message: '请输入排序' },
                    { type: 'number', message: '排序必须为数字值' }
                ]
            },
            tableData: [],
            dictionaryForm: {},
            fullscreenLoading: false,
            currentPage: 1,
            pageSizeAll: 20,
            tableDataTotal: 0
        }
    },
    mounted() {
        this.getDicList()
    },
    methods: {
        getDicList() {//更新table数据
            this.$http.post(api_prefix + '/Dictionaries/dictList', {
                dGroupId: this.$route.query.id,
                currPage: this.currentPage,
                pageSize: 20
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.tableData = data.list;
                    this.tableDataTotal = data.total
                }
            }, response => {
                console.log('出错了');
            });
        },
        alertNotice(id) {//关闭,打开编辑/添加名词弹窗
            console.log(id);
            this.groupId = id;
            this.dictionaryForm = {};
            if (this.groupId != null) {
                this.$http.get(api_prefix + '/Dictionaries/getDictById/' + this.groupId).then(response => {
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
                this.dictionaryForm = {};
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
                this.$http.post(api_prefix + '/Dictionaries/updateDict', {
                    id: this.groupId,
                    dStatus: 1,
                }).then(response => {
                    if (response.data.code == 0) {
                        this.fullscreenLoading = true;
                        this.getDicList();
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
        dicGroupValue(value) {//获取名词
            this.dName = value
            console.log(this.dName)
        },
        dicGroupSort(value) {//获取排序
            this.dSort = value
            console.log(this.dSort)
        },
        handleCurrentChange(val) {
            if (val) {
                this.currentPage = val;
                this.getDicList();
            }
        },
        saveAddDic(formName) {//点击保存
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.groupId != null) {
                        this.$http.post(api_prefix + '/Dictionaries/updateDict', {
                            id: this.groupId,
                            dName: this.dName,
                            dSort: this.dSort,
                            dStatus: 0
                        }).then(response => {
                            if (response.data.code == 0) {
                                setTimeout(() => {
                                    this.alertNoticeFlag = false;
                                    $('.alertbgg').remove();
                                    this.getDicList();
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
                        this.$http.post(api_prefix + '/Dictionaries/insertDict', {
                            dName: this.dName,
                            dSort: this.dSort,
                            dStatus: 0,
                            dGroupId: this.$route.query.id
                        }).then(response => {
                            if (response.data.code == 0) {
                                setTimeout(() => {
                                    this.alertNoticeFlag = false;
                                    $('.alertbgg').remove();
                                    this.getDicList();
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
                } else {
                    this.$message.error('提交失败了');
                }
            })
        }
    }
}
</script>

