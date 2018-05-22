/**
 * Created by Johony on 16-3-3.
 */
Ext.onReady(function(){
    var store=SUNLINE.GroupingStore($__app__+'/TeamList/data_json',[],{sortInfo:{field:'tm_id',direction: "DESC"},groupField:'tm_sort',groupDir:'desc'});
    function tm_status_fn(v){
        if(v=='已确认') return '<b style = "color:#008000">'+v+'</b>';
        if(v=='发布') return '<b style="background: #D58800;color: #fff;padding:2px 5px;border-radius: 3px">'+v+'</b>';
        if(v=='保存') return '<b style="background: #61B6D3;color: #fff;padding:2px 5px;border-radius: 3px">'+v+'</b>';
        return v;
    };
    function route_title_fn(v,c,r){
        var row= r.data;
        return '【'+ row.tm_type+'】'+v;
    };
    function start_date_fn(v,c,r){
        var row= r.data;
        return row.tm_start_date_fn+' - '+row.tm_end_date_fn;
    };
    function tm_num_fn(v,c,r){
        if(!v) return '<span style = "color:red">无</span>';
        var str = v['成人票'].num+'大/'+ v['儿童票'].num+'小';
        return '<span title = "'+str+'">'+str+'</span>';
    };
    function tm_traffic_fn(v,c,r){
        if(!r.get('tm_go_traffic') || !r.get('tm_back_traffic')) return '<span style = "color:red">无</span>';
        var go_tra = r.get('tm_go_traffic');
        var ba_tra = r.get('tm_back_traffic');
        return '去:'+go_tra+'->'+'返:'+ba_tra;
    };
    function tm_name(v,i,r){
        if(!r.get('tm_time')) return v;
        var str = v+'('+ r.get('tm_time')+')';
        return '<span title = "'+str+'">'+str+'</span>';
    };
    function tm_number(v){
        return '<a href = "'+$__app__+'/TeamList/PrintTeam/num/'+v+'" target = "_blank" style = "color:blue" title = "'+v+'">[查看]</a>';
    };
    function total_money_fn(v){
        if(!v) return '<span style = "color:red">无</span>';
        if(!v.team_total_money) return '￥0.00';
        return '￥'+parseFloat(v.team_total_money).toFixed(2);
    };
    function first_money_fn(v){
        if(!v) return '<span style = "color:red">无</span>';
        if(!v.team_first_money) return '￥0.00';
        return '￥'+parseFloat(v.team_first_money).toFixed(2);
    };
    function money_fn(v){
        v=parseFloat(v);
        if(!v)v=0;
        return '￥'+ v.toFixed(2);
    }
    function tm_show_fn(v){
        if(v == 1){
            return '综合报价';
        }
        return '分项报价';
    };
    function tm_agency_fn(v){
        return '<span title = "'+v+'">'+v+'</span>';
    }
    var cm = [
        {header:'ID',dataIndex:'tm_id',hidden:true},
        {header:'ID',dataIndex:'tm_pnumber',hidden:true},
        {header:'ID',dataIndex:'tm_number',hidden:true},
        {header:'操作',dataIndex:'tm_number',width:60,align:'center',renderer:tm_number},
        {header:'状态',dataIndex:'tm_status',width:60,renderer:tm_status_fn},
        {header:'团队名称',dataIndex:'tm_route_title',width:200,renderer:route_title_fn},
        {header:'行程日期',dataIndex:'tm_start_date_fn',width:150,align:'center',renderer:start_date_fn},
        {header:'天数',dataIndex:'tm_day',width:50,align:'center'},
        {header:'分销商',dataIndex:'tm_agency',width:200,renderer:tm_agency_fn},
        {header:'联系人',dataIndex:'tm_linkman',width:100},
        {header:'人数',dataIndex:'tm_num',width:100,renderer:tm_num_fn},
        {header:'发布',dataIndex:'tm_name',width:200,renderer:tm_name},
        {header:'毛利',dataIndex:'tm_profit_price',width:100,align:'right',renderer:money_fn},
        {header:'总团款',dataIndex:'tm_money_detail',width:120,align:'right',renderer:total_money_fn},
        {header:'预付款',dataIndex:'tm_money_detail',width:120,align:'right',renderer:first_money_fn},
        {header:'交通信息',dataIndex:'tm_traffic',width:180,renderer:tm_traffic_fn},
        {header:'报价类型',dataIndex:'tm_show',width:100,renderer:tm_show_fn}
    ];
    var start_time=SUNLINE.ExtDateField({
        id:'start_date_id',
        width:100,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'end_date_id',
        start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date_id',
        width:100,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'start_date_id'
    });
    var tm_status_box=SUNLINE.LocalComob({
        id:'tm_status',
        fields:['tm_status'],
        data:[ ['全部'],['发布'], ['保存'],['撤销'],['已确认'],['已退订']],
        config:{
            value:'全部',
            fieldLabel:"状态",
            editable:false,
            labelWidth:30,
            width:100
        }
    });

    var search_fn={
        xtype:'trigger',
        triggerCls : 'x-form-search-trigger',
        id:'tm_Search',
        cls:'search-icon-cls',
        emptyText : '分销商名称，团队名称',
        width:180,
        onTriggerClick:function(e){
            TmSearch();
        },
        listeners :{
            "specialkey" : function(_t, _e){
                if(_e.keyCode==13)
                    TmSearch();
            }
        }
    };
    var all_id_check={
        xtype: 'checkbox',
        id:'all_id',
        boxLabel: '查看全部',
        name: 'all_id',
        inputValue: '1',
        checked: false,
        listeners: {
            'change':function(t, nv, ov){
                TmSearch();
            }
        }
    };
    var tbar=[
        {text:'查看游客',iconCls:'button-edit',handler:PrintTours,disabled:isDisabled('TeamList::PrintTours')},
        '-',
        {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
        '-',
        {text:'刷新',iconCls:'button-ref',handler:function(){
            store.reload();
        }},
        '-',
        '出团时间',
        start_time,
        '至',
        end_time,
        '-',
        tm_status_box,
        '-',
        {text:'查询',iconCls:'button-sch',handler:selectInfo},
        '->',
        '快速查询',
        search_fn
    ];
    var grouping_Scene = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "团队编号: {name}  (共{[values.rows.length]}条)"
    });

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        /*features: [grouping_Scene],*/
        columns:cm,
        style : 'border-top:1px solid #ddd;',
        fixed:true,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '<span>喵！什么都没有╮(╯_╰)╭</span>',
            deferEmptyText : true
        },
        tbar:[
            /*{text:'添加新团队',iconCls:'button-add',disabled:isDisabled('Team::index'),
                menu:[
                    {text:'添加新团队',iconCls:'button-add',handler:addTeam},
                    {text:'团队追加报价',iconCls:'button-add',handler:addTeam_price}
                ]
            },*/
            {text:'添加新团队',iconCls:'button-add',handler:addTeam,disabled:isDisabled('Team::index')},
            {text:'复制原团队',iconCls:'button-album',disabled:isDisabled('Team::index'),
                menu:[
                    {text:'复制新团队',iconCls:'button-album',o_type:'xin',handler:editTeam},
                    {text:'复制原团队',iconCls:'button-album',o_type:'yuan',handler:editTeam}
                ]
            },
            {text:'模板库',iconCls:'button-view',handler:tpl_handler,disabled:isDisabled('TeamList::tpl_data')},
            {text:'编辑',iconCls:'button-edit',id:'edits',handler:editTeam,disabled:isDisabled('Team::save')},
            {text:'删除',iconCls:'button-del',id:'dels',handler:delTeam,disabled:isDisabled('TeamList::del')},
            {text:'查看游客',iconCls:'button-edit',handler:PrintTours,disabled:isDisabled('TeamList::PrintTours')},
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            all_id_check,
            '->',
            '快速查询',
            search_fn
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有查到相关数据'
        })
    });
    var tm_type_box=SUNLINE.DictComBox_false({name:'tpl_type',fieldLabel:"品牌系列",labelWidth:60,width:180,listConfig:{minWidth:200}, labelAlign:'right',forceSelection:false},{'d_type':'品牌系列'});
    var Panel = Ext.create('Ext.panel.Panel',{
        frame:false,
        region:'center',
        layout :'border',
        bodyStyle : 'background:#fff',
        items:[grid],
        tbar:[
            {xtype:'textfield',fieldLabel:'分公司',labelWidth:50,emptyText:'全部分公司',text:'选择分公司',id:'tm_worg_txt',to_id:'tm_worg_id',width:150},
            {xtype:'hidden',emptyText:'全部分公司ID',id:'tm_worg_id'},
            '-',
            {xtype:'textfield',fieldLabel:'所属地区',labelWidth:60,emptyText:'全部城市',text:'城市',id:'sorg_city',to_id:'sorg_city_id',width:150},
            {xtype:'hidden',emptyText:'全部城市ID',id:'sorg_city_id'},'-',
            {xtype:'textfield',fieldLabel:'分销商',labelWidth:50,emptyText:'全部分销商',text:'选择分销商',id:'tm_sorg_txt',to_id:'tm_sorg_id',width:150},
            {xtype:'hidden',emptyText:'全部分销商ID',id:'tm_sorg_id'},
            '-',
            tm_type_box.box,'-',
            {xtype:"hidden",id:"sell_date",value:'tm_date_start'},
            {text:'出团日期',id:'sell_txt', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '创建日期',id:"deal_times",handler:function(){
                            Ext.getCmp("sell_txt").setText("创建日期");
                            Ext.getCmp("sell_date").setValue("tm_time");
                        }},
                        {text: '出团日期',id:"out_date",handler:function(){
                            Ext.getCmp("sell_txt").setText("出团日期");
                            Ext.getCmp("sell_date").setValue("tm_date_start");
                        }}
                    ]
                }
            },
            start_time,
            '至',
            end_time,
            '-',
            tm_status_box,
            '-',
            {text:'查询',iconCls:'button-sch',handler:selectInfo}
        ]
    });
    grid.on('rowclick',function(i,r,v){
        var row = r.data.tm_status;
        Ext.getCmp('edits').setDisabled(false);
        Ext.getCmp('dels').setDisabled(false);
        if(row=='已确认' || row=='已退订'){
            Ext.getCmp('edits').setDisabled(true);
            Ext.getCmp('dels').setDisabled(true);
        }
        if(isDisabled('Team::save')){
            Ext.getCmp('edits').setDisabled(true);
        }
        if(isDisabled('TeamList::del')){
            Ext.getCmp('dels').setDisabled(true);
        }
    });
    function PrintTours(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','请先选择要查看的团队');
            return false;
        }
        win.show();
        window.PrintToursFrame.location = $__app__ + "/TeamList/PrintTours/num/"+row.data.tm_number;
    }
    var win = Ext.create('Ext.window.Window',{
        title:'团队游客信息',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 800,
        height:500,
        html:'<iframe width="100%" height="420" frameborder="0" name="PrintToursFrame" id="PrintToursFrame"></iframe>',
        buttons: [
            {text: '打印',handler:function(){window.PrintToursFrame.print();return false;}},
            {text: '关闭',handler:function(){
                win.hide();
            }}
        ]
    });
    function addTeam(){
        parent.OpenTab('添加团队', 'Team', '', $__app__+'/Team', 1);
    }
    function addTeam_price(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','您还没有选择需要追加报价的团队');
            return false;
        }
        var num = row.data.tm_number;
        parent.OpenTab('追加团队报价'+num, 'TeamPrice'+num, '', $__app__+'/Team/index/pid/'+num, 1);
    }
    function editTeam(t){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','您还没有选择要'+ t.text+'的团队');
            return false;
        }
        var num = row.data.tm_number;
        var url= $__app__+'/Team/index/id/'+num;
        if(t.text!='编辑'){
            if(t.o_type=='xin'){
                url= $__app__+'/Team/index/handle/tpl/type/tpl/id/'+num;
            }else{
                url= $__app__+'/Team/index/handle/tpl/type/tpl/o_type/yuan/id/'+num;
            }
        }
        parent.OpenTab(t.text+'团队'+num, 'Team'+num, '', url, 1);
    }
    function delTeam(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','您还没有选择要删除的团队');
            return false;
        }
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/TeamList/del',
                    params: {tm_id:row.data.tm_id,tm_number:row.data.tm_number},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info);
                        if(r.status == 1){
                            store.reload();
                        }
                    }
                })
            }
        })
    }
    function creatDate(date){
        var year = date.getFullYear();
        var mon = date.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = date.getDate();
        if(day<10){
            day = '0'+day;
        }
        return year+mon+day;
    }
    function selectInfo(){
       /* var type = tm_status_box.getValue();
        var start_date = creatDate(start_time.getValue());
        var end_date = creatDate(end_time.getValue());
        SUNLINE.baseParams(store,{date_start:start_date,date_end:end_date,tm_status:type});
        store.load();*/
        var date_val=where_date();
        SUNLINE.baseParams(store,date_val);
        store.currentPage=1;
        store.load();
    }
    function TmSearch(){
        var skey=Ext.getCmp('tm_Search').getValue();
        var all_id_val=Ext.getCmp('all_id').getValue(); //查看全部
        if(all_id_val==true){
            all_id_val='all_id';
        }else{
            all_id_val='one_id';
        }
        SUNLINE.baseParams(store,{skey:skey,all_id:all_id_val});
        store.currentPage=1;
        store.load();
    }
    /*高级查询部分(start)*/
    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        var end_date=Ext.Date.format(end_time.getValue(),'Ymd');
        var date_type=Ext.getCmp('sell_date').getValue();
        var all_id_val=Ext.getCmp('all_id').getValue(); //查看全部
        var post_data={start_date:start_date,end_date:end_date,date_type:date_type};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var tm_sorg_id=Ext.getCmp('tm_sorg_id').getValue();
        var sorg_city_id=Ext.getCmp('sorg_city_id').getValue();
        var tm_status_val=tm_status_box.getValue();
        if(tm_status_val && tm_status_val!='全部')post_data.tm_status=tm_status_val;
        post_data.tm_type=tm_type_box.box.getValue();
        if(tm_worg_id)post_data.tm_worg_id=tm_worg_id;
        if(tm_sorg_id)post_data.tm_agency_id=tm_sorg_id;
        if(sorg_city_id)post_data.sorg_city_id=sorg_city_id;
        if(all_id_val==true){
            post_data.all_id='all_id';
        }else{
            post_data.all_id='one_id';
        }
        return post_data;
    }

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
    var select_row=['tm_worg_txt','tm_sorg_txt','sorg_city'];
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
    /*高级查询部分(end)*/
    function tpl_handler(){
        parent.OpenTab('模板库', '', '', $__app__+'/Team/team_tpl', 1);
    }
    //使用历史报价
    function team_handler(){

    }

    ziyo_log({ listeners : [{grid: grid, action:'Team', pk_id:'tm_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    });
    window.ifm_tab=function(){
        store.load();
    }
});