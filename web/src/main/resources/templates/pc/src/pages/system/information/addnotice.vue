<template>
    <div class="jl-addnotice">
        <div class="jdy-content jdy-transfer fleft noborder">
            <div class="jdy-content-inner-trip jl-addnoticeWrap">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="mt45">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="文章标题：" prop="nTitle">
                                <el-input v-model="ruleForm.nTitle" placeholder="请输入文章标题" @change="getTextTitle"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="发布：">
                                <el-radio-group v-model="ruleForm.nStatusB" @change='isStatus'>
                                    <template scope="scope">
                                        <el-radio :label="true">是</el-radio>
                                        <el-radio :label="false">否</el-radio>
                                    </template>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="推荐：" prop="nRecommend" style="margin-left:30px;">
                                <el-radio-group v-model="ruleForm.nRecommend" @change='isRecommend'>
                                    <template scope="scope">
                                        <el-radio :label="true">是</el-radio>
                                        <el-radio :label="false">否</el-radio>
                                    </template>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型：" prop="getType">
                                <el-select v-model="getType" placeholder="请选择" size='200' @change="changeType">
                                    <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序：" prop="nSort" style="margin-left:20px;">
                                <el-input type='number' v-model.number="ruleForm.nSort" placeholder="请输入数字" @change="getSort"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="关键词：" prop="nKeys">
                            <el-input v-model="ruleForm.nKeys" placeholder="后缀：攻略，游记，住宿，美食，购物，特产，交通，行程，景点等（多个使用“.”隔开）" @change="getKeyWords"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item prop="nContent">
                            <jdy-editor v-model="ruleForm.nContent" :content="ruleForm.nContent" attr="notice" @input="editorUpdate"></jdy-editor>
                        </el-form-item>
                    </el-row>
                    <el-button type="primary" class="fr ml20 mt20" @click="saveNotice('ruleForm')" style="margin-left: 10px;margin-bottom:100px;">保存</el-button>
                    <el-button class="fr mt20" @click="alertNotice">预览</el-button>
                    <el-button class="fr mt20">
                        <router-link :to="{ name: 'Information'}">
                            返回
                        </router-link>
                    </el-button>
                </el-form>
            </div>
        </div>
        <!--查看公告 弹窗 begin-->
        <jdy-alert title="查看公告" @closeAlert="alertNotice" v-if="alertNoticeFlag" class="alertNotice">
            <h1>{{alertTitle}}</h1>
            <p v-html="ruleForm.nContent"></p>
        </jdy-alert>
        <!--查看公告 弹窗 end-->
    </div>
</template>
<script>
import jdyAlert from '@/components/Alert';
import jdyEditor from '@/components/Quilleditor';

