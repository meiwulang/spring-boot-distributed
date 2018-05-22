<template>
    <div class="jdy-content jdy-resources fleft ">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
                <a href="javascript:;" title="" class="relative inlineblock fleft active" @click="goSpotInfo($route.query.type)">景点基本信息
                    <span class="absolute inlineblock"></span>
                </a>
                <a title="" href="javascript:;" class="relative inlineblock  fleft" @click="goPic($route.query.type)" v-show="picShow">图片管理
                    <span class="absolute inlineblock"></span>
                </a>
            </div>
            <el-form :model="ruleform" :rules="rules" ref="ruleform" class="demo-form" label-width="150px">
                <el-row class="mt30  pr50">
                    <el-col :span="12">
                        <el-form-item label="景点名称:" prop="sName">
                            <el-input v-model="ruleform.sName" placeholder="请输入景点名称">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="景点简称:">
                            <el-input v-model="ruleform.sSortName" placeholder="请输入景点简称">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="景点电话:">
                            <el-input v-model="ruleform.sPhone" placeholder="请输入景点电话">
                            </el-input>
                        </el-form-item>
                        <!--景点属性-->
                        <el-form-item label="景点属性:" prop="sAttribute">
                            <el-select v-model="ruleform.sAttribute" clearable placeholder="请输入景点属性" class="all">
                                <el-option v-for="item in attributeList" :value="item.id" :label="item.dName" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="附加属性:">
                            <el-input  v-model="ruleform.sAdditional" placeholder="请输入附加属性">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="景点简介:">
                            <el-input type="textarea" v-model="ruleform.sIntroduce" placeholder="请输入景点简介">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="景点介绍:">
                            <!--<jdy-editor :content = "ruleform.sDetail" attr="pcontent" @input="editorUpdate"></jdy-editor>-->
                            <el-input type="textarea" v-model="ruleform.sDetail" placeholder="请输入景点简介">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="省份:" prop="sProvince">
                            <el-select v-model="ruleform.sProvince" clearable placeholder="请选择省份" class="all" @change="provinceChange">
                                <el-option v-for="item in provinceList" :value="item.name" :label="item.name" :key="item.id">
                                    <span :kes="item.id">{{item.name}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="城市:" prop="sCity">
                            <el-select v-model="ruleform.sCity" clearable placeholder="请选择城市" class="all" @change="cityChange">
                                <el-option v-for="item in cityList" :value="item.name" :label="item.name" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="区/县:" prop="sArea">
                            <el-select v-model="ruleform.sArea" clearable placeholder="请选择行政区" class="all" @change="areaChange">
                                <el-option v-for="item in AreaList" :value="item.name" :key="item.name" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详细地址:">
                            <el-input  v-model="ruleform.sAdress" placeholder="请输入详细地址">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="自定义目的地:" prop="sCustomPlace">
                            <el-input  v-model="ruleform.sCustomPlace" placeholder="请输入自定义目的地">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="开放时间:">
                            <el-time-picker v-model="ruleform.sStartTime" placeholder="开始时间"></el-time-picker>
                            <el-time-picker v-model="ruleform.sEndTime" placeholder="结束时间"></el-time-picker>
                        </el-form-item>
                        <!--景点等级-->
                        <el-form-item label="景点等级:" prop="sLevel">
                            <el-select v-model="ruleform.sLevel" clearable placeholder="景点等级" class="all">
                                <el-option v-for="item in levelList" :value="item.id" :label="item.dName" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地图搜索:" id="mapPosition">
                            <jyd-map :bDMapx='bDMapx' :bDMapy='bDMapy' :bcityName='bcityName' @mapClick='getPoint' :bInputVisable="false"></jyd-map>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label=" ">
                        <el-button type="primary" :disabled="btnFlag" @click="onSubmit('ruleform')">保存</el-button>
                        <el-button @click="goback">返回</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import jdyEditor from '@/components/Quilleditor';
import jydMap from '@/components/BMapComponent.vue';
export default {
    name:"",
    data(){
        return {
            btnFlag:false,
            // 表单数据
            ruleform:{
                companyId:JSON.parse(sessionStorage.loginData).uCompanyId, //临时
                sName:"",
                sSortName:"",
                sCountry :"CN",
                sProvince :"",
                sCity :"",
                sArea :"",
                sAdress :"",  //详细地址
                sAdditional :"", //附加属性
                sLevel :"", //等级
                sMapx :"",
                sMapy :"",
                sIntroduce :"", //景点简介
                sDetail :"", //景点介绍
                sAttribute :"", //景点属性
                sCustomPlace:"", //自定义目的地
                sStartTime :"", //开始时间
                sEndTime:"", //结束时间
                sPhone :"" //电话
            },
            // 规则验证
            rules: {
                sName: [{required: true, message: '请输入景点名称', trigger: 'blur' }],
                sProvince: [{ required: true, message: '请选择省份', trigger: 'change' }],
                sCity: [{ required: true, message: '请选择城市', trigger: 'change' }],
                sArea: [{required: true, message: '请选择行政区', trigger: 'change' }],
                sLevel: [{type:"number",required: true, message: '请选择景点等级', trigger: 'change' }],
                sAttribute:[{type:"number", required: true, message: '请选择景点属性', trigger: 'change' }],
                sCustomPlace:[{required: true, message: '请输入自定义目的地', trigger: 'blur' }]
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
            urlSpotId:this.$route.query.spotId,
            urlAlbumId:this.$route.query.albumId,
            // 景点属性
            attributeList:[],
            // 景点等级
            levelList:[],
        }
    },
    methods:{
        // type=0;编辑页面
        toEdit(value){
            if(this.$route.query.type==0){
                this.picShow=true;
                this.$http.get(api_prefix + 'scenic_spot/getById/'+this.$route.query.spotId).then(response => {
                    if(response.data.code == 0){
                        this.ruleform=response.data.body;
                        this.ruleform.sLevel=Number(this.ruleform.sLevel);
                        // 地图
                        this.bcityName=this.ruleform.sCity;
                        this.ruleform.sMapx=Number(this.ruleform.sMapx);
                        this.ruleform.sMapy=Number(this.ruleform.sMapy);
                        this.bDMapx=this.ruleform.sMapx;
                        this.bDMapy=this.ruleform.sMapy;
                        this.urlAlbumId=response.data.body.albumId;
                    }else{
                        this.$alert("获取当前编辑数据失败！");
                    }
                },response=>{
                    console.log("获取当前编辑数据失败！")
                });
            }
        },
        // 获取景点属性,景点等级
        getDiclist(value){
            this.$http.post(api_prefix +"Dictionaries/dictList", {dGroupId: value}).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                };
                if(value==156){
                    this.levelList=response.body.body;
                }else{
                    this.attributeList=response.body.body;
                }
                this.toEdit(value)
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
            });
        },
        // 页面跳转
        goSpotInfo(value){
            this.$router.push({ name: "scenicspotInfo",query:{type: value,spotId:this.urlSpotId,albumId:this.urlAlbumId}})
        },
        goPic(value){
            this.$router.push({ name: "scenicspotPic",query:{type: value,spotId:this.urlSpotId,albumId:this.urlAlbumId}})
        },
        goback(){
            this.$router.push({ name: "scenicspot"})
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
                    this.provinceChange(this.ruleform.sProvince)
                }
                if (this.ruleform.sProvince) {
                    this.provinceDate = this.ruleform.sProvince;
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
            this.ruleform.sProvince = value;
            let url = api_prefix + '/City/selectCities';
            let city = { level: 2, pid: id }
            this.$http.post(url, city).then(response => {
                if (response.body.code === "-1") {
                    this.$alert(response.body.message, "温馨提示", { type: 'error' });
                    return
                }
                this.cityList = response.body.body;
                if(this.$route.query.type==0){
                    this.cityChange(this.ruleform.sCity);
                }
                this.cityDate = '';
                for (var city in this.cityList) {
                    if (this.cityList[city].name == this.ruleform.sCity) {
                        this.cityDate = this.ruleform.sCity;
                        break;
                    }
                }
                this.ruleform.sCity = this.cityDate;
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
            this.ruleform.sCity = value;
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
                    if (this.AreaList[p].name == this.ruleform.sArea) {
                        this.areaDate = this.ruleform.sArea;
                    }
                }
                this.ruleform.sArea = this.areaDate;
            }, response => {
                this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
            });
        },
        areaChange(value) {  //区县值修改回掉函数
            this.ruleform.sArea = value;
        },
        getPoint(x, y) {
            this.ruleform.sMapx = x;
            this.ruleform.sMapy = y;
        },
        onSubmit(form){
            this.$refs[form].validate((valid) => {
            if(valid){
                let submitform=this.ruleform;
                // 编辑、新增判断
                let urls="";
                if(this.$route.query.type==0){
                    urls='scenic_spot/update';
                }else{
                    urls='scenic_spot/save';
                };
                // 电话正则
                let reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
                if(submitform.sPhone!="" && !reg.test(submitform.sPhone)){
                    this.$message.info('请输入正确的电话格式');
                    return;
                }
                this.btnFlag = true;
                this.$http.post(api_prefix + urls,submitform).then(response => {
                  this.btnFlag = false;
                  let data = response.body;
                  if(data.code == "0"){
                      if(this.$route.query.type==0){
                          this.$message.success('修改成功');
                          this.$router.push({ name: "scenicspot"})
                      }else{
                          this.$confirm('保存成功，是否继续添加图片？', '温馨提示', {
                              confirmButtonText: '是',
                              cancelButtonText: '否',
                              type: 'warning'
                          }).then(() => {
                              this.picShow=true;
                              this.$router.push({ name: "scenicspotPic",query:{type: 0,spotId:data.id[0],albumId:data.body}})
                          }).catch(() => {
                              this.$router.push({ name: "scenicspot"})
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
        },
        editorUpdate(value,attr) {
            this.ruleForm[attr] = value;
        }
    },
    components:{
        jdyEditor,
        jydMap
    },
    mounted() {
        this.defaultProvinceData();
        // this.toEdit();
        this.getDiclist(155);
        this.getDiclist(156);
    }
}
</script>

<style>
.el-date-editor.el-input {
    width: 355px;
}
#mapInput input{
    width:200px;
}
</style>
