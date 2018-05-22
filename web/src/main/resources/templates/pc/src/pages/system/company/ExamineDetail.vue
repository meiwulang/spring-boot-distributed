<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <el-form :model="eForm" :rules="rules" ref="eForm" class="demo-form-inline" label-width="150px">
                <div class="p38">
                    <div class="f16 mt22 c1f blod">单位信息</div>
                    <el-row class="mt20">
                        <el-form-item label="公司名称:" class="mt0">
                            测试-公司单位
                        </el-form-item>
                        <el-form-item label="上级单位:" class="mt0">
                            测试-公司单位
                        </el-form-item>
                        <el-form-item label="法人姓名:" class="mt0">
                            曾雨
                        </el-form-item>
                        <el-form-item label="手机号:" class="mt0">
                            13687379343
                        </el-form-item>
                        <el-form-item label="公司类型:" class="mt0">
                            公司类型
                        </el-form-item>
                        <el-form-item label="分销商:" class="mt0">
                            分销商
                        </el-form-item>
                        <el-form-item label="发布产品类型:" class="mt0">
                            没有类型
                        </el-form-item>
                    </el-row>
                    <div class="eline mt37"></div>
    
                    <div class="f16 mt22 c1f blod">法人身份证号码：330127199300000000</div>
                   
                    <div class="clearfix">
                        <div class="sfznn fleft mt30 mr20">
                             <div class="sfznn-content">
                                 <div class="sfznn-img">
                                     <img src="../../../assets/images/sfz.jpg" alt="">
                                 </div>
                             </div>
                             <div class="sfznn-bottom">正面</div>   
                        </div>
                        <div class="sfznn fleft mt30">
                             <div class="sfznn-content">
                                 <div class="sfznn-img">
                                     <img src="../../../assets/images/sfz.jpg" alt="">
                                 </div>
                             </div>
                             <div class="sfznn-bottom">反面</div>   
                        </div>
                    </div>
                    <div class="eline mt37"></div>


                    <div class="f16 mt22 c1f blod">营业执照号：430902199305208017</div>
                    <div class="sfznn  mt30 mr20 yyzz">
                            <div class="sfznn-content ">
                                <div class="sfznn-img">
                                    <img src="../../../assets/images/sfz.jpg" alt="">
                                </div>
                            </div>
                    </div>
                    <div class="eline mt37"></div>
                    <div class="mt30">
                        <el-radio-group v-model="eForm.radio" @change="adoptFn">
                            <el-radio class="radio" label="1">通过</el-radio>
                            <el-radio class="radio" label="2">不通过</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="w450 mt20" v-if="adopt">
                        <el-input type="textarea" v-model="eForm.textarea" placeholder="请输入不通过的原因"></el-input>
                    </div>
                    <div class="mt20">
                        <el-button class="" type="primary" @click="onSubmit">保存</el-button>
                        <el-button class="" type="default" @click="goback">返回</el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            eForm: {
                radio:"2",
                textarea:""
            },
            rules: {},
            adopt:true
            
        }
    },
    methods: {
        goback(){
            this.$confirm('数据未保存，是否返回？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 location.href="http://localhost:9090/system.html#/company";
            }).catch(() => {

            });
           
        },
        onSubmit(){
            alert('提交')
        },
        adoptFn(val){
            console.log(val)
            if(val==1){
                this.adopt = false;
            }else{
                this.adopt = true;
            }
        }

    }
}
</script>

<style>

</style>
