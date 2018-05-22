Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var menu_data;

    var grid_load_flag=false;
    var iframe_load_flag=false;
    var url= $__app__ + '/WxMenu/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);

    var country_url= $__app__ + '/WxMenu/get_area';
    var country_store=SUNLINE.JsonStore(country_url,[],false);

    var province_url= $__app__ + '/WxMenu/get_area';
    var province_store=SUNLINE.JsonStore(province_url,[],false);
    province_store.on('beforeload',function(){
        if(Ext.getCmp('country').getValue()=='全部'){
            province_store.loadData([{wa_province:'全部'}]);
            Ext.getCmp('province').setValue('全部');
            return false;
        }
    })

    var city_url= $__app__ + '/WxMenu/get_area';
    var city_store=SUNLINE.JsonStore(city_url,[],false);
    city_store.on('beforeload',function(){
        if(Ext.getCmp('province').getValue()=='全部'){
            city_store.loadData([{wa_city:'全部'}]);
            Ext.getCmp('city').setValue('全部');
            return false;
        }
    })

    var group_url= $__app__ + '/WxGroup/get_group';
    var group_store=SUNLINE.JsonStore(group_url,[],true);

    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"wm_id", width:50, hidden:true},
        {header:"微信ID", dataIndex:"wm_wid", width:50, hidden:true},
        {header:"适用性别", dataIndex:"wm_range", width:80,renderer:get_sex},
        {header:"适用分组", dataIndex:"wm_range", width:100,renderer:get_group},
        {header:"适用客户端", dataIndex:"wm_range", width:100,renderer:get_mobile},
        {header:"适用地区", dataIndex:"wm_range", width:120,renderer:get_addr},
        {header:"菜单备注", dataIndex:"wm_remark", width:80,editor:{}}
    ]

    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
        wxapp_combo.getStore().on('load',function(store,records){
            if(records.length>0){
                wxapp_combo.setValue(records[0].data.wa_appid);
                wxapp_combo.focus();
            }
    })

    //添加窗口的表单
    var win_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"group_id",
                id:"group_id",
                fieldLabel:"分组",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:group_store,
                displayField:"wg_name",
                valueField:"wg_gid",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:"全部"
            },
            {
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"sex",
                id:"sex",
                fieldLabel:"性别",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['combo_value','input_value'],
                    data:[
                        ['全部',0],
                        ['男',1],
                        ['女',2]
                    ]
                }),
                displayField:"combo_value",
                valueField:"input_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:0
            },
            {
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"client_platform_type",
                id:"client_platform_type",
                fieldLabel:"客户端",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['display_value','input_value'],
                    data:[
                        ['全部',0],
                        ['IOS',1],
                        ['Android',2],
                        ['其他',3]
                    ]
                }),
                displayField:"display_value",
                valueField:"input_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:0
            },
            {
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"country",
                id:"country",
                fieldLabel:"国家",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:country_store,
                displayField:"wa_country",
                valueField:"wa_country",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:"全部",
                listeners:{ 'change':function (v,r,o) {
                        SUNLINE.baseParams(province_store,{'wa_country':r});
                        province_store.currentPage = 1;
                        province_store.load();
                    }
                }
            },{
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"province",
                id:"province",
                fieldLabel:"省份",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:province_store,
                displayField:"wa_province",
                valueField:"wa_province",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:"全部",
                listeners:{ 'change':function (v,r,o) {
                        SUNLINE.baseParams(city_store,{'wa_province':r});
                        city_store.currentPage = 1;
                        city_store.load();
                    }
                }
            },{
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"city",
                id:"city",
                fieldLabel:"城市",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:city_store,
                displayField:"wa_city",
                valueField:"wa_city",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:"全部"
            },
            {id:"wm_remark", name:"wm_remark", fieldLabel:"菜单备注" }
        ]
    });

   /* province_store.on('load',function(){
        var province_val= Ext.getCmp('province').getValue();
        SUNLINE.baseParams(city_store,{'wa_province':province_val});
        city_store.currentPage = 1;
        city_store.load();
    })*/


    //菜单添加窗口
    var add_win=new Ext.Window({
        title : '添加菜单',
        layout: 'border',
        width : 350,
        height: 300,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[win_form],
        buttons: [
            {text : '确定', handler:menu_range},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

    var input_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:100,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"open_id", name:"open_id", fieldLabel:"微信号/openid", allowBlank: false}
        ]
    });

    //菜单添加窗口
    var test_input_win=new Ext.Window({
        title : '测试个性化菜单',
        layout: 'border',
        width : 300,
        height: 130,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[input_form],
        buttons: [
            {text : '确定', handler:post_openid},
            {text : '关闭', handler:function(){test_input_win.hide();}}
        ]
    });

    //菜单添加窗口
    var test_win=new Ext.Window({
        title : '菜单预览',
        layout: 'border',
        width : 600,
        height: 400,
        style:'background-color:#fff;',
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe name="mobile_iframe" id="mobile_iframe" style="width:100%;height:100%;border:none;overflow: hidden" src="'+$__app__+'/WxMenu/mobile"></iframe>'
    });

    //左边表格
    var left_grid=Ext.create('Ext.grid.Panel',{
        region:'west',
        width:500,
        store:store,
        style:'border-top:1px solid #157FCC',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:cm ,
        viewConfig:{emptyText:'没有本地信息，请先同步菜单'},
        tbar:[
            {text:'添加',iconCls:'button-add',hidden:isDisabled('WxMenu::add'),handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                if(store.getCount()<=0){
                    Ext.Msg.confirm('友情提示', "未发现本地数据，是否同步？",function(opt){
                        if(opt=='yes'){
                            ajax_sync(s);
                        }
                    })
                    return;
                }
                var content=store.getAt(store.getCount()-1);
                if(content.data.wm_content=='[]'){
                    Ext.Msg.alert('友情提示','请先完善上一个菜单！');
                    return;
                }
                add_win.show()
            }},
            {text:'删除',id:'del_btn',iconCls:'button-del',hidden:isDisabled('WxMenu::del'),handler:menu_del}
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有菜单数据'
        })
    });

    //右边窗口
    var right_panel = new Ext.panel.Panel({
        border : true,
        split : {size:3},
        region : 'center',
        width:600,
        layout :'border',
        html:'<iframe width="100%" height="100%" name="menu_iframe" id="menu_iframe" style="border:none" src="/WxMenu/menu"></iframe>',
        tbar:{
            style:'border-bottom:1px solid #C1C1C1 !important',
            border:true,
            height:37,
            items:[
                '<span style="color:#009DDA;font-size: 15px;font-family:微软雅黑">当前菜单匹配项:</span>',
                {
                    xtype: 'displayfield',
                    id: 'show_addr',
                    name: 'show_addr'
                },
                {
                    xtype: 'displayfield',
                    id: 'show_sex',
                    name: 'show_sex'
                },
                {
                    xtype: 'displayfield',
                    id: 'show_group',
                    name: 'show_group'
                },
                {
                    xtype: 'displayfield',
                    id: 'show_mobile',
                    name: 'show_mobile'
                },
                '->',
                {id:'save_btn',text:'保存',iconCls:'fa fa-floppy-o',cls:'control-button-custom',overCls:'',hidden:isDisabled('WxMenu::save'),handler:save_menu}
            ]
        }
    });

    //总窗口
    var menu_panel = new Ext.panel.Panel({
        border : false,
        region : 'center',
        layout :'border',
        items : [left_grid, right_panel],
        tbar:[
            wxapp_combo,
            {text:'同步菜单',iconCls:'button-save',handler:menu_sync,hidden:isDisabled('WxMenu::sync')},
            {text:'清除所有菜单',iconCls:'button-del',handler:menu_clear,hidden:isDisabled('WxMenu::clear')},
            {text:'测试个性菜单',iconCls:'button-del',hidden:isDisabled('WxMenu::test'),handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                test_input_win.show();
            }}
        ]
    });

    wxapp_combo.on('change',function(){
        var skey = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(group_store,{'wm_appid':skey});
        group_store.load();
        SUNLINE.baseParams(store,{'wm_appid':skey});
        store.currentPage = 1;
        store.load();
        Ext.getCmp('show_addr').setValue("");
        Ext.getCmp('show_sex').setValue("");
        Ext.getCmp('show_group').setValue("");
        Ext.getCmp('show_mobile').setValue("");

    })

    store.on('load',function(){
        if(grid_load_flag){
            menu_iframe.set_btn('');
        }else{
            grid_load_flag=true;
        }
    })

    new Ext.Viewport({
        layout : 'border',
        items:[menu_panel]
    })

