<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
				<div class="fright">
                    <!-- <el-button type="primary"> -->
						<router-link class="routerbtn" v-show="$route.query.status!=7" :to="{ name: 'costKeeping',query: {type: 0,productId:productId,isNull:isNull,c_id:c_id,flag:1,scheduleId:$route.query.scheduleId}}">
							<span>添加成本</span>
						</router-link>	
						<router-link class="routerbtn return" :to="{ name: 'groupManage'}">
							<span>返回</span>
						</router-link>												
					<!-- </el-button> -->
				</div>
			</div>
			<!--jdy-search end-->	
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border class="all">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="添加时间" min-width="200">
						<template scope="scope">
							{{ scope.row.create_time | dateFormatTwo }}
						</template>
					</el-table-column>
					<el-table-column label="操作人" min-width="200">
						<template scope="scope">
							{{ scope.row.createUserName }}
						</template>
					</el-table-column>
					<el-table-column label="通过情况" min-width="200">
						<template scope="scope">
							{{ scope.row.status | filterStatus }}
							<el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="bottom-start">
								<span v-show="scope.row.status==2" class="detail">查看原因</span>
							</el-tooltip>							
							
						</template>
					</el-table-column>				
					<el-table-column label="审核人" min-width="200">
						<template scope="scope">
							{{ scope.row.updateUserName }}
						</template>
					</el-table-column>
					<el-table-column label="审核时间" min-width="200">
						<template scope="scope">
							{{ scope.row.update_time | dateFormatTwo }}
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="80">
                        <template scope="scope">
                            <el-button type="default" @click="getDetail(scope.row.id,scope.row.status)" size="mini" class="red mleft0">查看明细</el-button>
                        </template>
					</el-table-column>
				</el-table>
	
				<!-- 分页   begin-->
				<div class="clearfix">
					<el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
					</el-pagination>
				</div>
				<!-- 分页   end-->
	
			</div>

		</div>
	</div>
	<!--jdy-content end-->
</template>

<script>

export default {
	name: 'Hotel',
	data() {
		return {
			// 查询参数
			searchParam:{
				scheduleId:this.$route.query.scheduleId,
				currPage: 1,
				pageSize: 20,				
			},	
			productId:this.$route.query.productId,
			c_id:this.$route.query.c_id,
			currentPage: 1, //列表当前所在页,
			pageSize: 20,	
			tableDataTotal: 0,  		
			tableData: [],
			isNull:null,
			locationFlag:"",
		}
	},
    filters: {
		filterStatus: function (value) {
			switch (value) {
			case 0:
				value = "待审核";
				break;
			case 1:
				value = "通过";
				break;
			case 2:
				value = "未通过";
				break;				
			}
			return value
		}
    },	
	methods: { 		
		getTableData() {
			this.$http.post(api_prefix + "productCosting/queryCostingTitleList",this.searchParam).then(response => {
			if(response.data.code == 0){
				let data = response.data.body;
				this.tableData=data.list;			
				this.tableDataTotal = data.total;
				if(data.list.length>0){
					this.isNull=false;
				}else{
					this.isNull=true;
				}
			}else{
				this.$alert(response.data.message,"温馨提示",{type: 'error'});
			}
			},response => {
				this.$alert("获取数据失败","温馨提示",{type: 'error'});
			});			
		},	
		// getProductDetail(){
		// 	this.$http.post(api_prefix + '/product/detail', { "id": this.$route.query.id, "lineType": 0 }).then(response => {
		// 		if (response.data.body.code == 0) {
		// 			let resdata=response.data.body.body.product;
		// 			this.productType=resdata.ascription==1?"2":"1";
		// 			this.getTableData(this.productType)
		// 		} else {
		// 			this.$alert(response.body.message, "温馨提示", { type: 'error' });
		// 		}
		// 	}, response => {
		// 		this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
		// 	});  			
		// },
		handleCurrentChange(val) {
			if (val) {
				this.currentPage = val;		
				this.getTableData();
			}
		},
		handleSizeChange(){

		},
        // 查看明细
        getDetail(id,status){
			this.$router.push({name:'costKeeping',query:{id:id,type:1,productId:this.productId,isNull:this.isNull,c_id:this.c_id,flag:0,scheduleId:this.$route.query.scheduleId,status:status}})
		},
		// gotoAddCostPage(){
		// 	this.$router.push({name:'addCostPage',query:{type: 0,pid:this.pid,isNull:this.isNull}});
		// }
	},
	mounted(){
		this.getTableData();
		this.locationFlag=location.hash.split("/")[1];
	}  	
}
</script>

<style scoped>
.resources-tab{
    display:block;
}
.routerbtn{
	display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    margin: 0;
    padding: 10px 15px;
	border-radius: 4px;
	color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;	
}
.detail{
	color:#20a0ff;
	font-size: 8px;
	cursor: pointer; 
}
.return{
	background: #fff;
	color: black;
	border:1px solid #c4c4c4;
}
</style>
