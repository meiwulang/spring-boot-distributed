Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '出团计划单';


    //产品列表容器
    var pro_url=$__app__+'/Products/dataJson';
    var pro_field=['pid'];
    var pro_store = SUNLINE.JsonStore(pro_url,pro_field);
    var pro_cm=[
        {header:"ID", dataIndex:"p_id", width:50, hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:100},
        {header:"产品主标题", dataIndex:"p_name", width:300}
    ];
    var pro_grid=new Ext.grid.GridPanel({
        region:'west',
        width : 300,
        maxWidth : 360,
        minWidth : 280,
        split : {size:3},
        collapsed : true,
        collapseMode : 'mini',
        store:pro_store,
        columns:pro_cm,
        border :false,
        style : 'border-top:3px solid #3993D3;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无产品信息。',
            deferEmptyText : true
        },
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:pro_store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有产品信息'
        })
    });  
    var _left = new Ext.Panel({
        layout : 'border',
        region:'west',
        border:false,
        split : true,
        style : 'border-right-width:1px;',
        width : 300,
        maxWidth : 360,
        minWidth : 280,
        collapsed : true,
        collapseMode : 'mini',
        items : [pro_grid]
    });
    var _grid= new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style : 'border-left-width:1px;border-right-width:1px;',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig : {emptyText: '暂无团队数据。'},


    });
    var bc_url = $__app__ + '/CreditBill/company_select';
    var bc_field = [ {name:"org_id"}];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field);
    var ci_bc_store = new Ext.form.ComboBox({
        width:350,
        value:'全部单位',
        fieldLabel:"选择单位",
        labelWidth:60,
        id:'org_name_id',
        labelAlign:"right",
        name:'org_name',
        allowBlank : false,
        store: bc_store,
        displayField:'org_name',
        valueField:"org_name",
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });
    bc_store.on('load',function(){
        this.add({org_name:'全部单位'});
        Ext.getCmp('org_name_id').setValue('全部单位');
    })
    ob_start_date_date=SUNLINE.ExtDateField({/*labelSeparator:'',*/id:'ob_start_date_id',name:'ob_start_date',labelAlign:"right",fieldLabel:"出发日期",labelWidth:60,width:165,allowBlank:true});
    var _panel = new Ext.Panel({
        layout : 'border',
        region:'center',
        border:false,
        tbar: [
            {text:'选择产品',
                handler:function(){
                    pro_grid.expand(true);
                }},
            '-',
            ci_bc_store,
            ob_start_date_date,
            //start_date,
            '-',
            {text:'查询',iconCls:'button-sch'},
            '-',
            {text:'编辑',act:'edit',iconCls:'button-edit'},
            '-',
            {text:'查看打印',act:'print',iconCls:'button-print',handler:_print},
            '-',
            {text:'查看行程',act:'print',iconCls:'button-print',handler:_print},
            '-',
            {text:'查看游客',act:'print',iconCls:'button-print',handler:_print},
            '->',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon s-btn-icon',
                text:'&nbsp;刷新',
                tooltip: '重载',
                handler:function(){window.location.reload();}
            }
        ],
        //items : [_left, _grid, _right_edit]
        items : [pro_grid,_grid]
    });
    //查看游客
    var _print_win;
    function _print(b){
        var _w = 800, _h = Ext.getBody().getHeight();
        if (!_print_win)
        _print_win= new Ext.Window({
            title : '打印',
            width : _w,
            height : _h - 50,
            modal : true,
            maximizable : true,//全屏效果
            closeAction : 'hide',
            html : '<iframe src="" id="_print_frm" name="_print_frm" frameborder="0" width="100%" height="100%"></iframe>',
            buttons:[
                {text:'打印',id:'sunline_print',xtype:'splitbutton', menu:{
                    items : [
                        {text:'浏览器打印',id:'browser_print',tooltip:'使用浏览器提供的方法打印，效果比较差。建议使用打印控件打印出更美观专业的计划单。'}
                    ]
                }},
                {text:'关闭', handler:function(){_print_win.hide();}}
            ]
        });
        //_print_win.setTitle('查看['+_row.data.team_num + '] '+ _row.data.team_p_name, b.iconCls);
        _print_win.setTitle('查看', b.iconCls);
        _print_win.setSize( _w, _h - 50 );
        _print_win.show();

        setTimeout( function(){
            if(b.text == '打印信息'){
                //var contacts = Ext.getCmp('team_print_contacts').getValue() == true ? 1 : 2;
                //window._print_frm.location = $__app__ + '/TeamPlanTpl/output/team_id/' + _row.data.team_id + '/contacts/' + contacts;// + '/journey/' + journey;
            }else if(b.text == '查看行程'){
                //var url = $__app__ + '/Goal/print_journey/'+_row.data.encode_p_id;
                //window._print_frm.location = url;
            }else if(b.text == '查看游客'){
                var url = $__app__ + '/Seat/printTraveller?_dc=' + time();
                /*url += "&bl_id="  + _row.data.team_bl_id;
                url += "&bctime=" + _row.data.team_start_time;
                url += "&p_id="   + _row.data.team_p_id;
                url += "&cfdate=" + _row.data.team_start_date;
                url += "&carnum=" + _row.data.team_bus_num;*/
                url += "&bl_id="  + '394';
                url += "&bctime=" + '11:00';
                url += "&p_id="   + '90';
                url += "&cfdate=" + '2016-02-28';
                url += "&s_bus_num=" + '1';
                window._print_frm.location = url;
            }else{
                //window._print_frm.location = $__app__ + '/TeamPlanTpl/output/team_id/' + _row.data.team_id;
            }
        },300);
    }
    new Ext.Viewport({
        layout : 'border',
        items : [_panel]
    });





});
