<template>
    <div class="jdy-content jdy-resources fleft ">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
                <a href="javascript:;" title="" class="relative inlineblock fleft active" @click="goHotelInfo($route.query.type)">酒店基本信息
                    <span class="absolute inlineblock"></span>
                </a>
                <a title="" href="javascript:;" class="relative inlineblock  fleft" @click="goPic($route.query.type)" v-show="picShow">图片管理
                    <span class="absolute inlineblock"></span>
                </a>
            </div>
            <el-form :model="ruleform" :rules="rules" ref="ruleform" class="demo-form" label-width="150px">
                <el-row class="mt30  pr50">
                    <el-col :span="12">
                        <el-form-item label="酒店名称:" prop="hName">
                            <el-input v-model="ruleform.hName" placeholder="请输入酒店名称">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="酒店简称:">
                            <el-input v-model="ruleform.hShortName" placeholder="请输入酒店简称或缩写">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="附加属性:" prop="">
                            <el-input  v-model="ruleform.hAdditional" placeholder="请输入附加属性">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="酒店星级:" prop="hLevel">
                            <el-select v-model="ruleform.hLevel" clearable placeholder="请选择酒店星级" class="all">
                                <el-option v-for="item in levelList" :value="item.id" :label="item.dName" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="酒店简介:" prop="">
                            <el-input type="textarea" v-model="ruleform.hIntroduce" placeholder="请输入酒店简介">
                            </el-input>
                        </el-form-item>
                        <el-form-item label=" " prop="">
                            <el-button type="primary" @click="onSubmit('ruleform')" :disabled="btnFlag">保存</el-button>
                            <el-button @click="goback">返回</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="省份:" prop="hProvince">
                            <el-select v-model="ruleform.hProvince" clearable placeholder="请选择省份" class="all" @change="provinceChange">
                                <el-option v-for="item in provinceList" :value="item.name" :label="item.name" :key="item.id">
                                    <span :kes="item.id">{{item.name}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="城市:" prop="hCity">
                            <el-select v-model="ruleform.hCity" clearable placeholder="请选择城市" class="all" @change="cityChange">
                                <el-option v-for="item in cityList" :value="item.name" :label="item.name" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="区/县:" prop="hArea">
                            <el-select v-model="ruleform.hArea" clearable placeholder="请选择行政区" class="all" @change="areaChange">
                                <el-option v-for="item in AreaList" :value="item.name" :key="item.name" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详细地址:" prop="">
                            <el-input  v-model="ruleform.hAdress" placeholder="请输入详细地址">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="地图搜索:" id="mapPosition">
                            <jyd-map :bDMapx='bDMapx' :bDMapy='bDMapy' :bcityName='bcityName' @mapClick='getPoint' :bInputVisable="false" ></jyd-map>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import jydMap from '@/components/BMapComponent.vue';
export default {
    name:"",
    data(){
        return {
            btnFlag:false,
            // 表单数据
            ruleform:{
                companyId:JSON.parse(sessionStorage.loginData).uCompanyId, //临时
                hName:"",
                hShortName:"",
                hCountry :"CN",
                hProvince :"",
                hCity :"",
                hArea :"",
                hAdress :"",  //详细地址
                hAdditional :"", //附加属性
                hLevel :"", //等级
                hMapx :null,
                hMapy :null,
                hIntroduce :"",     //酒店简介
            },
            // 规则验证
            rules: {
                hName: [{required: true, message: '请输入酒店名称', trigger: 'blur' }],
                hProvince: [{ required: true, message: '请选择省份', trigger: 'change' }],
                hCity: [{ required: true, message: '请选择城市', trigger: 'change' }],
                hArea: [{required: true, message: '请选择行政区', trigger: 'change' }],
                hLevel: [{ type: 'number',required: true, message: '请选择酒店星级', trigger: 'change' }],
            },
            // 用于省，市，区相关
            provinceDate: "",
            cityDate: "",
            areaDate: "",
            provinceList: [],
            cityList: [],
            AreaList: [],
            // 地图数据
            bDMapx: null,
            bDMapy: null,
            bcityName: null,
            //隐藏
            picShow:false,
            // url数据
            urlHotelId:this.$route.query.hotelId,
            urlAlbumId:this.$route.query.albumId,
            // 酒店等级
            levelList:[],
        }
    },
    methods:{
        // type=0;编辑页面
        toEdit(value){
            if(this.$route.query.type==0){
                this.picShow=true;
                this.$http.get(api_prefix + 'hotel/get/'+this.$route.query.hotelId).then(response => {
                    if(response.data.code == 0){
                        this.ruleform=response.data.body;
                        this.ruleform.hLevel=Number(this.ruleform.hLevel);
                        // 地图
                        this.bcityName=this.ruleform.hCity;
                        this.ruleform.hMapx=Number(this.ruleform.hMapx);
                        this.ruleform.hMapy=Number(this.ruleform.hMapy);
                        this.bDMapx=this.ruleform.hMapx;
                        this.bDMapy=this.ruleform.hMapy;
                        this.urlAlbumId=response.data.body.albumId;
                    }else{
                        this.$alert("获取当前编辑数据失败！");
                    }
                },response=>{
                    console.log("获取当前编辑数据失败！")
                });
            }
        },
        // 获取酒店等级
        getDiclist(value){
            this.$http.post(api_prefix +"Dictionaries/dictList", {dGroupId: value}).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                };
                this.levelList=response.body.body;
               this.toEdit(value)
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });
        },
        // 页面跳转
        goHotelInfo(value){
            this.$router.push({ name: "hotelInfo",query:{type: value,hotelId:this.urlHotelId,albumId:this.urlAlbumId}})
        },
        goPic(value){
            this.$router.push({ name: "hotelPic",query:{type: value,hotelId:this.urlHotelId,albumId:this.urlAlbumId}})
        },
        defaultProvinceData() { //加载省列表
            let url = api_prefix + '/City/selectCities';
            let city = { level: 1 }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.provinceList = response.body.body;
                if(this.$route.query.type==0){
                    this.provinceChange(this.ruleform.hProvince)
                }
                if (this.ruleform.hProvince) {
                    this.provinceDate = this.ruleform.hProvince;
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
            if (id == 0 || id==undefined ) {
                return;
            }
            this.ruleform.hProvince = value;
            let url = api_prefix + 'City/selectCities';
            let city = { level: 2, pid: id }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.cityList = response.body.body;
                if(this.$route.query.type==0){
                    this.cityChange(this.ruleform.hCity);
                }
                this.cityDate = '';
                for (var city in this.cityList) {
                    if (this.cityList[city].name == this.ruleform.hCity) {
                        this.cityDate = this.ruleform.hCity;
                        break;
                    }
                }
                this.ruleform.hCity = this.cityDate;
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
            if (id == 0 || id==undefined ) {
                return;
            }
            this.ruleform.hCity = value;
            let url = api_prefix + '/City/selectCities';
            let city = { level: 3, pid: id };
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.AreaList = response.body.body;
                this.areaDate = '';
                for (var p in this.AreaList) {
                    if (this.AreaList[p].name == this.ruleform.hArea) {
                        this.areaDate = this.ruleform.hArea;
                    }
                }
                this.ruleform.hArea = this.areaDate;
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
            });
        },
        areaChange(value) {  //区县值修改回掉函数
            this.ruleform.hArea = value;
        },
        getPoint(x, y) {
            this.bDMapx = x;
            this.bDMapy = y;
            this.ruleform.hMapx = x;
            this.ruleform.hMapy = y;
        },
        goback(){
            this.$router.push({ name: "hotel"})
        },
        // 提交
        onSubmit(form){
            this.$refs[form].validate((valid) => {
            if(valid){
                let submitform=this.ruleform;
                // 编辑、新增判断
                let urls="";
                if(this.$route.query.type==0){
                    urls='hotel/update';
                }else{
                    urls='hotel/save';
                }
                this.btnFlag = true;
                this.$http.post(api_prefix + urls,submitform).then(response => {
                  this.btnFlag = false;
                let data = response.body;
                if(data.code == "0"){
                    if(this.$route.query.type==0){
                        this.$message.success('修改成功');
                        this.$router.push({ name: "hotel"})
                    }else{
                        this.$confirm('保存成功，是否继续添加图片？', '温馨提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {
                            this.picShow=true;
                            this.$router.push({ name: "hotelPic",query:{type: 0,hotelId:data.id[0],albumId:data.body}})
                        }).catch(() => {
                            this.$router.push({ name: "hotel"})
                        });
                    }

                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
                },response => {
                    this.btnFlag = false;
                    this.$alert("保存失败","温馨提示",{type: 'error'});
                });
            }else{
                this.$message.error('提交失败了');
            }
            });
        }
    },
    components: {
        jydMap
    },
    mounted() {
        this.defaultProvinceData();
        this.getDiclist(239)
       // this.toEdit();
    }
}
</script>

<style>
#mapInput input{
    width:200px;
}
</style>
