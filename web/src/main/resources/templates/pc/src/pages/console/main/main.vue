<template>
    <div class="yjk-all">
        <div class="title">
            <div class="avatar fleft">
                <img :src="loginData.uPic">
            </div>
            <div class="info fleft clearfix">
                <div class="title_hello">你好！{{loginData.uRealName}}
                    <div class="hideInfo clearfix" v-show="hideInfoFlag">
                        <div class="fleft">!</div>
                        <div class="fleft clearfix">账户：{{loginData.uAccount}}&nbsp;&nbsp;&nbsp;&nbsp; 权限：{{loginData.urRoleName}}&nbsp;&nbsp;&nbsp;&nbsp; 绑定手机号：{{loginData.uTel}}</div>
                    </div>
                </div>
                <div class="title_time">尚品在线旅游&nbsp;&nbsp;&nbsp;&nbsp;上次登录时间{{loginData.uLastLogin|dateFormat('time')}}</div>
            </div>
        </div>
        <div class="body">
            <div class="body_1">
                <div class="fleft">
                    <!-- <div class="body_tag">
                        <div class="taglist console_tagblue">
                            <div class="taglist_mark fleft"></div>
                            <div class="fleft clearfix pl10 w150 textCenter">
                                <div>近30天订单数/金额</div>
                                <div class="mt20">
                                    <span class="tag_fontbig">{{tagData.recentNum}}/{{tagData.recentAmount|moneyTwoPoints}}</span>
                                </div>
                            </div>
                        </div> 
                        <div class="taglist console_tagorange clearfix">
                            <div class="taglist_mark fleft pl10"></div>
                            <div class="fleft w150 clearfix textCenter">
                                <div>账户余额</div>
                                <div class="mt20">
                                    <span class="tag_fontbig">￥{{tagData.surplusMoney}}</span>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="body_function">
                        <div>常用功能</div>
                        <div>
                            <div class="functionlist  ">
                                <div class="ficon line fleft"></div>
                                <div class="fhref fleft clearfix">
                                    线路管理
                                </div>
                            </div>
                            <div class="functionlist  ">
                                <div class="ficon order fleft"></div>
                                <div class="fhref fleft clearfix">
                                    应收信用账单
                                </div>
                            </div>
                            <div class="functionlist  ">
                                <div class="ficon report fleft"></div>
                                <div class="fhref fleft clearfix">
                                    班期销售报表
                                </div>
                            </div>
                            <div class="functionlist  ">
                                <div class="ficon bill fleft"></div>
                                <div class="fhref fleft clearfix">
                                    生成信用账单
                                </div>
                            </div>
                            <div class="functionlist  ">
                                <div class="ficon bill fleft"></div>
                                <div class="fhref fleft clearfix">
                                    生成信用账单
                                </div>
                            </div>
                            <div class="functionlist   clearfix">
                                <div class="ficon add fleft"></div>
                                <div class="fhref fleft clearfix" id="addFunc">
                                    添加常用功能
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <!-- <div class="todopart fleft clearfix">
                    <div class="todotitle noborder">待办事项</div>
                    <div class="cell">
                        <div class="celltitle">待付款订单</div>
                        <div class="content">123</div>
                    </div>
                    <div class="cell">
                        <div class="celltitle">待确认订单</div>
                        <div class="content">123</div>
                    </div>
                    <div class="cell">
                        <div class="celltitle">待处理账单</div>
                        <div class="content">123</div>
                    </div>
                    <div class="cell">
                        <div class="celltitle">买家咨询</div>
                        <div class="content">123</div>
                    </div>
                </div> -->
            </div>
            <!-- <div class="pie">
                <div class="pietitle">数据统计</div>
                <div class="piecontent"></div>
            </div> -->
        </div>
    </div>
</template>

