<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<el-row class="jdy-content-inner-trip pt10 pl10 pr10">
				<inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :showTripTab="headerData.showBtnInTabFlag"></inner-header>
			</el-row>
			<!--jdy-search end-->	
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border class="all">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="添加时间" min-width="200">
						<template scope="scope">
							{{ scope.row.createTime | dateFormatTwo }}
						</template>
					</el-table-column>
					<el-table-column label="有效区间" min-width="200">
						<template scope="scope">
							{{ scope.row.startDate | dateFormat }}~{{ scope.row.endDate | dateFormat }}
						</template>
					</el-table-column>
					<el-table-column label="成本单价" min-width="200">
						<template scope="scope">
							{{ scope.row.unitPrice | moneyTwoPoints }}
						</template>
					</el-table-column>
					<el-table-column label="操作人" min-width="200">
						<template scope="scope">
							{{ scope.row.userName  }}
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="80">
                        <template scope="scope">
                            <el-button type="default" @click="getDetail(scope.row.id)" size="mini" class="red mleft0">查看明细</el-button>
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
// 通用tab页
import innerHeader from './header';
export default {
	components: {
		innerHeader
	},
	name: 'Hotel',
	data() {
		return {
			headerData:{
				name:"ProductDeployCostList",
				btnFlag:false,
				showBtnInTabFlag:this.$route.query.tripFlag,
			},
			// 查询参数
			searchParam:{
				str:"",
				companyId:null,
				currPage: 1,
				pageSize: 20,				
			},	
			pid:this.$route.query.id,
			c_id:this.$route.query.c_id,
			currentPage: 1, //列表当前所在页,
			pageSize: 20,	
			tableDataTotal: 0,  		
			tableData: [],
			isNull:null,
			locationFlag:""
		}
	},
	methods: { 		
		getTableData(param) {
			this.$http.post(api_prefix + "productCosting/queryProductCostingTitleListById",{
				productId: this.$route.query.id,
				type: 1,
				pageSize: 20,
				currPage : this.currentPage,
				productType:param,
				companyId:this.c_id
			}).then(response => {
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
		getProductDetail(){
			this.$http.post(api_prefix + '/product/detail', { "id": this.$route.query.id, "lineType": 0 }).then(response => {
				if (response.data.body.code == 0) {
					let resdata=response.data.body.body.product;
					this.productType=resdata.ascription==1?"2":"1";
					this.getTableData(this.productType)
				} else {
					this.$alert(response.body.message, "温馨提示", { type: 'error' });
				}
			}, response => {
				this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
			});  			
		},
		handleCurrentChange(val) {
			if (val) {
				this.currentPage = val;		
				this.getTableData();
			}
		},
		handleSizeChange(){

		},
        // 查看明细
        getDetail(id){
			if(this.locationFlag=="assemblylist"){
				this.$router.push({name:'assemblyAddCostPage',query:{id:id,type:1,pid:this.pid}})
			}else{
				this.$router.push({name:'addCostPage',query:{id:id,type:1,pid:this.pid}})
			}			
			
		},
		changeRouter(){
			this.$router.push({ name: 'addCostPage',query: {type: 0,pid:pid,isNull:isNull,c_id:c_id}})
		}
	},
	mounted(){
		this.getProductDetail();
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
</style>
