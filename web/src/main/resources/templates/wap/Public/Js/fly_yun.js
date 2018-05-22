Fly_YUN={
    CarPrice:function(opt){
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'qtip';
        var url= $__app__ + '/CarPrice/car_json';
        var load_type=opt.load_type?false:true;
        var store=SUNLINE.JsonStore(url,[],load_type);
        var cap_level_combo_k=SUNLINE.DictComBox_false({id:'cap_level_k',name:'cap_level',fieldLabel:"团队等级",labelWidth:60,labelAlign:"right"},{'d_type':'团队等级'});
        var cap_type_combo_k=SUNLINE.DictComBox_false({id:'cap_type_k',name:'cap_type',fieldLabel:"车辆类型",labelWidth:60,labelAlign:"right"},{'d_type':'接送车辆类型'});
        var cap_level_combo=SUNLINE.DictComBox_false({id:'cap_level',name:'cap_level',fieldLabel:"团队等级",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'团队等级'});
        var cap_type_combo=SUNLINE.DictComBox_false({id:'cap_type',name:'cap_type',fieldLabel:"车辆类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'接送车辆类型'});
        cap_level_combo_k.box.getStore().on('load',function(){
            cap_level_combo_k.box.getStore().insert(100,{d_text: "全部"});
        });

        cap_type_combo_k.box.getStore().on('load',function(){
            cap_type_combo_k.box.getStore().insert(0,{d_text: "全部"});
        });

        var add_form=new Ext.form.FormPanel({
            border:false,
            region:'center',
            bodyStyle:"background:#fff;padding:5;",
            autoHeight:true,
            defaults:{xtype:'textfield',labelWidth:80,width:300,labelAlign:"right",style:'margin-top:10px;'},
            items:[
                {id:"cap_id", name:"cap_id", fieldLabel:"ID", hidden: true},
                cap_level_combo.box,
                cap_type_combo.box,
                {id:"cap_name", name:"cap_name", fieldLabel:"规则名称", allowBlank: false},
                {id:"cap_num", name:"cap_num", fieldLabel:"人数", hidden:true},
                SUNLINE.ExtDateField({id:'cap_start_date',width:300,name:'cap_start_date',labelWidth:80,labelAlign:"right",fieldLabel:"开始时间",gang:'cap_end_date',value:today(),start:true}),
                SUNLINE.ExtDateField({id:'cap_end_date',name:'cap_end_date',labelWidth:80,labelAlign:"right",fieldLabel:"截止时间",width:300,gang:'cap_start_date',value:today()}),
                {id:"cap_money", name:"cap_money", fieldLabel:"金额", allowBlank: false},
                {
                    id:"cap_team_type",
                    labelWidth:80,
                    labelAlign:"right",
                    style:'margin-top:5px;',
                    name:"cap_team_type",
                    fieldLabel:"出团类型",
                    xtype:"combo",
                    editable:false,
                    triggerAction:"all",
                    store:new Ext.data.SimpleStore({
                        fields:['combo_value'],
                        data:[
                            ['整团'],
                            ['按天']
                        ]
                    }),
                    displayField:"combo_value",
                    valueField:"combo_value",
                    mode:"local",
                    forceSelection:true,
                    typeAhead:true,
                    value:"整团"
                },
                {id:"cap_remark", name:"cap_remark", fieldLabel:"备注"}
            ]
        });

        cap_type_combo.box.on('select',function(v,r,o){
            Ext.getCmp('cap_num').setValue(r[0].data.d_extend);
        });

        var add_win=new Ext.Window({
            title : '添加明细',
            layout: 'border',
            width : 380,
            height: 370,
            closeAction : 'hide',
            resizable:false,
            modal:true,
            items:[add_form],
            buttons: [
                {text : '确定', handler:save},
                {text : '关闭', handler:function(){add_win.hide();}}
            ]
        });

        add_win.on('hide',function(){
            Ext.getCmp('cap_money').setValue('');
            Ext.getCmp('cap_type').setValue('');
        });

        var cm=[
            new Ext.grid.RowNumberer({width:30,resizable:true}),
            {header:"车辆明细ID", dataIndex:"cap_id", width:120,hidden:true},
            {header:"规则名称", dataIndex:"cap_name", width:100},
            {header:"车型", dataIndex:"cap_type", width:60},
            {header:"团队等级", dataIndex:"cap_level", width:130},
            {header:"可座人数", dataIndex:"cap_num", width:100,align:'center'},
            {header:"金额", dataIndex:"cap_money", width:100,align:'right',renderer:function(v){
                return '￥'+parseFloat(v).toFixed(2);
            }},
            {header:"开始时间", dataIndex:"cap_start_date", width:100,renderer:time},
            {header:"结束时间", dataIndex:"cap_end_date", width:100,renderer:time},
            {header:"类型", dataIndex:"cap_team_type", width:60},
            {header:"备注", dataIndex:"cap_remark", width:200}
        ];

        var grid=Ext.create('Ext.grid.Panel',{
            region:'center',
            width:500,
            store:store,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            columns:cm ,
            viewConfig:{emptyText:'没有车辆明细信息'},
            tbar:[
                {text:'添加', iconCls:'button-add',handler:modify,disabled:isDisabled('CarPrice::add')},
                {text:'编辑', iconCls:'button-edit',handler:modify,disabled:isDisabled('CarPrice::edit')},
                {text:'删除', iconCls:'button-del',handler:del,disabled:isDisabled('CarPrice::del')},
                cap_level_combo_k.box,
                cap_type_combo_k.box,
                {text:'刷新', iconCls:'button-ref',handler:function(){store.reload();}}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: pageSize,
                store:store,
                displayInfo: true,
                displayMsg: '第{0} 到 {1} 条数据 共{2}条',
                emptyMsg: '没有规则数据'
            })
        });

        cap_level_combo_k.box.on('select',function(v,r,o){
            var cap_type=cap_type_combo_k.box.getValue();
            if(v.value!='全部'){
                var cap_level=v.value;
            }
            if(cap_type=='全部'){
                cap_type='';
            }
            car_load(cap_type,cap_level);
        });

        cap_type_combo_k.box.on('select',function(v,r,o){
            var cap_level=cap_level_combo_k.box.getValue();
            if(cap_level=='全部'){
                cap_level='';
            }
            if(v.value!='全部'){
                var cap_type=v.value;
            }
            car_load(cap_type,cap_level);
        });

        function car_load(cap_type,cap_level){
            var where={};
            if(typeof grid.where=='object'){
                where=grid.where;
            }
            where.cap_type=cap_type;
            where.cap_level=cap_level;
            SUNLINE.baseParams(store,where);
            store.currentPage=1;
            store.load();
        }

        function modify(b){
            Ext.getCmp('cap_id').setValue('');
            if(b.text=='编辑'){
                var row=SUNLINE.getSelected(grid);
                if(row==null){
                    Ext.Msg.alert('提示信息','请选择您要操作的内容');
                    return false;
                }
                add_win.show();
                row.data.cap_start_date=int2date(row.data.cap_start_date);
                row.data.cap_end_date=int2date(row.data.cap_end_date);
                add_form.getForm().setValues(row.data);
            }else{
                add_win.show();
            }
            add_win.setTitle(b.text+'明细');
        }

        add_win.on('show',function(){
            cap_type_combo.box.getStore().load();
            cap_level_combo.box.getStore().load();
        });

        function save(){
            if (!add_form.getForm().isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            }
            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
            myMask.show();
            var s = add_form.getForm().getValues();
            Ext.Ajax.request({
                url:$__app__ + '/CarPrice/save',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    Ext.Msg.alert('友情提示',info.msg);
                    if (ret.status){
                        store.reload();
                        add_win.hide();
                    }
                    myMask.hide();
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }

        function del(){
            var row=SUNLINE.getSelected(grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的明细！');
                return false;
            }
            Ext.MessageBox.confirm('友情提示','确定删除该明细吗？',function(id){
                if (id == 'yes') {
                    var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                    myMask.show();
                    Ext.Ajax.request({
                        url:$__app__ + '/CarPrice/del',
                        params:{cap_id:row.data.cap_id},
                        method:'POST',
                        success:function (response, otps) {
                            myMask.hide();
                            var result = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', result.info);
                            if(result.status ==1){
                                store.reload();
                            }
                        },
                        failure:function (response, otps) {
                            myMask.hide();
                            Ext.Msg.alert('友情提示', '删除失败');
                        }
                    })
                }
            })
        }

        function today(){
            var time=new Date();
            return Ext.util.Format.date(time,'Y-m-d');
        }

        function time(v){
            return int2date(v);
        }
        return grid;
    }
};