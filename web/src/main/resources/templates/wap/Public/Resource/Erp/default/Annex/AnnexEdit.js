/**
 * Created by cjl on 2017/7/24.
 */
var annex_form = Ext.create('Ext.form.FormPanel', {
    border: false,
    padding: 15,
    bodyStyle: 'background:none;',
    items: [
        {id: "pa_id", xtype: 'hidden', name: "pa_id", allowBlank: true},
        {id: "pa_org_id", xtype: 'hidden', name: "pa_org_id", allowBlank: true},
        {
            xtype:'textfield',
            readOnly: true,
            disabled: true,
            id: 'pa_org_name',
            name: 'pa_org_name',
            labelAlign:'right',
            fieldLabel:'<font color="red">&nbsp;</font> 所属单位',
            labelWidth:80,
            width:400,
            height:20,
            allowBlank: true,
        },{
            margin: '10px 0 0 0',
            height: 80,
            html: "<label class='upload_file_name'><font color='red'>&nbsp;</font><font color='red'>*</font> 上传文件<span role='separator'>:</span></label>" +
            "<li class='cover-cls'> <button class='upload-btn' id='upload_file'>选择附件</button>" +
            "<div class='cover-img' id='cover-img_1'><form><div class='files'><div class='upload-selecter'></div>" +
            "<input type='file' name='upload-file' class='upload-file'></div></form>" +
            "</div><input type='hidden' id='pa_url' name='pa_url' class='form-id'>" +
            "<div id='pa_url_show' class='pa_url_show'></div>" +
            "<span class='upload-msg'>[支持附件类型:pdf、zip、rar、doc、docx、xls、xlsx、jpg、gif、png、7z，大小:不超过(2M)]</span></li>",
        }
    ]
});


var win = Ext.create('Ext.window.Window', {
    width: 500,
    bodyBorder: true,
    modal: true,
    closeAction: 'hide',
    items: [annex_form],
    buttons: [{
        text: '提交',
        handler: function (b) {
            var form = annex_form.getForm();
            if ( form.isValid() ) {
                var data = form.getValues();
                //获取上传文件的路径
                var pa_url = $("#pa_url").val();
                if (!pa_url) {
                    Ext.Msg.alert('信息提示', '上传文件不能为空，请先上传附件！');
                    return;
                }
                data.pa_url = pa_url;
                if( win.data.add_status == 1 ){
                    data.add_status = 1;
                    data.pid = win.data.pid;
                }else{
                    data.add_status = 0;
                    data.pid = 0;
                }
                Ext.Ajax.request({
                    url: $__app__ + '/Annex/batchSave',
                    params: data,
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (1 == ret.success) {
                            Ext.Msg.alert('信息提示', ret.message);
                            annex_form.reset();
                            if(data.add_status == 1 ){
                                top_store.reload();
                            }else{
                                bot_store.reload();
                            }
                            win.hide();
                        } else {
                            Ext.Msg.alert('信息提示', ret.message);
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '附件保存出错!');
                        annex_form.reset();
                    }
                });
            }
        }
    }, {
        text: '关闭',
        handler: function () {
            win.hide();
            annex_form.reset();
        }
    }]
});

win.on('show', function () {
    //刷新界面
    annex_form.reset();
    //启用上传插件
    uploads.construction();
    //获取单位名称和ID
    var pa_org_id = Ext.getCmp('p_org_name_id').getValue();
    var pa_org_name = Ext.getCmp('p_org_name_id').getRawValue();
    if ( isNaN(pa_org_id) || !pa_org_id ) {
        pa_org_id = _uinfo.org_id;
        pa_org_name = _uinfo.org_name;
    }
    //设置附件单位ID和单位名称
    Ext.getCmp('pa_org_id').setValue(pa_org_id);
    Ext.getCmp('pa_org_name').setValue(pa_org_name);
    //设置附件名称和文件地址
    $('input[name=pa_url]').val(win.data.pa_url);
    $('#pa_url_show').text(win.data.pa_url);
    Ext.getCmp('pa_id').setValue(win.data.pa_id);
});


/**
 * 编辑附件
 */
function editAnnex(_this) {
    var row = [];
    annex_form.reset();

    if( _this.id == 'batch_id' || _this.id == 'batch_id_bind' ){
        var row = [];
        win.setTitle('批量上传附件', _this.iconCls);
        var org_id = Ext.getCmp('p_org_name_id').getValue();
        org_id = !isNaN(org_id) ? org_id : _uinfo.org_id;

        row.data = [];
        row.data.pa_org_id = org_id;
        if( _this.id == 'batch_id_bind' ){
            row.data.pid = annex_win.pid; //产品ID
            row.data.add_status = 1;
        }
        win.data = row.data;

        //清空原先的数据
        $('input[name=pa_url]').val('');
        $('#pa_url_show').text('');
        upload_num = 0;
    }

    win.data = row.data;
    win.show();
}


var uploads = {
    construction: function () {
        this.uploadify();
    },
    uploadify: function () {
        $('.cover-img').uploadFile({
                url: $__app__ + '/Upload/ajax_upload',
                verify: {size: 2048, type: ['pdf','zip','rar','doc','docx','xls','xlsx','jpg','gif','png','7z']},
                multiple: true,
                select_id: '.upload-btn',
                load_msg: '正在努力上传中，请稍等...',
                data: {old_name: true,}
            }, function (r, data) { //complete
                    var old_url_arr = new Array();
                    var old_url = $('input[name=pa_url]').val();
                    if( old_url ){
                        old_url_arr = old_url.split(';');
                    }
                    old_url_arr.push(r.data.url);
                    $('input[name=pa_url]').val(old_url_arr.join(';'));

                    if( r.data.url ){
                        upload_num += 1;
                        $('#pa_url_show').html('<font color="green">附件上传成功'+upload_num+'个!</font>');
                    }
            }, function (r) { //error
                Ext.Msg.alert('友情提示', r.msg);
            }, function (r) {
                $('#pa_url_show').html('<font color="red">正在上传第'+(upload_num+1)+'个附件，请稍等！</font>');
            }
        );
    }
};