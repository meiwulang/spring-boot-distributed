CITY ='杭州';
Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='qtip';
    var url = $__app__ + '/Seniority/desDataJson';
    var field = [];
    var store = new SUNLINE.JsonStore(url, field,true);
    var tableurl = $__app__ + '/Seniority/tableDataJson';
    var field = [];
    var table_store = new SUNLINE.JsonStore(tableurl, field,true);

    //有供应商的省份、城市列表
    var area_url = $__app__ + '/Seniority/getAreaList';
    var area_field = [];
    var area_store = SUNLINE.JsonStore(area_url, area_field);
    var box_area = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_area',
        fieldLabel: '请选择出发城市',
        labelWidth: 100,
        labelAlign: 'right',
        store: area_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '杭州',
        width: 400,
        pageSize:20,
        listeners: {
            select:function(c,r){
                SUNLINE.baseParams(store,{city:r[0].data.name},true);
                store.currentPage=1;
                store.load();
                SUNLINE.baseParams(table_store,{city:r[0].data.name},true);
                table_store.currentPage=1;
                table_store.load();
                CITY = r[0].data.name;
            },
            change:function(t){
                var r = t.value;
                SUNLINE.baseParams(area_store,{city:r});
                area_store.currentPage=1;
                area_store.load();
            },
            "specialkey" : function(_t, _e){
                if (_e.keyCode==13){
                    SUNLINE.baseParams(store,{city:_t.value},true);
                    store.currentPage=1;
                    store.load();
                    SUNLINE.baseParams(table_store,{city:_t.value},true);
                    table_store.currentPage=1;
                    table_store.load();
                    CITY = _t.value;
                }
            }
        }
    });
    store.load();
    store.on('load',function(){
        //地图数据
        var map_data = [];
        //坐标
        var geoCoordMap = {};
        Ext.each(store.data.items[0].data.map,function(v){
            map_data.push([{name: v.sour},{name:v.des,value:v.value}]);
        });
        for(var i in store.data.items[0].data.xy){
            geoCoordMap[i] = [parseFloat(store.data.items[0].data.xy[i].map_x),parseFloat(store.data.items[0].data.xy[i].map_y)];
        }
        set_map(map_data,geoCoordMap);
    });

    var html = '<div id="container" style="height: 100%;"></div>';
    var panel = new Ext.panel.Panel({
        region:'center',
        height:200,
        width:250,
        renderTo:Ext.getBody(),
        bodyPadding:2,
        bodyStyle:'background-color:#FFFFFF',
        html:html,
    })

    /**    数据  ***/
    var grid = new Ext.grid.GridPanel({
        region:'east',
        width:700,
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:table_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"目的地名称", dataIndex:"name", width:200},
            {header:'总人数', dataIndex:"num", width:100},
            {header:"成人数", dataIndex:"big_num", width:100},
            {header:"儿童数", dataIndex:"small_num", width:100},
        ],
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){
               store.reload()
            }},
            box_area
        ]
    });

    new Ext.Viewport({
        layout:'border',
        items:[panel,grid]
    });

    /**     方法  ***/
    function set_map(map_data,geoCoordMap){
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var color = ['#a6c84c'];
        var series = [];
        [[CITY, map_data]].forEach(function (item, i) {
            series.push({
                    name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1],geoCoordMap)
                },
                {
                    name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1],geoCoordMap)
                },
                {
                    name: item[0] + ' Top10',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        if(typeof(geoCoordMap[dataItem[1].name]) != 'undefined'){
                            return {
                                name: dataItem[1].name,
                                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                            };
                        }
                    }),
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    }
                });
        });

        option = {
            backgroundColor: '#404a59',
            title : {
                text: '目的地top10排行榜',
                subtext: '数据不是虚构滴',
                left: 'center',
                textStyle : {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:[CITY+' Top10'],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }

    var convertData = function (data,geoCoordMap) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };
});