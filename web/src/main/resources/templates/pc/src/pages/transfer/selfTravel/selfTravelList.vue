<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft">
        <div class="jdy-tab" style="margin:0">
            <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">待受理
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">定制中
                <span></span>
            </a>            
            <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">已反馈
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">已确认
                <span></span>
            </a>
            <el-button @click="refresh" class="btnInTab fright mr10 mt10" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            <el-button @click="alertJournal" class="btnInTab fright mr10 mt10">日志</el-button>
        </div>
        <div class="jdy-searchPart">
            <el-form :model="ruleform" :inline="true" ref="ruleform" class="demo-form">
                <el-row>
                    <el-form-item class=" yjk-ml100 mr10" v-show="logindata.uDataLimit==3">
                        <el-select v-model="ruleform.companyId" placeholder="请选择分公司" clearable @change="getTableData">
                            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
                        </el-select>                     
                    </el-form-item>                     
                    <el-form-item class=" yjk-ml100">
                        <el-select v-model="ruleform.type" @change="getTableData">
                            <el-option :key="9" label="全部" :value="9">
                            </el-option>                            
                            <el-option :key="0" label="个人定制" :value="0">
                            </el-option>
                            <el-option :key="1" label="企业定制" :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class=" yjk-search">
                        <el-input v-model.trim="ruleform.searchKey" placeholder="请输入客户姓名或联系电话查询"></el-input>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 " v-show="!searchType">
                        <el-button type="primary" @click="getTableData" class="btnInTab">搜索</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <!--jdy-table begin-->
        <div class="jdy-table p10">
            <el-table :data="tableData" border class="all" @current-change="handleRowChange">
                <el-table-column label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column label="需求单" min-width="180">
                    <template scope="scope">
                        <router-link class="link" :to="{ path: '/selfTravelList/selfHistory', query: {id:scope.row.dId,name:scope.row.title}}">【{{ scope.row.rType?"企业":"个人" }}】{{ scope.row.rStartCity }}--{{ scope.row.rDestinationCitys }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column label="游玩人数">
                    <template scope="scope">
                        {{ scope.row.totalPeople  }}
                    </template>
                </el-table-column>
                <el-table-column label="游玩天数">
                    <template scope="scope">
                        {{ scope.row.rPlayDaysMin }}-{{ scope.row.rPlayDaysMax }}
                    </template>
                </el-table-column>
                <el-table-column label="人均预算" min-width="110">
                    <template scope="scope">
                        {{ scope.row.rPerBudget|moneyTwoPoints }}
                    </template>
                </el-table-column>
                <el-table-column label="出发日期" min-width="180">
                    <template scope="scope">
                        {{ scope.row.rStartDateHead }}--{{ scope.row.rStartDateTail }}
                    </template>
                </el-table-column>
                <el-table-column label="销售经理">
                    <template scope="scope">
                        <span class="salemanage" @click="getSaleManage(scope.row.saleId)">{{ scope.row.saleName }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="提交时间" min-width="180">
                    <template scope="scope">
                        {{ scope.row.submitTime  }}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        {{ scope.row.dStatus|filterStatus  }}
                    </template>
                </el-table-column>                
                <el-table-column label="产品经理">
                    <template scope="scope">
                        {{ scope.row.manageName  }}
                    </template>
                </el-table-column>
                <el-table-column label="接单时间" min-width="180">
                    <template scope="scope">
                        {{ scope.row.takingTime }}
                    </template>
                </el-table-column> 
                <el-table-column label="绑定产品" min-width="180">
                    <template scope="scope">
                        <a :href="h5Url" target="_blank" class="link">
                            <span @click="gotoH5(scope.row.productId)">
                                {{ scope.row.productName }}
                            </span>
                        </a>
                    </template>
                </el-table-column>                                              
                <el-table-column label="操作" min-width="200">
                    <template scope="scope">
                        <el-button type="default"  size="mini" @click="updateStatus(scope.row.dId)" v-if="scope.row.dStatus==1">
                            应单
                        </el-button>
                        <el-button type="default"  size="mini" @click="goDetail(scope.row)" v-if="scope.row.dStatus==2 ||scope.row.dStatus==3" :disabled="logindata.userId!=scope.row.manageId">
                            编辑方案
                        </el-button>
                        <el-button type="default"  size="mini" @click="goH5(scope.row)" v-if="scope.row.dStatus==3||scope.row.dStatus==4||(scope.row.dStatus==2&&scope.row.projectId!=null)">
                            查看方案
                        </el-button> 
                        <el-button type="default"  size="mini" @click="goPro(scope.row.dId)" v-if="scope.row.dStatus == 4" :disabled="logindata.userId!=scope.row.manageId">
                            绑定产品
                        </el-button>                                               
                    </template>
                </el-table-column>
            </el-table>            
            <div class="clearfix">
                <el-pagination class="fright pageMargin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->
            
            <!--系统日志查看 弹窗  begin-->
            <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
                <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="logId" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
            </jdy-alert>      

        </div>
    </div>
        <jdy-alert title="销售经理基本信息" @closeAlert="closeAlert" v-if="alertFlag" class="alertCityList showtfcity">
            <div class="yjk-alertInner">
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">用户账号：</span>
                        <span>{{userInfo.uAccount}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">真实姓名：</span>
                        <span>{{userInfo.uRealName}}</span>
                    </span>                   
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">员工编号：</span>
                        <span>{{userInfo.uNo}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">职务：</span>
                        <span>{{userInfo.uPost}}</span>
                    </span>                   
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">单位名称：</span>
                        <span>{{userInfo.cName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">部门名称：</span>
                        <span>{{userInfo.dName}}</span>
                    </span>                   
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">负责人：</span>
                        <span>{{userInfo.uDtype |chargePersonType}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">身份证：</span>
                        <span>{{userInfo.uIdcard}}</span>
                    </span>                   
                </div>  
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">手机号：</span>
                        <span>{{userInfo.uTel}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">出生年月：</span>
                        <span>{{userInfo.uBirthday| dateFormat}}</span>
                    </span>                   
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">性别：</span>
                        <span>{{userInfo.uSex | sexName}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">文化程度：</span>
                        <span>{{userInfo.degreeName}}</span>
                    </span>                   
                </div>  
                <div>
                    <!-- <span class="infoLine">
                        <span class="infoTitle">政治面貌：</span>
                        <span>{{userInfo.uAccount}}</span>
                    </span> -->
                    <span class="infoLine">
                        <span class="infoTitle">紧急联系人：</span>
                        <span>{{userInfo.uContacts}}</span>
                    </span>   
                    <span class="infoLine">
                        <span class="infoTitle">地址：</span>
                        <span>{{userInfo.uAddress}}</span>
                    </span>                                     
                </div>
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">电话：</span>
                        <span>{{userInfo.uPhone}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">微信号：</span>
                        <span>{{userInfo.uWxname}}</span>
                    </span>                   
                </div>  
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">QQ：</span>
                        <span>{{userInfo.uQq}}</span>
                    </span>
                    <span class="infoLine">
                        <span class="infoTitle">邮箱：</span>
                        <span>{{userInfo.uEmail}}</span>
                    </span>                   
                </div>   
                <div>
                    <span class="infoLine">
                        <span class="infoTitle">备注：</span>
                        <span>{{userInfo.uRemark}}</span>
                    </span>                 
                </div>  
            </div>
        </jdy-alert> 

        <jdy-alert title="绑定产品" @closeAlert="goPro" v-if="alertproFlag" class="alertCityList showtfcity">
            <div class="yjk-alertInner">
                <el-select v-model="productId" :filterable="true" :remote-method="searchProduct" clearable remote placeholder="请输入产品编号、产品名称搜索" style="width: 100%;height:300px">
                    <el-option :key="value.id" v-for="value in selectList" :label="value.pName" :value="value.id">
                    </el-option>
                </el-select>
                <div style="margin-bottom:10px;text-align: right;">
                    <el-button type="default" @click="savePro" class="mt10 btnInTab" :disabled="btnFlag" >保存</el-button>
                    <el-button type="default" class="mt10 mr10 btnInTab" @click="goPro" style="">取消</el-button>
                </div>
            </div>
        </jdy-alert>   

</div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';

export default {
    name: 'orderbuyer',
    data() {
        return {
            btnFlag:false,
            searchType: 0,//搜索方式
            // 用于搜索条件筛选
            ruleform: {
                clientType : 1,
                status : null,
                currPage : 1,
                pageSize : 15,
                type:9,
                searchKey:"",
                companyId:null,
            },
            datePicker:[new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],//查询日期
            // 产品类型基础
            tableData:[],//表格
            jdytabActive: null,  //是否被选中
            isReturn: false,   //是否退票
            orderChangeType:[],//订单修改按钮
            orderTotal:{
                statuses_0:0,
                statuses_1:0,
                statuses_2:0,
                statuses_3:0,
                statuses_4:0,
            },
            // 分页
            currentPage: 1, //列表当前所在页,
            pageSize: 15,
            tableDataTotal: 0,
            fullscreenLoading:false, //加载
            loading: false,   //select远程查询加载
            logindata:{},//登陆数据
            rowData:null,//被选中数据
            // 调整金额弹窗
            priceChangeObj:{
                flag:false,
                radio:null,
                money:null,
                promotion:null,
                remark:""
            },
            // 线下支付弹窗
            offlinePayObj:{
                flag:false,
                opPayTime:null,
                opComments:""
            },
            // 取消订单
            cancelOrderObj:{
                flag:false,
                money:null,
                reason:null
            },
            downloadUrl:'',
            /*日志相关*/
            module: "Require",
            journalTotal: 0,
            journalCurrentData: [], //日志数据
            logId:'',
            focusPriceId:'',
            alertJournalFlag: false, //系统日志查看 弹窗值
            // 销售经理详细
            alertFlag:false,
            userInfo:null,
            //系统级需要有查询公司功能
            BuyerCompanyIdArr:[], 
            //绑定产品
            alertproFlag:false,
            proId:'',
            productId:'',
            selectList:[],
            h5Url:''                   
        }
    },
    mounted() {
        this.logindata = JSON.parse(sessionStorage.loginData);
        this.ruleform.companyId=this.logindata.uCompanyId;
        this.logindata.uDataLimit == 3 && this.getBuyerCompanyId();
        this.getTableData();
    },
    methods: {
        //产品预览
        gotoH5(id){
        var urlHead = '';
        if(location.host == 'b2b.fingercrm.cn'){
            urlHead = 'http://b2b.fingercrm.cn'
        }else{
            urlHead = 'http://b2b.test.fingercrm.cn'
        }
        this.h5Url = urlHead + '/wap/m/detail.html?' + 'p_id=' + id +'&from=preview'
        console.log(this.h5Url,'this.h5Url')
        // window.location.href = this.h5Url;
        },
        // 获取表格
        getTableData() {
            let param=JSON.parse(JSON.stringify(this.ruleform));
            param.type=param.type==9?"":param.type
            this.$http.post(api_prefix + "require/queryRequireList",param).then(response => {
                if (response.body.code == 200) {
                    let data=response.body.data;
                    this.tableData=data.list;
                    this.tableDataTotal = data.total;
                } else {

                }
            })
        },
        // 页头切换
        jdytab(index) {
            this.ruleform.status=index==null?"":index
            this.jdytabActive = index;
            this.getTableData();
        },
        // 应单接口，改变
        updateStatus(_id){
            let param={
                currPage: 1,
                dStatus: 2,
                id: _id,
                pageSize: 20                
            }
            this.$http.post(api_prefix + "require/status/update",param).then(response => {
                if (response.body.code == 0) {
                    this.$message.info("应单成功！")
                } else {
                    this.$message.error("应单失败！")
                }
                this.getTableData();
            })
        },
        goDetail(param){
            this.$router.push({name:"selfline",query:{designId:param.dId,rId:param.id,id:param.projectId,status:param.dStatus}});
        },
        goH5(param){
            // location.href=location.host+"/wap/m/made_plan.html?edit=0&requireId="+param.id;
            var urlHead = '';
            if(location.host == 'b2b.fingercrm.cn'){
                urlHead = 'http://b2b.fingercrm.cn'
            }else{
                urlHead = 'http://b2b.test.fingercrm.cn'
            }          
            window.open(urlHead+"/wap/m/made_plan.html?id="+param.projectId)
        },
        // 刷新按钮
        refresh() {
            this.ruleform= {
                clientType : 1,
                status : null,
                currPage : 1,
                pageSize : 15,
                type:9,
                searchKey:""
            },
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    showClose: true,
                    message: '刷新成功',
                    type: 'success'
                });
                this.currentPage=1
                this.getTableData();
            }, 1000);
        },
        handleCurrentChange(val){
            if (val) {
                this.ruleform.currPage = val;
                this.getTableData();
            }
        },        
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        // 行点击事件
        handleRowChange(row){
            console.log("行点击事件",row)
            this.logId = row.id;
            this.getLogData(1);            
        },
        getSaleManage(userid){
            this.$http.get(api_prefix + 'user/get/' + userid, ).then(response => {
                if (response.data.code == 0) {
                    this.userInfo=response.data.body;
                    this.alertFlag=true;
                    this.$nextTick(function(){
                        jdyFn.setAlertStyle('showtfcity');
                    });                 
                }
            }, response => {
                console.log('出错了');
            });   
        },
        goPro(id){
            this.proId = id;
            this.alertproFlag = !this.alertproFlag;
            if (this.alertproFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('showtfcity');
                });
            }else{
                $(".alertbgg").hide();
            }
        },
        searchProduct(value){
            this.$http.post(api_prefix + 'require/searchProduct',{
                searchParam : value
            } ).then(response => {
                if (response.data.code == 0) {
                    this.selectList=response.data.body;            
                }
            }, response => {
                console.log('出错了');
            }); 
        },
        savePro(){
            this.btnFlag = true;
            this.$http.post(api_prefix + 'require/saveDesignProduct',{
                designId: this.proId,
                productId: this.productId
            } ).then(response => {
                if (response.data.code == 0) {  
                    this.btnFlag = false;
                    this.$message.success("保存成功！");  
                    setTimeout(() => {
                        this.alertproFlag = false;
                        $(".alertbgg").hide(); 
                        this.getTableData();
                    }, 500);
                }
            }, response => {
                this.btnFlag = false;  
                console.log('出错了');
            });
        },
        closeAlert(){
            this.alertFlag = false;
        },   
        //系统级查询公司
        getBuyerCompanyId(key){
            this.$http.post(api_prefix + 'Company/index', { pid:343 ,searchType:1, pageIndex: 1, fastSearchStr: $.trim(key)}, { emulateJSON: true }).then(response => {
                if(response.body.code==0){
                    this.BuyerCompanyIdArr=response.body.body.list
                }else{

                };
            });
        },                      
        //----------日志相关逻辑 start-----
        //关闭,打开日志弹窗
        alertJournal(alertJournalFlag) {
            if (!this.logId) { this.$alert("请选择一个需求单"); return }
            this.alertJournalFlag = !this.alertJournalFlag
            if (this.alertJournalFlag) {
                this.$nextTick(function () {
                jdyFn.setAlertStyle('alertJournal');
                });
            }
        },
        //获取日志数据
        getLogData(index) {
            this.$http.post(api_prefix + 'logs/selectLogs?pageIndex=' + index + '&module=' + this.module + '&pid=' + this.logId
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
    },
    filters:{
        filterStatus(val){
            switch(val){
                case 1:
                return "待受理";
                case 2:
                return "定制中";
                case 3:
                return "已反馈";
                case 4:
                return "已确认"                                                
            }
        }, 
        degreeFormat:function(value){
        // return value.substring(0,7);
            return value
        },
        sexName: function (value) {
            return value ? '女':'男'
        },
        chargePersonType:function(value){
            const val= Number(value);
            let returnVal = '';
            if(value === 0){
            // returnVal='普通代理人'
            returnVal='';
            }
            else if(value === 1){
            returnVal='负责人+部门领导'
            }
            else if(value === 2){
            returnVal='法人'
            }
            else if(value === 3){
            returnVal='法人+部门领导'
            }
            else if(value === 4){
            returnVal='部门领导'
            }
            else if(value === 5){
            returnVal='法人+负责人+部门领导'
            }

            return returnVal;
        }        
    },
  
    components: {
        jdyAlert,
        jdyLog
    },

}
</script>

<style scoped lang="less">
.jdy-tab {
  padding-right: 0;
}
.jdy-table {
  .salemanage {
    color: #467cd4;
    &:hover {
      cursor: pointer;
    }
  }
}
.alertHead {
  width: 100%;
  height: 50px;
  background: #f9fafc;
  border-bottom: 1px solid #d7dfe3;
  .headTitle {
    margin-left: 25px;
    width: 80px;
    line-height: 50px;
    height: 48px;
    color: #467cd4;
    border-bottom: 2px solid #467cd4;
  }
}
/* 弹窗 */
.yjk-alertInner {
  padding: 20px;
  margin-bottom: 0;
  .yjk-innerTitle {
    text-align: center;
  }
  .infoLine {
    width: 49%;
    text-align: left;
    display: inline-block;
    .infoTitle {
      display: inline-block;
      width: 30%;
      text-align: right;
    }
  }
}
.link {
  color: #467cd4;
}
</style>
