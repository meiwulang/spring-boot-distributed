import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	
    Render : function(data){
		// 指定图表的配置项和数据
        var option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{b}: {c} ({d}%)"
		    },
		    color:['#f93037','#ff9600', '#d111df','#04c6c5','#84d942','#25a5f7'],
		    legend: { 
		        bottom : 'bottom',
			    y : '78%',
			    orient: 'vertical',
		    	data: data.chartNameArray,
		    	itemStyle: {
		    		fontSize: 10
		    	},
		    	 itemGap: 3
		    },
		    series: [
		       
		        {
		            name:'访问来源',
		            type:'pie',
		            fontSize: '10',
		            center: ['50%', '40%'],
		            radius: ['0%', '31%'],
		            label: {
		                normal: {
		                    formatter: '销售额: {c}\n百分比: {d}% ',
		                    lineHeight: 15,
		                    borderWidth: 20,
                    		borderRadius: 4,
                    		padding: [0, -18],
		                    rich:{
		                    	c:{
		                    		fontSize: 8
		                    	},
		                    	d:{
		                    		fontSize: 8
		                    	}
		                    }
		        
		                },
		                labelLine:{
		                	show: true,
		                	length: 100
		                }
		            },
		            data: data.chartObjectArray
		        }
		    ]
		};
        _.EchartsInit("#product .char",option);
        if(data.chartObjectArray && data.chartObjectArray.length>0){
            $('#content .data-null').hide();
        }else{
            $('#content .data-null').show();
        }
	},



};