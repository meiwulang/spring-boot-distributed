/**
 * Created by cjl on 2017/6/13.
 */

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('echarts-bin'));

//指定图表的配置项和数据
var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        y: 'bottom',
        padding: [0,0,20,0],
        itemGap: 10,
        data: pic.key,
    },
    series : [
        {
            name: '支付方式',
            type: 'pie',
            radius : '55%',
            center: ['50%', '45%'],
            data: pic.val,
            itemStyle: {}
        }
    ],
    //color : ['#36a0c4','#5eb3d0','#86c6dc','#afd9e7']
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
