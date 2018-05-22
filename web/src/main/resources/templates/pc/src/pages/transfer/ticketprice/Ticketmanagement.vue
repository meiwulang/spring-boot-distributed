<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner">
            <el-form :model="tickForm2" :rules="rules" ref="tickForm2" class="demo-form-inline" label-width="150px">
                <div class="jdy-tab">
                    <a style="border:0;">{{productDetail.pName}}
                        <span></span>
                    </a>
                    <el-button class="fright mt10" @click="goback('Ticketprice')">返回</el-button>
                    <el-button type="primary" @click="onSubmit()" class="fright mt10 mr10" :disabled="btnFlag">保存</el-button>
                </div>
                <div class="tripbox clearfix  relative mt60">
                    <div class="clearfix p10 border pb30">
                        <div class="ticketmanage-title tc"><span>--套票信息--</span></div>
                        <el-row class="mt30">
                            <el-col :span="8">
                                <el-form-item label="票价类型:" prop="tType">
                                    <el-select v-model="tickForm2.tType" placeholder="请选择" :disabled="true" class="inputGeneral">
                                        <el-option :key="0" label="单票" :value="0">
                                        </el-option>
                                        <el-option :key="1" label="套票" :value="1">
                                        </el-option>
                                    </el-select>                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="票价名称:" prop="tName">
                                    <el-input v-model="tickForm2.tName" class="inputGeneral"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="票价类目:">
                                    <el-select v-model="tickForm2.tCategory" placeholder="请选择" class="inputGeneral">
                                        <!--<el-option :key="0" label="票价类目0" value="0">
                                        </el-option>
                                        <el-option :key="1" label="票价类目1" value="1">
                                        </el-option>-->
                                        <el-option v-for="(item,index) in baseCategory" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                        <!--<el-option v-for="(item,index) in baseCategory" :key="item.name" :value="index" :label="item.name"></el-option>-->

                                    </el-select>                                    
                                </el-form-item>
                            </el-col>
                        </el-row>   
                        <el-row>
                            <el-col :span="8">
                                <!-- <el-form-item label="门市价:" prop="tMarketPrice">
                                    <el-input-number v-model="tickForm2.tMarketPrice" :min="0" class="inputGeneral"></el-input-number>
                                </el-form-item> -->
                                <el-form-item label="门市价:" prop="tMarketPrice" class="redstar">
                                    <el-input class="inputGeneral" v-model="tickForm2.tMarketPrice"></el-input>
                                </el-form-item>                                
                            </el-col>
                            <!-- <el-col :span="8">
                                <el-form-item label="同行价:" prop="tPeerPrice">
                                    <el-input-number v-model="tickForm2.tPeerPrice" :min="0"></el-input-number>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="8">
                                <el-form-item label="库存量:">
                                    <el-input-number v-model="tickForm2.tStock" :min="-1" class="inputGeneral"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
    
                        <el-row>
                            <el-form-item label="周几有效:" prop="tEffectWeek">
                                <el-checkbox v-model="checkWeekAll" @change="handleCheckAllWeek" id="checkAll">全选</el-checkbox>
                                <el-checkbox-group v-model="tickForm2.tEffectWeek" @change="getSelectWeeks">
                                    <el-checkbox label="周一" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周二" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周三" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周四" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周五" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周六" name="tEffectWeek"></el-checkbox>
                                    <el-checkbox label="周日" name="tEffectWeek"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="投放市场:" id="tfCity">
                                <!--<el-input v-model="tickForm2.sets"></el-input>-->
                                <div class="tfcity relative">
                                    <div class="el-input">
                                        <input autocomplete="off" v-model="selectCityArr.name" placeholder="请选择城市" type="text" class="el-input__inner" @click="showtfCity">
                                    </div>
                                    <!-- v-if="showtfCityFlag" em-->
                                </div>                                
                            </el-form-item>
                        </el-row>
    
                        <el-row>
                            <el-form-item label="票价简介:">
                                <el-input v-model="tickForm2.tIntroduction" type="textarea"></el-input>
                            </el-form-item>
                        </el-row>
                    </div>
                    <div class="clarfix alertAddProduct2-table pb30 mt60">                       
                        <!-- <div class="alertAddProduct2-tablebtn">
                                <el-button class=" mt10 ml20" @click="addSingleTicket">添加单票</el-button>
                                <el-button class=" mt10 " @click="removeSingleTicket">移除单票</el-button>
                            </div> -->
                        <div class="p10 border pb30">
                             <div class="ticketmanage-title tc"><span>--选择单票--</span></div>
                            <el-table ref="multipleTable" :data="tableData3" border tooltip-effect="dark" style="width: 100%" class="mt20" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column label="状态" width="80">
                                    <template scope="scope">{{ scope.row.tStatus==0?"有效":"无效" }}</template>
                                </el-table-column>                                
                                <el-table-column label="票价名称" width="">
                                    <template scope="scope">{{ scope.row.tName }}</template>
                                </el-table-column>
                                <el-table-column label="占座数量" width="">
                                    <template scope="scope">
                                        <el-input-number v-model="scope.row.sets" :min="0"></el-input-number>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="门市价" width="100">
                                    <template scope="scope">{{ scope.row.tMarketPrice }}</template>
                                </el-table-column>
                                <!-- <el-table-column prop="" label="同行价" width="100">
                                    <template scope="scope">{{ scope.row.tPeerPrice }}</template>
                                </el-table-column> -->
                                <el-table-column prop="" label="周几有效" width="250">
                                    <template scope="scope">{{ scope.row.tEffectWeek|filterEffectWeek }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="限制类型" width="">
                                    <template scope="scope">{{ scope.row.tLimitType|filterLimitType }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="限制条件" width="">
                                    <template scope="scope">{{ scope.row.tLimitCondition|filterLimitCondition }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="编辑时间" width="">
                                    <template scope="scope">{{ scope.row.updateTime?scope.row.updateTime:scope.row.createTime |filterTimeFormat }}</template>
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
            </el-form>
        </div>
        <!--投放城市-->
        <jdy-alert title="投放城市选择" @closeAlert="closecfCity" v-if="showcfCityFlag" class="alertCityList showtfcity">
            <div class="showtfcityaa">
                <div class="showtfcityaa-scroll">
                    <div class="showtfcityaa-i">
                        <div class="showtfcityaaa" v-for="(value,key) in proviceArr" :key="value">
                            <div class="showtfcityaaa-head plr10 clearfix">
                                <span>{{key}}</span>
                                <el-button  class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                                <el-button  class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
                            </div>
                            <div class="showtfcityaaa-content plr10 clearfix">
                                <span v-for="ccitem in value" :key="ccitem.id" :dataId="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':selectCityArr.name.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>                            
                            </div>
                            <div class="hide">
                                <span v-for="ccitem in value" :key="ccitem.id" class="taCountry" v-show="false">{{ccitem.type}}</span>
                                <span v-for="ccitem in value" :key="ccitem.id" class="taProvince" v-show="false">{{ccitem.pName}}</span>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alertfoot1 clearfix">
                <el-button type="primary" class="fright mt10 mr10" @click="closecfCity">取消</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="removeAll">刷新</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="selectAllAll">全选</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="saveCC">保存</el-button>
            </div>
        </jdy-alert>         
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import {validateMoney} from '@/assets/js/validate';
export default {
    name: "",
    data() {
        return {
            btnFlag:false,
            /*票价添加*/
            tickForm2: {
                "userId": 123,
                "tCompanyId": 123,
                "tProductId": this.$route.query.id,
                "tTicketType": 1,
                "tType": 1, //票价类型
                "tName": "套票",//票价名称
                "tCategory": "",//票价类目
                "tMarketPrice": 0,//门市价
                "tPeerPrice": 0,//同行价
                "tPriceAdd": 0,//补房差
                "tPriceReduce": 0,//退房差
                "tEffectWeek": [],//周几有效
                "ticketAreaList": [],//投放市场
                "tIntroduction": "",//票价简介
                tStock:-1, //库存量
                "sets":[]
            },
            /*票价类目(基础)*/ 
            baseCategory:[],               
            /*投放城市相关*/
            selectCityArr:{id:[],name:[]},
            showcfCityFlag:false,
            proviceArr:{},
            submitArr:[], //用于表单提交            
            /*校验*/
            rules: {
                tType: [{type: 'number', required: true, message: '请输入票价类型', trigger: 'change' }],
                tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' },
                        {  max: 20, message: '长度在20个字符以内', trigger: 'blur' }],
                tEffectWeek: [{ type: 'array', required: true, message: '请选择周几有效', trigger: 'change' }],
                // tMarketPrice: [{type: 'number', required: true, message: '请输入门市价', trigger: 'blur' }],
                tMarketPrice:[{ validator: validateMoney, trigger: 'blur' }],
                tPeerPrice: [{ type: 'number',required: true, message: '请输入同行价', trigger: 'blur' }],                
                // ticketAreaList: [{}]
            },
            /*获取单票列表数据*/
            tableData3: [],
            /*产品详情*/ 
            productDetail:{},            
            // 查询单票
            searchParams: {
                "currPage": 1,
                "pageSize": 10,
                // "tCompanyId": 195,
                "tName": "",
                "tProductId": this.$route.query.id,
                // "tStatus": 0,
                "tTicketType": 0,
                // "userId": 0
            },    
            currentPage: 1, //列表当前所在页,
            pageSize: 10,   
            tableDataTotal: 0,  
            //被选中单票   
            singleLists:[],
            /*用于星期全选*/ 
            checkWeekAll:false,            
        }
    },    
    methods: {
        goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ name: url,query:{id: this.$route.query.id}})
            }).catch(() => {

            });
        },
        // 获取产品详情
        getProductDetail(){
            let httpdata={
                id: this.$route.query.id,
                lineType: 0
            }
            this.$http.post(api_prefix+'product/detail',httpdata).then(response => {
                if(response.data.code==0){
                    this.productDetail=response.data.body.body.product
                }else{
                    this.$alert(response.data.message);
                }
            }, response => {
                console.log('获取产品详情出错了');
            });      
        },        
        // 编辑页面
        toEdit(){
            if(this.$route.query.type==1){
                this.$http.get(api_prefix + 'ticket/get/'+this.$route.query.priceId+"/"+this.$route.query.type).then(response => {
                    if(response.data.code == 0){  
                        let data=response.data.body                    
                        this.tickForm2=data;
                        // 单票列表座位数量
                        data.sets.forEach((idlist)=>{
                            // list中找到对应的元素
                            let tempObj=this.tableData3.filter((datas)=>{
                                return idlist.tsSingleId==datas.id
                            });
                            // 对应的元素赋座位值
                            console.log("临时",tempObj)
                            if(tempObj.length!=0){
                                tempObj[0].sets=idlist.tsSeats;
                                this.$refs.multipleTable.toggleRowSelection(tempObj[0]);
                            };
                        });  
                        this.tableDataTotal = data.singleList.length;                 
                        this.formatEdit();
                    }else{
                        this.$alert("获取当前编辑数据失败！");
                    }
                },response=>{
                    console.log("获取当前编辑数据失败！");
                });                
            }
        },    
        // 编辑页面数据格式化
        formatEdit(){
            this.checkWeekAll=(this.tickForm2.tEffectWeek==1111111)?true:false;
            this.tickForm2.tEffectWeek=this.num2week(this.tickForm2.tEffectWeek);
            this.tickForm2.ticketAreaList.forEach((data)=>{
                this.selectCityArr.name.push(data.taCity);
            });
            this.submitArr=this.tickForm2.ticketAreaList;
            let temp=this.baseCategory.filter(data=>{
                return this.tickForm2.tCategory==data.id
            })
            this.tickForm2.tCategory= temp[0].name;                 
        },  
        // 星期全选相关
        handleCheckAllWeek(event){
            if(event.target.checked){
                this.tickForm2.tEffectWeek=['周一','周二','周三','周四','周五','周六','周日'];
            }else{
                this.tickForm2.tEffectWeek=[];
            }
        },
        // 星期改变事件
        getSelectWeeks(value){
            this.checkWeekAll=(value.length==7)?true:false;
        },                         
        // 星期格式化
        week2num(){
            let weeks=0;
            for(let i=0;i<this.tickForm2.tEffectWeek.length;i++){
                switch(this.tickForm2.tEffectWeek[i]){
                    case "周一":
                        weeks+=1000000;
                        break;
                    case "周二":
                        weeks+=100000;
                        break;
                    case "周三":
                        weeks+=10000;
                        break;
                    case "周四":
                        weeks+=1000;
                        break;
                    case "周五":
                        weeks+=100;
                        break;
                    case "周六":
                        weeks+=10;
                        break;
                    case "周日":
                        weeks+=1;
                        break;                                                                                  
                }
            }   
            return (Array(7).join('0') + weeks).slice(-7);      
        },   
        // 星期格式化
        num2week(value){
            if(value=="0000000"){
                return "未设置"
            }else{
                let weekArray=[];
                let week_lib={
                    0:"一",
                    1:"二",
                    2:"三",
                    3:"四",
                    4:"五",
                    5:"六",
                    6:"日"
                };
                let weeklist=value.split("");
                for(let k=0;k<weeklist.length;k++){
                    weeklist[k]==1&&weekArray.push("周"+week_lib[k])
                };
                return weekArray   
            }
        },         
        //获取单票列表
        fareTableData() {
            this.$http.post(api_prefix + 'ticket/list', this.searchParams).then(response => {
                let data = response.data.body;
                // data.list中增加座位数量字段
                data.list.forEach(function(data){
                    data.sets=0;
                    if(data.tLimitType==2){
                        data.tLimitCondition=data.tLimitCondition=="0"?"男":"女"
                    }                
                })
                // 如果限制
                this.tableData3 = data.list;
                this.tableDataTotal = data.total;
            }, response => {
                console.log('获取单票列表出错了');
            });
        },     
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            if (val) {
                this.searchParams.currPage = val;
                this.searchParams.pageNum = val;
                this.fareTableData();
            }
        },                 
        // 先做新增，然后做编辑
        handleSelectionChange(val) {
            console.log(this.singleLists);
            this.singleLists=val;
        },
        // 获取票价类目
        getCategory(){
            this.$http.post(api_prefix + '/Dictionaries/dictList',{dGroupId: 111}).then(response => {
                if(response.data.code == 0){
                    let lists=response.body.body;
                    lists.forEach(data=>{
                        this.baseCategory.push({id:data.id,name:data.dName});
                    });
                }else{
                    this.$alert("获取票价类目失败");
                }
            },response=>{
                console.log("获取票价类目失败！")
            });
        },    
        /*投放城市相关*/
        showtfCity(){ // 显示投放城市弹出框
            this.showcfCityFlag = true;
            this.$nextTick(function(){
                jdyFn.setAlertStyle('showtfcity');
                jdyFn.selectCity2();
            });
        },
        closecfCity(){ //关闭弹出框
            this.showcfCityFlag = false;
            $('.alertbgg').remove();
        },
        saveCC(){ // 保存投放城市
            this.selectCityArr = jdyFn.selectCity2(); //数据不是时时更新，只有保存的时候才赋值
            // 获取国家，省份，城市并组装成对象
            let $active=$('.showtfcityaaa-content span.active');
            let obj={},index=0,parent;
            this.submitArr=[];
            for(let i=0;i<$active.length;i++){
                index=$($active[i]).index();
                parent=$($active[i]).parent().siblings(".hide");
                obj={
                    "taCountry": parent.children(".taCountry").eq(index).text(),
                    "taProvince": parent.children(".taProvince").eq(index).text(),
                    "taCity": $($active[i]).text(),                    
                }  
                this.submitArr.push(obj)              
            }
            this.closecfCity();
        },
        removeAll(){ //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
            this.submitArr=[];
        },
        selectAllAll(){ //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
        },
        defaultProviceArr(){ //获取投放城市列表
            this.$http.post(api_prefix + '/City/selectCityPutList',{isopen: true}).then(response => {
                this.proviceArr=response.body.body;
                this.toEdit();
            });
        }, 
        // 提交修改
        onSubmit(){
            console.log("票价",this.tickForm2);
            this.$refs["tickForm2"].validate((valid) => {
            if(valid){
                let fare=JSON.parse(JSON.stringify(this.tickForm2))
                // let fare= this.tickForm2;
                // 默认价格为0，日期格式调整，投放城市，单票列表
                // fare.tDefaultPrice=true;
                if(this.submitArr.length==0){
                    this.$message.error('投放城市不能为空');
                    return;
                }else{
                    fare.ticketAreaList=this.submitArr;
                }                         
                if(fare.tMarketPrice==0){
                    this.$message.error('门市价不能为0');
                    return;
                }          
                let urls=""
                if(this.$route.query.type==1){
                    // 修改
                    urls='ticket/update';
                    fare.sets=[];                  
                }else{
                    // 新增
                    urls='ticket/save';
                }  
                if(this.singleLists.length==0){
                    return this.$message.error('您未选择单票');
                }else{
                    this.singleLists.forEach((data)=>{
                        fare.sets.push({tsSingleId:data.id,tsSeats:data.sets})
                    })
                }  
                fare.tEffectWeek=this.week2num(); 
                fare.tPeerPrice=fare.tMarketPrice;      
                this.btnFlag = true;                       
                this.$http.post(api_prefix + urls,fare).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.btnFlag = false;  
                    if(!this.tickForm2.id){
                    this.tickForm2.id = data.body.id
                    }
                    this.$alert("保存成功","温馨提示",{type: 'success'});
                    this.$router.push({name:'Ticketprice',query:{id: this.$route.query.id}})                  
                }else{
                    this.btnFlag = false;
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                    // this.tickForm2.tEffectWeek=this.num2week(this.tickForm2.tEffectWeek)
                }              
                },response => {
                    this.$alert("保存失败","温馨提示",{type: 'error'});
                });
            }else{
                this.$message.error('提交失败了');
            }
            });
        },                         
    },
    filters: {
        filterLimitType(value){
        if(value==0|1|2|3){
            switch(value){
            case 0:
                return "无限制";
                break;
            case 1:
                return "实名制";
                break;
            case 2:
                return "限制性别";
                break;
            case 3:
                return "限制年龄";
                break;                              
            }  
        }else{
            return "未设置"
        }    
        },
        filterLimitCondition(value){
            return value==""?"未设置":value
        },  
        filterTimeFormat(value){
            // return  new Date(parseInt(value) * 1000).Format("yyyy-MM-dd hh:mm");
            return new Date(value).format('yyyy-MM-dd hh:mm') 
        },     
        filterEffectWeek(value){
        if(value=="0000000"){
            return "未设置"
        }else{
            let weekArray=[];
            let week_lib={
                0:"一",
                1:"二",
                2:"三",
                3:"四",
                4:"五",
                5:"六",
                6:"日"
            };
            let weeklist=value.split("");
            for(let k=0;k<weeklist.length;k++){
                weeklist[k]==1&&weekArray.push("周"+week_lib[k])
            };
            return weekArray.join(" ")     
        }
        }    
    },    
    components: {
        jdyAlert
    },    
    // computed: {
    //     tableDataTotal() { //列表页数
    //     return 500
    //     }
    // },            
    mounted(){
        this.getProductDetail();
        this.fareTableData();
        this.defaultProviceArr();
        this.getCategory();
    }     
}
</script>

<style scoped>
.hidden{
    display: none;
}
#tfCity .el-form-item__label:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
}
#checkAll{
    float: left;
    margin-right: 20px;
}
.tripbox .inputGeneral{
    width:60%;
    min-width: 150px;
}
.redstar .el-form-item__label:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
}
.el-form-item {
    margin-bottom: 32px;
}
</style>
