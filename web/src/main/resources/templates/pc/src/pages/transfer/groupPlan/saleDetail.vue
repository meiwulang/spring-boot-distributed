<template>
  <div class="jdy-content jl-information fleft">
    <div class="jdy-content-inner-trip">
      <div class="jdy-tab">
        <el-form :model="ruleSearchForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
              <div class="fleft mt14" v-show="tableDataTotal!=0">【{{$route.query.pname}}】{{$route.query.name}}{{$route.query.time}}
                  {{$route.query.jdytabActive==0?"全部":($route.query.jdytabActive==1?"预约":"订购")}}名单</div>
            <el-button type="default" class="ml10 btnInTab fright mr10" @click="goBack()">返回</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table p10 jl-information">
        <el-table class="all yjk-orderList" :data="tableData" border @current-change="handleRowChange">
          <el-table-column label="序号" type="index" width="60">
            </el-table-column> 
          <el-table-column label="下单人员"  min-width="80">
            <template scope="scope">
             <el-button @click="getUserInfo(scope.row.userId)" type="text" size="small">{{ scope.row.uName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="下单人员手机号"  min-width="150">
            <template scope="scope">
             {{ scope.row.uTel }}
            </template>
          </el-table-column>
          <el-table-column label="下单人员所属们部门"  min-width="150">
            <template scope="scope">
             {{ scope.row.dName }}
            </template>
          </el-table-column>
          <el-table-column label="游客信息"  min-width="150">
            <template scope="scope">
             {{ scope.row.touristName }}
            </template>
          </el-table-column> 
          <el-table-column label="游客手机号"  min-width="150">
            <template scope="scope">
             {{ scope.row.touristTel }}
            </template>
          </el-table-column> 
          <el-table-column label="游客身份证号"  min-width="150">
            <template scope="scope">
             {{ scope.row.touristID }}
            </template>
          </el-table-column> 
          <el-table-column label="订单号"  min-width="150">
            <template scope="scope">
             <el-button @click="getOrderInfo(scope.row.oId)" type="text" size="small">{{ scope.row.orderNO }}</el-button>
            </template>
          </el-table-column> 
          <el-table-column label="票价类目"  min-width="150">
            <template scope="scope">
             {{ scope.row.tCategory }}
            </template>
          </el-table-column>           
          <el-table-column label="票价名称"  min-width="150">
            <template scope="scope">
             {{ scope.row.tName }}
            </template>
          </el-table-column> 
          <el-table-column label="下单时间"  min-width="150">
            <template scope="scope">
             {{ scope.row.orderTime }}
            </template>
          </el-table-column>           
        </el-table>
        <div class="fleft totelDiv">游客人数合计：{{totelPeople}}</div>
        <!-- 分页   begin-->
        <div class="fright clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->
      </div>

        <jdy-alert title="用户基本信息" @closeAlert="closeAlert" v-if="alertFlag" class="alertCityList showtfcity">
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
    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
//   import API from './../api/index';
//   import api_prefix from '@/assets/js/apiUrl';
  import jdyAlert from '@/components/Alert';

  export default {
    name: 'roleManager',
    data() {
      return {
        currentPage:1,
        pageSizeAll:20,
        tableDataTotal:0,
        ruleSearchForm:{},
        ruleform:{
          currPage:1,
          pageSize:20,
          key:''
        },
        tableData:[],
        publicId:'',
        accesstoken:'',
        time:'',
        rCompanyId:null,
        companyName:null,
        alertFlag:false,
        totelPeople:null,
        // 通过userid查用户
        userInfo:null,
      }
    },
    created(){

    },
    mounted() {
      let InitData=JSON.parse(sessionStorage.loginData)
      this.publicId = InitData.appId;
      this.rCompanyId=InitData.uCompanyId;
      this.companyName=InitData.cName;
      this.getTableData();
    },
    methods: {
      handleCurrentChange(val){
        this.currentPage = val;
        this.ruleform.currPage=val
        this.getTableData();
      },
      handleRowChange(){

      },
      // 返回按钮
      goBack(){
          if(this.$route.query.jdytabActive==0){
            this.$router.push({name:'groupSheet',query:{
                jdytabActive:this.$route.query.jdytabActive,
                time:this.$route.query.time,
                productId:this.$route.query.productId,
                pname:this.$route.query.pname,
                beginDate:this.$route.query.beginDate,
                endDate:this.$route.query.endDate,
                dateRange:this.$route.query.dateRange
            }})
          }else{
            this.$router.push({name:'groupSheet',query:{
                jdytabActive:this.$route.query.jdytabActive,
                time:this.$route.query.time,
                productId:this.$route.query.productId,
                pname:this.$route.query.pname,
                id:this.$route.query.id,
                name:this.$route.query.name,
                beginDate:this.$route.query.beginDate,
                endDate:this.$route.query.endDate,
                dateRange:this.$route.query.dateRange
            }})
          }
      },
      getUserInfo(userid){
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
      getOrderInfo(oId){
          location.href=location.origin+"/sale.html#/orderSellerDetail?id="+oId
      },
      closeAlert(){
        this.alertFlag=false;
      },
      getTableData(){
        let _flag=null; 
        if(this.$route.query.jdytabActive!=0){
            _flag= this.$route.query.jdytabActive==1?0:1;
        }
        let param={
            currPage: this.currentPage,
            flag: _flag,
            pageSize: 20,
            productId: this.$route.query.productId,
            sCalendar: this.$route.query.time,
            ticketId: this.$route.query.id            
        }
        this.$http.post(api_prefix + 'SchedulePlan/planDetailList',param).then(response => {
            if(response.data.code == 0){
                this.tableData=response.body.body.list;
                this.totelPeople=response.body.body.total;
                this.tableDataTotal=response.body.body.total
            }else{
                this.$alert("获取销售明细失败！");
            }
        },response=>{
            console.log("获取销售明细失败！")
        });        
      },
    },
    filters:{
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
        jdyAlert
    },      

  }


</script>
<style scoped lang="less">
.el-form-item{
    margin-bottom: 0;
}
/* 弹窗 */
.yjk-alertInner{
    padding: 20px;
    margin-bottom:0;
    .yjk-innerTitle{
        text-align: center;
    }
    .infoLine{
        width: 49%;
        text-align: left;
        display: inline-block;
        .infoTitle{
            display: inline-block;
            width:30%;
            text-align: right;
        }
    }
}
.totelDiv{
    padding-top:10px;
}

</style>



