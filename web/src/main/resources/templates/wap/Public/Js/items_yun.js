var stock_data_rows={};
ITEMS_YUN={
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
    },
    FlySelect:function(opt,obj){
        Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
        Ext.QuickTips.init();
        Ext.form.Field.prototype.msgTarget = 'qtip';
        var sp_fld = [
            {name:"sp_id"},
            {name:"st_id"},
            {name:"sp_go_time"},
            {name:"sp_go_times"},
            {name:"st_name"},
            {name:"sp_site_name"},
            {name:"sp_price"},
            {name:"sp_settle_price"},
            {name:"city"}
        ];
        var sp_url = $__app__ + '/Widget/flights_json';
        var sp_store=SUNLINE.GroupingStore(sp_url,sp_fld,{sortInfo:{field:'sp_go_times',direction: "ASC"}, groupField:'st_name'},false,'',10);
        function start_name_fn(v,e,r){
            if(r.get('fl_type')=='飞机') return v+' '+ r.get('fl_start_platform');
            return v;
        }

        function end_name_fn(v,e,r){
            if(r.get('fl_type')=='飞机') return v+' '+ r.get('fl_end_platform');
            return v;
        }

        function number_fn(v,e,r){
            var stock='';
            if(r.get('fl_stock')){
                var fl_stock=r.get('fl_stock');
                var stock_text='';
                for(var i in fl_stock){
                    var row=fl_stock[i];
                    var tbd_price=parseFloat(row['tbd_price']);
                    if(!tbd_price)tbd_price=0;
                    var tbd_sold_num=row['tbd_sold_num']?parseFloat(row['tbd_sold_num']):0;
                    var num=parseFloat(row['tbd_num'])-tbd_sold_num;
                    var msg_type='上铺/二等/无座/头等舱';
                    if(row['tbd_type']=='一级'){
                        msg_type= '下铺/商务/商务舱';
                    }else if(row['tbd_type']=='二级'){
                        msg_type= '中铺/一等/硬座/经济舱';
                    }
                    stock_text+=msg_type+':￥'+tbd_price.toFixed(2)+'(剩余:'+row['pop_num']+'张)<br />';
                }
                stock='<span class="stock_fn" style="color: #26b4d3" data-qtip="'+stock_text+'">(库存)</span>';
            }
            return '<font color="green"><b>'+v+'</b></font> '+stock;
        }

        function fl_price_fn(v,e,r){
            if(!v.fl_a1)v.fl_a1=0;
            var type={fl_a9:'商务座',fl_a8:'一等座',fl_a7:'二等座',fl_a6:'高级软卧',fl_a5:'软卧',fl_a4:'硬卧',fl_a2:'硬座',fl_a1:'无座'};
            var qtip='';
            for(var i in v){
                var val=parseFloat(v[i]);
                if(val){
                    qtip+=type[i]+':￥'+val.toFixed(2)+'<br />';
                }
            }
            return '<font data-qtip="'+qtip+'" color="green">￥'+parseFloat(v.fl_a1).toFixed(2)+'</font>';
        }

        function money_format(v){
            v=parseFloat(v);
            if(!v)v=0;
            return '￥'+v.toFixed(2);
        }

        function fl_stock_fn(v){
            if(v) return '<a class="stock_fn" style="color: blue">使用库存</a>';
        }

        var sp_cm=[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID",dataIndex:"fl_id",width:60, hidden: true},
            {header:"交通类型",dataIndex:"fl_type",width:80},
            {header:"航班(次)号",dataIndex:"fl_number",width:100,renderer:number_fn},
            {header:"始发站",dataIndex:"fl_start_name",width:120,renderer:start_name_fn},
            {header:"发车时间",dataIndex:"fl_start_time",width:80},
            {header:"目的地站",dataIndex:"fl_end_name",width:120,renderer:end_name_fn},
            {header:"抵达时间",dataIndex:"fl_end_time",width:80}
        ];
        //票种类型Box
        var traffic_type=SUNLINE.LocalComob({
            id:'traffic_type',
            fields:['traffic_type'],
            data:[['飞机'],['火车']],
            config:{
                value:'火车',
                listeners:{}
            }
        });

        var _cof={
            fields:['sd_id','sd_name','sd_code'],url:$__app__ + '/StationStart/fen_select',
            where:{box_type:'出发口岸'},
            config:{
                width:150,
                displayField:'sd_name',
                valueField:'sd_name'
            }
        };
        _cof.id='start_site_id';
        var start_site_box=SUNLINE.ComBoxPlus(_cof);
        _cof.id='end_site_id';
        var end_site_box=SUNLINE.ComBoxPlus(_cof);


        var _tber=[
            '类型：',
            traffic_type,
            '始发站：',
            start_site_box,
            {text:'始发站ID',id:'start_site_id',xtype:'hidden'},
            {text:'始发站城市',id:'start_site_city',xtype:'hidden'},
            {text:'始发站三字码',id:'start_site_code',xtype:'hidden'},
            '目的地：',
            end_site_box,
            {text:'目的地ID',id:'end_site_id',xtype:'hidden'},
            {text:'目的地城市',id:'end_site_city',xtype:'hidden'},
            {text:'目的地三字码',id:'end_site_code',xtype:'hidden'},
            {text:'出发日期',id:'start_date',xtype:'hidden',value:opt.start_date},
            {text:'查询',handler:traffic_search}
        ];
        if(!opt.site){
            _tber=_tber.concat([
                {text:'添加航班(次)',handler:traffic_add},
                {text:'编辑航班(次)',handler:traffic_add},
                {text:'一键更新(次)',handler:st_dosearch}
            ]);
            sp_cm=sp_cm.concat([
                {header:"下铺/商务/头等舱",dataIndex:"fl_money_one",align:'right',width:120,renderer:money_format},
                {header:"中铺/一等/硬座/商务舱",dataIndex:"fl_money_two",align:'right',width:140,renderer:money_format},
                {header:"上铺/二等/无座/经济舱",dataIndex:"fl_money_three",align:'right',width:140,renderer:money_format}
            ]);
        }
        if(_uinfo.org_type=='管理公司')sp_cm=sp_cm.concat([
            {header:"参考价格",dataIndex:"fl_price",align:'right',width:100,renderer:fl_price_fn}
        ]);
        _tber=_tber.concat([
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'st_dosearch_id',
                emptyText:'航班(次)号',
                width:150,
                onTriggerClick:function (e) {
                    st_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            st_dosearch();
                        }
                    }
                }
            }
        ]);
        var sp_grid = new Ext.grid.GridPanel({
            region:'center',
            border:false,
            autoWidth : true,
            height:450,
            store:sp_store,
            /*renderTo:'flights-id',*/
            style :'border-left-width:1px;',
            loadMask:{ msg : '数据载入中，请稍后' },
            viewConfig:{
                emptyText : '选择【始发站】与【目的地】',
                deferEmptyText : true
            },
            columns:sp_cm,
            tbar:_tber,
            bbar:new Ext.PagingToolbar({
                pageSize:10,
                store:sp_store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有航班(次)信息'
            })
        });

        //当有值时执行
        if(opt.site!='yes' && opt.site){
            var site_data=opt.site;
            site_where(site_data);
        }

        function site_where(site_data){
            if(site_data['start']){
                traffic_type.setValue(site_data['start']['sd_start_type']);
                traffic_type.setDisabled(true);
                start_site_box.setValue(site_data['start']['sd_name']);
                Ext.getCmp('start_site_id').setValue(site_data['start']['sd_id']);
                Ext.getCmp('start_site_city').setValue(site_data['start']['sd_city']);
                Ext.getCmp('start_site_code').setValue(site_data['start']['sd_code']);
            }
            if(site_data['end']){
                end_site_box.setValue(site_data['end']['sd_name']);
                Ext.getCmp('end_site_id').setValue(site_data['end']['sd_id']);
                Ext.getCmp('end_site_city').setValue(site_data['end']['sd_city']);
                Ext.getCmp('end_site_code').setValue(site_data['end']['sd_code']);
            }
            if(site_data.start_date)Ext.getCmp('start_date').setValue(site_data.start_date);
            if(site_data['start'] || site_data['end']) traffic_search();
        }

        start_site_box.on({
            beforequery:function(){
                site_box_fn(this);
            }
        });
        start_site_box.on({
            select:function(c,r,e){
                var row=r[0].data;
                Ext.getCmp('start_site_code').setValue(row.sd_code);
                Ext.getCmp('start_site_city').setValue(row.sd_city);
                Ext.getCmp('start_site_id').setValue(row.sd_id);
            }
        });
        end_site_box.on({
            beforequery:function(){
                site_box_fn(this);
            }
        });
        end_site_box.on({
            select:function(c,r,e){
                var row=r[0].data;
                Ext.getCmp('end_site_code').setValue(row.sd_code);
                Ext.getCmp('end_site_city').setValue(row.sd_city);
                Ext.getCmp('end_site_id').setValue(row.sd_id);
            }
        });
        traffic_type.on({
            select:function(){
                var tf_type=traffic_type.getValue();
                SUNLINE.baseParams(start_site_box.store,{sd_start_type:tf_type});
                SUNLINE.baseParams(end_site_box.store,{sd_start_type:tf_type});
                start_site_box.store.load();
                end_site_box.store.load();
            }
        });
        function site_box_fn(t){
            var tf_type=traffic_type.getValue();
            SUNLINE.baseParams(t.store,{sd_start_type:tf_type});
        }

        function traffic_search(){
            var tf_type=traffic_type.getValue();
            var end_site=Ext.getCmp('end_site_code').getValue();
            var end_site_city=Ext.getCmp('end_site_city').getValue();
            var end_id=Ext.getCmp('end_site_id').getValue();
            var start_site=Ext.getCmp('start_site_code').getValue();
            var start_site_city=Ext.getCmp('start_site_city').getValue();
            var start_id=Ext.getCmp('start_site_id').getValue();
            var start_date=Ext.getCmp('start_date').getValue();
            if(opt.start_date)start_date=opt.start_date;
            SUNLINE.baseParams(sp_store,{tf_type:tf_type,end_site:end_site,start_site:start_site,start_site_city:start_site_city,end_site_city:end_site_city,start_id:start_id,end_id:end_id,start_date:start_date});
            sp_store.load();
        }
        function st_dosearch(t){
            console.log(t)
            var skey=Ext.getCmp('st_dosearch_id').getValue();
            var start_date=Ext.getCmp('start_date').getValue();
            var post={skey:skey};
            if(start_date)post.start_date=start_date;
            post.up_data='';
            if(!opt.site && t){
                if(t.text=='一键更新(次)')post.up_data='yes';
            }
            SUNLINE.baseParams(sp_store,post,true);
            sp_store.currentPage=1;
            sp_store.load();
        }


        //票种类型Box
        var traffic_type_box=SUNLINE.LocalComob({
            id:'fl_type',
            fields:['fl_type'],
            data:[['飞机'],['火车']],
            config:{
                labelWidth:80,
                width:300,
                value:'火车',
                labelAlign:'right',
                fieldLabel:'交通类型'
            }
        });

        _cof.id='fl_start_name';
        _cof.config.labelWidth=80;
        _cof.config.width=300;
        _cof.config.labelAlign='right';
        _cof.config.fieldLabel='始发站';
        var start_site_id=SUNLINE.ComBoxPlus(_cof);
        _cof.id='fl_end_name';
        _cof.config.fieldLabel='目的地';
        var end_site_id=SUNLINE.ComBoxPlus(_cof);

        //提交表单
        var fly_form = Ext.create('Ext.form.Panel',{
            bodyPadding: 5,
            autoScroll:true,
            width: "100%",
            defaults:{
                labelWidth:80,
                width:300,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:[
                traffic_type_box,
                {id:"fl_number", name:"fl_number", fieldLabel:"航班(次)号", allowBlank:false },
                start_site_id,
                {id:"fl_start_platform", name:"fl_start_platform", fieldLabel:"登机台"},
                {id:"fl_start_id", name:"fl_start_id", fieldLabel:"始发站ID",hidden:true},
                {id:"fl_start_code", name:"fl_start_code", fieldLabel:"始发站编码",hidden:true},
                {id:"fl_start_time", name:"fl_start_time", fieldLabel:"始发时间", allowBlank:false },
                {id:"fl_start_city", name:"fl_start_city", fieldLabel:"出发城市", hidden:true },
                end_site_id,
                {id:"fl_end_platform", name:"fl_end_platform", fieldLabel:"接机台" },
                {id:"fl_end_id", name:"fl_end_id", fieldLabel:"目的地ID",hidden:true },
                {id:"fl_end_code", name:"fl_end_code", fieldLabel:"目的地编码",hidden:true },
                {id:"fl_end_time", name:"fl_end_time", fieldLabel:"抵达时间", allowBlank:false },
                {id:"fl_end_city", name:"fl_end_city", fieldLabel:"抵达城市", hidden:true },
                {id:"fl_lishi", name:"fl_lishi", fieldLabel:"行程时间" },
                {id:"fl_money_one", name:"fl_money_one", fieldLabel:'<span class="help" data-qtip="下铺/商务/头等舱">&nbsp;</span>一级金额'},
                {id:"fl_money_two", name:"fl_money_two", fieldLabel:'<span class="help" data-qtip="中铺/一等/硬座/商务舱">&nbsp;</span>二级金额' },
                {id:"fl_money_three", name:"fl_money_three", fieldLabel:'<span class="help" data-qtip="上铺/二等/无座/经济舱">&nbsp;</span>三级金额' }
            ]
        });
        start_site_id.on({
            beforequery:function(){
                site_box_traffic(this);
            }
        });
        start_site_id.on({
            select:function(c,r,e){
                var row=r[0].data;
                Ext.getCmp('fl_start_id').setValue(row.sd_id);
                Ext.getCmp('fl_start_code').setValue(row.sd_code);
                Ext.getCmp('fl_start_city').setValue(row.sd_city);
            }
        });
        end_site_id.on({
            beforequery:function(){
                site_box_traffic(this);
            }
        });
        end_site_id.on({
            select:function(c,r,e){
                var row=r[0].data;
                Ext.getCmp('fl_end_id').setValue(row.sd_id);
                Ext.getCmp('fl_end_code').setValue(row.sd_code);
                Ext.getCmp('fl_end_city').setValue(row.sd_city);
            }
        });
        function site_box_traffic(t){
            var tf_type=traffic_type_box.getValue();
            SUNLINE.baseParams(t.store,{sd_start_type:tf_type});
        }
        traffic_type_box.on({
            select:function(){
                var tf_type=traffic_type_box.getValue();
                SUNLINE.baseParams(start_site_id.store,{sd_start_type:tf_type});
                SUNLINE.baseParams(end_site_id.store,{sd_start_type:tf_type});
                start_site_id.store.load();
                end_site_id.store.load();
            }
        });
        var fly_win = new Ext.Window({
            title : '添加航班(次)信息',
            width : 340,
            modal : true,
            fixed:true,
            closeAction : 'hide',
            items:fly_form,
            buttons:[
                {text:'确认添加',id:'fl_assign',handler:fly_add},
                {text:'关闭', handler:function () {
                    fly_win.hide();
                }}
            ]
        });
        Ext.getCmp('fl_number').on({
            blur:function(t,e,o){
                var val= t.getValue();
                var post={fl_number:val};
                Ext.Ajax.request({
                    url:$__app__ + '/Widget/train_fly_find',
                    params:post,
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        var rows=ret.info;
                        if(!rows)return false;
                        if (ret.status){
                            //始发站
                            start_site_id.setValue(rows.fl_start_name);
                            Ext.getCmp('fl_start_code').setValue(rows.fl_start_code);
                            Ext.getCmp('fl_start_time').setValue(rows.fl_start_time);
                            Ext.getCmp('fl_start_id').setValue(rows.fl_start_id);
                            Ext.getCmp('fl_start_city').setValue(rows.fl_start_city);

                            //目的地
                            end_site_id.setValue(rows.fl_end_name);
                            Ext.getCmp('fl_end_code').setValue(rows.fl_end_code);
                            Ext.getCmp('fl_end_time').setValue(rows.fl_end_time);
                            Ext.getCmp('fl_end_id').setValue(rows.fl_end_id);
                            Ext.getCmp('fl_end_city').setValue(rows.fl_end_city);
                            Ext.getCmp('fl_lishi').setValue(rows.fl_lishi);
                            var fl_money_one= 0,fl_money_two= 0,fl_money_three= 0;
                            if(rows.fl_price){
                                fl_money_one= rows.fl_price.fl_a1;
                                fl_money_two= rows.fl_price.fl_a1;
                                fl_money_three= rows.fl_price.fl_a1;
                            }
                            if(rows.fl_money){
                                if(rows.fl_money_one)fl_money_one=rows.fl_money_one;
                                if(rows.fl_money_two)fl_money_two=rows.fl_money_two;
                                if(rows.fl_money_three)fl_money_three=rows.fl_money_three;
                            }
                            Ext.getCmp('fl_money_one').setValue(fl_money_one);
                            Ext.getCmp('fl_money_two').setValue(fl_money_two);
                            Ext.getCmp('fl_money_three').setValue(fl_money_three);

                        };
                    }
                })
            }
        });

        function traffic_add(t){
            var fly=fly_form.getForm();
            if(t.text=='编辑航班(次)'){
                var row=SUNLINE.getSelected(sp_grid);
                if(!row){
                    Ext.Msg.alert('友情提示','请选择你要编辑航班(次)信息！');
                    return false;
                }
                fly.setValues(row.data);
                fly_win.setTitle('编辑航班(次)信息');
                Ext.getCmp('fl_assign').setText('确认编辑');
            }else{
                fly.reset();
                Ext.getCmp('fl_assign').setText('确认添加');
            }
            fly_win.show();
        }

        function fly_add(t){
            var fly=fly_form.getForm();
            if (!fly.isValid()) {
                Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                return;
            }
            var rst=SUNLINE.getSelected(sp_grid);
            var row=fly.getValues();
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/Widget/post_find_save',
                params: row,
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        fly_win.hide();
                        if(t.text=='确认编辑'){
                            rst.set(row);
                        }else{
                            sp_store.add(row);
                        }
                    }
                    myMask.hide();
                }
            })
        }

        //选择库存内容
        var stock_store=Ext.create('Ext.data.Store', {
            storeId: 'stock_store',
            fields:[],data: []
        });
        function td_num_fn(v,c,r){
            //var tbd_sold_num= r.get('tbd_sold_num')?parseFloat(r.get('tbd_sold_num')):0;
            return v;
        }
        function money_fn(v){
            v=parseFloat(v);
            if(!v)v=0;
            return '￥'+v.toFixed(2);
        }

        function fly_type_fn(v){
            if(v=='一级'){
                return '下铺/商务/头等舱';
            }else if(v=='二级'){
                return '中铺/一等/硬座/商务舱';
            }else{
                return '上铺/二等/无座/经济舱';
            }
        }
        var stock_cm=[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"tbd_id", width:80,hidden:true},
            {header:"类型", dataIndex:"tbd_type", width:140,renderer:fly_type_fn},
            {header:"余数", dataIndex:"pop_num",align:'center', width:80,renderer:td_num_fn},
            {header:"单价", dataIndex:"tbd_price",align:'right',width:90,renderer:money_fn}
        ];
        var stock_grid=new Ext.grid.GridPanel({
            store:stock_store,
            columns:stock_cm,
            autoScroll:true,
            bodyBorder: false,
            height:140
        });
        var stock_win = new Ext.Window({
            title : '选择库存票',
            width : 400,
            height : 240,
            modal : true,
            fixed:true,
            closeAction : 'hide',
            items:stock_grid,
            buttons:[
                {text:'确认选择',handler:stock_vf},
                {text:'无需库存', handler:function () {
                    var row=SUNLINE.getSelected(sp_grid);
                    var data=row.data;
                    var site_val=site_box_data();
                    if(obj)obj(data,'',site_val);
                    stock_win.hide();
                }}
            ]
        });
        //选择库存数据
        function stock_vf(e){
            var sp_row=SUNLINE.getSelected(sp_grid);
            if(!sp_row){
                Ext.Msg.alert('友情提示','请先选择航班（次）！');
                return false;
            }
            var sp_data=sp_row.data;
            var stock_row=SUNLINE.getSelected(stock_grid);
            if(!stock_row){
                Ext.Msg.alert('友情提示','请先选择航班（次）的库存信息！');
                return false;
            }
            var stock_data=stock_row.data;
            var site_val=site_box_data();
            stock_data_rows=stock_data;
            if(obj)obj(sp_data,stock_data,site_val);
            stock_win.hide();
        }

        sp_grid.on('select',function(i,v){
            var row=SUNLINE.getSelected(sp_grid);
            var data=row.data;
            var site_val=site_box_data();
            stock_data_rows={};
            if(data.fl_stock){
                Ext.MessageBox.confirm('友情提示','是否选择系统库存?',function(y){
                    if(y!='yes'){
                        if(obj)obj(data,'',site_val);
                        return false;
                    }
                    var fl_stock=data.fl_stock;
                    stock_store.removeAll();
                    for(var i in  fl_stock){
                        stock_store.add(fl_stock[i]);
                    }
                    stock_win.show();
                });
            }else{
                if(obj)obj(data,'',site_val);
            }
        });

        function site_box_data(){
            var start_val=start_site_box.getValue();
            var end_val=end_site_box.getValue();
            return {start:start_val,end:end_val}
        }
        return {grid:sp_grid,fn:site_where}
    },
    //添加大交通插件
    BusSave:function(obj){
        //操作航班(次)信息(start)
        //交通类型
        var traffic_type_combo=SUNLINE.LocalComob({
            id:'ob_type',
            fields:['ob_type'],
            data:[['火车'],['飞机']],
            config:{
                id:'ob_type',
                fieldLabel:"",
                labelWidth:0,
                labelAlign:"right" ,
                width:140,
                style:'float:left',
                forceSelection:false,
                value:'火车'
            }
        });
        //往返类型
        var goto_box=SUNLINE.LocalComob({
            id:'ob_goto_type',
            fields:['ob_goto_type'],
            data:[['去程'],['返程']],
            config:{
                id:'ob_goto_type',
                labelAlign:'right',
                fieldLabel:'往返类型',
                labelWidth:60,
                width:216,
                style:'float:left',
                value:'去程'
            }
        });
        var berth_type_box=SUNLINE.LocalComob({
            id:'ob_berth_type',
            fields:['ob_berth_type'],
            data:[['下铺'],['中铺'],['上铺'],['硬座'],['无座'],['二等座'],['一等座'],['经济舱'],['头等舱'],['商务舱']],
            config:{
                fieldLabel:'铺位信息',
                labelWidth:60,
                width:216,
                value:'二等座',
                labelAlign:'right',
                editable:true
            }
        });
        var fly_form= new Ext.form.FormPanel({
            border:false,
            layout : 'column',
            cls:'form_cm2',
            bodyStyle:'background:none; padding:5px;',
            width:450,
            defaults :{
                bodyStyle:'background:none;',
                layout : 'form',
                defaultType : 'textfield',
                defaults:{ width:300 },
                labelWidth:100,
                labelAlign:'right',
                border : false
            },
            items:[
                {
                    columnWidth:1,
                    defaults:{ width:300,labelAlign:"right" },
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '交通类型',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                traffic_type_combo,
                                goto_box
                            ]
                        },
                        {id:"s_id", name:"s_id", fieldLabel:"座位ID", xtype:'hidden'},
                        {id:"ob_id", name:"ob_id", fieldLabel:"航班(次)ID", xtype:'hidden'},
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '航班(次)号',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                {id:'ob_bus_number',name:'ob_bus_number',xtype:'textfield', allowBlank:false,width: 140,style:'float:left',readOnly:true},
                                berth_type_box
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '始发站点',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                {id:'ob_start_site',name:'ob_start_site',xtype:'textfield',width: 140,style:'float:left',readOnly:true},
                                {xtype: 'displayfield', value: '目地站点:',style:'float:left;padding:0 6px'},
                                {id:'ob_end_site',name:'ob_end_site',xtype:'textfield',width: 147,readOnly:true}
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '出发日期',
                            combineErrors: false,
                            defaults: { hideLabel: true},
                            items: [
                                SUNLINE.ExtDateField({id:'ob_start_date',name:'ob_start_date',labelAlign:"right",format: 'Y-m-d',fieldLabel:false, allowBlank:false,style:'float:left',width:140,gang:'ob_end_date',start:true}),
                                SUNLINE.ExtDateField({id:'ob_end_date',name:'ob_end_date',labelAlign:"right",fieldLabel:'抵达日期',labelWidth:60, allowBlank:false,width:216,gang:'ob_start_date'})
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '出发时间',
                            combineErrors: false,
                            defaults: { hideLabel: true},
                            items: [
                                {id:'ob_start_time',name:'ob_start_time',xtype:'textfield',width: 140,blankText:"正确认格式:(10:30)",style:'float:left'},
                                {xtype: 'displayfield', value: '抵达时间:',style:'float:left;padding:0 6px'},
                                {id:'ob_end_time',name:'ob_end_time',xtype:'textfield',width: 147,blankText:"正确认格式:(10:30)"}
                            ]
                        },
                        {id:"ob_old_start", name:"ob_old_start", fieldLabel:"原始始发站", xtype:'hidden'},
                        {id:"ob_old_end", name:"ob_old_end", fieldLabel:"原始目的地", xtype:'hidden'},
                        {id:"ob_site_sid", name:"ob_site_sid", fieldLabel:"始发站ID", xtype:'hidden'},
                        {id:"ob_place_type", name:"ob_place_type", fieldLabel:"新增站点",value:0, xtype:'hidden'},
                        {id:"ob_start_code", name:"ob_start_code", fieldLabel:"始发站编号", xtype:'hidden'},
                        {id:"ob_end_code", name:"ob_end_code", fieldLabel:"目的地编号", xtype:'hidden'},
                        {id:"ob_start_platform", name:"ob_start_platform", fieldLabel:"始发站站台",xtype:'hidden'},
                        {id:"ob_site_eid", name:"ob_site_eid", fieldLabel:"目的地ID", xtype:'hidden'},
                        {id:"ob_city_start", name:"ob_city_start", fieldLabel:"出发城市", xtype:'hidden'},
                        {id:"ob_city_end", name:"ob_city_end", fieldLabel:"目的地城市", xtype:'hidden'},
                        {id:"ob_end_platform", name:"ob_end_platform", fieldLabel:"目的地站台",xtype:'hidden'},
                        {id:"ob_stocks_id", name:"ob_stocks_id", fieldLabel:"库存ID",xtype:'hidden'},
                        {xtype: 'checkboxfield',id:'ob_bool',name: 'ob_bool',fieldLabel: '批量修改',boxLabel: '同步到所有相同票种（已出票无效）'}
                    ]
                }
            ]
        });
        var td_win= new Ext.Window({
            width:460,
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            fixed:true,
            items:fly_form,
            buttons:[
                {text:'保存',id:'dosave_id', handler:td_dosave},
                {text:'关闭', handler:function () { td_win.hide();},style:'margin-right:15px;'}
            ]
        });
        var fly_grid=ITEMS_YUN.FlySelect({site:'yes'});
        var fly_win = new Ext.Window({
            title:"在线选择航班(次)信息",
            width:1000,
            height:525,
            resizable:false,
            modal:true,
            closeAction:'hide',
            fixed:true,
            items: fly_grid.grid,
            buttons:[
                {text:'确认选择',handler:confirm_fly},
                {text:'关闭',handler:function(){ fly_win.hide(); }}
            ]
        });

        //在线选择班次数据
        Ext.getCmp('ob_bus_number').on({
            focus:function(t,e,o){
                fly_win.show();
                var start_code=Ext.getCmp('ob_start_code').getValue();
                var end_code=Ext.getCmp('ob_end_code').getValue();
                var start_date=Ext.util.Format.date(Ext.getCmp('ob_start_date').getValue(),'Ymd');
                if(!start_code || !end_code){
                    fly_grid.fn({start_date:start_date});
                    return false;
                }
                var site_data={
                    start:{
                        sd_start_type:traffic_type_combo.getValue(),
                        sd_name:Ext.getCmp('ob_start_site').getValue(),
                        sd_id:Ext.getCmp('ob_site_sid').getValue(),
                        sd_city:Ext.getCmp('ob_city_start').getValue(),
                        sd_code:start_code
                    },
                    end:{
                        sd_name:Ext.getCmp('ob_end_site').getValue(),
                        sd_id:Ext.getCmp('ob_site_eid').getValue(),
                        sd_city:Ext.getCmp('ob_city_end').getValue(),
                        sd_code:end_code
                    },
                    start_date:start_date
                };
                fly_grid.fn(site_data);
            }
        });

        function confirm_fly(v){
            var rows=SUNLINE.getSelected(fly_grid.grid);
            if(!rows){
                Ext.Msg.alert('友情提示','请选择需要选择的班次信息！');
                return false;
            }
            var start_site=Ext.getCmp('start_site_id_id').getValue();
            var end_site=Ext.getCmp('end_site_id_id').getValue();
            rows=rows.data;
            if(!start_site)start_site=rows.fl_start_name;
            if(!end_site)end_site=rows.fl_end_name;
            var _form_fly=fly_form.getForm();
            var form_post={
                ob_bus_number:rows.fl_number,
                ob_start_site:start_site,
                ob_end_site:end_site,
                ob_start_time:rows.fl_start_time,
                ob_end_time:rows.fl_end_time,
                ob_site_sid:rows.fl_start_id,
                ob_start_code:rows.fl_start_code,
                ob_start_platform:rows.fl_start_platform,
                ob_site_eid:rows.fl_end_id,
                ob_end_code:rows.fl_end_code,
                ob_end_platform:rows.fl_end_platform,
                ob_bool:false,
                ob_stocks_id:stock_data_rows.tbd_id
            };
            /*console.log(stock_data_rows);
            alert(1111)
            return false;*/
            _form_fly.setValues(form_post);
            fly_win.hide();
        }

        function td_dosave(v){
            var form_fly=fly_form.getForm();
            if(!form_fly.isValid()){
                Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
                return;
            }
            Ext.MessageBox.confirm('友情提示','你确定需要修改航班(次)信息吗?',function(y){
                if(y!='yes')return false;
                var url=$__app__+'/OrderBus/fly_data_save';
                if(v.text=='确认添加')url=$__app__+'/OrderBus/bus_append_save';
                var form_post=form_fly.getValues();
                Ext.Ajax.request({
                    url: url,
                    params: form_post,
                    method:'post',
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info);
                        if(obj){
                            obj(r);
                        }else{
                            if(r.status){
                                td_win.hide();
                                location.reload();
                            }
                        }

                    }
                })
            });
        }
        //操作航班(次)信息(end)
        return {win:td_win,form:fly_form};
    }
};