export default {
    name: 'addnotice',
    components: {
        jdyAlert,
        jdyEditor
    },
    data() {
        return {
            input: '',
            isNewNotice: this.$route.query.isNewNotice,//路由获取是否是新建的
            id: this.$route.query.id,//路由获取当前ID
            currentStatus: '',//当前选择后的状态
            changeTypeValue: '',//当前选择的类型
            getType: '资讯',//转化类型文字
            textTitle: '',//获取标题
            msg: 'pivilege',
            alertTitle: '',//预览公告标题
            alertNoticeFlag: false,
            alertJournalFlag: false,
            journalCurrentData: {}, //日志数据ww
            ruleForm: {
                nStatusB: true,
                nRecommend: true,
                nContent: '',
                nSort: ''
            },
            searchInput: '',
            rules: {
                nTitle: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                nSort: [
                    { required: true, message: '请输入排序' },
                    { type: 'number', message: '排序必须为数字值' }
                ],
                nKeys: [
                    { required: true, message: '请输入关键词', trigger: 'blur' }
                ],
                nContent: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ]
            },
            type: [{
                value: '1',
                label: '资讯'
            }, {
                value: '2',
                label: '公告'
            }],
            tableData: []
        }
    },
    mounted() {
        // this.editor = UE.getEditor('editor');
        if (!this.$route.query.isNewNotice) {
            this.$http.post(api_prefix + '/News/selectById', {
                id: this.$route.query.id
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.ruleForm = data;
                    this.getType = this.ruleForm.nType;
                    this.textTitle = this.ruleForm.nTitle;
                    console.log(this.ruleForm.nContent)
                    if (this.getType == '1') {
                        this.getType = '资讯'
                    } else {
                        this.getType = '公告'
                    }
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
    },
    methods: {
        // getUeditorContent: function () {//获取编辑器内容
        //     console.log(this.editor.getContent())
        // },
        alertNotice() {//关闭,打开查看公告弹窗
            this.getAlertTitle();
            this.alertNoticeFlag = !this.alertNoticeFlag;
            if (this.alertNoticeFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertNotice');
                });
            }
        },
        getTextTitle(value) {//获取文章标题输入框中的值
            this.textTitleValue = value;
            console.log('this.textTitleValue', this.textTitleValue)
        },
        isStatus(value) {//当点击状态开关后获取当前状态并执行更新
            console.log(value)
            if (value == true) {
                this.currentStatus = 0;
            } else {
                this.currentStatus = 1;
            }
            console.log('this.currentStatus', this.currentStatus)
        },
        isRecommend(value) {//当点击推荐开关后获取当前推荐并执行更新
            console.log(value)
            this.isRecommendValue = value;
            console.log('this.isRecommendValue', this.isRecommendValue)
        },
        changeType(value) {//获取选择类型的值
            console.log(value)
            this.changeTypeValue = value;
            console.log(this.changeTypeValue, 'this.changeTypeValue1')
        },
        getKeyWords(value) {//获取关键词的值
            console.log(value)
            this.keyWordsValue = value;
        },
        getSort(value) {
            console.log(value)
            this.sortValue = value;
        },
        getAlertTitle() {
            if (this.textTitleValue) {
                this.alertTitle = this.textTitleValue;
            } else {
                this.alertTitle = this.textTitle;
            }
        },
        editorUpdate(value, attr) {
            this.ruleForm[attr] = value;
        },
        saveNotice(formName) {//点击保存
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.$route.query.isNewNotice) {
                        if (this.currentStatus) {
                            this.currentStatus = this.currentStatus
                        } else {
                            this.currentStatus = 0
                        }
                        if (this.isRecommendValue == false) {
                            this.isRecommendValue = false
                        } else {
                            this.isRecommendValue = true
                        }
                        if(this.changeTypeValue == ''){
                            this.changeTypeValue = 1
                        }
                        this.$http.post(api_prefix + '/News/insertSelective', {
                            nContent: this.ruleForm.nContent,
                            nKeys: this.keyWordsValue,
                            nRecommend: this.isRecommendValue,
                            nStatus: this.currentStatus,
                            nTitle: this.textTitleValue,
                            nType: this.changeTypeValue,
                            nSort: this.sortValue
                        }).then(response => {
                            if (response.data.code == 0) {
                                this.$message({
                                    showClose: true,
                                    message: '保存成功',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    this.$router.push({ name: 'Information' })
                                }, 500)
                            } else {
                                this.$alert(response.data.message, '友情提示', {
                                    confirmButtonText: '确定',
                                    callback: action => { }
                                });
                            }
                        }, response => {
                            console.log('出错了');
                        });
                    } else {
                        console.log('修改', this.textTitleValue)
                        console.log('修改', this.keyWordsValue)
                        this.$http.post(api_prefix + '/News/updateSelective', {
                            id: this.$route.query.id,
                            nContent: this.ruleForm.nContent,
                            nKeys: this.keyWordsValue,
                            nRecommend: this.isRecommendValue,
                            nStatus: this.currentStatus,
                            nTitle: this.textTitleValue,
                            nType: this.changeTypeValue,
                            nSort: this.sortValue
                        }).then(response => {
                            if (response.data.code == 0) {
                                this.$message({
                                    showClose: true,
                                    message: '保存成功',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    this.$router.push({ name: 'Information' })
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
<style scoped>
.jdy-wrap .ql-container {
    min-height: 300px;
}

.ql-editor {
    min-height: 300px;
}
.el-form-item__label{
    text-align: left !important;
}
</style>

