function Start(){

	this.Init();
}
Start.prototype = {
	Init : function(){
		this.echartsHuan();
		this.echartsBin();
		this.echartsZhu();
		this.Event();
	},
	echartsHuan : function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts-huan'));

        // 指定图表的配置项和数据
        var option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    legend: {
		        orient: 'horizontal',
		        y: 'bottom',
		        padding: [0,0,20,0],
		        itemGap: 5,
		        data:json_order_status.key
		    },
		    series: [
		        {
		            name:'订单信息',
		            type:'pie',
		            radius: ['45%', '60%'],
		            center: ['50%','43%'],	// 中心坐标
		            avoidLabelOverlap: false,
		            label: {
		                normal: {
		                    show: false,
		                    position: 'center'
		                },
		                emphasis: {
		                    show: true,
		                    textStyle: {
		                        fontSize: '30',
		                        fontWeight: 'bold'
		                    }
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:json_order_status.val
		        }
		    ],
		    color:['#ff5a00', '#ff7a33','#ff9c66','#ffbd99','#ffdecc','#ffeecc']
		};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
	},
	echartsBin : function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts-bin'));

        // 指定图表的配置项和数据
        var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)",
                position:function(p){   //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
		    },
		    legend: {
		        orient: 'horizontal',
		        y: 'bottom',
		        padding: [0,0,20,0],
		        itemGap: 10,
		        data: json_order_payment.key
		    },
		    series : [
		        {
		            name: '支付方式',
		            type: 'pie',
		            radius : '45%',
		            center: ['50%', '45%'],
		            data:json_order_payment.val,
		            itemStyle: {

		            }
		        }
		    ],
		    color : ['#36a0c4','#5eb3d0','#86c6dc','#afd9e7']
		};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
	},
	echartsZhu : function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts-zhu'));

        // 指定图表的配置项和数据
        var option = {
		    tooltip : {
		        trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
		    },
		    legend: {
		    	padding: [20,0,0,0],
                data:['订单总金额','在线支付金额','订单数']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : json_orderMonthData.key,
                    axisPointer: {
                        type: 'shadow'
                    }
		        }
		    ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                },
                {
                    type: 'value',
                    name: '数量',
                    axisLabel: {
                        formatter: '{value} 个'
                    }
                }
            ],
		    series : [
		        {
		            name:'订单总金额',
		            type:'bar',
		            data:json_orderMonthData.total_money,
                    markLine : {
                        lineStyle: {
                            normal: {
                                type: 'solid'
                            }
                        },
                        data : [
                            {type : 'average', name: '平均值'},
                        ]
                    }
		        },
		        {
		            name:'在线支付金额',
		            type:'bar',
		            data:json_orderMonthData.online_money,
                    markLine : {
                        lineStyle: {
                            normal: {
                                type: 'solid'
                            }
                        },
                        data : [
                            {type : 'average', name: '平均值'},
                        ]
                    }
		        },
                {
                    name:'订单数',
                    type:'line',
                    yAxisIndex: 1,
                    data:json_orderMonthData.total_num,
                    markLine : {
                        lineStyle: {
                            normal: {
                                type: 'solid'
                            }
                        },
                        data : [
                            {type : 'average', name: '平均值'},
                        ]
                    }
                },
		    ],
		    color : ['#36a0c4','#a4e09b','#a06fd8']
		};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
	},
	Event : function(){
		var _this = this;
        window.onresize = function () {
            _this.echartsZhu();
        }
	}
}
new Start();
$.fn.NumChange = function(){
    $(this).each(function(){
        var $here = $(this);
        var goal = $here.attr('v');
        var start = parseFloat($here.text());
        var step = parseInt(goal/200);
        if( step < 1 ){
            step = 1;
        }
        start += step;
        if( start > goal ){
            start = goal;
        }
        var t = setTimeout(function(){
            $here.text(start);
            if( start < goal ){
                $here.NumChange();
            }
            clearTimeout(t);
        },1);
    })
}
$('.change-num').NumChange();
Ext.onReady(function () {

    var url = $__app__ + '/Users/getUserAllMenu';
    var field = ['text', 'id'];
    var left_store = SUNLINE.JsonStore(url, field, false);

    var url2 = $__app__ + '/Users/getJsonUserQuickMenu';
    var right_store = SUNLINE.JsonStore(url2, field, false);

    var leftCm = [
        { header: "ID", dataIndex: "id",align:'center',hidden:true},
        { header: "菜单名称", dataIndex: "text",align:'left' ,width:'92%'},
    ];

    //未选择的菜单
    var leftForm = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: left_store,
        columns: leftCm,
        border: false,
        selModel: { selType: 'checkboxmodel'},
        height:430,
        viewConfig: { emptyText: '暂无数据！'},
    });

    //已选择的菜单
    var rightForm = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: right_store,
        columns: leftCm,
        border: false,
        selModel: { selType: 'checkboxmodel'},
        viewConfig: { emptyText: '暂无数据！'},
    });


    //快捷菜单设置窗口
    var bindMenu = Ext.create('Ext.window.Window', {
        width:950,
        height:550,
        bodyBorder: true,
        layout: 'border',
        viewModel: true,
        modal: true,
        title: '快捷菜单设置',
        closeAction: 'hide',
        items:[{
            region: 'west',
            collapsible: false,
            autoScroll:true,
            title: '未选择菜单',
            width: 450,
            cls : 'not_join_product',
            items:[leftForm]
        }, {
            region: 'center',
            activeTab: 0,
            cls : 'move_product',
            html:'<div class="but-id">' +
            '<span class="but-in"><img src="/img/move_right.png"/></span>' +
            '<span class="but-out"><img src="/img/move_left.png"/></span>' +
            '</div>',
        },{
            region: 'east',
            title: '已选择菜单',
            collapsible: false,
            autoScroll:true,
            width: 450,
            cls : 'al_join_product',
            items:[rightForm],
            emptyText:'暂无数据',
        }],
        buttons: [{
            id: 'bind_product_save',
            text: '保存',
            handler: function () {
                var data  = [];
                right_store.each(function(record){
                    data.push(record.get('id')) ;
                });
                if(data.length > 20){
                    Ext.Msg.alert('友情提示', '最多只能设置20个快捷菜单！');
                    return false;
                }
                data  = data.join(',');

                Ext.Ajax.request({
                    url : $__app__ + '/Users/saveUserQuickMenu',
                    method:'post',
                    params:{ data:data },
                    success:function(response,opts){
                        var obj=Ext.decode(response.responseText);
                        if(obj.status == 1) {
                            Ext.Msg.alert('友情提示', '保存成功！');
                            var d = new Ext.util.DelayedTask(function(){
                                window.location.reload();
                            });
                            d.delay(1000);
                        } else {
                            Ext.Msg.alert('友情提示', '保存失败！');
                        }
                    },
                    failure:function(response,opts){
                        Ext.Msg.alert('友情提示', '保存失败！');
                    }
                });
            }
        }, {
            text: '关闭',
            handler: function () {
                bindMenu.hide();
            }
        }]
    });
    bindMenu.on('show', function(){
        left_store.load();
        right_store.load();
    });

    Ext.get('plus').on('click',function(){
        bindMenu.show();
    })
    Ext.get('s1').on('click',function () {
        if(_uinfo.org_type == '分销商'){
            open_menu('买家订单','s1','OrderAdmin','buyer');
        }else{
            open_menu('卖家订单','s1','OrderAdmin','seller');
        }
    });
    Ext.get('s2').on('click',function(){
        open_menu('生成信用账款','s2','CreditList','index');
    })
    Ext.get('s3').on('click',function () {
        if(_uinfo.org_type == '分销商'){
            open_menu('买家订单','s3','OrderAdmin','buyer');
        }else{
            open_menu('卖家订单','s3','OrderAdmin','seller');
        }
    });

    $(function(){

        //选择菜单
        $(".but-in").live('click', function(){
            var data = SUNLINE.getSelected(leftForm,true);
            Ext.each(data,function(t){
                right_store.add(t);
                left_store.remove(t);
            });
        });
        //移除菜单
        $(".but-out").live('click', function(){
            var data = SUNLINE.getSelected(rightForm,true);
            Ext.each(data,function(t){
                left_store.add(t);
                right_store.remove(t);
            });
        });

    });
});
function open_menu(text,id,module,action) {
    parent.OpenTab(text, id, '', $__app__+'/'+module+'/'+action, 1);
}