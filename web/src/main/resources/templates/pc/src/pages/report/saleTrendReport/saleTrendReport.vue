<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft noborder">
        <div class="jdy-content-inner">
            <el-form :model="ruleform" :inline="true" ref="ruleform">
                <div class="jdy-tab">
                    <el-row style="width: 100%;padding-top:8px">
                        <el-form-item class="yjk-mb10 ml20" label="日期区间：">
                            <el-date-picker v-model="daterange" type="daterange" placeholder="请选择日期区间" class="mr20" :picker-options="pickerOptions" @change="dateJudge">
                            </el-date-picker>                              
                        </el-form-item>   
                        <el-button class="fright" @click="goback">返回</el-button>                           
                    </el-row>                    
                </div>
            </el-form>
            <div class="jdy-table mt20">
                <div v-show="$route.query.id">代理人：{{$route.query.realName}}</div>
                <div id="saleTrendCanvas" style="width:1800px;height:600px;"></div>
            </div>
        </div>
    </div>          
</div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import API from '@/pages/report/api/index';

var echarts = require('echarts')

export default {
    name: 'trendreport',
    data() {
        return {
            //日期设置
            pickerOptions:{
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },   
            daterange:[new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],    
            ruleform:{
                id:this.$route.query.id,
                minDate:dateChange(-30).replace(/-/g,""),
                maxDate:dateChange(0).replace(/-/g,"")
            },                  
        }
    },
    mounted() {
        this.getTableData();
    },
    methods:{
        // 获取数据
        getTableData(){
            if(this.$route.query.id){
                API.saleTrend(this.ruleform).then(response => {
                    if (response.body.code == 0) {
                        this.drawLine(response.body.body.dayList,response.body.body.moneyList)
                    } else {

                    }
                })
            }else{
                API.saleAllTrend(this.ruleform).then(response => {
                    if (response.body.code == 0) {
                        this.drawLine(response.body.body.dayList,response.body.body.moneyList)
                    } else {

                    }
                })
            }
        },        
        // 画表 _date:日期，_data:数据
        drawLine(_date,_data) {
            let myChart = echarts.init(document.getElementById('saleTrendCanvas'))
            let option = {
                color: '#5793f3',
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                // legend: {
                //     data:['销售额']
                // },
                grid: {
                    top: 70,
                    bottom: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#5793f3'
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '销售额' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data:_date,
                    },
                ],
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '￥{value}'
                    },
                },                
                series: [
                    {
                        name:'销售额',
                        type:'line',
                        smooth: true,
                        data:_data,
                    }
                ]
            };            
            myChart.setOption(option);
        },
        //当输入日期区间大于31天，不能发送请求
        dateJudge(){
            let days=DateDiff(this.daterange[1].FormatDate('yyyy-MM-dd'),this.daterange[0].FormatDate('yyyy-MM-dd'));
            if(days>31){
                this.daterange=[];
                this.$message.info('查询日期范围不能超过31天，请重新选择查询日期范围');              
            }else{
                this.ruleform.minDate=this.daterange[0].FormatDate('yyyy-MM-dd').replace(/-/g,"");
                this.ruleform.maxDate=this.daterange[1].FormatDate('yyyy-MM-dd').replace(/-/g,"");
                this.getTableData();
            }
        }, 
        goback(){
            this.$router.push({ name: "agentSalesReport",})
        },
    },

}
</script>

<style scoped>

</style>
