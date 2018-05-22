<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
                <span>游客信息</span>
                <div>
                <el-button @click="goback" class="fright">返回</el-button>
                <el-button type="primary" class="fright mr10" @click="changeHref">导出游客信息</el-button>
                </div>
			</div>
			<!--jdy-search end-->
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border class=" all">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="下单人员" width="">
						<template scope="scope">
                            <span class="colorSpan" @click="peopleDetail(scope.row.orderCreatorId)">{{ scope.row.orderCreatorName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" width="">
						<template scope="scope">
						{{ scope.row.touristStatus | filterStatus }}
						</template>
					</el-table-column>                    
					<el-table-column label="票价类目" width="">
						<template scope="scope">
							{{ scope.row.ticketPriceCategoryName }}
						</template>
					</el-table-column>
					<el-table-column label="票种" width="">
						<template scope="scope">
						{{ scope.row.ticketType==1?"儿童":"成人" }}
						</template>
					</el-table-column>
					<el-table-column label="游客姓名" width="">
						<template scope="scope">
							{{ scope.row.touristName }}
						</template>
					</el-table-column>
					<el-table-column label="游客电话" width="">
						<template scope="scope">
							{{ scope.row.touristPhone }}
						</template>
					</el-table-column>  
					<el-table-column label="接送信息" min-width="150">
						<template scope="scope">
                            <div>去程：{{ scope.row.startPlace }}</div>
                            <div>返程：{{ scope.row.backPlace }}</div>
						</template>
					</el-table-column>                                      
					<el-table-column label="证件类型" width="">
						<template scope="scope">
							{{ scope.row.licenseType==1?"护照":"身份证" }}
						</template>
					</el-table-column>
					<el-table-column label="证件号" min-width="150">
						<template scope="scope">
							{{ scope.row.licenseNo }}
						</template>
					</el-table-column>
					<el-table-column label="订单号" min-width="150">
						<template scope="scope">
                            <span class="colorSpan" @click="orderDetail(scope.row.orderId)">{{ scope.row.orderNo }}</span>
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
                scheduleId:null,
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
            downLoadHref:''            
		}
	},
	methods: {		
        changeHref(){
        this.downLoadHref = api_prefix + 'Schedule/exportTouristsListByScheduleId?scheduleId=' + this.$route.query.sId
        console.log(this.downLoadHref,'downLoadHref')
        location.href = this.downLoadHref;
    },
		getTableData() {
			this.$http.post(api_prefix + "Schedule/queryTouristsListByScheduleId",this.searchParam).then(response => {
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
        
        goback(){
            window.history.go(-1);
        }
    },
    filters:{
        sexName: function (value) {
            return value ? '女':'男'
        }, 
        filterStatus:function(value){
            switch (value) {
            case -1:
                return "取消"
                break;
            case 0:
                return "正常"
                break;
            case 1:
                return "退票"
                break;
            case 2:
                return "改签"
                break;
            }            
        }    
    },    
    components: {
        jdyAlert,
    },    
	mounted(){
        this.searchParam.scheduleId=this.$route.query.sId,        
		this.getTableData();
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
</style>
