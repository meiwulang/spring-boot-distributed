<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
				<div>
					<el-select v-model="searchParam.companyId" placeholder="请选择分公司" v-show="logindata.uDataLimit==3" clearable @change="getTableData">
						<el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
					</el-select> 					
                    <el-input placeholder="请输入模板编号或模板名称搜索" v-model.trim="searchParam.str" class="Contractinput mr10">
                    </el-input> 
                    <el-button type="primary" class="btnInTab" @click="getTableData">搜索</el-button>                                       
				</div>
				<div>
					<!-- <el-button type="primary" class="btnInTab" @click="add">新增模板</el-button> -->
					<el-upload
						:show-file-list="false"
						:action="upload.action"
						:on-preview="handlePreview"
						:on-success="uploadSuccess"
						:on-remove="handleRemove"
						:name="upload.name"
						:headers="upload.uploadHeader">
						<el-button type="primary">新增模板</el-button>
					</el-upload>
					<!-- formData上传 -->
					<!-- <form :action="upload.action" enctype="multipart/form-data" method="post">
						上传文件1：<input type="file" name="multipartFile"><br/>
						<input type="submit" value="提交111">
					</form>																			 -->
				</div>
			</div>
			<!--jdy-search end-->	
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border class="all">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="模板编号">
						<template scope="scope">
							{{ scope.row.templateNo  }}
						</template>
					</el-table-column>
					<el-table-column label="模板名称">
						<template scope="scope">
							{{ scope.row.templateTitle  }}
						</template>
					</el-table-column>
					<el-table-column label="创建时间">
						<template scope="scope">
							{{ scope.row.updateTime|dateFormat("time") }}
						</template>
					</el-table-column>
					<!-- <el-table-column label="操作" width="250" fixed="right">
						<template scope="scope">
							<el-button type="default"  size="mini" @click="delContract(scope.row.id)" class="red" :disabled="scope.row.pid!=null">
								删除
							</el-button>
						</template>
					</el-table-column> -->
				</el-table>
	
				<!-- 分页   begin-->
				<div class="clearfix">
					<el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
					</el-pagination>
				</div>
				<!-- 分页   end-->
	
			</div>
			<!--jdy-table end-->
		
		</div>
		<!--jdy-content-inner-trip end-->
	</div>
	<!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
// import oData from './h.js';
// import jdyPic from '@/components/Pic';
// import jdyWhere from '@/components/Where';
export default {
	name: 'Hotel',
	data() {
		return {
			// 查询参数
			searchParam:{
				str:"",
				companyId:null,
				currPage: 1,
				pageSize: 20,				
			},	
			currentPage: 1, //列表当前所在页,
			pageSize: 20,	
			tableDataTotal: 0,  		
			tableData: [],
			// // 城市相关
			// Municipalities:['北京','上海','天津','重庆'],
			// proviceArr:[],
			// selectEd:'',
			// cityboxFlag:false,	
			// // 酒店等级
			// levelList:[],
			// // 刷新
			// fullscreenLoading:false,
			upload:{
				// action:api_prefix+'common/file/upload',
				action:api_prefix+"front/order/m/electronicContract/contractTemplateTransmit",
				fileList:[],
				fileType:{ fileType: "pdf" },
				name:"multipartFile",
				uploadHeader: {
					'Authorization': sessionStorage.token
				},				
			},
			file:null,
			//系统级需要有查询公司功能
			BuyerCompanyIdArr:[],
			logindata:null,
		}
	},
	methods: { 		
		getTableData() {
			this.$http.post(api_prefix + "front/order/m/electronicContract/searchList",this.searchParam).then(response => {
			if(response.data.code == 0){
				let data = response.data.body;
				this.tableData=data.list;			
				this.tableDataTotal = data.total;
			}else{
				this.$alert(data.message,"温馨提示",{type: 'error'});
			}
			},response => {
				this.$alert("获取酒店数据失败","温馨提示",{type: 'error'});
			});			
		},		
		delContract(id) {
            this.$confirm('你确定要删除该合同模板？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				this.$http.get(api_prefix + 'front/order/m/electronicContract/deleteTemp/'+id).then(response => {
					if(response.data.code == 0){
						this.$message.success("删除成功！")
					}else{
						this.$message.info("删除失败！")						
					}
					this.getTableData();
                }, response => {
                    console.log('出错了');
                });
            }).catch(() => {

            });			
		},
		handlePreview(file){
			console.log("handlePreview文件",file)
		},
		handleRemove(file){
			console.log("handleRemove文件",file)
		},
		// 上传成功时的回调
		uploadSuccess(file){
			this.getTableData()
			this.$message.success("上传成功！")
		},
		handleCurrentChange(val) {
			if (val) {
				this.searchParam.currPage = val;		
				this.getTableData();
			}
		},
		handleSizeChange(){

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
	},
	components: {
		jdyAlert,
	},
	mounted(){
		this.logindata = JSON.parse(sessionStorage.loginData);
		// this.searchParam.companyId=this.logindata.uCompanyId
		if(this.logindata.uDataLimit==3){
			this.getBuyerCompanyId(); 
		}else{
			this.searchParam.companyId=this.logindata.uCompanyId
		}
		this.getTableData();

	}  	
}
</script>

<style scoped>
.Contractinput{
	width: 250px;
}
</style>
