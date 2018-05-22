/**
 * Created by Johony on 16-2-25.
 */
var usInfo = {};//存储查询条件
var SiteInfo=[];
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/OrderBus/ticket_order_json',[],{sortInfo:{field:'to_start_date',direction: "ASC"},groupField:'goto_type'},true);
    store.sort('to_date', 'ASC');
    //私服种类型
    function ob_stocks_fn(v,c,r){
        if(r.get('to_stocks_id'))return '<span class="blue-cls">库存短程</span>';
        return '普通';
    }
    //时间格式
    function date_format(v,c,r){
        return int2date(v);
    }
    //金额格式
    function money_format(v,c,r){
        v=parseFloat(v);
        if(!v)v=0;
        return '￥'+ v.toFixed(2);
    }
    function torg_name_fn(v){
        return '<font title="'+v+'" style="color:blue">'+v+'</font>';
    }
    function no_piao_format(v){
        if(!v)return "<span style='color:green;'>0</span>";
        return "<span style='color:red;font-weight: bold'>"+v+"</span>";
    }
    var cm = [
        {header:'票务订单ID',dataIndex:'to_id',width:60,hidden:true},
        {header:'票务订单',dataIndex:'to_number',width:140},
        {header:'票务类型',dataIndex:'to_stocks_id',width:80,renderer:ob_stocks_fn,hidden:true},
        {header:'票务日期',dataIndex:'to_start_date',align:'center',width:90,renderer:date_format},
        {header:'生成日期',dataIndex:'to_date',align:'left',width:90,renderer:date_format},
        {header:'票务公司',dataIndex:'to_torg_name',width:150,renderer:torg_name_fn},
        {header:'下铺/商务/头等舱',dataIndex:'big_num',width:100,align:'center'},
        {header:'中铺/一等/硬座/商务舱',dataIndex:'min_num',width:110,align:'center'},
        {header:'上铺/二等/无座/经济舱',dataIndex:'small_num',width:110,align:'center'},
        {header:'未出票数',dataIndex:'no_piao_num',align:'center',width:80,renderer:no_piao_format},
        {header:'总张数',dataIndex:'to_pop_num',align:'center',width:80},
        {header:'手续费',dataIndex:'to_price',align:'right',width:80,renderer:money_format},
        {header:'总金额',dataIndex:'to_money',align:'right',width:80,renderer:money_format},
        {header:'最终签收人',dataIndex:'to_sign_uname',align:'left',width:100,hidden:true},
        {header:'签收时间',dataIndex:'to_sign_time',align:'left',width:100,hidden:true},
        {header:'备注',dataIndex:'to_remark',width:150}
    ];

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        style:'border-top:2px solid #009DDA',
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        tbar:[
           '<b>票务订单列表:</b>',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},'-',
            {text:'撤销订单',iconCls:'button-del',handler:bus_order_del},'-',
            {text:'导出/打印订单',iconCls:'button-excel',handler:download_excel},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '订单号、游客信息、航班号',
                width:280,
                onTriggerClick:function(e){
                    planeSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            planeSearch();
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    //查询条件汇总
    function selectInfo(){
        var post=where_select();
        SUNLINE.baseParams(store,post);
        store.load();
    };

    var ri_store = SUNLINE.GroupingStore($__app__+'/OrderBus/ticket_seat_detail',[],{groupField:'s_o_number'},false);
    var ri_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' <div>{name} {rows:this.service_name}  {[values.rows.length]}人 <span class="grid_group_cls" onclick="OrderDetail(\'{name}\')">查看详情>></span></div>{rows:this.data_rows}',{
            service_name:function(row){
                var service_name='';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.service_name){
                            service_name='(客服：'+rw.service_name+')';
                            return false;
                        }
                    });
                }
                return service_name;
            },
            data_rows:function(row){
                var remark='';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.o_remark){
                            remark='<div class="remark_cls" style="font-size: 12px;color:#999;font-weight: 100">备注:'+rw.o_remark+'</div>'
                            return false;
                        }
                    });
                }
                return remark;
            }
        }],
        startCollapsed:false,
        collapsible:false
    });
    //班次号操作
    function ob_number_fn(v,c,r){
        if(!v)return '<font color="red">未知</font>';
        var ob_start_time='未知';
        var ob_end_time='未知';
        if(r.get('ob_start_time'))ob_start_time=r.get('ob_start_time');
        if(r.get('ob_end_time'))ob_end_time=r.get('ob_end_time');
        return '<font color="green"><b>'+v+'('+ob_start_time+'-'+ob_end_time+')</b></font>';
    }
    //身份证判断
    function s_vip_card_fn(v,c,r){
        if(r.get('s_vip_card_type')!='身份证')return '<font color="blue" title="'+ r.get('s_vip_card_type')+'">'+v+'</font>';
        return v;
    }
    //票务状态
    function ob_status_fn(v){
        if(v=='已出票')return '<font color="green"><b>'+v+'</b></font>';
        return '<font color="red"><b>'+v+'</b></font>';
    }
    //站点信息
    function start_site_fn(v,c,r){
        var ob_start_platform='';
        var ob_end_platform='';
        if(r.get('ob_start_platform'))ob_start_platform=r.get('ob_start_platform');
        if(r.get('ob_end_platform'))ob_end_platform=r.get('ob_end_platform');
        var site= r.get('ob_start_site')+ ob_start_platform+'-'+ r.get('ob_end_site')+ ob_end_platform;
        return '<font title="'+site+'">'+site+'</font>';
    }
    function vip_age_fn(v,c,r){
        var row= r.data;
        if(!v)return '<span title="非身份证:'+ row.s_vip_card +'('+row.s_vip_card_type+')">未知</span>';
        if(v<12 && v>3)return '<span style="color: #008000;font-weight: bold" title="儿童">'+v+'</span>';
        if(v<3)return '<span style="color: red;font-weight: bold" title="婴儿">'+v+'</span>';
        return v;
    }
    var ri_cm = [
        {header:'座位ID',dataIndex:'s_id',hidden:true},
        {header:'票务订单ID',dataIndex:'ob_toid',hidden:true},
        {header:'交通ID',dataIndex:'ob_id',width:80,hidden:true},
        {header:'姓名',dataIndex:'s_vip_name',width:60},
        {header:'游客证件号',dataIndex:'s_vip_card',width:150,renderer:s_vip_card_fn},
        {header:'年龄',dataIndex:'s_vip_age',width:60,align:'center',renderer:vip_age_fn},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:50,hidden:true},
        {header:'航班(次)',dataIndex:'ob_bus_number',width:140,renderer:ob_number_fn},
        {header:'状态',dataIndex:'ob_status',width:70,renderer:ob_status_fn},
        {header:'票价',dataIndex:'ob_money',align:'right',width:80,renderer:money_format},
        {header:'手续费',dataIndex:'ob_price',align:'right',width:80,renderer:money_format},
        {header:'铺位',dataIndex:'ob_berth_type',align:'center',width:60},
        {header:'站点信息',dataIndex:'ob_start_site',align:'center',width:240,renderer:start_site_fn}
    ];
    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'east',
        width:870,
        minWidth:10,
        store:ri_store,
        collapsed:true,
        features: [ri_groupfeatures],
        selModel:{
            selType: 'checkboxmodel'
        },
        columns:ri_cm,
        fixed:true,
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'退票',iconCls:'button-drop',handler:del_bus_fn},'-',
            {text:'撤销游客',iconCls:'button-del',handler:bus_vip_del},'-',
            {text:'票务出票',iconCls:'button-edit',handler:sign_ticket_fn},
            {text:'收起',iconCls:'button-structure',handler:function(){
                ri_grid.collapse();
            }}
        ]
    });



    /*****    顶部搜索区域(start)     *****/

    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date()
    });
    var create_time=SUNLINE.ExtDateField({
        id:'create_date',
        width:110,
        labelWidth:0,
        name:'create_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date()
    });
    var hidden_type=true,c_worg_id=_uinfo.org_id;
    if(_uinfo.org_type=='管理公司' && _uinfo.org_pid==0){
        hidden_type=false
        c_worg_id='';
    }

    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[grid,ri_grid],
        tbar:[
            {xtype:'textfield',fieldLabel:'分公司',labelWidth:50,emptyText:'全部分公司',text:'选择分公司',id:'tm_worg_txt',to_id:'tm_worg_id',width:200,hidden:hidden_type},
            {xtype:'hidden',emptyText:'全部分公司ID',id:'tm_worg_id',value:c_worg_id},
            '-',
            {xtype:'textfield',fieldLabel:'票务公司',labelWidth:60,emptyText:'全部票务公司',text:'选择票务公司',id:'tm_torg_txt',to_id:'tm_torg_id',width:200,hidden:hidden_type},
            {xtype:'hidden',emptyText:'票务公司ID',id:'tm_torg_id'},
            '-',
            '出发日期',
            start_time,
            '-',
           /* '生成日期',
            create_time,*/
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){parent.CloseTab()}}
        ]
    });

    //撤销订单
    function bus_order_del(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要撤销的订单信息!');
            return false;
        };
        row=row.data;
        Ext.MessageBox.confirm('友情提示','你确认需要撤销订单吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/train_find_del',
                params: {to_id:row.to_id},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){ store.reload(); }
                    myMask.hide();
                }
            })
        });
    }

    //撤销游客
    function bus_vip_del(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        var to_id=vip_data.to_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要撤销的游客信息!');
            return false;
        };
        Ext.MessageBox.confirm('友情提示','你确认需要撤销游客吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/train_find_del',
                params: {to_id:to_id,bus_id:Ext.encode(bus_id)},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        store.reload();
                        ri_store.reload();
                    }
                    myMask.hide();
                }
            })
        });
    }

    //导出/打印
    function download_excel(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要导出的票务订单!');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要导出所选择的票务订单吗?',function(y){
            if(y!='yes')return false;
            row=row.data;
            window.location = $__app__+'/OrderBus/train_detail_excel/to_id/'+row.to_id+'/start_date/'+row.to_start_date;
        });
    }

    var pay_type_box=SUNLINE.LocalComob({
        id:'ob_pay_type',
        fields:['ob_pay_type'],
        data:[['现金'],['签单']],
        config:{
            fieldLabel:'支付类型',
            labelWidth:60,
            width:280,
            value:'现金'
        }
    });

    var berth_type_box=SUNLINE.LocalComob({
        id:'ob_berth_type',
        fields:['ob_berth_type'],
        data:[['下铺'],['中铺'],['上铺'],['硬座'],['无座'],['二等座'],['一等座'],['经济舱'],['头等舱'],['商务舱']],
        config:{
            fieldLabel:'铺位信息',
            labelWidth:60,
            width:280,
            value:'二等座',
            editable:true
        }
    });

    //票务签收(start)
    var sign_form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:[
            {id:"bus_id",name:"bus_id",fieldLabel:"大交通ID",hidden:true},
            {id:"to_id",name:"to_id",fieldLabel:"票务订单ID",hidden:true},
            {id:"ob_start_date",name:"start_date",fieldLabel:"票务日期",readOnly:true},
            {id:"ob_out_site",name:"ob_out_site",fieldLabel:"票务公司",readOnly:true},
            berth_type_box,
            {id:"ob_money",name:"ob_money",fieldLabel:"单票价"},
            {
                xtype: 'fieldcontainer',
                fieldLabel: '销售价格',
                combineErrors: false,
                defaults: { hideLabel: true },
                items: [
                    {id:'ob_sell_money_new',name:"ob_sell_money", fieldLabel:"销售价格",width:140, maxLength:"20",  xtype:'numberfield',allowBlank:false,style:'float:left;padding-right:6px'},
                    {xtype: 'button', text: '获取票价',id:'sell_money_only',handler:button_fn}
                ]
            },
            {id:"ob_price",name:"ob_price",fieldLabel:"单手续费"},
            pay_type_box,
            {id:"ob_remarks",name:"ob_remarks",fieldLabel:"备注",xtype:'textarea'}
        ]
    });

    var sign_win = new Ext.Window({
        title:"游客票务出票",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: sign_form,
        buttons:[
            {text:'确认出票',handler:confirm_sign},
            {text:'关闭',handler:function(){ sign_win.hide(); }}
        ]
    });

    function button_fn(){
        var ob_id=Ext.getCmp('bus_id').getValue();
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/sell_money',
            params:{id:ob_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    Ext.MessageBox.confirm('友情提示','获取到的销售单价为【'+info+'】，你确定需要使用吗？',function(y){
                        if(y!='yes')return false;
                        Ext.getCmp('ob_sell_money_new').setValue(info);
                    });
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    Ext.getCmp('ob_money').on({
        blur:function(){
            var money=Ext.getCmp('ob_money').getValue();
            var sell_money=Ext.getCmp('ob_sell_money_new').getValue();
            if(!sell_money || sell_money==0)Ext.getCmp('ob_sell_money_new').setValue(money);
        }
    });

    function sign_ticket_fn(t){
        var grid_row=SUNLINE.getSelected(grid);
        grid_row=grid_row.data;
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        var start_date=vip_data.start_date;
        var bus_data=vip_data.bus_data;
        var to_id=vip_data.to_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要票出的游客信息!');
            return false;
        }
        //批量处理，只能处理相关班次的票
        var site_num= 0,site_number={};
        for(var si in vip_data['site_number']){
            site_number=vip_data['site_number'][si];
            site_num++;
        }
        if(site_num>1){
            Ext.Msg.alert('友情提示','批量处理航班（次），只能处理相同航班（次）票！');
            return false;
        }
        sign_win.show();
        var _sign_form=sign_form.getForm();
        _sign_form.reset();
        var post_data={
            bus_id:bus_id,
            to_id:to_id,
            ob_out_site:bus_data.ob_out_site,
            start_date:int2date(start_date),
            ob_berth_type:bus_data.ob_berth_type,
            ob_money:bus_data.ob_money,
            ob_price:bus_data.ob_price,
            ob_pay_type:bus_data.ob_pay_type?bus_data.ob_pay_type:'现金',
            ob_remarks:bus_data.ob_remarks
        };
        post_data.ob_sell_money=bus_data.ob_sell_money>0?bus_data.ob_sell_money:bus_data.ob_money;
        if(post_data.ob_price==0 || !post_data.ob_price)post_data.ob_price=grid_row.to_poundage;
        _sign_form.setValues(post_data);
        //如果没有单票价的情况下需要获取票价
        if(!post_data.ob_money){
            Ext.Ajax.request({
                url: $__app__+'/Widget/number_money_json',
                params: site_number,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    if(r.status){
                        var fly_row= r.info;
                        var fly_money=fly_row.fl_money_three;
                        if(post_data.ob_berth_type)fly_money=fly_row[berth_to_grades(post_data.ob_berth_type)];
                        _sign_form.setValues({ob_money:fly_money});
                    }
                }
            })
        }
    }

    function confirm_sign(e){
        var _sign_form=sign_form.getForm();
        if(!_sign_form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var sign_data=_sign_form.getValues();
        Ext.MessageBox.confirm('友情提示','你确认需要票出选中的游客票务吗？票务的状态将会变为【已出票】',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/train_plan_save',
                params: sign_data,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        sign_win.hide();
                        store.reload();
                        ri_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    }
    /**
     * 获取游客大交通数据(多选操作)
     * @returns {{bus_id: Array, start_date: string}}
     */
    function select_vip_data(){
        var rows=ri_grid.getSelectionModel().getSelection();
        var bus_id=[],start_date='',bus_data='',to_id='',site_number={};
        Ext.each(rows,function(v,i){
            var row= v.data;
            bus_id.push(row.ob_id);
            start_date=row.ob_start_date;
            to_id=row.ob_toid;
            site_number[row.ob_bus_number+'_'+row.ob_start_code+'_'+row.ob_end_code]={
                number:row.ob_bus_number,
                start_code:row.ob_start_code,
                end_code:row.ob_end_code
            };
            //out_site=row.ob_out_site;
            if(!bus_data)bus_data=row;
        });
        return {bus_id:bus_id,start_date:start_date,bus_data:bus_data,to_id:to_id,site_number:site_number}
    }

    //大交通票退票操作 (start)
    var del_form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:[
            {id:"del_bus_id",name:"bus_id",fieldLabel:"大交通ID",hidden:true},
            {id:"del_to_id",name:"to_id",fieldLabel:"票务订单ID",hidden:true},
            {id:"del_number",name:"o_number",fieldLabel:"订单编号",hidden:true},
            {id:"del_start_date",name:"start_date",fieldLabel:"票务日期",readOnly:true},
            {id:"del_penalty",name:"ob_penalty",fieldLabel:"单票损"},
            {id:"del_remarks",name:"ob_remarks",fieldLabel:"备注",xtype:'textarea'}
        ]
    });
    var del_win = new Ext.Window({
        title:"批量退票操作",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: del_form,
        buttons:[
            {text:'确认退票',handler:confirm_del},
            {text:'关闭',handler:function(){ del_win.hide(); }}
        ]
    });

    function del_bus_fn(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要退票的用户信息!');
            return false;
        }
        del_win.show();
        var bus_data=vip_data.bus_data;
        var _del_form=del_form.getForm();
        var post_form={
            bus_id:bus_id,
            start_date:int2date(bus_data.ob_start_date),
            to_id:bus_data.ob_toid,
            ob_penalty:bus_data.ob_penalty,
            ob_remarks:bus_data.ob_remarks,
            o_number:bus_data.s_o_number
        };
        _del_form.setValues(post_form);
    }

    function confirm_del(){
        var _del_form=del_form.getForm();
        var post_data=_del_form.getValues();
        Ext.MessageBox.confirm('友情提示','你确认需要退掉所选票务吗?退票后，票务将变为【已退票】状态!',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/bus_ticket_quit',
                params: post_data,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        del_win.hide();
                        store.reload();
                        ri_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    }
    //大交通票退票操作 (end)


    //筛选条件部分
    var trans_store = new SUNLINE.JsonStore($__app__+'/TransPlan/select_combox', [],false);
    var trans_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"id", width:80,hidden:true},
        {header:"名称", dataIndex:"text", width:300}
    ];
    var trans_grid=new Ext.grid.GridPanel({
        region:'center',
        store:trans_store,
        columns:trans_cm,
        autoScroll:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        height:520,
        tbar:[
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'trans_Search',
                cls:'search-icon-cls',
                emptyText : '信息名称',
                width:280,
                onTriggerClick:function(e){
                    trans_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            trans_search();
                    }
                }
            }
        ]
    });

    var trans_win = new Ext.Window({
        width : 400,
        height : 600,
        modal : true,
        fixed:true,
        closeAction : 'hide',
        items:trans_grid,
        buttons:[
            {text:'确认选择',handler:trans_vf_fn},
            {text:'关闭', handler:function () {
                trans_win.hide();
            }}
        ]
    });

    function trans_search(){
        var keys=Ext.getCmp('trans_Search').getValue();
        SUNLINE.baseParams(trans_store,{skey:keys},true);
        trans_store.load();
    }

    var select_id='';
    var select_name='';
    var select_row=['tm_worg_txt','tm_torg_txt'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                var post={type:t.text};
                SUNLINE.baseParams(trans_store,post);
                trans_store.load();
            }
        });
    }

    trans_store.on({
        load:function(){
            var row_id=Ext.getCmp(select_id).getValue();
            if(!row_id)return '';
            var i=0;
            row_id=row_id.split(',');
            this.each(function(v){
                var rows= v.data;
                if(in_array(rows['id'],row_id)!=-1){
                    trans_grid.getSelectionModel().select(i, true);
                }
                i++;
            })
        }
    });

    function trans_vf_fn(){
        var rows=trans_grid.getSelectionModel().getSelection();
        var sl_id=[];
        var sl_name=[];
        Ext.each(rows,function(v,i){
            var row= v.data;
            if(v.id && row.text!='全部')sl_id.push(row.id);
            sl_name.push(row.text);
        });
        Ext.getCmp(select_id).setValue(sl_id);
        Ext.getCmp(select_name).setValue(sl_name);
        trans_win.hide();
    }

    trans_store.on({
        load:function(){
            var row_id=Ext.getCmp(select_id).getValue();
            if(!row_id)return '';
            var i=0;
            row_id=row_id.split(',');
            this.each(function(v){
                var rows= v.data;
                if(in_array(rows['id'],row_id)!=-1){
                    trans_grid.getSelectionModel().select(i, true);
                }
                i++;
            })
        }
    });

    grid.on('cellclick',function(v,i,d,r){
        var row= r.data;
        var post={to_id:row.to_id};
        SUNLINE.baseParams(ri_store,post);
        ri_store.load();
        if(ri_grid.getCollapsed())ri_grid.expand();
    });
    
    function where_select(){
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        /*var create_date=Ext.Date.format(create_time.getValue(),'Ymd');*/
        var post_where={start_date:start_date};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var tm_torg_id=Ext.getCmp('tm_torg_id').getValue();
        //var skeys=Ext.getCmp('pl_Search').getValue();

        if(tm_worg_id)post_where['worg_id']=tm_worg_id;
        if(tm_torg_id)post_where['torg_id']=tm_torg_id;
        //if(skeys)post_where['skeys']=skeys;
        return post_where;
    }

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{skeys:key},true);
        store.load();
    };

    function check_hide(){
        var span_not_plan=$('.span_not_plan');
        for(var si=0;si<span_not_plan.length;si++){
            var si_id=span_not_plan.eq(si);
            var sid_id=si_id.parents('.x-grid-row');
            sid_id.find('.x-grid-cell-row-checker .x-grid-cell-inner').remove();
        }
    }

    window.OrderDetail=function(number){
        parent.OpenTab('订单详情'+number, 'OrderDetail'+number, '', $__app__+'/OrderDetail/index/id/'+number, 1);
    }

    //ziyo_log({ listeners : [{grid: grid, action:'TransPlan', pk_id:'tp_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
})