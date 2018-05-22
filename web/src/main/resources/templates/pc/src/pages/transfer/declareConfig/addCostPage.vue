<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
                <div class="fright">
                    <el-button @click="goback">返回</el-button>
                    <el-button @click="printFn" type="primary" v-if="$route.query.type==1">打印</el-button>
                    <el-button @click="save" type="primary" v-if="!readOnly">保存</el-button>
                </div>
			</div>
			<div class="jdy-table jdy-table-padding printAddCostPage" id="ptintHtml">
                <img src="../../../assets/images/favicon.png" alt="" class="imgAddCost">
                <table cellspacing="0" cellpadding="0" class="table-custom">
                    <!-- <div> -->
                        <tr>
                            <th class="proTitle">产品名称</th>
                            <td colspan="6">
                                {{productCostingTitle.productName}}
                            </td>
                        </tr>
                        <tr>
                            <th class="sec">费用类别</th>
                            <th class="sec">项目</th>
                            <th class="sec" colspan="4">价格明细（RMB）</th>
                            <th class="sec">报价说明</th>           
                        </tr>
                        <tr>
                            <th class="proTitle">核算人数</th>
                            <td colspan="5">
                                <el-input placeholder="输入人数" v-model="productCostingTitle.peopleNum" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{productCostingTitle.peopleNum}}</span>
                            </td> 
                            <td>
                                <el-input placeholder="输入说明" v-model="productCostingTitle.peopleNumExplain" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{productCostingTitle.peopleNumExplain}}</span>
                            </td>                  
                        </tr>
                        <tr>
                            <th class="proTitle">领队/全陪是否免</th>
                            <td colspan="5">
                                <el-radio class="radio" :label="1" v-model="productCostingTitle.isExempt" v-if="!readOnly">是</el-radio>
                                <el-radio class="radio" :label="0" v-model="productCostingTitle.isExempt" v-if="!readOnly">否</el-radio>                            
                                <span v-if="readOnly">{{productCostingTitle.isExempt?"是":"否"}}</span>
                            </td>  
                            <td>
                                <el-input placeholder="输入说明" v-model="productCostingTitle.isExemptExplain" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{productCostingTitle.isExemptExplain}}</span>
                            </td>                      
                        </tr>
                        <tr>
                            <th class="proTitle">价格适用期</th>
                            <td colspan="5">
                                <el-date-picker :disabled="readOnly" type="daterange" placeholder="选择日期范围" v-model="datePicker" @change="dateRangeChange">
                                </el-date-picker>                          
                            </td>  
                            <td>
                            </td>                      
                        </tr>
                    <!-- </div> -->
                    <!-- 需要遍历 表子结构 begin-->
                    <tbody :key="iIndex" v-for="(item,iIndex) in tableData" >
                        <tr @click="getIndex(iIndex)">
                            <th>
                                <!-- <el-input-number  v-if="!readOnly" size="small" v-model="item.listSize" :min="0" @change="inputChange" :idx="iIndex"></el-input-number> -->
                                <el-button-group v-if="!readOnly">
                                    <el-button @click="inputdesc">-</el-button>
                                    <el-button @click="inputadd">+</el-button>
                                </el-button-group>                                
                            </th>
                            <th class="sec">项目</th>
                            <th class="sec">数量</th>
                            <th class="sec">单位（人/团）</th>
                            <th class="sec">单价</th>  
                            <th class="sec">小计</th> 
                            <th class="sec">备注说明</th>                    
                        </tr>
                        <tr>
                            <th :rowspan="item.listSize+3" v-if="item.categoryId!=50" class="proTitle">
                                {{item.categoryName}}
                            </th> 
                            <th :rowspan="item.listSize+2" v-if="item.categoryId==50" class="proTitle">
                                {{item.categoryName}}
                            </th> 
                        </tr>      
                        <tr :key="tindex" v-for="(tdata,tindex) in item.productCostingCategoryDetailList">
                            <td>
                                <el-input v-model.trim="tdata.content" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{tdata.content}}</span>
                            </td>  
                            <td>
                                <el-input v-model.number="tdata.amount" @change="getTotalCell(iIndex)" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{tdata.amount}}</span>
                            </td>
                            <td>
                                <el-select v-model="tdata.unit" v-if="!readOnly">
                                    <el-option :key="1" label="人" :value="1">
                                    </el-option>                                
                                    <el-option :key="2" label="团" :value="2">
                                    </el-option>
                                </el-select>    
                                <span v-if="readOnly">{{tdata.unit!=null?(tdata.unit==1?"人":"团"):""}}</span>                     
                            </td>
                            <td>
                                <el-input v-model="tdata.unitPrice" @change="getTotalCell(iIndex)" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{tdata.unitPrice}}</span> 
                            </td>
                            <td>
                                {{tdata.amount*tdata.unitPrice |moneyTwoPoints(1)}}
                            </td>
                            <td>
                                <el-input v-model.trim="tdata.remark" v-if="!readOnly"></el-input>
                                <span v-if="readOnly">{{tdata.remark}}</span>
                            </td>                                                                                                                                                                  
                        </tr> 
                        <tr v-if="item.categoryId!=50">
                            <td class="sec" v-if="item.categoryId>=50">
                                合计{{iIndex+1}}
                            </td>
                            <td class="sec" v-if="item.categoryId<50">
                                合计{{iIndex}}
                            </td>                            
                            <td colspan="3" class="sec">
                            </td>                        
                            <td class="sec">
                                {{item.subtotal |moneyTwoPoints(1)}}
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr v-if="item.categoryId==50">
                            <th colspan="5">
                                接待部分合计（1-6项）
                            </th>                      
                            <th>
                                {{total.sum1_6 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>  
                        <tr v-if="item.categoryId==20">
                            <th colspan="5">
                                活动部分费用合计（7-9项）
                            </th>                      
                            <th>
                                {{total.sum7_9 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>  
                        <tr v-if="item.categoryId==20">
                            <th colspan="5">
                                以上费用小计（1-9项）
                            </th>                      
                            <th class="red">
                                {{total.sum1_9 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>                                                                                                        
                    </tbody>
                    <!-- 需要遍历 表子结构 end-->
                    <!-- <div> -->
                        <tr>
                            <th colspan="5" class="proTitle">
                                成本单价（人/团）
                            </th>                      
                            <th>
                                {{total.costSingle |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr> 
                        <tr>
                            <th colspan="5" class="proTitle">
                                团费总计
                            </th>                      
                            <th class="red">
                                {{total.allTotal |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>                                               
                    <!-- </div> -->
                </table>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'Hotel',
	data() {
		return {
			// 参数(杂)
			numObj:{
                list:[],
                itemindex:null
            },	
            datePicker: [
                new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1),
                new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 7)
            ], 
            // 表格头
            productCostingTitle:{
                productName:null,
                relId:this.$route.query.pid,
                type:1,
                peopleNum:null,
                peopleNumExplain:null,
                isExempt:0,
                isExemptExplain:null,
                beginTime:dateChange(1),
                endTime:dateChange(7), 
                companyId:this.$route.query.c_id               
            },
            // 表格body
            productCostingCategoryDetailList:[],
            // 表格body基础组
            DetailListCell:{
                categoryId:null,
                content:"",
                amount:null,
                unit:null,
                unitPrice:null,
                remark:""
            },           		
            tableData: [],
            // 用于合计对象
            total:{
                sum1_6:null,
                sum7_9:null,
                sum1_9:null,
                costSingle:null,
                allTotal:null
            },
            readOnly:true,
            productType:""
		}
	},
	methods: { 		
        // 读取
        getCostPage(){      
            let param={
                type:1,
                productType:this.productType,
                productId:this.$route.query.pid,
                companyId:this.$route.query.c_id
            }        
            if(this.$route.query.type==1){
                param.id=this.$route.query.id;
                this.readOnly=true;
            }else{
                this.readOnly=false
            }
			this.$http.post(api_prefix + "productCosting/queryProductCostingAllInformationById",param).then(response => {
                if(response.data.code == 0){
                    // 表格头赋值
                    let data=response.data.body;
                    this.productCostingTitle.productName=data.productName;
                    this.productCostingTitle.peopleNum=data.peopleNum;
                    this.productCostingTitle.peopleNumExplain=data.peopleNumExplain;
                    this.productCostingTitle.isExempt=Number(data.isExempt);
                    this.productCostingTitle.isExemptExplain=data.isExemptExplain;
                    this.productCostingTitle.beginTime=this.changeMusterTime(data.beginTime);
                    this.productCostingTitle.endTime=this.changeMusterTime(data.endTime);
                    this.datePicker=[this.productCostingTitle.beginTime,this.productCostingTitle.endTime]
                    // 表格body
                    this.numObj.list=[];
                    data.productCostingCategoryInformationList.forEach((item,index)=>{
                        let tempCell=JSON.parse(JSON.stringify(this.DetailListCell))
                        item.productCostingCategoryDetailList.push(tempCell);
                        if(item.categoryId!=50&&item.categoryId!=20){
                            item.listSize=item.listSize+1;
                        }
                        this.numObj.list.push(item.listSize);
                    })
                    this.tableData=data.productCostingCategoryInformationList;
                    // 用于计算合计
                    this.getTotalCell();             
                }else{
                    this.$alert(response.data.message,"温馨提示",{type: 'error'});
                }
			},response => {
				this.$alert("获取成本明细失败！","温馨提示",{type: 'error'});
			});	
        },
        // 查字典
        judgeIsNull(){
            this.readOnly=false;
            // this.getProductDetail()
            this.$http.post(api_prefix +"Dictionaries/dictList", {dGroupId: 240}).then(response => {
                if (response.body.code == 0) {
                    let data=response.body.body;
                    this.numObj.list=[];
                    data.forEach((item,index)=>{
                        console.log("名字：",item.dName,"; Id：",item.id,"; dSort：",item.dSort)
                        item.categoryName=item.dName;
                        // item.categoryId=item.id;
                        item.categoryId=item.dSort
                        item.listSize=0; 
                        item.productCostingCategoryDetailList=[];    
                        let tempCell=JSON.parse(JSON.stringify(this.DetailListCell))                     
                        item.productCostingCategoryDetailList.push(tempCell);
                        this.numObj.list.push(0);
                        item.subtotal=0;
                    })
                    this.tableData=data;
                }else{
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                }
                return true
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });
        },   

        // 保存
        save(){
            let tempList=[];
            this.tableData.forEach((item,index)=>{
                item.productCostingCategoryDetailList.forEach((itemCell,idx)=>{
                    if(itemCell.content!=""&&itemCell.amount!=null&&itemCell.unitPrice!=null){
                        itemCell.categoryId=item.categoryId;
                        tempList.push(itemCell);
                    }
                })
            });
            // 列表为空则不保存
            if(tempList.length==0){
                this.$message.info("请填写具体项目明细！");
                return 
            }
            // 核算人数只可以为数字
            // if(this.productCostingTitle.peopleNum<0){            
            //     this.$message.info("核算人数请录入正整数！");
            //     return 
            // }  
            // 核算人数为必填
            if(!this.productCostingTitle.peopleNum){
                this.$message.info("请填写核算人数！");
                return 
            }else{
                let reg = /^[1-9]\d*$/;
                if(!reg.test(this.productCostingTitle.peopleNum)){
                    this.$message.info("核算人数请录入正整数！");
                    return
                }
            }            
            // 价格适用期为必填 
            if(!this.datePicker){
                this.$message.info("请填写价格适用期！");
                return 
            }                      
            this.productCostingTitle.productType=this.productType;
            let param={
                productCostingTitle:this.productCostingTitle,
                productCostingCategoryDetailList:tempList,
            };
            this.$http.post(api_prefix +"productCosting/addProductCosting",param).then(response => {
                if(response.data.code == 0){
                    this.$message.success("保存成功！");
                    window.history.go(-1);
                    // this.$router.push({ name: 'roleManager'})
                }else{
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                }
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            }); 
        },
        inputChange(value){
            setTimeout(()=>{
                if(this.numObj.list[this.numObj.itemindex]>value){
                    this.tableData[this.numObj.itemindex].productCostingCategoryDetailList.pop();
                }else{
                    let tempCell=JSON.parse(JSON.stringify(this.DetailListCell)) 
                    this.tableData[this.numObj.itemindex].productCostingCategoryDetailList.push(tempCell)
                }
                this.numObj.list[this.numObj.itemindex]=value;
            },100)
        },
        getIndex(value){
            this.numObj.itemindex=value;
        },
        inputdesc(){
            setTimeout(()=>{
                this.tableData[this.numObj.itemindex].productCostingCategoryDetailList.pop();
                this.tableData[this.numObj.itemindex].listSize=this.tableData[this.numObj.itemindex].listSize-1
            },100)
        },                           
        inputadd(){
            setTimeout(()=>{
                let tempCell=JSON.parse(JSON.stringify(this.DetailListCell)) 
                this.tableData[this.numObj.itemindex].productCostingCategoryDetailList.push(tempCell);
                this.tableData[this.numObj.itemindex].listSize=this.tableData[this.numObj.itemindex].listSize+1
            },100)            
        },                               
        // 计算小计
        getTotalCell(index){
            let total=null;
            // 判断是批量计算总计还是单个总计
            if(!index){
                this.tableData.forEach((item,index)=>{
                    item.subtotal=0;
                    item.productCostingCategoryDetailList.forEach((itemCell,idx)=>{
                        item.subtotal+=itemCell.amount*itemCell.unitPrice
                    })
                })
            }else{
                this.tableData[index].productCostingCategoryDetailList.forEach((item,idx)=>{
                    total+=item.amount*item.unitPrice;
                })
                this.tableData[index].subtotal=total;
            }
            this.sumTotalCell(1,6);
            this.sumTotalCell(8,10);
            this.sumTotalCell(1,10);
            this.sumTotalCell(1,11);
            this.costSingleTotal();
        },
        // 计算小计合计
        sumTotalCell(startIndex,endIndex){
            let tempList=this.tableData.slice(startIndex-1,endIndex);
            let total=0;
            let sum6=0;
            tempList.forEach((item,idx)=>{
                total+=item.subtotal;
                if(item.categoryId==50){
                    sum6=item.subtotal;
                }
            })
            if(startIndex==1&&endIndex==6){
                this.total.sum1_6=total
            }else if(startIndex==8&&endIndex==10){
                this.total.sum7_9=total
            }else if(startIndex==1&&endIndex==10){
                this.total.sum1_9=total-sum6;
            }else{startIndex==1&&endIndex==11}{
                this.total.allTotal=total;
            }
        },
        // 成本单价合计
        costSingleTotal(){
            // let total=null;
            // this.tableData.forEach((item,index)=>{
            //     item.productCostingCategoryDetailList.forEach((itemIn,idx)=>{
            //         if(itemIn.unitPrice){
            //             total+=Number(itemIn.unitPrice);
            //         }
            //     })
            // })
            // this.total.costSingle=total
            // 由总价（this.total.allTotal）除以核算人数 （this.productCostingTitle.peopleNum）
            this.total.costSingle=(this.total.allTotal/this.productCostingTitle.peopleNum)
        },
        //日期切换
        dateRangeChange(value) {
            if (value) {
                let values = value.split(" - ");
                this.productCostingTitle.beginTime = values[0];
                this.productCostingTitle.endTime = values[1];
            }else{
                this.productCostingTitle.beginTime = null;
                this.productCostingTitle.endTime = null;            
            }
        }, 
        changeMusterTime(val){
            if(val){
                let datetime = new Date(val);
                let year = datetime.getFullYear();
                let month = datetime.getMonth();
                let date = datetime.getDate();

                let result = year + 
                    '-' + 
                    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                    '-' + 
                    ((date + 1) < 10 ? '0' + date : date) 
                return  result;
            }
        },                
        // 返回上一级
        goback(){
            if(this.$route.query.type==1){
                window.history.go(-1);
                return 
            }
            this.$confirm('添加成本数据未保存，是否要返回？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                window.history.go(-1);
                // this.save();
            }).catch(() => {
            });
        },  
        //打印
        printFn() {
            setTimeout(()=>{
                const printpage = document.getElementById("ptintHtml");
                jdyFn.printHtml(printpage);
            },500)
            // $("#ptintHtml").printArea(); 
        },             
	},
	mounted(){   
        this.$http.post(api_prefix + '/product/detail', { "id": this.$route.query.pid, "lineType": 0 }).then(response => {
            if (response.data.body.code == 0) {
                let resdata=response.data.body.body.product;
                this.productType=resdata.ascription==1?"2":"1";
                // 如果isNull为true,则从字典里取数据
                if(this.$route.query.isNull==true){
                    this.productCostingTitle.productName=resdata.pName; 
                    this.judgeIsNull();
                }else{
                    this.getCostPage();
                }                
            } else {
                this.$alert(response.body.message, "温馨提示", { type: 'error' });
            }
        }, response => {
            this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
        });  
        this.$nextTick(function() {
            window.addEventListener("keydown", function(evt) {
                if (!evt.ctrlKey || (evt.key !== "p" && evt.keyCode !== 80)) {
                return;
                }
                evt.preventDefault();
                that.printFn();
            });
        });              
        
	}  	
}
</script>

<style scoped>
.resources-tab{
    display:block;
}
.el-input-number .el-input__inner{
    display: none;
}
/* .printAddCostPage{
    background: url("../../../assets/images/SP_back.jpg") center center  no-repeat;
    background-size: cover;
    opacity:0.9;     
} */
.proTitle{
    width:150px;
}
.imgAddCost{
    display: none
}
@media print and (color) {
    * {
       -webkit-print-color-adjust: exact;
       print-color-adjust: exact;
    }
    .imgAddCost{
        display: block;
        position: absolute;
        width:20%;
        /* height: 20%; */
        right: 10%;
        top: 0;
        opacity: 0.6;
    }    
 }

</style>
