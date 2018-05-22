/**
 * Created by PhpStorm.
 * User: Johony
 * Date: 16-1-4
 * Time: 下午8:15
 */
var ROW = {};
var KEY_W = {};
var KEYVAL = {};
var products = {};


Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '产品管理';

    /*
    * 颜色控件
    *
    * */
    Ext.define ('Ext.app.ColorPicker',
        {
            extend: 'Ext.container.Container',
            alias: 'widget.selColor',
            layout: 'hbox',
            initComponent:function()
            {
                var mefieldLabel = this.fieldLabel;
                var mename = this.name;
                var meheight = this.height;
                var meid = this.id;
                var mepadding = this.padding;
                var fnt= this.fnt;
                var fnc= this.fnc;
                this.items =
                    [
                        {
                            xtype: 'textfield',
                            height: meheight,
                            id:meid+'x',
                            fieldLabel:mefieldLabel,
                            name: mename,
                            flex: 1,
                            padding:mepadding,
                            listeners:
                            {
                                change:function(me, newValue, oldValue)
                                {
                                    me.bodyEl.down('input').setStyle('background-image', 'none');
                                    me.bodyEl.down('input').setStyle('background-color', newValue);
                                    if(typeof fnt != 'undefined') fnt();
                                }
                            }
                        },
                        {
                            xtype:'button',
                            width:20,
                            height: meheight,
                            menu:
                            {
                                xtype:'colormenu',
                                listeners:
                                {
                                    select: function(picker, color)
                                    {
                                        var amclr = Ext.getCmp(meid+'x');
                                        amclr.setValue('#'+color);
                                        if(typeof fnc != 'undefined') fnc(color);
                                    }
                                }
                            }
                        }
                    ];

                Ext.app.ColorPicker.superclass.initComponent.call(this);
            }
        });
     /*********控件结束**********/

    var url=$__app__+'/Products/dataJson';
    var field=[];
    store = SUNLINE.GroupingStore(url,field,{sortInfo:{field:'p_id',direction: "DESC"}/*, groupField:'p_linkman'*/});
    function confirm_fn(v){
        if(v==1)return '<font color="green"><b>无需确认</b></font>';
        return '<font color="#999">需要确认</font>';
    }
    function status_fn(v){
        if(v=='待审核')return '<font style="color:red;font-weight: bold">'+ v+'</font>';
        return '<font style="color:#999999;font-weight: bold">'+ v+'</font>';
    }
    function time_fn(val){
        var date=new Date(parseInt(val)*1000);
        return Ext.Date.format(date,'Y-m-d H:i:s');
    }
    function name_short_fn(v,i,r){
        var enid = r.get('p_enid');//onclick = UrlOrderDetail("'+r.o_number+'")
        var spread='<a href="javascript:;" onclick=SpreadTab("'+ r.get('p_num')+'","'+enid+'")>【分享分析】</a>';
        return '<span data-qtip="'+v+'">'+spread+'</span>';
    }

    function name_fn(v,i,r){
        var enid = r.get('p_enid');
        var url = $__app__+"/detail.html?p_id="+enid;
        return '<a href = "'+url+'" target = "_blank" style="color:blue">【预览】</a> '+v;
    }
    var cm=[
        new Ext.grid.RowNumberer({header:'序号',width:70,align:"center"}),
        {header:"ID", dataIndex:"p_id", width:50, hidden:true},
        {header:"供应商ID", dataIndex:"p_org_id", width:50, hidden:true},
        {header:"所属供应商", dataIndex:"p_org_name", width:120, hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:150},
        {header:"品牌名称", dataIndex:"p_cb_name", width:150,align:'center'},
        {header:"产品名称", dataIndex:"p_name", width:250,renderer:name_fn},
        {header:"产品副标题", dataIndex:"p_name_short", width:250},
        {header:"天数", dataIndex:"p_days", width:60,align:'center'},
        {header:"排序",dataIndex:"p_order", width:80,align:'center',editor: new Ext.form.NumberField({ allowBlank: false })},
        {header:"客服", dataIndex:"p_linkman", width:60,align:'center'},
        {header:"状态", dataIndex:"p_status", width:70,renderer:status_fn},
        {header:"确认状态", dataIndex:"p_confirm", width:100,renderer:confirm_fn},
        {header:"分享", dataIndex:"p_name_short", width:120,renderer:name_short_fn},
        {header:"编辑时间", dataIndex:"p_time", width:200,renderer:time_fn}
    ];
    var ProductType_box=SUNLINE.LocalComob({
        id:'product_type',
        fields:['text','id'],
        data:ProductType,
        config:{
            fieldLabel:'类型',
            editable:false,
            valueField:'id',
            displayField:'text',
            id:'product_type',
            name:'product_type',
            labelWidth:30,
            labelAlign:'right',
            width:180,
            value:'全部类型'
        }
    });
	
	//根据当前用户单位类型，判断“所属单位”是否显示
	if(_uinfo.org_type=='管理公司'){
		//bbar.items=['-', company_box];
		var isHide = false;
	}else{
		var isHide = true;
	}
    //用户当前单位ID
    var current_org_id = _uinfo.org_id;
    
		
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config:{
			hidden: isHide,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:380,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    company_box.on({
        select:function(c,r){
            var row=r[0].data;
            current_org_id = row.id;
            SUNLINE.baseParams(store,{p_org_id:row.id});
            store.currentPage=1;
            store.load();
        }
    });


    var brand_box = SUNLINE.CompanyBox({
        where: {order_type: 'product_list', org_id: current_org_id},
        id: 'p_cb_name',
        name: 'p_cb_name',
        fields: ['cb_id', 'cb_name'],
        url: $__app__ + '/Brand/getBrand',
        config: {
            //readOnly: true,
            displayField: 'cb_name',
			valueField: 'cb_id',
            emptyText: '请选择',
            width: 340,
            value: '',
            pageSize: 0, //不要分页设置
            fieldLabel: '品牌名称',
            labelWidth: 60,
            labelAlign: 'right',
            padding: '0 0 0 0',
			listConfig:{
				minWidth:340,
			}
        }
    });

    brand_box.on('focus', function(c,r){
        var list_store = brand_box.getStore();
        SUNLINE.baseParams(list_store,{order_type: 'product_list', org_id: current_org_id});
        brand_box.setReadOnly(false);
        brand_box.setValue('');
        list_store.currentPage=1;
        list_store.load();
    });

    brand_box.on({
        select:function(c,r){
            var row=r[0].data;
			var p_type = Ext.getCmp('product_type').getValue();
			var p = {p_cb_id:row.cb_id};
			if( p_type && p_type != '全部类型' ){
				p.p_type = p_type;
			}
            SUNLINE.baseParams(store, p);
            store.currentPage=1;
            store.load();
        }
    });

    var bbar={
        pageSize: pageSize,
        store:store,
        displayInfo: true,
        displayMsg:'第{0} 到 {1} 条数据 共{2}条',
        emptyMsg:'没有产品信息，快去添加哦'
    }

    products = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        border :false,
        viewConfig:{emptyText:'没有产品信息，请去添加'},
        plugins: {
            ptype: 'cellediting',
            clicksToEdit : 1,

            listeners:{
                edit:function(v,g){
                    var row = SUNLINE.getSelected(products);
                    //console.log(row.data);
                    //return false;
                    var o_data={'p_order': g.value,'p_id':row.data.p_id,'p_num':row.data.p_num,'p_name':row.data.p_name};
                    //Ext.MessageBox.confirm('友情提示', '您确认要更改产品排序吗？', function (b) {
                    //    if(b == "yes") {
                            Ext.Ajax.request({
                                url: $__app__ + '/Products/product_order_save',
                                method: 'POST',
                                params: o_data,
                                success: function (response, opts) {
                                    var res = Ext.decode(response.responseText);
                                    if (res.code == 200) {
                                        store.load();
                                       // Ext.Msg.alert('友情提示', res.info);
                                    }else if(res.code == 300){
                                        Ext.Msg.alert('友情提示', res.info);
                                    }
                                },
                            });
                        //}
                    //})
                }
            }
        },
		tbar: {
            xtype: "container",
            border: false,
            items: [{
				//tbar第一行工具栏
                xtype: "toolbar",
                items: [
					{text:'添加',iconCls:'button-add',handler:modify,disabled:isDisabled('ProductsDetail::index'), xtype:'splitbutton',
						menu:{
							items:[
								{text: '复制',handler:modify,disabled:isDisabled('ProductsDetail::index'),iconCls:'button-view'}
							]
						}
					},
					'-',
					{text:'编辑',iconCls:'button-edit',id:'edit_id',handler:modify,disabled:isDisabled('ProductsDetail::index'), xtype:'splitbutton',
						menu:{
							items:[
								{text: '客服调整',handler:operator,hidden:isDisabled('Products::serviceSave'),iconCls:'button-view'}
							]
						}},
					'-',
					{text:'下架',iconCls:'button-del',handler:changeStatus,id:"handler_btn",disabled:isDisabled('Products::del')},
					'-',
					{text:'刷新',iconCls:'button-ref',handler:function(){
						store.reload();
						ri_store.removeAll();
					}},
					'-',
					{text:'回收站', iconCls:'re-case', enableToggle: true, pressed: false,
						toggleHandler:function(item, pressed){
							if(Ext.getCmp('handler_btn').getText()=="下架"){
								Ext.getCmp('handler_btn').setText("恢复");
								Ext.getCmp('handler_btn').setIconCls("re-back");
							}else{
								Ext.getCmp('handler_btn').setText("下架");
								Ext.getCmp('handler_btn').setIconCls("button-del");
							}
							if (pressed){
								store.proxy.extraParams['p_status'] = 'del';
							}else{
								store.proxy.extraParams['p_status'] = '';
							}
							store.load();
							ri_store.removeAll();
						}
					},
					'-',
					{text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
					'-',
					{text:'无需确认',handler:changeStatus,id:"not_confirm",disabled:isDisabled('Products::confirm')},
					'-',
                    {text:'定向分销',handler:getOnly,id:"only_to"},
                    '-',
                    {text:'附件管理',id:'annex_id', handler:annexSetting},
					'->',
					'快速搜索：',
					{
						xtype:'trigger',
						triggerCls : 'x-form-search-trigger',
						id:'Search_key',
						emptyText : '产品名称，拼音码',
						width:200,
						onTriggerClick:function(e){
							store.currentPage=1;
							ProSearch();
						},
						listeners :{
							"specialkey" : function(_t, _e){
								if (_e.keyCode==13)
									store.currentPage=1;
									ProSearch();
							}
						}
					},
					{
						icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
						cls: 'x-btn-icon',
						tooltip: '重载' + thisTitle,
						handler:function(){window.location.reload();}
					}
				]
			},{
				//tbar第二行工具栏
                xtype: "toolbar",
                items: [
                    ProductType_box,
					company_box,
					brand_box
				]
			}]
		},	
		
        bbar: new Ext.PagingToolbar(bbar),
        listeners:{ //监听绑定单击事件，单击打开修改补充行程、关键词设置
            rowclick :function(grid,now){
                products_rightPanel.setTitle('补充行程、关键词设置（'+ now.data.p_name+'）');
            }
        }
    });

    ProductType_box.on({
        select:function(v,r){
            var row=r[0].data;
            SUNLINE.baseParams(store,{p_type:row.id},true);
            store.currentPage=1;
            store.load();
        }
    });


    /**
     * 定向投放
     */
    function getOnly(){
        parent.OpenTab('定向分销', '', '', $__app__+'/Appoint/index', 1);
    }



    /*
    * 下架-恢复
    *
    * */
    function changeStatus(b){
        var row = SUNLINE.getSelected(products);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要'+b.text+'的线路信息！');
            return;
        };
        var s="",url="";
        var role=_uinfo.r_role;
        if(b.text=="下架"){
            if(in_array('Products::del',role)!=-1){
                s = {p_id: row.get('p_id') };
                url = $__app__ + '/Products/del';
            }else{
                Ext.Msg.alert('温馨提示','您没有下架权限');
                return false;
            }
        }else if(b.text=="恢复"){
            if(in_array('Products::recovery',role)!=-1){
                s = {p_id: row.get('p_id') };
                url = $__app__ + '/Products/recovery';
            }else{
                Ext.Msg.alert('温馨提示','您没有恢复权限');
                return false;
            }
        }else if(b.text=="无需确认"){
            s = {p_id:row.get("p_id"),p_confirm:row.get("p_confirm")};
            url = $__app__ + '/Products/not_confirm';
        }
        Ext.Msg.confirm('友情提示', '您真的要'+b.text+'“'+ row.get('p_name') +'”吗？',function(btn){
            if (btn == 'yes'){
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : url,
                    params : s,
                    success : function(response, opts){
                        var rst = Ext.decode(response.responseText);
                        if (rst.status){
                            store.load();
                        }
                        if(b.text == "恢复"){
                            Ext.Msg.alert('友情提示',rst.info.msg);
                        }else{
                            Ext.Msg.alert('友情提示',rst.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', b.text+'线路信息遇到未知错误！未能'+ b.text+'。',function(){});
                    }
                });
            }
        });
    }

    //添加修改表单
    var form=Ext.create('Ext.form.Panel',{
        border:false,
        defaultType:'textfield',
        defaults: {
            anchor : "95%",
            labelWidth : 80,
            labelAlign : "right"
        },
        items:[
            {id:"p_id", name:"p_id", fieldLabel:"ID", xtype:"hidden", maxLength:"10",allowBlank:false},
            {id:"p_name", name:"p_name", fieldLabel:"名称",  maxLength:"20"}
        ]
    })

    //添加弹出框
    var win=Ext.create('Ext.window.Window', {
        title : '产品管理',
        width : 400,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : [form],
        buttons: [
           // {text : 'value',handler:function(){showFormValues(wg_form)}},
            {text : '保存'/*,handler:doSubmit*/},
            {text : '关闭', handler:function(){wg_win.hide();}}
        ]
    });

    //修改值
    win.on('show',function(){
        form.getForm().reset();
        form.getForm().setValues();
        var wgn=form.queryById('p_name');
    });

    //搜索
    function ProSearch(){
        var skey=Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
        ri_store.removeAll();
    }



    //右边
    products.on('cellclick',function(sm,rowldx,c,r){
        var p_id = r.data.p_id;
        var pk_id = r.data.p_self_key;
        //ROW = r.data;
        KEY_W = r.data;
        //KEY = pk_id;
        SUNLINE.baseParams(ri_store,{pd_product_id:p_id});
        SUNLINE.baseParams(key_store,{pk_id:pk_id,type:'sel'});
        ri_store.load({params:{page:1,start:0}});
        key_store.load();
    })
    var ri_url=$__app__+'/ProductsDetail/dataJson';
    var ri_field=[];
    var ri_store=SUNLINE.JsonStore(ri_url,ri_field,false);
    var ri_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"pd_id", width:50, hidden:true},
        {header:"产品ID", dataIndex:"pd_product_id", width:50, hidden:true},
        {header:"行程标题", dataIndex:"pd_product_name", width:150,renderer:function(v){
            if(v==''){
                return '默认行程';
            }else{
                return v;
            }
        }},
        {header:"开始日期", dataIndex:"pd_start_date", width:110,dateFormat: 'Y-m-d',renderer:function(val){
            if(val == 0){
                return '永久有效';
            }else{
                var year = val.substr(0,4);
                var mon = val.substr(4,2);
                var day = val.substr(6,2);
                var date = year+'-'+mon+'-'+day;
                return date;
            }
        }},
        {header:"结束日期", dataIndex:"pd_end_date", width:110,dateFormat: 'Y-m-d',renderer:function(val){
            if(val == '0'){
                return '永久有效';
            }else{
                var year = val.substr(0,4);
                var mon = val.substr(4,2);
                var day = val.substr(6,2);
                var date = year+'-'+mon+'-'+day;
                return date;
            }
        }}
    ];

    var products_right = Ext.create('Ext.grid.Panel',{
        region:'center',
        border:false,
        store:ri_store,
        columns:ri_cm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无行程信息，请点选左表中的产品行程信息。',
            deferEmptyText : true
        },
        tbar:[
            '<b>补充行程：</b>',
            {text:'添加', iconCls:'button-add', handler:detailModify,disabled:isDisabled('ProductsDetail::detailIndex')},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:detailModify,disabled:isDisabled('ProductsDetail::detailIndex')},
            '-',
            {text:'删除', iconCls:'button-del',handler:detailDel,disabled:isDisabled('ProductsDetail::del')},
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                ri_store.load();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store:ri_store,
            displayInfo: true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有补充线路，快去添加哦'
        })
    });
    function detailModify(v){
        if(v.text == "添加"){
            var row = SUNLINE.getSelected(products);
            if(!row){
                Ext.Msg.alert('友情提示', '请先选择产品信息！');
                return false;
            }
            parent.OpenTab('新增补充行程【'+row.data.p_num+'】', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail?id='+row.data.p_id+'&type=true', 1);
            return false;
        }else if(v.text == "编辑"){
            var res = SUNLINE.getSelected(products);
            var row = SUNLINE.getSelected(products_right);
            if(!row){
                Ext.Msg.alert('友情提示','请先选择产品行程！');
                return false;
            }
            if(row.data.pd_product_name==''){
                parent.OpenTab('编辑产品【'+row.data.p_num+'】', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail?id='+res.data.p_id+'&pd_id='+row.data.pd_id, 1);
                return false;
            }
            parent.OpenTab('新增产品【'+row.data.p_num+'】', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail?id='+res.data.p_id+'&pd_id='+row.data.pd_id+'&type=true', 1);
            return false;
        }

    }
    function detailDel(){
        var row = SUNLINE.getSelected(products_right);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要删除的行程信息！');
            return;
        };
        if(row.data.pd_start_date=='0'){
            Ext.Msg.alert('友情提示','删除默认行程，请到左边删除产品线路');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/ProductsDetail/del',
            params:{pd_id:row.data.pd_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var res = Ext.decode(response.responseText);
                var msg = res.info;
                if(res.status) {
                    Ext.Msg.alert("友情提示",msg);
                    ri_store.load();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })
    }
    /*
    * 客服信息修改*/
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

                    {name:"p_id",xtype:'hiddenfield'},
                    {name:"p_uid",xtype:'hiddenfield'},

                    SUNLINE.CompanyBox({
                        fields:['u_id','u_mobile','u_realname','u_qq'],url:$__app__ + '/Users/dataJson',
                        where:{
                            u_org_id:_uinfo.u_org_id
                        },
                        config:{
                            displayField:'u_realname',
                            valueField:'u_realname',
                            tpl:Ext.create('Ext.XTemplate',
                                '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item">{u_realname} - {u_mobile}</li>',
                                '</tpl></ul>'
                            ),
                            id:'buy_id',
                            name:'p_linkman',
                            fieldLabel:'联系人姓名',
                            labelWidth:90,
                            width:265,
                            labelAlign:'right',
                            pageSize:10,
                            listConfig:{
                                minWidth:340
                            },

                            //readOnly:true,
                            listeners:{
                                collapse:function(c, r){
                                    var row=c.value;
                                    Ext.getCmp('buy_id').getStore().each(function(rst){
                                        if(rst.data.u_realname==row){
                                            var u = rst.data;
                                            serPanel.data.p_linkman= u.u_realname;
                                            serPanel.data.p_man_qq= u.u_qq;
                                            serPanel.data.p_meet_tel= u.u_mobile;
                                            serPanel.data.p_uid= u.u_id;
                                            form.getForm().setValues(serPanel.data);
                                            return false;
                                        }
                                    });

                                }
                            }
                        }

                    }),
                    {name:"p_man_qq",fieldLabel:"联系人QQ"},
                    {name:"p_meet_tel",fieldLabel:"联系人电话"}

                ]
            }
        ]
    });

    var serPanel = Ext.create('Ext.window.Window', {
        title:'客服修改',
        closeAction:'hide',
        autoHeight:true,
        width: 320,
        modal:true,
        items: [form],
        buttons:[

            {text:'保存',iconCls:'button-save',handler:save_panel},
            {text:'关闭',iconCls:'button-del',handler:function(){
                serPanel.hide();
            }}
        ]
    });
    function save_panel()
    {
        Ext.MessageBox.confirm('友情提示','你确定要保存客服信息吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/Products/serviceSave',
                params:form.getForm().getValues(),
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.msg;
                    if (result.status == 1) {
                        store.load();
                        serPanel.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });

    }
    serPanel.on('show', function(w){

        form.getForm().setValues(serPanel.data);
    });

    /*
    * 关键词部分
    *
    **/
    var key_url=$__app__+'/ProductsKeys/dataJson';
    var key_field=[];
    var key_store=SUNLINE.JsonStore(key_url,key_field,false);
    var key_store_all=SUNLINE.JsonStore(key_url,key_field,false);
    var key_grid = Ext.create('Ext.grid.Panel',{
        region:'south',
        border:false,
        split : {size:3},
        height:300,
        store:key_store,
        loadMask:{ msg : '数据载入中，请稍后' },
        //sm: sm,
        viewConfig:{
            emptyText : '暂无产品关键词信息，请点选左表中的产品行程信息。',
            deferEmptyText : true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"pk_id",width:80, hidden: true},
            {header:"值",dataIndex:"pk_name",width:80/*,renderer:key_price*/},
            {header:"源关键字",dataIndex:"pk_name",width:100},
            {header:"显示关键字",dataIndex:"pk_bgcolor",width:100,renderer:key_style},
            {header:"类型",dataIndex:"pk_type",width:80,renderer:key_system}
        ],
        tbar:[
            '<b>关键词设置：</b>',
            {text:'添加', iconCls:'button-add',handler:key_modify,disabled:isDisabled('ProductsKeys::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:key_modify,disabled:isDisabled('ProductsKeys::save')},
            '-',
            {text:'清除',iconCls:'button-del',handler:key_set,disabled:isDisabled('ProductsKeys::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                key_store.load();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:7,
            store:key_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有线路行程信息'
        })
    })
    
    var key_grid_show = Ext.create('Ext.grid.Panel',{
        region:'center',
        border:false,
        split : true,
        height:300,
        store:key_store_all,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无产品关键词信息，请点选左表中的产品行程信息。',
            deferEmptyText : true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"pk_id",width:80, hidden: true},
            {header:"值",dataIndex:"pk_name",width:30/*,renderer:key_price*/,hidden:true},
            {header:"源关键字",dataIndex:"pk_name",width:100},
            {header:"显示关键字",dataIndex:"pk_bgcolor",width:100,renderer:key_style},
            {header:"类型",dataIndex:"pk_type",width:80,renderer:key_system}
        ],
        tbar:[
            '<b>关键词设置：</b>',
            {text:'添加新关键词', iconCls:'button-add',handler:key_modify_win,disabled:isDisabled('ProductsKeys::save')},
            {text:'编辑', iconCls:'button-edit',handler:key_modify_win,disabled:isDisabled('ProductsKeys::save')},
            '-',
            {text:'删除',iconCls:'button-del',handler:key_del,disabled:isDisabled('ProductsKeys::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                key_store_all.load();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:7,
            store:key_store_all,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有线路行程信息'
        })
    });

    function key_style(v,c,r){
        v="<div style='color:"+ r.data["pk_color"]+";border:1px solid "+ r.data["pk_color"] +"; padding:2px 10px; display: inline-block;'>" +
            ""+r.data["pk_name"]+"</div>";
        return v;
    }

    function key_system(v){
        if(v=="系统"){
            v="<font color='red'><b>系统</b></font>";
        }else{
            v="<font color='blue'><b>自助</b></font>";
        }
        return v;
    }
    
    /*
    * 选择关键词的窗口
    *
    * */
    var key_show = Ext.create('Ext.window.Window', {
        title:'选择关键词',
        width : 700,
        height : 400,
        closeAction : 'hide',
        modal : true,
        items : key_grid_show,
        layout : 'fit',
        buttons:[
            {text:'加入关键词',id:'addKey',handler:key_set},
            {text:'关闭', handler:function(){key_show.hide();} }
        ]
    });
    function key_modify(b){
        var rowkey = SUNLINE.getSelected(products);
        if(typeof rowkey == 'undefined'){
            Ext.Msg.alert('友情提示', '请选择一条线路');
            return;
        }
        var row = SUNLINE.getSelected(key_grid);
        if(b.text == '添加'){
            key_show.show();
            KEYVAL = {};
        }
        if(b.text == '编辑'){
            if(!row){
                Ext.Msg.alert('温馨提示','请选择要编辑的关键词');
                return false;
            }
            if(row.data.pk_type == '系统'){
                Ext.Msg.alert('温馨提示','系统关键字不能编辑');
                return false;
            }
            key_win.show();
            document.getElementById('example_color').innerHTML=row.data.pk_name;
            document.getElementById('example_color').style.color=row.data.pk_color;
            document.getElementById('example_color').style.border = '1px solid '+row.data.pk_color;
            
            Ext.getCmp('pk_kid').setValue(row.data.pk_id);
            Ext.getCmp('pk_kname').setValue(row.data.pk_name);
            
            KEYVAL.color = row.data.pk_color;
        }
    }
    
    /*function key_modify_win(){
        key_win.show();
    }*/
    
    function key_set(b){
        var v = {};
        var row1= SUNLINE.getSelected(products); //产品信息
        if(!row1){
            Ext.Msg.alert('友情提示', '请选择要设置的产品！');
            return;
        }
        if(b.text=="清除"){
            var row = SUNLINE.getSelected(key_grid); //单条产品已经选择的产品关键词
        }else{
            var row = SUNLINE.getSelected(key_grid_show);//单条产品没有选择的产品关键词

        }
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要设置的产品关键词！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Products/keySet',
            params:{p_self_key:row1.data.p_self_key,p_id:row1.data.p_id,pk_id:row.data.pk_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var res = Ext.decode(response.responseText);
                var msg = res.info.msg;
                var data = res.info.data;
                KEY_W.p_self_key = data;
                if (res.status) {
                    Ext.Msg.alert("友情提示",msg);
                    key_show.hide();
                    SUNLINE.baseParams(key_store,{pk_id:data,type:'sel'});
                    key_store.load();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })

    }
    Ext.getCmp('addKey').on('click',function(){
        var row = SUNLINE.getSelected(key_grid_show);
        if(!row){
            Ext.Msg.alert("友情提示",'很抱歉，请先选择关键词哦！');
            return false;
        }
        var data = row.data;
        if(KEY_W.p_self_key.length>2){
            var keyVal = KEY_W.p_self_key.split(',');
            for(var i = 0;i < keyVal.length; i++){
                if(data.pk_id == keyVal[i]){
                    Ext.Msg.alert("友情提示",'该产品关键词已被添加，请重新选择！');
                    return false;
                }
            }
        }
    })
    function key_del(){
        var row = SUNLINE.getSelected(key_grid_show);
        if(!row){
            Ext.Msg.alert("友情提示","请先选择要删除的关键词");
            return false;
        }
        var pk_type=row.data.p_type;
        if(pk_type == '系统'){
            Ext.Msg.alert("友情提示","系统关键词不可删除");
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/ProductsKeys/del',
            params:{pk_id:row.data.pk_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var res = Ext.decode(response.responseText);
                var msg = res.info;
                /*var data = res.info.data;
                KEY_W.p_self_key = data;*/
                if (res.status) {
                    Ext.Msg.alert("友情提示",msg);
                    //key_show.hide();
                    key_store.load();
                    key_store_all.reload();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })

    }
    
    //关键词颜色    
    var gd_color =  "<span class='gd-color' style='background-color:#5e44f0'  data-color='#5e44f0' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#9c11ff' data-color='#9c11ff' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#ce2cff' data-color='#ce2cff' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#3d9cff' data-color='#3d9cff' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#45b4fc' data-color='#45b4fc' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#20d3ee' data-color='#20d3ee' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#84b6fb' data-color='#84b6fb' onclick='getkeyColor(this);'></span>"      
                    +"<span class='gd-color' style='background-color:#37cc71' data-color='#37cc71' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#4be587' data-color='#4be587' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#71dc1c' data-color='#71dc1c' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#fb2a35' data-color='#fb2a35' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#ff6331' data-color='#ff6331' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#eb5862' data-color='#eb5862' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#fe72b9' data-color='#fe72b9' onclick='getkeyColor(this);'></span>"
                    +"<span class='gd-color' style='background-color:#fed944' data-color='#fed944' onclick='getkeyColor(this);'></span>";
       
    /*
    * 设置关键词的窗口
    * */
    var keyform = Ext.create('Ext.form.Panel',{
        bodyPadding: 20,
        url: $__app__+'/Products/add_type',
        layout: 'anchor',
        height:140,
        defaults: {
            anchor: '95%',
            autoHeight:true,
            labelAlign:'right',
            labelWidth:100
        },
        defaultType: 'textfield',
        items: [
            {
                fieldLabel:'关键词ID',
                id:'pk_kid',
                name:'pk_id',
                allowBlank:true,
                hidden:true
            },
            {
                xtype:'textfield',
                id:'pk_kname',
                name: 'pk_name',
                maxLength:5,
                labelWidth:60,
                fieldLabel: '关键词名',
                labelAlign:'right',
                emptyText:'最多输入五个汉字或字母',
                allowBlank: false,
                listeners:{
                    change:function(){
                        KEYVAL.text = '';
                        var keyText = Ext.getCmp('pk_kname').getValue();
                        keyText = keyText.substr(0,5);

                        KEYVAL.text = keyText;
                        document.getElementById('example_color').innerHTML=keyText;
                    }
                }
            },{
                xtype: 'label',
                html: '&nbsp;选择颜色:',
                maxWidth:62,
                style:'float:left;display:block;',
            },
            {
                xtype: 'label',
                height:88,
                html: gd_color,
                maxWidth: 290,
                style:'border:1px solid #ccc;display:block;float:left;',
            }
        ]
    })

    var key_win = Ext.create('Ext.window.Window', {
        width:420,
        height:260,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        title:"线路关键词设置管理",
        modal:true,
        html:'<div id="example_color" style="color: #ccc;margin:5px auto;width: 80px;height: 30px;line-height: 30px;text-align: center;border:1px solid #ccc;">预览</div>',
        items:keyform,
        buttons:[
            {text:'重置',handler:function(){
               keyform.getForm().reset();
            }},
            {text:'保存',handler : keySave},
            {text:'关闭', handler:function () {
                key_win.hide();
            }}
        ]
    });
    key_show.on('show',function(){
        key_store_all.load();
    })
    
    function keySave(){
        var p_row = SUNLINE.getSelected(products);
        var row = keyform.getForm().getValues();
        if(row.pk_id) KEYVAL.pk_id = row.pk_id;
        
        KEYVAL.text = row.pk_name;
        
        if(KEYVAL.text == ''){
            Ext.Msg.alert('友情提示','请填写产品关键字！');
            return false;
        }
        if(KEYVAL.color == ''){
            Ext.Msg.alert('友情提示','请选择关键字颜色！');
            return false;
        }
        /*if(KEYVAL.bgColor == ''){
            Ext.Msg.alert('友情提示','请选择产品字背景颜色！');
            return false;
        }*/
        KEYVAL.p_id = p_row.get('p_id');
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/ProductsKeys/save',
            params:KEYVAL,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var res = Ext.decode(response.responseText);
                var msg = res.info.msg;
                if (res.status) {
                    Ext.Msg.alert("友情提示",msg);
                    key_win.hide();
                    key_store.load();
                    key_store_all.reload();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })

    }
    function key_modify_win(b){
        var row = SUNLINE.getSelected(key_grid_show);
        if(b.text == '添加新关键词'){
            key_win.show();
            keyform.getForm().reset();
            document.getElementById('example_color').innerHTML='预览';
            document.getElementById('example_color').style.color='#ccc';
            $(".gd-color").css('border','white');
        }
        if(b.text=="编辑"){
            if(!row){
                Ext.Msg.alert('友情提示','请选择要编辑的关键词！');
                return false;
            }
            var pk_type=row.data.pk_type;
            KEYVAL.pk_id = row.data.pk_id;
            if(pk_type=="系统"){
                Ext.Msg.alert('友情提示', '你选择的是系统关键词不可以编辑!');
                return;
            }
                        
            key_win.show();
            document.getElementById('example_color').innerHTML    = row.data.pk_name;
            document.getElementById('example_color').style.color  = row.data.pk_color;
            document.getElementById('example_color').style.border = '1px solid '+row.data.pk_color;
            
            Ext.getCmp('pk_kid').setValue(row.data.pk_id);
            Ext.getCmp('pk_kname').setValue(row.data.pk_name);
            
            KEYVAL.color = row.data.pk_color;
            //选择颜色-默认
            Ext.each($(".gd-color"), function(r, t){
                var gd_color = $(".gd-color").eq(t).attr('data-color');                
                if( gd_color == row.data.pk_color ){
                    $(".gd-color").eq(t).css('border','2px solid black');
                    $(".gd-color").eq(t).siblings().css('border','white');
                }
            })
        }
    }

    /***********关键词结束***************/
    function operator(b){
        if(b.text=='客服调整'){
            var row = SUNLINE.getSelected(products);
            if(!row){
                Ext.Msg.alert('友情提示','请先选择要编辑客服的产品！');
                return false;
            }
            serPanel.data = {
                p_id : row.get('p_id'),
                p_uid : row.get('p_uid'),
                p_linkman : row.get('p_linkman'),
                p_man_qq : row.get('p_man_qq'),
                p_meet_tel : row.get('p_meet_tel')
            };



            serPanel.show();
        }
    }
    function modify(b){
        var btn= b.text;
        if(b.text=='添加'){
            var p_type=ProductType_box.getValue();
            parent.OpenTab('新增产品', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail/index/addType/1/class/'+p_type+'/btn/'+btn, 1);
            return false;
        }else if(b.text=='编辑'){
            var row = SUNLINE.getSelected(products);
            if(!row){
                Ext.Msg.alert('友情提示','请先选择要编辑的产品！');
                return false;
            }
            parent.OpenTab('编辑产品【'+row.data.p_num+'】', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail?addType=1&id='+row.data.p_id+'&btn='+btn, 1);
            return false;
        }else if(b.text == '复制'){
            var row = SUNLINE.getSelected(products);
            if(!row){
                Ext.Msg.alert('友情提示','请先选择要复制的产品！');
                return false;
            }
            parent.OpenTab('复制产品【'+row.data.p_num+'】', 'new_product_add'+time(), '', $__app__ + '/ProductsDetail?addType=1&id='+row.data.p_id+'&copy=true', 1);
            return false;
        }
    }

    var productsPanel = Ext.create('Ext.panel.Panel', {
        border :false,
        region:'center',
        layout:"border",
        items:[products]
    })
    var products_rightPanel = Ext.create('Ext.panel.Panel', {
        border :false,
        region:'east',
        layout:"border",
        //split : {size:3},
        split : true,
        style : 'border-right-width:1px;',
        collapsible: true,
        collapsed: false,
        floatable: false,
        fixed:false,
        title:'补充行程、关键词设置',
        width : 400,
        maxWidth: 530,
        items:[products_right,key_grid]
    });
    ziyo_log({ listeners : [{grid: products, action:'Products', pk_id:'p_id'}] });
    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [productsPanel,products_rightPanel]
    });

    products_rightPanel.collapse();
    window.load_alert=function(){
        store.load();
    }
    window.SpreadTab = function(p_num,p_id){
        //share
        //<a href="http://zjdev.fingercrm.cn/contacts-web/p/spread/view_spread_info?uid='+uid+'&contentId='+enid+'" target="_blank" style="color:orange">【分享分析】</a>
        parent.OpenTab('线路分享分析【'+p_num+'】', 'new_product_add'+time(), '', $__app__ + '/App/'+RENMAI_APPID+'_RM.SpreadView/contentId/'+p_id, 1);
        //parent.OpenTab('线路分享分析【'+p_num+'】', 'new_product_add'+time(), '', 'http://zjuat.fingercrm.cn/zjrm/contacts-web/p/spread/view_spread_info?uid='+uid+'&contentId='+p_id+'', 1);
    }
});


/**
 * 预览当前选择颜色
 */
function getkeyColor( _this ){
    //获取当前点击的颜色rgb
    var cur_color = $(_this).css('background-color');
    //转换成'ffffff'格式
    var cur_color_1  = updateColor(cur_color);
    //改变当前点击样式
    $(_this).css('border','2px solid black');
    $(_this).siblings().css('border','none');
    //更新预览样式
    $("#example_color").css({'color':cur_color,'border':'1px solid #'+cur_color_1});
    
    KEYVAL.color = '#'+cur_color_1;
}


/**
 * 把颜色格式由rgb转变十六进制'0070ff'
 */
function updateColor( rgb ){
   var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete (parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return parts.join(''); // "0070ff" 
}





