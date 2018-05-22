/**
 * Created by Administrator on 15-12-7.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    /*供应商*/
    var is_supply_hidden = _uinfo.org_type == '管理公司' ? false : true;
    var conf_s = {
        hidden:is_supply_hidden,
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
        where:{  org_type:'供应商',source:'refund' },
        config:company_config_s
    });
    company_box_s.on('select',function(c,r){
        doSearch();
    });
    /**
     * 分销商所属公司
     */
    var company_box=SUNLINE.CompanyBox({
        where:{ source:'refund' },
        config:{
            id:"p_org",
            displayField:'text',
            valueField:'id',
            fieldLabel:'分销商',
            labelWidth:50,
            width:250,
            labelAlign: 'right',
            value: '全部公司',
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box_store.load();
    company_box.on('select',function(c,r){
        doSearch();
    });


    var w_flag = SUNLINE.LocalComob({
        id: 'w_flag',
        fields: ['value', 'text'],
        data: [
            {value: 'all', text: '全部'},
            {value: 'online', text: '在线支付'},
            {value: 'line', text: '线下支付'}
        ],
        config: {
            editable: false,
            valueField: 'value',
            displayField: 'text',
            id: 'w_flag',
            name: 'w_flag',
            labelWidth: 60,
            labelAlign: 'right',
            fieldLabel:'支付方式',
            width: 180,
            value: 'online',
        }
    });
    var thisTitle = '线下退款';
    var url=$__app__+'/Refund/cancel_money';
    var store=SUNLINE.JsonStore(url,[]);
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"id", dataIndex:"id", width:50, hidden:true},
        { text: '订单号',  dataIndex: 'out_trade_no',width:150,renderer:orderno},
        { text: '退款金额',  dataIndex: 'money',width:100,renderer:money},
        { text: '原支付方式',  dataIndex: 'pay_mode',width:100},
        { text: '产品信息',  dataIndex: 'o_product_name',width:350,renderer:renderLabel },
        { text: '出发日期',  dataIndex: 'start_date',width:100,renderer:number2date},
        { text: '供应商',  dataIndex: 'seller_name',width:180},
        { text: '分销商',  dataIndex: 'buyer_org_name',width:200},
        { text: '退款原因',  dataIndex: 'business',width:200},
        { text: "<span style='color:blue'>退款备注</span>",  dataIndex: 'remark',width:200,editor: new Ext.form.TextField({ allowBlank: false })}
    ];

    function renderLabel(v,m,r){
        var label = r.get('label');
        var lb_txt = [];
        if (label) lb_txt = show_label(label);
        return '['+r.get('o_product_num')+']'+v+'<br>'+lb_txt.join('');
    }
    //订单详情页面跳转
    window.UrlOrderDetailre=function(v){
        if(_uinfo.org_type == '分销商'){
           var  order_type = 'buyer';
        }else{
           var  order_type = 'seller'
        }
        parent.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/'+order_type, 1);
    };

    function orderno(v,m,r){
        return '<a href="javascript:;" onclick = UrlOrderDetailre("'+v+'")>'+v+'</a>';
    }

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {text:'标记为...', id:'label_btn' },
            '-',
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            w_flag,
           // label_flag,
            {text:'标签筛选', id:'label_btn_search' },
            company_box,
            company_box_s,
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'_Search',
                cls:'search-icon-cls',
                emptyText : '订单号',
                width:250,
                onTriggerClick:function(e){
                    doSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            doSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            items:[
                '-',
                {xtype:'tbtext',id:'total_id',text:''},
                '-',
                {xtype:'tbtext',id:'page_id',text:''}
            ],
            emptyMsg: '没有数据'
        }),
        listeners:{
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            },
        },
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                        myMask.show();
                        var data = SUNLINE.getSelected(g.grid).data;
                        Ext.Ajax.request({
                            url: $__app__+'/Refund/refund_save',
                            params: data,
                            method:'post',
                            success: function(response){
                                var r = Ext.decode(response.responseText);
                                Ext.Msg.alert('友情提示', r.info.msg);
                                if(r.status){
                                    // panel.hide();
                                    store.load();
                                }
                                myMask.hide();
                            }
                        })
                    }
                }
            })
        ],
    })
    Ext.getCmp('w_flag').on('change',function(){
        doSearch();
    })
    function doSearch(text){
        var org_id = Ext.getCmp('p_org').getValue();
        var worg_id = Ext.getCmp('company_box_s').getValue();
        var skey = Ext.getCmp('_Search').getValue();
        var payment_type = Ext.getCmp('w_flag').getValue();
        SUNLINE.baseParams(store,{skey:skey,org_id:org_id,worg_id:worg_id,payment_type:payment_type,text:text});
        store.currentPage =1;
        store.load();
    }
    store.on('load',function(t){
        var total_all=t.proxy.reader.rawData.all_total;
        var total_page=t.proxy.reader.rawData.page_total;
        for( var ai in total_all){
            if(!total_all[ai])total_all[ai]=0;
        }
        for( var pi in total_page){
            if(!total_page[pi])total_page[pi]=0;
        }
        if(!total_all.order_num) total_all.order_num=0;
        if(!total_page.order_num) total_page.order_num=0;
        Ext.getCmp('total_id').setText('<b style="color: #008000">总计</b>: ' +
            '退款金额：<font color="#ff4500">'+total_all.total_fee+'</font> 元 订单数：<font color="#ff4500">' +(total_all.order_num)+'</font> ');
        Ext.getCmp('page_id').setText('<b style="color: #008000">当前</b>: ' +
            '退款金额：<font color="#ff4500">'+total_page.total_fee+'</font> 元 订单数：<font color="#ff4500">' +total_page.order_num+'</font> ');
    });
    window.set_label = function(b){
        var row = SUNLINE.getSelected(grid);
        if (!row) return ExtAlert('请选择您想标记的退款数据。');
        var id = row.get('id');
        if (id==''||id=='0') return ExtAlert('请选择您想标记的退款数据。');

        var data = {id:id, op_label: b.text,type : 'label'};
        Ext.Ajax.request({
            url:$__app__ + '/Refund/set_label',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                QtipMsg('友情提醒', info.msg, {direction:'t', width:210});
                if (ret.status){
                    row.set('label', info.label);
                }
            },
            failure:function (response, otps) {
                QtipMsg('友情提醒', '设置标签操作失败', {direction:'t', width:210});
            }
        });
    }
    window.search_label = function(b){
        Ext.getCmp('label_btn_search').setText('<span style="height:15px;width:15px;line-height: 15px;font: 12px/16px helvetica, arial, verdana, sans-serif;" class=" x-menu-item-text-default x-menu-item-indent-no-separator" >'+ b.text+'</span><div style="height:15px;width:15px;line-height: 15px;"  class="x-menu-item-icon-default x-menu-item-icon '+ b.iconCls+'"></div>');
        //Ext.getCmp('label_btn_search').setText('123');
        doSearch(b.text);
    }

    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
    ziyo_label('label_btn');
    ziyo_label('label_btn_search','search');
    ziyo_log({ listeners : [{grid: grid, action:'Payment', pk_id:'id'}] });

});