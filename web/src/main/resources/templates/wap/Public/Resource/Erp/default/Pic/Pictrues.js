/*
* 图片库管理*/

Ext.onReady(function(){
    var thisTitle = '图片库管理';
    var org_id=_uinfo.org_id;
    var url=$__app__ + '/Pic/picture_load_data';
    var field = [];
    var pic_store = new SUNLINE.JsonStore(url, field,false,{pageSize:40});
    SUNLINE.baseParams(pic_store,{'at_org_id':org_id});
    pic_store.load();
    var at_url=$__app__ + '/Pic/pic_up/at_id/';


    var imageTpl = new Ext.XTemplate(
        '<div  style="background: #3892D3; height:10px;width: 100%">',
        '</div>',
        '<tpl for=".">',
        '<div class="thumb-wrap scenic-cls">',
        '<i class="fa fa-check-circle"></i><img src="{at_url}?x-oss-process=image/resize,m_fill,h_110,w_150" /><a href="'+at_url+'{at_id}" title="点击查看原图" target="_blank" class="up_a"><i class="fa fa-search-plus"></i></a><span class="scenic-txt">{at_name}</span>',
        '</div>',
        '</tpl>'
    );


    /*编辑窗口*/

    var form=Ext.create('Ext.form.Panel',{

        border:false,
        padding:15,
        bodyStyle:'background:none;',
        items:[
            {
                defaults: {
                    labelWidth:90,
                    labelAlign:'right',
                    xtype:'textfield'
                },
                items:[

                    {id:'pic_id',name:"at_id",xtype:'hiddenfield'},

                    {id:'pic_name',name:"at_name",fieldLabel:"图片名称" },

                ]
            }
        ]
    });



    var pic_edit=new Ext.Window({
        title:'编辑图片名称',
        width:350,
        height:130,
        closeAction:'hide',
        fixed:true,
        modal:true,

        items:[form],

        buttons:[
            {text : '保存',handler:save_pic},
            {text : '关闭', handler:function(){pic_edit.hide();}}
        ]
    });



    var pic_view=Ext.create('Ext.view.View', {
        margin : '10 10 10 10',
        //autoScroll:true,
        store: pic_store,
        tpl: imageTpl,
        simpleSelect:true,
        multiSelect :true,
        overClass:'header-view-over',
        selectedClass:'header-view-selected',
        itemSelector:'div.thumb-wrap',
        emptyText: '没有图片信息',

    });


    var resource_type_combox=SUNLINE.LocalComob({
        id:'resource_type',
        fields:['name','value'],
        data:[
            {name:'全部',value:''},
            {name:'酒店',value:'hotel'},
            {name:'景点',value:'scenic'}
        ],
        config:{
            labelWidth:60,
            width:160,
            value:'全部',
            valueField:'value',
            displayField:'name',
            labelAlign:'right',
            fieldLabel:'资源类型'
        }
    });
    var resource_list_combox=SUNLINE.ComBoxPlus({
        id:'resource_list',
        fields:['id','rs_name'],url:$__app__+'/Resource/get_name',
        where:{},
        config:{
            readOnly:true,
            displayField:'rs_name',
            emptyText:'----请选择资源后进行上传操作----',
            valueField:'id',
            width:360,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item"><span class="list-right">{rs_province}-{rs_city}-{rs_county}</span>{rs_name}</li>',
                '</tpl></ul>'
            ),
            value:'',
            pageSize:20,
           // fieldLabel:'资源类型',
            padding:'0 0 0 0'

        }
    });






    resource_type_combox.on('select',function(c,r){
        var row= r[0].data;
        var list_store=resource_list_combox.getStore();
        SUNLINE.baseParams(list_store,{type:row.value});

        if(row.name=='全部'){
            resource_list_combox.setReadOnly(true);
            resource_list_combox.setValue('----请选择资源后进行上传操作----');
            //resource_list_combox.setStyle('color', 'red');
            //resource_list_combox.setStyle({
            //    color:"red"
            //});
        }else {
            resource_list_combox.setReadOnly(false);
            resource_list_combox.setValue('');
        }
        list_store.currentPage=1;
        list_store.load();


    });


    var combox='';
    var pic_panel=Ext.create('Ext.form.Panel',{
        width: "100%",
        height:"100%",
        autoScroll:true,
        tbar:[
            resource_type_combox,
            '-',
            '资源名称：',
            resource_list_combox,
            {text:'查询',iconCls:'button-edit',id:'combox_search',handler:function(){
                img_search('combox');
            }},
            '-',
            {text:'编辑',iconCls:'button-edit',handler:img_edit},
            '-',
            {text:'删除',iconCls:'button-del',handler:img_del},
            '-',
            {text : '上传图片',handler:img_upload},
             '->','快速搜索：',
             {
             xtype:'trigger',
             triggerCls : 'x-form-search-trigger',
             id:'Search_key',
             emptyText : '图片名称,资源名称',
             width:280,
             onTriggerClick:function(e){
                 img_search('text');
                 },
             listeners :{
             "specialkey" : function(_t, _e){
                 if (_e.keyCode==13)
                     img_search('text');
                     }
                },
             },
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){
                    window.location.reload();
                }
            },

        ],

        items:[pic_view],
        bbar:new Ext.PagingToolbar({
            pageSize:50,
            store:pic_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        }),
        renderTo:Ext.getBody()
    });

    /*
    * 下拉联动搜索功能
    */
    function img_search( type ){
        if( type == 'text'){
            var skey=Ext.getCmp('Search_key').getValue();
        }else if (type == 'combox'){
            var skey='';
        }
        var resource_key=resource_list_combox.getValue();
        var resource_type=resource_type_combox.getValue();


        if(resource_type=='全部'){
            resource_type='';
        }
        if(resource_key=='----请选择资源后进行上传操作----'){
            resource_key='';
        };
        SUNLINE.baseParams(pic_store,{'at_org_id':org_id,'at_name':skey,'at_remark':skey,'at_table_id':resource_key,'at_table':resource_type});
        pic_store.currentPage=1;
        pic_store.load();
    }


    /*
     * 上传功能实现
     */
    function img_upload(){
        var resource_type=resource_type_combox.getValue();
        var at_table_id=resource_list_combox.getValue();
        if(resource_type=='全部' || resource_type==''){
            Ext.Msg.alert('友情提示','请选择资源后进行上传操作');
            return false;
        }

        var resource_name=resource_list_combox.getRawValue();


        if (!at_table_id){
            at_table_id=0;
        }
        if(resource_type=='hotel'){
            resource_type='酒店';

        }else if(resource_type=='scenic'){
            resource_type='景点'
        }
        upload_win.show();

        window.pic_iframe.location=$__app__+'/Pic/index/table_model/'+resource_type+'/table_id/'+at_table_id+'/resource_name/'+resource_name;



    };

    function add_load(){
        //资源下上传图片后store的重载
        var resource_key=resource_list_combox.getValue();
        var resource_type=resource_type_combox.getValue();
        if(resource_type=='全部'){
            resource_type='';
        }

        SUNLINE.baseParams(pic_store,{'at_org_id':org_id,'at_table_id':resource_key,'at_table':resource_type});


        pic_store.currentPage=1;
        pic_store.load();


        upload_win.hide();
    };
    /*
    * 上传窗口
    */
    var upload_win=new Ext.Window({
        title:'上传图片',
        width:650,
        height:400,
        closeAction:'hide',
        fixed:true,
        modal:true,
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>',
        buttons:[
            {text:'确定添加到相册',handler:add_load}
        ]
    });
    /*编辑功能*/

    function img_edit(){
        var row=pic_view.getSelectionModel().getSelection();
        if (row==false){
            Ext.Msg.alert('友情提示','请选择图片');
            return false;
        }
        if(row.length>1){
            Ext.Msg.alert('友情提示','请选择一张图片');
            return false;
        }

        var img_id=row[0].data.at_id;
        var img_name=row[0].data.at_name;

        pic_edit.on('show', function(w){
            Ext.getCmp('pic_id').setValue(img_id);
            Ext.getCmp('pic_name').setValue(img_name);
           // form.getForm().setValues(img_name);
        });
        pic_edit.show();
    }
    function save_pic(){
        Ext.MessageBox.confirm('友情提示','你确定要修改信息吗？',function(y){
            if(y!='yes')return false;
            Ext.Ajax.request({
                url:$__app__ + '/Pic/edit',
                params:form.getForm().getValues(),
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status == 1) {
                        pic_store.load();
                        pic_edit.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });
    }

    /*
    * 图片删除
    */
    function img_del(){
        var row=pic_view.getSelectionModel().getSelection();
        if (row==false){
            Ext.Msg.alert('友情提示','请选择图片');
            return false;
        }
        var img_id=[];
        for (var i= 0;i<row.length;i++){
            img_id.push(row[i].data.at_id);
        }
        img_id=img_id.join(',');
        Ext.MessageBox.confirm('友情提示','你确定要删除图片吗？',function(y){
            if(y!='yes')return false;
            Ext.Ajax.request({
                url:$__app__ + '/Pic/del',
                params:{'at_id':img_id},
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    Ext.Msg.alert('友情提示', msg);
                    if (result.status == 1) {
                        pic_store.load();
                    };

                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });

    }



})