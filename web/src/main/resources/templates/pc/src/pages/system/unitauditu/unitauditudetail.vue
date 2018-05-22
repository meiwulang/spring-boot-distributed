<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-button type="default" class="btnbg fr" style='margin-right: 10px'>
                            <router-link :to="{ name: 'unitauditu'}">返回</router-link>
                        </el-button>
                    </el-row>
                </el-form>
            </div>
            <el-form :model="tableData" :rules="rules" ref="tableData" class="demo-form-inline" label-width="150px">
                <div class="p38">
                    <div class="f16 mt22 c1f blod">单位信息</div>
                    <div class="mt15"></div>
                    <el-form-item label="公司名称：" label-width="120px" style="margin-bottom: 0">
                        <span>{{tableData.cName}}</span>
                    </el-form-item>
                    <el-form-item label="上级单位：" label-width="120px" style="margin-bottom: 0">
                        <span>{{tableData.cName}}</span>
                    </el-form-item>
                    <el-form-item label="法人姓名：" label-width="120px" style="margin-bottom: 0">
                        <span>{{tableData.cChargeName}}</span>
                    </el-form-item>
                    <el-form-item label="手机号：" label-width="120px" style="margin-bottom: 0">
                        <span>{{tableData.cTel}}</span>
                    </el-form-item>
                    <el-form-item label="公司类型：" label-width="120px" style="margin-bottom: 0">
                        <span>{{tableData.cType}}</span>
                    </el-form-item>
                    <el-form-item label="发布产品类型：" label-width="120px" style="margin-bottom: 0">
                        <span>没有类型</span>
                    </el-form-item>
                    <div class="eline mt37"></div>

                    <div class="f16 mt22 c1f blod">法人身份证号码：{{tableData.cIdcard}}</div>
                    <div class="clearfix">
                        <div class="mt20"></div>
                        <ul>
                            <li class="jl-unitImg">
                                <div>
                                    <img :src="tableData.cIdcardFront">
                                </div>
                                <p>正面</p>
                            </li>
                            <li class="jl-unitImg">
                                <div>
                                    <img :src="tableData.cIdcardBack">
                                </div>
                                <p>背面</p>
                            </li>
                        </ul>
                    </div>
                    <div class="eline mt37"></div>

                    <div class="f16 mt22 c1f blod">营业执照编号：{{tableData.cLicenseCode}}</div>
                    <div class="clearfix">
                        <div class="mt20"></div>
                        <div class="jl-unitImg">
                            <div>
                                <img :src="tableData.cLicense">
                            </div>
                        </div>
                    </div>
                    <div class="eline mt37"></div>

                    <div class="jl-unitAgreeBtn">
                        <el-form-item prop="ispass">
                            <el-radio-group @change='isPass' v-model='ispass'>
                                <template scope="scope">
                                    <el-radio :label="1">通过</el-radio>
                                    <el-radio :label="2">不通过</el-radio>
                                </template>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="reason" v-if='ispass == 2'>
                            <el-input type="textarea" v-model="reason" :maxlength='200' :rows="5"></el-input>
                        </el-form-item>
                        <el-button type="primary" class="btnbg addBtn jl-unitPassBtn" @click="saveUnit('tableData')">
                            确定
                        </el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'unitauditudetail',
    data() {
        return {
            searchValue: '',//搜索框的值
            currentPage: 1, //列表当前所在页,
            ruleForm: {},
            rules: {},
            tableData: {},
            dictionaryForm: {},
            fullscreenLoading: false,
            ispass: '',
            reason:null
        }
    },
    mounted() {
        this.$http.post(api_prefix + '/Company/selectCompany', {
            companyId: this.$route.query.id
        }, { emulateJSON: true }).then(response => {
            if (response.data.code == 0) {
                let data = response.data.body;
                this.tableData = data;
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
        isPass(value) {//是否通过
            this.ispass = value
            this.status = this.ispass;
            console.log(this.status)
        },
        saveUnit(formName) {//保存审核结果
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.status == 1) {
                        this.$http.post(api_prefix + '/Company/audit', {
                            id: this.$route.query.id,
                            status: this.status
                        }, { emulateJSON: true }).then(response => {
                            if (response.data.code == 0) {
                                this.$alert('审核通过成功！', '温馨提示', {//保存成功提示
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        setTimeout(() => {
                                            this.$router.push({ path: '/unitauditu' })
                                        }, 500)
                                    }
                                });
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
                      if (this.reason && $.trim(this.reason) != '') {
                          if($.trim(this.reason).length>500){
                            this.$alert("原因最多500个字", "温馨提示", {type: "warning"});
                            return;
                          }
                        this.$http.post(api_prefix + '/Company/audit', {
                          id: this.$route.query.id,
                          status: this.status,
                          reason: $.trim(this.reason)
                        }, {emulateJSON: true}).then(response => {
                          if (response.data.code == 0) {
                            this.$alert('单位退回成功！', '温馨提示', {//保存成功提示
                              confirmButtonText: '确定',
                              callback: action => {
                                setTimeout(() => {
                                  this.$router.push({path: '/unitauditu'})
                                }, 500)
                              }
                            });
                          } else {
                            this.$alert(response.data.message, '温馨提示', {//保存成功提示
                              confirmButtonText: '确定',
                              callback: action => {
                              }
                            });
                          }
                        }, response => {
                          console.log('出错了');
                        });

                      } else {
                        this.$alert("请输入退回原因", "温馨提示", {type: "warning"});
                      }
                    }
                } else {
                    this.$message.error('提交失败了');
                }
            })
        }
    }
}
</script>
