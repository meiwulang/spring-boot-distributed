<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner">
            <el-form :model="tickForm" :rules="rules" ref="tickForm" class="demo-form-inline" label-width="150px">
                <div class="jdy-tab">
                    <a style="border:0;">{{productDetail.pName}}
                        <span></span>
                    </a>
                    <el-button class="fright mt10" @click="goback('declareConfigTicketPrice')">返回</el-button>
                    <el-button type="primary" @click="onSubmit()" class="fright mt10 mr10" :disabled="btnFlag">保存</el-button>
                </div>
                <div class="tripbox clearfix border relative mt30">
                    <div class="clearfix p10">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="票价类型:" prop="type">
                                    <el-select v-model="tickForm.type" @change="getName" class="inputGeneral">
                                        <el-option :key="0" label="成人票" :value="0">
                                        </el-option>
                                        <el-option :key="1" label="儿童票" :value="1">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="票价名称:" prop="ticketName">
                                    <el-input v-model="tickForm.ticketName" class="inputGeneral"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="适用时间:">
                                    <el-date-picker v-model="datePicker" type="daterange" class="inputGeneral" placeholder="选择日期范围" @change="dateRangeChange"></el-date-picker>
                                </el-form-item>
                            </el-col>                            
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预算成本单价:">
                                    <el-input class="inputGeneral" v-model="tickForm.costPrice" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出厂价:" prop="price" class="redstar">
                                    <el-input class="inputGeneral" v-model="tickForm.price"></el-input>
                                </el-form-item>
                            </el-col>                            
                        </el-row>

                        <el-row>
                            <el-form-item label="始发站:" class="redstar">
                                <div class="tfcity relative">
                                    <div class="el-input" id="SFstation">
                                        <el-select v-model="selectStationArr" multiple filterable placeholder="请选择始发站">
                                            <el-option v-for="item in stationArr" :key="item.id" :label="item.dName+'-'+item.dProvince+'-'+item.dCity+'-'+item.dArea" :value="item.id"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="票价简介:">
                                <el-input v-model="tickForm.introduction" type="textarea" :autosize="{ minRows: 6, maxRows: 14}"></el-input>
                            </el-form-item>
                        </el-row>
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
            <el-button type="primary" class="fright mt10 mr10" @click="selectAllAll" id="selectAll">全选</el-button>
            <el-button type="primary" class="fright mt10 mr10" @click="saveCC">保存</el-button>
            </div>
        </jdy-alert>
        <!--始发站-->
    </div>
</template>

<script>

import jdyAlert from '@/components/Alert';
import {validateMoney,integerMoney} from '@/assets/js/validate';

