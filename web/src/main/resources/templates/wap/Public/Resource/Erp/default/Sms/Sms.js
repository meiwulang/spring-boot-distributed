/**
 * Created by RenXiaoyu on 2017/8/18.
 */
/**
 * Created with JetBrains PhpStorm.
 * User: asun
 * Date: 14-1-20
 * Time: 下午11:45
 * To change this template use File | Settings | File Templates.
 */

Ext.onReady(function () {

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '短信管理';
    var _storeUrl = $__app__ + '/Sms/sms_data';
    function sender(v,m,r){
        var user_name= r.get('sms_user');
       if(v && user_name){
           return "["+user_name+"]";
       }else {
           return '';
       }
    };

    function tip_content(v, m){
        if(v){
            m.attr = 'qtip="' + v.replace(/\"/ig, "\\\"") + '"';
            return v;
        }else{
            return '';
        }
    };
    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }
    var _cm =
        [
            new Ext.grid.RowNumberer({width:50}),
            {header: "ID",dataIndex: "_id",width: 50, hidden:true},
            {header: "接收者号码",dataIndex: "sms_phone",width: 150},
            {header: "短信内容",dataIndex: "sms_content",width: 400, renderer:tip_content},
            {header: "发送节点",dataIndex: "sms_node",width: 100},
            {header: "操作人",dataIndex: "sms_user",width: 100, renderer:sender},
            //{header: "发送次数",dataIndex: "sms_number",width: 100},
            {header: "加入时间",dataIndex: "sms_time",width: 150},
            {header: "发送时间",dataIndex: "sms_send_time",width: 150,renderer:format_date}
        ];



    var _fld = [
        "_id","sms_action","sms_content","sms_module","sms_nid","sms_node","sms_number","sms_phone",
        "sms_send_time","sms_sub_number","sms_time","sms_user","sms_user_id","sms_user_name"
    ];
    var _store = SUNLINE.JsonStore(_storeUrl, _fld);
    _store.load();
    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,
        loadMask: {msg : '数据传输中，请稍倿...'},//导入时显示loading
        store: _store,
        columns: _cm,
        //sm: new Ext.grid.RowSelectionModel({singleSelect:true}),//行选择模式(单逿)
        viewConfig : {emptyText: '尚无短信',enableTextSelection:true},
        tbar : [

            {text:'重新发送', handler:send_sms},
            '-',
            {text:'刷新',iconCls:'button-ref', handler:function(){_store.reload();}},
            '-',
            '加入时间：',
            SUNLINE.ExtDateField({id:'bl_startTime',name:'bl_startTime',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'bl_startTime',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'bl_endTime',name:'bl_endTime',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'bl_endTime'}),
            '-',
            {text:'查询',iconCls:'searchico',act:'select',handler:startReloadStore},
            '-',
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'search',
                iconCls:'button-sch',
                emptyText:'手机号码、短信内容、节点名称、操作人',
                width:280,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13){
                            dosearch();
                        }

                    }
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'close.gif',
                cls: 'x-btn-icon',
                tooltip: getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            }
        ],

        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0}到{1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        renderTo: Ext.getBody()
    });

    _grid.getSelectionModel().on('rowselect', function(sm, rowindex, row){
        //window.lgo_view.location = $__app__ + '/Log/show/id/' + row.get('_id');
    });

    function send_sms(b){
       if(b.text == '重新发送'){
           var row=SUNLINE.getSelected(_grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选则需要重新发送的记录');return;
            }
            Ext.Msg.confirm('发送确认','确定要向号码'+ row.get('sms_phone') +'重新发送该信息吿?',callback);
            function callback(v){
                if(v == 'yes'){
                    var sms_phone = row.get('sms_phone');
                    var sms_content = row.get('sms_content');
                    var _id = row.get('_id');
                    var tpl_id = row.get('sms_tpl_id');
                    var sms_data = JSON.stringify(row.get('sms_data'));

                    Ext.Ajax.request({
                        url:$__app__ + '/Sms/again_send',
                        params:{sms_phone:sms_phone,sms_content:sms_content,_id:_id,sms_data:sms_data,tpl_id:tpl_id},
                        method:'POST',
                        success:function (response,o) {
                            var result = Ext.decode(response.responseText);
                            console.log(result);
                            if(result.code == 200){
                                _store.load({params:{start:0, limit:pageSize}});
                                Ext.Msg.alert('友情提示',result.message);
                            }else{
                                Ext.Msg.alert('错误提示',result.message);
                            }
                        },
                        failure:function (response, otps) {
                            Ext.Msg.alert('友情提示', '操作失败');
                        }
                    })
                }else{

                }
            }
        }
    };


    function startReloadStore(){
      var start_time = Ext.util.Format.date(Ext.getCmp('bl_startTime').getValue(),'Y-m-d ');
      var end_time = Ext.util.Format.date(Ext.getCmp('bl_endTime').getValue(),'Y-m-d ');
     SUNLINE.baseParams(_store,{start_time:start_time,end_time:end_time},true);
        _store.load();
    };

    function dosearch() {
        var skey = Ext.getCmp('search').getValue();//获取search里面的倿
        var start_time = Ext.util.Format.date(Ext.getCmp('bl_startTime').getValue(),'Y-m-d');
        var end_time = Ext.util.Format.date(Ext.getCmp('bl_endTime').getValue(),'Y-m-d');
        SUNLINE.baseParams(_store,{skey:skey,start_time:start_time,end_time:end_time});
        _store.currentPage=1;
        _store.load();

    };

    function format_date(v){
        var t= Ext.util.Format.date(new Date(parseInt(v) * 1000),'Y-m-d H:i:s');
        var now = Date.parse(new Date()) / 1000;
        if(v - now > 0) {
            return '<font color="red">'+ t +'</font>';
        }else{
            return t;
        }
    };

    Ext.create('Ext.Viewport',{
        layout : 'border',
        items : [_grid]
    });

});