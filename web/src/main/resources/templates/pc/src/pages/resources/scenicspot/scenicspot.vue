<template>
    <div class="jdy-content jdy-resources fleft">
        <div class="jdy-content-inner-trip">
            <div class="resources-tab">
				<div>
					<div class="inlineblock mr10 ">
						<div class="inlineblock mr10">
							<!--<jdy-where v-model="search.city"></jdy-where>-->
							<div class="el-input">
								<input autocomplete="off" v-model="searchParam.sCity" placeholder="请选择城市" type="text" rows="2" validateevent="true" @click="getCity" class="el-input__inner">							
								<!--<input autocomplete="off" v-model="searchParam.sCity" placeholder="点击查询公司所在地" type="text" rows="2" validateevent="true" @click="getCity" class="el-input__inner">-->
								</div>
							<!-- <el-input class="" v-model="search.address" placeholder="点击查询公司所在地" @click="getCity" ></el-input> -->
							<!-- <i class="el-input__icon el-icon-caret-top f13" style="transform: rotateZ(180deg);" @click="getCity"></i> -->
							<div class="selectcitybox absolute" v-if="cityboxFlag">
								<div class="selectcitybox-i">
								<ul>
									<li class="cityli clearfix" v-for="citys in proviceArr" :key="citys.id">
										<div class="citybox fleft" >
											<span @click="selectCity(citys.id,citys.name)" :class="{active:selectEd==citys.id}">{{citys.name}}</span>
										</div>
									</li>
								</ul>
								</div>
							</div>	                      
						</div>  
						<el-select v-model="searchParam.sLevel" @change="getTableData" clearable placeholder="景点等级" class="jdy-search-edit hasbg "> 
							<el-option v-for="item in levelList" :value="item.id" :label="item.dName" :key="item.id">
							</el-option>                          
						</el-select>
					</div>
					<div class="inlineblock mr10">
						快速搜索:
						<el-input placeholder="景点名称" v-model="searchParam.sName" class="w200 mr10">
							<!-- <el-button slot="append" icon="search" class="btnbg" @click="getTableData"></el-button> -->						
						</el-input>
						<el-button type="primary" @click="getTableData" class="btnInTab">搜索</el-button>
					</div>
				</div>
				<div>
                	<el-button type="default" class="btnInTab" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
					<el-button type="primary" class="btnInTab" @click="add">添加</el-button>
				</div>
            </div>
            <!--jdy-search end-->
            <div class="jdy-table jdy-table-padding">
                <el-table :data="tableData" border class=" all">
                    <el-table-column label="序号" type="index" width="60">
                    </el-table-column>
                    <el-table-column label="景点名称" width="">
                        <template scope="scope">
                            {{ scope.row.sName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="景点等级" width="">
                        <template scope="scope">
                            {{ scope.row.sLevel }}
                        </template>
                    </el-table-column>
                    <el-table-column label="属性" width="">
                        <template scope="scope">
                            {{ scope.row.sAttribute }}
                        </template>
                    </el-table-column>
                    <el-table-column label="地址" width="">
                        <template scope="scope">
                            <!--{{ scope.row.sCity }}{{ scope.row.sArea }}{{ scope.row.sAdress}}-->
                            {{ scope.row.sProvince }}{{ scope.row.sCity }}{{ scope.row.sArea }}							
                        </template>
                    </el-table-column>
                    <el-table-column label="景点电话" width="">
                        <template scope="scope">
                            {{ scope.row.sPhone }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250" fixed="right">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click="edit(scope.row.id)" class="mr15">
                                编辑
                            </el-button>
                            <el-button type="default" class="red" @click="del(scope.row,scope.row.id)" size="mini">
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
    
        </div>
        <!--jdy-content-inner-trip end-->
    </div>
    <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    name: 'Scenicspot',
    data() {
        return {
			// 查询参数
			searchParam:{
				companyId: JSON.parse(sessionStorage.loginData).uCompanyId,
				sCity: "",
				sLevel: "",
				sName: "",
				sPym: "",
				currPage: 1,
				pageSize: 20,				
			},	
			currentPage: 1, //列表当前所在页,
			pageSize: 20,	
			tableDataTotal: 0,  		
			tableData: null,
			// 城市相关
			Municipalities:['北京','上海','天津','重庆'],
			proviceArr:[],
			selectEd:'',
			cityboxFlag:false,	
            // 景点属性
            attributeList:[],
            // 景点等级   
            levelList:[],  
			// 刷新
			fullscreenLoading:false        
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
                if(value==156){
                    this.levelList=response.body.body
                }else{
                    this.attributeList=response.body.body
                }               
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });            
        },        
		getTableData() {
			this.searchParam.sPym=this.searchParam.sName
			this.$http.post(api_prefix + "scenic_spot/list",this.searchParam).then(response => {
			let data = response.body;
			if(data.code == "0"){
				this.tableData=data.body.list;
				// 页面数据过滤
				let templevel,tempattribute;
				for(let i=0;i<this.tableData.length;i++){
					templevel=this.levelList.filter((data)=>{return this.tableData[i].sLevel==data.id});
					if(templevel.length!=0){
						this.tableData[i].sLevel=templevel[0].dName;
					}
					tempattribute=this.attributeList.filter((data)=>{return this.tableData[i].sAttribute==data.id})
					if(tempattribute.length!=0){
						this.tableData[i].sAttribute=tempattribute[0].dName;
					}					
				}
				this.tableDataTotal = data.body.total;
			}else{
				this.$alert(data.message,"温馨提示",{type: 'error'});
			}
			},response => {
				this.$alert("获取景点数据失败","温馨提示",{type: 'error'});
			});			
		},
		getDefaultProvinceStr(){
			this.$http.post(api_prefix + 'City/selectCityPutList',{}).then(response => {
				let body =response.body.body;
				for(var p in body){
					if(this.Municipalities.indexOf(p) != -1){
						delete body[p];
					}
				}
				this.proviceArr = body;
			});
		},		
		selectCity(id,city){
			this.selectEd = id; //class设置active
            this.searchParam.sCity = city; //选中城市			
			this.cityboxFlag = false; //隐藏弹窗
			this.getTableData()
		},		
		getCity() {//隐藏显示弹窗
			this.cityboxFlag = !this.cityboxFlag;
		},
		add() {
			this.$router.push({ name: "scenicspotInfo",query:{type: 1}})
		},
		edit(id) {
			this.$router.push({ name: "scenicspotInfo",query:{type: 0,spotId:id}})
		},
		del(item,spotId) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {	
                this.$http.get(api_prefix + 'scenic_spot/delete/'+spotId).then(response => {
                    if(response.data.code == 0){                      
						this.tableData.splice(this.tableData.indexOf(item), 1);
                    }else{
						this.$message({
							type: 'error',
							message: '删除失败!'
						});
                    }
                },response=>{
                    console.log("景点删除失败！")
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
                sCity: "",
                sLevel: "",
                sName: "",
                sPym: "",
                currPage: 1,
                pageSize: 20,                
            };            			
			setTimeout(()=>{
				this.fullscreenLoading = false;
				this.$message({
					showClose: true,
					message: '刷新成功',
					type: 'success'					
				});
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
        jdyAlert
    },
    // computed: {
    //     // tableDataTotal() { //列表页数
    //     //     return 500
    //     // }
    // },
	mounted(){
		this.getDefaultProvinceStr();
        this.getDiclist(156);
		this.getDiclist(155);		
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
