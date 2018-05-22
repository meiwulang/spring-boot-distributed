Ext.onReady(function() {
    Ext.QuickTips.init();
    var prepay_window;
    Ext.form.Field.prototype.msgTarget ='qtip';
    var _url = $__app__ + '/OrderIP/getTableData';
    var _field = [];
    var _store = new SUNLINE.JsonStore(_url, _field,false);

    var s_url = $__app__ + '/OrderIP/supplyDataJson';
    var s_field = [];
    var supply_store = new SUNLINE.JsonStore(s_url, s_field,false);

    var b_url = $__app__ + '/OrderIP/buyerDataJson';
    var b_field = [];
    var buyer_store = new SUNLINE.JsonStore(b_url, b_field,false);

    /**
     * 所属公司
     */
    var conf_s = {
        displayField:'text',
        valueField:'id',
        id:'company_box_s',
        labelWidth:60,
        fieldLabel:'供应商',
        hiddenName:'supply_org_id',
        width:250,
        pageSize:20,
        value:'',
        listConfig:{
            width:400,
            minWidth:300,
            maxWidth:500
        },
        labelAlign:'right'
    };
    var company_config_s=Ext.apply(conf_s,{});
    var company_box_s= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order' },
        config:company_config_s
    });
    /**    数据  ***/
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:_store,
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            { text:'供应商id' , dataIndex:'org_id',hidden:true,width:150 },
            { text:'供应商名称' , dataIndex:'org_name',hidden:true,width:300 },
            { text: '供应商IP地址',  dataIndex: 'ip',width:150},
            { text: "供应商用户数<i class='fa fa-question-circle'></i>",  dataIndex: 'seller_count',width:120,renderer:showSupply,align:'right',tooltip: '点击该列显示供应商用户列表'},
            { text: "使用此IP下单的分销商单位数<i class='fa fa-question-circle'></i>",  dataIndex: 'sorg_count',width:220,renderer:showBuyer,align:'right',tooltip: '点击该列显示分销商单位列表'},
            { text: "订单数<i class='fa fa-question-circle'></i>",  dataIndex: 'order_count',width:150, renderer:showWin,align:'right',tooltip: '点击该列显示订单列表'},
        ],
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            company_box_s,
            '交易时间：',
            SUNLINE.ExtDateField({allowBlank:true,id:'start_time',name:'start_time',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'end_time',start:true,value:today()}),
            {xtype:'tbtext',text:'~',style:"margin-top:5px;"},
            SUNLINE.ExtDateField({id:'end_time',name:'end_time',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'start_time'}),
            {text:'查询',iconCls: 'searchico',handler:dosearch},
            {text:'导出',iconCls:'button-article',handler:doexport},
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' ,
                handler:function(){window.location.reload();}
            }
        ],
    });



    new Ext.Viewport({
        layout:'border',
        items:[grid]
    });


    /**     方法  ***/

    function dosearch(){
        var org_id=Ext.getCmp('company_box_s').getValue();
        var start_time = Ext.getCmp('start_time').getValue();
        var end_time = Ext.getCmp('end_time').getValue();
        if(!org_id){
            ExtAlert('请选择供应商！');
            return false;
        }
        SUNLINE.baseParams(_store,{org_id:org_id,start_time:start_time,end_time:end_time},true);
        _store.currentPage=1;
        _store.load();
    }

    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }
    /**
     * 显示供应商列表 --弹窗
     */
    function showSupply(v,m,r){
        if(m.record.data.seller_count) {
            v = "<a title='点击显示供应商用户列表' href='javascript:;' onclick='getSupply(\"" + m.record.data.ip + "\");' style='color:blue;text-decoration：none;'>" + v + "</a>";
        }
        return v;
    }

    var supply_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            { text: '用户名',  dataIndex: 'u_name',width:150},
            { text: '手机号',  dataIndex: 'u_mobile',width:100,},
            { text: '真实姓名',  dataIndex: 'u_realname',width:100,},
            { text: '角色权限',  dataIndex: 'r_name',width:100,},
        ],
        store:supply_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'',
            enableTextSelection: true,
            deferEmptyText:true
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:supply_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:''
        })
    });

    var supply_win =  new Ext.Window({
        width:600,
        height:500,
        maximizable : true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:supply_grid,
        scrollable:true,
        layout : 'border',
        buttons:[
            {text:'关闭', handler:function () {
                supply_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    window.getSupply= function(ip){
        var org_id=Ext.getCmp('company_box_s').getValue();
        var start_time = Ext.getCmp('start_time').getValue();
        var end_time = Ext.getCmp('end_time').getValue();
        SUNLINE.baseParams(supply_store,{ip:ip,org_id:org_id,start_time:start_time,end_time:end_time});
        supply_store.load();
        supply_store.currentPage=1;
        supply_win.setTitle(ip+'下的供应商用户列表');
        supply_win.show();
    }
    /**
     * 显示分销商列表 --弹窗
     */
    function showBuyer(v,m){
        if(m.record.data.seller_count){
            v =  "<a title='点击显示分销商单位列表' href='javascript:;' onclick='getBuyer(\""+m.record.data.ip+"\");' style='color:blue;text-decoration：none;'>"+v+"</a>";
        }
        return v;
    }

    var buyer_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            { text: '单位名称',  dataIndex: 'org_name',width:300},
            { text: '法人代表',  dataIndex: 'org_legal',width:90,},
            { text: '手机号',  dataIndex: 'org_mob',width:100,},
            { text: '区域位置',  dataIndex: 'org_province',width:160,renderer:area},
        ],
        store:buyer_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'',
            enableTextSelection: true,
            deferEmptyText:true
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:buyer_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:''
        })
    });

    var buyer_win =  new Ext.Window({
        width:700,
        height:500,
        maximizable : true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:buyer_grid,
        scrollable:true,
        layout : 'border',
        buttons:[
            {text:'关闭', handler:function () {
                buyer_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    window.getBuyer = function(ip){
        var org_id=Ext.getCmp('company_box_s').getValue();
        var start_time = Ext.getCmp('start_time').getValue();
        var end_time = Ext.getCmp('end_time').getValue();
        SUNLINE.baseParams(buyer_store,{ip:ip,org_id:org_id,start_time:start_time,end_time:end_time},true);
        buyer_store.load();
        buyer_store.currentPage=1;
        buyer_win.setTitle(ip+'下的分销商列表');
        buyer_win.show();
    }

    function area(v,m,r){
        return v+'-'+ r.get('org_city') + '-' + r.get('org_county');
    }

    /**
     * 显示订单列表 --弹窗
     */
    function showWin(v, m){
        if(m.record.data.seller_count) {
            v = "<a title='点击显示订单列表' href='javascript:;' onclick='getOrderList(\"" + m.record.data.ip + "\");' style='color:blue;text-decoration：none;'>" + v + "</a>";
        }
        return v;
    }

    //弹窗显示--订单列表
    window.getOrderList = function(ip){
        var org_id=Ext.getCmp('company_box_s').getValue();
        var order_start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var order_end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var url = $__app__ + '/OrderAdmin/seller?ip='+ip;
        url += "&start_time=" + order_start_time;
        url += "&end_time=" + order_end_time;
        url += "&org_id=" + org_id;

        if ( !prepay_window ) {
            prepay_window = new Ext.Window({
                width: Ext.getBody().getWidth() - 50,
                height: Ext.getBody().getHeight() - 50,
                closeAction: 'hide',
                modal: true,
                html: '<iframe  frameborder="0" id="order_list" name="order_list" style="width: 100%; height: 100%;" ></iframe>',
            });
        }
        prepay_window.setTitle( ip+'下的订单列表' );
        prepay_window.show();
        setTimeout(function () {
            window.order_list.location = url;
        }, 100);
    };

    function doexport(){
        var org_id=Ext.getCmp('company_box_s').getValue();
        if(!org_id){
            ExtAlert('请选择供应商！');
            return false;
        }
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var url = "org_id="+org_id;
        url += "&start_time="+start_time
        url += "&end_time="+end_time;
        window.location = $__app__+'/OrderIP/export?'+url;
    }
});