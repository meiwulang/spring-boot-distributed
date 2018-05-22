<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner">
            <el-form :model="tickForm" ref="tickForm" class="demo-form-inline" label-width="150px">
                <div class="jdy-tab">
                    <a style="border:0;">{{productDetail.pName}}
                        <span></span>
                    </a>
                    <el-button class="fright mt10" @click="goback('Ticketprice')">返回</el-button>
                    <el-button type="primary" @click="onSubmit" class="fright mt10 mr10" :disabled="btnFlag">保存</el-button>
                </div>
                <div class="tripbox clearfix border relative mt30">
                    <div class="clearfix p10">
                        <div class="alertAddProduct3-tablebtn">
                        <el-button class=" mt10 ml20" @click="addTr">
                            <i class="el-icon-plus t07 green"></i>添加行</el-button>
                        <el-button class=" mt10 " @click="removeTr()">
                            <i class="el-icon-close t07 red"></i>移除行</el-button>
                        <el-button class=" mt10 " @click="cloneTr">复制</el-button>
                        </div>
                        <div class="p10">
                        <el-form ref="tickForm3" :rules="rules">
                            <el-table ref="multipleTable"  :data="tickForm3" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"  width="55">
                            </el-table-column>
                            <el-table-column label="票价名称" min-width="120" prop="rules[scope.$index].tName">
                                <template scope="scope">
                                <el-input v-model="tickForm3[scope.$index].tName" placeholder="请输入内容"></el-input>
                                <span class="getIndex" v-model="tickForm3[scope.$index].Index">{{scope.$index}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="tType" label="票价类型" min-width="100">
                                <template scope="scope">
                                    <el-select v-model="tickForm3[scope.$index].tType" @change="getNames(scope.$index)">
                                        <el-option :key="0" label="成人票" value="0">
                                        </el-option>
                                        <el-option :key="1" label="儿童票" value="1">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="票价类目" min-width="100">
                                <template scope="scope">
                                    <el-select v-model="tickForm3[scope.$index].tCategory">
                                        <!--<el-option :key="0" label="票价类目0" value="0">
                                        </el-option>
                                        <el-option :key="1" label="票价类目1" value="1">
                                        </el-option>-->
                                        <el-option v-for="(item,index) in baseCategory" :value="item.id" :label="item.name" :key="item.id"></el-option>
                                        <!--<el-option v-for="(item,index) in baseCategory" :key="item.name" :value="index" :label="item.name"></el-option>-->
                                    </el-select>                  
                                </template>
                            </el-table-column>              
                            <el-table-column label="交通类目" min-width="120" prop="rules[scope.$index].tTraffic">
                                <template scope="scope">
                                    <el-select v-model="tickForm3[scope.$index].tTraffic" @change="clearSFstation( tickForm3[scope.$index].Index )" >
                                        <el-option :key="0" label="飞机" value="0">
                                        </el-option>
                                        <el-option :key="1" label="火车" value="1">
                                        </el-option>
                                        <el-option :key="2" label="汽车" value="2">
                                        </el-option>
                                        <el-option :key="3" label="邮轮" value="3">
                                        </el-option>                                        
                                    </el-select>                  
                                </template>
                            </el-table-column>             
                            <el-table-column prop="rules[scope.$index].tMarketPrice" label="门市价" min-width="100">
                                <template scope="scope">
                                <!-- <el-input-number v-model="tickForm3[scope.$index].tMarketPrice" placeholder="请输入内容" :min="0" ></el-input-number> -->
                                <el-input class="inputGeneral" :min="0" v-model="tickForm3[scope.$index].tMarketPrice"></el-input>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="rules[scope.$index].tPeerPrice" label="同行价" width="150">
                                <template scope="scope">
                                <el-input-number v-model="tickForm3[scope.$index].tPeerPrice" placeholder="请输入内容" :min="0"></el-input-number>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="fareType" label="投放市场" min-width="150">
                                <template scope="scope">
                                <!--<el-input v-model="tickForm3[scope.$index].ticketAreaList" placeholder="请输入内容"></el-input>-->
                                <div class="tfcity relative">
                                    <div class="el-input" :title="tickForm3[scope.$index].tfCityShow">
                                        <input autocomplete="off" v-model="tickForm3[scope.$index].tfCityShow" placeholder="请选择投放城市" type="text" class="el-input__inner"
                                         @click="showtfCity( tickForm3[scope.$index].Index )">
                                    </div>
                                    <!-- v-if="showtfCityFlag" em-->
                                </div>                                
                                </template>
                            </el-table-column>
                            <el-table-column label="始发站" min-width="150">
                                <template scope="scope">
                                <!--<el-input v-model="tickForm3[scope.$index].ticketDepartureList" placeholder="请输入内容"></el-input>-->
                                <div class="tfcity relative">
                                    <div class="el-input" :title="tickForm3[scope.$index].sfStationShow">
                                        <input autocomplete="off" v-model="tickForm3[scope.$index].sfStationShow" placeholder="请选择始发站" type="text" class="el-input__inner" 
                                        @click="showStation( tickForm3[scope.$index].Index )">
                                    </div>
                                </div>                                   
                                </template>
                            </el-table-column>             
                            <el-table-column prop="address" label="补房差" min-width="100">
                                <template scope="scope">
                                <!-- <el-input-number v-model="tickForm3[scope.$index].tPriceAdd" placeholder="请输入内容" :min="0"></el-input-number> -->
                                <el-input class="inputGeneral" :min="0" v-model="tickForm3[scope.$index].tPriceAdd"></el-input>
                                </template>
                            </el-table-column>      
                            <el-table-column prop="address" label="退房差" min-width="100">
                                <template scope="scope">
                                <!-- <el-input-number v-model="tickForm3[scope.$index].tPriceReduce" placeholder="请输入内容" :min="0"></el-input-number> -->
                                <el-input class="inputGeneral" :min="0" v-model="tickForm3[scope.$index].tPriceReduce"></el-input>
                                </template>
                            </el-table-column>                       
                            <el-table-column prop="address" label="限制类型" min-width="120">
                                <template scope="scope">
                                    <el-select v-model="tickForm3[scope.$index].tLimitType" @change="getLimits(scope.$index)">
                                        <el-option :key="0" label="无限制" value="0">
                                        </el-option>
                                        <el-option :key="1" label="实名制" value="1">
                                        </el-option>
                                        <el-option :key="2" label="限制性别" value="2">
                                        </el-option>
                                        <el-option :key="3" label="限制年龄" value="3">
                                        </el-option>                                        
                                    </el-select>                  
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="限制条件" min-width="120">
                                <template scope="scope">
                                    <el-select v-model="tickForm3[scope.$index].tLimitCondition" :disabled="tickForm3[scope.$index].tLimitType==0||tickForm3[scope.$index].tLimitType==1" v-if="tickForm3[scope.$index].tLimitType!=3">
                                        <el-option :key="0" label="男" value="0" v-if="tickForm3[scope.$index].tLimitType==2">
                                        </el-option>
                                        <el-option :key="1" label="女" value="1" v-if="tickForm3[scope.$index].tLimitType==2">
                                        </el-option>                                                                             
                                    </el-select>
                                    <el-input class="age_input" v-model="tickForm3[scope.$index].tLimitCondition" placeholder="请输入限制年龄" :disabled="tickForm3[scope.$index].tLimitType!=3" v-if="tickForm3[scope.$index].tLimitType==3"></el-input>                                            
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="库存量" min-width="150">
                                <template scope="scope">
                                <el-input-number v-model="tickForm3[scope.$index].tStock" placeholder="请输入内容" :min="-1"></el-input-number>
                                </template>
                            </el-table-column>              
                            </el-table>
                        </el-form>
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
                        <div class="showtfcityaaa" v-for="(value,key) in proviceArr">
                            <div class="showtfcityaaa-head plr10 clearfix">
                                <span>{{key}}</span>
                                <el-button  class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                                <el-button  class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
                            </div>
                            <div class="showtfcityaaa-content plr10 clearfix">
                                <span v-for="ccitem in value" :dataId="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':activeCityArr.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>                            
                            </div>
                            <div class="hide">
                                <span v-for="ccitem in value" class="taCountry" v-show="false">{{ccitem.type}}</span>
                                <span v-for="ccitem in value" class="taProvince" v-show="false">{{ccitem.pName}}</span>    
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
        <!--始发站-->
        <jdy-alert title="始发站选择" @closeAlert="closecfCity" v-if="showStationFlag" class="alertCityList showtfcity">
            <div class="showtfcityaa">
                <!--<div class="showtfcityaa-scroll">
                    <div class="showtfcityaa-i">
                        <div class="showtfcityaaa">
                            <div class="showtfcityaaa-content plr10 clearfix">
                                <span v-for="index in stationArr" class="showtfcityaaa-span showtfcityaaa-block" :dataId="index.id" :class="{'active':activeStationArr.indexOf(index.dName)!=-1}">
                                    <span :dataId="index.id" :class="{'station':true,'active':activeStationArr.indexOf(index.dName)!=-1}">{{index.dName}}</span>
                                    <span style="float:right" class="clearfix">({{index.dProvince}}-{{index.dCity}}-{{index.dArea}})</span>
                                </span>
                            </div>
                           
                        </div>
                    </div>
                </div>-->
                <el-select v-model="selectStationArr" multiple filterable placeholder="请选择始发站" class="SFstation">
                    <el-option v-for="item in stationArr" :key="item.id" :label="item.dName+'————'+item.dProvince+'-'+item.dCity+'-'+item.dArea" :value="item.id"></el-option>
                </el-select>                                    
            </div>
            <div class="alertfoot1 clearfix">
                <el-button type="primary" class="fright mt10 mr10" @click="closecfCity">取消</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="saveStation">确认选择</el-button>
            </div>    
        </jdy-alert>    
    </div>
</template>
<script>
import jdyAlert from '@/components/Alert';
export default {
    name: "",
    data() {
        return {
            btnFlag:false,
            /*票价添加*/
            tickForm: {
                "userId": 123,
                "tCompanyId": 123,
                "tProductId": 123,
                "tTicketType": 0,
                "tType": '', //票价类型
                "tName": '',//票价名称
                "tLimitType": '',//限制类型
                "tLimitCondition": '',//限制条件
                "tCategory": "",//票价类目
                "tTraffic": "",//交通类目
                "tMarketPrice": '',//门市价
                "tPeerPrice": '',//同行价
                "tPriceAdd": '',//补房差
                "tPriceReduce": '',//退房差
                "tStock": '',//库存量
                "tEffectWeek": [],//周几有效
                "tIntroduction": '',//票价简介
                "ticketDepartureList": [
                    {
                        "ticketId": 1,
                        "departueId": ''
                    }
                ],
                "ticketAreaList": [
                    {
                        "taTicketId": 1,
                        "taCountry": 'CN',
                        "taProvince": '山东',
                        "taCity": ''
                    }
                ]
            },
            /*投放城市相关*/
            selectCityArr:{id:[],name:[]},
            showcfCityFlag:false,
            proviceArr:{}, 
            submitArr:[], //用于表单提交
            activeCityArr:[], //用于判断是否有active属性
            /*始发站相关*/
            showStationFlag:false,
            // selectStationArr:{id:[],name:[]},
            selectStationArr:[], //始发站id序列
            stationArr:{},  
            activeStationArr:[], //用于判断是否有active属性          
            /*批量添加*/
            // tickForm3: [{
            //     "Index":1,
            //     "tProductId": this.$route.query.id,
            //     "userId": 123,
            //     "tCompanyId": 123,  
            //     "tTicketType": "0",              
            //     "tType": "0", //票价类型
            //     "tName": "",//票价名称
            //     "tLimitType": "",//限制类型
            //     "tCategory": "",//票价类目
            //     "tTraffic": "",//交通类目
            //     "tLimitCondition": "",//限制条件
            //     "tMarketPrice": 0,//门市价
            //     "tPeerPrice": 0,//同行价
            //     "tPriceAdd": 0,//补房差
            //     "tPriceReduce": 0,//退房差
            //     // "tDefaultPrice":true,//默认价格为0
            //     "tStock": -1,//库存量
            //     "tEffectWeek": "1111111",//周几有效
            //     "ticketAreaList": [],//投放市场
            //     "tfCityShow":[], //投放市场展示
            //     "ticketDepartureList": [],//始发站
            //     "sfStationShow":[], //始发站展示                
            // }],  
            tickForm3:[],        
            /*批量添加一行*/
            tickForm3Obj: {
                "Index":null,
                "tProductId": this.$route.query.id,
                "userId": 123,
                "tCompanyId": 123,               
                "tTicketType": "0",
                "tType": '0', //票价类型
                "tName": '成人票',//票价名称
                "tLimitType": '',//限制类型
                "tLimitCondition": '',//限制条件
                "tCategory": "",//票价类目
                "tTraffic": "",//交通类目
                "tMarketPrice": 0,//门市价
                "tPeerPrice": 0,//同行价
                "tPriceAdd": 0,//补房差
                "tPriceReduce": 0,//退房差
                // "tDefaultPrice":true,//默认价格为0
                "tStock": -1,//库存量
                "tEffectWeek": "1111111",//周几有效
                "ticketDepartureList": [ //始发站
                // {
                //     "ticketId": 1,
                //     "departueId": ''
                // }
                ],
                "sfStationShow":[], //始发站展示   
                "ticketAreaList": [ //投放市场
                // {
                //     "taTicketId": 1,
                //     "taCountry": 'CN',
                //     "taProvince": '山东',
                //     "taCity": ''
                // }
                ],
                "tfCityShow":[], //投放市场展示
            },            
            /*限制条件*/
            limits:[],
            multipleSelection3: [],
            rules: [{
                tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' }],
                tType: [{ required: true, message: '请输入票价类型', trigger: 'change' }],
                tTraffic: [{ type: 'number',required: true, message: '请输入交通类目', trigger: 'change' }],
                tMarketPrice: [{type: 'number', required: true, message: '请输入门市价', trigger: 'blur' }],
                tPeerPrice: [{ type: 'number',required: true, message: '请输入同行价', trigger: 'blur' }],                   
                /*校验list集合非空*/
                ticketAreaList: [{}],
                ticketDepartureList: [{}]
            }],
            /*校验*/
            rules: {
                tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' }],
                tType: [{ required: true, message: '请输入票价类型', trigger: 'change' }],
                tTraffic: [{ type: 'number',required: true, message: '请输入交通类目', trigger: 'change' }],
                tMarketPrice: [{type: 'number', required: true, message: '请输入门市价', trigger: 'blur' }],
                tPeerPrice: [{ type: 'number',required: true, message: '请输入同行价', trigger: 'blur' }],                   
                /*校验list集合非空*/
                ticketAreaList: [{}],
                ticketDepartureList: [{}]
            },
            /*产品详情*/ 
            productDetail:{},                 
            /*选中id集合*/ 
            selectIdList:[],
            /*获取tickForm3中的id值*/
            maxIdList:[],
            /*票价类目(基础)*/ 
            baseCategory:[],
            /*当前rowId：(用于投放城市、始发站)*/ 
            currentDomIndex:null,
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
                    this.productDetail=response.data.body.body.product
                }else{
                    this.$alert(response.data.message);
                }
            }, response => {
                console.log('获取产品详情出错了');
            });      
        },              
        handleSelectionChange(val){
            this.selectIdList=[]
            for(let i=0;i<val.length;i++){
                this.selectIdList.push(val[i].Index);
            }
            this.selectIdList.sort();    
        },
        // 获取限制条件   
        getLimits(index,value){
            this.tickForm3[index].tLimitCondition="";
            this.limits[index]=value;
        },
        getNames(index){
            this.tickForm3[index].tName=this.tickForm3[index].tType==1?"儿童票":"成人票"
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
        showtfCity(index){ // 显示投放城市弹出框
            // 获取当前index
            this.currentDomIndex=index;
            this.showcfCityFlag = true;
            this.$nextTick(function(){
                jdyFn.setAlertStyle('showtfcity');
                jdyFn.selectCity2();
            });
            this.activeCityArr=[];
            let targetList=this.tickForm3.filter(data=>{return this.currentDomIndex==data.Index}); 
            this.activeCityArr=targetList[0].tfCityShow;
        },
        closecfCity(){ //关闭弹出框
            this.showStationFlag =false;
            this.showcfCityFlag = false;
            $('.alertbgg').remove();
        },
        saveCC(){ // 保存投放城市
            this.selectCityArr = jdyFn.selectCity2(); //数据不是时时更新，只有保存的时候才赋值
            // 获取国家，省份，城市并组装成对象(用于表单)
            let $active=$('.showtfcityaaa-content span.active');
            let obj={},index=0,parent;
            for(let i=0;i<$active.length;i++){
                index=$($active[i]).index();
                parent=$($active[i]).parent().siblings(".hide");
                obj={
                    "taCountry": parent.children(".taCountry").eq(index).text(),
                    "taProvince": parent.children(".taProvince").eq(index).text(),
                    "taCity": $($active[i]).text(),                    
                }
                this.submitArr.push(obj)            
            };
            let targetObj=this.tickForm3.filter(data=>{return this.currentDomIndex==data.Index}); 
            targetObj[0].ticketAreaList=this.submitArr;
            this.clearSFstation(this.currentDomIndex)            
            // 用于页面渲染
            let tempCity=[];
            this.submitArr.forEach((data,i)=>{
                tempCity.push(data.taCity);
            });
            targetObj[0].tfCityShow=tempCity;
            this.submitArr=[];
            this.closecfCity();
        },
        removeAll(){ //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
        },
        selectAllAll(){ //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
        },
        defaultProviceArr(){ //获取投放城市列表
            this.$http.post(api_prefix + 'City/selectCityPutList',{isopen: true}).then(response => {
                this.proviceArr=response.body.body;
            });
        },   
        /*始发站相关*/
        showStation(index){ // 显示始发站弹出框
            // 获取当前index
            this.currentDomIndex=index;             
            var targetList=this.tickForm3.filter(data=>{return this.currentDomIndex==data.Index}); 
            if(targetList[0].tfCityShow.length==0 || targetList[0].tTraffic==""){
                this.$message.info("请先选择投放城市和交通工具")
            }else{      
                this.showStationFlag = true;
                this.$nextTick(function(){
                    jdyFn.setAlertStyle('showtfcity');
                    jdyFn.selectCity2();
                });                         
                let params={
                    "citys":targetList[0].tfCityShow,
                    "companyId": targetList[0].tCompanyId,
                    "currPage": 1,
                    "dStatus": 0,
                    "dTraffic": parseInt(targetList[0].tTraffic),
                    "pageSize": 10000  
                };
                this.$http.post(api_prefix + 'departure/start_site_group',params).then(response => {
                    this.stationArr=response.body.body.resultList;
                    if(targetList[0].ticketDepartureList.length!=0){
                        this.selectStationArr=[];
                        targetList[0].ticketDepartureList.forEach((data)=>{
                            this.selectStationArr.push(data.departueId)
                        });  
                    };                        
                }); 
            }          
        },  
        saveStation(){ // 保存始发站
            let tempShowCity=[];
            let targetObj=this.tickForm3.filter(data=>{return this.currentDomIndex==data.Index}); 
            // 从已选id中获取对应的城市名
            console.log("保存始发站序列",this.selectStationArr)
            this.selectStationArr.forEach((seleID)=>{                
                let targetSelect=this.stationArr.filter(data=>{
                    return data.id==seleID;
                });
                if(targetSelect.length!=0){
                    tempShowCity.push(targetSelect[0].dName)
                }
            }) 
            targetObj[0].sfStationShow=tempShowCity;
            // 保存id用于表单提交 
            targetObj[0].ticketDepartureList=[];
            this.selectStationArr.forEach(function(data){
                targetObj[0].ticketDepartureList.push({"departueId":data})
            });
            this.selectStationArr=[];           
            this.closecfCity();
        },  
        // 交通方式或投放城市改变时触发,清空序列并重新加载始发站列表
        clearSFstation(index){
            this.currentDomIndex=index;
            let targetObj=this.tickForm3.filter(data=>{return this.currentDomIndex==data.Index}); 
            targetObj.length!=0 && (targetObj[0].sfStationShow=[]);
            if(targetObj.length!=0){
                targetObj[0].sfStationShow=[];
                targetObj[0].ticketDepartureList=[];
            }
            let params={
                "citys":targetObj[0].tfCityShow,
                "companyId": targetObj[0].tCompanyId,
                "currPage": 1,
                "dStatus": 0,
                "dTraffic": parseInt(targetObj[0].tTraffic),
                "pageSize": 10000  
            };
            this.$http.post(api_prefix + 'departure/start_site_group',params).then(response => {
                this.stationArr=response.body.body.resultList;
                this.selectStationArr=[];                       
            });             
        },                                        
        // 提交修改 
        onSubmit(){    
            //交通类目,同行价,门市价不能为空
            let isEmpty=[];
            isEmpty=this.tickForm3.filter(data=>{
                return data.tTraffic==""
            })
            if(isEmpty.length!=0){
                return this.$alert("请选择交通方式","温馨提示",{type: 'error'});                                   
            }
            isEmpty=this.tickForm3.filter(data=>{
                return data.tMarketPrice==0
            })
            targetList=this.tickForm3.filter(data=>{
                return data.tMarketPrice
            })
            let targetList=[];
            if(isEmpty.length!=0){
                return this.$alert("门市价不能为0","温馨提示",{type: 'error'}); 
            }else{
                this.tickForm3.forEach(function(data){
                    targetList.push(data.tMarketPrice)
                })
                for(let i=0;i<targetList.length;i++){
                    if(!RegExObj.moneyTwoPoint.test(targetList[i])){
                        return this.$alert("门市价金钱数字格式不正确","温馨提示",{type: 'error'});                       
                    }                     
                }
            }
            // 补房差
            targetList=[];
            this.tickForm3.forEach(function(data){
                targetList.push(data.tPriceAdd)
            })
            for(let i=0;i<targetList.length;i++){
                if(!RegExObj.moneyTwoPoint.test(targetList[i])){
                    return this.$alert("补房差格式不正确（参考：99.88，无小数或最多两位小数）","温馨提示",{type: 'error'});                     
                }                     
            }            
            // 退房差
            targetList=[];
            this.tickForm3.forEach(function(data){
                targetList.push(data.tPriceReduce)
            })
            for(let i=0;i<targetList.length;i++){
                if(!RegExObj.moneyTwoPoint.test(targetList[i])){
                    return this.$alert("退房差格式不正确（参考：99.88，无小数或最多两位小数）","温馨提示",{type: 'error'});                
                }                     
            }             
            //  限制年龄
            isEmpty=this.tickForm3.filter(data=>{
                return data.tLimitType==3
            })
            let ageLimit=/^<+?[1-9][0-9]*$|^>+?[1-9][0-9]*$|^\d+-[1-9][0-9]*$/;
            if(isEmpty.length!=0){
                let ageLimitRegex=[];
                isEmpty.forEach(data=>{                     
                    !ageLimit.test(data.tLimitCondition)&&ageLimitRegex.push(1);                  
                })  
                if(ageLimitRegex.length!=0){
                    return this.$alert('只能输入"<正整数 或 >正整数 或 正整数—正整数",如<10、>10、10-20等',{type: 'error'});
                }               
            }                                  
            // isEmpty=this.tickForm3.filter(data=>{
            //     return data.tPeerPrice==0
            // })            
            // if(isEmpty.length!=0){
            //     return this.$alert("同行价不能为0","温馨提示",{type: 'error'}); 
            // } 
            isEmpty=this.tickForm3.filter(data=>{
                return data.sfStationShow==""
            })
            if(isEmpty.length!=0){
                return this.$alert("始发站不能为空","温馨提示",{type: 'error'}); 
            } 
            this.$refs["tickForm"].validate((valid) => {
                if(valid){                    
                let fare=this.tickForm3;
                for(let j=0;j<fare.length;j++){
                    fare[j].tPeerPrice=fare[j].tMarketPrice;
                }
                this.btnFlag = true;
                this.$http.post(api_prefix+'/ticket/saveBash',fare).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.btnFlag = false;
                    if(!this.tickForm.id){
                    this.tickForm.id = data.body.id
                    }
                    this.$alert("保存成功","温馨提示",{type: 'success'});
                    this.$router.push({ name: 'Ticketprice',query:{id: this.$route.query.id}})
                }else{
                    this.btnFlag = false;
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }                   
                },response => {
                    this.$alert("保存失败","温馨提示",{type: 'error'});
                });
            }else{
                this.$message.error('提交失败了');
            }
            });
        }, 
        // 添加新的一行
        addTr() {
            this.tickForm3.push(JSON.parse(JSON.stringify(this.tickForm3Obj)));
            // 获取tickForm3中最大id赋值，加1后赋值
            this.maxIdList=[]
            this.tickForm3.forEach(data=>{
                this.maxIdList.push(data.Index);
            });
            let maxId=Math.max.apply(null, this.maxIdList);
            this.tickForm3[this.tickForm3.length-1].Index=maxId+1;
        },
        // 删除选中行
        removeTr(){     
            if(this.selectIdList.length==0){
                this.$message.info("请选择要删除的行");  
            }else{
                this.tickForm3=this.tickForm3.filter(data=>{return this.selectIdList.indexOf(data.Index)==-1});   
                // for(let i=this.selectIdList.length;i>0;i--){               
                //     for(let j=0;j<this.tickForm3.length;j++){
                //         if(this.selectIdList[i-1]==this.tickForm3[j].Index){
                //             this.tickForm3.splice(j,1);                 
                //         }
                //     }
                // };
                this.selectIdList=[];
                this.$refs.multipleTable.clearSelection();
            }   
        },
        // 复制选中行
        cloneTr() {
            if(this.selectIdList.length==0){
                this.$message.info("请选择要复制的行"); 
            }else{
                // 获取选中行的数据
                let tempData=this.tickForm3.filter(data=>{return this.selectIdList.indexOf(data.Index)!=-1});
                tempData=JSON.parse(JSON.stringify(tempData));
                // 获取最大id
                this.maxIdList=[];
                this.tickForm3.forEach(data=>{
                    this.maxIdList.push(data.Index);
                });                
                // 修改临时数组中的index
                tempData.forEach((data,index)=>{
                    data.Index=Math.max.apply(null, this.maxIdList)+index+1
                })
                this.tickForm3=this.tickForm3.concat(tempData);
                tempData=[];
                this.selectIdList=[];
                this.$refs.multipleTable.clearSelection();  
            }         
        },               
    },
    components: {
        jdyAlert
    },     
    mounted(){
        this.getProductDetail();
        this.defaultProviceArr();
        this.getCategory();
        // this.getStationList();
    }      
}
</script>

<style>
.el-input-number{
    width:135px;
}
.getIndex{
    display:none;
}
.age_input{
    width:100px;
}
.SFstation{
    margin: 20px;
    width: 95%;    
}
</style>