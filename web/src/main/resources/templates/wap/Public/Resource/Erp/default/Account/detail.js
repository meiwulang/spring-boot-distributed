/**
 * Created by Administrator on 16-7-5.
 */

Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var cate_store,cate_url,cate_fld;
    cate_url=$__app__ + '/Account/category';
    cate_fld=['category','ac_type'];
    cate_store = SUNLINE.JsonStore(cate_url, cate_fld);

    //账户信息的数据源
    var  right_store,_account_url, _account_fld;
    _account_url = $__app__ + '/Account/book';
    _account_fld = ['an_name'];
    right_store = SUNLINE.JsonStore(_account_url, _account_fld);

    var left_store,left_url,left_fld;
    left_url=$__app__+'/Account/detail_data';
    left_fld=[];
    left_store=SUNLINE.JsonStore(left_url,left_fld,false);

    var timeCombox = Ext.create('Ext.form.ComboBox', {
        id:"detail_time",triggerAction:"all",
        width:105,
        store:new Ext.data.SimpleStore({
            fields:['value', 'text'],
            data:detail_date
        }),
        displayField:"text",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:end
    });

    /*
       to do 显示详情
     */
    function detail(v){
        if(v){
            return v;
        }
    }

    function show_money(v,m,r, ri, ci){
        if (v=='' && ci!=5) return '';
        return money(v);
    }

    var left_grid = new Ext.grid.GridPanel({
        region: 'center',
        store:left_store,
        style:'border-right:2px solid #009DDA',
        columns:[
            {header:"日期", dataIndex:"ac_time", width:100,renderer:number2date},
            {header:"类别", dataIndex:"ac_category", width:80},
            {header:"摘要", dataIndex:"ac_remark", width:200},
            {header:"收入", dataIndex:"ac_in", width:120,renderer:show_money},
            {header:"支出", dataIndex:"ac_out", width:120,renderer:show_money},
            {header:"余额", dataIndex:"ac_balance", width:120,renderer:show_money},
            {header:"详情", dataIndex:"ac_id", width:150,renderer:detail}
        ],
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂无明细数据',
            deferEmptyText: true
        },
        tbar : [
             '查询月份：',
             timeCombox,
            {text:'查询', handler:function(){ left_store.reload(); }},
            {text:'导出',f_type:'all', iconCls:'button-excel',handler:download_excel},
            {text:'高级导出',f_type:'senior_all', iconCls:'button-excel',handler:function(){
                senior_win.show();
            }}
        ]
    });

    var cate_grid = new Ext.grid.GridPanel({
        store: cate_store,
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"类目名称", dataIndex:"category", width:220},
            {header:"收支", dataIndex:"ac_type", width:100,renderer:type}
        ],
        selModel:{
            selType: 'checkboxmodel',
            mode:'SIMPLE'
        },
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂无类目数据',
            deferEmptyText: true
        },
        tbar : ['选择类目',
            '->',
            {text:'导出所有类目',act:'all', handler:senior_excel},
            {text:'导出选中类目',act:'section', handler:senior_excel}]
    });


    function type(v){
        if(v=='in'){
            return '收入';
        }else{
            return '支出';
        }
    }

    var senior_win = Ext.create('Ext.Window', {
        title : '全部导出',
        width : 380,
        height:400,
        resizable : false,
        modal : true,
        items : cate_grid,
        closeAction : 'hide',
        layout:'fit',
        html:'<iframe id="download_ifm" name="download_ifm" frameborder="0" width="0" height="0"></iframe>'
    });

    var right_grid = new Ext.grid.GridPanel({
        region: 'east',
        width:250,
        store: right_store,
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"账户名称", dataIndex:"an_name", width:500}
        ],
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂无账户数据',
            deferEmptyText: true
        },
        tbar : ['选择账户:'
            ,{
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'Search_key',
                cls:'search-icon-cls',
                emptyText:'输入关键字',
                width:150,
                onTriggerClick:function (e) {
                    searchkey();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            searchkey();
                        }
                    }
                }
            }
        ]

    });

    function searchkey(){
        var skey=Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(right_store,{'an_name':skey});
        right_store.currentPage=1;
        right_store.load();
    }

    right_grid.on('select',function(i,v){
        var row=SUNLINE.getSelected(right_grid);
        var time=timeCombox.getValue();
        if(!time){
            Ext.Msg.alert('友情提示','请先选择月份！');
            return false;
        }
        SUNLINE.baseParams(left_store,{ac_name:row.data.an_name,detail_date:time})
        left_store.load();
    });

    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [left_grid,right_grid]
    });

    //导出函数
    function download_excel(){
        var row=SUNLINE.getSelected(right_grid);
        var time=timeCombox.getValue();
        if(!time){
            Ext.Msg.alert('友情提示','请先选择月份！');
            return false;
        }
        if(!row){
            Ext.Msg.alert('友情提示','请先选择账户！');
            return false;
        }
        var name='是否确认要导出明细账';
        var url='detail_date/'+time+'/ac_name/'+row.data.an_name;
        Ext.MessageBox.confirm('友情提示',name,function(y){
            if(y!='yes')return false;
            window.download_ifm.location = $__app__+'/Account/detail_excel/'+url;
        });
    }

    //高级导出
    function senior_excel(a){
        var time=timeCombox.getValue();
        if(a.act=='all'){
            var name='是否确认导出全部明细账';
            var url= $__app__+'/Account/senior_excel/detail_date/'+time;
        }else{
            var name='是否确认导出选中分类？';
            var rows=cate_grid.getSelectionModel().getSelection();
            if(rows.length==0){
                Ext.Msg.alert('友情提示','没有选中任何记录');
                return;
            }
            var data=[];
            for(var i=0;i<rows.length;i++){
                data[i]=rows[i]['data']['category'];
            }
            var url= $__app__ + '/Account/senior_excel/detail_date/'+time+'cate/'+data;
        }
        Ext.MessageBox.confirm('友情提示',name,function(y){
            if(y!='yes')return false;
            window.download_ifm.location =url;
        });

    }

})