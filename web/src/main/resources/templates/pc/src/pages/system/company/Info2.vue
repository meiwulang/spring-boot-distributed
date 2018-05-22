<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
                <a href="#/company/info" title="" class="relative inlineblock fleft active">基本信息
                    <span class="absolute inlineblock"></span>
                </a>
                <a title="" href="#/company/enclosure" class="relative inlineblock  fleft">附加信息
                    <span class="absolute inlineblock"></span>
                </a>
                <a title="" href="#/company/setting" class="relative inlineblock  fleft">设置
                    <span class="absolute inlineblock"></span>
                </a>
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
                                <el-form-item label="所属单位:" prop="tType">
                                    <el-input v-model="tickForm2.tName"></el-input>
    
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="单位类型:" prop="tName">
                                    <el-select v-model="tickForm2.tType" placeholder="请选择单位类型" class="all">
                                        <el-option :key="0" label="单位类型1" value="0">
                                        </el-option>
                                        <el-option :key="1" label="单位类型2" value="1">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
    
                        </el-row>
    
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="单位名称:">
                                    <el-input v-model="tickForm2.tName" placeholder="请选择单位名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="服务电话:" prop="">
                                    <el-input v-model="tickForm2.tName" placeholder="请输入服务电话"></el-input>
                                </el-form-item>
                            </el-col>
    
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="单位地址:">
                                    <el-input v-model="tickForm2.tName" placeholder="请选择单位地址"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="省份:" prop="province">
                                    <el-select v-model="tickForm2.province" clearable placeholder="省份" class="all">
                                        <el-option key="1" label="省份1" :value="1">
                                        </el-option>
                                        <el-option key="2" label="省份2" :value="2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                
                            </el-col>
    
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="城市:" prop="city">
                                    <el-select v-model="tickForm2.city" clearable placeholder="城市" class="all">
                                        <el-option key="1" label="城市1" :value="1">
                                        </el-option>
                                        <el-option key="2" label="城市2" :value="2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="区/县:" prop="city">
                                    <el-select v-model="tickForm2.city" clearable placeholder="城市" class="all">
                                        <el-option key="1" label="区/县1" :value="1">
                                        </el-option>
                                        <el-option key="2" label="区/县2" :value="2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="传真:" prop="tMarketPrice">
                                    <el-input v-model="tickForm2.tName" placeholder="请选择传真"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="独立结算:" prop="city">
                                    <el-radio class="radio" v-model="tickForm2.radio" label="1">备选项</el-radio>
                                    <el-radio class="radio" v-model="tickForm2.radio" label="2">备选项</el-radio>
                                </el-form-item>
                            </el-col>
                        </el-row>
    
                    </div>
                    <div class="clarfix alertAddProduct2-table pb30 mt60">
    
    
                        <div class="p10 border pb30">
                            <div class="ticketmanage-title tc">
                                <span>--负责人信息--</span>
                            </div>
    
                            <el-row class="mt30">
                                <el-col :span="12">
                                    <el-form-item label="姓名:" prop="tType">
                                        <el-input v-model="tickForm2.tName" placeholder="请输入姓名"></el-input>
    
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="手机号码:" prop="tName">
                                        <el-input v-model="tickForm2.tName" placeholder="请输入手机号码"></el-input>
                                    </el-form-item>
                                </el-col>
    
                            </el-row>
    
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="联系电话:">
                                        <el-input v-model="tickForm2.tName" placeholder="请输入联系电话"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                    <el-form-item label="单位简介:">
                                        <el-input v-model="tickForm2.tName" type="textarea" placeholder="请输入单位简介"></el-input>
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
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            /*票价添加*/
            tickForm2: {
                "tType": "", //票价类型
                "tName": "",//票价名称
                "tLimitType": "",//限制类型
                "tCategory": "",//票价类目
                "tTraffic": "",//交通类目
                "tLimitCondition": "",//限制条件
                "tMarketPrice": 1,//门市价
                "tPeerPrice": 2,//同行价
                "tPriceAdd": 3,//补房差
                "tPriceReduce": 3,//退房差
                "tStock": 1,//库存量
                "tEffectWeek": [],//周几有效
                "sets": "",//投放市场
                "departureList": "",//始发站
                "tIntroduction": "",//票价简介
                "radio": "1"
            },
            /*校验*/
            rules: {
                tType: [{ required: true, message: '请输入票价类型', trigger: 'change' }],
                tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' }],
                tTraffic: [{ required: true, message: '请输入交通类目', trigger: 'change' }],
                tPeerPrice: [{ required: true, message: '请输入同行价', trigger: 'blur' }],
                tEffectWeek: [{ required: true, message: '请选择周几有效', trigger: 'change' }],
                tMarketPrice: [{ required: true, message: '请输入门市价', trigger: 'blur' }],
                sets: [{ required: true, message: '请输入投放市场', trigger: 'blur' }]
            },
            multipleSelection: [],
            multipleSelection3: [],
            radio: 1
        }
    },
    methods: {
        goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                location.href = 'http://localhost:9090/system.html#/company';
            }).catch(() => {

            });

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
        }
    }
}
</script>

<style>

</style>
