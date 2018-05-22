/**
 * Created by cjl on 2017/6/21.
 */
Ext.onReady(function () {

    //品牌排序,只允许数字
    Ext.apply(Ext.form.field.VTypes, {
        num: function(val, field) {
            return /^\d+$/.test(val);
        },
        numText: "请输入数字！",
        //moneyMask: /[\d\.]/i
    });

    //可编辑设置
    if( _uinfo.org_type == '管理公司' ){
        var is_edit = Ext.create('Ext.form.TextField', {
            allowBlank: false,
            vtype:'num',
        });
        var isColsHide = false;
    }else {
        is_edit = false;
        var isColsHide = true;
    }
    //判断付款日期显示格式
    function is_cluster(v) {
        return v ? v : 0 ;
    }

    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: '<span style="color:blue">品牌排序</span>', dataIndex: 'cb_sort', width: 100, align: 'center',editor: is_edit, hidden:isColsHide, renderer:is_cluster},
        {text: '品牌名称', dataIndex: 'cb_name', width:200, align: 'left'},
        /*{text: '品牌简介', dataIndex: 'cb_brief', width:300,align: 'left'},*/
        {text: '品牌Logo', dataIndex: 'cb_logo_url', width:150,align: 'center', renderer:formatPic},
        {text: '是否显示', dataIndex: 'cb_show', width: 100, align: 'center'},
        {text: '所属单位', dataIndex: 'org_name', width:200,align: 'left'},
        {text: '添加人', dataIndex: 'u_name', width: 120, align: 'center'},
        {text: '添加时间', dataIndex: 'cb_time', width:150,align: 'center'},
    ];

    var url = $__app__ + '/Brand/getDataList';
    var field = ['cb_id','cb_name','cb_brief','cb_logo_url','cb_sort','cb_u_id','cb_show','cb_time'];
    var store = SUNLINE.JsonStore(url, field);

    var isEdit = true;
    var isCompanyHide = false;
    if( _uinfo.org_type != '管理公司' ){
        isEdit = false;
        isCompanyHide = true;
    }
    var isDisabled = false;
    if(  _uinfo.org_type == '管理公司' ){
        isDisabled = true;
    }

    //所属单位
    var company_box = SUNLINE.CompanyBox({
        where:{},
        fields:['id','text','org_bh'],
        url:$__app__ + '/Brand/getCompanyList',
        config:{
            editable:isEdit,
            hidden:isCompanyHide,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:300,
            labelAlign: 'right',
            value: '全部',
            pageSize:20,
            listConfig:{
                minWidth:340
            },
        }
    });
    company_box.on('select',function(c,r){
        doSearch();
    });

    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        viewConfig: {emptyText: '暂时没有信息'},
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var data = SUNLINE.getSelected(g.grid).data;
                        var cb_id = Number(data.cb_id);
                        var cb_sort = Number(data.cb_sort);

                        if( data.cb_logo_url ){
                            Ext.Ajax.request({
                                url: $__app__+'/Brand/updateBrandSort',
                                params: {cb_id: cb_id, cb_sort: cb_sort},
                                method:'post',
                                success: function(response){
                                    var r = Ext.decode(response.responseText);
                                    Ext.Msg.alert('友情提示', r.msg);
                                    if(r.status){
                                        store.load();
                                    }
                                }
                            });
                        }else{
                            Ext.Msg.alert('友情提示', "该品牌没有上传Logo，不能修改品牌序号");
                            return false;
                        }
                    }
                }
            })
        ],
        tbar:[
            {text: '添加', iconCls: 'button-add', id: 'add_id', handler:editBrand, disabled:false},
            {text: '编辑', iconCls: 'button-edit', id: 'edit_id', handler:editBrand, disabled:false},
            {text: '刷新', iconCls: 'button-ref', id: 'ref_id', handler: function () { store.reload()}},
            {text: '删除', iconCls: 'button-del', id: 'del_id', handler:delBrand, disabled:false},
            '-',
            {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn'},
            '-',
            company_box,
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'Search_key',
                emptyText: '品牌名称、品牌简介',
                width: 300,
                onTriggerClick: function (e) {
                    doSearch();
                },
                listeners: {
                    "specialkey": function (_t, _e) {
                        if (_e.keyCode == 13) {
                            doSearch();
                        }
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载送票站点',
                handler:function(){
                    window.location.reload();
                }
            }

        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        viewConfig:{ //面板可复制属性
            enableTextSelection:true
        },
        renderTo: Ext.getBody()
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    //查询条件搜索信息
    function doSearch(){
        var org_id = Ext.getCmp('p_org_name_id').getValue();
        var keyword = Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(store, {org_id:org_id, keyword: keyword});
        store.currentPage = 1;
        store.load();
    }

    //*********************************************************************
    //所属单位--新增、编辑时
    /*var company_box_list = SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        id:'cb_org_id',
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:80,
            width:300,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            editable:isEdit,
            listConfig:{
                minWidth:340
            },
        }
    });
    company_box_list.on('select', function(c,r ){
        var r = r[0];
        Ext.getCmp('h_org_id').setValue(r.get('id'));
    });*/

    var cb_name_len = 10;
    var cb_brief_len = 40;
    var brand_form = Ext.create('Ext.form.FormPanel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        items:[
            {id: "cb_id", xtype:'hidden', name: "cb_id",allowBlank: true},
            {id: "h_org_id", xtype:'hidden', name:"h_org_id", allowBlank: true},
            //company_box_list,
            {
                xtype:'textfield',
                id: "cb_name",
                name: "cb_name",
                labelAlign: 'right',
                fieldLabel: "<font color='red'>*</font> 品牌名称",
                labelWidth:80,
                width: 400,
                height:20,
                maxLength:cb_name_len,
                margin:'5px 0 0 0',
                maxLengthText:'最多可输入'+cb_name_len+'个字符',
                enableKeyEvents:true,
                allowBlank:false,
                listeners:{
                    change: function(t, e){
                        var val = t.getValue();
                        Ext.getCmp('cb_name').setValue(val.substring(0,cb_name_len));
                        var len = val.length >cb_name_len ? cb_name_len : val.length;
                        Ext.getCmp('word_count').setData(len+'/'+cb_name_len);
                    }
                },
                style: 'float:left',
            },{
                xtype: 'label',
                forId: 'word_count',
                id: 'word_count',
                html: '0/'+cb_name_len,
                height:24,
                width:40,
                style:'margin-top:5px;margin-left:10px;line-height:24px;align:center;display:inline-block;',
            },{
                margin:'10px 0 0 0',
                height:180,
                html:"<label class=\"upload_file_name\"><font color='red'>&nbsp;</font> 上传文件<span role=\"separator\">:</span></label>" +
                "<li class=\"cover-cls\"> <button class=\"upload-btn\" id=\"upload_file\">上传Logo</button>" +
                "<div class=\"cover-img\" id=\"cover-img_1\"><form><div class=\"files\"><div class=\"upload-selecter\"></div>" +
                "<input type=\"file\" name=\"upload-file\" class=\"upload-file\"></div></form>" +
                "</div><input type=\"hidden\" id=\"cb_logo_url\" name=\"cb_logo_url\" class=\"form-id\">" +
                "<span class=\"upload-msg\">[&nbsp;<font color='red'>如品牌Logo没上传，首页不推荐该品牌 </font>&nbsp;&nbsp;建议尺寸:(134*69)，大小:不超过(5M)]</span></li>"
            },{
                xtype:'textfield',
                vtype:'num',
                id: "cb_sort",
                name: "cb_sort",
                labelAlign: 'right',
                fieldLabel: "<font color='red'>&nbsp;</font> 品牌排序",
                labelWidth:80,
                width: 300,
                height:20,
                margin:'5px 0 0 0',
                enableKeyEvents:true,
            },{
                xtype: 'radiogroup',
                fieldLabel: "<font color='red'>*</font> 是否显示",
                labelAlign: 'right',
                labelWidth:80,
                width:240,
                columns: 2,
                vertical: false,
                items: [
                    {boxLabel: '显示', id: 'cb_show_yes', name: 'cb_show', inputValue: 1, checked: true},
                    {boxLabel: '不显示', id: 'cb_show_no', name: 'cb_show', inputValue: 0}
                ],
            }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        width: 500,
        bodyBorder: true,
        modal: true,
        closeAction: 'hide',
        items:[brand_form],
        buttons: [{
            text: '提交',
            handler:function(b){
                var param = brand_form.getForm();
                if ( param.isValid() ){
                    //把默认类型中的中文转换成其值
                    var data = param.getValues();
                    var cb_logo_url = document.getElementById('cb_logo_url').value;
                    data.cb_logo_url = cb_logo_url;

                    Ext.Ajax.request({
                        url: $__app__ + '/Brand/save',
                        params: data,
                        method: 'POST',
                        success: function (response, otps) {
                            var ret = Ext.decode(response.responseText);
                            if (1 == ret.success) {
                                var b_text = '！'
                                if( !cb_logo_url ){
                                    b_text = '！但你没有上传品牌Logo，该品牌在首页不显示'
                                }
                                Ext.Msg.alert('信息提示', ret.message + b_text );

                                brand_form.reset();
                                store.reload();
                                win.hide();
                            } else {
                                Ext.Msg.alert('信息提示', ret.message);
                            }
                        },
                        failure: function (response, otps) {
                            Ext.Msg.alert('信息提示', '品牌保存出错!');
                            brand_form.reset();
                        }
                    });

                }

            }
        }, {
            text: '关闭',
            handler: function () {
                win.hide();
                brand_form.reset();
            }
        }]
    });
    win.on('show', function(){
        if( win.data && win.data.cb_show == '不显示' ){
            Ext.getCmp('cb_show_no').setValue(true);
        }else{
            Ext.getCmp('cb_show_yes').setValue(true);
        }
        var logo_url = '';
        if( win.data && win.data.cb_logo_url ){
            logo_url = win.data.cb_logo_url;
        }

        if( win.data && win.data.h_org_id ){
            var hid = win.data.h_org_id;
            if( isNaN(win.data.h_org_id) ){
                hid = _uinfo.org_id;
            }
            Ext.getCmp('h_org_id').setValue(hid);
        }

        uploads.construction( logo_url );
        $("input[name=cb_logo_url]").val( logo_url );
    });

    var uploads = {
        construction: function (logo_url) {
            this.uploadify(logo_url);
        },
        uploadify: function (logo_url) {
            $('.cover-img').uploadFile({
                    url: $__app__ + '/Upload/ajax_upload',
                    verify: {size: 5000, type: ['jpg', 'JPG', 'gif', 'PNG', 'png', 'GIF']},
                    multiple: false,
                    select_id: '.upload-btn',
                    process: '?x-oss-process=image/resize,m_mfit,h_39,w_134',
                    load_msg: '正在努力上传中，请稍等...',
                    default_url: logo_url,
                    data: {
                        table_model: '产品',
                        table_id: 3045
                    }
                }, function (r, data) {
                    $('input[name=cb_logo_url]').val(r.data.url);
                }, function (r) {
                    Ext.Msg.alert('友情提示', r.msg);
                }
            );
        }
    };

    //打开新增或编辑
    function editBrand( _this ){
        var row = [];
        brand_form.reset();

        if(_this.id == 'add_id'){
            win.setTitle('添加品牌', _this.iconCls);
            var org_id = Ext.getCmp('p_org_name_id').getValue();
            if( org_id == '全部' ){
                return ExtAlert('请先选择品牌的所属单位！', '友情提示');
            }
            row.data = [];
            row.data.h_org_id = org_id;
        }else{
            row = SUNLINE.getSelected(grid);
            if (!row) {
                return ExtAlert('请选择编辑的品牌信息!', '友情提示');
            }
            win.setTitle('编辑品牌', _this.iconCls);
            row.data.h_org_id = row.data.cb_org_id;
            row.data.cb_org_id = row.data.org_name;
            console.log(row.data);
            brand_form.getForm().setValues(row.data);
        }

        win.data = row.data;
        win.show();
    }

    /**
     * 删除品牌
     */
    function delBrand(){
        var row = SUNLINE.getSelected(grid);
        if (!row ) {
            return ExtAlert('请选择删除的品牌!', '友情提示');
        }
        Ext.MessageBox.confirm('友情提示', '你确定要删除该品牌？', function (v) {
            if ('yes' == v) {
                Ext.Ajax.request({
                    url: $__app__ + '/Brand/del',
                    params: {cb_id: row.data.cb_id},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.success) {
                            Ext.Msg.alert('信息提示', '品牌删除成功!');
                            store.reload(); //重新加载数据
                        } else {
                            Ext.Msg.alert('信息提示', ret.message);
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '品牌删除出错!');
                    }
                });
            }
        });
    };

    function formatPic(v,m,r){
        var img = '';
        if( v ){
            img = "<img style='height: 20px;' src='" +v + "?x-oss-process=image/resize,m_fill,h_30,w_60' data-qtip='<img src=" + v + "?x-oss-process=image/resize,m_fill,w_500>'>";
        }
        return img;
    };

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'Brand', table: 'CompanyBrand', pk_id:'cb_id'}] });

});