export default {
    name: "",
    data() {
        return {
            btnFlag:false,
            /*票价添加*/
            tickForm: {
                "userId": JSON.parse(sessionStorage.loginData).userId,
                "tCompanyId": JSON.parse(sessionStorage.loginData).uCompanyId,
                "tProductId": this.$route.query.id,
                "tTicketType": 0,//票价类型
                "type": 0,
                "ticketName": '成人票',//票价名称
                "tLimitType": 0,//限制类型
                "tLimitCondition": '',//限制条件
                "tCategory": "",//票价类目
                "tTraffic": "",//交通类目
                "tMarketPrice": 0,//门市价
                "tGatherPrice":1,
                "tAdultNum":1,
                "tChildNum":0,
                "tPeerPrice": 1,//同行价
                "tPriceAdd": '',//补房差
                "tPriceReduce": '',//退房差
                "tStock": -1,//库存量
                "tEffectWeek": [],//周几有效
                "introduction": '',//票价简介
                "price":0,
                "suitableStartTime":null,
                "suitableEndTime":null,
                "costPrice":null,
                "productId":this.$route.query.id,
                "ticketDepartureList": [  //始发站
                    // {
                    //     "departueId": ''
                    // }
                ],
                "ticketAreaList": [  //投放城市
                    // {
                    //     "taCountry": 'CN',
                    //     "taProvince": '山东',
                    //     "taCity": ''
                    // }
                ],
                ascription:null
            },
            /*产品详情*/
            productDetail:{},
            /*票价类目(基础)*/
            baseCategory:[],
            /*限制条件*/
            limits:null,
            /*投放城市相关*/
            selectCityArr:{id:[],name:[]},
            showcfCityFlag:false,
            proviceArr:{},
            submitArr:[], //用于表单提交
            /*始发站相关*/
            selectStationArr:[],
            stationArr:{},
            /*用于星期全选*/
            checkWeekAll:false,
            /*校验*/
            rules: {
                ticketName: [{ required: true, message: '请输入票价名称', trigger: 'blur' },
                {  max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                type: [{ type: 'number',required: true, message: '请输入票价类型', trigger: 'change' }],
                tCategory:[{ type: 'number',required: true, message: '请输入票价类目', trigger: 'blur' }],
                tTraffic: [{ type: 'number',required: true, message: '请输入交通类目', trigger: 'change' }],
                // tMarketPrice: [
                //     { required: true, message: '请输入门市价', trigger: 'blur' },
                //     // { required: true, message: '请输入门市价', trigger: 'blur',},
                //    { type: 'number', message: '门市价必须为数字值'}
                // ],
                // tPeerPrice: [{ type: 'number',required: true, message: '请输入同行价', trigger: 'blur' }],
                tEffectWeek: [{ type: 'array', required: true, message: '请选择周几有效', trigger: 'change' }],
                price:[
                    { validator: validateMoney, trigger: 'blur' },
                    {required: true,message: '请输入门市价'}
                ],
                tGatherPrice:[
                    { validator: integerMoney, trigger: 'blur' },
                    {required: true,message: '请输入内部集结价'}
                ],
                selectStationArr:[{required: true,message: '请选择始发站', trigger: 'change'}],
                tPriceAdd: [{ validator: validateMoney, trigger: 'blur' }],
                tPriceReduce:[{ validator: validateMoney, trigger: 'blur' }],
                // selectStationArr:[{ required: true, message: '请选择始发站', trigger: 'change' }]
            },
            datePicker:[]
        }
    },
    methods: {
        // 获取产品详情
        getProductDetail(){
            let httpdata={
                id: this.$route.query.id,
                lineType: 0
            }
            this.$http.post(api_prefix+'product/detail',httpdata).then(response => {
                if(response.data.code==0){
                    this.productDetail=response.data.body.body.product;
                    // this.tickForm.ascription=this.productDetail.ascription;
                    // console.log("this.productDetail.ascription",this.tickForm.ascription)
                }else{
                    this.$alert(response.data.message);
                }
            }, response => {
                console.log('获取产品详情出错了');
            });
        },
        dateRangeChange(value){
            if (value) {
                let values = value.split(" - ");
                this.tickForm.suitableStartTime = values[0];
                this.tickForm.suitableEndTime = values[1];
            }
        },
        // 编辑页面
        toEdit(){
            if(this.$route.query.type==1){
                this.$http.get(api_prefix + 'factoryTicket/get/'+this.$route.query.priceId).then(response => {
                    if(response.data.code == 0){
                        this.tickForm=response.data.body;
                        this.selectStationArr=response.data.body.departureIds;
                        this.datePicker=[response.data.body.suitableStartTime,response.data.body.suitableEndTime];
                        // this.tickForm.tLimitCondition = response.data.body.tLimitCondition;
                        // this.getStationList(false);
                        // this.formatEdit();
                    }else{
                        this.$alert("获取当前编辑数据失败！");
                    }
                },response=>{
                    console.log("获取当前编辑数据失败！")
                });
            }else{
                // 新增票价需要调查询成本单价接口
                this.$http.get(api_prefix + 'productCost/selectNewestCostUnitPriceByProductId/'+this.$route.query.id).then(response => {
                    if(response.data.code == 0){
                        this.tickForm.costPrice=response.data.body;
                    }else{
                        this.$alert("获取预算成本单价失败！");
                    }
                },response=>{
                    console.log("获取当前编辑数据失败！")
                });                
            }
        },
        // 编辑页数据格式化
        formatEdit(){
            // 星期
            this.checkWeekAll=(this.tickForm.tEffectWeek==1111111)?true:false;
            // this.tickForm.tEffectWeek=this.num2week(this.tickForm.tEffectWeek);
            // 投放城市
            this.tickForm.ticketAreaList.forEach((data)=>{
                this.selectCityArr.name.push(data.taCity);
            });
            this.submitArr=this.tickForm.ticketAreaList;
            // 始发站
            this.tickForm.ticketDepartureList.forEach((data)=>{
                this.selectStationArr.push(data.departueId);
            });
            // 票价类目
            let temp=this.baseCategory.filter(data=>{
                return this.tickForm.tCategory==data.id
            });
            if(temp.length!=0){
                this.tickForm.tCategory= temp[0].id;
            }
            // 限制类别
            let tempLimit=this.tickForm.tLimitCondition;
            this.getLimits(this.tickForm.tLimitType);
            this.$nextTick(_ => {
                this.tickForm.tLimitCondition=tempLimit;
                if(this.tickForm.tLimitType==2){
                    this.tickForm.tLimitCondition=this.tickForm.tLimitCondition==0?"男":"女"
                }
            });
        },
        // 获取限制条件
        getLimits(value){
            this.tickForm.tLimitCondition='';
            this.limits=value;
        },
        getName(value){
            if(!this.$route.query.type){
                this.tickForm.ticketName=value==1?"儿童票":"成人票";
                if(value == 0){
                    this.tickForm.tAdultNum = 1;
                    this.tickForm.tChildNum = 0;
                }else{
                    this.tickForm.tAdultNum = 0;
                    this.tickForm.tChildNum = 1;
                }                
            }
        },
        /*投放城市相关*/
        showtfCity(){ // 显示投放城市弹出框
            this.showcfCityFlag = true;
            this.selectStationArr=[];
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
            console.log("投放城市",this.selectCityArr,$active,this.submitArr)
            this.getStationList(false)
            this.closecfCity();
        },
        removeAll(){ //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
            this.submitArr=[];
        },
        selectAllAll(){ //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
            console.log("投放城市",this.selectCityArr,this.submitArr);
        },
        defaultProviceArr(){ //获取投放城市列表
            this.$http.post(api_prefix + '/City/selectCityPutList',{isopen: true}).then(response => {
            this.proviceArr=response.body.body;
            this.toEdit();
            });
        },
        /*始发站相关*/
        getStationList(flag){ //获取始发站数据
            let params={
                "citys":this.selectCityArr.name,
                "companyId": this.tickForm.tCompanyId,
                "currPage": 1,
                "dStatus": 0,
                // "dTraffic": this.tickForm.tTraffic,
                "pageSize": 10000
            };
            if(flag){
                // console.log("1111",flag)
                this.selectStationArr=[];
            }
            this.$http.post(api_prefix + 'departure/start_site_group',params).then(response => {
                if(response.data.code == 0){
                    this.stationArr=response.body.body.resultList;
                }else{
                    // this.$message.info("获取始发站数据失败");
                }
            });
        },
        //交通方式或投放城市改变触发
        clearSFstation(){
            this.selectStationArr=[];
        },
        goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({name:url,query:{id: this.$route.query.id,c_id:this.$route.query.c_id}})
            }).catch(() => {

            });
        },
        // 提交修改
        onSubmit(){
            this.$refs["tickForm"].validate((valid) => {
            if(valid){
                console.log("保存",this.tickForm)
                let fare=JSON.parse(JSON.stringify(this.tickForm))
                // let fare= this.tickForm;
                //限制年龄数据格式
                if(fare.tLimitType==3){
                    let ageLimit=/^<+?[1-9][0-9]*$|^>+?[1-9][0-9]*$|^\d+-[1-9][0-9]*$/;
                    if(!ageLimit.test(fare.tLimitCondition)){
                        this.$message.error('只能输入"<正整数 或 >正整数 或 正整数—正整数",如<10、>10、10-20等');
                        return;
                    }
                };
                if(fare.price==0){
                    this.$message.error('出厂价不能为0');
                    return;
                }
                if(fare.introduction.length>=500){
                    this.$message.error('票价简介不能超过500字！');
                    return;
                }                
                if(this.selectStationArr.length==0){
                    this.$message.error('始发站不能为空');
                    return;
                }
                if(fare.type == 0 && fare.tAdultNum == 0){
                    this.$message.error('选择成人票，成人数不能小于1');
                     return;
                }
                if(fare.type == 1 && fare.tChildNum == 0){
                    this.$message.error('选择儿童票，儿童数不能小于1');
                     return;
                }
                // 默认价格为0，日期格式调整，投放城市，始发站
                // fare.tDefaultPrice=true;
                fare.departureIds=[];
                this.selectStationArr.forEach(function(data){
                    fare.departureIds.push(data)
                })
                fare.ticketAreaList=this.submitArr;
                // 编辑、新增判断
                let urls="";
                fare.ascription=this.productDetail.ascription;
                fare.fromProductListMenu=true;
                if(this.$route.query.type==1){
                    urls='factoryTicket/update'
                }else{
                    urls='factoryTicket/add'
                }
                // fare.tEffectWeek=this.week2num();
                fare.tPeerPrice=fare.tMarketPrice;
                this.btnFlag = true;
                this.$http.post(api_prefix + urls,fare).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.btnFlag = false;
                    this.$alert("保存成功","温馨提示",{type: 'success'});
                    this.$router.push({ name: 'declareConfigTicketPrice',query:{id: this.$route.query.id,c_id:this.$route.query.c_id}})
                }else{
                    this.btnFlag = false;
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                    // this.tickForm.tEffectWeek=this.num2week(this.tickForm.tEffectWeek)
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
  components: {
    jdyAlert
  },
  watch:{
     "selectCityArr":"getStationList(false)"
  },
  mounted(){
    this.getProductDetail();
    this.defaultProviceArr();
    // this.getCategory();
    this.getStationList(false)
    $("#TrafficDiv .el-input").click(()=>{
        this.selectStationArr=[];
    });
  }
}
</script>

<style scoped>
#age_input{
    width: 220px;
}
.el-form-item.redstar .el-form-item__label:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
}
#SFstation>div{
    width:100%;
}
#checkAll{
    float: left;
    margin-right: 20px;
}
.tripbox .inputGeneral{
    width:60%;
    min-width: 150px;
}
.el-form-item {
    margin-bottom: 32px;
}
</style>
