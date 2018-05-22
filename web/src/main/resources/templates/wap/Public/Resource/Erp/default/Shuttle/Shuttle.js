var org_info = {};
Ext.onReady(function(){
    var store = SUNLINE.JsonStore($__app__+'/Shuttle/dataJson',[]);
    var cm = [
        new Ext.grid.RowNumberer(),
        {header:'ID',dataIndex:'sh_id',hidden:true},
        {header:'送团人ID',dataIndex:'sh_shuttle_id',hidden:true},
        {header:'出发口岸',dataIndex:'sh_area_list',width:220,renderer:function(v){
            return '<span title = "'+v+'">'+v+'</span>';
        }},
        {header:'送团人姓名',dataIndex:'sh_realname',width:100},
        {header:'送团人账号',dataIndex:'sh_name',width:100},
        {header:'送团人手机',dataIndex:'sh_mob',width:100},
        {header:'送团人所属部门ID',dataIndex:'sh_wgid',hidden:true},
        {header:'送团人所属部门',dataIndex:'sh_wgname',width:150},
        {header:'送团人公司ID',dataIndex:'sh_org_id',hidden:true},
        {header:'送团人公司名称',dataIndex:'sh_org_name',width:150},
        {header:'添加时间',dataIndex:'sh_time',width:150,renderer:time}
    ];

    var companyCombox = SUNLINE.ComBoxPlus({
        id:'company',
        fields:['org_id','org_name'],
        url:$__app__+'/UserArea/getCompany',
        config:{
            displayField:'org_name',
            valueField:'org_id',
            emptyText:'请选择分公司',
            width:300,
            listeners:{
                select:function(v,i,r){
                    org_info = i[0].data;
                    SUNLINE.baseParams(store,{sh_org_id:org_info.org_id});
                    store.currentPage=1;
                    store.load();
                }
            }
        }
    });

    companyCombox.getStore().on('load',function(){
        this.add({org_id:0,org_name:'全部分公司'});
    })

    if(_uinfo){
        if(_uinfo.org_type == '管理公司' && _uinfo.org_pid != 0){
            companyCombox.setDisabled(true);
            companyCombox.setValue(_uinfo.org_name);
        }
    }

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        fixed:true,
        viewConfig:{emptyText:'没有送团人信息'},
        tbar:[
            '<span style = "color:#00b7ee">送团人管理</span>',
            companyCombox,
            {text:'添加送团人',act:'添加',iconCls:'button-add',handler:create_shuttle,disabled:isDisabled('Shuttle::add')},
            {text:'编辑送团人',act:'编辑',iconCls:'button-edit',handler:create_shuttle,disabled:isDisabled('Shuttle::edit')},
            {text:'删除送团人',act:'删除',iconCls:'button-del',handler:del_shuttle,disabled:isDisabled('Shuttle::del')},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'Search',
                iconCls:'button-sch',
                emptyText : '用户名称，用户手机号',
                width:150,
                onTriggerClick:function(e){
                    Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            Search();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有送团人信息'
        })
    });

    var cityList=SUNLINE.ComBoxPlus({
        id:'area_list',
        fields:['sd_name'],
        url:$__app__+'/Shuttle/getStart',
        config:{
            fieldLabel:'选择出发口岸',
            displayField:'sd_name',
            valueField:'sd_name',
            width:410,
            labelWidth:90,
            labelAlign:'right',
            multiSelect: true,
            allowBlank: false
        },
        type:'Tag'
    });

    var user_store = SUNLINE.JsonStore($__app__+'/UserArea/getUser',['u_id','u_name','u_realname','u_mobile'], false);
    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:90,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID',id:'sh_id',name: 'sh_id',hidden:true},
            {fieldLabel: '送团人ID',id:'sh_shuttle_id',name: 'sh_shuttle_id',hidden:true},
            cityList,
            {fieldLabel:'选择送团人账号',id:'sh_name',name:'sh_name',hidden:true},
            {fieldLabel:'选择送团人手机号',id:'sh_mob',name:'sh_mob',hidden:true},
            {
                id:"sh_realname",
                name:"sh_realname",
                fieldLabel:"选择送团人",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:user_store,
                Style:'display: inline-block;',
                minChars:2,
                loadingText:'正在加载数据',
                valueField:'u_realname',
                queryMode:'remote',
                typeAhead: true,
                selectOnFocus:true,
                emptyText:'请选择送团人',
                allowBlank:false,
                tpl: Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{u_name} - {u_realname} - {u_mobile}</li>',
                    '</tpl></ul>'
                ),
                displayField: 'u_realname',
                listeners:{
                    select:function(v,i,r){
                        var row = i[0].data;
                        Ext.getCmp('sh_shuttle_id').setValue(row.u_id);
                        Ext.getCmp('sh_name').setValue(row.u_name);
                        Ext.getCmp('sh_mob').setValue(row.u_mobile);
                    },
                    beforequery:function(){
                        SUNLINE.baseParams(user_store,{org_id:org_info.org_id});
                        user_store.load();
                    }
                }
            }
        ]
    })

    var win = Ext.create('Ext.window.Window',{
        title:'添加送团人',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form],
        buttons: [
            {text: '提交',handler: submit},
            {text: '关闭',handler:function(){
                win.hide();
            }}
        ]
    });

    win.on('hide',function(){
        form.getForm().reset();
    });

    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })

    function Search(){
        var skey=Ext.getCmp('Search').getValue();
        var orgID = companyCombox.getValue();
        SUNLINE.baseParams(store,{sh_org_id:orgID,skey:skey});
        store.currentPage=1;
        store.load();
    }

    function time(v){
        if(v==0 || !v){
            return;
        }
        v= new Date(parseInt(v)*1000);
        var date = Ext.Date.format(v,'Y-m-d H:i:s');
        return date;
    }

    function create_shuttle(t){
        var orgData = companyCombox.getValue();
        if(!orgData){
            Ext.Msg.alert('温馨提示','请先选择公司');
            return false;
        }
        if(t.act == '添加'){
            win.show();
        }else if(t.act == '编辑'){
            var row = SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('温馨提示','请先选择要编辑的送团人信息');
                return false;
            }
            win.show();
            row.data.area_list = row.data.sh_area_list.split(',');
            form.getForm().setValues(row.data);
        }
        var titleStr = t.act + '送团人';
        win.setTitle(titleStr);
    }

    function del_shuttle(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','请先选择要删除的送团人信息');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该送团人吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Shuttle/del',
                    params:{sh_id:row.data.sh_id},
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


    function submit(){
        var formValue = form.getForm().getValues();
        if(!form.getForm().isValid()){
            Ext.Msg.alert('友情提示','请把红色框填写完整');
            return false;
        }
        var len = formValue.area_list.length;
        formValue.sh_area_list = '';
        $.each(formValue.area_list,function(i,v){
            if(i==(len-1)){
                formValue.sh_area_list += v;
            }else{
                formValue.sh_area_list += v+',';
            }
        })
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Shuttle/save',
            method:'POST',
            params: formValue,
            success: function(response){
                var r = Ext.decode(response.responseText);
                myMask.hide();
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status == 1){
                    win.hide();
                    store.reload();
                    form.getForm().reset();
                }
            }
        })
    }
})