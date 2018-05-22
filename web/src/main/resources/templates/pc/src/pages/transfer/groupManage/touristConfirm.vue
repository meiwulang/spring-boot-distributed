<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
            <div class="jdy-tab" style="margin:0;padding-right:0" v-show="editFlag==true">
                <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
                    <span></span>
                </a>
                <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">未确认
                    <span></span>
                </a>            
                <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">确认出行
                    <span></span>
                </a>
                <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">确认不出行
                    <span></span>
                </a>
                <el-button @click="goback" class="fright mr10 mt10">返回</el-button> 
                <el-button type="primary" @click="batchConfirm" class="fright mr10 mt10" v-if="jdytabActive != null">批量确认出行游客</el-button>                
                <el-button type="primary" @click="confirmTourists" class="fright mt10" v-if="jdytabActive == 1">确认出行游客名单</el-button>                              
            </div>   
            <div class="jdy-tab" style="margin:0;padding-right:0" v-show="editFlag==false">
                <span class="confirmText">确认时间<span style="margin-left:10px;">{{confirmTime | dateFormat('time')}}</span></span>
                <el-button @click="goback" class="fright mr10 mt10">返回</el-button>               
                <el-button type="primary" @click="changeHref" class="fright mr10 mt10">导出游客出行名单</el-button>                            
            </div>                       
			<!--jdy-search end-->
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border  ref="multipleTable" class="all" @selection-change="handleSelectionChange" v-show="editFlag == true">
                    <el-table-column type="selection" width="55" v-if="jdytabActive!=null">
                    </el-table-column>                    
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="下单人员" width="80">
						<template scope="scope">
                            <span class="colorSpan" @click="peopleDetail(scope.row.orderCreatorId)">{{ scope.row.orderCreatorName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" width="120">
						<template scope="scope">
                        <span v-if="scope.row.touristStatus == 3">确认出行</span>
                        <span v-if="scope.row.touristStatus == 0">未确认</span>
                        <span v-if="scope.row.touristStatus == 1 || scope.row.touristStatus == 2">确认不出行</span>
						</template>
					</el-table-column>                    
					<el-table-column label="票价类目" width="100">
						<template scope="scope">
							{{ scope.row.ticketPriceCategoryName }}
						</template>
					</el-table-column>
					<el-table-column label="票种" width="60">
						<template scope="scope">
						{{ scope.row.ticketType==1?"儿童":"成人" }}
						</template>
					</el-table-column>
					<el-table-column label="游客姓名" width="100">
						<template scope="scope">
							{{ scope.row.touristName }}
						</template>
					</el-table-column>
					<el-table-column label="游客电话" width="">
						<template scope="scope">
							{{ scope.row.touristPhone }}
						</template>
					</el-table-column>                                      
					<el-table-column label="证件类型" width="100">
						<template scope="scope">
							{{ scope.row.licenseType==1?"护照":"身份证" }}
						</template>
					</el-table-column>
					<el-table-column label="证件号" min-width="130">
						<template scope="scope">
							{{ scope.row.licenseNo }}
						</template>
					</el-table-column>
					<el-table-column label="订单号" min-width="150">
						<template scope="scope">
                            <span class="colorSpan" @click="orderDetail(scope.row.orderId)">{{ scope.row.orderNo }}</span>
						</template>
					</el-table-column>  
					<el-table-column label="选择确认结果" min-width="170" v-if="editFlag==true">
						<template scope="scope">
                            <el-radio-group v-model="tableData[scope.$index].touristStatus">
                                <el-radio :label="3">出行</el-radio>
                                <el-radio :label="1">退票</el-radio>
                                <el-radio :label="2">改签</el-radio>
                            </el-radio-group>
						</template>
					</el-table-column>                                         
					<el-table-column label="操作" width="100" v-if="editFlag==true">
						<template scope="scope">
                            <el-button type="default" size="mini"  @click="confirm(scope.row.touristStatus,scope.row.touristId)">确认</el-button>                          
						</template>
					</el-table-column>                                        
				</el-table>
                <el-table :data="tableData" border  ref="multipleTable" class="all" v-show="editFlag == false">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="下单人员" width="80">
						<template scope="scope">
                            <span class="colorSpan" @click="peopleDetail(scope.row.orderCreatorId)">{{ scope.row.orderCreatorName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" width="120">
						<template scope="scope">
                        <span v-if="scope.row.touristStatus == 3">确认出行</span>
                        <span v-if="scope.row.touristStatus == 0">未确认</span>
                        <span v-if="scope.row.touristStatus == 1 || scope.row.touristStatus == 2">确认不出行</span>
						</template>
					</el-table-column>                    
					<el-table-column label="票价类目" width="100">
						<template scope="scope">
							{{ scope.row.ticketPriceCategoryName }}
						</template>
					</el-table-column>
					<el-table-column label="票种" width="60">
						<template scope="scope">
						{{ scope.row.ticketType==1?"儿童":"成人" }}
						</template>
					</el-table-column>
					<el-table-column label="游客姓名" width="100">
						<template scope="scope">
							{{ scope.row.touristName }}
						</template>
					</el-table-column>
					<el-table-column label="游客电话" width="">
						<template scope="scope">
							{{ scope.row.touristPhone }}
						</template>
					</el-table-column>                                      
					<el-table-column label="证件类型" width="100">
						<template scope="scope">
							{{ scope.row.licenseType==1?"护照":"身份证" }}
						</template>
					</el-table-column>
					<el-table-column label="证件号" min-width="130">
						<template scope="scope">
							{{ scope.row.licenseNo }}
						</template>
					</el-table-column>
					<el-table-column label="订单号" min-width="150">
						<template scope="scope">
                            <span class="colorSpan" @click="orderDetail(scope.row.orderId)">{{ scope.row.orderNo }}</span>
						</template>
					</el-table-column>  
					<el-table-column label="选择确认结果" min-width="170" v-if="editFlag==true">
						<template scope="scope">
                            <el-radio-group v-model="tableData[scope.$index].touristStatus">
                                <el-radio :label="3">出行</el-radio>
                                <el-radio :label="1">退票</el-radio>
                                <el-radio :label="2">改签</el-radio>
                            </el-radio-group>
						</template>
					</el-table-column>                                         
					<el-table-column label="操作" width="100" v-if="editFlag==true">
						<template scope="scope">
                            <el-button type="default" size="mini"  @click="confirm(scope.row.touristStatus,scope.row.touristId)">确认</el-button>                          
						</template>
					</el-table-column>                                        
				</el-table>
				<div class="clearfix">
					<el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
					</el-pagination>
				</div>
				<!-- 分页   end-->
			</div>
            <!--下单人员基本信息  -->
            <jdy-alert title="下单人员基本信息" @closeAlert="closeAlert" v-if="alertFlag" class="alertCityList showtfcity">
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
                            <span class="infoTitle">上级：</span>
                            <span>{{userInfo.upName}}</span>
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
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
	name: 'touristInfo',
	data() {
		return {
			// 查询参数
			searchParam:{
                scheduleSettingId:this.$route.query.id,
                status:[-1],
				currPage: 1,
				pageSize: 15,				
			},	
			currentPage: 1, //列表当前所在页,
			pageSize: 15,	
			tableDataTotal: 0,  		
			tableData: null,
            // 下单人员详细
            alertFlag:false,
            userInfo:null,
            downLoadHref:'',
            
            // new data
            jdytabActive: null, //是否被选中
            multipleSelection:[],
            editFlag:false, //判断是查看还是操作
            confirmList:[],
            confirmTime:'',
		}
	},
	methods: {		
        changeHref(){
            this.downLoadHref = api_prefix + 'Schedule/exportConfirmTouristList/' + this.$route.query.id
            location.href = this.downLoadHref;
        },
        // 页头切换
        jdytab(index) {
            this.jdytabActive = index;
            switch(index){
                case null:
                    this.searchParam.status = [-1];
                break;
                case 0:
                    this.searchParam.status = [0];
                break; 
                case 1:
                    this.searchParam.status = [3];
                break; 
                case 2:
                    this.searchParam.status = [1,2];
                break; 
            }
            this.getTableData();
        },    
		getTableData() {
			this.$http.post(api_prefix + "Schedule/confirmTouristList",this.searchParam).then(response => {
			let data = response.body;
			if(data.code == "0"){
				this.tableData=data.body.list;				
				this.tableDataTotal = data.body.total;
			}else{
				this.$alert(data.message,"温馨提示",{type: 'error'});
			}
			},response => {
				this.$alert("获取游客信息数据失败","温馨提示",{type: 'error'});
			});			
        },	
        // 下单人员详情
        peopleDetail(userid){
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
        closeAlert(){
            this.alertFlag = false;
        },          
        // 跳转订单详情
        orderDetail(orderid){
            window.open("/sale.html#/orderSellerDetail?id="+orderid) ;
        },
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			if (val) {
				this.searchParam.currPage = val;
				this.searchParam.pageNum = val;				
				this.getTableData();
			}
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
            console.log(val,'val')
            for( let k = 0; k < this.multipleSelection.length; k++){
                this.multipleSelection[k].touristStatus = 3;
            }
        },
        // 批量确认
        batchConfirm(){
            let valConfirm = this.multipleSelection;
            if(valConfirm.length == 0){
                this.$message.error("未选择游客！");
                return;
            }
            for( let k = 0; k < valConfirm.length; k++){
                if(valConfirm[k].touristStatus == 0){
                    this.$message.error("部分游客未选择确认结果！");
                    return;
                }else{
                    this.confirmList.push({touristId:valConfirm[k].touristId,status:valConfirm[k].touristStatus})
                }
            }
            console.log(this.confirmList,'this.confirmList')
            this.$http.post(api_prefix + "Schedule/confirmTourists",this.confirmList).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.$message.success("操作成功！");
                    this.getTableData();
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
            },response => {
                this.$alert("获取游客信息数据失败","温馨提示",{type: 'error'});
            });	
        },
        // 单独确认
        confirm(status,id){
            if(status == 0){
                this.$message.error("请选择确认结果！");
                return;
            }
            this.$http.post(api_prefix + "Schedule/confirmTourists",[{
                status:status,
                touristId:id
            }]).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.$message.success("操作成功！");
                    this.getTableData();
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
            },response => {
                this.$alert("获取游客信息数据失败","温馨提示",{type: 'error'});
            });	
        },
        //正式确认改变团期状态
        confirmTourists(){
            this.$http.get(api_prefix + "Schedule/confirmScheduleSetting/" + this.$route.query.id).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.$message.success("操作成功！");
                    setTimeout(() => {
                        this.$router.push({ name: "groupManage" });
                    }, 500);
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
            },response => {
                this.$alert("获取游客信息数据失败","温馨提示",{type: 'error'});
            });	
        },
        //getConfirmTime
        getConfirmTime(){
            this.$http.get(api_prefix + "Schedule/getConfirmTime/" + this.$route.query.id).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.confirmTime = data.body
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
            },response => {
                this.$alert("获取游客信息数据失败","温馨提示",{type: 'error'});
            });	
        },
        goback(){
            window.history.go(-1);
        }
    },
    filters:{
        sexName: function (value) {
            return value ? '女':'男'
        },     
    },    
    components: {
        jdyAlert,
    },    
	mounted(){
        this.getTableData();
        this.editFlag=this.$route.query.type==0?true:false;
        if(this.$route.query.type == 1){
            this.getConfirmTime()
        }
	}  	
}
</script>
<style scoped lang="less"> 
.colorSpan{
    color: #467cd4;
    cursor: pointer;
}
.infoLine {
    width: 49%;
    text-align: left;
    display: inline-block;
    .infoTitle{
        display: inline-block;
        width: 30%;
        text-align: right;
    }
}
.jdy-tab a:last-child {
  border-right: 1px solid #d7dfe3;
}
.confirmText{
    line-height: 60px;
    margin-left: 15px;
}
</style>
