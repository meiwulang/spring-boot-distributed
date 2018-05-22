<template>
  <div class="jdy-content fleft newuserList">
          <div class="fleft comList clearfix">
              <!-- 单元 -->
              <div class="listPart" v-for="item in tableData" :key="item.id">
                  <div class="fleft">
                      <div class="img_titel_scheme" v-if="item.type==1"></div>
                      <div class="img_titel_demand" v-if="item.type==0"></div>
                      <div class="img_line"></div>
                  </div>
                  <div lass="fleft clearfix point" @click="getDetail(item.type,item.id)">
                      <div class="listPart_title">
                          {{item.type==0?"方案：":"需求单："}}{{$route.query.name}}
                      </div>
                      <div class="listPart_date">
                          &nbsp;&nbsp;{{item.createTime}}
                      </div>
                  </div>
              </div>
          </div>
          <div class="fleft userList clearfix">
                <div class="userList_title">
                    需求单详情
                    <el-button @click="goback" class="btnInTab fright mr10 mt10">返回</el-button>
                </div>
                <div class="userList_body">
                    <div class="yjk-alertInner">
                        <div>
                            <div class="contentTitle">个人定制游基本信息</div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">出发城市：</span>
                                <span>{{demandDetail==null?"":demandDetail.startCity}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">目的地：</span>
                                <span>{{demandDetail==null?"":demandDetail.destinationCitys}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">出发日期：</span>
                                <span>{{demandDetail==null?"":demandDetail.startDate}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">出游天数：</span>
                                <span>{{demandDetail==null?"":demandDetail.playDays}}天
                                </span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">出游人数：</span>
                                <span>
                                    {{demandDetail==null?"":demandDetail.playPeoples}}
                                </span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">人均预算：</span>
                                <span>{{demandDetail==null?"":demandDetail.perBudget}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">需求提供：</span>
                                <span class="serviceArr noticePink" v-if="demandDetail!=null">{{demandDetail.optionalServiceArr[0]}}</span>
                                <span class="serviceArr noticeYellow" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>1">{{demandDetail.optionalServiceArr[1]}}</span>  
                                <span class="serviceArr noticeOrange" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>2">{{demandDetail.optionalServiceArr[2]}}</span>
                                <span class="serviceArr noticeGreen" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>3">{{demandDetail.optionalServiceArr[3]}}</span> 
                                <span class="serviceArr noticePurple" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>4">{{demandDetail.optionalServiceArr[4]}}</span>
                                <span class="serviceArr noticeBlue" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>5">{{demandDetail.optionalServiceArr[5]}}</span> 
                                <span class="serviceArr noticeGray" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>6">{{demandDetail.optionalServiceArr[6]}}</span>
                                <span class="serviceArr noticeRed" v-if="demandDetail!=null&&demandDetail.optionalServiceArr.length>7">{{demandDetail.optionalServiceArr[7]}}</span>                                                                                                                               
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle fleft clearfix">其他需求：</span>
                                <span class="inlineblock" style="width:85%">
                                    {{demandDetail==null?"":demandDetail.otherService}}
                                </span>
                            </div>                               
                        </div>
                        <div>
                            <div class="contentTitle">销售人员信息</div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">姓名：</span>
                                <span>{{demandDetail==null?"":demandDetail.saleName}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">手机：</span>
                                <span>{{demandDetail==null?"":demandDetail.salePhone}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">微信号：</span>
                                <span>{{demandDetail==null?"":demandDetail.saleWx}}</span>
                            </div>               
                        </div>
                        <div>
                            <div class="contentTitle">游客联系人信息</div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">姓名：</span>
                                <span>{{demandDetail==null?"":demandDetail.headName}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">性别：</span>
                                <span>{{demandDetail==null?"":demandDetail.headSex}}</span>
                            </div>                  
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">手机：</span>
                                <span>{{demandDetail==null?"":demandDetail.headPhone}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">微信号：</span>
                                <span>{{demandDetail==null?"":demandDetail.headWx}}</span>
                            </div>
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">邮箱：</span>
                                <span>{{demandDetail==null?"":demandDetail.headEmail}}</span>
                            </div>                  
                            <div class="contentDiv">
                                <span class="yjk-innerTitle">提交时间：</span>
                                <span>{{demandDetail==null?"":demandDetail.createDate}}</span>
                            </div>                
                            
                        </div>

                    </div>
                </div>
          </div>    
  </div>
  <!--jdy-content end-->
</template>

<script>

  export default {
    name: 'roleManager',
    data() {
      return {
        currentPage:1,
        pageSizeAll:20,
        tableDataTotal:0,
        tickForm:{
            currPage:1,
            pageSize:20,
            fastSearchStr:'',
            type:null,
            statusList:[0,2],
            companyId:null,
            departmentId:null,
        },
        jdytabActive:null,
        searchValue:'',
        tableData:[],
        publicId:'',
        accesstoken:'',
        time:'',  
        demandDetail:null,
      }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData(){
            this.$http.get(api_prefix + 'require/historyDesignRequireList/' + this.$route.query.id).then(response => {
                if (response.data.code == 200) {
                    this.tableData=response.data.data;
                    // 找出第一个需求类型的，并调接口
                    for(let i=0;i<this.tableData.length;i++){
                        if(this.tableData[i].type==1){
                            this.getDemandDetail(this.tableData[i].id);
                            break;
                        }
                    }
                } else {

                }
            }, response => {
                console.log('出错了');
            });
        },
        handleCurrentChange(val){
            this.tickForm.currPage=val;
            this.currentPage = val;
            this.getTableData();
        },
        handleRowChange(){

        },
        getDetail(_type,_id){
            if(_type){
                this.getDemandDetail(_id)
            }else{
                // window.open(location.host+"/wap/m/made_plan.html?edit=0&requireId="+_id)   
                var urlHead = '';
                if(location.host == 'b2b.fingercrm.cn'){
                    urlHead = 'http://b2b.fingercrm.cn'
                }else{
                    urlHead = 'http://b2b.test.fingercrm.cn'
                }          
                window.open(urlHead+"/wap/m/made_plan.html?id="+_id)                         
            }
        },
        // 查看需求单明细
        getDemandDetail(id){
            let param={
                edit:0,
                requireId:id
            }
            this.$http.post(api_prefix + "require/queryRequireDetail",param).then(response => {
                if (response.body.code == 200) {
                    let data=response.body.body;
                    this.demandDetail=JSON.parse(JSON.stringify(data));
                } else {
                    this.$message.error(response.body.message)
                }
            })
        },
        goback(){
            window.history.go(-1);
        },
    }

  }


</script>
<style scoped lang='less'>
.el-form-item{
    margin-bottom: 0;
}
.yjk-orderList{
    width:98%;
    margin: 1%;
}
.yjk-orderList .el-table th>.cell,.yjk-orderList .el-table td>.cell{
    text-align: center;
}
.newuserList{
    height: auto;
    background: #f9fafc;
    .comList{
        // width:e("calc(22% - 1px)");
        width: 27%;
        padding-left:3%;
        padding-top: 70px; 
        padding-bottom: 100px;
        background: #f9fafc;
        // border-right: 1px solid #d7dfe3;
        .listPart{
            height: 80px;
            .listPart_title{
                margin-bottom: 10px;
            }
            .listPart_date{
                font-size: 12px;
            }
            &:hover{
                color: #0099ff;
                cursor:pointer;
            }
        }
    }
    .userList{
        width:e("calc(70% - 1px)");;
        border-left:1px solid #d7dfe3;
        .userList_title{
            height: 60px;
            line-height: 60px;
            background: #f9fafc;
            border-bottom: 1px solid #d7dfe3;
            width: 98%;
            padding-left: 2%;
        }
        .userList_body{
            background: #fff;
        }
    }
    .el-row{
      padding:15px 20px 0 10px;
    }
}
.yjk-alertInner{
    padding: 25px 30px 5px 60px;
    margin-bottom: 0;
    .contentTitle{
        margin-bottom: 15px;
        font-size: 18px;
    }
    .contentDiv{
        margin-bottom: 10px;
        color: #99abb4;
        font-size: 14px;        
    }
    .yjk-innerTitle{
        width: 80px;
    }
    .serviceArr{
        padding: 0 10px;
        border-radius: 5px;
        color: #fff;        
    }
    .noticePink{
        background: #ff99ff;
    }
    .noticeYellow{
        background: #ffcc00;
    }  
    .noticeOrange{
        background: #ff9900;
    }
    .noticeGreen{
        background: #009933;
    } 
    .noticePurple{
        background: #ff66cc;
    }  
    .noticeBlue{
        background: #0099ff;
    }
    .noticeGray{
        background: #999999;
    }   
    .noticeRed{
        background: #fc3540;
    }   
}

</style>



