Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url = $__app__ + '/MostManagers/transferDataJson';
    var field = [];
    var store = new SUNLINE.JsonStore(url, field, true);

    /**    数据  ***/
    var grid = new Ext.grid.GridPanel({
        region:'center',
        width:500,
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有转账信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID", dataIndex:"t_id",name:"t_id", width:50, hidden:true},
            {header:"total_amount", dataIndex:"total_amount",name:"total_amount", width:50, hidden:true},
            {header:"al_transfer_amount", dataIndex:"al_transfer_amount",name:"al_transfer_amount", width:50, hidden:true},
            {header:"转账编号", dataIndex:"t_request_no",name:"t_request_no", width:200},
            {header:"转账类型", dataIndex:"t_type",name:"t_type", width:150},
            {header:"转账金额", dataIndex:"t_amount",name:"t_amount", width:150,renderer:money},
            {header:"订单编号", dataIndex:"t_out_trade_no",name:"t_out_trade_no", width:200},
            {header:"转账成功时间", dataIndex:"t_finish_time",name:"t_finish_time", width:200},
            {header:"转出单位名称", dataIndex:"t_out_orgname",name:"t_out_orgname", width:200}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有转账信息'
        }),
        tbar : [
            {text:'提现',iconCls:'button-add', handler:show_withdraw},
            '-',
            "<span title='为减少客户并发操作带来的误差,截止时间最迟为昨天'><i class='fa fa-question-circle'></i> 截止时间:</span>",
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',value:yesterday(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,maxValue:yesterday()}),
            {text:'查询', handler:dosearch},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){
                store.reload();
            }},
        ],

    });

    new Ext.Viewport({
        layout: 'border',
        items:[grid]
    });

    /**  表单信息  ***/
    var card_store = Ext.create("Ext.data.Store", {
        fields: ["name", "value"],
        autoLoad: true,
        proxy: {
            type: "ajax",
            actionMethods: { read: "POST" },
            url: $__app__ + "/MostManagers/cardDataJson",
            reader: {
                type: "json",
                root: "data"
            }
        }
    });
    var bank_card = Ext.create('Ext.form.ComboBox', {
        id: 'bank_card',
        fieldLabel: '银行卡信息',
        labelWidth: 100,
        labelAlign: 'right',
        store: card_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        emptyText: '请选择银行卡',
        editable:false,
        allowBlank:false,
        listeners: {
            afterRender: function(combo) {
                if(card_store.data.items.length > 0){
                    var firstValue = card_store.data.items[0].data.name;
                    var firstText =  card_store.data.items[0].data.value;
                    combo.setValue(firstValue);
                    combo.setValue(firstText);
                }
            }
        }
    });
    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaultType:'textfield',
        defaults:{anchor:'90%',labelWidth:100,labelAlign:'right',width:400},
        id : 'dynamicFC',
        items: [
            {id:"time_show",xtype:'fieldset',autoHeight:true,border:0,html:''},
            {id:"total_money",name:"total_money",allowBlank:false,fieldLabel:"总收入"},
            {id:"al_withdraw",name:"al_withdraw",allowBlank:false,fieldLabel:"已提现金额"},
            {id:"none_withdraw",name:"none_withdraw",allowBlank:false,fieldLabel:"本次提现金额"},
            bank_card
        ]
    });
    var win=new Ext.Window({
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:form,
        title:'提现操作',
        buttons:[
            {text:'提交',handler:withdraw},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    })
    /**    方法  ***/
    function dosearch(){
        var time=Ext.getCmp('seach_stop_date').getValue();
        SUNLINE.baseParams(store,{time:time},true);
        store.currentPage=1;
        store.load();
    }
    //显示表单
    function show_withdraw(){
        var record=grid.getStore().getAt(0);
        var total_money = Ext.getCmp('total_money');
        var al_withdraw = Ext.getCmp('al_withdraw');
        var none_withdraw = Ext.getCmp('none_withdraw');
        var time_show_value = Ext.getCmp('seach_stop_date').getValue();
        total_money.setReadOnly(true);
        total_money.setValue(record.data.t_amount);
        al_withdraw.setReadOnly(true);
        al_withdraw.setValue(record.data.al_transfer_amount);
        none_withdraw.setReadOnly(true);
        none_withdraw.setValue((record.data.t_amount-record.data.al_transfer_amount).toFixed(2));
        time_show_value = Ext.util.Format.date(time_show_value,'Y-m-d');
        var html = '截止至<span style="margin: 10px;color:red">'+time_show_value+'</span>:';
        Ext.getCmp('time_show').setHtml(html);
        win.show();
    }
    //提交表单
    function withdraw(){
        if(!form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var time = Ext.getCmp('seach_stop_date').getValue();
        var bc_id = Ext.getCmp('bank_card').getValue();
        var withdraw_money = Ext.getCmp('none_withdraw').getValue();
        var myMask=new Ext.LoadMask({target:win,msg:'数据提交中，请稍候...'});
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/MostManagers/withdraw',
            method:'post',
            waitMsg:'数据操作中，请稍后....',
            params:{time:time,bc_id:bc_id,withdraw_money:withdraw_money},
            success:function(response,opts){
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', result.info);
                store.reload();
                win.hide();
            },
            failure:function(response,opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '提现失败');
            }
        });
    }
    function yesterday(){
        var time=new Date();
        time.setTime(time.getTime()-24*60*60*1000);
        return Ext.util.Format.date(time,'Y-m-d');
    }
})