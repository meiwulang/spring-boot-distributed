<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner">
            <el-form :model="banqiForm"  :rules="banqiRule" ref="banqiForm" class="demo-form-inline" label-width="100px">
                <div class="jdy-tab">
                    <a style="border:0;">桂林四日游
                        <span></span>
                    </a>
                    <!-- <el-button class="fright mt10" @click="goback('ticketprice')">返回</el-button>
                                        <el-button type="primary" @click="onSubmit('tickForm2')" class="fright mt10 mr10">保存</el-button> -->
                </div>
                <div class="tripbox clearfix  relative mt60">
                    <div class="clearfix p10 border pb30">
                        <div class="ticketmanage-title tc">
                            <span>--班期信息--</span>
                        </div>
                        <el-row>
                            <el-col :span="18">
                                <el-row>
                                    <el-col :span="12">
                                     <el-form-item label="班期编号:" prop="number">
                                        <el-input v-model="banqiForm2.number" placeholder="请输入班期编号">
                                        </el-input>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item label="出发时间:" prop="">
                                        <el-input v-model="banqiForm2.goTime" placeholder="如12:35">
                                        </el-input>
                                    </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                    <el-form-item label="车辆数:" prop="carNumber">
                                        <el-input v-model="banqiForm2.carNumber" placeholder="请输入车辆数">
                                        </el-input>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item label="车座位数:" prop="seatNumber">
                                        <el-input v-model="banqiForm2.seatNumber" placeholder="请输入车座位数">
                                        </el-input>
                                    </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="虚拟已售数:" prop="">
                                            <el-input v-model="banqiForm2.fictitious" placeholder="虚拟已售数">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="对号入座:" prop="" >
                                            <el-select v-model="banqiForm2.right" placeholder="请选择" class="all">
                                                <el-option :key="0" label="不对号入座" value="0">
                                                </el-option>
                                                <el-option :key="1" label="对号入座" value="1">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                         <el-form-item label="打印班次号:" prop="">
                                            <el-input v-model="banqiForm2.gonumber" placeholder="如12:35">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                         <el-form-item label="停售时间:" prop="endTime">
                                            <el-input v-model="banqiForm2.endTime" placeholder="如12:35">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-form-item label="成团人数:" prop="">
                                        <el-input-number v-model="banqiForm2.peopleNumber" :min="1"></el-input-number>
                                        </el-select>
                                    </el-form-item>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <jdy-calendar id="jdytCalendar">1232</jdy-calendar>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="clarfix alertAddProduct2-table pb30 mt60">
                        <div class="p10 border pb30 schedule-one">
                            <div class="ticketmanage-title tc">
                                <span>--票价信息--</span>
                            </div>
                            <el-table ref="multipleTable" :data="banqiForm.tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column label="适用站点" width="">
                                    <template scope="scope">{{ scope.row.applicableSite }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="票价类目" width="">
                                    <template scope="scope">{{ scope.row.tCategory }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="票价名称" width="">
                                    <template scope="scope">{{ scope.row.ticketName }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="门市价" width="">
                                    <template scope="scope">{{ scope.row.rackRate }}</template>
                                </el-table-column>
                                <!-- <el-table-column prop="" label="同行价" width="">
                                    <template scope="scope">{{ scope.row.colleaguePrice }}</template>
                                </el-table-column> -->
                                <el-table-column prop="" label="周几有效" width="">
                                    <template scope="scope">{{ scope.row.week }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="库存量" width="">
                                    <template scope="scope">{{ scope.row.inventory }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="预置类型" width="">
                                    <template scope="scope">{{ scope.row.presetType }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="限制类型" width="">
                                    <template scope="scope">{{ scope.row.restrictionType }}</template>
                                </el-table-column>
                                <el-table-column prop="" label="限制条件" width="">
                                    <template scope="scope">{{ scope.row.limitingCondition }}</template>
                                </el-table-column>

                            </el-table>

                        </div>
                    </div>
                    <div class="clarfix alertAddProduct2-table pb30 mt30 carboxss">
                        <div class="p10 border pb30 schedule-one">
                            <div class="ticketmanage-title tc">
                                <span>--车座信息--</span>
                            </div>

                            <el-table :data="tableData2" border tooltip-effect="dark" style="width: 100%" class="">
                                <el-table-column label="调整座位数" width="">

                                    <template scope="scope">
                                        <el-row class="pb10">
                                            <el-col :span="18">
                                                <el-form-item label="当前车号:" prop="">
                                                    <el-input v-model="tableData3All.car"></el-input>
                                                </el-form-item>
                                                <el-form-item label="新座位数:" prop="">
                                                    <el-input v-model="tableData3All.seatNumber"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <div class="border caredit1 tc">
                                                    <span class="icon3 inlineblock icon3-edit mt25"></span>
                                                    <p class="f12 mt010">修改</p>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column label="预留座位数" width="">
                                    <template scope="scope">
                                        <el-row class="pb10">
                                            <el-col :span="18">
                                                <el-form-item label="选择单位:" prop="">
                                                    <el-select v-model="tableData3All.company" class="all">
                                                        <el-option :key="0" label="选择单位0" value="0">
                                                        </el-option>
                                                        <el-option :key="1" label="选择单位1" value="1">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="预留时效:" prop="">
                                                    <el-input v-model="tableData3All.time"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-button class="mt10 ml10 carboxss-button">
                                                    <i class="icon3 inlineblock icon3-stay "></i>预留</el-button>
                                                <el-button class="mt11 carboxss-button">
                                                    <i class="icon3 inlineblock icon3-discharge "></i>释放</el-button>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column label="其他管理" width="">
                                    <template scope="scope">
                                        <el-col :span="9">
                                            <div class="carboxss-b tc">
                                                <i class="icon3 inlineblock icon3-suo1 mt14 mb3"></i>
                                                <p class="mt010">锁定车位</p>
                                            </div>
                                        </el-col>
                                        <el-col :span="9">
                                            <div class="carboxss-b tc ml10">
                                                <i class="icon3 inlineblock icon3-suo2 mt14 mb3"></i>
                                                <p class="mt010">解锁车位</p>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-button class=" ml10 carboxss-button">
                                                <i class="el-icon-plus blue transx07"></i>新增</el-button>
                                            <el-button class="mt11 carboxss-button">
                                                <i class="el-icon-close red  transx06"></i>删除</el-button>
                                        </el-col>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div class="carboxbb border mt30">
                                <div class="carboxbb-top">
                                    <el-row class="tc">
                                        <el-col :span="16">可用车辆信息</el-col>
                                        <el-col :span="8">座位信息</el-col>
                                    </el-row>
                                </div>
                                <div class="carboxbb-content">
                                    <el-row>
                                        <el-col :span="16">
                                            <div class="carboxbb-table">
                                                <el-table ref="singleTable" :data="tableData3" :show-header="false" highlight-current-row border height="250" @current-change="handleCurrentChange" style="width: 100%">
                                                    <el-table-column property="bus" label="bus" width="120">
                                                        <template scope="scope">BUS</template>
                                                    </el-table-column>
                                                    <el-table-column property="info" label="信息">
                                                        <template scope="scope">
                                                            <div>MRDTOO1 1号车[适用于任一个选择的日期]</div>
                                                            <div>总数：{{scope.row.info.all}}
                                                                <span class="ml10">已售：{{scope.row.info.buyed}}</span>
                                                            </div>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="carboxbb-right">
                                                <template v-for="(item,index) in tableData3[tableData3All.someIndex].seatSatus">
                                                    <div class="icon3 icon3-seat inlineblock" :class="{'icon3-seat-temporary':item.status==1,'icon3-seat-success':item.status==2,'icon3-seat-lock':item.status==3}" @click="setSeat(index)">{{index+1}}</div>
                                                </template>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <!--carboxbb end-->
                        </div>
                    </div>

                </div>
                <el-row class="">
                    <el-button type="primary" @click="onSubmit('lineForm')">保存</el-button>
                    <el-button @click="goback('schedule')">返回</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import jdyCalendar from '@/components/Calendar'
import jdyAlert from '@/components/Alert';
import sData from './s.js';
export default {
    name: "",
    data() {
        return {
            banqiForm: sData.banqiForm,
            banqiForm2: sData.banqiForm2,
            banqiRule: sData.banqiRule,
            banqiRule2: sData.banqiRule2,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            tableData2: [{
                licenseNumber: '', //车号
                seatNumber: '',//座位数
                company: '',//单位
                reservePrescription: ''//预留时效
            }],
            tableData3All: {
                car: "1",//当前车号
                seatNumber: "30",//新座位数
                company: "",//选择单位
                time: "3",//预留时效
                someIndex: '0'// 索引值
            },
            tableData3: [
                {
                    car: "",//当前车号
                    seatNumber: "",//新座位数
                    company: "",//选择单位
                    time: "",//预留时效
                    bus: "",
                    info: {
                        carNum: 1,
                        date: "",
                        all: "50",
                        buyed: "1"
                    },
                    seatSatus: [
                        {
                            status: 0 //0默认（空车位） 1暂定， 2锁定
                        },
                        {
                            status: 1
                        },
                        {
                            status: 2
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        }
                    ]
                },
                {
                    car: "",//当前车号
                    seatNumber: "",//新座位数
                    company: "",//选择单位
                    time: "",//预留时效
                    bus: "",
                    info: {
                        carNum: 1,
                        date: "",
                        all: "50",
                        buyed: "1"
                    },
                    seatSatus: [
                        {
                            status: 0 //0默认（空车位） 1暂定， 2锁定
                        },
                        {
                            status: 1
                        },
                        {
                            status: 2
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        },
                        {
                            status: 0
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        goback(url) {
            this.$confirm('数据未保存，确定返回吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                location.href = 'http://localhost:9090/transfer.html#/' + url;
            }).catch(() => {

            });

        },
        setSeat(index) {
            alert(index + 1)
        },
        addSingleTicket() {//添加单票

        },
        removeSingleTicket() {

        },
        handleCurrentChange(row) {
            console.log(row)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
        ,
        handleSelectionChange3(val) {
            this.multipleSelection3 = val;
        }
    },
    components:{
        jdyAlert,
        jdyCalendar
    }
}
</script>

<style>

</style>
