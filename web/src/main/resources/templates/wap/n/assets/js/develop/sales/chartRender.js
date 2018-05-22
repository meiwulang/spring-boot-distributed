import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	render : function(data){
		var _this = this;
		var rights = '5.3%';
		 let blueC = '#5f98e7';
        let orangeC = '#ffa01e';
        let redC = '#ff4234';
		if($("#header .ul-bag .rig").hasClass("active")){
			rights = '8%';
		}
        // 指定图表的配置项和数据
        var option = {
		    legend: {
		        left: 'center',
		        data: ['订单量', '销售额(千元)','收入(千元)']
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
		            data : data.dateStrList
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
		            name:'销售额(千元)',
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
		            data : data.orderMoneyList
		        },
		        {
		            name:'订单量',
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
		            data : data.orderAmountList
		        },
                {
                    name:'收入(千元)',
                    type:'line',
                    itemStyle: {
                        normal: {
                            color:redC,
                            lineStyle:{
                                color:redC
                            }
                        }
                    },
                    label: {normal: {
                        show: true,
                        position: 'top',
                        distance : 0
                    }},
                    // data: [500, 100, 400, 1000, 16, 32, 64, 128, 256]
                    data : data.incomeAmountList
                }
		    ]
		};
        _.EchartsInit("#sales .char",option);
        option.xAxis[0].axisLabel = {    
            show: true,
	        textStyle: {
	            color: '#6d7783',
	            fontSize: 8,
	        },
	        interval: 0,  
	       	rotate:40
	    }
        _.EchartsInit("#sales .screen .son .ave",option);
      
	},
	getChartPram : function(pram){

		let newPram = {
			dateType : pram.pagaTypeFF,
			dateStrBegin : pram.start,
			dateStrEnd : pram.end
		}
		if(newPram.dateType == 5){
            newPram.dateStrBegin =  newPram.dateStrBegin.substring(0,4);
            newPram.dateStrEnd = '';
		}
		return newPram;
	},
}
	
	
	

