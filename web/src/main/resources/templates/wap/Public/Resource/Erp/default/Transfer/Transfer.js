/**
 * Created by Administrator on 15-12-7.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var company_box = SUNLINE.CompanyBox();
    var thisTitle = '接送统计';
    var url=$__app__+'/Transfer/count';
    var store=SUNLINE.JsonStore(url,[]);
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"s_id", dataIndex:"s_stid", width:50, hidden:true},
        { text: '接送类型',  dataIndex: 's_type',width:130,renderer:renderType},
        { text: '接送时间',  dataIndex: 's_sttime',width:130},
        // { text: '订单号',  dataIndex: 's_o_number',width:150},
        // { text: '产品信息',dataIndex:'o_product_name',width:250,renderer:renderProduct },
        { text: '接送客站',  dataIndex: 's_stname',width:130},
        { text: '接送人数',  dataIndex: 's_count',width:130},
        { text: '订单数量',  dataIndex: 's_o_num',width:130}
        // { text: '接送日期',dataIndex:'s_date',width:100,renderer:renderSPick},
        // { text: '送客日期',  dataIndex: 's_end_date',width:100,renderer:renderEPick},
        // { text: '送客站',  dataIndex: 's_end_stname',width:130},
        // { text: '送客人数',  dataIndex: 's_end_count',width:130},
        // { text: '游客信息',  dataIndex: 's_vip_name',width:180,renderer:renderVip},
        // { text: '供应商',  dataIndex: 'o_worg_name',width:180},
        // { text: '分销商',  dataIndex: 'o_sorg_name',width:200}
    ];

    function renderType(v,i,r) {
        switch (v) {
            case '接客':
                return '<span style="padding:2px 4px 2px 4px;background: grey;border-radius: 3px;color:#FFFFFF">接客</span>';
            case '送客':
                return '<span style="padding:2px 4px 2px 4px;background: dodgerblue;border-radius: 3px;color:#FFFFFF">送客</span>';
            default:
                break;
        }
    }
    function renderProduct(v,i,r){
        return '['+r.get('o_product_num')+']'+v;
    }
    function renderSPick(v,i,r){
        return number2date(v);
    }
    function renderEPick(v,i,r){
        return number2date(v);
    }
    function renderVip(v,i,r){
        return v+r.get('s_vip_mob');
    }

    company_box.store.on({
        beforeload:function(store,options){
            Ext.apply(store.proxy.extraParams, {org_type:'供应商'});
        },
        load:function(){
            company_box.store.add({id:0,text:'全部供应商'});
            company_box.store.sort({property : 'id',direction: 'ASC'});
        }
    });
    if(_uinfo.org_type=='管理公司'){
        company_box.setValue('全部供应商');
    }else{
        company_box.setHidden(true);
        company_box.setDisabled(true);
    }

    // var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
    //     groupHeaderTpl: "接送类型: {name}"
    // });
    var grid = new Ext.grid.GridPanel({
    // var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        border:false,
        store:store,
        columns:cm,
        style :'border-right-width:1px;',
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {
                id:"goto_type",
                name:"goto_type",
                fieldLabel:"接送类型",
                xtype:"combo",
                editable:false,
                width:130,
                labelWidth:60,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['goto_type'],
                    data:[
                        ['全部'],
                        ['去程'],
                        ['返程']
                    ]
                }),
                displayField:"goto_type",
                valueField:"goto_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"全部"
            },
            '-',
            {
                id:"count_type",
                name:"count_type",
                fieldLabel:"筛选",
                xtype:"combo",
                editable:false,
                width:130,
                labelWidth:30,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['count_type'],
                    data:[
                        ['接送时间'],
                        ['接送客站']
                    ]
                }),
                displayField:"count_type",
                valueField:"count_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"接送时间"
            },
            '-',
            {
                xtype:'datefield',
                id:'station_date',
                name:'station_date',
                width:180,
                labelWidth:60,
                fieldLabel:"接送日期",
                format: 'Y-m-d',
                value:new Date(),
                start:true
            },
            '-',
            company_box,
            '-',
            {
                xtype:'textfield',
                id:'station_name',
                name:'station_name',
                width:150,
                labelWidth:30,
                fieldLabel:"站点",
                value:'',
                start:true
            },
            {text:'查询', iconCls:'button-sch',handler:doSearch},
            '-',
            {text:'打印计划单',id:'print_plan_btn',iconCls:'button-print', act:'print_detail', handler:print},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            // '-',
            // {text:'导出',iconCls:'button-article',handler:downExcel},
            // '->',
            // '快速搜索：',
            // {
            //     xtype:'trigger',
            //     triggerCls:'x-form-search-trigger',
            //     id:'_Search',
            //     cls:'search-icon-cls',
            //     emptyText : '订单号/游客姓名/游客手机号等',
            //     // width:250,
            //     onTriggerClick:function(e){
            //         doSearch();
            //     },
            //     listeners :{
            //         "specialkey" : function(_t, _e){
            //             if (_e.keyCode==13)
            //                 doSearch();
            //         }
            //     }
            // },
            // '-',
            // {
            //     icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
            //     cls: 'x-btn-icon',
            //     tooltip: '重载' + thisTitle,
            //     handler:function(){window.location.reload();}
            // }
        ],
        listeners:{
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            }
        }
    })

    function downExcel(){
        var url = '';
        url += 'type='+Ext.getCmp('goto_type').getValue();
        url += 'count_type=' + Ext.getCmp('count_type').getValue();
        url += '&station_date='+Ext.Date.format(new Date(Ext.getCmp('station_date').getValue()),'Y-m-d');
        url += '&station_name='+Ext.getCmp('station_name').getValue();
        var worg = company_box.getValue();
        if(!isNaN(worg) && worg>0){
            url += '&worg_id='+worg;
        }
        window.location = $__app__+'/Transfer/downExcel?'+url;
    }

    function doSearch(t){
        var params = {};
        if(!t){
            params.skey = Ext.getCmp('_Search').getValue();
        }
        var worg = company_box.getValue();
        if(!isNaN(worg) && worg>0){
            params.s_worg_id = worg;
        }
        params.type = Ext.getCmp('goto_type').getValue();
        params.count_type = Ext.getCmp('count_type').getValue();
        params.station_date = Ext.getCmp('station_date').getValue();
        params.station_name = Ext.getCmp('station_name').getValue();
        SUNLINE.baseParams(store,params);
        store.currentPage =1;
        store.load();
    }

    /*打印处理窗口(start)*/
    var cd_win = new Ext.Window({
        title:'账单打印',
        width:810,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="810" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint, id:'doprint_btn'},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });

    cd_win.on("show",function(){
        var row=SUNLINE.getSelected(grid);
        // var url = $__app__ + '/Transfer/BillPrint?_dc=' + time()+'&wno='+row.data.w_number+'&id='+row.data.w_id;
        $type = row.data.s_type == '接客' ? 1 : 2;
        var url = $__app__ + '/Transfer/transferPrint/s_date/'+row.data.s_date+'/s_stid/'+
            row.data.s_stid + '/s_sttime/' + row.data.s_sttime+ '/s_type/' + $type + '/org_id/' + row.data.s_worg_id;
        window.ifm_print.location = url;
    });




    function print(b){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            var msg = '请选择要打印的接送站点！';
            Ext.Msg.alert('友情提示',msg);
            return false;
        }
        cd_win.show();
        cd_win.setTitle('接送详情打印');
    }

    /**
     * 打印
     */
    function doprint() {
        window.ifm_print.focus();
        window.ifm_print.print();
    }


    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })


    ziyo_log({ listeners : [{grid: grid, action:'Transfer', pk_id:'s_id'}] });

});