<template>
	<div class="jdy-content jdy-resources fleft">
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
                <span class="title">预算成本明细</span>
                <div class="fright">
                    <span>成本保底增加比例：</span>
                    <el-input style="width:100px" v-model.number="productCostingTitle2.percentage">
                        <template slot="append">%</template>
                    </el-input>
                </div>
			</div>
			<div class="jdy-table jdy-table-padding">
                <table cellspacing="0" cellpadding="0" class="table-custom">
                    <thead>
                        <tr>
                            <th style="width:120px">产品名称</th>
                            <td colspan="6">
                                {{productCostingTitle.productName}}
                            </td>
                        </tr>
                        <tr>
                            <th class="sec th1">费用类别</th>
                            <th class="sec">项目</th>
                            <th class="sec" colspan="4">价格明细（RMB）</th>
                            <th class="sec th4">报价说明</th>
                        </tr>
                        <tr>
                            <th>核算人数</th>
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
                            <th>领队/全陪是否免</th>
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
                            <th>价格适用期</th>
                            <td colspan="5">
                                <el-date-picker size="small" :disabled="readOnly" type="daterange" placeholder="选择日期范围" v-model="datePicker">
                                </el-date-picker>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </thead>
                    <!-- 需要遍历 表子结构 begin-->
                    <tbody :key="iIndex" v-for="(item,iIndex) in tableData" >
                        <tr @click="getIndex(iIndex)">
                            <th>
                                <!-- <el-input-number  v-if="!readOnly" size="small" v-model="item.listSize" :min="0" @change="inputChange" :idx="iIndex"></el-input-number> -->
                            </th>
                            <th class="sec">项目</th>
                            <th class="sec">数量</th>
                            <th class="sec th2">单位（人/团）</th>
                            <th class="sec">单价</th>
                            <th class="sec">小计</th>
                            <th class="sec">备注说明</th>
                        </tr>
                        <tr>
                            <th :rowspan="item.listSize+3" v-if="item.categoryId!=50">
                                {{item.categoryName}}
                            </th>
                            <th :rowspan="item.listSize+2" v-if="item.categoryId==50">
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
                    <tfoot>
                        <tr>
                            <th colspan="5">
                                成本单价（人/团）
                            </th>
                            <th>
                                {{total.costSingle |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="2">
                                团费总计
                            </th>
                            <th>
                                {{total.allTotal |moneyTwoPoints(1)}}
                            </th>
                            <th colspan="2">
                                保底后总计
                            </th>
                            <th class="red">
                                {{total.percentAllTotal |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                    </tfoot>
                </table>
			</div>
		</div>
		<div class="jdy-content-inner-trip">
			<div class="resources-tab">
                <span class="title">实际支出成本明细</span>
                <div class="imgdiv unpass" v-show="$route.query.status==2"></div>
                <div class="imgdiv pass" v-show="$route.query.status==1"></div>
                <div class="fright">
                    <!-- <span>成本保底增加比例：</span>
                    <el-input style="width:100px" v-model.number="productCostingTitle2.percentage">
                        <template slot="append">%</template>
                    </el-input>                     -->
                    <el-button @click="confirmCost" type="primary" class="ml10" v-show="$route.query.flag==2">财务审核</el-button>
                    <el-button @click="save" type="primary" class="ml10" v-show="$route.query.flag==1">提交审核</el-button>
                    <el-button type="primary" @click="changeHref">导出成本核算表</el-button>
                    <el-button @click="goback">返回</el-button>
                </div>
			</div>
			<div class="jdy-table jdy-table-padding">
                <table cellspacing="0" cellpadding="0" class="table-custom">
                    <thead>
                        <tr>
                            <th style="width:120px">产品名称</th>
                            <td colspan="6">
                                {{productCostingTitle2.productName}}
                            </td>
                        </tr>
                        <tr>
                            <th class="sec th1">费用类别</th>
                            <th class="sec th2">项目</th>
                            <th class="sec" colspan="4">价格明细（RMB）</th>
                            <th class="sec th4">报价说明</th>
                        </tr>
                        <tr>
                            <th>核算人数</th>
                            <td colspan="5">
                                <el-input size="small" placeholder="输入人数" v-model="productCostingTitle2.peopleNum" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{productCostingTitle2.peopleNum}}</span>
                            </td>
                            <td>
                                <el-input size="small" placeholder="输入说明" v-model="productCostingTitle2.peopleNumExplain" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{productCostingTitle2.peopleNumExplain}}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>领队/全陪是否免</th>
                            <td colspan="5">
                                <el-radio size="small" class="radio" :label="1" v-model="productCostingTitle2.isExempt" v-if="!readOnly2">是</el-radio>
                                <el-radio size="small" class="radio" :label="0" v-model="productCostingTitle2.isExempt" v-if="!readOnly2">否</el-radio>
                                <span v-if="readOnly2">{{productCostingTitle2.isExempt?"是":"否"}}</span>
                            </td>
                            <td>
                                <el-input size="small" placeholder="输入说明" v-model="productCostingTitle2.isExemptExplain" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{productCostingTitle2.isExemptExplain}}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>价格适用期</th>
                            <td colspan="5">
                                <el-date-picker size="small" :disabled="readOnly2" type="daterange" placeholder="选择日期范围" v-model="datePicker2" @change="dateRangeChange">
                                </el-date-picker>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </thead>
                    <!-- 需要遍历 表子结构 begin-->
                    <tbody :key="iIndex" v-for="(item,iIndex) in tableData2">
                        <tr>
                            <th @click="getIndex(iIndex)">
                                <!-- <el-input-number  v-if="!readOnly2" size="small" v-model="item.listSize" :min="0" @change="inputChange" :idx="iIndex"></el-input-number> -->
                                <el-button-group>
                                    <el-button @click="inputdesc" size="small" v-show="!readOnly2">-</el-button>
                                    <el-button @click="inputadd" size="small" v-show="!readOnly2">+</el-button>
                                </el-button-group>
                            </th>
                            <th class="sec">项目</th>
                            <th class="sec">数量</th>
                            <th class="sec th2">单位（人/团）</th>
                            <th class="sec">单价</th>
                            <th class="sec">小计</th>
                            <th class="sec">备注说明</th>
                        </tr>
                        <tr>
                            <th :rowspan="item.listSize+3" v-if="item.categoryId!=50">
                                {{item.categoryName}}
                            </th>
                            <th :rowspan="item.listSize+2" v-if="item.categoryId==50">
                                {{item.categoryName}}
                            </th>
                        </tr>
                        <tr :key="tindex" v-for="(tdata,tindex) in item.productCostingCategoryDetailList">
                            <td>
                                <el-input size="small" v-model.trim="tdata.content" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{tdata.content}}</span>
                            </td>
                            <td>
                                <el-input size="small" v-model.number="tdata.amount" @change="getTotalCell(iIndex)" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{tdata.amount}}</span>
                            </td>
                            <td>
                                <el-select size="small" v-model="tdata.unit" v-if="!readOnly2">
                                    <el-option :key="1" label="人" :value="1">
                                    </el-option>
                                    <el-option :key="2" label="团" :value="2">
                                    </el-option>
                                </el-select>
                                <span v-if="readOnly2">{{tdata.unit!=null?(tdata.unit==1?"人":"团"):""}}</span>
                            </td>
                            <td>
                                <el-input size="small" v-model="tdata.unitPrice" @change="getTotalCell(iIndex)" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{tdata.unitPrice}}</span>
                            </td>
                            <td>
                                {{tdata.amount*tdata.unitPrice |moneyTwoPoints(1)}}
                            </td>
                            <td>
                                <el-input size="small" v-model.trim="tdata.remark" v-if="!readOnly2"></el-input>
                                <span v-if="readOnly2">{{tdata.remark}}</span>
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
                                {{total2.sum1_6 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                        <tr v-if="item.categoryId==20">
                            <th colspan="5">
                                活动部分费用合计（7-9项）
                            </th>
                            <th>
                                {{total2.sum7_9 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                        <tr v-if="item.categoryId==20">
                            <th colspan="5">
                                以上费用小计（1-9项）
                            </th>
                            <th class="red">
                                {{total2.sum1_9 |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                    </tbody>
                    <!-- 需要遍历 表子结构 end-->
                    <tfoot>
                        <tr>
                            <th colspan="5">
                                成本单价（人/团）
                            </th>
                            <th>
                                {{total2.costSingle |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="5">
                                团费总计
                            </th>
                            <th class="red">
                                {{total2.allTotal |moneyTwoPoints(1)}}
                            </th>
                            <th>
                            </th>
                        </tr>
                    </tfoot>
                </table>
			</div>
            <!-- 审核合同 -->
            <jdy-alert title="核算成本审核" @closeAlert="closeAlert" v-if="costFlag" class="alertCityList showtfcity" style="width:600px;height:394px">
                <div class="alertHead">
                    <h3>核算成本审核是否通过？</h3>
                    <p>提醒：审核通过后将不可修改，团期状态变成已结团</p>
                    <span>
                        <el-radio class="radio" v-model="costConfirm.status" label="1" :value="1">通过</el-radio>
                        <el-radio class="radio" v-model="costConfirm.status" label="2" :value="2">不通过</el-radio>
                    </span>
                    <el-input v-model="costConfirm.remark" v-if="costConfirm.status == 2" placeholder="请输入不通过的原因" :max="200"></el-input>
                </div>
                <div class="alertfoot1 clearfix">
                    <el-button class="fright mt10 mr10 btnInTab" type="primary" @click="confirmCostSave">提交</el-button>
                </div>
            </jdy-alert>
		</div>
	</div>
</template>

<script>
import jdyAlert from "@/components/Alert";
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
            // 表格测试数据
            testnum:123123,
            p1_num:5,
            downLoadHref: '',

            // 表2
			// 参数(杂)
			numObj:{
                list:[],
                itemindex:null
            },
            datePicker: [
                new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1),
                new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 7)
            ],
           datePicker2: [
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
                beginTime:null,
                endTime:null,
                percentAllTotal:null,
            },
            productCostingTitle2:{
                productName:null,
                relId:this.$route.query.scheduleId,
                type:2,
                peopleNum:null,
                peopleNumExplain:null,
                isExempt:0,
                isExemptExplain:null,
                percentage:0,
                beginTime:null,
                endTime:null,
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
            tableData2: [],
            // 用于合计对象
            total:{
                sum1_6:null,
                sum7_9:null,
                sum1_9:null,
                costSingle:null,
                percentAllTotal:null,
                allTotal:null
            },
            total2:{
                sum1_6:null,
                sum7_9:null,
                sum1_9:null,
                costSingle:null,
                allTotal:null
            },
            readOnly:true,
            readOnly2:false,
            productType:"",
            //
            costConfirm:{
                id:'',
                status: null,
                remark:'',
            },
            costFlag:false,
            costId:'',
		}
    },
    components: {
    jdyAlert
    },
	methods: {
        changeHref(){
        var scheduleId = this.$route.query.scheduleId
            this.downLoadHref = api_prefix + 'productCost/exportProductCostAccountingExcel/'+ scheduleId + '/2'
            console.log(this.downLoadHref,'downLoadHref')
        location.href = this.downLoadHref;
        },
        /**
         * @description 成本核算页面描述
         * 成本预算表(左)
         * pid
         * type=1
         *
         * 成本核算表（右）
         * sid
         * type=2
        */
        // 读取
        getCostPage(param){
			this.$http.post(api_prefix + "/productCosting/queryProductCostingAllInformationById",param).then(response => {
                if(response.data.code == 0){
                    // 表格头赋值
                    let data=response.data.body;
                    this.costId = data.id;
                    console.log(this.costId,'this.costId')
                    if(param.type==3){
                        this.productCostingTitle.productName=data.productName;
                        this.productCostingTitle.peopleNum=data.peopleNum;
                        this.productCostingTitle.peopleNumExplain=data.peopleNumExplain;
                        this.productCostingTitle.isExempt=Number(data.isExempt);
                        this.productCostingTitle.isExemptExplain=data.isExemptExplain;
                        // 百分比
                        // if(data.percentAllTotal!=null){
                        //     this.productCostingTitle.percentAllTotal=data.percentAllTotal;
                        // }
                        this.productCostingTitle.beginTime=this.changeMusterTime(data.beginTime);
                        this.productCostingTitle.endTime=this.changeMusterTime(data.endTime);
                        this.datePicker=[this.productCostingTitle.beginTime,this.productCostingTitle.endTime]
                    }else{
                        this.productCostingTitle2.productName=data.productName;
                        this.productCostingTitle2.peopleNum=data.peopleNum;
                        this.productCostingTitle2.peopleNumExplain=data.peopleNumExplain;
                        this.productCostingTitle2.percentage=data.percentage;
                        this.productCostingTitle2.isExempt=Number(data.isExempt);
                        this.productCostingTitle2.isExemptExplain=data.isExemptExplain;
                        this.productCostingTitle2.beginTime=this.changeMusterTime(data.beginTime);
                        this.productCostingTitle2.endTime=this.changeMusterTime(data.endTime);
                        this.datePicker2=[this.productCostingTitle2.beginTime,this.productCostingTitle2.endTime]
                    }
                    // 表格body
                    this.numObj.list=[];
                    data.productCostingCategoryInformationList.forEach((item,index)=>{
                        let tempCell=JSON.parse(JSON.stringify(this.DetailListCell))
                        item.productCostingCategoryDetailList.push(tempCell);
                        if(item.categoryId!=50&&item.categoryId!=20){
                            item.listSize=item.listSize+1;
                        }
                        if(param.type==2){
                            this.numObj.list.push(item.listSize);
                        }
                    })
                    if(param.type==3){
                        this.tableData=JSON.parse(JSON.stringify(data.productCostingCategoryInformationList));
                    }else{
                        this.tableData2=JSON.parse(JSON.stringify(data.productCostingCategoryInformationList));
                    }
                    // 用于计算合计
                    this.getTotalCell();
                }else{
                    // 如果没数据，插入空表格
                    this.judgeIsNull(param.type)
                }
			},response => {
				this.$alert(response.data.message,"温馨提示",{type: 'error'});
			});
        },
        judgeIsNull(flag){
            // this.getProductDetail()
            this.$http.post(api_prefix +"Dictionaries/dictList", {dGroupId: 240}).then(response => {
                if (response.body.code == 0) {
                    let data=response.body.body;
                    this.numObj.list=[];
                    data.forEach((item,index)=>{
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
                    if(flag==3){
                        this.tableData=JSON.parse(JSON.stringify(data));
                    }else{
                        this.tableData2=JSON.parse(JSON.stringify(data));
                    }
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
            this.tableData2.forEach((item,index)=>{
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
            this.productCostingTitle2.productType=this.productType
            let param={
                productCostingTitle:this.productCostingTitle2,
                productCostingCategoryDetailList:tempList
            };
            this.$http.post(api_prefix +"productCosting/addProductCosting",param).then(response => {
                if(response.data.code == 0){
                    this.$message.success("保存成功！");
                    let param={
                        type:2,
                        productId:this.$route.query.productId,
                        scheduleId:this.$route.query.scheduleId,
                        productType:this.productType,
                    }
                    this.getCostPage(param);
                    param=JSON.parse(JSON.stringify(param));
                    param.type=2;
                    this.getCostPage(param);
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
                    this.tableData2[this.numObj.itemindex].productCostingCategoryDetailList.pop();
                }else{
                    let tempCell=JSON.parse(JSON.stringify(this.DetailListCell))
                    this.tableData2[this.numObj.itemindex].productCostingCategoryDetailList.push(tempCell)
                }
                this.numObj.list[this.numObj.itemindex]=value;
            },100)
        },
        getIndex(value){
            this.numObj.itemindex=value;
        },
        inputdesc(){
            setTimeout(()=>{
                this.tableData2[this.numObj.itemindex].productCostingCategoryDetailList.pop();
                this.tableData2[this.numObj.itemindex].listSize=this.tableData2[this.numObj.itemindex].listSize-1
            },100)
        },
        inputadd(){
            setTimeout(()=>{
                let tempCell=JSON.parse(JSON.stringify(this.DetailListCell))
                this.tableData2[this.numObj.itemindex].productCostingCategoryDetailList.push(tempCell);
                this.tableData2[this.numObj.itemindex].listSize=this.tableData2[this.numObj.itemindex].listSize+1
            },100)
        },
        // 计算小计
        getTotalCell(index){
            let total=null;
            // 判断是批量计算总计还是单个总计
            if(!index){
                this.tableData2.forEach((item,index)=>{
                    item.subtotal=0;
                    item.productCostingCategoryDetailList.forEach((itemCell,idx)=>{
                        item.subtotal+=itemCell.amount*itemCell.unitPrice
                    })
                })
            }else{
                this.tableData2[index].productCostingCategoryDetailList.forEach((item,idx)=>{
                    total+=item.amount*item.unitPrice;
                })
                this.tableData2[index].subtotal=total;
            }
            let total2=null;
            if(!index){
                this.tableData.forEach((item,index)=>{
                    item.subtotal=0;
                    item.productCostingCategoryDetailList.forEach((itemCell,idx)=>{
                        item.subtotal+=itemCell.amount*itemCell.unitPrice
                    })
                })
            }else{
                this.tableData[index].productCostingCategoryDetailList.forEach((item,idx)=>{
                    total2+=item.amount*item.unitPrice;
                })
                this.tableData[index].subtotal=total2;
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
                this.total.sum1_9=total-sum6
            }else{startIndex==1&&endIndex==11}{
                this.total.allTotal=total;
                if(this.productCostingTitle2.percentage!=null){
                    this.total.percentAllTotal=Number(total)*Number(this.productCostingTitle2.percentage)*0.01;
                    this.total.percentAllTotal=this.total.percentAllTotal+total;
                }else{
                    this.total.percentAllTotal=total;
                }
            }


            let tempList2=this.tableData2.slice(startIndex-1,endIndex);
            let total2=0;
            let sum62=0
            tempList2.forEach((item,idx)=>{
                total2+=item.subtotal;
                if(item.categoryId==50){
                    sum62=item.subtotal;
                }
            })
            if(startIndex==1&&endIndex==6){
                this.total2.sum1_6=total2
            }else if(startIndex==8&&endIndex==10){
                this.total2.sum7_9=total2
            }else if(startIndex==1&&endIndex==10){
                this.total2.sum1_9=total2-sum62
            }else{startIndex==1&&endIndex==11}{
                this.total2.allTotal=total2
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

            // let total2=null;
            // this.tableData2.forEach((item,index)=>{
            //     item.productCostingCategoryDetailList.forEach((itemIn,idx)=>{
            //         if(itemIn.unitPrice){
            //             total2+=Number(itemIn.unitPrice);
            //         }
            //     })
            // })
            // this.total2.costSingle=total2
            this.total.costSingle=(this.total.percentAllTotal/this.productCostingTitle.peopleNum)
            this.total2.costSingle=(this.total2.allTotal/this.productCostingTitle2.peopleNum)
        },
        //日期切换
        dateRangeChange(value) {
            if (value) {
                let values = value.split(" - ");
                this.productCostingTitle2.beginTime = values[0];
                this.productCostingTitle2.endTime = values[1];
            }else{
                this.productCostingTitle2.beginTime = null;
                this.productCostingTitle2.endTime = null;
            }
            // console.log(this.productCostingTitle2.beginTime,this.productCostingTitle2.endTime)
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
        //
        confirmCost(){
            this.costFlag = true;
            this.$nextTick(function() {
                jdyFn.setAlertStyle("showtfcity");
            });
        },
        confirmCostSave(){
            console.log(this.costConfirm.status,'costConfirm.radio')
            if(this.costConfirm.status == null){
                this.$message.error("请选择审核结果！");
            }else{
                if(this.costConfirm.status == 2 && this.costConfirm.remark == ''){
                    this.$message.error("请填写不通过的原因！");
                }else{
                    this.$message.success("保存成功");
                    this.costConfirm.id = this.costId;
                    console.log(this.costConfirm.id,'this.costId')
                     this.$http.post(api_prefix + '/productCosting/modifyProductCostingTitle', this.costConfirm).then(response => {
                        if (response.data.code == 0) {
                            this.$message.success("审核成功,即将跳转");
                            setTimeout(() => {
                                this.$router.push({ name:'groupManage'})
                                $(".alertbgg").remove();
                            }, 500);
                        } else {
                            this.$alert(response.body.message, "温馨提示", { type: 'error' });
                        }
                    }, response => {
                        this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
                    });
                }
            }
        },
        closeAlert() {
            this.costFlag = false;
            this.costConfirm.status = null;
            this.costConfirm.remark = '';
            this.costConfirm.id = '';
            $(".alertbgg").remove();
        },
	},
	mounted(){
        this.$http.post(api_prefix + '/product/detail', { "id": this.$route.query.productId, "lineType": 0 }).then(response => {
            if (response.data.body.code == 0) {
                let resdata=response.data.body.body.product;
                this.productCostingTitle2.productName=resdata.pName;
                this.productType=resdata.ascription==1?"2":"1";
                let param={
                    type:3,
                    productId:this.$route.query.productId,
                    scheduleId:this.$route.query.scheduleId,
                    productType:this.productType,
                    status:0
                }
                this.getCostPage(param);
                param=JSON.parse(JSON.stringify(param));
                param.type=2;
                this.getCostPage(param);
            } else {
                this.$alert(response.body.message, "温馨提示", { type: 'error' });
            }
        }, response => {
            this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
        });
        if(this.$route.query.flag===0 || this.$route.query.flag===2){
            this.readOnly2=true;
        }
	}
}
</script>

<style scoped lang="less">
.resources-tab{
    display:block;
}
.jdy-content-inner-trip{
    width:50%;
    float: left;
}
.resources-tab{
    border: 1px solid #d7dfe3;
    line-height: 40px;
    span.title{
        font-size: 16px;
    }
}
.table-custom th, .table-custom td{
    padding: 0px
}
.alertHead {
  width: 100%;
  height: 250px;
  text-align: center;
  padding: 20px;
}
.alertHead h3{
    font-size: 24px;
    margin-bottom: 25px;
    margin-top: 35px;
    margin-left: -105px;
}
.alertHead p {
    font-size: 16px;
    color: #999;
}
.alertHead span{
    display: inline-block;
    width: 300px;
    margin-top: 40px;
    margin-bottom: 30px;
}
.alertHead span label:first-child{
    margin-left: -40px;
}
.alertHead span label:nth-child(2){
    margin-left: 200px;
}
.alertHead .el-input{
    width: 61%;
}
.imgdiv{
    width: 300px;
    height: 300px;
    position: absolute;
    z-index: 99;
    top: 0;
}
</style>
