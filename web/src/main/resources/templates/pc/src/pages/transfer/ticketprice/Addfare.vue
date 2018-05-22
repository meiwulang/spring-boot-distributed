<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner">
            <el-form :model="tickForm" :rules="rules" ref="tickForm" class="demo-form-inline" label-width="150px">
                <div class="jdy-tab">
                    <a style="border:0;">{{productDetail.pName}}
                        <span></span>
                    </a>
                    <el-button class="fright mt10" @click="goback('Ticketprice')">返回</el-button>
                    <el-button type="primary" @click="onSubmit()" class="fright mt10 mr10" :disabled="btnFlag">保存</el-button>
                </div>
                <div class="tripbox clearfix border relative mt30">
                    <div class="clearfix p10">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="票价类目:" prop="tCategory">
                                    <el-select v-model="tickForm.tCategory" class="inputGeneral">
                                        <!--<el-option :key="0" label="票价类目0" value="0">
                                        </el-option>
                                        <el-option :key="1" label="票价类目1" value="1">
                                        </el-option>-->
                                        <el-option v-for="(item,index) in baseCategory" :value="item.id" :label="item.name" :key="item.id"></el-option>
                                        <!--<el-option v-for="(item,index) in baseCategory" :key="item.name" :value="index" :label="item.name"></el-option>-->

                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="票价类型:" prop="tType">
                                    <el-select v-model="tickForm.tType" @change="getName" class="inputGeneral">
                                        <el-option :key="0" label="成人票" :value="0">
                                        </el-option>
                                        <el-option :key="1" label="儿童票" :value="1">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="票价名称:" prop="tName">
                                    <el-input v-model="tickForm.tName" class="inputGeneral"></el-input>
                                </el-form-item>

                                <!-- <el-form-item label="限制类型:">
                                    <el-select v-model="tickForm.tLimitType" @change="getLimits" class="inputGeneral">
                                        <el-option :key="0" label="无限制" :value="0">
                                        </el-option>
                                        <el-option :key="1" label="实名制" :value="1">
                                        </el-option>
                                        <el-option :key="2" label="限制性别" :value="2">
                                        </el-option>
                                        <el-option :key="3" label="限制年龄" :value="3">
                                        </el-option>
                                    </el-select>
                                </el-form-item> -->
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="门市价:" prop="tMarketPrice" class="redstar">
                                    <!-- <el-input-number v-model="tickForm.tMarketPrice" class="inputGeneral" :min="0"></el-input-number> -->
                                    <el-input class="inputGeneral" v-model="tickForm.tMarketPrice"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="库存量:" >
                                    <el-input-number v-model="tickForm.tStock" :min="-1" class="inputGeneral"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="交通类目:" prop="tTraffic" >
                                    <el-select v-model="tickForm.tTraffic" @change="getStationList(false)" id="TrafficDiv" class="inputGeneral">
                                        <el-option :key="0" label="飞机" :value="0" >
                                        </el-option>
                                        <el-option :key="1" label="火车" :value="1">
                                        </el-option>
                                        <el-option :key="2" label="汽车" :value="2">
                                        </el-option>
                                        <el-option :key="3" label="邮轮" :value="3">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8" v-if="productDetail.ascription==1">
                                <el-form-item label="内部集结价:" prop="tGatherPrice" class="redstar">
                                    <el-input class="inputGeneral" v-model="tickForm.tGatherPrice" :min="1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="成人数:">
                                     <el-input-number v-model="tickForm.tAdultNum" :min="0" class="inputGeneral"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="儿童数:">
                                     <el-input-number v-model="tickForm.tChildNum" :min="0" class="inputGeneral"></el-input-number>
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
                                <el-input v-model="tickForm.tIntroduction" type="textarea"></el-input>
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
                "tType": 0,
                "tName": '成人票',//票价名称
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
                "tIntroduction": '',//票价简介
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
                tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' },
                {  max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                ],
                tType: [{ type: 'number',required: true, message: '请输入票价类型', trigger: 'change' }],
                tCategory:[{ type: 'number',required: true, message: '请输入票价类目', trigger: 'blur' }],
                tTraffic: [{ type: 'number',required: true, message: '请输入交通类目', trigger: 'change' }],
                // tMarketPrice: [
                //     { required: true, message: '请输入门市价', trigger: 'blur' },
                //     // { required: true, message: '请输入门市价', trigger: 'blur',},
                //    { type: 'number', message: '门市价必须为数字值'}
                // ],
                // tPeerPrice: [{ type: 'number',required: true, message: '请输入同行价', trigger: 'blur' }],
                tEffectWeek: [{ type: 'array', required: true, message: '请选择周几有效', trigger: 'change' }],
                tMarketPrice:[
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
            }
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
        // 编辑页面
        toEdit(){
            if(this.$route.query.type==1){
                this.$http.get(api_prefix + 'ticket/get/'+this.$route.query.priceId+"/0").then(response => {
                    if(response.data.code == 0){
                        this.tickForm=response.data.body;
                        this.tickForm.tLimitCondition = response.data.body.tLimitCondition;
                        this.getStationList(false);
                        this.formatEdit();
                    }else{
                        this.$alert("获取当前编辑数据失败！");
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
            this.tickForm.tEffectWeek=this.num2week(this.tickForm.tEffectWeek);
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
            console.log(value,'090909090')
            if(!this.$route.query.type){
                this.tickForm.tName=value==1?"儿童票":"成人票";
                if(value == 0){
                    this.tickForm.tAdultNum = 1;
                    this.tickForm.tChildNum = 0;
                }else{
                    this.tickForm.tAdultNum = 0;
                    this.tickForm.tChildNum = 1;
                }
            }
        },
        // 星期全选相关
        handleCheckAllWeek(event){
            if(event.target.checked){
                this.tickForm.tEffectWeek=['周一','周二','周三','周四','周五','周六','周日'];
            }else{
                this.tickForm.tEffectWeek=[];
            }
        },
        // 星期改变事件
        getSelectWeeks(value){
            this.checkWeekAll=(value.length==7)?true:false;
        },
        // 星期格式化
        week2num(){
            let weeks=0;
            for(let i=0;i<this.tickForm.tEffectWeek.length;i++){
                switch(this.tickForm.tEffectWeek[i]){
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
            console.log(999)
            // if(this.selectCityArr.name.length==0){
            //     this.stationArr={};
            //     this.selectStationArr=[];
            //     // return this.$message.info("请先选择始发站和交通工具");
            //     return;
            // }
            let params={
                "citys":this.selectCityArr.name,
                "companyId": this.tickForm.tCompanyId,
                "currPage": 1,
                "dStatus": 0,
                "dTraffic": this.tickForm.tTraffic,
                "pageSize": 10000
            };
            if(flag){
                console.log("1111",flag)
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
            console.log("选的始发站",this.selectStationArr)
            this.selectStationArr=[];
        },
        goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({name:url,query:{id: this.$route.query.id}})
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
                if(fare.tMarketPrice==0){
                    this.$message.error('门市价不能为0');
                    return;
                }
                if(this.selectStationArr.length==0){
                    this.$message.error('始发站不能为空');
                    return;
                }
                if(fare.tType == 0 && fare.tAdultNum == 0){
                    this.$message.error('选择成人票，成人数不能小于1');
                     return;
                }
                if(fare.tType == 1 && fare.tChildNum == 0){
                    this.$message.error('选择儿童票，儿童数不能小于1');
                     return;
                }
                // 默认价格为0，日期格式调整，投放城市，始发站
                // fare.tDefaultPrice=true;
                fare.ticketDepartureList=[];
                this.selectStationArr.forEach(function(data){
                    fare.ticketDepartureList.push({"departueId":data})
                })
                fare.ticketAreaList=this.submitArr;
                // 编辑、新增判断
                let urls="";
                fare.ascription=this.productDetail.ascription;
                fare.fromProductListMenu=true;
                if(this.$route.query.type==1){
                    urls='ticket/update'
                }else{
                    urls='ticket/save'
                }
                fare.tEffectWeek=this.week2num();
                fare.tPeerPrice=fare.tMarketPrice;
                this.btnFlag = true;
                this.$http.post(api_prefix + urls,fare).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.btnFlag = false;
                    this.$alert("保存成功","温馨提示",{type: 'success'});
                    this.$router.push({ name: 'Ticketprice',query:{id: this.$route.query.id}})
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
    this.getCategory();
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
