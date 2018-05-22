
//选中大区包含的省份直接作为参数传递后端，避免在后端再次查询
var area_pro_arr;
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '公众号设置';
    var url = $__app__ + '/ComponentAuth/authData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);
    store.load();

    var msg_form = new Ext.form.FormPanel({
        border:false,
        bodyPadding: 5,
        bodyStyle:"background:#fff;",
        autoHeight:true,
        style:'margin:10px;',
        region : 'center',
        width : 560,
        layout:'column',
        defaults : {
            defaultType : "textfield",
            defaults : {xtype:'textfield',style:'margin-top:5px;',width:250,labelWidth:90,labelAlign:"right"},
            bodyStyle:"background:#fff;"
        },
        items: [
            {xtype:'fieldset',title:'关注回复设置',cls:'tcol2',items:[
                {
                    xtype: 'radiogroup',
                    labelWidth:110,
                    width:300,
                    fieldLabel: '是否开启关注回复',
                    columns: 2,
                    vertical: true,
                    items: [
                        {boxLabel: '开启', name: 'cf_reply_open', inputValue:'1'},
                        {boxLabel: '关闭', name: 'cf_reply_open', inputValue:'0', checked: true},
                    ]
                },
                {id:"cf_reply_content",name:"cf_reply_content",fieldLabel:"关注回复内容",xtype:'textfield',labelWidth:110,width:410},
                {
                    xtype: 'label',
                    html: '50字',
                    width:110,
                    style:'float:right;color:#999;line-height:35px'
                },
                {
                    xtype: 'label',
                    html: '如果您在微信公众号后台已开启关注自动回复功能，点击开启后，会再次给用户发送一条关注回复内容。',
                    width:415,
                    style:'margin-left:7px;margin-bottom:10px;float:right;color:#999;'
                }
            ]},
            {xtype:'fieldset',title:'默认回复设置',cls:'tcol2',style:'padding-bottom:15px',items:[
                {id:"cf_default_content",name:"cf_default_content",fieldLabel:"默认回复内容",xtype:'textfield',labelWidth:110,width:410},
                {
                    xtype: 'label',
                    html: '50字',
                    width:110,
                    style:'margin-left:7px;float:right;color:#999;line-height:35px'
                }
            ]}
        ]
    });
    var msg_win =new Ext.Window({
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:msg_form,
        title:'消息管理设置',
        buttons:[
            {id:'save_btn',text:'保存', handler:authDataSave},
            {text:'关闭', handler:function () {
                msg_win.hide();
            }}
        ]
    })
    var msg_obj = $('.msg-set');
    msg_obj.on('click',function(){
        var params_val = {};
        params_val.cf_reply_open = store.getAt(0).get('cf_reply_open');
        params_val.cf_reply_content = store.getAt(0).get('cf_reply_content');
        params_val.cf_default_content = store.getAt(0).get('cf_default_content');
        msg_form.getForm().setValues(params_val);
        msg_win.show();
    });
    function authDataSave(){
        var params = msg_form.getForm().getValues();
        params.cf_app_name = $('#sq_app_name').text();
        params.cf_app_id = $('#sq_app_id').text();
        if(params.cf_reply_content.length > 50){
            Ext.Msg.alert('友情提示', '关注回复内容不能超过50字！');
            return false;
        }
        if(params.cf_default_content.length > 50){
            Ext.Msg.alert('友情提示', '默认回复内容不能超过50字！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示', '您确认要保存当前设置吗？', function (b) {
            if(b == "yes") {
                Ext.Ajax.request({
                    url: $__app__ + '/ComponentAuth/authDataSave',
                    method: 'POST',
                    params: params,
                    success: function (response, opts) {
                        var res = Ext.decode(response.responseText);
                        if (res.status == 1) {
                            msg_win.hide();
                            store.load();
                        }
                        Ext.Msg.alert('友情提示', res.info);
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '保存失败！');
                    }
                });
            }
        })
    }

});