<script>
import API from '@/pages/console/api/index';
export default {
    name:"",
    data() {
        return {
            //用于四个标签的数据
            tagData:{
                recentAmount:null,
                recentNum:null,
                surplusMoney:null
            },
            publicId:'',
            loginData:{},
            hideInfoFlag:false
        }
    },
    methods:{
        //账户余额（长沙接口）
        getAccountRemain(){
            let param={
                publicId:this.publicId,
                // publicId:'gh_155170e9f6b2',   //测试数据
                curPage:1,
                pageSize:20,
                url:'/zjqd-web/channels/sp/rebate/queryPublicAccountRemain.do'
            }
            API.getEncodingParam(param).then(response=>{
                if (response.body.code == 0) {
                    this.tagData.surplusMoney=response.body.body.remain
                } else {

                }
            })
        },
        //近期订单信息
        getRecentOrderInfo(){
            let param={
                "currPage": 1,
                "dateEnd": this.dateChange(0),
                "dateStart": this.dateChange(-30),
                "pageSize": 10
            };
            API.recentOrderInfo(param).then(response => {
                if (response.body.code == 0) {
                    this.tagData.recentAmount=response.body.body.amount;
                    this.tagData.recentNum=response.body.body.num;
                } else {
                  this.$alert(response.body.message);
                }
            })
        },
        //账户余额
        getSurplusMoney(){
            this.$http.post(api_prefix + '/Company/index?pageIndex=1', {}).then(response => {

            }, response => {
                console.log('出错了');
            });
        },
        //日期转换
        dateChange(value){
            let dd = new Date();
            dd.setDate(dd.getDate()+value);
            let y = dd.getFullYear();
            let m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
            let d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
            return y+"-"+m+"-"+d;
        }
    },
    mounted(){
        this.loginData=JSON.parse(sessionStorage.loginData);
        this.publicId = this.loginData.appId;
        this.loginData.uTel=this.loginData.uTel.substr(0, 3) + '****' + this.loginData.uTel.substr(7);
        let nameLength=this.loginData.uAccount.length;
        this.loginData.uAccount=this.loginData.uAccount.substr(0, nameLength-1)+"*"
        $(".title_hello").hover(()=>{
            this.hideInfoFlag=true;
        },()=>{
            this.hideInfoFlag=false;
        });
        // this.getRecentOrderInfo();
        // this.getAccountRemain();
    },

}
</script>

<style lang="less">
.yjk-all{
    .title{
        margin: 0 35px;
        padding: 20px 0;
        border-bottom: 1px solid #d7dfe3;
        height: 75px;
        .title_time{
            color:#99a9bf;
            font-size: 16px;
            margin-top: 14px;
        }
        .avatar{
            width: 75px;
            height: 75px;
            >img{
                width: 75px;
                height: 75px;
                border: 1px solid #ddd;
                border-radius: 50px;
            }
        }
        .info{
            .title_hello{
                font-size:28px;
                margin-top: 8px;
                .hideInfo{
                    float: right;
                    font-size: 16px;
                    background: #fff;
                    margin-left: 10px;
                    border:1px solid #d7dfe3;
                    box-shadow:3px 3px 5px #888888;
                    z-index: 99;
                    >div:nth-child(1){
                        height: 36px;
                        line-height: 36px;
                        width: 30px;
                        background: #20a0ff;
                        color: #fff;
                        text-align: center;
                    }
                    >div:nth-child(2){
                        padding: 10px 5px;
                    }
                }
            }
            margin-left: 20px;
        }
    }
    .body{
        padding: 20px 35px;
        width: 100%;
        .body_1{
            min-height:330px;
            .body_tag{
                height: 160px;
                width: 1290px;
                *{
                    color:#fff;
                }
                .taglist{
                    width: 250px;
                    height: 60px;
                    padding: 50px 25px;
                    float: left;
                    .taglist_mark{
                        width: 75px;
                        height:75px;
                    }
                    .tag_fontbig{
                        text-align: center;
                        font-size: 18px;
                        display: block;
                    }
                }
                .taglist:nth-child(1),.taglist:nth-child(2),.taglist:nth-child(3){
                    margin-right: 30px;
                }
            }
            .body_function{
                padding: 15px 15px 25px 15px;
                background: #fff;
                margin-top: 30px;
                min-height: 85px;
                width: 1263px;
                >div:first-child{
                    margin-bottom: 20px;
                }
                .functionlist{
                    margin:0 10px 15px 10px;
                    width: 185px;
                    height: 50px;
                    border: 1px solid #d9e1e4;
                    border-radius: 4px;
                    display: inline-block;
                    .ficon{
                        height: inherit;
                        width: 50px;
                    }
                    .fhref{
                        width: 130px;
                        text-align: center;
                        margin: 5px auto;
                        height: 40px;
                        line-height: 40px;
                        color: #99a9bf;
                        border-left: 1px solid #d9e1e4;
                    }
                    #addFunc{
                        color:#3f96f7;
                    }
                }

            }
            .todopart{
                width: 440px;
                height:330px;
                background: #fff;
                margin-left: 30px;
                *{
                    width: inherit;
                    text-align: center;
                }
                .todotitle{
                    height: 60px;
                    line-height: 60px;
                    padding-left: 20px;
                    text-align: left;
                }
                .cell{
                    padding: 10px 0;
                    .celltitle{
                        color:#99a9bf;
                    }
                    .content{
                        color: #f98b70;
                        font-size: 26px;
                    }
                }
            }
        }
        .pie{
            width: 95%;
            padding: 20px;
            height: 470px;
            margin-top: 25px;
            background: #fff;
        }

    }


}
</style>
