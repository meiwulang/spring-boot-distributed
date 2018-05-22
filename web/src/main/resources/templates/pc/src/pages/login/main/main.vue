<template>
    <div>
        <div class="login-left fleft yjk-login">
            <div class="logosmall mt30 ml30"></div>
            <!--<img src="../../../assets/images/logosmall.png" alt="logo图" class="mt30 ml30">-->
        </div>
        <div class="login-right fleft clearfix">
            <div>
                <el-row :gutter="10">
                    <div id="title">欢迎登录  尚品旅游</div>
                    <div class="title-son">
                        <span>专注科技工具，助力传统旅游</span>
                        <!-- <el-button type="text" class="clearfix">手机短信登录</el-button> -->
                    </div>
                    <div>
                        <el-form :model="loginForm" ref="loginForm" class="" style="margin:0 auto">
                            <el-form-item label="" prop="name">
                                <!-- <el-col :xs="6" :sm="8" :md="8" :lg="10"> -->
                                    <el-input v-model="loginForm.uAccount" placeholder="请输入用户名" class="btn"></el-input>
                                <!-- </el-col> -->
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <!-- <el-col :xs="8" :sm="8" :md="8" :lg="8"> -->
                                    <el-input type="password" v-model="loginForm.uPassword" placeholder="请输入密码" class="btn" @keyup.enter.native="login"></el-input>
                                <!-- </el-col> -->
                            </el-form-item>
                        </el-form>   
                        <!-- <el-row :gutter="10">
                            <el-col :xs="8" :sm="6" :md="4" :lg="10"><div class="grid-content bg-purple"></div></el-col>
                            <el-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple-light"></div></el-col>
                            <el-col :xs="4" :sm="6" :md="8" :lg="9"><div class="grid-content bg-purple"></div></el-col>
                            <el-col :xs="8" :sm="6" :md="4" :lg="10"><div class="grid-content bg-purple-light"></div></el-col>
                        </el-row>                                         -->
                    </div>
                    <div class="btn-div">
                        <el-checkbox v-model="holdPW">记住密码</el-checkbox>
                        <!-- <div class="clearfix">
                            <el-button type="text">立即注册</el-button>
                            <el-button type="text">忘记密码</el-button>
                        </div> -->
                    </div>
                    <div class="submit">
                        <!-- <el-col :xs="8" :sm="8" :md="8" :lg="8"> -->
                            <el-button class="btn" type="primary" @click="login">登录</el-button>
                        <!-- </el-col> -->
                    </div>
                </el-row>  
            </div>
            <!-- 单独需要出来的footer -->
            <div class="footer">
                Copyright @ 2017jdytrip.cn ALL Rights Reserved.
            </div>
        </div>
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    name:"",
    data() {
        return {
            // 登录表单
            loginForm:{
                uAccount:"",
                uPassword:"",
            },
            holdPW:false,
            // 规则
            // rules:{
            //     name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            //     password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            // },
            // 存储登陆信息
            sessionObj:{}
        }
    },
    mounted(){

    },
    methods:{
        //登录
        login(){
            this.$refs["loginForm"].validate((valid) => {
            if(valid){
                let fare=this.loginForm;
                // 记住密码
                if(this.holdPW){
                    sessionStorage.userinfo=JSON.stringify(fare);
                }
                fare.rememberMe=true;
                this.$http.post(api_prefix + "user/login",fare).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.$alert("登录成功","温馨提示",{type: 'success'});
                    sessionStorage.loginData=JSON.stringify(data.body);
                    //后台token用于用户信息认证
                    sessionStorage.token=data.token;
                    location.href="/console.html#/"
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
                },response => {
                    this.$alert("登录失败","温馨提示",{type: 'error'});
                });
            }else{
                this.$message.error('登录失败了');
            }
            });
        },
        // 是否已登陆
        isLogin(){
            if(sessionStorage.loginData){
                // location.href="/transfer.html#/list";
            }
            if(sessionStorage.userinfo){
                this.holdPW=true;
                let sessobj=JSON.parse(sessionStorage.userinfo);
                this.loginForm.uAccount=sessobj.uAccount;
                this.loginForm.uPassword=sessobj.uPassword;
            }
            // 清除session和cookie
            sessionStorage.clear();
            delAllCookie();
            //删除cookie中所有定变量函数    
            function delAllCookie(){    
                var myDate=new Date();    
                myDate.setTime(-1000);//设置时间    
                var data=document.cookie;    
                var dataArray=data.split("; ");    
                for(var i=0;i<dataArray.length;i++){    
                    var varName=dataArray[i].split("=");    
                    document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
                }    
            }                       
        },
    },
    mounted(){
        this.isLogin();
    }
}
</script>

<style>

</style>