//菜单添加
    function save_menu(){
        var data=menu_iframe.get_btn();
        if(data==false){
            Ext.Msg.alert('友情提示','请填写正确的文本内容！');
            return;
        }
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var row=SUNLINE.getSelected(left_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择一条要操作的数据！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认添加？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxMenu/save_menu',
                    method:'POST',
                    params :{wm_remark:row.data.wm_remark,wm_range:row.data.wm_range,wm_content:data,wm_id:row.data.wm_id,wm_wid:row.data.wm_wid,wm_appid:s},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            store.load();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

//菜单删除
    function menu_del(){
        var row=SUNLINE.getSelected(left_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择一条要删除的数据！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认删除？",function(opt){
            if(opt=='yes'){
                if(row.data.wm_content==''){
                    store.removeAt(store.indexOf(row));
                    menu_iframe.set_btn('');
                    Ext.Msg.alert('友情提示','删除成功');
                    return;
                }
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxMenu/del_menu',
                    method:'POST',
                    params : {wm_id:row.data.wm_id,wm_appid:row.data.wm_appid,wm_wid:row.data.wm_wid},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            //menu_iframe.set_btn('');
                            store.load();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

    function menu_range(){
        var row= win_form.getForm().getValues();
        if(row.country=='全部' && row.group_id=='全部' && row.client_platform_type=='全部' && row.sex=='全部'){
            Ext.Msg.alert('友情提示','请至少设置一个限制条件！');
            return ;
        }
        if(row.country=='' && row.group_id=='' && row.client_platform_type=='' && row.sex==''){
            Ext.Msg.alert('友情提示','请至少设置一个限制条件！');
            return ;
        }
        store.add({'wm_range':JSON.stringify(row),'wm_remark':row.wm_remark,'wm_content':'[]'});
        add_win.hide();
    }

    function post_openid(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        var s_name = Ext.getCmp('wxapp_combo_id').getRawValue();
        var row= input_form.getForm().getValues();
        Ext.Msg.confirm('友情提示', "是否确认测试？",function(opt){
            if(opt=='yes'){
                Ext.Ajax.request({
                    url:$__app__+'/WxMenu/MenuPrint',
                    params:{wm_appid:s,open_id:row.open_id},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.status==1){
                            menu_data=ret.info.info;
                            test_input_win.hide();
                            test_win.show();
                            if(iframe_load_flag){
                                mobile_iframe.create_btn(ret.info.info,s_name);
                            }else{
                                iframe_load_flag=true;
                            }
                        }else{
                            Ext.Msg.alert('友情提示',ret.info.msg);
                        }
                    },
                    failure:function (response, otps) {

                    }
                })
            }
        })
    }

    window.get_data=function(){
        var s_name = Ext.getCmp('wxapp_combo_id').getRawValue();
        mobile_iframe.create_btn(menu_data,s_name);
    }

    test_input_win.on('show',function(){
        input_form.getForm().reset();
    })

    window.first_set_data=function(){
        var row=SUNLINE.getSelected(left_grid);
        if(!row){
            menu_iframe.set_btn('');
        }else{
            menu_iframe.set_btn(row.data.wm_content);
        }
    }

    /************************ 获取表格数据start *********************************/
    function get_sex(v){
        if(v){
            var obj = eval('(' + v + ')');
            if(obj.sex==1){
                var sex='男';
            }else if(obj.sex==2){
                var sex='女';
            }else{
                var sex='全部';
            }
            return sex;
        }else{
            return '全部';
        }

    }

    //获取适用分组名
    function get_group(v){
       if(v){
            var obj = eval('(' + v + ')');
            if(obj.group_id){
                var count=group_store.count();
                for(var i=0;i<count;i++){
                    if(group_store.getAt(i).data.wg_gid== obj.group_id){
                        return group_store.getAt(i).data.wg_name;
                    }
                }
                return '<span style="color:red">未知</span>';
            }else{
                return '全部';
            }
        }else{
            return '全部';
        }
    }

    function get_mobile(v){
        if(v){
            var obj = eval('(' + v + ')');
            if(obj.client_platform_type==1){
                    var mobile='IOS';
            }else if(obj.client_platform_type==2){
                var mobile='Android';
            }else if(obj.client_platform_type==3){
                var mobile='其他';
            }else{
                var mobile='全部';
            }
            return mobile;
        }else{
            return '全部';
        }
    }
    function get_addr(v){
        if(v){
            var obj = eval('(' + v + ')');
            var addr='';
            if(obj.country){
                addr+=obj.country
            }
            if(obj.province){
                addr+='-'+obj.province
            }
            if(obj.city){
                addr+='-'+obj.city
            }
            if(addr==''){
                return '全部';
            }
            return addr;
        }else{
            return '全部';
        }
    }


  /************************ 获取表格数据 end *********************************/

   left_grid.on('select',function(i,v){
       var data= v['data']['wm_content'];
       if(!v['data']['wm_range']){
           Ext.getCmp('del_btn').setDisabled(true);
       }else{
           Ext.getCmp('del_btn').setDisabled(false);
       }
       menu_iframe.set_btn(data);
       var wm_range=v['data']['wm_range'];
       var addr_str=' 适用地区: '+get_addr(wm_range);
       var group_str=' 适用分组: '+get_group(wm_range);
       var sex_str=' 适用性别: '+get_sex(wm_range);
       var mobile_str=' 适用机型: '+get_mobile(wm_range);
       Ext.getCmp('show_addr').setValue("<span style='color:#000;font-size: 14px;font-family: 微软雅黑'>"+addr_str+"<span>");
       Ext.getCmp('show_sex').setValue("<span style='color:#000;font-size: 14px;font-family: 微软雅黑'>"+sex_str+"<span>");
       Ext.getCmp('show_group').setValue("<span style='color:#000;font-size: 14px;font-family: 微软雅黑'>"+group_str+"<span>");
       Ext.getCmp('show_mobile').setValue("<span style='color:#000;font-size: 14px;font-family: 微软雅黑'>"+mobile_str+"<span>");
   })

    left_grid.on('validateedit',function(i,g){
        if ( g.value == g.originalValue ) return false;
        var row=SUNLINE.getSelected(left_grid);
        Ext.Ajax.request({
            url:$__app__+'/WxMenu/change_remark',
            params:{wm_id:row.data.wm_id,wm_remark:g.value},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.status!=1){
                    g.cancel = true;
                }
            },
            failure:function (response, otps) {

            }
        })
    })


  /*********************** 菜单总处理 start ***********************************/
  //同步函数
  function menu_sync(){
      var s = Ext.getCmp('wxapp_combo_id').getValue();
      if(!s){
          Ext.Msg.alert('友情提示','请先选择一个公众号！');
          return;
      }
      Ext.Msg.confirm('友情提示', "同步菜单会丢失菜单名称，是否同步？",function(opt){
          if(opt=='yes'){
              ajax_sync(s);
          }
      })
  }

    add_win.on('hide',function(){
        win_form.form.reset();
    })

    add_win.on('show',function(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(group_store,{'wg_appid':s});
        group_store.currentPage = 1;
        group_store.load();
    })

    function ajax_sync(s){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/WxMenu/menu_sync',
            method:'POST',
            params :  {wm_appid:s},
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                if(ret.status==1){
                    Ext.Msg.alert('友情提示',ret.info);
                    store.load();
                    add_win.hide();
                }else{
                    Ext.Msg.alert('友情提示',ret.info);
                }
                myMask.hide();
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }



//清除菜单
    function menu_clear(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认清除菜单？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxMenu/menu_clear',
                    method:'POST',
                    params : {wm_appid:s},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            store.load();
                           // menu_iframe.set_btn('');
                            add_win.hide();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

    /*********************** 菜单总处理 end **************************************/

    window.check_url=function(str){
        var url_regex=/^(http|https|ftp):\/\//;
        return url_regex.test(str);
    }


})