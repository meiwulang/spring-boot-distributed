import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	
    Render : function(res){
		var _this = this;
		var rights = '5.3%';
		 let blueC = '#5f98e7';
        let orangeC = '#ffa01e';
		if ($('#header .ul-bag .rig').hasClass('active')) {
			rights = '8%';
		}
        // 指定图表的配置项和数据
        var option = {
		    legend: {
		        left: 'center',
		        data: ['代理人新增人数趋势', '代理人累计趋势']
			},
		    yAxis : [
		        {
			        axisLabel: {
	                    show: true,
	                    textStyle: {
	                        color: '#6d7783'
	                    }
	                },
	                splitLine: {
                        show: true,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#f2f2f2']
                        }                            
                	},
		            axisLine: {
		                lineStyle: {
		                    type: 'solid',
		                    color: '#dedede'
		                 
		                }
		            }
		        }
		    ],
		    xAxis : [
		        {
		            type : 'category',
		            axisLine : {onZero: false},
		            axisLabel : {
		                show: true,
	                    textStyle: {
	                        color: '#6d7783',
	                        fonsSize: 10
	                    }
		            },
		            splitLine: {
                        show: true,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#f2f2f2']
                        }                            
                	},
		            axisLine: {
		                lineStyle: {
		                    type: 'solid',
		                    color: '#dedede'
		                }
		            },
		            boundaryGap : false,
		            // data : ['10.8', '10.14', '10.20', '10.26', '11.1', '11.7']
		            data : res.dateStringList
		        }
		    ],
		    grid: {
		        left: '3%',
		        top: '21%',
		        right: rights,
		        bottom: '8%',
		        containLabel: true
		    },
		    series : [
		        {
		            name:'代理人新增人数趋势',
		            type:'line',
		            itemStyle: {
		                normal: {
		            		color:blueC,
		            		lineStyle:{
		            			color:blueC
		            		}
		            	}
		            },
		            label: {normal: {
		               show: true,
		               position: 'top',
		               distance : 0
		           	}},
		            // data: [1000, 1500, 900, 741, 1223, 1669 ]
		            data : res.todayAgentList
		        },
		        {
		            name:'代理人累计趋势',
		            type:'line',
		            itemStyle: {
		                normal: {
		            		color:orangeC,
		            		lineStyle:{
		            			color:orangeC
		            		}
		            	}
		            },
		            label: {normal: {
		               show: true,
		               position: 'top',
		               distance : 0
		           	}},
		            // data: [500, 100, 400, 1000, 16, 32, 64, 128, 256]
		            data : res.allAgentList
		        }
		    ]
		};
        _.EchartsInit("#agent .char",option);
        option.xAxis[0].axisLabel = {    
            show: true,
	        textStyle: {
	            color: '#6d7783',
	            fontSize: 8,
	        },
	        interval: 0,  
	       	rotate:40
	    }
        _.EchartsInit("#agent .screen .son .ave",option);

        if( res.allAgentList.length < 1 && res.todayAgentList.length < 1){
            $('#content .data-null').show();
        } else{
            $('#content .data-null').hide();
        }
	},


};