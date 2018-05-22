<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
                <router-link to="/company/info" title="" class="relative inlineblock fleft active">基本信息
                    <span class="absolute inlineblock"></span>
                </router-link>

                <router-link title="" :to="{ name: 'companyEnclosure', query:{id: tickForm2.id,type:tickForm2.cType}}" class="relative inlineblock  fleft">附件信息
                    <span class="absolute inlineblock"></span>
                </router-link>
                <router-link title="" :to="{name: 'companySetting', query:{id: tickForm2.id,type:tickForm2.cType}}" class="relative inlineblock  fleft" v-show="tickForm2.cType==0">设置
                    <span class="absolute inlineblock"></span>
                </router-link>
            </div>
            <el-form :model="tickForm2" :rules="rules" ref="tickForm2" class="demo-form-inline" label-width="150px">
                <!-- <div class="jdy-tab">
                                <a style="border:0;">桂林四日游
                                    <span></span>
                                </a>
                                <el-button class="fright mt10" @click="goback('ticketprice')">返回</el-button>
                                <el-button type="primary" @click="onSubmit('tickForm2')" class="fright mt10 mr10">保存</el-button>
                            </div> -->
                <div class="tripbox clearfix  relative mt60 p10">
                    <div class="clearfix p10 border pb30">
                        <div class="ticketmanage-title tc">
                            <span>--基本信息--</span>
                        </div>
                        <el-row class="mt30">
                            <el-col :span="12">
                                <el-form-item label="单位类型:" prop="cType">
                                    <el-select v-model="tickForm2.cType" @change="TypeChange" placeholder="请选择单位类型" class="all">
                                        <el-option :key="key" v-for="(value,key) in cTypes" :label="value" :value="key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属单位:" prop="cPid">
                                    <el-select v-model="tickForm2.cPid" @change="handleChange" style="width: 100%;" :filterable="true" :remote-method="searchCompany" :loading="loading" remote clearable :disabled="tickForm2.cType==='0'">
                                        <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                                        </el-option>
                                    </el-select>
                                    <!--<el-cascader :options="selectList" v-model ="tickForm2.pid" @change="handleChange" filterable style="width: 100%;" :props="props" clearable></el-cascader>-->
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="单位名称:" prop="cName">
                                    <el-input v-model="tickForm2.cName" placeholder="请选择单位名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编号:" prop="cNo">
                                    <el-input v-model="tickForm2.cNo" placeholder="请选择编号"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="省份:" prop="cProvince">
                              <el-select v-model="provinceDate" clearable placeholder="省份" class="all" @change="provinceChange" popper-class="cProvince">
                                <el-option v-for="item in provinceList" :value="item.name" :label="item.name" :key="item.id">
                                  <span :kes="item.id">{{item.name}}</span>
                                </el-option>
                              </el-select>

                            </el-form-item>
                          </el-col>
                            <el-col :span="12">
                                <el-form-item label="传真:">
                                    <el-input v-model="tickForm2.cFax" placeholder="请选择传真"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="城市:" prop="cCity">
                                    <el-select v-model="cityDate" clearable placeholder="城市" class="all" @change="cityChange">
                                        <el-option v-for="item in cityList" :value="item.name" :label="item.name" :key="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                          <el-col :span="12">
                            <el-form-item label="服务电话:">
                              <el-input v-model="tickForm2.cSevicePhone" placeholder="请输入服务电话"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="区/县:" prop="cArea">
                                    <el-select v-model="areaDate" clearable placeholder="城市" class="all" @change="areaChange">
                                        <el-option v-for="item in AreaList" :value="item.name" :key="item.name" :label="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="独立结算:">
                                    <el-radio-group v-model="tickForm2.cSettlement" :disabled="(!tickForm2.cPid && tickForm2.cType=='1')||tickForm2.cType==0">
                                        <el-radio class="radio" label="true">是</el-radio>
                                        <el-radio class="radio" label="false">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="单位地址:" prop="cAddress">
                              <el-input v-model="tickForm2.cAddress" placeholder="请选择单位地址"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="产品类型:" prop="tEffectWeek">
                                <el-checkbox-group v-model="productTypeContent">
                                    <el-checkbox :name="key" v-for="(item,key) in productType" :label="item" :key="key" :disabled="tickForm2.cType==='1'"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="投放城市:" prop="sets">
                                <!-- <el-input v-model="tickForm2.sets"></el-input> -->
                                <div class="tfcity relative">
                                    <div class="el-input">
                                        <input autocomplete="off" v-model="selectCityArr.name" placeholder="请选择城市" type="text" class="el-input__inner" @click="showtfCity" :disabled="tickForm2.cType==='1'">
                                    </div>
                                    <!-- v-if="showtfCityFlag" em-->
                                </div>
                            </el-form-item>
                        </el-row>

                    </div>
                    <div class="clarfix alertAddProduct2-table pb30 mt60">

                        <div class="p10 border pb30">
                            <div class="ticketmanage-title tc">
                                <span>--负责人信息--</span>
                            </div>

                            <el-row class="mt30">
                                <el-col :span="12">
                                    <el-form-item label="姓名:" prop="cChargeName">
                                        <el-input v-model="tickForm2.cChargeName" placeholder="请输入姓名"></el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="手机号码:" prop="cTel">
                                        <el-input v-model="tickForm2.cTel" placeholder="请输入手机号码"></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="联系电话:">
                                        <el-input v-model="tickForm2.cPhone" placeholder="请输入联系电话"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item label="单位简介:">
                                    <el-input v-model="tickForm2.cIntroduce" type="textarea" placeholder="请输入单位简介"></el-input>
                                </el-form-item>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="clearfix pb30">
                    <el-button class="fright mt10 mr10" @click="goback()">返回</el-button>
                    <el-button type="primary" @click="onSubmit('tickForm2')" class="fright mt10 mr10">保存</el-button>
                </div>
            </el-form>
        </div>

        <jdy-alert title="投放城市选择" @closeAlert="closecfCity" v-if="showcfCityFlag" class="jdyalert showtfcity">
            <div class="showtfcityaa">
                <div class="showtfcityaa-scroll">
                    <div class="showtfcityaa-i">
                        <div class="showtfcityaaa" v-for="(value,key) in proviceArr" :key="value">
                            <div class="showtfcityaaa-head plr10 clearfix">
                                <span>{{key}}</span>
                                <el-button class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                                <el-button class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
                            </div>
                            <div class="showtfcityaaa-content plr10 clearfix">
                                <span v-for="ccitem in value" :key="ccitem.id" :dataId="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':selectCityArr.name.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alertfoot1 clearfix">
                <el-button type="primary" class="fright mt10 mr10" @click="closecfCity">取消</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="removeAll">刷新</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="selectAllAll">全选</el-button>
                <el-button type="primary" class="fright mt10 mr10" @click="saveCC">确认选择</el-button>
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
            proviceArr: {},
            props: {
                value: 'id',
                label: 'cName'
            },
            productTypeContent: [],
            productType: {
                "10": "周边短线",
                "11": "国内长线",
                "20": "出境旅游",
                "30": "邮轮",
                "40": "特色旅游",
                "50": "自助游",
                "67": "单一资源+拍"
            },
            productTypeStr: {
                "周边短线": "10",
                "国内长线": "11",
                "出境旅游": "20",
                "邮轮": "30",
                "特色旅游": "40",
                "自助游": "50",
                "单一资源+拍":"67"
            },
            showcfCityFlag: false,
            /*票价添加*/
            tickForm2: {
                "id": "",
                "cPid": "",//所属单位
                "cType": "", //单位类型
                "cName": "",//单位名称
                "cNo": "", //单位编号
                "cAddress": "",//单位地址
                "cFax": "",//传真
                "cProvince": "",//省份
                "cCity": "",//城市
                "cArea": "",//区县
                "cChargeName": "",//负责人
                "cTel": "",//手机号码
                "cPhone": "",//联系电话
                "cSevicePhone":"",//服务电话
                "cIntroduce": "",//单位介绍
                "cSettlement": "true",//是否独立结算
                "cProductType": [],//"产品类型"
                "sets": "" //投放城市
            },
            provinceDate: "",
            cityDate: "",
            areaDate: "",
            provinceList: [],
            cityList: [],
            AreaList: [],
            selectList: [],
            /*校验*/
            rules: {
                //                cType: [{ type:'number',required: true, message: '请输入单位类型', trigger: 'change' }],
                cName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                cNo: [{ required: true, message: '请输入单位编号', trigger: 'blur' }],
                cAddress: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
                cType: [{ required: true, message: '请输入单位类型', trigger: 'blur' }],
                cProvince: [{ required: true, message: '请选择省份', trigger: 'change' }],
                cCity: [{ required: true, message: '请选择城市', trigger: 'change' }],
                cArea: [{ required: true, message: '请选择区县', trigger: 'change' }],
                cChargeName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
                cTel: [{ required: true, message: '请输入负责人手机号', trigger: 'blur' }],
            },
            multipleSelection: [],
            multipleSelection3: [],
            radio: 1,
            selectCityArr: { id: [], name: [] },
            cTypes: { "0": "供应商","3":"分销中心"},
            loading: false
        }
    },
    methods: {
      searchCompany(value){
          this.defaultTableData(value);
      },
        TypeChange(value) { //单位类型修改回掉函数
            if (value == 1) {
                this.tickForm2.cProductType = [];
                this.productTypeContent = [];
                this.selectCityArr = { id: [], name: [] };
            } else {
                this.tickForm2.cPid = '';
                this.tickForm2.cSettlement = "true";
            }
            this.tickForm2.cType = value.toString();
        },
        goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ name: 'company' })
            }).catch(() => {

            });
        },
        defaultTableData(value) { //加载所属单位列表
            this.loading = true;
            let url = api_prefix + '/Company/selectAllTopCompany';
            let data = {pageIndex: 1};
            if(value){
                data.name = value;
            }
            this.$http.post(url,data, { emulateJSON: true }).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'warning' });
                    return
                }
                this.selectList = response.body.body.list
              this.loading = false;
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
                this.loading = false;
            });
        },
        defaultProvinceData() { //加载省列表
            let url = api_prefix + '/City/selectCities';
            let city = { level: 1 }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.provinceList = response.body.body
                if (this.tickForm2.cProvince) {
                    this.provinceDate = this.tickForm2.cProvince;
                }
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });
        },
        provinceChange(value) { //省修改，并加载城市列表
            let id = 0;
            for (var i in this.provinceList) {
                if (this.provinceList[i].name == value) {
                    id = this.provinceList[i].id;
                }
            }
            if (id == 0) {
                return;
            }
            this.tickForm2.cProvince = value;
            let url = api_prefix + '/City/selectCities';
            let city = { level: 2, pid: id }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.cityList = response.body.body;
                this.cityDate = '';
                for (var city in this.cityList) {
                    if (this.cityList[city].name == this.tickForm2.cCity) {
                        this.cityDate = this.tickForm2.cCity;
                        break;
                    }
                }
                this.tickForm2.cCity = this.cityDate;
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });
        },
        cityChange(value) { //城市修改回掉函数。 修改城市属性并加载区县列表
            let id = 0;
            for (var i in this.cityList) {
                if (this.cityList[i].name == value) {
                    id = this.cityList[i].id;
                }
            }
            if (id == 0) {
                return;
            }
            this.tickForm2.cCity = value;
            let url = api_prefix + '/City/selectCities';
            let city = { level: 3, pid: id }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.AreaList = response.body.body
                this.areaDate = '';
                for (var p in this.AreaList) {
                    if (this.AreaList[p].name == this.tickForm2.cArea) {
                        this.areaDate = this.tickForm2.cArea;
                    }
                }
                this.tickForm2.cArea = this.areaDate;
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
            });
        },
        areaChange(value) {  //区县值修改回掉函数
            this.tickForm2.cArea = value;
        },
        handleChange(value) { //所属单位修改回掉函数
            console.log(value);
        },
        addSingleTicket() {//添加单票

        },
        removeSingleTicket() {

        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
        ,
        handleSelectionChange3(val) {
            this.multipleSelection3 = val;
        },
        showtfCity() { // 显示投放城市弹出框
            this.showcfCityFlag = true;
            this.$nextTick(function () {
                jdyFn.setAlertStyle('showtfcity');
                jdyFn.selectCity2();
                //                this.selectCityArr = arr;
            });
        },
        closecfCity() { //关闭投放城市弹出框
            this.showcfCityFlag = false;
            $('.alertbgg').remove();
        },

        saveCC() { // 保存投放城市
            this.selectCityArr = jdyFn.selectCity2(); //数据不是时时更新，只有保存的时候才赋值
            this.closecfCity();
        },
        removeAll() { //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
        },
        selectAllAll() { //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
        },
        defaultProviceArr() { //获取投放城市列表
            this.$http.post(api_prefix + '/City/selectCityPutList', {"isopen": true}).then(response => {
                console.log(response.body.body);
                this.proviceArr = response.body.body;
            });
        },
        defalutCompanyInfo() {  //如何id不为空则为修改单位信息，这里初始化单位信息
            var id = this.$route.query.id;
            if (id) {
                this.$http.post(api_prefix + '/Company/selectCompany', { companyId: id }, { emulateJSON: true }).then(response => {
                    if( response.body.body.cPid==0){
                      response.body.body.cPid = null;
                    }
                    this.tickForm2 = response.body.body;
                    this.selectCityArr.name = this.tickForm2.sets.split(',');
                    if (this.tickForm2.cProductType) {
                        this.productTypeContent = this.tickForm2.cProductType.split(",");
                    }
                    if (this.provinceList.length) {
                        this.provinceDate = this.tickForm2.cProvince;
                    } this.tickForm2.cSettlement = this.tickForm2.cSettlement.toString();
                });
            }
        },
        onSubmit() { //提交
            this.$refs["tickForm2"].validate((valid) => {
                if (valid) {
                    let company = this.tickForm2;
                        console.log(company.cSettlement,'==================');
                    if(company.cPid){
                        if(!company.cSettlement){
                            this.$alert("请选择是否独立结算","温馨提示",{type:"warning"});
                            return;
                        }else{
                          company.cSettlement = "true";
                        }
                    }else{
                      company.cSettlement = "true";
                    }
                    let str = null;
                    for (var i = 0; i < this.productTypeContent.length; i++) {
                        if (i != 0) {
                            str += "," + this.productTypeStr[this.productTypeContent[i]];
                        } else {
                            str = this.productTypeStr[this.productTypeContent[i]];
                        }
                    }
                    // 手机号码正则
                    let mobile = /^(1[34578]\d{9})$/;
                    // 座机号码正则
                    let tel = /^(0\d{2,3}-\d{7,8})$/;
                    // 传真，联系电话，手机号码 cFax
                    if(!mobile.test(company.cTel)){
                        this.$message.info('负责人手机号码请输入正确的手机号格式');
                        return;
                    }
                    if(company.cFax!="" && !tel.test(company.cFax)){
                        this.$message.info('传真请输入正确的电话格式，区号后请加-');
                        return;
                    }
                    // if(company.cSevicePhone!="" && (!tel.test(company.cSevicePhone)&&!mobile.test(company.cSevicePhone))){
                    //     this.$message.info('服务电话请输入正确的电话格式，若座机请在区号后请加-');
                    //     return;
                    // }
                    if(company.cPhone!="" && (!tel.test(company.cPhone)&&!mobile.test(company.cPhone))){
                        this.$message.info('负责人联系电话请输入正确的电话格式，若座机请在区号后请加-');
                        return;
                    }
                    company.cProductType = str;
                    company.sets = this.selectCityArr.name.join(",");
                    this.$http.post(api_prefix + '/Company/add', company).then(response => {
                        let data = response.body;
                        if (data.code == "0") {
                            if (!this.tickForm2.id) {
                                this.tickForm2.id = data.body.id
                            }
                            this.$alert("保存成功", "温馨提示", { type: 'success' ,callback:action=>{
                              this.$router.push({ name: 'company' })
                            }});
                        } else {
                            this.$alert(data.message, "温馨提示", { type: 'error' });
                        }
                    }, response => {
                        this.$alert("保存失败", "温馨提示", { type: 'error' });
                    });
                } else {
                    this.$message.error('提交失败了');
                }
            });
        }
    },
    components: {
        jdyAlert
    },
    mounted() {
        this.defalutCompanyInfo();
        this.defaultProviceArr();
        this.defaultTableData();
        this.defaultProvinceData();
    }
}
</script>

<style>
.el-cascader-menus {
    width: 300px;
}
</style>
