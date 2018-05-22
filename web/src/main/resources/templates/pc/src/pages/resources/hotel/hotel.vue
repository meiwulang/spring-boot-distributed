<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
				<div>
					<div class="inlineblock mr10">
						<div class="inlineblock mr10">
							<div class="el-input">
								<input autocomplete="off" v-model="searchParam.hCity" placeholder="请选择城市" type="text" rows="2" validateevent="true" @click="getCity" class="el-input__inner">
								</div>
							<!-- <el-input class="" v-model="search.address" placeholder="点击查询公司所在地" @click="getCity" ></el-input> -->
							<!-- <i class="el-input__icon el-icon-caret-top f13" style="transform: rotateZ(180deg);" @click="getCity"></i> -->
							<div class="selectcitybox absolute" v-if="cityboxFlag">
								<div class="selectcitybox-i">
								<ul>
									<!-- <li class="clearfix">
										<div class="provicebox fleft">
											直辖市
										</div>
										<div class="citybox fleft">
											<span @click="selectCity(1,'北京')" :class="{active:selectEd==1}">北京</span>
											<span @click="selectCity(2,'上海')" :class="{active:selectEd==2}">上海</span>
											<span @click="selectCity(3,'天津')" :class="{active:selectEd==3}">天津</span>
											<span @click="selectCity(4,'重庆')" :class="{active:selectEd==4}">重庆</span>
										</div>
									</li> -->
									<li class="cityli clearfix" v-for="citys in proviceArr" :key="citys.id">
										<!-- <div class="provicebox fleft">
											{{key}}
										</div> -->
										<div class="citybox fleft" >
											<span @click="selectCity(citys.id,citys.name)" :class="{active:selectEd==citys.id}">{{citys.name}}</span>
										</div>
									</li>
								</ul>
								</div>
							</div>						
						</div>
						<el-select v-model="searchParam.hLevel" clearable placeholder="酒店等级" class="jdy-search-edit hasbg " @change="getTableData">
							<el-option v-for="item in levelList" :value="item.id" :label="item.dName" :key="item.id">
							</el-option>                                 
						</el-select> 					
					</div>
					<div class="inlineblock mr10">
						快速搜索：
						<el-input placeholder="酒店名称" v-model="searchParam.hName" class="w200 mr10">
							<!-- <el-button slot="append" icon="search" class="btnbg" @click="getTableData
							"></el-button> -->
						</el-input>
						<el-button type="primary" class="btnInTab" @click="getTableData">搜索</el-button>
					</div>
				</div>
				<div>
					<el-button type="default" class="btnInTab"  @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
					<el-button type="primary" class="btnInTab" @click="add">添加</el-button>					
				</div>
			</div>
			<!--jdy-search end-->
	
			<div class="jdy-table jdy-table-padding">
				<el-table :data="tableData" border class=" all">
					<el-table-column label="序号" type="index" width="60">
					</el-table-column>
					<el-table-column label="酒店名称" width="">
						<template scope="scope">
							{{ scope.row.hName }}
						</template>
					</el-table-column>
					<el-table-column label="酒店等级" width="">
						<template scope="scope">
							{{ scope.row.hLevel }}
						</template>
					</el-table-column>
					<el-table-column label="地址" width="">
						<template scope="scope">
						{{ scope.row.hProvince }}{{ scope.row.hCity }}{{ scope.row.hArea }}
						</template>
					</el-table-column>
					<el-table-column label="简称" width="">
						<template scope="scope">
							{{ scope.row.hShortName }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="250" fixed="right">
						<template scope="scope">
							<el-button type="default" size="mini" @click="edit(scope.row.id)" class="mr15">
								编辑
							</el-button>
							<!-- <el-button type="default" class="red" @click="picManage" size="mini" v-if="scope.row.operation.pic==1">
								图片管理
							</el-button> -->
							<el-button type="default" class="red" @click="del(scope.row,scope.row.id)" size="mini" >
								删除
							</el-button>
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
				companyId: JSON.parse(sessionStorage.loginData).uCompanyId,
				hCity: "",
				hLevel: "",
				hName: "",
				hPym: "",
				currPage: 1,
				pageSize: 20,				
			},	
			currentPage: 1, //列表当前所在页,
			pageSize: 20,	
			tableDataTotal: null,  		
			tableData: null,
			// 城市相关
			Municipalities:['北京','上海','天津','重庆'],
			proviceArr:[],
			selectEd:'',
			cityboxFlag:false,	
			// 酒店等级
			levelList:[],
			// 刷新
			fullscreenLoading:false,
		}
	},
	methods: {
        // 获取景点属性,景点等级
        getDiclist(value){
            this.$http.post(api_prefix +"Dictionaries/dictList", {dGroupId: value}).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                };
                this.levelList=response.body.body         
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });            
        },  		
		getTableData() {
			this.searchParam.hPym=this.searchParam.hName
			this.$http.post(api_prefix + "hotel/list",this.searchParam).then(response => {
			let data = response.body;
			if(data.code == "0"){
				this.tableData=data.body.list;
				let templevel;
				for(let i=0;i<this.tableData.length;i++){
					templevel=this.levelList.filter((data)=>{return this.tableData[i].hLevel==data.id});
					if(templevel.length!=0){
						this.tableData[i].hLevel=templevel[0].dName;
					}				
				}				
				this.tableDataTotal = data.body.total;
			}else{
				this.$alert(data.message,"温馨提示",{type: 'error'});
			}
			},response => {
				this.$alert("获取酒店数据失败","温馨提示",{type: 'error'});
			});			
		},
		getDefaultProvinceStr(){
			let a=1
			this.$http.post(api_prefix + 'City/selectCityPutList',{a:a}).then(response => {
				let body =response.body.body;
				// for(var p in body){
				// 	if(this.Municipalities.indexOf(p) != -1){
				// 		delete body[p];
				// 	}
				// }
				// console.log(body)
				this.proviceArr = body;
			});
		},		
		selectCity(id,city){
			this.selectEd = id; //class设置active
			this.searchParam.hCity = city; //选中城市
			this.cityboxFlag = false; //隐藏弹窗
			this.getTableData()
		},		
		getCity() {//隐藏显示弹窗
			this.cityboxFlag = !this.cityboxFlag;
		},		
		add() {
			this.$router.push({ name: "hotelInfo",query:{type: 1}})
		},
		edit(id) {
			// this.$router.push({ name: "hotelInfo",query:{type: 0,hotelId:id}})
			this.$router.push({ name: "hotelInfo",query:{type: 0,hotelId:id}})
		},
		del(item,hotelId) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {	
                this.$http.get(api_prefix + 'hotel/delete/'+hotelId).then(response => {
                    if(response.data.code == 0){                      
						this.tableData.splice(this.tableData.indexOf(item), 1);
                    }else{
						this.$message({
							type: 'error',
							message: '删除失败!'
						});
                    }
                },response=>{
                    console.log("酒店删除失败！")
                });  				
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			})
		},
		// 刷新  
		updatePage(){
			this.fullscreenLoading = true;
            this.searchParam={
                companyId: 123,
                hCity: "",
                hLevel: "",
                hName: "",
                hPym: "",
                currPage: 1,
                pageSize: 20,                
            };                			
			setTimeout(()=>{
				this.fullscreenLoading = false;
				this.$message({
					showClose: true,
					message: '刷新成功',
					type: 'success'					
				})
				this.currentPage=1;
                this.getTableData();				
			})
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
		}
	},
	components: {
		jdyAlert,
	},
	mounted(){
		this.getDefaultProvinceStr();
		this.getDiclist(239)
		this.getTableData();
	}  	
}
</script>
<style scoped>
.cityli{
	display: inline-block;
	padding: 0 10px;
	text-align: center;
	font-size: 12px;	
}
.citybox{
	width: 70px;
}

</style>
