Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

//所有公司数据源
    var url = $__app__ + '/Claim/dataJson';
    var store = new SUNLINE.JsonStore(url,[],true);

    var record_url = $__app__ + '/ClaimRecord/dataJson';
    var record_store = new SUNLINE.JsonStore(record_url,[],true);

    var audit_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:330,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"ad_id_a",name:"ad_id",fieldLabel:"ID",hidden:true},
            {id:"cr_id_a",name:"cr_id",fieldLabel:"认领记录ID",hidden:true},
            {id:"ad_sub_id_a",name:"ad_sub_id",fieldLabel:"入账公司id",hidden:true},
            {id:"org_name_a",name:"org_name",fieldLabel:"入账公司",readOnly:true},
            {id:"bc_card_num_a",name:"bc_card_num",fieldLabel:"汇入账户",readOnly:true},
            {id:"ad_time_a",name:"ad_time",fieldLabel:"到款日期",labelAlign:'right',readOnly:true},
            {id:"ad_money_a",name:"ad_money",fieldLabel:"汇款金额",labelAlign:'right',readOnly:true},
            {id:"cr_claim_uname_a",name:"cr_claim_uname",fieldLabel:"认领人",readOnly:true},
            {id:"cr_claim_oid_a",name:"cr_claim_oid",fieldLabel:"公司ID",hidden:true},
            {id:"cr_claim_oname_a",name:"cr_claim_oname",fieldLabel:"认领公司",readOnly:true},
            {id:"cr_claim_remark_a",name:"cr_claim_remark",fieldLabel:"认领备注",readOnly:true,xtype:'textarea'},
            {id:"cr_audit_remark_a",name:"cr_audit_remark", fieldLabel:"审核备注",allowBlank:false,xtype:'textarea'}
        ]
    });

    var  audit_win=new Ext.Window({
        title : '审核操作',
        width : 400,
        height: 450 ,
        closeAction : 'hide',
        resizable:true,
        bodyStyle : "background:#fff;padding:5",
        layout : 'border',
        modal:true,
        items:[audit_form],
        buttons: [
            {text : '通过',act:"pass", handler:audit},
            {text : '不通过',act:"notpass", handler:audit}
        ]
    });

    audit_win.on('hide',function(){
        audit_form.getForm().reset();
    })

    var bc_url = $__app__ + '/Claim/get_company';
    var bc_store = new SUNLINE.JsonStore(bc_url,[],false);
    var org_box = new Ext.form.ComboBox({
        width:350,
        value:'',
        fieldLabel:"认领公司",
        labelWidth:80,
        id:'org_name_id',
        labelAlign:"right",
        name:'ad_sorg_name',
        allowBlank : false,
        store: bc_store,
        displayField:'org_name',
        valueField:"org_name",
        editable:false,
        typeAhead: true,
        matchFieldWidth:false,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });


    var claim_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"ad_id_c",name:"ad_id",fieldLabel:"ID",readOnly:true,hidden:true},
            {id:"org_name_c",name:"org_name",fieldLabel:"入账公司",readOnly:true},
            {id:"bc_card_num_c",name:"bc_card_num",fieldLabel:"汇入账户",readOnly:true},
            {id:"ad_time_c",name:"ad_time",fieldLabel:"到款日期",labelAlign:'right',readOnly:true},
            {id:"ad_money_c",name:"ad_money",fieldLabel:"汇款金额",labelAlign:'right',readOnly:true},
            {id:"ad_sorg_id_c",name:"ad_sorg_id",fieldLabel:"公司id",labelAlign:'right',hidden:true},
            org_box,
            {id:"cr_claim_remark_c",name:"cr_claim_remark", fieldLabel:"认领备注",allowBlank:false,xtype:'textarea'}
        ]
    });

    function day(v){
        v= new Date(parseInt(v)*1000);
        var date = Ext.Date.format(v,'Y-m-d H:i:s');
        return date;
    }

    var  claim_win=new Ext.Window({
        title : '认领操作',
        width : 410,
        height: 350 ,
        closeAction : 'hide',
        resizable:true,
        bodyStyle : "background:#fff;padding:5px",
        layout : 'border',
        modal:true,
        items:[claim_form],
        buttons: [
            {text : '认领', handler:claim},
            {text : '关闭', handler:function(){claim_win.hide();claim_form.getForm().reset();}}
        ]
    });

    claim_win.on('hide',function(){
        claim_form.getForm().reset();
        org_box.setReadOnly(false);
    })

    org_box.on('select',function(r,v,o){
        Ext.getCmp('ad_sorg_id_c').setValue(v[0].data.org_id);
    })

    claim_win.on('show',function(){
        var row=SUNLINE.getSelected(claim_grid);
        if(row.data.ad_sorg_id!=0){
            Ext.getCmp('ad_sorg_id_c').setValue(row.data.ad_sorg_id);
            bc_store.load();
            org_box.setValue(row.data.ad_sorg_name);
            org_box.setReadOnly(true);
        }
    })

   /*var company=SUNLINE.CompanyBox({
        where:{
            org_type:'分销商'
        },
        config:{
            displayField:'text',
            valueField:'id',
            id:'in_org_name',
            emptyText:'请选择分公司',
            labelWidth:60,
            width:220,
            matchFieldWidth:false,
            columnWidth:300,
            fieldLabel:"选择单位",
            labelAlign:"right"
            // renderTo:'rep-source'
        }
    });*/

    var claim_cm =[
        new Ext.grid.RowNumberer(),
        {header:"ad_id", dataIndex:"ad_id", width:50, hidden:true},
        {header:"ad_sorg_id", dataIndex:"ad_sorg_id", width:50, hidden:true},
        {header:"汇款信息", dataIndex:"ad_temp_remark", width:150},
        {header:"汇款单位", dataIndex:"ad_sorg_name", width:250},
        {header:"入账金额", dataIndex:"ad_money", width:120,renderer:money},
        {header:"操作人", dataIndex:"ad_uname", width:80},
        {header:"入账公司", dataIndex:"org_name", width:250},
        {header:"入账时间", dataIndex:"ad_time", width:140,renderer:time},
        {header:"备注", dataIndex:"ad_remark", width:280}
    ];

    function time(v){
        if(v){
            v= new Date(parseInt(v)*1000);
            var date = Ext.Date.format(v,'Y-m-d H:i:s');
            return date;
        }
    }

    var claim_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:claim_cm,
        store:store,
        tbar:[
            {text:'资金认领',id:'claim_play',iconCls:'button-edit',handler:claim_show,disabled:isDisabled('Claim::claim')},
            {text:'刷新', iconCls:'button-ref',handler:function(){store.reload()}},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'cb_search',
                cls:'search-icon-cls',
                emptyText:'单位名称、编号',
                width:200,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                        dosearch();
                    }
                }
            }
        ],
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有银行卡信息',
            deferEmptyText:true
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'银行卡信息'
        })
    });

    var record_cm =[
        new Ext.grid.RowNumberer(),
        {header:"ad_id", dataIndex:"ad_id", width:50, hidden:true},
        {header:"审核状态", dataIndex:"cr_audit_status", width:100},
        {header:"汇款信息", dataIndex:"ad_temp_remark", width:200},
        {header:"入账金额", dataIndex:"ad_money", width:120,renderer:money},
        {header:"操作人", dataIndex:"ad_uname", width:80},
        {header:"入账公司", dataIndex:"org_name", width:250},
        {header:"入账时间", dataIndex:"ad_time", width:150,renderer:time},
        {header:"备注", dataIndex:"ad_remark", width:280},
        {header:"认领人", dataIndex:"cr_claim_uname", width:80},
        {header:"认领时间", dataIndex:"cr_claim_time", width:150,renderer:time},
        {header:"认领备注", dataIndex:"cr_claim_remark", width:280},
        {header:"审核人", dataIndex:"cr_audit_uname", width:80},
        {header:"审核时间", dataIndex:"cr_audit_time", width:150,renderer:time},
        {header:"审核备注", dataIndex:"cr_audit_remark", width:280}
    ];

    var record_grid = new Ext.grid.GridPanel({
        region:'west',
        border:false,
        style : 'border-right:2px solid #009DDA;',
        width:1100,
        columns:record_cm,
        store:record_store,
        tbar:[
            {text:'审核',id:'audit_play',iconCls:'button-edit',handler:audit_show,disabled:isDisabled('Claim::audit')},
            {text:'打印认领单',id:'print_play',iconCls:'button-edit',handler:print_claim},
            {text:'刷新', iconCls:'button-ref',handler:function(){record_store.reload()}}
        ],
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有认领信息',
            deferEmptyText:true
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:record_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'认领记录'
        })
    });

    /*打印处理窗口(start)*/
    var print_win = new Ext.Window({
        title:'打印认领单',
        width:780,
        height:450,
        backColor:'#fff',
        bodyStyle:"background:#fff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="print_claim" name="print_claim" src="" style="width: 100%; height:100%;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){print_win.hide();}}
        ]
    });

    print_win.on("show",function(){
        var row=SUNLINE.getSelected(record_grid);
        var url = $__app__ + '/Claim/print_claim?_dc=' + time()+'&ad_id='+row.data.ad_id;
        window.print_claim.location = url;
    });


    function doprint(){
        window.print_claim.focus();
        window.print_claim.print();
    }

    function print_claim(){
        var row=SUNLINE.getSelected(record_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要打印的数据！');
            return;
        }
        if(row.data.cr_audit_status!='已审核'){
            Ext.Msg.alert('友情提示', '无法打印未审核通过数据！');
            return;
        }
        print_win.show();
    }

    new Ext.Viewport({
        layout : 'border',
        items : [record_grid,claim_grid]
    });

    record_grid.on('select',function(v,r){
       if(r.data.cr_audit_status=='审核中'){
           Ext.getCmp('audit_play').setDisabled(false);
       }else{
           Ext.getCmp('audit_play').setDisabled(true);
       }
    })

    function claim_show(){
        var row=SUNLINE.getSelected(claim_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要认领的流水！');
            return;
        }
        var param=Ext.apply({},row.data);
        param.ad_time=day(param.ad_time);
        claim_form.getForm().setValues(param);
        claim_win.show();
    }

    function audit_show(){
        var row=SUNLINE.getSelected(record_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要审核的申请！');
            return;
        }
        row.data.ad_time=day(row.data.ad_time);
        audit_form.getForm().setValues(row.data);
        audit_win.show();
    }

    function audit(b){
        if (!audit_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '信息填写有误，请检查！');
            return;
        }
        var s = audit_form.getForm().getValues();
        s.cr_act= b.act;
        Ext.Msg.confirm('友情提示', "是否确认审核操作？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__+'/Claim/audit',
                    params:s,
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        if (ret.status==1){
                            myMask.hide();
                            audit_win.hide();
                            store.load();
                            record_store.load();
                        }
                    }
                })
            }
        })
    }

    function claim(){
        if (!claim_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '信息填写有误，请检查！');
            return;
        }
        var s = claim_form.getForm().getValues();
        Ext.Msg.confirm('友情提示', "是否确定认领该银行卡吗？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__+'/Claim/claim',
                    params:s,
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        if (ret.status==1){
                            myMask.hide();
                            claim_win.hide();
                            store.load();
                            record_store.load();
                        }
                    }
                })
            }
        })
    }

    function dosearch(){
        var key=Ext.getCmp('cb_search').getValue();
        SUNLINE.baseParams(store,{skey:key});
        store.currentPage=1;
        store.load();
    }

});
