SUNLINE = {
    ID : 0,
    getId: function(last){
        if (!last) SUNLINE.ID++;
        return SUNLINE.ID;
    },
    //子单位控件
    'subOrg':function(opt,config){
        if (!opt) opt={};
        if(!opt.width) opt.width=230;
        if(!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if(!opt.type) opt.type='buyer';
        var conf={
            name: 'p_org_name',
            loadingText:'正在加载单位信息',
            emptyText:'请选择单位',
            fieldLabel: opt.fieldLabel,
            editable:false,
            mode: 'local',
            triggerAction:'all',
            forceSelection:true,
            tpl: "<tpl for='.'><div style='height:200px'><div id='org_treepanel_div'></div></div></tpl>",
            store :new Ext.data.SimpleStore({fields:['org_name','org_id'],data:[[ _uinfo.org_name,_uinfo.u_jgid]]}) ,
            value:_uinfo.u_jgid,
            displayField :'org_name',
            valueField:'org_id',
            width :  opt.width,
            listWidth : 240
        }
        if (config) conf = Ext.apply(conf, config);
        if (opt.width) conf.width = opt.width;
        if (opt.listWidth) conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) conf.allowBlank = opt.allowBlank;
        window.org_ComboBox = new Ext.form.ComboBox(conf);
        function orgTreeSearch(){
            var skey = Ext.getCmp('org_tree_Search').getValue();
            var tLoader = org_treePanel.getLoader(), _root=org_treePanel.getRootNode();
            tLoader.baseParams = {skey : skey};
            tLoader.load(_root);
            _root.expand();
        }
        if(opt.type=='buyer'){
            json_url=$__app__ + '/Company/subOrgJson';
        }else if(opt.type=='seller'){
            json_url=$__app__ + '/Company/subOrgJson/type/seller';
        }
        org_treePanel = new Ext.tree.TreePanel({
            region : 'west',
            useArrows: true,
            rootVisible:false,
            autoScroll: true,
            animate: true,
            height:300,
            split:true,
            containerScroll: true,
            border: false,
            dataUrl:json_url,
            tbar:[
                '->','快速搜索：',
                {
                    xtype:'trigger',
                    triggerClass : 'x-form-search-trigger',
                    id:'org_tree_Search',
                    emptyText : '单位名称、编号、电话等',
                    width:150,
                    autoCreate : {tag: "input", type: "text", autocomplete: "off",  'x-webkit-speech':'', lang:'zh-CN'},
                    onTriggerClick:function(e){ orgTreeSearch(); },
                    listeners :{
                        "specialkey" : function(_t, _e){
                            if (_e.keyCode==13){ orgTreeSearch(); }
                        }
                    }
                }
            ],
            root:{
                nodeType: 'async',
                text: '所有单位',
                expanded : true
            },
            listeners: {
                "checkchange": function(node, state) {
                    var parentNode=node.parentNode;
                    var childCount = parentNode.childNodes.length;
                    parentNode.expandChildNodes();
                    if(node.text=='所有单位'){
                        if (childCount > 1) {
                            for (var i = 1; i < childCount; i++) {
                                var child = parentNode.childNodes[i];
                                var checkBox = child.getUI().checkbox;
                                child.attributes.checked = node.attributes.checked;
                                checkBox.checked = node.attributes.checked;
                            }
                            if(node.attributes.checked){
                                org_ComboBox.setValue('全部单位');
                                window.org_id_str='all';
                            }else{
                                org_ComboBox.setValue('');
                                window.org_id_str='';
                            }
                        }
                    }else{
                        var str='',value_str='';
                        if (childCount > 1) {
                            for(var i = 1; i < childCount; i++) {
                                var child = parentNode.childNodes[i];
                                if(child.attributes.checked){
                                    str+=child.text+',';
                                    value_str+=child.id+',';
                                }
                            }
                            value_str=value_str.substr(0,value_str.length-1)
                        }else{
                            var child = parentNode.childNodes[0];
                            if(child.attributes.checked){
                                str+=child.text;
                                value_str+=child.id;
                            }
                        }
                        window.org_id_str=value_str;
                        org_ComboBox.setValue(str);
                    }
                }
            }
        });
        org_ComboBox.on('expand',function(){
            org_treePanel.render('org_treepanel_div');
        });
        return org_ComboBox;
    },

    /**
     * 日历控件
     obj = {
            id: string 生成对象的ID
            width: number 宽度
            fieldLabel: string 表单字段说明文本
            gang: string 联动对象的ID
            start: bool 如果是联动模式，前一个日期对象必须指定为true，后者可省略该参数
         }
     */
    ExtDateField:function (obj) {
        if (!obj) obj={};
        if (!obj.gang) obj.gang = false;
        if (!obj.id) obj.id = 'sdate';
        if (!obj.name) obj.name = obj.id;
        if (!obj.width) obj.width = 120;
        if (!obj.fieldLabel && obj.fieldLabel!==false) obj.fieldLabel = '开始时间';
        if (!obj.allowBlank) obj.allowBlank = false;
        if (!obj.editable) obj.editable = false;
        var gang = obj.gang, start = obj.start
        var config = {
            format:'Y-m-d'
        };
        if (gang) {
            config.listeners = {
                select:function (_t, _d) {
                    var sdate = _d, isChg = false;
                    var edate = Ext.getCmp(gang).getValue();
                    if (start) {
                        if (sdate > edate) isChg = true;
                    } else {
                        if (sdate < edate) isChg = true;
                    };
                    if (isChg) {
                        var ed =Ext.Date.format(_d,'Y-m-d');
                        Ext.getCmp(gang).setValue(ed);
                    };
                }
            }
        };
        config = Ext.apply(config, obj);
        return new Ext.form.DateField(config);
    },
    //单位
    OrgCombo:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        if (!opt.labelWidth) opt.labelWidth = 60;
        if (!opt.value) opt.value = '顶级单位';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/combo', ["org_id", "org_bh", "org_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            allQuery : '',
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            /*forceSelection:true,*/
            typeAhead:true,
            value:opt.value
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
//        return new Ext.form.ComboBox(org_conf);
        return Ext.create('Ext.form.ComboBox',org_conf);
    },
    //出发地
    OrgCombo_Sation:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/StationStart/combo', ["sd_id", "sd_start_type", "sd_name"], false,{pageSize:20});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载出发地信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'sd_name',
            displayField:'sd_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.renderTo) org_conf.renderTo = opt.renderTo;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //送机人
    Delivery_man:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/OrderBus/delivery_man', ["s_delivery_man"], false,{pageSize:20});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载送机人信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'ob_delivery_man',
            displayField:'ob_delivery_man',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.renderTo) org_conf.renderTo = opt.renderTo;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //票务公司
    OrgCombo_ticket_company:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/OrderBus/combo', ["org_id", "org_name"], true,{pageSize:20});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载票务公司信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_name',
            displayField:'org_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //省份
    OrgCombo_Province:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Store/combo', ["id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载省份信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'name',
            displayField:'name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    OrgCombo_Sation2:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/StationStart/combo2', ["sd_id", "sd_start_type", "sd_name"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载出发地信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'sd_name',
            displayField:'sd_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    OrgCombo_res_name:function (opt, config) {     //资源名称
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Ticket/all_combo', ["sd_id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在资源信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'name',
            displayField:'name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //微信
    OrgCombo_WxKeyword:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/WxKeyword/combo', ["wk_id",'wk_keyword','wk_msg_type'], true,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载微信信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'wk_keyword',
            displayField:'wk_keyword',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //产品
    OrgCombo_Products:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/Ticket/combo', ["p_id"], true,{pageSize:10});
        if(opt.where)this.baseParams(OrgDs,opt.where);
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载产品信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'p_name',
            displayField:'p_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.valueField) org_conf.valueField = opt.valueField;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //一出来不加载
    OrgCombo_Products_false:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/Ticket/combo', ["p_id"], false,{pageSize:10});
        if(opt.where)this.baseParams(OrgDs,opt.where)
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载产品信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'p_name_num',
            displayField:'p_name_num',
            labelSeparator:'：',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item {[ this.pStatus(values.p_status) ]}"><b style="color:blue">{p_num}</b> -- {p_name}</li>',
                '</tpl>' +
                '</ul>',{
                    pStatus:function(v){
                        if(v=='del')return 'p_status_remove';
                        return '';
                    }
                }
            )
        };


        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.valueField) org_conf.valueField = opt.valueField;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.renderTo) org_conf.renderTo = opt.renderTo;
        if (opt.forceSelection === false ) org_conf.forceSelection = opt.forceSelection;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //导游
    OrgCombo_Guide:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/guide_combo', ["gu_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载导游信息',
            emptyText:'可直接填写全陪导游名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.readOnly) org_conf.readOnly = opt.readOnly;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //地陪导游
    OrgCombo_Local_Guide:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/local_guide_combo', ["gu_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载导游信息',
            emptyText:'可直接填写地陪导游名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.readOnly) org_conf.readOnly = opt.readOnly;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //司机
    OrgCombo_Drivers:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/drivers_combo', ["d_id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载司机信息',
            emptyText:'可直接填写司机名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.readOnly) org_conf.readOnly = opt.readOnly;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //购物店
    OrgCombo_Shop:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamBillItems/shop_combo', ["d_id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载购物店信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'st_name',
            displayField:'st_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.readOnly) org_conf.readOnly = opt.readOnly;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //车
    OrgCombo_Car:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/car_combo', ["c_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            emptyText:'可直接填写车牌号',
            loadingText:'正在加载车牌号',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'c_mark',
            displayField:'c_mark',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{c_mark} -- {c_people}人</li>',
                '</tpl></ul>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.readOnly) org_conf.readOnly = opt.readOnly;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },


    //单位
    allCompany : function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/comboAll', ["org_id", "org_bh", "org_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },

    allWorkGroup : function(opt, config){
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择部门';
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Workgroup/comboAll', ["wg_id", "wg_bh", "wg_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载部门信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'wg_id',
            displayField:'wg_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.wg_name ]}">' +
                '<label style="width:60px;">{[ values.wg_bh ]}</label>{[ values.wg_name ]}</div>' +
                '</tpl>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },

    //所有站点信息
    /*allSiteData : function (opt, config) {
     if (!opt) opt = {};
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择站点';
     if (!opt.isall) opt.isall = 'yes';
     var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/getSiteList', ["name", "value"], false);

     var site_conf =  {
     id : opt.id,
     name : opt.id,
     queryDelay:300,
     queryParam:'skey',
     width:100,
     minChars:2,
     loadingText:'正在加载数据',
     allQuery:'',
     forceSelection:true,
     triggerAction:"all",
     displayField:"name",
     valueField:"value",
     mode:"remote",
     emptyText:"请选择站点",
     fieldLabel:'选择站点:',
     store:OrgDs
     }

     if (config) site_conf = Ext.apply(site_conf, config);
     if (opt.width) site_conf.width = opt.width;
     if (opt.listWidth) site_conf.listWidth = opt.listWidth;
     if (opt.allowBlank!==null) site_conf.allowBlank = opt.allowBlank;
     return new Ext.form.ComboBox(site_conf);
     },*/

    //所有站点单位
    /*allCompanySite : function (opt, config) {
     if (!opt) opt = {};
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
     if (!opt.isall) opt.isall = 'yes';
     var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/comboAllSite', ["org_id", "org_bh", "org_name"], false);

     var org_conf = {
     id : opt.id,
     name : opt.id,
     store : OrgDs,
     allQuery : '',
     fieldLabel : opt.fieldLabel,
     loadingText:'正在加载单位信息',
     minChars:2,
     queryDelay:300,
     queryParam:'skey',
     triggerAction:'all',
     valueField:'org_id',
     displayField:'org_name',
     mode:'remote',
     forceSelection:true,
     pageSize:20,
     tpl:new Ext.XTemplate(
     '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
     '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
     '</tpl>',
     {
     showName : function(name){
     var n = name.split(' '), l= n.length, s='';
     if (l==1) return name;
     if (l==2) return n[1];
     for (var i=1; i<l; i++){
     s += n[i] + " ";
     };
     return s;
     }
     }
     )
     };
     if (config) org_conf = Ext.apply(org_conf, config);
     if (opt.width) org_conf.width = opt.width;
     if (opt.listWidth) org_conf.listWidth = opt.listWidth;
     if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
     return new Ext.form.ComboBox(org_conf);
     },*/

    //单位
    company : function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        if (!opt.identity) opt.identity = 'buyer';
        if (!opt.func) opt.func='buyer';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/' + opt.func, ["org_id", "org_bh", "org_name"], false);
        OrgDs.baseParams['from'] = opt.identity;

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<div style="width:100%; line-height:20px; height:20px;overflow:hidden;">' +
                '<label style="width:60px;display:inline-table;*display:block;*float:left;overflow:hidden;">{[ values.org_bh ]}&nbsp;</label>{[ this.showName(values.org_name) ]}</div>' +
                '</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },


    /**
     * 选择单位的下拉列表
     * @param opt
     * @param config
     * @return {Ext.form.ComboBox}
     * @constructor
     */
    CompanyCombo:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = opt.id;
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        //if (!opt.isall) opt.isall='yes';
        var field = ["org_id", "org_bh", "org_name"];
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/combo', field, false);
        if (opt.baseParams) OrgDs.baseParams = Ext.apply(OrgDs.baseParams, opt.baseParams);
        var org_conf = {
            id : opt.id + '_txt',
            name : opt.id + '_txt',
            hiddenName : opt.name,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            //listWidth : 300,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },


    //公司类型
    CompanyTypeComob:function (id) {

        if (!id) id = 'org_type';
        return new Ext.form.ComboBox({
            id:id + '_txt',
            name:id + '_txt',
            hiddenName:id,
            fieldLabel:"单位类型",
            store:new Ext.data.SimpleStore({
                fields:['value', 'text'],
                data:[["1","银行"],['2','保险公司'],['3','汽车公司']]
            }),
            mode:'local',
            displayField:'text',
            valueField:'value',
            triggerAction:'all',
            allowBlank:false,
            readOnly:false,
            editable:false
        });
    },
    LocalComob:function(opt){
        var _cof={
            xtype:"combo",
            name:opt.id,
            width:90,
            allowBlank:false,
            store:new Ext.data.Store({
                fields:opt.fields,
                data:opt.data
            }),
            triggerAction:"all",
            editable:false,
            valueField:opt.id,
            displayField:opt.id,
            mode:"local"
        };
        _cof=Ext.apply(_cof,opt.config);
        var local_box=Ext.create('Ext.form.ComboBox', _cof);
        return local_box;
    },
    /**
     * 字典表对应控件
     * @param option
     * @constructor
     */
    DictComboBox:function (option) {
        if (!option) return null;
        if (!option.type) return null; // 字典表里的分组标识
        if (!option.id) option.id = Ext.id();
        if (option.hideLabel == null) option.hideLabel = false;
        if (!option.fieldLabel) option.hideLabel = true;
        if (option.allowBlank == null) option.allowBlank = true;
        if (option.forceSelection == null) option.forceSelection = true;
        if (option.editable == null) option.editable = false;
        var url = $__app__ + '/Dict/getDictType/';
        var DictJson = new SUNLINE.JsonStore(url, ["id","text"], false);
        DictJson.baseParams = {type:option.type};
        var opt = {
            id:option.id,
            name:option.name ? option.name : option.id,
            hideLabel:option.hideLabel,
            fieldLabel:option.fieldLabel,
            queryDelay:300,
            minChars:2,
            loadingText:'正在加载信息',
            allQuery:'',
            queryParam:'skey',
            triggerAction:"all",
            store:DictJson,
            displayField:"text",
            valueField:"text",
            mode:"remote",
            allowBlank: option.allowBlank,
            forceSelection:option.forceSelection,
            editable:option.editable
        };
        if (option.emptyText) opt.emptyText = option.emptyText;
        return new Ext.form.ComboBox(opt);
    },


    //省份选择控件
    provinceCombo : function(name){
        if (!name) name = 'org_province';
        var provinceStore = SUNLINE.JsonStore($__app__ + '/CityThree/province',[ 'name', 'ename', 'id'],false);
        return new Ext.form.ComboBox({
            fieldLabel:'省份',
            name:name,
            editable:false,
            store:provinceStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            mode:'remote',
            allowBlank:false
        });
    },

    //市选择控件
    cityCombo : function(name){
        if (!name) name = 'org_city';
        var cityStore = SUNLINE.JsonStore($__app__ + '/CityThree/city', [ 'name', 'ename', 'id'], false);
        return new Ext.form.ComboBox({
            fieldLabel:"城市",
            allowBlank:false,
            id:name,
            name:name,
            loadingText:'正在加载城市信息',
            minChars:1,
            queryDelay:300,
            queryParam:'skey',
            selectOnFocus:true,
            forceSelection:true,
            store:cityStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            pageSize:20,
            mode:'remote'
        });
    },

    //地区/县选择控件
    countyCombo : function(name, allowBlank){
        if (!name) name = 'org_county';
        if (allowBlank==null) allowBlank = false;
        var countyStore = SUNLINE.JsonStore($__app__ + '/CityThree/county', [ 'name', 'ename', 'id'], false);
        return new Ext.form.ComboBox({
            fieldLabel:"区/县",
            allowBlank:allowBlank,
            id:name,
            name:name,
            loadingText:'正在加载区/县信息',
            minChars:1,
            queryDelay:300,
            queryParam:'skey',
            selectOnFocus:true,
            forceSelection:true,
            store:countyStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            pageSize:20,
            mode:'remote'
        });
    },


    OrgTreePanel:function (config) {
        var cfg = {
            useArrows:true,
            autoScroll:true,
            animate:true,
            height:200,
            containerScroll:true,
            border:false,
            dataUrl:$__app__ + '/Company/dataJson',

            root:{
                nodeType:'async',
                text:ORGTree.rootText,
                id:ORGTree.rootId,
                expanded:true
            }
        };
        if (!config) { config = {} };

        var option = Ext.apply(cfg, config);

        return new Ext.tree.TreePanel(option);
    },
    //通用的创建JsonStore数据源方法
    JsonStore:function (url, field, autoLoad, opt) {
        if (autoLoad == null) autoLoad = true;
        var id = SUNLINE.getId(), name='SUNLINE_STORE_' + id;
        Ext.define(name,{
            extend: 'Ext.data.Model',
            fields: field
        });

        var pageSize=pageSize?pageSize:20;
        var _opt={
            model: name,
            pageSize:pageSize,
            groupField: 'wg_type',
            proxy: {
                type: 'ajax',
                url : url,
                actionMethods:{
                    create:'POST',
                    read:'POST',
                    update:'POST',
                    destroy:'POST'
                },
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total'
                }
               // extraParams:reader
            },
            autoLoad:autoLoad
        };
        _opt=Ext.apply(_opt,opt);
        var store = Ext.create('Ext.data.Store', _opt);
        return store;
    },

    //创建分组显示的数据源
    GroupingStore:function (url, field, grouping, autoLoad, reader,pageSize) {
        if (autoLoad == null) autoLoad = true;
        var id = SUNLINE.getId(), name='SUNLINE_STORE_' + id;
        Ext.define(name,{
            extend: 'Ext.data.Model',
            fields: field
        });

        var pageSize=pageSize?pageSize:20;
        var _config={
            model: name,
            pageSize:pageSize,
            groupField: 'wg_type',
            proxy: {
                type: 'ajax',
                url : url,
                actionMethods:{
                    create:'POST',
                    read:'POST',
                    update:'POST',
                    destroy:'POST'
                },
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total'
                }
            },
            autoLoad:autoLoad
        };
        _config = Ext.apply(_config, grouping);
        var store = Ext.create('Ext.data.Store', _config);
        return store;
    },

    //周几有效的选择控件
    weekCheckboxGroup:function (opt) {
        if(!opt) opt={};
        if (!opt.fieldLabel) opt.fieldLabel = "周几有效";
        if (!opt.width) opt.anchor = '100%';
        if (!opt.name) opt.name = 'week';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        if (!opt.itemwidth) opt.itemwidth = '50';

        var real_field = new Ext.form.Hidden({name:opt.hiddenName});

        var wconf = {
            fieldLabel:opt.fieldLabel,
            columns:8,
            items:[
                {boxLabel:'全选',name:'all',listeners:{ 'change':function (gp,nv,ov,eOpts) {
                    // 全选
                    if(nv && !ov)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(true);
                            //wCheck    boxGroup.setValue([true, true, true, true, true, true, true, true]);
                        });
                    // 反选
                    if(ov && !nv)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(false);
                        });
                } },width:opt.itemwidth},
                {boxLabel:'周一', name:opt.name + '[]', id:opt.name + '1', inputValue:'1',width:opt.itemwidth},
                {boxLabel:'周二', name:opt.name + '[]', id:opt.name + '2', inputValue:'2',width:opt.itemwidth},
                {boxLabel:'周三', name:opt.name + '[]', id:opt.name + '3', inputValue:'3',width:opt.itemwidth},
                {boxLabel:'周四', name:opt.name + '[]', id:opt.name + '4', inputValue:'4',width:opt.itemwidth},
                {boxLabel:'周五', name:opt.name + '[]', id:opt.name + '5', inputValue:'5',width:opt.itemwidth},
                {boxLabel:'周六', name:opt.name + '[]', id:opt.name + '6', inputValue:'6',width:opt.itemwidth},
                {boxLabel:'周日', name:opt.name + '[]', id:opt.name + '0', inputValue:'0',width:opt.itemwidth}
            ]
        };
        if (opt.anchor) wconf.anchor = opt.anchor;
        if(opt.config) Ext.apply(wconf,opt.config);
        var wCheckboxGroup=Ext.create('Ext.form.CheckboxGroup',wconf);
        wCheckboxGroup.on('change', function (cg, chk,ov,eOpts) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                }
            };
            real_field.setValue(ckd_val.join(','));
        });

        function selectAll(v) {
            wCheckboxGroup.setValue([v, v, v, v, v, v, v, v]);
        };
        var obj = [wCheckboxGroup];
        if (opt.id) obj.push(real_field);
        return obj[0];
    },


    //周几有效分3列
    weekCheckboxGroupThree:function (opt) {
        if (!opt) opt = {};
        if (!opt.fieldLabel) opt.fieldLabel = "周几有效";
        if (!opt.width) opt.anchor = '100%';
        if (!opt.name) opt.name = 'week';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});

        var wconf = {
            fieldLabel:opt.fieldLabel,
            columns:4,
            items:[
                {boxLabel:'全选',name:'all',listeners:{ 'change':function (gp,nv,ov,eOpts) {
                    // 全选
                    if(nv && !ov)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(true);
                            //wCheckboxGroup.setValue([true, true, true, true, true, true, true, true]);
                        });
                    // 反选
                    if(ov && !nv)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(false);
                        });

                } }},
                {boxLabel:'周一', name:opt.name + '[]', id:opt.name + '1', inputValue:'1'},
                {boxLabel:'周二', name:opt.name + '[]', id:opt.name + '2', inputValue:'2'},
                {boxLabel:'周三', name:opt.name + '[]', id:opt.name + '3', inputValue:'3'},
                {boxLabel:'周四', name:opt.name + '[]', id:opt.name + '4', inputValue:'4'},
                {boxLabel:'周五', name:opt.name + '[]', id:opt.name + '5', inputValue:'5'},
                {boxLabel:'周六', name:opt.name + '[]', id:opt.name + '6', inputValue:'6'},
                {boxLabel:'周日', name:opt.name + '[]', id:opt.name + '0', inputValue:'0'}
            ]
        };
        if (opt.anchor) wconf.anchor = opt.anchor;
        if(opt.config) Ext.apply(wconf,opt.config);
        var wCheckboxGroup=Ext.create('Ext.form.CheckboxGroup',wconf);
        wCheckboxGroup.on('change', function (cg, chk,ov,eOpts) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                }
            };
            real_field.setValue(ckd_val.join(','));
        });

        function selectAll(v) {
            wCheckboxGroup.setValue([v, v, v, v, v, v, v, v]);
        };

        var obj = [wCheckboxGroup];
        if (opt.id) obj.push(real_field);
        return obj[0];
    },


    LoadMask:function(msg){
        return new Ext.LoadMask(Ext.getBody().component, {msg:msg});
    },


    getSelected:function(grid, all){
        var sld = grid.getSelectionModel().getSelection();
        return all ? sld : sld[0];
    },


    //渲染周几有效的函数
    weekRenderer:function (value, metaData, record, rowIndex, colIndex, store) {
        var str = "一,二,三,四,五,六,日";
        if (value) {
            value = value.replace('1', '一');
            value = value.replace('2', '二');
            value = value.replace('3', '三');
            value = value.replace('4', '四');
            value = value.replace('5', '五');
            value = value.replace('6', '六');
            value = value.replace('0', '日');
            value = value.replace('7', '日'); //兼容老数据

            var tmp = value.split(',');
            for (var i=0; i<tmp.length; i++){
                str = str.replace(tmp[i], "<span>"+ tmp[i] +"</span>");
            };
        };
        return '<span class="weekly">'+str+'</span>';
    },

    //设置周几有效的值（选中状态）
    weekSetValues:function (chechboxGroup, value) {
        if (!value) return false;
        var va = value.split(',');
        var values = [false, false, false, false, false, false, false, false];
        for (var i = 0; i < va.length; i++) {
            var xb = (va[i]==0) ? 7 : va[i];
            values[xb] = true;
        };
        if (va.length == 7) values[0] = true;
        chechboxGroup.eachBox(function(box,idx){
            if(values[idx]){
                box.setRawValue(true);
            }
        });
    },

    //产品类型复选框
    productType:function(opt){
        if (!opt.fieldLabel) opt['fieldLabel'] = '产品类型';
        if (!opt.name) opt.name = 'product_type';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.width) opt.width = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_config={name:opt.hiddenName,id:opt.hiddenName+'_id'};
        if(opt.real_renderTo) real_config.renderTo=opt.real_renderTo;
        var real_field = new Ext.form.Hidden(real_config);
        var data = PRODUCTS_TYPE;
        if(opt.data)data=opt.data;
        var items = [];
        for (var $i=0; $i<data.length; $i++){
            items.push({ boxLabel:data[$i][1], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i][0],cls:'group_cls'});
        };
        if(!opt.labelWidth)opt.labelWidth=80;
        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            //columns: 1,
            width:opt.width,
            labelWidth:opt.labelWidth,labelAlign:"right",
            labelSeparator:'：',
            xtype: 'checkboxgroup',
            items:items
        };
        if(opt.columns)cg_conf.columns=opt.columns;
        if(opt.renderTo)cg_conf.renderTo=opt.renderTo;
        var wCheckboxGroup=Ext.create('Ext.form.CheckboxGroup',cg_conf);
        wCheckboxGroup.on('change', function (cg, chk,ov,eOpts) {
            var ckd_val = [];
            var chk_id=chk[opt.name+'[]'];
            if(typeof chk_id!='object'){
                real_field.setValue(chk_id);
                return false;
            }
            if(chk_id) {
                for (var i = 0; i < chk_id.length; i++) {
                    ckd_val.push(chk_id[i]);
                }
                real_field.setValue(ckd_val.join(','));
            }
        });
        var obj = [wCheckboxGroup];
        if (opt.id) obj.push(real_field);
        return obj[0];
    },

    //设置产品类型（选中状态）
    productTypeSetValues:function (chechboxGroup, value) {
        if (!value) return false;
        var data = PRODUCTS_TYPE;
        var va = value.split(',');
        var values = [];
        for (var i = 0; i < data.length; i++) {
            var val = true, ext=false;
            for (var v=0; v<va.length; v++){
                if ( va[v] == data[i][0] ){
                    ext = true; break;
                };
            };
            if ( !ext ) val = false;
            values.push(val);
        };
        //chechboxGroup[0].setValue(values);
        chechboxGroup.eachBox(function(box,idx){
            if(values[idx]){
                box.setRawValue(true);
            }
        });
    },

    seat_type_renderer : function(v,m,r){
        var data = SUNLINE.CONFIG.seat;
        for (var i=0; i<data.length; i++){
            var item = data[i];
            if (item[0] == v){
                return item[1];
            };
        };
        return '未知';
    },

    order_status_combo : function(opt){
        if (!opt) {
            opt = {id:"o_status", width:100, name:"o_status"};
        };
        if (!opt.width) opt.width = 100;
        if (!opt.emptyText) opt.emptyText = '请选择订单状态';
        var option = {
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['o_status'],
                data:[
                    ['全部状态'],['待确认'],['待付款'],['已付款'],
                    ['申请退票'],['交易成功'],['退票'],['结算中'],
                    ['已结算'],['问题订单']
                ]
            }),
            displayField:"o_status",
            valueField:"o_status",
            mode:"local",
            editable : false,
            fieldLabel:"订单状态"
        };
        option = Ext.apply(option, opt);
        return new Ext.form.ComboBox(option);
    },

    stop_sale_time_tool: function (opt) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '停售时间';
        if (!opt.defaultTime) opt.defaultTime = 30;
        if (!opt.hiddenField) opt.hiddenField = 'bl_stop_sale';
        var option = {
            loadingText: '正在加载时间选择工具',
            emptyText: '请填写时间',
            editable: false,
            mode: 'local',
            triggerAction: 'all',
            forceSelection: false,
            listWidth: 300,
            tpl: "<tpl for='.'><div style='height:100px'><div id='time_tool_div_" + opt.id + "'></div></div></tpl>",
            store: new Ext.data.SimpleStore({fields: [], data: [
                []
            ]})
        };
        option = Ext.apply(option, opt);
        var time_tool = new Ext.form.ComboBox(option);
        var show_tip, show_tip_unit;
        var time_tool_form = new Ext.form.FormPanel({
            //frame : true,
            border: false,
            labelAlign: 'top',
            bodyStyle: 'padding:5px',
            defaults: { anchor: '100%'},
            defaultType: 'radio',
            items: [
                {xtype: 'displayfield', hideLabel: true, value: '请设定一个发团前停止售票的时间。'},
                {fieldLabel: '时间间隔',labelWidth:60,id: 'time_value_' + opt.id, name: 'time_value', xtype: 'numberfield', maxValue: 999, minValue: 0, value: opt.defaultTime, allowDecimals: false},
                {fieldLabel: '时间单位',labelWidth:60,
                    id: 'time_unit_m_' + opt.id,
                    checked: ($product_type == 10) ? true : false,
                    boxLabel: '分钟',
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '分钟'
                },
                {
                    fieldLabel: ' ',labelWidth:60,labelSeparator:'',
                    boxLabel: '小时',
                    checked: ($product_type == 11) ? true : false,
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '小时'
                },
                {
                    fieldLabel:' ',labelWidth:60,labelSeparator:'',
                    boxLabel: '天',
                    checked: ($product_type == 20) ? true : false,
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '天'
                }
            ],
            buttonAlign: 'center',
            buttons: [
                { text: '确定', handler: function () {
                    var v = time_tool_form.getForm().getValues();
                    if (!v.time_value) {
                        //Ext.Msg.alert('友情提示','请填写正确的时间间隔数值。');
                        if (!show_tip) {
                            show_tip = new Ext.ToolTip({
                                target: 'time_value_' + opt.id,
                                anchor: 'top',
                                anchorOffset: 20, // center the anchor on the tooltip
                                html: '请填写正确的时间间隔数值。'
                            });
                        }
                        ;
                        show_tip.show();
                    }
                    ;
                    if (!v.time_unit) {
                        if (!show_tip_unit) {
                            show_tip_unit = new Ext.ToolTip({
                                target: 'time_unit_m_' + opt.id,
                                anchor: 'right',
                                anchorOffset: 3,
                                html: '请选择时间单位。'
                            });
                            show_tip_unit.show();
                        }
                        ;
                    }
                    ;
                    time_tool.setValue('提前' + v.time_value + v.time_unit);
                    time_tool.collapse();
                }}
            ]
        });

        var unit = {'10': '分钟', '11': '小时', '20': '天'};
/*        time_tool.on('boxready',function(){
            alert(111);

        });*/
        time_tool.on('expand', function () {
            if(Ext.get('time_tool_div_' + opt.id).getHtml()==''){
                time_tool_form.render('time_tool_div_' + opt.id);
            }
            var sv = time_tool.getValue();
            if (sv) {
                sv = sv.replace('提前', '');
                var tv = parseInt(sv), tu = sv.replace(tv, '');
                tu = tu ? tu : unit[$product_type] ? unit[$product_type] : '分钟';
                var json = {time_value: tv, time_unit: tu};
                setTimeout(function () {
                    time_tool_form.getForm().setValues(json);
                }, 300);
            }
        });

        return time_tool;
    },

    /**
     * 供应商选择列表
     * @param option
     * @return {*}
     */
    supplier_combo : function(option){
        if (!option['identity']) option['identity'] = 'buyer'; // seller
        var conf = {
            type : 'supplier',
            rootText: '所有供应商',
            emptyText:'请选择供应商',
            id : option.id,
            fieldLabel: option.fieldLabel?option.fieldLabel:'供应商',
            baseParams:{_in:'org_type::single,,many', type:'supplier', identity:option['identity']}
        };
        var _otype = _uinfo.org_type;
        if ( in_array( _uinfo.u_dj, SUNLINE.CONFIG.user_level )>2 ){
            if (_otype == 'many' || _otype=='single'){
                conf['disabled']=true;
            }
        }

        return SUNLINE.org_tree_combo(conf);
    },


    /**
     * 分销商选择列表
     * @param option
     * @return {*}
     */
    reseller_combo : function(option){
        if (!option['identity']) option['identity'] = 'buyer'; // seller
        var conf = {
            type : 'sales',
            rootText: '所有分销商',
            emptyText:'请选择分销商',
            id : option.id,
            fieldLabel: option.fieldLabel?option.fieldLabel:'分销商',
            baseParams:{type:'sales', identity:option['identity']}
        };
        var _otype = _uinfo.org_type;
        if ( in_array( _uinfo.u_dj, SUNLINE.CONFIG.user_level )>2 ){
            if (_otype == 'sales'){
                conf['disabled']=true;
            }
        }
        return SUNLINE.org_tree_combo(conf);
    },

    /**
     * 单位选择列表
     * @param config
     * @return {Array}
     */
    org_tree_combo : function (config) {
        if (!config) config = {} ;
        if (!config.type) config.type = 'all';
        if (!config.rootText) config.rootText = '所有单位';
        if (!config.rootId) config.rootId = '0';
        if (!config.id) config.id = Ext.id();
        if (!config.name) config.name = config.id;
        if (!config.emptyText) config.emptyText = '请选择单位';
        if (!config.fieldLabel) config.fieldLabel = '选择单位';
        if (!config.values) config.values = [_uinfo.u_jgid, _uinfo.org_name];
        if (!config.identity) config.identity = 'buyer' // seller;

        var tree_cfg = {
            useArrows:true,
            autoScroll:true,
            animate:true,
            height:200,
            containerScroll:true,
            border:false,
            dataUrl:$__app__ + '/Company/treeJson/' ,

            root:{
                nodeType:'async',
                text:config.rootText,
                id:config.rootId,
                expanded:true
            }
        };
        var _org_tree = new Ext.tree.TreePanel(tree_cfg);
        var _org_tree_loader = _org_tree.getLoader();
        _org_tree_loader.baseParams = Ext.apply(_org_tree_loader.baseParams, config.baseParams);
        //_org_tree_loader.baseParams['type'] = config.type;
        //_org_tree_loader.baseParams['identity'] = config.identity;
        _org_tree.on('click', function(node){
            var v = node.text;
            v = v.replace('<b>','').replace('</b>','');
            var id = node.id;
            _combo.setValue(v);
            _hidden_name.setValue(id);
            _combo.collapse();
            var orgObj = {org_id:id, org_name:v, org_layer:node.attributes.org_layer, org_bh:node.attributes.org_bh};
            _combo.fireEvent( 'treeClick', orgObj, node.attributes );
        });

        var combo_conf = {
            loadingText:'正在加载单位信息',
            mode: 'local',
            triggerAction:'all',
            forceSelection:true,
            tpl: "<tpl for='.'><div style='height:200px'><div id='org_tree_panel_div_"+ config.id +"'></div></div></tpl>",
            store : new Ext.data.SimpleStore({fields:[],data:[[]]}),
            value : config.values[1]
        };
        combo_conf = Ext.apply(combo_conf, config);
        combo_conf['id'] = config.id + '_txt';
        combo_conf['name'] = config.name + '_txt';

        var _combo = new Ext.form.ComboBox(combo_conf);
        var _hidden_name = new Ext.form.Hidden({name:config.name, value:config.values[0]});

        _combo.on('expand', function(){
            _org_tree.render("org_tree_panel_div_"+ config.id );
        });

        return [_combo,_hidden_name];
    },

    /**
     * 获取单位选择框的值
     * @param obj
     * @return {Array}
     */
    get_org_tree_combo : function(obj){
        try{
            var id = obj[1].getValue(), name = obj[0].getValue();
            return [id, name];
        } catch(e){}
    },

    /**
     * 设置单位选择框的值
     * @param obj
     * @param values
     */
    set_org_tree_combo : function(obj, values){
        try {
            obj[1].setValue(values[0]);
            obj[0].setValue(values[1]);
        } catch (e) {}
    },


    /**
     * 图表控件
     * @param option
     */
    chart : function(option){
        if (!option) return false;
        var $o = option, $data_url, $element, $obj, $chart_path, $chart_type, $width, $height, $data_type;
        $data_url = $o.data_url ? $o.data_url : '';
        //if ( !$data_url ) return false;
        $element = $o.element ? $o.element : '';
        $chart_path = $app_public_path + 'charts/';
        $chart_type = $o.type ? $o.type : 'Column3D';
        $width = $o.width ? $o.width : 400;
        $height = $o.height ? $o.height : 300;
        $data_type = $o.data_type=='xml' ? 'xml' : 'json';

        var $js = new FusionCharts( $chart_path + $chart_type + '.swf?from=FUSIONCHARTS.COM', '_id_'+ new Date().getTime() , $width, $height, "0" );
        if ( $data_type == 'xml' && $data_url) $js.setXMLUrl($data_url);
        if ( $data_type == 'json' && $data_url) $js.setJSONUrl($data_url);
        if ( $element != '' ) $js.render($element);
        return $js;
    },


    /**
     * 附件上传插件
     * @param opt
     * @param bool
     * @param url
     * @param fields
     * @returns {GridPanel|*}
     * @constructor
     */
    UploadPanel : function(opt,bool,url,fields){
        var upload_url = $__app__ + '/Attachment/UploadJson';
        var upload_field = [ 'at_id','at_number','at_name','at_type','at_size','at_time','at_class','at_url','at_user','at_class'];
        if(url)upload_url=url;
        if(fields)upload_field=fields;
        bool=bool?bool:false;
        var upload_store = new SUNLINE.JsonStore(upload_url, upload_field,bool);
        var pageSize=20;
        upload_store.baseParams = { start:0, limit:pageSize};
        function size_format(e){
            return Math.ceil(e/1000)+'KB';
        }
        function upload_type(v,m,r){
            var t= r.get('at_type');
            if(t=='jpg' || t=='gif' || t=='png'){
                return '<a href="'+$__root__+'/'+v+'" target="_blank">' +
                    '<img src="'+$__root__+'/'+v+'" width="20px" height="20px" title="点击查看原图"></a>'
            }
            return v;
        }
        var upload_cm = new Ext.grid.ColumnModel({
            columns:[
                new Ext.grid.RowNumberer(),
                {header:"ID", dataIndex:"at_id", width:150, hidden:true},
                {header:"文件名称", dataIndex:"at_name", width:150},
                {header:"系统类别", dataIndex:"at_class", width:150},
                {header:"文件类型", dataIndex:"at_type", width:60},
                {header:"文件大小", dataIndex:"at_size", width:60,renderer:size_format},
                {header:"上传时间", dataIndex:"at_time", width:150},
                {header:"文件路径", dataIndex:"at_url", width:60,renderer:upload_type,align:'center'},
                {header:"操作人", dataIndex:"at_user", width:80}
            ],
            defaults:{sortable:true}
        });

        opt.disable=opt.disable?opt.disable:false;
        opt.value=opt.value?opt.value:'';
        opt.tit=opt.tit?opt.tit:'';
        if(opt.value)window.visa_type=opt.value;
        var at_box=SUNLINE.DictComBox({
            id:'at_class',name:'at_class',
            fieldLabel:'附件类型',
            displayField:"d_text",
            valueField:"d_text",
            disabled:opt.disable,
            value:opt.value,
            emptyText:' ==== 请选择附件类型 ===='
        },{d_type:"附件类型"});

        var upload_where={
            region:'center',
            height:200,
            border:false,
            cm:upload_cm,
            store:upload_store,
            loadMask:{msg:'数据载入中，请稍后'},
            viewConfig:{
                emptyText:'没有附件信息',
                deferEmptyText:true
            },
            tbar:[
                {text:'添加'+opt.tit,id:'att_add', iconCls:'button-add',handler:add_pic},
                '-',
                {text:'删除'+opt.tit,id:'att_del', iconCls:'button-del',handler:upload_del},
                '-',
                {text:'刷新', iconCls:'button-ref', handler:function () {
                    upload_store.reload();
                }},
                '->',
                at_box.box
            ],
            bbar:new Ext.PagingToolbar({
                pageSize:pageSize,
                store:upload_store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有征信信息'
            })
        };
        upload_where = Ext.apply(opt,upload_where);
        var upload_grid = new Ext.grid.GridPanel(upload_where);
        Ext.getCmp('at_class').on({
            'select':function(c,r,i){
                upload_store.baseParams['at_class']= r.get('d_text');
                window.visa_type=r.get('d_text');
                upload_store.load();
            }
        });

        window.upload_win=new Ext.Window({
            title:'上传文件',
            width:400,
            height:140,
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            html:'<iframe id="ifm_upload" name="ifm_upload" src="" width="100%" height="140" frameborder=0></iframe>',
            buttons:[
                { text:'确认上传',handler:function(){
                    { window.ifm_upload.upload_fn(window.list_no,window.visa_type)}
                }},
                { text:'关闭',handler:function(){
                    upload_win.hide();
                }}
            ]
        });
        upload_win.on('show',function(){
            var url = $__app__ + '/Attachment/upload_win?_dc=' + time();
            window.ifm_upload.location = url;
        });

        function add_pic(){
            upload_win.show();
        }
        window.upImg=function(){
            //upload_store.baseParams={at_number:window.list_no};
            upload_grid.store.load();
        };

        function upload_del(){
            var row = upload_grid.getSelectionModel().getSelected();
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要删除的附件信息');
                return;
            };
            Ext.MessageBox.confirm('友情提示', '确定删除选中的附件信息吗？', callBack);
            function callBack(id) {
                if (id == 'yes') {
                    var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在删除，请稍后...'});
                    mask.show();
                    var s = row.data;
                    Ext.Ajax.request({
                        url:$__app__ + '/Attachment/del',
                        params:{at_id:s.at_id},
                        method:'POST',
                        success:function (response, otps) {
                            mask.hide();
                            var result = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', "附件信息删除成功!");
                            if(result.status ==1){
                                upload_grid.store.remove(upload_grid.getSelectionModel().getSelected());
                            }
                        },
                        failure:function (response, otps) {
                            mask.hide();
                            Ext.Msg.alert('友情提示', '删除失败');
                        }
                    })
                }
            }
        }
        return {grid:upload_grid,store:upload_store};
    },
    /**
     * 系统字典选择器插件
     * @param opt
     * @param where
     * @param url
     * @param fields
     * @returns {ComboBox}
     * @constructor
     */
    DictComBox : function(opt,where,url,fields,load){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code','detail'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        load=load?load:false;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , load);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    DictComBox_false : function(opt,where,url,fields){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , false);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            queryParam:'skey',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    StationStartComBox : function(opt,where,url,fields){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , true);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    /**
     * 面签材料插件
     * @param opt
     * @constructor
     */
    VisaView : function(){
        var visa_form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:80,
                labelAlign:'right',
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    cls:'tcol-left',
                    items:[
                        {id:'at_class1',name:'at_class',fieldLabel:'附件类别',value:'面签材料',xtype:'hidden'},
                        {id:'at_number1',name:'at_number',fieldLabel:'征信序号',disabled:true,itemCls:'ct-box-30',width:'100%'},
                        {id:'vip_name',name:'vip_name',fieldLabel:'购车人姓名',disabled:true,itemCls:'ct-box-30',labelWidth:70,width:'100%'},
                        {id:'ip_card',name:'vip_card',fieldLabel:'身份证',disabled:true,itemCls:'ct-box-40',width:'100%'}
                    ]
                }
            ]
        });
        var visa_grid=SUNLINE.UploadPanel({region:'south'});
        var visa_win = new Ext.Window({
            width:750,
            title:'面签材料管理',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[visa_form,visa_grid.grid],
            buttons:[
                {text:'面签确定提交',handler:visa_fn},
                {text:'关闭', handler:function () {
                    visa_win.hide();
                }}
            ]
        });

        visa_win.on('show',function(){
            var f = visa_form.getForm();
            f.reset();
            var opt=window.visa_order;
            window.list_no=opt.o_list_no;
            window.visa_type='面签附件';
            var d={
                at_number:opt.o_list_no,
                vip_name:opt.o_vip_name,
                ip_card:opt.o_vip_card
            };
            f.setValues(d);
        });

        function visa_fn(){
            var count = visa_grid.grid.getStore().getCount();
            if(count<=0){
                Ext.Msg.alert('友情提示', '请上传面签材料！');
                return;
            };
            var s=visa_form.getForm().getValues();
            s['at_number']=Ext.getCmp('at_number1').getValue();
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/OrderCar/visa_save',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        Ext.Msg.alert('友情提示','面签材料提交成功!');
                        visa_win.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '面签材料提交失败！');
                }
            })
        };
        return {win:visa_win,store:visa_grid.store};

    },
    /**
     * 初审单内下拉列表插件
     * @param opt
     * @param action
     * @constructor
     */
    ComBoxFn : function(opt,action){
        var type_url = $__app__ + '/Dict/dist_json';
        var fields=['d_id','d_text','code','d_type'];
        var local_store;
        if(action.mode=='local'){
            local_store= new Ext.data.SimpleStore({fields : fields,data : action.storeData});
        }else{
            action.mode="remote";
            local_store = SUNLINE.JsonStore(type_url , fields , false);
        }
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:"d_text",
            valueField:"d_text",
            mode:action.mode,
            store:local_store
        };
        var _Box_fid_opt1 = Ext.apply(opt, opt1);
        new Ext.form.ComboBox(_Box_fid_opt1);
        if(action.mode=="remote"){
            Ext.getCmp(opt.id).on({
                'beforequery':function(){
                    if(action.baseParams['d_type']=='城市')action.baseParams['city']=window.province_val;
                    if(action.baseParams['d_type']=='区县')action.baseParams['city']=window.city_val;
                    if(action.baseParams['d_type']=='职业或职务')action.baseParams['duty']=window.duty_val;
                    local_store.baseParams=action.baseParams;
                    local_store.load();
                }
            })
        }
    },
    /**
     * 初审单项目渲染
     * @param opt
     * @param obj
     * @constructor
     */
    ItemsListTpl : function(opt,obj){
        var is_this=$(opt.id),items_tt='',fn=[],date_fn=[],order_json=opt.store;
        if(opt['items'][0]['items'].length>0){
            $.each(opt.items,function(i,v){
                var df=default_tpl(v);
                fn=fn.concat(df['fn']);
                date_fn=date_fn.concat(df['date_fn']);
                items_tt+=df['tpl']
            });
            is_this.html()
        }else{
            var df=default_tpl(opt['items']);
            items_tt=df['tpl'];
            fn=df['fn'];
            date_fn=df['date_fn'];
        }
        is_this.html(items_tt);
        //下拉框
        if(fn.length>0){
            for(var i=0;i<fn.length;i++){
                var vl=fn[i];
                if(!vl.ext_data)vl.ext_data={};
                if(vl.value)vl.ext_data.value=vl.value;
                var Ext_data=vl.ext_data;
                Ext_data.id=vl.id+'id';
                Ext_data.name=vl.name;
                Ext_data.renderTo=vl.id;
                if(!Ext_data.cls)Ext_data.cls='form_data';
                SUNLINE.ComBoxFn(Ext_data,{
                    mode:vl.mode,
                    storeData:vl.storeData,
                    baseParams:vl.params
                });
            }
        }
        var df_list=$('.df-list');
        $.each(df_list,function(i,v){
            var li=df_list.eq(i);
            var li_width=li.width();
            var lt_w=li.find('.layout-title').width();
            li.find('.form-info').width(li_width-(lt_w+10));
        });

        /*时间控件*/
        if(date_fn.length>0){
            for(var j=0;j<date_fn.length;j++){
                var va=date_fn[j];
                if(!va.ext_data)va.ext_data={};
                if(va.value){
                    va.ext_data.value=int2date(va.value);
                }
                var Ext_date=va.ext_data;
                Ext_date.id=va.id+'id';
                Ext_date.name=va.name;
                Ext_date.renderTo=va.id;
                if(!Ext_date.cls)Ext_date.cls='form_data';
                Ext_date.cls+=' '+va.type;
                SUNLINE.ExtDateField(Ext_date);
            }
        }

        if(obj)obj();
        function default_tpl(data){
            var title_h='';
            var items_info=items_list_fn(data);
            var items_list=items_info['tpl'];
            if(!data.TitleCls)data.TitleCls='';
            if(data.title)title_h='<div class="ob-title '+data.TitleCls+'">'+data.title+'</div>';
            if(data.html)title_h+=data.html;
            var tpl='<div class="df-box '+data.id+'">' + title_h +
                '<div class="ob-info"><ul>'+items_list+'</ul>' +
                '</div></div>';
            return {tpl:tpl,fn:items_info['fn'],date_fn:items_info['date_fn']};
        }
        function items_list_fn(data){
            var items=data.items;
            var items_tpl='';
            var it=['style','LayoutCls','fCls','ItemsCls','cls','TextCls','value'];
            var fn=[],date_fn=[],headler=[];
            for(var i=0;i<items.length;i++){
                var v=items[i],title_t='',form_item='',style='',read_bool='',read_cls='',date_check='';
                if(data.index>0 || v.index>0){
                    var ix=0;
                    if(data.index)ix=data.index;
                    if(v.index)ix=v.index;
                    var i_n=(ix-1);
                    v.id= v.id+'-'+i_n;
                    if(typeof order_json=='object'){
                        var i_v=order_json[(v.name).replace('[]','')];
                        if(i_v)v.value=i_v[i_n];
                    }
                }else if(typeof order_json=='object'){
                    var v_name=v.name;
                    if(v_name.indexOf('[]')>0){
                        var iv_data=order_json[(v.name).replace('[]','')];
                        if(typeof iv_data=='object'){
                            $.each(iv_data,function(ii,iv){
                                if(v.value==iv){
                                    v.checked=true;
                                    return false;
                                };
                            });
                        }
                    }else{
                        if(order_json[v.name]==0)order_json[v.name]='';
                        if(order_json[v.name]){
                            v.value=order_json[v.name];
                            date_check='checked="checked"';
                        }
                        if(v.form && order_json[v.form.name])v.form.value=order_json[v.form.name];
                    }
                }
                $.each(it,function(si,sv){ if(!v[sv])v[sv]=''; });
                var tl=items_style_fn(v, v.style);
                var check_id='<input type="checkbox" value="1" class="form-check" '+date_check+'>';
                if(v.title){
                    var title_val=v.title;
                    var title_v=title_val.replace(':','');
                    if(v.check==true) title_val+=check_id;
                    title_t='<span class="layout-title '+ v.LayoutCls+'" title="'+title_v+'">'+title_val+'</span>';
                }
                //验证条件
                var verify='',checked_v='';
                if(v.verify)verify= ' '+v.verify;
                if(v.type && v.type!='date'){
                    if(tl)style='style="'+tl+'"';
                    if(v.readOnly==true){
                        read_bool='readOnly';
                        read_cls=' readOnly_cls';
                    }
                    if(v.checked==true){
                        checked_v='checked="checked"';
                    }
                    if(v.type=='textarea'){
                        form_item='<textarea id="'+v.id+'" name="'+v.name+'" class="form_data '+ v.fCls+read_cls+verify+'" ' +
                            ''+style+' '+read_bool+'>'+ v.value+'</textarea>';
                    }else{
                        form_item='<input type="'+v.type+'" id="'+v.id+'" name="'+v.name+'" value="'+ v.value+'" ' +
                            'class="form_data '+ v.fCls+read_cls+verify+'" '+style+' '+read_bool+' '+checked_v+'>';
                        if(v.form){
                            if(!v.form.cls)v.form.cls='';
                            if(!v.form.value)v.form.value='';
                            form_item+='<input type="text" id="'+ v.form.id+'" name="'+ v.form.name+'" ' +
                                'class="'+ v.form.cls+'" value="'+ v.form.value+'" '+read_bool+'>';
                        }
                    }
                }else{
                    if(tl)style='style="'+tl+'"';
                    form_item='<em class="item-fn" '+style+' id="'+v.id+'"></em>';
                    if(verify)v.ext_data.cls='form_data '+verify;
                    if(v.type=='date'){
                        if(!v.value)v.value=order_json.server_date;
                        date_fn[date_fn.length]=v;
                    }else{
                        fn[fn.length]=v;
                    }

                }
                var style_li='';
                if(v.type=='hidden')style_li='style="display:none"';
                //提交信息
                var hint='';
                if(v.hint)hint='<i class="hint-box"><i class="fa fa-times-circle"></i> <font class="hb-t">'+v.hint+'</font><i class="fa fa-caret-down"></i></i>';
                items_tpl+='<li class="df-list '+data.ItemsCls+' '+ v.cls+' '+ (v.name).replace('[]','')+'-box" '+style_li+'><label>' +title_t+
                    '<span class="form-info'+ v.TextCls+'">'+form_item+hint+'</span>' +
                    '</label></li>';
                if(v.headler)headler[headler.length]=v;
            }
            return {tpl:items_tpl,fn:fn,date_fn:date_fn};
        }
        function items_style_fn(v,s){
            var ItemStyle={},Item_s='';
            if(Math.ceil(v.width)>0){
                ItemStyle.width= v.width+'px';
            }else{
                if(v.width)ItemStyle.width= v.width;
            };
            if(v.height)ItemStyle.height= v.height+'px';
            if(v.align)ItemStyle['text-align']=v.align;
            if(ItemStyle){
                $.each(ItemStyle,function(i,v){
                    Item_s+=i+':'+ v+';';
                });
            }
            s=Item_s+s;
            return s;
        }
    },
    RulesView : function(opt,obj){
        var rules_form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            defaultType : "textfield",
            bodyStyle:'background:#fff; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:60,
                labelAlign:'right',
                border:false
            },
            items:[]
        });
        var rules_win = new Ext.Window({
            width:550,
            title:'通融申请<font color="red">(通融申请最多可申请两次)</font>',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[rules_form],
            buttons:[
                {text:'保存',handler:rules_add,id:'rsw-id'},
                {text:'关闭', handler:function () {
                    rules_win.hide();
                }}
            ]
        });
        rules_win.on('show',function(){
            if(window.rules_total>1){
                Ext.getCmp('rsw-id').setDisabled(true);
            }else{
                Ext.getCmp('rsw-id').setDisabled(false);
            }
        });
        function rules_add(){
            var f=rules_form.getForm();
            if (!f.isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            var s = f.getValues();
            Ext.Ajax.request({
                url:$__app__ + '/StretchRules/save',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        Ext.Msg.alert('友情提示','操作成功!');
                        rules_win.hide();
                        if(obj)obj(msg);
                    }else{
                        Ext.Msg.alert('友情提示', msg);
                    };
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }
        return {win:rules_win,form:rules_form};
    },
    VerifyView : function(opt){
        var visa_type_box=SUNLINE.DictComBox({
            id:'v_result',name:'v_result',
            fieldLabel:'审核结果',
            displayField:"d_text",
            valueField:"d_text",
            itemCls:'ct-box-20',
            width:480,
            allowBlank:false
        },{d_type:opt.text+"结果"});

        var visa_vf_form = new Ext.form.FormPanel({
            region:'center',
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:80,
                labelAlign:'right',
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    items:[
                        visa_type_box.box,
                        {id:'v_type',name:'v_type',fieldLabel:'审核类型',value:opt.text,xtype:'hidden',width:480,allowBlank:false},
                        {id:'v_number',name:'v_number',fieldLabel:'订单编号',xtype:'hidden',width:480,allowBlank:false},
                        {id:'v_info',name:'v_info',fieldLabel:'审核备注',xtype:'textarea',width:480,allowBlank:false},
                        {id:'v_uid',name:'v_uid',fieldLabel:'审核人员ID',xtype:'hidden',width:150,value:_uinfo.u_id},
                        {id:'v_user',name:'v_user',fieldLabel:'审核人员',width:150,allowBlank:false,value:_uinfo.u_zname,itemCls:'ct-box-40-left',disabled:true},
                        {id:'v_time',name:'v_time',fieldLabel:'审核时间',width:150,itemCls:'ct-box-40-left',disabled:true}
                    ]
                }
            ]
        });

        var items=[visa_vf_form];
        var visa_grid=SUNLINE.UploadPanel({region:'south'});
        if(opt.text=='面签审核'){
            items=[visa_vf_form,visa_grid.grid];
        }


        var visa_vf_win = new Ext.Window({
            width:600,
            title:opt.text+'管理',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:items,
            buttons:[
                {text:'确认提交', handler:vf_save},
                {text:'确认退回', handler:vf_save},
                {text:'关闭', handler:function () {
                    visa_vf_win.hide();
                }}
            ]
        });

        visa_vf_win.on('show',function(){
            var f=visa_vf_form.getForm();
            f.reset();
            var d={
                v_number:ROW.data.o_number
            }
            f.setValues(d);
        });

        function vf_save(e){
            var f=visa_vf_form.getForm();
            if (!f.isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var s = f.getValues();
            if((s.v_result).indexOf('退单')>0){
                s.v_status='退单';
            }else{
                s.v_status='通过';
            }
            if(e.text=='确认退回')s.v_status='退回';
            Ext.MessageBox.confirm('友情提示','你确定要'+s.v_result+'吗?',function(y){
                if(y!='yes')return false;
                var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
                mask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/OrderCar/verify_save',
                    params:s,
                    method:'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        var msg = result.info;
                        if (result.status==1) {
                            Ext.Msg.alert('友情提示','操作成功!');
                            f.reset();
                            opt.store.load();
                            visa_vf_win.hide();
                        }else{
                            Ext.Msg.alert('友情提示', msg);
                        };
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            });
        }
        return {win:visa_vf_win,store:visa_grid.store};
    },
    safe_to_govern:function(opt){
        var today_date=int2date(server_date);
        var stand_box=SUNLINE.DictComBox({
            id:'st_stand_user',name:'st_stand_user',
            fieldLabel:'理赔专员',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-40',width:130
        },{d_type:"业务员"});

        var safe_org_box=SUNLINE.DictComBox({
            id:'st_safe_org',name:'st_safe_org',
            fieldLabel:'保险公司',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-100',width:476
        },{d_type:"保险公司"});

        var nature_box=SUNLINE.DictComBox({
            id:'st_nature',name:'st_nature',
            fieldLabel:'案件性质',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-100',width:476
        },{d_type:"案件性质"});

        var play_type_box=SUNLINE.DictComBox({
            id:'st_play_type',name:'st_play_type',
            fieldLabel:'打款方式',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-65',width:274,listWidth:'auto'
        },{d_type:"打款方式"});

        var safe_date=SUNLINE.ExtDateField({id:'st_safe_date',name:'st_safe_date',fieldLabel:'出险日期',itemCls:'ct-box-40',width:140,value:today_date});
        var seized_date=SUNLINE.ExtDateField({id:'st_seized_date',name:'st_seized_date',fieldLabel:'受理日',itemCls:'ct-box-30 label-box-60',width:100,value:today_date});
        var to_date=SUNLINE.ExtDateField({id:'st_to_date',name:'st_to_date',fieldLabel:'送交日',itemCls:'ct-box-30 label-box-60',width:95,value:today_date});
        var quit_date=SUNLINE.ExtDateField({id:'st_quit_date',name:'st_quit_date',fieldLabel:'退单日',itemCls:'ct-box-35',width:120,value:today_date});
        var again_date=SUNLINE.ExtDateField({id:'st_again_date',name:'st_again_date',fieldLabel:'再送交日',itemCls:'ct-box-30',width:95,value:today_date});
        var reckon_date=SUNLINE.ExtDateField({id:'st_reckon_date',name:'st_reckon_date',fieldLabel:'收到计算书日期',itemCls:'ct-box-40 label-box-120',width:110,value:today_date});
        var aging_date=SUNLINE.ExtDateField({id:'st_aging_date',name:'st_aging_date',fieldLabel:'时效日',itemCls:'ct-box-30 label-box-60',width:95,value:today_date});
        var go_time=SUNLINE.ExtDateField({id:'st_go_time',name:'st_go_time',fieldLabel:'回寄时间',itemCls:'ct-box-30',width:100,value:today_date});
        var play_date=SUNLINE.ExtDateField({id:'st_play_date',name:'st_play_date',fieldLabel:'打款日',itemCls:'ct-box-35',width:120,value:today_date});

        var form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:5px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelAlign:'right',
                labelWidth:80,
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    cls:'tcol-left',
                    items:[
                        {id:'st_id',name:'st_id',fieldLabel:'id',xtype:'hidden'},
                        {id:'st_number',name:'st_number',fieldLabel:'订单编号',xtype:'hidden'},
                        {id:'st_vip',name:'st_vip',fieldLabel:'客户名称',itemCls:'ct-box-50',width:200,readOnly:true},
                        {id:'st_plate',name:'st_plate',fieldLabel:'车牌号',itemCls:'ct-box-50 label-box-60',width:210},
                        {id:'st_face',name:'st_face',fieldLabel:'临牌号',itemCls:'ct-box-35',width:120},
                        {id:'st_remit',name:'st_remit',fieldLabel:'汇款账号',itemCls:'ct-box-65',width:274},
                        {id:'st_safe_id',name:'st_safe_id',fieldLabel:'保险公司ID',xtype:'hidden'},
                        safe_org_box.box,
                        safe_date,
                        seized_date,
                        to_date,
                        nature_box.box,
                        {id:'st_duty',name:'st_duty',fieldLabel:'事故责任',itemCls:'ct-box-100',width:476},
                        {id:'st_survey_price',name:'st_survey_price',fieldLabel:'代勘察费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_fix_price',name:'st_fix_price',fieldLabel:'修理费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_three_price',name:'st_three_price',fieldLabel:'三者修理费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_out_price',name:'st_out_price',fieldLabel:'其他相关费用（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_total_price',name:'st_total_price',fieldLabel:'合计金额（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_stand_price',name:'st_stand_price',fieldLabel:'获赔金额',itemCls:'ct-box-50 label-box-130',width:135},
                        quit_date,
                        {id:'st_quit_reason',name:'st_quit_reason',fieldLabel:'退单原因',itemCls:'ct-box-65',width:274},
                        again_date,
                        reckon_date,
                        aging_date,
                        play_date,
                        play_type_box.box,
                        {id:'st_go_user',name:'st_go_user',fieldLabel:'回寄人',itemCls:'ct-box-30',width:100},
                        go_time,
                        {id:'st_stand_uid',name:'st_stand_uid',fieldLabel:'理赔专员ID',xtype:'hidden'},
                        stand_box.box,
                        {id:'st_remark',name:'st_remark',fieldLabel:'备注',itemCls:'ct-box-100',width:476},
                        {id:'st_uid',name:'st_uid',fieldLabel:'录入人ID',xtype:'hidden',value:_uinfo.u_id},
                        {id:'st_user',name:'st_user',fieldLabel:'录入人',itemCls:'ct-box-30',width:100,value:_uinfo.u_zname,readOnly:true},
                        {id:'st_time',name:'st_time',fieldLabel:'录入日期',itemCls:'ct-box-70',width:100,value:today_date,readOnly:true}
                    ]
                }
            ]
        });

        Ext.getCmp('st_safe_org').on({
            'select':function(c,r,i){
                Ext.getCmp('st_safe_id').setValue(r.get('d_id'));
            }
        });

        var safe_win = new Ext.Window({
            width:600,
            title:'理赔记录',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[form],
            buttons:[
                {text:'保存',handler:safe_save},
                {text:'关闭', handler:function () {
                    safe_win.hide();
                }}
            ]
        });

        safe_win.on('show',function(){
            var f=form.getForm();
            f.reset();
            var d={
                st_number:opt.data.o_number,
                st_vip:opt.data.o_vip_name
            };
            f.setValues(d);
        });

        function safe_save(){
            if (!form.getForm().isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            var s = form.getForm().getValues();
            var dt=['st_safe_date','st_seized_date','st_to_date','st_quit_date','st_again_date','st_reckon_date','st_aging_date','st_play_date','st_go_time','st_time'];
            for(var i=0;i<dt.length;i++){ s[dt[i]]=str2date(s[dt[i]]); }
            Ext.Ajax.request({
                url:$__app__+'/OrderDetails/safe_to_ajax',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        safe_win.hide();
                        opt.store.load();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        };
        return safe_win;
    },
    AjaxPost:function(opt,obj){
        var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
        mask.show();
        Ext.Ajax.request({
            url:opt.url,
            params:opt.data,
            method:'POST',
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    if(obj)obj(msg)
                }else{
                    Ext.Msg.alert('友情提示', msg);
                }
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    },
    OrderPanel:function(opt,obj){
        var pageSize=20;
        var url = $__app__ + '/OrderAdmin/OrderJson';
        var field = [ 'o_id','o_number','o_vip_name','o_vip_card','o_list_no','o_uname','o_uid','o_branch','o_vip_tel','o_status'];
        if(opt.field)field=field.concat(opt.field);
        if(opt.url)url=opt.url;
        var store = new SUNLINE.JsonStore(url, field);
        if(opt.params)store.baseParams=opt.params;
        store.baseParams['start']=0;
        store.baseParams['limit']=pageSize;
        function status_fn(v){
            var r_v='';
            switch (v){
                case '征信提交':
                    r_v='<font color="red"><b>'+v+'</b></font>';
                    break;
                case '征信查询':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '初审提交':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '初审通过':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '面签提交':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '终审提交':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '审核员审核通过':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '作废':
                    r_v='<font color="#aaa"><b>'+v+'</b></font>';
                    break;
                default :
                    r_v='<b>'+v+'</b>';
            }
            return r_v;
        }
        var cm=[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"o_id", width:150, hidden:true},
            {header:"送件序号", dataIndex:"o_list_no", width:90},
            {header:"订单编号", dataIndex:"o_number", width:90,hidden:true},
            {header:"客户名称", dataIndex:"o_vip_name", width:70},
            {header:"身份证", dataIndex:"o_vip_card", width:70,hidden:true},
            {header:"信贷专员", dataIndex:"o_uname", width:70},
            {header:"部门", dataIndex:"o_branch", width:70},
            {header:"状态", dataIndex:"o_status", width:120,renderer:status_fn}
        ];
        if(opt.cm)cm=cm.concat(opt.cm);
        var order_cm = new Ext.grid.ColumnModel({
            columns:cm,
            defaults:{sortable:true}
        });
        var width=460;
        if(opt.width)width=opt.width;
        var grid = new Ext.grid.GridPanel({
            region:'west',
            border:false,
            cm:order_cm,
            store:store,
            width : width,
            maxWidth : (width+40),
            minWidth : (width-60),
            style : 'border-right-width:2px;',
            loadMask:{msg:'数据载入中，请稍后'},
            viewConfig:{
                emptyText:'没有征信信息',
                deferEmptyText:true
            },
            tbar:[
                '<b>订单信息</b>'
            ],
            bbar:new Ext.PagingToolbar({
                pageSize:pageSize,
                store:store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有征信信息'
            })
        });
        return {grid:grid,store:store};
    },
    baseParams:function(store,opt,extra){
        if(extra){
            Ext.apply(store.proxy.extraParams, opt);
        }else{
            store.proxy.extraParams=opt;
        }
    },
    /**
     * 城市多级联动
     * @param opt id:标示;appTo:指定父级;actionTo:指定要操作的字级;where:指定传到后台的数据;config:指定Combox的属性
     * @returns {*}
     * @constructor
     */
    ComBoxCity:function(opt){
        var _opt={};
        _opt={
            id:opt.id,
            fields:[ 'id','code','name','pid'],url:$__app__ + '/City/city_json',
            config:{displayField:'name',valueField:'name',width:150}
        }
        if(opt.where)_opt.where=opt.where;
        if(opt.appTo)_opt.appTo=opt.appTo;
        if(opt.appTo)_opt.actionTo=opt.actionTo;
        if(opt.items_type)_opt.items_type=opt.items_type;
        if(opt.config)Ext.apply(_opt.config,opt.config);
        return this.ComBoxPlus(_opt);
    },
    ComBoxPlus:function(opt,obj){
        console.log(opt);
        var mode_this=this;
        var local_store={};
        if(opt.action=='local'){
            local_store= new Ext.data.Store({
                fields:opt.fields,
                data : opt.storeData
            });
        }else{
            opt.action="remote";
            local_store = SUNLINE.JsonStore(opt.url , opt.fields , false);
            if(opt.items_type==true)opt.where['items_type']=true;
            if(opt.where)this.baseParams(local_store,opt.where);
        }
        var _opt={
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            pageSize:opt.config.pageSize,
            loadingText:'正在加载数据',
            allQuery:'',
            selectOnFocus : true,
            triggerAction:"all",
            displayField:opt.id,
            valueField:opt.id,
            id:opt.id+'_id',
            name:opt.id,
            mode:opt.action,
            store:local_store
        };
        if(opt.config) _opt = Ext.apply(_opt,opt.config);
        var ComBox;
        if(opt.type=='Tag'){
            ComBox=new Ext.form.field.Tag(_opt);
        }else{
            ComBox=new Ext.form.ComboBox(_opt);
        };
        if(opt.action=="remote" && opt.actionTo){
            ComBox.on({
                'select':function(c,r,o){
                    var row= r[0];
                    var to_id=Ext.getCmp(opt.actionTo+'_id');
                    /*var store_sel=to_id.getStore();
                    mode_this.baseParams(store_sel,{type:row.get('id')});*/
                    to_id.setValue('');
                    if(obj)obj(r);
                    //store_sel.load();
                }
            });
        };
        if(opt.appTo){
            ComBox.on({
                'beforequery':function(c,r,o) {
                    var city_id = Ext.getCmp(opt.appTo + '_id');
                    var append_val = city_id.getValue();
                    var append_data={append_to: append_val};
                    if(opt.items_type==true) append_data['items_type']=true;
                    if(opt.where.city_type)append_data['city_type']=opt.where.city_type;
                    mode_this.baseParams(local_store, append_data);
                    local_store.load();
                }
            });
        }
        /**
         * 添加combox获取焦点展开事件
         */
        ComBox.on({
            'focus':function(t,e,q){
                ComBox.expand();
            }
        })
        return ComBox;
    },
    checkBoxGroup:function(opt,data){
        if (!opt.fieldLabel) opt['fieldLabel'] = '';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = 'checkbox_'+opt.id;
        if (!opt.width) opt.anchor = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});
        var data = data['root']
        var items = [];
        for (var $i=0; $i<data.length; $i++){
            items.push({ boxLabel:data[$i]['d_text'], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i]['d_text']});
        };
        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            columnWidth:1,
            items:items
        };
        cg_conf=Ext.apply(cg_conf,opt);
        /*  if (opt.anchor) cg_conf.anchor = opt.anchor;
         if (!opt.columnWidth) cg_conf.columnWidth = opt.columnWidth;
         if (opt.columns) cg_conf.columns = opt.columns;*/
        var ptCheckboxGroup = new Ext.form.CheckboxGroup(cg_conf);
        ptCheckboxGroup.on('change', function (cg, chk) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                };
            };
            real_field.setValue(ckd_val.join(','));
        });
        return [ptCheckboxGroup,real_field,data];
    },

    checkBoxGroupSetValues:function(chechkboxGroup, value) {
        if (!value) return false;
        var data = chechkboxGroup[2];
        var va = value.split(',');
        var values = {};
        values[chechkboxGroup[0].name+'[]']=[];
        for (var i = 0; i < data.length; i++) {
            var val = true, ext=false;
            for (var v=0; v<va.length; v++){
                if ( va[v] == data[i]['d_text'] ){
                    ext = true;
                    break;
                };
            };
            if (ext)
                values[chechkboxGroup[0].name+'[]'].push(data[i]['d_text']);
        };
        chechkboxGroup[0].setValue(values);
     },


    UserCompanyBox:function(opt,obj){
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Users/users_company',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'所属单位',
                labelWidth:60,
                width:300,
                labelAlign:'right',
                value:_uinfo.org_name
            }
        };
        _cof=Ext.apply(_cof,opt);
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },


    CompanyBox:function(opt,obj,b,c){
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Company/treeJson',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'所属单位',
                labelWidth:60,
                width:340,
                labelAlign: 'right',
                value: _uinfo.org_name,
                pageSize: 10

            }
        };
        _cof=Ext.apply(_cof,opt);
        /*_cof['config']['tpl'] = Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item">' +
                '<div style="float:left; width: 80px; overflow: hidden; color: blue;white-space: nowrap;text-overflow: ellipsis;" ' +
                'title="{org_bh}">{org_bh}</div>' +
                '<div style="margin-left: 82px; height: 22px; line-height: 22px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" ' +
                'title="{[this.get_name(values)]}">{[this.get_name(values)]}</div>' +
                '</li>',
            '</tpl></ul>',
            {
                get_name : function(v){
                    //console.log(v);
                    return v.text ? v.text : (v.org_name ? v.org_name : '');
                }
            }
        );*/
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },


    CompanyBox_guide:function(opt,obj){  //导游报账
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Company/treeJson',
            config:{
                displayField:'text',
                valueField:'id',
                hiddenName:'id',
                fieldLabel:'',
                labelSeparator:'',
                labelWidth:0,
                width:250,
                listConfig:{minWidth:300},
                labelAlign:'right',
                value:_uinfo.org_name
            }
        };
        if (opt.id) _cof.config.id = opt.id;
        _cof=Ext.apply(_cof,opt);
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },
    WxAppCombo:function(opt){
        var wxapp_store = SUNLINE.JsonStore($__app__ + '/WxApp/dataJson', '', opt.autoLoad);
        var config={
            fieldLabel: '选择公众号',
            labelAlign:'right',
            labelWidth:70,
            name: 'wa_id',
            triggerAction:'all',
            store:wxapp_store,
            displayField: 'wa_name',
            valueField: 'wa_appid',
            emptyText:' 请选择公众号 ',
            allowBlank: false
        };
        if(opt){
            config=Ext.apply(config,opt.config);
        };
        return new Ext.form.ComboBox(config);
    },
    /**
     * 出发口岸下拉控件
     * @param opt
     * @returns {*}
     * @constructor
     */
    StartSiteBox:function(opt){
        var _cof={
            id:'start_site',
            fields:['id','text'],url:$__app__ + '/StationStart/start_site_data',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'出发口岸',
                labelWidth:60,
                width:220,
                labelAlign:'right',
                value:'全部口岸'
            }
        };
        if(opt)_cof=Ext.apply(_cof,opt);
        var company_site=SUNLINE.ComBoxPlus(_cof);
        return company_site;
    },
    ItemsList:function(opt,obj,sct_type_select){
        //计算方式
        var id_arr=[];
        var items_cost_store=opt.store;
        //默认情况下有车辆与导游
        var tpl_car,tpl_diao,tpl_text,shop_type,team_hotel_plan;
        //出团计划单 酒店独有
        if(opt.team_hotel_plan==true){
            team_hotel_plan=true;
        }else{
            team_hotel_plan=false;
        };
        if(opt.tpl_car==true){
            tpl_car=true;
        }else{
            tpl_car=false;
        };
        if(opt.tpl_diao==true){
            tpl_diao=true;
        }else{
            tpl_diao=false;
        };
        if(tpl_diao==true && tpl_car==true){
            tpl_text=true;
        };
        if(opt.team_plan!=true){
            var empty_store=[
                {type_new:'车辆',insti_name:'中型车',cs_type_name:'中型大巴',sort:-8},
                {type_new:'导游',insti_name:'地接导游',cs_type_name:'地接导游',sort:-8},
            ];
            Ext.each(empty_store,function(emv,emi){
                EmptyItemsStore(emv);
            });
        };

        function EmptyItemsStore(data){
            if (!data.type_new || !data.insti_name) return false;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票',//票种类型,
                ti_sense_price:data.ti_sense_price?data.ti_sense_price:0,//成本单价,
                ti_days_num:data.ti_days_num?data.ti_days_num:1,//使用天数,
                ti_profit:data.ti_profit?data.ti_profit:0//毛利
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_arr=[],items_remove=[];
            items_cost_store.each(function(v){
                var row= v.data;
                items_arr.push(row.ti_type_new);
            });
            if(in_array(data.type_new,items_arr)==-1){
                items_cost_store.add(items_data);
            };
            return items_data;
        }
        var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
            collapsible:false,
            groupHeaderTpl:['','<div><span class="items-group-cls">{rows:this.values_rows}</span>{name:this.format_keyword} (共 {[values.rows.length]} 项成本)</div>',{
                format_keyword:function(name){
                    if(name=="-1"){
                        return '按团计费';
                    }else if(name=="-2"){
                        return '分公司报价';
                    }else{
                        if(parseFloat(name)>0) name='第'+name+'天';
                        return name;
                    }
                },
                values_rows:function(row){
                    if(row.length>0){
                        var items_type={},money= 0,money_total=0;
                        Ext.each(row,function(v,i){
                            var rw=v.data;
                            money+=parseFloat(rw['ti_trade_price']);
                            money_total+=parseFloat(rw['ti_all_money']);
                        });
                    }
                    return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元] [单价小计:<font class="red-cls">￥'+money.toFixed(2)+'</font>元]';
                }
            }]
        });
        //表头标注
        //删除项目
        function items_del(){
            return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
        };
        //结算总额显示
        function all_money(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
                }else{
                    return '￥'+ parseFloat(v).toFixed(2)
                }
            }
        };

        //结算单价显示
        function trade_price_new(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '￥'+parseFloat(v).toFixed(2);
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '￥'+parseFloat(v).toFixed(2);
                }else{
                    return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
                }
            }
        };

        function type_name_box_fn(v,m,r){
            if(opt.team_line!=true)return v;
            if(!v)return '';
            var ti_sense_price=r.data.ti_sense_price;
            if(!ti_sense_price)ti_sense_price=0;
            if(r.data.ti_type_new=='住宿')return '<font color="red">('+ti_sense_price+'/间)</font>'+v;
            //if(r.data.ti_type_new=='导游' || r.data.ti_type_new=='车辆')return v;
            return '<font color="red">('+ti_sense_price+'/人)</font>'+v;
        };

        function profit_fn(v,m,r){
            if(!v)v=0;
            if(r.data.ti_type_new=='住宿') return '<font color="orange">'+v+'/间</font>';
            if(r.data.ti_type_new=='车辆' || r.data.ti_type_new=='导游') return '<font color="orange">'+v+'/团</font>';
            return '<font color="orange">'+v+'/人</font>';
        }

        //天数显示
        function days_format(v,m){
            if(v<0)return '-';
            return '第'+v+'天';
        };

        //项目类型
        var ti_type_mode_box=SUNLINE.LocalComob({
            id:'ti_type_mode',
            fields:['ti_type_mode'],
            data:[['按团计算'],['按人计算']],
            config:{
                id:"ti_type_mode_id",
                listeners:{ change:ti_type_mode }
            }
        });

        //结算方式
        var si_settle_type_box=SUNLINE.LocalComob({
            id:'ti_insti_type',
            fields:['ti_insti_type'],
            data:[['现金'],['签单']],
            config:{
                id:"ti_insti_type_id"
            }
        });

        var _cof={
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        };
        //搜索项目数据
        var insti_name_box=SUNLINE.ComBoxPlus({
            id:'insti_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:_cof
        });
        //搜索项目中内项目数据
        var cs_type_name_box=SUNLINE.ComBoxPlus({
            id:'cs_type_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:_cof
        });

        //票种类型Box
        var sct_type_box=SUNLINE.LocalComob({
            id:'sct_type',
            fields:['sct_type'],
            data:[['成人票'],['儿童票'],['婴儿票'],['全陪票']],
            config:{
                id:"sct_type_id",
                listeners:{
                    select:sct_type_select
                }
            }
        });

        //处理状态
        var deal_status_box=SUNLINE.LocalComob({
            id:'ti_status_box',
            fields:['ti_status_box'],
            data:[['未处理'],['处理中'],['已处理']],
            config:{
                value:'未处理'
            }
        });

        //消费项目表头
        var items_cost_cm=[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
            {header:"", dataIndex:"items_del", width:25,renderer:items_del},
            {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
            {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
            {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
            {header:"sp_one_price", dataIndex:"sp_one_price", width:10, hidden:true},
            {header:"sp_pct_num", dataIndex:"sp_pct_num", width:10, hidden:true},
            {header:"sp_id", dataIndex:"sp_id", width:10, hidden:true},
            {header:"资源名称", dataIndex:"ti_insti_name", width:150,editor:insti_name_box},
            {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
            {header:"项目名称", dataIndex:"ti_cs_type_name", width:160,editor:cs_type_name_box,renderer:type_name_box_fn},
            {header:"项目名称ID", dataIndex:"ti_cs_id", width:50,hidden:true},
            {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
            {header:"票种类型", dataIndex:"ti_sct_type", width:70,hidden:opt.type?false:true,editor:sct_type_box},
            {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box,hidden:opt.team_line?true:false},
            {header:"结算方式", dataIndex:"ti_insti_type", width:80,editor:si_settle_type_box},
            {header:"第几天", dataIndex:"ti_day",hidden:opt.type?true:false, width:80,renderer:days_format,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_day_new'
                })
            },
            {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right',sortable:true,renderer:all_money,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_all_money_new',
                    listeners:{ change:ti_settle_money }
                })
            },
            {header:"数量", dataIndex:"ti_num", width:50,align:'center',sortable:true,
                editor:new Ext.form.NumberField({
                    minValue:1,selectOnFocus:true,id:'ti_num_new',
                    listeners:{ change:ti_settle_num }
                })
            },
            {header:"成本单价", dataIndex:"ti_sense_price",hidden:true, width:85,align:'right'},
            {header:"毛利", dataIndex:"ti_profit",sortable:true,hidden:opt.team_line?false:true,renderer:profit_fn, width:100,align:'right',
             editor:new Ext.form.NumberField({
             selectOnFocus:true,id:'ti_profit',
             listeners:{ change:ti_profit_even }
             })
             },
            {header:"单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:80,align:'right',
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_trade_price_new',
                    listeners:{ change:ti_settle_price }
                })
            },
            {header:"备注", dataIndex:"ti_remark", width:160,editor:new Ext.form.TextField({id:'ti_remark_new'}),renderer:function(v){
                if(!v)return '';
                return '<font title="'+v+'" color="blue">'+v+'</font>';
            }},
            {header:'签单号',dataIndex:'ti_sign',width:130,editor:new Ext.form.TextField({id:'ti_sign'}),hidden:opt.team_plan?false:true},
            {header:'处理状态',dataIndex:'ti_deal_status',width:80,editor:deal_status_box,hidden:opt.team_plan?false:true,renderer:function(v){
                if(!v)return '未处理';
                return v;
            }},
            {header:'联系方式',dataIndex:'ti_man_tel',width:130,editor:new Ext.form.TextField({id:'ti_man_tel'}),hidden:true},
            {header:'联系人',dataIndex:'ti_man',width:150,editor:new Ext.form.TextField({id:'ti_man'}),hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                if(!v && !r.get('ti_man')) return '';
                if(!v)v='';
                var tel=r.get('ti_man_tel');
                if(!tel)tel='';
                return v+'-'+ r.get('ti_man_tel');
            }}
        ];
        //组织tbar项目
        var items_data=[];
        Ext.each(opt.items_list,function(v,i){
            if(v.text=='车辆'){
                items_data[i]={
                    text: v.text,id: v.id,handler:tbar_items,disabled:tpl_text
                }
            }else if(v.text=='住宿'){
                if(team_hotel_plan==true){
                    items_data[i]={
                        text: v.text,id: v.id,handler:hotel_items,disabled:tpl_diao
                    }
                }else{
                    items_data[i]={
                        text: v.text,id: v.id,handler:tbar_items,disabled:tpl_diao
                    }
                }
            }else{
                items_data[i]={
                    text: v.text,id: v.id,handler:tbar_items,disabled:tpl_diao
                }
            }
        });
        /*function hotel_items(){
            alert(1111)
        }*/
        if(opt.team_line==true){
            items_data=items_data.concat(
                { xtype:'checkbox',id:"Common_id",width:8,handler:click,value:true},
                '<font color="blue" title="有证不包含景区">全陪是否有证</font>'/*,
                { xtype:'checkbox',id:"small_id",width:8,handler:click,value:false},
                '<font color="blue" title="儿童包含门票">儿童包含门票</font>'*/
            );
        }
        items_data=items_data.concat(
            [
            /*'-',{text:'删除项目', id:'_del_item', iconCls:'button-del',handler:items_cost_del},*/
            '->',
            {text:'按项目类型分组',id:'_group_by',iconCls:"searchico",field:'ti_type_new',handler:setGroup,
                menu:{
                    items :[
                        {text:'按天分组',field:'ti_day',handler:setGroup,xtype:opt.type?'hidden':''},
                        {text:'按项目类型分组',field:'ti_type_new',handler:setGroup},
                        {text:'按结算方式',field:'ti_insti_type',handler:setGroup,xtype:opt.type?'hidden':''}
                    ]
                }
            }
        ]);

        var grid_items={
            region:'center',
            loadMask: {msg : '数据传输中，请稍候...'},
            store: items_cost_store,
            columns: items_cost_cm,
            autoHeight : true,
            features: [items_cost_group],
            autoScroll : true,
            modal : true,
            closeAction : 'hide',
            cls : 'suntour_dataView',
            layout : 'fit',
            minWidth:500,
            minHeight:500,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            tbar:items_data
        };
        if(opt.plan_type=='height_false'){
            grid_items.autoHeight=false;
            //grid_items.height=Ext.getBody().getHeight()-200;
        }

        if(opt.team_plan==true){
            if(opt.team_guide!=true){
                grid_items.bbar=[
                    '<b>其他事项：</b>','->',
                    '备用金领款：',
                    {xtype:'numberfield', id:'team_total_fee_2', name:'team_total_fee'}
                ];
                grid_items.buttons=[
                    '->',
                    {xtype : 'tbtext', id:'total_info', text:'&nbsp;' }
                ];
            }

        };

        //画出表格
        var items_cost_grid=new Ext.grid.GridPanel(grid_items);
        var car_grid=ITEMS_YUN.CarPrice({
            load_type:'yes'
        });
        //选择车辆信息
        var car_win=Ext.create('Ext.window.Window', {
            title: '车辆规则选择',
            autoHeight:true,
            closeAction : 'hide',
            layout : 'border',
            resizable:false,
            fixed:true,
            modal:true,
            height: 500,
            width: 1000,
            items:car_grid,
            buttons:[
                {text:'确认选择',handler:car_grid_fn},
                {text:'关闭', handler:function () {
                    car_win.hide();
                }}
            ]
        });


        //有无导游证，包不包含门票
        function click(){
            var comm=Ext.getCmp("Common_id");
            var pop=items_cost_grid.pop
            if(pop.guide<=0)return true;
            if(comm.getValue()==true){
                //选择有证，全陪不包含景区门票
                items_cost_store.each(function(v){
                    var row= v.data;
                    if(row.ti_type_new=='景区'){
                        var guide_num=parseFloat(row.ti_num)-parseFloat(pop.guide);
                        v.set('ti_num',guide_num);
                        v.set('ti_all_money',parseFloat(row.ti_trade_price)*guide_num);
                    }
                });
            }else{
                //选择无证,全陪包含景区门票
                items_cost_store.each(function(v){
                    var row= v.data;
                    if(row.ti_type_new=='景区'){
                        var guide_num=row.ti_num+pop.guide;
                        v.set('ti_num',guide_num);
                        v.set('ti_all_money',parseFloat(row.ti_trade_price)*guide_num);
                        /*row.ti_num=guide_num;
                        row.ti_all_money=parseFloat(row.ti_trade_price)*guide_num;*/
                    }
                });
            }
        };
        //儿童包不包含门票
        function children_click(){
            var comm=Ext.getCmp("small_id");
            var pop=items_cost_grid.pop
            if(pop.small<=0)return true;
        }


        car_win.on({
            show:function(){
                //根据人数、团队级等筛选、日期时间
                var where={};
                if(items_cost_grid.car_store){
                    var where=items_cost_grid.car_store(car_grid);
                    //日期时间
                    //开始
                    where.cap_start_date=items_cost_grid.ticket_date.start_date;
                    //结束
                    where.cap_end_date=items_cost_grid.ticket_date.end_date;
                    car_grid.where=where;
                }
                SUNLINE.baseParams(car_grid.store,where);
                car_grid.store.load();
            }
        });

        //确认选择车辆规则
        function car_grid_fn(t){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要使用的车辆规则！');
                return false;
            }
            var cap_money=row.get('cap_money')?parseFloat(row.get('cap_money')):0;
            var cap_num=parseFloat(row.get('cap_num'));
            if(cap_num==0)cap_num=1;
            var itmes_row=SUNLINE.getSelected(items_cost_grid);
            itmes_row.set('ti_insti_name', row.get('cap_name'));
            itmes_row.set('ti_cs_type_name', row.get('cap_type'));
            itmes_row.set('ti_remark', row.get('cap_remark'));

            if(opt.reckon_type=='ti_all_money'){
                //团队业务中 车辆人数=成人+儿童
                var pop=items_cost_grid.pop;
                cap_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            itmes_row.set('ti_all_money', cap_money);
            itmes_row.set('ti_num', cap_num);
            var trade_price=Math.round(cap_money/cap_num).toFixed(2);
            itmes_row.set('ti_trade_price', trade_price);
            itmes_row.set('ti_sense_price', trade_price);
            car_win.hide();
        }

        //点击事件操作,操作车辆信息
        insti_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='车辆'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过车辆规则选择?',function(y){
                        if(y=='yes'){
                            car_win.show();
                        }
                    })
                }
            }
        });

        //加载资源信息
        insti_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var insti_name_box_store=insti_name_box.store;
                SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
                insti_name_box_store.load();

            }
        });
        //选择资源信息
        insti_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                row.set('ti_name_id', r.get('id'));
                row.set('ti_cs_type_name', '');
                //联系人信息赋值
                if(r.get('rc_name')){
                    row.set('ti_man',r.get('rc_name'));
                }else{
                    row.set('ti_man','');
                }
                if(r.get('rc_mobile')){
                    row.set('ti_man_tel',r.get('rc_mobile'));
                }else{
                    row.set('ti_man_tel','');
                }
                /*row.set('ti_man_tel', r.get('rc_mobile'));
                row.set('ti_man', r.get('rc_name'));*/
                row.set('sp_one_price', r.get('sp_one_price'));
                row.set('sp_pct_num', r.get('sp_pct_num'));
                row.set('sp_id', r.get('id'));
            }
        });

        //加载资源项目信息
        cs_type_name_box.on({
            focus:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_box.store;
                var sc_id=row.get('ti_name_id');
                if(!sc_id)sc_id=row.get('sc_id');
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:sc_id,start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        //选择资源项目信息
        cs_type_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                var ti_num=row.get('ti_num');
                var price= parseFloat(r.get('price'));
                var sct_type='成人票';
                //选择项目后金额改变
                if(row.get('ti_type_new')=='购物店'){
                    var ti_remark='';
                    if(r.get('sp_one_price'))ti_remark=r.get('sp_one_price')+'/人';
                    if(r.get('sp_pct_num'))ti_remark=ti_remark?(ti_remark+'+'+r.get('sp_pct_num')+'%'):r.get('sp_pct_num')+'%';
                    if(r.get('sp_remark'))ti_remark=ti_remark?(ti_remark+' 说明:'+r.get('sp_remark')):r.get('sp_remark');
                    row.set('ti_insti_type', '签单');
                    row.set('ti_remark', ti_remark);
                    if(r.get('sp_one_price')){
                        price=0-parseFloat(r.get('sp_one_price'));
                        row.set('ti_trade_price', price.toFixed(2));
                        row.set('ti_sense_price', price.toFixed(2));
                        row.set('ti_num',ti_num);
                        row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                    }
                }else{
                    if(row.get('ti_type_new')=='景区')sct_type= r.get('t_type');
                    row.set('ti_insti_type', r.get('pay_type'));
                    row.set('ti_num',ti_num);
                    row.set('ti_remark', r.get('remark'));
                    row.set('ti_sense_price', price.toFixed(2));
                    if(row.get('ti_type_new')=='住宿'){
                        if(opt.team_line==true){
                            console.log([price,row.get('ti_profit'),row.get('ti_days_num')])
                            price=(price+row.get('ti_profit'))*row.get('ti_days_num')/2;//(成本单价+毛利)*天数/2
                        }else{
                            price=price/2;
                        }
                    }
                    row.set('ti_trade_price', price.toFixed(2));
                    row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                }
                row.set('ti_cs_id', r.get('id'));
                row.set('ti_sct_type', sct_type);
            }
        });


        //操作结算总额
        function ti_settle_money(t,nv,ov,o){
            //操作总额同步操作单价
            var row=SUNLINE.getSelected(items_cost_grid);
            //按人计算是单价=总金额*数量
            var price=(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
            var ti_sense_price=0;
            if(!nv)nv=0;
            if(row.get('ti_type_mode')=='按团计算'){
                //按团计算是单价=总金额/数量
                price=parseFloat(nv).toFixed(2);
            }

            //毛利:有按团计算、按人计算、按房间计算
            var profit=price-parseFloat(row.get('ti_sense_price'));
            if(!profit)profit=0;
            if(row.get('ti_type_new')=='住宿'){
                profit=(price/row.get('ti_days_num'))*2-parseFloat(row.get('ti_sense_price'));
            }else if(row.get('ti_type_new')=='车辆'){
                row.set('ti_sense_price',round_format(price));
                //profit=profit*parseFloat(row.get('ti_num'));
                profit=0;
            }else if(row.get('ti_type_new')=='导游'){
                profit=0;
                row.set('ti_sense_price',round_format(price));
            }
            row.set('ti_trade_price',round_format(price));
            row.set('ti_profit',round_format(profit));
        };

        //按团切换事件
        function ti_type_mode(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(nv=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
            }else{
                var price=Math.round(parseFloat(row.get('ti_all_money'))/parseFloat(row.get('ti_num'))).toFixed(2);
                row.set('ti_trade_price',round_format(price));
            }
        }

        //操作数量时，操作结算总额和结算单价
        function ti_settle_num(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=0;
            if(!nv)nv=0;
            if(row.get('ti_type_mode')=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
                return false;
            }
            if(opt.reckon_type=='ti_trade_price'){
                if(row.get('ti_type_new')=='住宿'){
                    //如果是住宿计算总额
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }else{
                    //如果是其他计算单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }
            }else{
                if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                    //如果是车辆与导游计算修改单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }else{
                    //其他计算总价
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }
            }
        }

        //操作毛利时,操作结算单价
        function ti_profit_even(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(!nv)nv=0;
            //单价=(成本单价+毛利)
            var trade_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv);
            if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                //单价=成本单价+(毛利/数量)
                trade_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv)/parseFloat(row.get('ti_num'));
                //总价=原总价-原毛利+现毛利
                var money=parseFloat(row.get('ti_all_money'))-parseFloat(ov)+parseFloat(nv);
                row.set('ti_all_money',round_format(money));
                //单价
                var find_price=(money/parseFloat(row.get('ti_num')));
                if(row.get('ti_type_mode')=='按团计算')price=parseFloat(money);
                row.set('ti_trade_price',round_format(find_price));
                return false;
            }else if(row.get('ti_type_new')=='住宿'){
                //单价=(成本单价+毛利)*天数/2
                trade_price=(parseFloat(row.get('ti_sense_price'))+parseFloat(nv))*row.get('ti_days_num')/2;
            }
            trade_price=round_format(trade_price);
            row.set('ti_trade_price',trade_price);
            //总金额
            var price=(trade_price*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(trade_price);
            row.set('ti_all_money',round_format(price));
        }

        //操作单价时,操作结算总额
        function ti_settle_price(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(nv);
            row.set('ti_all_money',round_format(price));
            if(opt.team_line!=true)return false;
            //成本价=(单价-毛利)
            var sense_price=parseFloat(nv)+parseFloat(row.get('ti_profit'));
            if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                //成本价=单价-(毛利/数量)
                sense_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv)/parseFloat(row.get('ti_num'));
            }else if(row.get('ti_type_new')=='住宿'){
                //成本价=(成本单价+毛利)*天数/2
                sense_price=(parseFloat(row.get('ti_sense_price'))+parseFloat(nv))*row.get('ti_days_num')/2;
            }else{
                row.set('ti_profit',0);
                row.set('ti_sense_price',nv);
            }
        }

        //双击删除项目
        //tpl_diao=true;   //false有权限  true没权限
        //tpl_car=false;
        items_cost_grid.on({
            celldblclick:function(t, td, c, r, tr, ri, e, opt){
                if(c==2){
                    var _row=SUNLINE.getSelected(items_cost_grid);
                    items_cost_store.remove(_row);
                }
            },
            'beforeedit':function(a,b,c){
                if(b.record.data.ti_type_new=='车辆'){
                    if(tpl_car==true && tpl_diao==true){
                        return false;   // false不可修改  true可修改
                    }else{
                        return true;
                    }
                }else{
                    if(tpl_diao==true){
                        return false;   //不可修改
                    }else{
                        return true;   //可修改
                    }
                }
            }

        });
        items_cost_store.on({
            update:function(){
                items_total_money();
            },
            datachanged:function(){
                items_total_money();
            }
        });


        //计算最终金额
        function items_total_money(){
            var total_money= 0,items_num={},money= 0,items_type={};
            items_cost_store.each(function(v){
                var row= v.data;
                items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
                if(opt.reckon_type=='ti_trade_price'){
                    //1.根据结算单价计算
                    money=parseFloat(row.ti_trade_price);
                    if(row.ti_type_new=='住宿'){
                        money=parseFloat(row.ti_all_money);
                    }
                    total_money+=money;
                }else{
                    //2.根据结算总额计算
                    money=parseFloat(row.ti_all_money);
                    total_money+=money;
                }
                items_type[row.ti_insti_type]=items_type[row.ti_insti_type]?(items_type[row.ti_insti_type]+parseFloat(row.ti_all_money)):parseFloat(row.ti_all_money);
            });
            Ext.each(opt.items_list,function(v,i){
                if(items_num[v.text]>0){
                    Ext.getCmp(v.id).setText(v.text+'(<font style="color:red;font-size:12px">'+items_num[v.text]+'</font>)');
                }else{
                    Ext.getCmp(v.id).setText(v.text);
                }
            });
            if(obj)obj(total_money,items_cost_store,items_type);
            items_cost_grid.total_money=total_money;

            if(opt.team_plan==true){
                if(opt.team_guide!=true){
                    //计算面签，现金，预付的明细
                    var text_money='实时统计信息：';
                    for(var itv in items_type){
                        text_money+=itv+'金额：<b>￥'+parseFloat(items_type[itv]).toFixed(2)+'</b>元;';
                    }
                    text_money+='总金额为:<b>￥'+parseFloat(total_money).toFixed(2)+'</b>元';
                    Ext.getCmp('total_info').setText(text_money);
                    //Ext.getCmp('team_total_fee').setValue(parseFloat(items_type['现金']).toFixed(2));
                }
            }
        }

        //分组操作
        function setGroup(b){
            var g = Ext.getCmp('_group_by');
            g.setText(b.text);
            items_cost_store.group(b.field);
            g.field = b.field;
        };

        //添加项目
        function tbar_items(v){
            var v_text= v.text;
            if(v_text.indexOf('(')>0){
                v_text= v_text.split('(');
                v.text=v_text[0];
            }
            if(v.text=='车辆'){
                var type='按人计算';
                var day_new='-1';
                var name='北京中型车'
                var type_name='中型大巴'
            }else if(v.text=='导游'){
                var type='按人计算';
                var day_new='-1';
                var name='地接导游'
                var type_name='地接导游'
            }else if(v.text=='住宿'){
                var type='按人计算';
                var day_new='-1';
                var name=''
                var type_name=''
            }else{
                var type='按人计算';
                var day_new=1;
                var name=''
                var type_name=''
            }
            var pop_num=1;
            if(items_cost_grid.pop_num)pop_num=items_cost_grid.pop_num;
            //车辆公式计算=成人数量+儿童数量
            var pop=items_cost_grid.pop;
            if(v.text=='车辆' && typeof items_cost_grid.pop=='object'){
                pop_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            if(v.text=='景区' && opt.team_line==true){
                if(Ext.getCmp("Common_id")!=true){
                    pop_num+=parseFloat(pop.guide);
                }
            }

            var items_data={
                ti_insti_name:name,
                ti_cs_type_name:type_name,
                ti_type_new: v.text,
                ti_type_mode:type,
                ti_insti_type:'现金',
                ti_sct_type:'成人票',
                ti_day:day_new,
                ti_all_money:'0',
                ti_num:pop_num,
                ti_trade_price:'0',
                ti_remark:'',
                ti_profit:0,
                ti_days_num:1,
                ti_sense_price:0
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            items_cost_store.add(items_data);
        }

        //删除成本项目
        function items_cost_del(){
            var _row=SUNLINE.getSelected(items_cost_grid);
            if (!_row){
                Ext.Msg.alert('友情提示', '请选择您想要删除的该成本项目。');
                return;
            };
            items_cost_store.remove(_row);
        }
        return items_cost_grid;
    },


    ItemsList2:function(opt,obj,sct_type_select){
        //计算方式
        var items_cost_store=opt.store;
        if(opt.shop_type==true){     //导游报账的购物店
            shop_type=true;
        }else{
            shop_type=false;
        }
        function EmptyItemsStore(data){
            if(!data.type_new || !data.insti_name) return false;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票'//票种类型,
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_arr=[],items_remove=[];
            items_cost_store.each(function(v){
                var row= v.data;
                items_arr.push(row.ti_type_new);
            });
            if(in_array(data.type_new,items_arr)==-1){
                items_cost_store.add(items_data);
            }
            return items_data;
        }
        var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
            collapsible:false,
            groupHeaderTpl:['','<div><span class="items-group-cls">{rows:this.values_rows}</span>{name:this.format_keyword} (共 {[values.rows.length]} 项成本)</div>',{
                format_keyword:function(name){
                    if(name=="-1"){
                        return '按团计费';
                    }else if(name=="-2"){
                        return '分公司报价';
                    }else{
                        if(parseFloat(name)>0) name='第'+name+'天';
                        return name;
                    }
                },
                values_rows:function(row){
                    if(row.length>0){
                        var items_type={},money= 0,money_total=0;
                        Ext.each(row,function(v,i){
                            var rw=v.data;
                            money+=parseFloat(rw['ti_trade_price']);
                            money_total+=parseFloat(rw['ti_all_money']);
                        });
                    }
                    if(row[0].data.ti_type_new=='购物店'){
                        return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元]';
                    }else{
                        return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元] [单价小计:<font class="red-cls">￥'+money.toFixed(2)+'</font>元]';
                    }

                }
            }]
        });
        //表头标注
        //删除项目
        function items_del(){
            return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
        };
        //结算总额显示
        function all_money(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
                }else{
                    return '￥'+ parseFloat(v).toFixed(2)
                }
            }
        };

        //结算单价显示
        function trade_price_new(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                if(r.data.ti_type_new=='购物店'){
                    return '--';
                }else{
                    return '￥'+parseFloat(v).toFixed(2);
                }
            }else{
                console.log(r.data.ti_type_new)
                if(r.data.ti_type_new=='住宿'){
                    return '￥'+parseFloat(v).toFixed(2);
                }else{
                    return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
                }
            }
        };

        //天数显示
        function days_format(v,m){
            if(v<0)return '-';
            return '第'+v+'天';
        };

        //项目类型
        var ti_type_mode_box=SUNLINE.LocalComob({
            id:'ti_type_mode2',
            fields:['ti_type_mode'],
            data:[['按团计算'],['按人计算']],
            config:{
                id:"ti_type_mode_id2",
                listeners:{ change:ti_type_mode }
            }
        });

        //结算方式
        var si_settle_type_box=SUNLINE.LocalComob({
            id:'ti_insti_type2',
            fields:['ti_insti_type'],
            data:[['现金'],['签单']],
            config:{
                id:"ti_insti_type_id2"
            }
        });

        var _cof={
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        };
        //搜索项目数据
        var insti_name_box=SUNLINE.ComBoxPlus({
            id:'insti_name2',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:_cof
        });
        //搜索项目中内项目数据
        var cs_type_name_box=SUNLINE.ComBoxPlus({
            id:'cs_type_name2',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:_cof
        });

        //票种类型Box
        var sct_type_box=SUNLINE.LocalComob({
            id:'sct_type2',
            fields:['sct_type'],
            data:[['成人票'],['儿童票'],['婴儿票'],['全陪票']],
            config:{
                id:"sct_type_id2",
                listeners:{
                    select:sct_type_select
                }
            }
        });

        //处理状态
        var deal_status_box=SUNLINE.LocalComob({
            id:'ti_status_box2',
            fields:['ti_status_box'],
            data:[['未处理'],['处理中'],['已处理']],
            config:{
                value:'未处理'
            }
        });

        //消费项目表头
        var items_cost_cm;
        if(opt.no_update==true){
            items_cost_cm=[
                new Ext.grid.RowNumberer({width:30}),
                {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
                {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
                {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
                {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
                {header:"资源名称", dataIndex:"ti_insti_name", width:160},
                {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
                {header:"项目名称", dataIndex:"ti_cs_type_name", width:140},
                {header:"项目名称ID", dataIndex:"ti_cs_id", width:50,hidden:true},
                {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
                {header:"票种类型", dataIndex:"ti_sct_type", width:80,hidden:opt.type?false:true},
                {header:"计量方式", dataIndex:"ti_type_mode", width:80},
                {header:"结算方式", dataIndex:"ti_insti_type", width:70},
                {header:"第几天", dataIndex:"ti_day"},
                {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right'},
                {header:"数量", dataIndex:"ti_num", width:50,align:'center'},
                {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right'},
                {header:"备注", dataIndex:"ti_remark", width:150},
                {header:'签单号',dataIndex:'ti_sign',width:130,hidden:opt.team_plan?false:true},
                {header:'处理状态',dataIndex:'ti_deal_status',width:80,hidden:opt.team_plan?false:true,renderer:function(v){
                    if(!v)return '未处理';
                    return v;
                }},
                {header:'签单号',dataIndex:'ti_man_tel',width:130,hidden:true},
                {header:'联系人',dataIndex:'ti_man',width:150,hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                    if(!v && !r.get('ti_man')) return '';
                    if(!v)v='';
                    var tel=r.get('ti_man_tel');
                    if(!tel)tel='';
                    return v+'-'+ r.get('ti_man_tel');
                }}
            ];
        }else{
            items_cost_cm=[
                new Ext.grid.RowNumberer({width:30}),
                {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
                {header:"", dataIndex:"items_del", width:25,renderer:items_del},
                {header:"si_id2", dataIndex:"si_id2", width:100, hidden:true},
                {header:"利润百分比", dataIndex:"ti_pct_num", width:10, hidden:true},
                {header:"流水金额", dataIndex:"ti_liushui", width:10, hidden:true},
                {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
                {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
                {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
                {header:"资源名称", dataIndex:"ti_insti_name", width:160,editor:insti_name_box},
                {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
                {header:"项目名称", dataIndex:"ti_cs_type_name", width:140,editor:cs_type_name_box},
                {header:"项目名称ID", dataIndex:"ti_cs_id", width:50,hidden:true},
                {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
                {header:"票种类型", dataIndex:"ti_sct_type", width:80,hidden:opt.type?false:true,editor:sct_type_box},
                {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box},
                {header:"结算方式", dataIndex:"ti_insti_type", width:70,editor:si_settle_type_box},
                {header:"第几天", dataIndex:"ti_day",hidden:opt.type?true:false, width:80,renderer:days_format,
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_day_new2'
                    })
                },
                {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right',sortable:true,renderer:all_money,
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_all_money_new2',
                        listeners:{ change:ti_settle_money ,focus:all_money_s}
                    })
                },
                {header:"数量", dataIndex:"ti_num", width:50,align:'center',sortable:true,
                    editor:new Ext.form.NumberField({
                        minValue:1,selectOnFocus:true,id:'ti_num_new2',
                        listeners:{ change:ti_settle_num ,focus:all_money_s}
                    })
                },
                /*{header:"结算单价", dataIndex:"ti_sense_price",sortable:true,renderer:trade_price_new, width:85,align:'right',
                 editor:new Ext.form.NumberField({
                 selectOnFocus:true,id:'ti_sense_price2',
                 listeners:{ change:ti_settle_price }
                 })
                 },*/
                {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right',
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_trade_price_new2',
                        listeners:{ change:ti_settle_price ,focus:all_money_s}
                    })
                },
                /*{header:"毛利", dataIndex:"ti_profit",sortable:true,renderer:trade_price_new, width:70,align:'right',
                 editor:new Ext.form.NumberField({
                 selectOnFocus:true,id:'ti_profit2',
                 listeners:{ change:ti_settle_price }
                 })
                 },*/
                {header:"备注", dataIndex:"ti_remark", width:150,editor:new Ext.form.TextField({id:'ti_remark_new2'}),renderer:function(v){
                    if(!v)return '';
                    return '<font title="'+v+'" color="blue">'+v+'</font>';
                }},
                {header:'签单号',dataIndex:'ti_sign',width:130,editor:new Ext.form.TextField({id:'ti_sign2'}),hidden:opt.team_plan?false:true},
                {header:'处理状态',dataIndex:'ti_deal_status',width:80,editor:deal_status_box,hidden:true,renderer:function(v){
                    if(!v)return '未处理';
                    return v;
                }},
                {header:'联系人',dataIndex:'ti_man_tel',width:130,editor:new Ext.form.TextField({id:'ti_man_tel2'}),hidden:true},
                {header:'联系人',dataIndex:'ti_man',width:150,editor:new Ext.form.TextField({id:'ti_man2'}),hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                    if(!v && !r.get('ti_man')) return '';
                    if(!v)v='';
                    var tel=r.get('ti_man_tel');
                    if(!tel)tel='';
                    return v+'-'+ r.get('ti_man_tel');
                }}
            ];
        }
        function all_money_s(){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(row.get('ti_type_new')=='购物店'){
                Ext.MessageBox.confirm('友情提示','是否需要通过购物店规则选择?',function(y){
                    if(y=='yes'){
                        shop_items();
                    }
                })
            }
        }
        //点击事件操作
        cs_type_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='购物店'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过购物店规则选择?',function(y){
                        if(y=='yes'){
                            shop_items();
                        }
                    })
                }
            }
        });

        //组织tbar项目
        var items_data=[];
        Ext.each(opt.items_list,function(v,i){
            if(v.text=='购物店'){
                if(shop_type==true){
                    items_data[i]={
                        text: v.text,id: v.id,handler:shop_items
                    }
                }else{
                    items_data[i]={
                        text: v.text,id: v.id,handler:tbar_items
                    }
                }
            }else{
                items_data[i]={
                    text: v.text,id: v.id,handler:tbar_items
                }
            }

        });
        var spc_url = $__app__ + '/TeamBillItems/shop_select';
        var spc_field = [{name:"sp_id"}];
        var spc_store = new SUNLINE.JsonStore(spc_url, spc_field,false);
        var spc_cm =[
            new Ext.grid.RowNumberer(),
            {header:"id", dataIndex:"st_id", width:50,hidden:true},
            {header:"购物店名称", dataIndex:"st_name", width:150},
            {header:"适用省份", dataIndex:"sp_province", width:150,renderer:function(v){
                return "<span title='"+v+"'>"+v+"</span>"
            }},

            {header:"人数", dataIndex:"sp_num", width:100,align:'center',sortable:true,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'man_c',
                    listeners:{ change:sp_man_c }
                })},
            {header:"流水", dataIndex:"sp_liushui", width:100,align:'right',sortable:true,renderer:money,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'liushui',
                    listeners:{ change:sp_liushui}
                })
            },
            {header:"人头返利", dataIndex:"sp_one_price", width:100,align:'right',renderer:money},
            {header:"流水百分比", dataIndex:"sp_pct_num", width:100,align:'right',renderer:function(v){
                if(!v){
                    v='0'
                }else{
                    v=v+'%';
                }
                return v;
            }},
            {header:"总金额", dataIndex:"sp_money", width:120},
            {header:'第几天',dataIndex:'ti_day',width:80,editor:new Ext.form.TextField({id:'ti_day3'}),renderer:function(v,m,r){
                if(!v)v='1';
                return v;
            }},
            {header:'联系人',dataIndex:'rc_mobile',width:130,editor:new Ext.form.TextField({id:'ti_man_tel3'}),hidden:true},
            {header:'联系人',dataIndex:'rc_name',width:150,editor:new Ext.form.TextField({id:'ti_man3'}),renderer:function(v,m,r){
                if(!v && !r.get('rc_name')) return '';
                if(!v)v='';
                var tel=r.get('rc_mobile');
                if(!tel)tel='';
                return v+'-'+ r.get('rc_mobile');
            }},
            {header:"备注", dataIndex:"ti_remark", width:150,editor:new Ext.form.TextField({id:'ti_remark_new3'})}

        ];

        var Products_Shop=SUNLINE.OrgCombo_Shop({name:'st_name',id:'st_name_id',width:300,allowBlank:true,editable:true,forceSelection:true});
        var spc_grid = new Ext.grid.GridPanel({
            region:'center',
            border:false,
            columns:spc_cm,
            store:spc_store,
            loadMask:{msg:'数据载入中，请稍后'},
            viewConfig:{
                emptyText:'没有购物店信息',
                deferEmptyText:true
            },
            tbar:[
                '<b>购物店 : </b>',
                Products_Shop.box
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            bbar:new Ext.PagingToolbar({
                pageSize:pageSize,
                store:spc_store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有购物店信息'
            })
        });

        function sp_man_c(t,nv,ov,o){
            var row=SUNLINE.getSelected(spc_grid);
            var sp_money=0;
            if(row.data.sp_liushui){
                sp_money=row.data.sp_liushui;
            }
            var price=Math.round(parseFloat(nv)*parseFloat(row.get('sp_one_price'))+parseFloat(sp_money)*parseFloat(row.get('sp_pct_num'))*0.01).toFixed(2);
            row.set('sp_money',round_format(price));
        }
        function sp_liushui(t,nv,ov,o){
            var row=SUNLINE.getSelected(spc_grid);
            var sp_num=0;
            if(row.data.sp_num){
                sp_num=row.data.sp_num;
            }
            var price=Math.round(parseFloat(sp_num)*parseFloat(row.get('sp_one_price'))+parseFloat(nv)*parseFloat(row.get('sp_pct_num'))*0.01).toFixed(2);
            row.set('sp_money',round_format(price));
        }
        var pp_store=Products_Shop.box.getStore();
        Products_Shop.box.on({'select':function(c,r,n){
            SUNLINE.baseParams(spc_store,{st_id:r[0]['data']['st_id']});
            spc_store.currentPage=1;
            spc_store.load();
        }});
        var cs_type_name_form=SUNLINE.ComBoxPlus({
            id:'cs_type_name_form',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:{
                displayField:'text',
                valueField:'text',
                width:230,
                allowBlank:false,
                listWidth:250,
                editable:true,
                forceSelection:false,
                pageSize:20,
                fieldLabel:"<span style='color:red'> * </span>项目名称",
                labelWidth:80,
                labelAlign:"right",
                name:"ti_cs_type_name"
            }
        });
        var insti_name_box_form=SUNLINE.ComBoxPlus({
            id:'insti_name_form',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:{
                displayField:'text',
                valueField:'text',
                width:230,
                allowBlank:false,
                listWidth:250,
                editable:true,
                forceSelection:false,
                pageSize:20,
                fieldLabel:"<span style='color:red'> * </span>资源名称",
                labelWidth:80,
                labelAlign:"right",
                name:"ti_insti_name",
                listConfig:{minWidth:320}
            }
        });
        var store_form = new Ext.form.FormPanel({
            border:false,
            bodyStyle:'background:none;padding:10px',
            defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
            items:[
                {name:"ti_id", fieldLabel:"ti_id",hidden:true},
                {name:"ti_sort", fieldLabel:"ti_sort",hidden:true},
                {name:"ti_product_id", fieldLabel:"ti_product_id",hidden:true},
                {name:"ti_ticket_id", fieldLabel:"ti_ticket_id",hidden:true},
                {name:"ti_name_id", fieldLabel:"ti_name_id",hidden:true,id:"form_name_id"},
                {name:"ti_cs_id", fieldLabel:"ti_cs_id",hidden:true},
                insti_name_box_form,
                cs_type_name_form,
                {fieldLabel:"项目类型", name:"ti_type_new",id:'form_type_new',value:"购物店",hidden:true},
                //{fieldLabel:"计量方式", name:"ti_type_mode",id:'form_type_mode'},
                {id:"form_type_mode", name:"ti_type_mode",hidden:true,fieldLabel:"计量方式", xtype:"combo", triggerAction : "all",
                    store:new Ext.data.SimpleStore({fields:['ti_type_mode'], data:[
                        ['按人计算'],
                        ['按团计算']
                    ]}),
                    displayField:"ti_type_mode",
                    valueField:"ti_type_mode",
                    mode:"local",
                    value:"按人计算",
                    forceSelection : true,
                    typeAhead : true,
                    allowBlank:false,
                    width:230
                },
                {id:"form_insti_type", name:"ti_insti_type",fieldLabel:"结算方式", xtype:"combo", triggerAction : "all",
                    store:new Ext.data.SimpleStore({fields:['ti_insti_type'], data:[
                        ['现金'],
                        ['签单']
                    ]}),
                    displayField:"ti_insti_type",
                    valueField:"ti_insti_type",
                    mode:"local",
                    value:"签单",
                    forceSelection : true,
                    typeAhead : true,
                    allowBlank:false,
                    width:230
                },
                {fieldLabel:"第几天", name:"ti_day",id:'form_day',hidden:true, xtype:'numberfield',value:1},
                {fieldLabel:"<span style='color:red'> * </span>数量", name:"ti_num",id:'form_num', xtype:'numberfield',value:0},
                {fieldLabel:"<span style='color:red'> * </span>流水金额", name:"ti_liushui",id:'form_liushui', xtype:'numberfield',value:0},
                {fieldLabel:"结算单价", name:"ti_trade_price",id:'form_trade_price',readOnly:true},
                {fieldLabel:"利润百分比", name:"ti_pct_num",id:'form_pct_num',readOnly:true},
                {fieldLabel:"总金额", name:"ti_all_money",id:'form_all_money',readOnly:true,value:0},
                {fieldLabel:"签单号", name:"ti_sign",id:'form_sign'},
                {fieldLabel:"处理状态", name:"ti_deal_status",id:'form_deal_status',hidden:true},
                {id:"form_deal_status", name:"ti_deal_status",hidden:true, fieldLabel:"计量方式", xtype:"combo", triggerAction : "all",
                    store:new Ext.data.SimpleStore({fields:['ti_deal_status'], data:[
                        ['未处理'],
                        ['处理中'],
                        ['已处理']
                    ]}),
                    displayField:"ti_deal_status",
                    valueField:"ti_deal_status",
                    mode:"local",
                    value:"已处理",
                    forceSelection : true,
                    typeAhead : true,
                    allowBlank:false,
                    width:230
                },
                {fieldLabel:"联系人", name:"ti_man",id:'form_man'},
                {fieldLabel:"联系方式", name:"ti_man_tel",id:'form_man_tel'},
                {xtype:'textarea',id:'form_remark',name:"ti_remark", fieldLabel:"备注",labelWidth:80,labelAlign:"right"}
            ]
        });
        insti_name_box_form.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                Ext.getCmp('form_man_tel').setValue(r.data.rc_mobile)
                Ext.getCmp('form_man').setValue(r.data.rc_name)
                Ext.getCmp('form_name_id').setValue(r.data.id)
            }
        });
        insti_name_box_form.on({beforequery:function( c, r, i, e ){
                var insti_name_box_store=insti_name_box_form.store;
                SUNLINE.baseParams(insti_name_box_store,{type:'购物店'});
                insti_name_box_store.load();
            }});
        //加载资源项目信息
        cs_type_name_form.on({
            beforequery:function( c, r, i, e ){
                var name_id=Ext.getCmp('form_name_id').getValue()
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_form.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:'购物店',at_id:name_id,start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        Ext.getCmp('form_liushui').on('change',function(a,nv,c){
            var form_num=Ext.getCmp('form_num').getValue();
            if(!form_num)form_num=0;
            var form_trade_price=Ext.getCmp('form_trade_price').getValue();
            if(!form_trade_price)form_num=0;
            var form_pct_num=Ext.getCmp('form_pct_num').getValue();
            if(!form_pct_num)form_num=0;
            var price=Math.round(parseFloat(form_num)*parseFloat(form_trade_price)+parseFloat(nv)*parseFloat(form_pct_num)*0.01).toFixed(2);
            Ext.getCmp('form_all_money').setValue(price);
        })
        Ext.getCmp('form_num').on('change',function(a,nv){
            var form_liushui=Ext.getCmp('form_liushui').getValue();
            var form_trade_price=Ext.getCmp('form_trade_price').getValue();
            var form_pct_num=Ext.getCmp('form_pct_num').getValue();
            if(!form_liushui)form_liushui=0;
            if(!form_trade_price)form_trade_price=0;
            if(!form_pct_num)form_pct_num=0;
            var price=Math.round(parseFloat(nv)*parseFloat(form_trade_price)+parseFloat(form_liushui)*parseFloat(form_pct_num)*0.01).toFixed(2);
            Ext.getCmp('form_all_money').setValue(price);
        })
        cs_type_name_form.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                Ext.getCmp('form_pct_num').setValue(r.data.sp_pct_num);
                Ext.getCmp('form_trade_price').setValue(r.data.sp_one_price);

                var form_num=Ext.getCmp('form_num').getValue();
                var form_liushui=Ext.getCmp('form_liushui').getValue();
                var form_trade_price=Ext.getCmp('form_trade_price').getValue();
                var form_pct_num=Ext.getCmp('form_pct_num').getValue();
                if(!form_num)form_num=0;
                if(!form_liushui)form_liushui=0;
                if(!form_trade_price)form_trade_price=0;
                if(!form_pct_num)form_pct_num=0;
                var price=Math.round(parseFloat(form_num)*parseFloat(form_trade_price)+parseFloat(form_liushui)*parseFloat(form_pct_num)*0.01).toFixed(2);
                Ext.getCmp('form_all_money').setValue(price);
            }
        });


        var shop_win=Ext.create('Ext.window.Window', {
            title: '购物店选择',
            autoHeight:true,
            closeAction:'hide',
            modal:true,
            width:380,
            items:store_form,
            buttons:[
                {text:'确认选择',handler:shop_dosave},
                {text:'关闭', handler:function () {
                    shop_win.hide();
                }}
            ]
        });
        function shop_dosave(){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(row) items_cost_store.remove(row);
            var data= store_form.getForm().getValues();
            items_cost_store.add(data);
            shop_win.hide();
            Ext.Msg.alert('友情提示', '购物店规则添加成功');
        }
        function shop_items(){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(row){
                store_form.form.setValues(row.data);
            }
            shop_win.show();
        }
        shop_win.on('hide',function(){
            store_form.form.reset();
        })
        if(opt.no_update==true){

        }else{
            items_data=items_data.concat([
                /*'-',{text:'删除项目', id:'_del_item', iconCls:'button-del',handler:items_cost_del},*/
                '->',
                {text:'按项目类型分组',id:'_group_by2',iconCls:"searchico",field:'ti_type_new',handler:setGroup,
                    menu:{
                        items :[
                            {text:'按天分组',field:'ti_day',handler:setGroup,xtype:opt.type?'hidden':''},
                            {text:'按项目类型分组',field:'ti_type_new',handler:setGroup},
                            {text:'按结算方式',field:'ti_insti_type',handler:setGroup,xtype:opt.type?'hidden':''}
                        ]
                    }
                }
            ]);
        }

        var grid_items={
            region:'center',
            loadMask: {msg : '数据传输中，请稍候...'},
            store: items_cost_store,
            columns: items_cost_cm,
            autoHeight : true,
            features: [items_cost_group],
            autoScroll : true,
            modal : true,
            closeAction : 'hide',
            cls : 'suntour_dataView',
            layout : 'fit',
            minWidth:500,
            minHeight:500,
            maxHeight:Ext.getBody().getHeight()-200,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            tbar:items_data
        };

        if(opt.team_plan==true){
            if(opt.team_guide!=true){
                grid_items.bbar=[
                    '<b>其他事项：</b>','->',
                    '备用金领款：',
                    {xtype:'numberfield', id:'team_total_fee2', name:'team_total_fee'}
                ];
                grid_items.buttons=[
                    '->',
                    {xtype : 'tbtext', id:'total_info2', text:'&nbsp;' }
                ];
            }

        };

        //画出表格
        var items_cost_grid=new Ext.grid.GridPanel(grid_items);
        var car_grid=ITEMS_YUN.CarPrice({
            load_type:'yes'
        });
        //选择车辆信息
        var car_win=Ext.create('Ext.window.Window', {
            title: '车辆规则选择',
            autoHeight:true,
            closeAction : 'hide',
            layout : 'border',
            resizable:false,
            fixed:true,
            modal:true,
            height: 500,
            width: 1000,
            items:car_grid,
            buttons:[
                {text:'确认选择',handler:car_grid_fn},
                {text:'关闭', handler:function () {
                    car_win.hide();
                }}
            ]
        });
        car_win.on({
            show:function(){
                //根据人数、团队级等筛选、日期时间
                var where={};
                if(items_cost_grid.car_store){
                    var where=items_cost_grid.car_store(car_grid);
                    //日期时间
                    //开始
                    where.cap_start_date=items_cost_grid.ticket_date.start_date;
                    //结束
                    where.cap_end_date=items_cost_grid.ticket_date.end_date;
                    car_grid.where=where;
                }
                SUNLINE.baseParams(car_grid.store,where);
                car_grid.store.load();
            }
        });

        //确认选择车辆规则
        function car_grid_fn(t){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要使用的车辆规则！');
                return false;
            }
            var cap_money=row.get('cap_money')?parseFloat(row.get('cap_money')):0;
            var cap_num=parseFloat(row.get('cap_num'));
            if(cap_num==0)cap_num=1;
            var itmes_row=SUNLINE.getSelected(items_cost_grid);
            itmes_row.set('ti_insti_name', row.get('cap_name'));
            itmes_row.set('ti_cs_type_name', row.get('cap_type'));
            itmes_row.set('ti_remark', row.get('cap_remark'));

            if(opt.reckon_type=='ti_all_money'){
                //团队业务中 车辆人数=成人+儿童
                var pop=items_cost_grid.pop;
                cap_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            itmes_row.set('ti_all_money', cap_money);
            itmes_row.set('ti_num', cap_num);
            itmes_row.set('ti_trade_price', Math.round(cap_money/cap_num).toFixed(2));
            car_win.hide();
        }

        //点击事件操作,操作车辆信息
        insti_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='车辆'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过车辆规则选择?',function(y){
                        if(y=='yes'){
                            car_win.show();
                        }
                    })
                }else if(row.get('ti_type_new')=='购物店'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过购物店规则选择?',function(y){
                        if(y=='yes'){
                            shop_items();
                        }
                    })
                }
            }
        });

        //加载资源信息
        insti_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var insti_name_box_store=insti_name_box.store;
                SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
                insti_name_box_store.load();

            }
        });
        //选择资源信息
        insti_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                row.set('ti_name_id', r.get('id'));
                row.set('ti_cs_type_name', '');
                //联系人信息赋值
                row.set('ti_man_tel', r.get('rc_mobile'));
                row.set('ti_man_name', r.get('rc_name'));
            }
        });

        //加载资源项目信息
        cs_type_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_box.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        //选择资源项目信息
        cs_type_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                var ti_num=row.get('ti_num');
                var price= parseFloat(r.get('price'));
                var sct_type='成人票';
                //选择项目后金额改变
                if(row.get('ti_type_new')=='购物店'){
                    var ti_remark='';
                    if(r.get('sp_one_price'))ti_remark=r.get('sp_one_price')+'/人';
                    if(r.get('sp_pct_num'))ti_remark=ti_remark?(ti_remark+'+'+r.get('sp_pct_num')+'%'):r.get('sp_pct_num')+'%';
                    if(r.get('sp_remark'))ti_remark=ti_remark?(ti_remark+' 说明:'+r.get('sp_remark')):r.get('sp_remark');
                    row.set('ti_insti_type', '签单');
                    row.set('ti_remark', ti_remark);
                }else{
                    if(row.get('ti_type_new')=='住宿')price=price/2;
                    if(row.get('ti_type_new')=='景区')sct_type= r.get('t_type');
                    row.set('ti_insti_type', r.get('pay_type'));
                    row.set('ti_trade_price', price.toFixed(2));
                    row.set('ti_num',ti_num);
                    row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                    row.set('ti_remark', r.get('remark'));
                }
                row.set('ti_cs_id', r.get('id'));
                row.set('ti_sct_type', sct_type);
            }
        });


        //操作结算总额
        function ti_settle_money(t,nv,ov,o){
            //操作总额同步操作单价
            var row=SUNLINE.getSelected(items_cost_grid);
            //按人计算是单价=总金额*数量
            var price=Math.round(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算'){
                //按团计算是单价=总金额/数量
                price=parseFloat(nv).toFixed(2);
            }
            row.set('ti_trade_price',round_format(price));
        }

        //按团切换事件
        function ti_type_mode(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(nv=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
            }else{
                var price=Math.round(parseFloat(row.get('ti_all_money'))/parseFloat(row.get('ti_num'))).toFixed(2);
                row.set('ti_trade_price',round_format(price));
            }
        }

        //操作数量时，操作结算总额和结算单价
        function ti_settle_num(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=0;
            if(row.get('ti_type_mode')=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
                return false;
            }
            if(opt.reckon_type=='ti_trade_price'){
                if(row.get('ti_type_new')=='住宿'){
                    //如果是住宿计算总额
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }else{
                    //如果是其他计算单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }
            }else{
                if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                    //如果是车辆与导游计算修改单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }else{
                    //其他计算总价
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }
            }
        }

        //操作单价时,操作结算总额
        function ti_settle_price(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(nv);
            row.set('ti_all_money',round_format(price));
        }

        //双击删除项目
        items_cost_grid.on({
            celldblclick:function(t, td, c, r, tr, ri, e, opt){
                if(c==2){
                    var _row=SUNLINE.getSelected(items_cost_grid);
                    items_cost_store.remove(_row);
                }
            }
        });
        items_cost_store.on({
            update:function(){
                items_total_money();
            },
            datachanged:function(){
                items_total_money();
            }
        });


        //计算最终金额
        function items_total_money(){
            var total_money= 0,items_num={},money= 0,items_type={};
            items_cost_store.each(function(v){
                var row= v.data;
                items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
                if(opt.reckon_type=='ti_trade_price'){
                    //1.根据结算单价计算
                    money=parseFloat(row.ti_trade_price);
                    if(row.ti_type_new=='住宿'){
                        money=parseFloat(row.ti_all_money);
                    }
                    total_money+=money;
                }else{
                    //2.根据结算总额计算
                    money=parseFloat(row.ti_all_money);
                    total_money+=money;
                }
                items_type[row.ti_insti_type]=items_type[row.ti_insti_type]?(items_type[row.ti_insti_type]+parseFloat(row.ti_all_money)):parseFloat(row.ti_all_money);
            });
            Ext.each(opt.items_list,function(v,i){
                if(items_num[v.text]>0){
                    Ext.getCmp(v.id).setText(v.text+'(<font style="color:red;font-size:12px">'+items_num[v.text]+'</font>)');
                }else{
                    Ext.getCmp(v.id).setText(v.text);
                }
            });
            if(obj)obj(total_money,items_cost_store,items_type);
            items_cost_grid.total_money=total_money;

            if(opt.team_plan==true){

            }
        }

        //分组操作
        function setGroup(b){
            var g = Ext.getCmp('_group_by2');
            g.setText(b.text);
            items_cost_store.group(b.field);
            g.field = b.field;
        };

        //添加项目
        function tbar_items(v){
            if(opt.no_update==true){

            }else{
                var v_text= v.text;
                if(v_text.indexOf('(')>0){
                    v_text= v_text.split('(');
                    v.text=v_text[0];
                }
                if(v.text=='车辆'){
                    var type='按团计算';
                    var day_new='-1';
                    var name='北京中型车'
                    var type_name='中型大巴'
                }else if(v.text=='导游'){
                    var type='按团计算';
                    var day_new='-1';
                    var name='北京地接导游'
                    var type_name='北京地接优秀导游'
                }else if(v.text=='住宿'){
                    var type='按团计算';
                    var day_new='-1';
                    var name=''
                    var type_name=''
                }else{
                    var type='按人计算';
                    var day_new=1;
                    var name=''
                    var type_name=''
                }
                var pop_num=1;
                if(items_cost_grid.pop_num)pop_num=items_cost_grid.pop_num;
                //车辆公式计算=成人数量+儿童数量
                if(v.text=='车辆' && typeof items_cost_grid.pop=='object'){
                    var pop=items_cost_grid.pop;
                    pop_num=parseFloat(pop.big)+parseFloat(pop.small);
                }

                var items_data={
                    ti_insti_name:name,
                    ti_cs_type_name:type_name,
                    ti_type_new: v.text,
                    ti_type_mode:type,
                    ti_insti_type:'现金',
                    ti_sct_type:'成人票',
                    ti_day:day_new,
                    ti_all_money:'0',
                    ti_num:pop_num,
                    ti_trade_price:'0',
                    ti_remark:''
                };
                items_data.ti_sort=sort_fn(items_data.ti_type_new);
                items_cost_store.add(items_data);
            }

        }

        //删除成本项目
        function items_cost_del(){
            var _row=SUNLINE.getSelected(items_cost_grid);
            if (!_row){
                Ext.Msg.alert('友情提示', '请选择您想要删除的该成本项目。');
                return;
            };
            items_cost_store.remove(_row);
        }
        return items_cost_grid;
    },
    //游客批量导入
    BatchUserData:function(opt,obj){
        var batchStore=Ext.create('Ext.data.Store', {
            storeId: 'batchStore',
            fields:[],data: []
        });
        //提交表单
        var batchForm = Ext.create('Ext.form.Panel',{
            bodyPadding: 5,
            autoScroll:true,
            width: "100%",
            defaults:{
                labelWidth:0,
                width:680,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:[
                {xtype : 'tbtext', text:'<div style="font-size: 12px;padding: 5px 10px;">* 多个游客请换行，名称与证件号用空格隔开。输入信息必需小于等于游客数。<font color="red">游客类型请安顺序排好!</font>' +
                '<br ><font style="color:#999;font-size:12px">(例:小明 235221199301012211 13585417441)</font></div>' },
                {id:'batch_users',name:'batch_users',xtype:'textarea',height:305},
                {xtype:'tbtext',id:'total_info'}
            ]
        });
        var batchWin = new Ext.Window({
            title : '批量导入游客信息',
            width : 700,
            height : 460,
            modal : true,
            fixed:true,
            closeAction : 'hide',
            items:batchForm,
            buttons:[
                {text:'确认导入',handler:batch_save},
                {text:'关闭', handler:function () {
                    batchWin.hide();
                }}
            ]
        });
        //展现导入的数据,可编辑修改
        //处理状态
        var card_type_box=SUNLINE.LocalComob({
            id:'vip_card_type_box',
            fields:['vip_card_type_box'],
            data:[['身份证'],['护照'],['其他']],
            config:{
                value:'身份证'
            }
        });

        var user_data=[{'id':0,'t_name':'成人票'},{'id':1,'t_name':'儿童票'},{'id':2,'t_name':'婴儿票'},{'id':3,'t_name':'全陪票'}];
        if(opt.type=='fit')user_data=[{'id':0,'t_name':'成人票'},{'id':1,'t_name':'儿童票'}];
        var t_name_box=SUNLINE.LocalComob({
            id:'t_name',
            fields:['id','t_name'],
            data:user_data,
            config:{
                value:'成人票'
            }
        });

        var batch_cm=[
            new Ext.grid.RowNumberer(),
            {header:"姓名", dataIndex:"vip_name", width:100,editor:new Ext.form.TextField()},
            {header:"证件类型", dataIndex:"vip_card_type", width:80,editor:card_type_box},
            {header:"证件号", dataIndex:"vip_card", width:180,editor:new Ext.form.TextField()},
            {header:"联系电话", dataIndex:"vip_mob", width:120,editor:new Ext.form.TextField()}
        ];
        var batch_grid=new Ext.grid.GridPanel({
            store:batchStore,
            columns:batch_cm,
            autoScroll:true,
            bodyBorder: false,
            height:370,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            }
        });
        var ExtWin = new Ext.Window({
            title : '确认批量导入信息',
            width : 700,
            height : 450,
            modal : true,
            fixed:true,
            closeAction : 'hide',
            items:batch_grid,
            buttons:[
                {text:'确认保存',handler:add_users},
                {text:'返回导入',handler:returned_save},
                {text:'关闭', handler:function () {
                    ExtWin.hide();
                }}
            ]
        });
        batchWin.on({
            show:function(){
                batch_users_len();
            }
        });
        Ext.getCmp('batch_users').on({
            change:function(){
                batch_users_len();
            }
        });

        var batch_pop=0;
        function batch_users_len(){
            var batch_users=Ext.getCmp('batch_users').getValue();
            var len=0;
            if(batch_users){
                batch_users=batch_users.replace(/\n/g,";");
                batch_users=batch_users.split(";");
                for(var ti=0;ti<batch_users.length;ti++){
                    if(batch_users[ti])len++
                }
            }
            batch_pop=len;
            Ext.getCmp('total_info').setText('<b>当前已输入:<font color="red">'+len+'</font>人;</b><b>游客数:<font color="blue">'+batch_grid.pop+'</font>人</b>');
        }

        //保存游客编辑
        function batch_save(){
            if(batch_pop>batch_grid.pop){
                Ext.Msg.alert('友情提示','输入游客大于游客数，请返回重新填写!');
                return false;
            }
            var _from=batchForm.getForm().getValues();
            var batch_users=_from.batch_users
            if(!batch_users){
                Ext.Msg.alert('友情提示','请输入游客信息');
                return false;
            }
            batch_users=batch_users.replace(/\n/g,";");
            batch_users=batch_users.split(";");
            var len=batch_users.length,user_data=[];
            batchStore.removeAll();
            for(var i=0;i<len;i++){
                var row=batch_users[i];
                if(!row)continue;
                row=row.replace(/\t/g,',');
                row=row.replace(/\s/g,',');
                row=row.split(',');
                if(row.length>0){
                    var user={
                        /*t_name:row[3]?row[3]:'成人票',*/
                        vip_name:row[0],
                        vip_card_type:'身份证',
                        vip_card:row[1],
                        vip_mob:row[2]
                    };
                    batchStore.add(user);
                }
            }
            batchWin.hide();
            ExtWin.show();
        }
        //返回导入游客项目
        function returned_save(){
            batchWin.show();
            ExtWin.hide();
        }
        //确定插入游客到游客表中
        function add_users(){
            var user_data=[];
            batchStore.each(function(bv){
                var row=bv.data;
                user_data.push(row);
            });
            if(obj)obj(user_data);
            ExtWin.hide();
        }
        return {batchWin:batchWin,batch_grid:batch_grid,ExtWin:ExtWin};
    },
    //条件多选择操作控件
    WhereMulti:function(opt){
        var trans_store = new SUNLINE.JsonStore($__app__+'/TransPlan/select_combox', [],false);
        var trans_cm=[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"id", width:80,hidden:true},
            {header:"名称", dataIndex:"text", width:300}
        ];
        var trans_grid=new Ext.grid.GridPanel({
            region:'center',
            store:trans_store,
            columns:trans_cm,
            autoScroll:true,
            selModel:{
                selType: 'checkboxmodel'
            },
            height:520,
            tbar:[
                '->',
                '快速搜索：',
                {
                    xtype:'trigger',
                    triggerCls : 'x-form-search-trigger',
                    id:'trans_Search',
                    cls:'search-icon-cls',
                    emptyText : '信息名称',
                    width:280,
                    onTriggerClick:function(e){
                        trans_search();
                    },
                    listeners :{
                        "specialkey" : function(_t, _e){
                            if(_e.keyCode==13)
                                trans_search();
                        }
                    }
                }
            ]
        });
        var trans_win = new Ext.Window({
            width : 400,
            height : 600,
            modal : true,
            fixed:true,
            closeAction : 'hide',
            items:trans_grid,
            buttons:[
                {text:'确认选择',handler:trans_vf_fn},
                {text:'关闭', handler:function () {
                    trans_win.hide();
                }}
            ]
        });
        function trans_search(){
            var keys=Ext.getCmp('trans_Search').getValue();
            SUNLINE.baseParams(trans_store,{skey:keys},true);
            trans_store.load();
        }
        var select_id='';
        var select_name='';
        var select_row=opt.select_data;
        for(var si=0;si<select_row.length;si++){
            Ext.getCmp(select_row[si]).on({
                focus:function(t,e,o){
                    trans_win.setTitle(t.text);
                    select_id= t.to_id;
                    select_name= t.id;
                    trans_win.show();
                    var post={type:t.text};
                    if(in_array(select_row[si],['start_site_id','end_site_id'])){
                        //判断是飞机还是火车
                        var plan_status_id=(opt.status_box).getValue();
                        post.fly_type=plan_status_id;
                    }
                    SUNLINE.baseParams(trans_store,post);
                    trans_store.load();
                }
            });
        }

        trans_store.on({
            load:function(){
                var row_id=Ext.getCmp(select_id).getValue();
                if(!row_id)return '';
                var i=0;
                row_id=row_id.split(',');
                this.each(function(v){
                    var rows= v.data;
                    if(in_array(rows['id'],row_id)!=-1){
                        trans_grid.getSelectionModel().select(i, true);
                    }
                    i++;
                })
            }
        });
        function trans_vf_fn(){
            var rows=trans_grid.getSelectionModel().getSelection();
            var sl_id=[];
            var sl_name=[];
            Ext.each(rows,function(v,i){
                var row= v.data;
                if(v.id && row.text!='全部')sl_id.push(row.id);
                sl_name.push(row.text);
            });
            Ext.getCmp(select_id).setValue(sl_id);
            Ext.getCmp(select_name).setValue(sl_name);
            trans_win.hide();
        }
    },
    TransBox:function(opt){
        var PlanInfo=[];
        //操作接送计划明细(start)
        var detail_url=$__app__+'/TransPlan/json_trans_detail';
        var detail_field=[];
        var detail_store = new SUNLINE.JsonStore(detail_url, detail_field,false);
        var detail_cm=[
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"ti_id",width:80,hidden:true},
            {header:"计划ID",dataIndex:"ti_tpid",width:80,hidden:true},
            {header:"车队名称",dataIndex:"ti_org_name",width:180},
            {header:"驾驶员名称",dataIndex:"ti_bus_name",width:150},
            {header:"结算类型",dataIndex:"ti_settle_type",width:80},
            {header:"数量",dataIndex:"ti_num",width:80},
            {header:"金额",dataIndex:"ti_money",width:80},
            {header:"备注",dataIndex:"ti_remark",width:150}
        ];
        var tp_detail_grid = Ext.create('Ext.grid.Panel',{
            region:'center',
            store:detail_store,
            columns:detail_cm,
            fixed:true,
            viewConfig:{emptyText:'没有符合你要查找的内容'},
            tbar:[
                {text:'添加接送计划',iconCls:'button-add',handler:detail_trans_plan, disabled:isDisabled('TransPlan::seat_arranged')},
                {text:'编辑接送计划',iconCls:'button-edit',handler:detail_trans_plan, disabled:isDisabled('TransPlan::seat_arranged')},
                {text:'删除接送计划',iconCls:'button-del',handler:detail_del, disabled:isDisabled('TransPlan::seat_arranged')}
            ]
        });
        var tp_detail_win=new Ext.Window({
            title:'接送计划明细',
            width:900,
            height:510,
            autoScroll : true,
            closeAction:'hide',
            layout : 'border',
            modal:true,
            resizable:true,
            maximizable : true,//全屏效果
            items:tp_detail_grid,
            buttons:[
                {text:'关闭', handler:function (){
                    tp_detail_win.hide();
                }}
            ]
        });
        tp_detail_win.on('hide',function(){
            if(opt.HideObj)opt.HideObj();
        });
        function detail_info(b){
            var rows=(opt.grid).getSelectionModel().getSelection();
            if(!rows[0]){
                Ext.Msg.alert('友情提示','请选择需要查看的【计划明细】!');
                return false;
            }
            var tp_id=[];
            Ext.each(rows,function(v,i){
                var rw= v.data;
                tp_id.push(rw.tp_id);
            });
            tp_detail_win.show();
            SUNLINE.baseParams(detail_store,{tp_id:Ext.encode(tp_id)});
            detail_store.load();
        }

        //接送计划添加、编辑(start)
        var DetailCarBox=SUNLINE.CompanyBox({
            where:{
                org_type:'车队公司'
            },
            config:{
                displayField:'text',
                valueField:'text',
                id:'ti_org_name',
                name:'ti_org_name',
                labelWidth:60,
                width:280,
                labelAlign:'right',
                fieldLabel:'车队公司'
            }
        });
        var detail_driver_box=SUNLINE.CompanyBox({
            fields:['u_id','u_mob','u_zname'],url:$__app__ + '/Users/dataJson',
            where:{
                us_orgid:-1
            },
            config:{
                displayField:'u_zname',
                valueField:'u_zname',
                tpl:Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{u_zname} - {u_mob}</li>',
                    '</tpl></ul>'
                ),
                displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '{u_zname}{u_mob}',
                    '</tpl>'
                ),
                id:'ti_bus_name',
                name:'ti_bus_name',
                labelWidth:60,
                width:280,
                queryParam:'skey',
                labelAlign:'right',
                fieldLabel:'司机信息'
            }
        });
        var settel_type_box=SUNLINE.LocalComob({
            id:'ti_settle_type',
            fields:['ti_settle_type'],
            data:[['现金'],['签单'],['预付']],
            config:{
                id:"sct_type_id",
                value:'签单',
                labelWidth:60,
                width:280,
                labelAlign:'right',
                fieldLabel:'结算类型'
            }
        });
        var detail_form_cm = [
            {id:"ti_id",name:"ti_id",fieldLabel:"计划ID",hidden:true},
            {id:"ti_type",name:"tp_type",fieldLabel:"接送类型",hidden:true},
            {id:"ti_sid",name:"tp_sid",fieldLabel:"座位ID",hidden:true},
            {id:"tool_type",name:"tool_type",fieldLabel:"座位ID",hidden:true},
            {id:"ti_number",name:"ti_number",fieldLabel:"统一编号",hidden:true},
            {id:"ti_start_date",name:"tp_start_date",fieldLabel:'安排日期',readOnly:true},
            {id:"ti_person",name:"tp_person",fieldLabel:"人数",editable:false,readOnly:true},
            {id:"ti_go_time",name:"ti_go_time",fieldLabel:"发车时间"},
            {id:"ti_org_id",name:"ti_org_id",fieldLabel:'车队公司ID',hidden:true},
            DetailCarBox,
            detail_driver_box,
            {id:"ti_bus_id",name:"ti_bus_id",fieldLabel:'司机信息ID',hidden:true},
            settel_type_box,
            {id:'ti_money',name:'ti_money',fieldLabel:'车价'},
            {id:'ti_remark',name:'ti_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ];
        DetailCarBox.on({
            select:function(c,r){
                var row=r[0];
                Ext.getCmp('ti_org_id').setValue(row.get('id'));
                detail_driver_box.setValue('');
                Ext.getCmp('ti_bus_name').setValue('');
            }
        });
        detail_driver_box.on({
            select:function(c,r){
                var row=r[0];
                Ext.getCmp('ti_bus_id').setValue(row.get('u_id'));
                detail_driver_box.setValue(row.get('u_zname')+row.get('u_mob'));
            }
        });
        detail_driver_box.on({
            beforequery:function(c,r){
                detail_driver_box_params();
            }
        });
        function detail_driver_box_params(){
            var corg_id=Ext.getCmp('ti_org_id').getValue();
            SUNLINE.baseParams(detail_driver_box.store,{us_orgid:corg_id});
            detail_driver_box.store.load();
        }
        var detail_form = Ext.create('Ext.form.Panel',{
            bodyPadding: 10,
            autoScroll:true,
            width: "100%",
            defaults:{
                labelWidth:60,
                width:280,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:detail_form_cm
        })
        //安排计划添加与编辑
        var detail_win = new Ext.Window({
            title:"安排计划",
            width:330,
            autoScroll: true,
            modal : true,
            closeAction:'hide',
            items: detail_form,
            buttons:[
                {text:'确定保存',handler:detail_pres_edit},
                {text:'关闭',handler:function(){
                    detail_win.hide();
                }}
            ]
        });
        //编辑接送信息
        function detail_pres_edit(t){
            var d_form = detail_form.getForm();
            if(!d_form.isValid()) {
                Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                return;
            }
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            var data=d_form.getValues();
            Ext.Ajax.request({
                url: $__app__+'/TransPlan/seat_arranged_list',
                params: {from_data:Ext.encode(data),plan_list:Ext.encode(PlanInfo)},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    var info=r.info;
                    Ext.Msg.alert('友情提示', info.msg);
                    if(r.status){
                        detail_win.hide();
                        var data_row=info.tp_data;
                        var tp_id=[];
                        var tp_arr={};
                        Ext.each(data_row,function(v,i){
                            tp_id.push(v.tp_id);
                            tp_arr[v.start_date+'-'+ v.start_site+'-'+ v.start_stname+'-'+ v.bus_number]= v.tp_id;
                        });
                        Ext.each(PlanInfo,function(pv,pi){
                            var str=pv.start_date+'-'+ pv.start_site+'-'+ pv.start_stname+'-'+ pv.bus_number;
                            if(tp_arr[str]>0)PlanInfo[pi]['tp_id']=tp_arr[str];
                        });
                        SUNLINE.baseParams(detail_store,{tp_id:Ext.encode(tp_id)});
                        detail_store.reload();
                    }
                    myMask.hide();
                }
            });
        }
        /**
         * 添加或编辑接送明细信息
         * @param b
         * @returns {boolean}
         */
        function detail_trans_plan(b){
            var rows=(opt.grid).getSelectionModel().getSelection();
            if(!rows[0]){
                Ext.Msg.alert('友情提示','请选择需要编辑的接送信息!');
                return false;
            }

            var row={},bus_number='',bool=true,pop_num= 0,start_date='';
            PlanInfo=[];
            Ext.each(rows,function(v,i){
                var rw= v.data;
                if(opt.type=='money'){
                    if(rw.tp_person)rw.pop_num=parseFloat(rw.tp_person);
                    if(rw.tp_start_date)rw.start_date=rw.tp_start_date;
                    row.ti_org_id=rw.tp_car_org_id;
                    row.ti_org_name=rw.tp_car_org_name;
                    row.tool_type=opt.type;
                }
                if(bus_number!=rw.bus_number && bus_number){
                    bool=false;
                }
                if(!start_date){
                    bus_number=rw.bus_number;
                    start_date=rw.start_date;
                }

                pop_num+=rw.pop_num;
                PlanInfo.push(rw);
            });
            row.tp_person=pop_num;
            row.ti_start_date=start_date;
            if(b.text=='编辑接送计划'){
                var detail_row=SUNLINE.getSelected(tp_detail_grid);
                detail_row=detail_row.data;
                row.ti_number=detail_row.ti_number;
                if(!row.ti_go_time)row.ti_go_time=detail_row.ti_go_time;
                if(!row.ti_org_id)row.ti_org_id=detail_row.ti_org_id;
                if(!row.ti_org_name)row.ti_org_name=detail_row.ti_org_name;
                if(!row.ti_bus_id)row.ti_bus_id=detail_row.ti_bus_id;
                if(!row.ti_bus_name)row.ti_bus_name=detail_row.ti_bus_name;
                row.ti_money=detail_row.ti_money;
                row.ti_remark=detail_row.ti_remark;
                row.tp_person=detail_row.ti_num;
                row.ti_id=detail_row.ti_id;
            }
            detail_win.show();
            var d_from=detail_form.getForm();
            d_from.reset();
            d_from.setValues(row);
            if(opt.type=='money'){
                Ext.getCmp('ti_go_time').setHidden(true);
                Ext.getCmp('ti_bus_name').setHidden(true);
                Ext.getCmp('ti_org_name').setReadOnly(true);
            }
        }

        /**
         * 删除接送明细
         * @returns {boolean}
         */
        function detail_del(){
            var detail_row=SUNLINE.getSelected(tp_detail_grid);
            if(!detail_row){
                Ext.Msg.alert('友情提示','请选择需要删除的接送明细!');
                return false;
            }
            Ext.MessageBox.confirm('友情提示','你确定需要删除当前接送明细吗？',function(y){
                if(y!='yes')return false;
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url: $__app__+'/TransPlan/trans_detail_del',
                    params: {ti_id:detail_row.data.ti_id},
                    method:'post',
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info);
                        if(r.status)detail_store.reload();
                        myMask.hide();
                    }
                })
            });
        }
        //接送计划添加、编辑(end)
        return {detail_grid:tp_detail_grid,detail_info:detail_info};
    },
    /**
     * 投放市场选择控件
     * @param opt
     * @param obj
     * @returns {*}
     * @constructor
     */
    PutCity:function(opt,obj){
        /*投放市场选择功能（start）*/
       // var pro_class=document.getElementById(code).className;
        var attrTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="select-wrap {cls}" id="{code}">{name}{btn}{cancel_btn}</div>',
            '</tpl>'
        );

        //新的DataView数据源
        Ext.define('attrStore', {
            extend: 'Ext.data.Model',
            fields: [ "id","name","code" ]
        });
        var attr_store = Ext.create('Ext.data.Store', {
            model: 'attrStore',
            data : [ ]
        });
        var _url=$__app__ + '/City/put_city_json';
        if(opt.url)_url=opt.url;
        var attr_Store = SUNLINE.JsonStore(_url,['group','gname','data'],false);
        var attr_Store_is_load = false;
        attr_Store.on('load', function(store){
            //重构DataView的数据
            attr_Store_is_load = true;
            var data = [];
            var g_data = {};
            store.each(function(record){
                var id = 'g_'+ record.get('group'),
                    sel_id = 'sel_'+id,
                    can_id = 'can_'+id;
                var btn="<button style='float: right;' id='"+sel_id+"' class='group1'>全选</button>";
                var cancel_btn="<button style='float: right;margin-right:10px;' id='"+can_id+"' class='group2'>取消全选</button>";
                var items = record.get('data');

                data.push({id:id, cls : 'group-wrap',btn:btn,cancel_btn:cancel_btn, name: record.get('gname')+'&nbsp;'});

                g_data[record.get('gname')] = items;

                Ext.each(items, function(item, index){
                    var it  = {};
                    it.cls = '';
                    it.id = item.id;
                    it.code = item.code;
                    it.name = item.name;
                    it.group = id;
                    data.push(it);
                });
            });
            attr_store.loadData(data);
            var btn = Ext.query('button[class=group1]');
            var cancel_btn = Ext.query('button[class=group2]');
            add_select(btn);

            add_select(cancel_btn,'deselect');

            setSelected();
        });
        function add_select(cls,type){
            Ext.each(cls, function(item, index){
                Ext.get(item.id).on("click",function(c, b, o, e){
                    var prefix=type?'can_':'sel_';
                    var g = b.id.replace(prefix, '');
                    var s_data= [];
                    var index = attr_store.find('group', new RegExp('^' + g + '$'));
                    attr_store.each(function(r){
                        var gt = r.get('group');
                        if (g === gt ){
                            s_data.push( r );
                        }
                    });
                    if(type=='deselect'){
                        attrView.getSelectionModel().deselect(s_data, true);
                    }else{
                        attrView.getSelectionModel().select(s_data, true);
                    }
                });
            });
        }

        var attrView = new Ext.view.View({
            store : attr_store,
            tpl : attrTpl,
            multiSelect : true,
            simpleSelect : true,
            itemSelector:'div.select-wrap',
            selectedItemCls : 'selected-wrap',
            emptyText : '暂无自定义属性。',
            plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
        });

        var attr_title='投放城市选择';
        if(opt.title)attr_title=opt.title;
        //***** 票价选择其他省份（始发站）- start *****
        if (opt.site_type == 1) {
            var other_opt = {
                fields: ['name'],
                url: $__app__ + '/StationStart/start_site_group?type=1',
                config: {
                    id: 'site_val',
                    fieldLabel: '选择其他省份',
                    labelWidth: 80,
                    displayField: 'name',
                    valueField: 'name',
                    width: 220,
                    labelSeparator: '',
                    disabled: false
                }
            }
            var site_combox = this.ComBoxPlus(other_opt);
            site_combox.on('select', function (c, r) {
                var select_row = r[0];
                Ext.Msg.confirm('友情提示', '您确认要选择 ' + select_row.get('name') + '吗？', function (v) {
                    if(v=='yes') {
                        Ext.Ajax.request({
                            url: $__app__ + '/StationStart/updateExtraCity',
                            params: {
                                province: select_row.get('name')
                            },
                            success: function (response) {
                                attr_Store.reload();
                                site_combox.store.reload();
                                Ext.getCmp('site_val').setValue('');
                            }
                        });
                    }
                });
            });
        }
        //***** 票价选择其他省份（始发站）- end *****
        var attrWin = new Ext.Window({
            title : attr_title,
            width : 800,
            height:document.body.scrollHeight-100,
            modal : true,
            layout : 'fit',
            closeAction : 'hide',
            cls : 'adver_view',
            autoScroll : true,
            items: attrView,
            buttons : [
                site_combox,
                {text:'全选', handler:allSelected},
                {text:'确认选择', handler:getSelected},
                {text:'刷新', handler:function(){ attr_Store.reload(); }},
                {text:'取消', handler:function(){ attrWin.hide(); }}
            ]
        });

        attrWin.on('show',function(){
            var attrWinHeight = attrWin.getHeight();
            if(attrWinHeight > 500){
                attrWin.setHeight("500");
            };
            if(attrWinHeight < 100){
                attrWin.setHeight("200");
            };
            if(opt.title=='选择始发站'){
                var a_base=window.start_site_data_fn();
                if(attrWin.this_group){
                    a_base.type = attrWin.this_group;
                }
                SUNLINE.baseParams(attr_Store,a_base,true);
                attr_Store.load();
            }
            if (!attr_Store_is_load){
                if(opt.title!='选择始发站')attr_Store.load();
            }else{
                setSelected();
            }
        });

        function allSelected(){
            attrView.getSelectionModel().selectAll(true);
        }

        //设置默认城市（颜色改成黄色）
        function setSelected() {
            var v = window.sarea_val_fn(opt.id);
            if (opt.title == '选择始发站') v = window.site_val_fn(opt.id);
            if(attrWin.this_val){
                v=attrWin.this_val;
            }
            attrView.getSelectionModel().deselectAll(false);
            if (v) {
                var h = v.split(',');
                for (var i = 0; i < h.length; i++) {
                    var index = attr_store.find('name', new RegExp('^' + h[i] + '$'));
                    attrView.getSelectionModel().select(index, true);
                }
            }
        };

        function getSelected(){
            var h = attrView.getSelectedNodes(), sd=[],code=[];
            for (var i=0; i < h.length; i++){
                if(!$(h[i]).hasClass('group-wrap')){
                    code.push(h[i].id);
                    sd.push(h[i].textContent);
                }
            };
            attrWin.hide();
            if(obj){
                obj(sd,code,attrWin.this_id);
            }
        };
        return attrWin;
        /*投放市场选择功能（end）*/
    },

    ProductsGrid:function(opt, p_type,type){
        if (!opt) opt='';
        if (!p_type) p_type=10; //默认设为10，即周边短线
        var _storeUrl = $__app__ + '/Products/productJson/'+ opt;
        var _fld = [
            "p_id","p_days","p_num","p_name","p_name_short","p_site_name","p_name_web","p_type",
            "p_depart_city","p_depart_port","p_time","p_status","p_org_id","p_edit_type","p_pym",
            "p_adult_price","p_child_price","p_uid","p_linkman","p_man_qq","p_meet_tel","p_scene_id","p_attach","p_self_key",
            "p_depart_name","p_local","p_confirm","p_org_market","json_id"
        ];
        var _store = SUNLINE.JsonStore( _storeUrl, _fld, true);
        SUNLINE.baseParams(_store,{ limit:pageSize, p_type:p_type });
        var bbar = {
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        };

        var grid_opt = {
            region : 'center',
            border : false,//无边框
            loadMask : {msg : '数据传输中，请稍候...'},//导入时显示loading
            store : _store,//数据源
            viewConfig : {emptyText: '暂无产品信息。'},
            style:'border-top:1px solid #ddd',
            /*view : new Ext.grid.GroupingView({
                groupByText : '使用当前字段分组',
                showGroupsText : '分组显示',
                showGroupName : false,
                enableGroupingMenu:false,
                hideGroupedColumn : true,
                emptyText: '暂无产品信息。',
                groupTextTpl: '{text} <span style="font-weight: normal;">(共{[values.rs.length]}条线路)</span>'
            }),*/
            bbar: new Ext.PagingToolbar(bbar)
        };

        function del_status(v,m,r){
            var p_status = r.get('p_status');
            if (p_status=='del') v = "<span style='text-decoration: line-through; color: #999;'>"+v+"</span>";
            v = "<a href='"+$__app__+"/Goal/"+ r.get("json_id")+"/site/"+ r.get("p_site_name")+"' target='_blank'>"+v+"</a>";
            return v;
        };


        function p_confirm(v,m,r){
            if (r.get('p_confirm')==1) v = "<span style=' color: red; cursor: pointer' qtip='订单无需确认!'>(无需)</span>"+v;
            return v;
        }

        var column = [
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID",dataIndex:"p_id",width:60, hidden:true},
            {header:"<div class='button-attach' qtip='附件'>&nbsp;</div>",dataIndex:"p_attach",width:24, menuDisabled:true, renderer:_attach},
            {header:"产品编号",dataIndex:"p_num",width:80},
            {header:"产品主标题",dataIndex:"p_name",width:300},
            {header:"副标题",dataIndex:"p_name_short",width:100},
            {header:"产品简介",dataIndex:"p_name_web",width:200, hidden:true},
            {header:"计调人员",dataIndex:"p_linkman",width:100},
            {header:"天数",dataIndex:"p_days",width:50, align:'center'},
            //{header:"产品类型",dataIndex:"p_type",width:60,renderer:product_type},
            {header:"出发城市",dataIndex:"p_depart_city",width:80},
            {header:"始发站",dataIndex:"p_depart_name",width:100},
            {header:"目的地",dataIndex:"p_destination",width:100,hidden:true},
            {header:"编辑时间",dataIndex:"p_time",width:150},
            {header:"状态",dataIndex:"p_status",width:60,hidden:true},
            {header:"附加属性",dataIndex:"p_attribute",width:100}
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
                width:130,
                value:'全部类型'
            }
        });
        if (opt=='select'){
            if(type=='BusShop') {
                var checkObj = new Ext.selection.CheckboxModel({mode: 'SIMPLE'}); //复选框显示
                grid_opt['selModel'] = checkObj;
                var clean_btn = Ext.create("Ext.Button", {
                    text: "取消多选",
                    cls:'x-btn-icon',
                    handler: function () {
                        checkObj.deselectAll();
                    },
                });
            }
            column = [
                new Ext.grid.RowNumberer({width:50}),
                {header:"ID",dataIndex:"p_id",width:60, hidden:true},
                {header:"产品编号",dataIndex:"p_num",width:80},
                {header:"产品主标题",dataIndex:"p_name",width:240,renderer:addLabel},
                {header:"计调人员",dataIndex:"p_linkman",width:100}
            ];
            grid_opt['tbar'] = [
                ProductType_box,
                '->',
                {
                    xtype:'trigger',
                    triggerCls : 'x-form-search-trigger',
                    id:'pro_search',
                    emptyText : '产品名称、产品编号等',
                    width:165,
                    onTriggerClick:function(e){
                        pro_search();
                    },
                    listeners :{
                        "specialkey" : function(_t, _e){
                            if (_e.keyCode==13)
                                pro_search();
                        }
                    }
                },clean_btn
            ];
        };
        ProductType_box.on({
            select:function(c,r){
                var rows= r[0].data;
                console.log(r)
                SUNLINE.baseParams(_store,{product_type:rows.id},true)
                _store.load();
            }
        });

        function pro_search(){
            var skey = Ext.getCmp('pro_search').getValue();
            SUNLINE.baseParams(_store,{skey:skey},true);
            _store.load();
        };

        grid_opt['columns'] = column;
        var _grid = new Ext.grid.GridPanel(grid_opt);
        return _grid;
    }
};

//附件渲染方法
function _attach(v){
    var tmp = "&nbsp;";
    if (v){
        var t = v.split(',');
        tmp = "<div class='button-attach' qtip='已绑定"+ t.length +"个附件'>&nbsp;</div>";
    };
    return tmp;
};

function addLabel(v,m,r){
    var tmp = '';
    switch(r.data.p_type)
    {
        case '10':
            tmp = "<span data-qtip='周边短线'>【短】</span>"+v;
            break;
        case '11':
            tmp = "<span data-qtip='国内长线'>【长】</span>"+v;
            break;
        case '20':
            tmp = "<span  data-qtip='出境游'>【出】</span>"+v;
            break;
        case '30':
            tmp = "<span data-qtip='邮轮'>【邮】</span>"+v;
            break;
        case '40':
            tmp = "<span data-qtip='特色游'>【特】</span>"+v;
            break;
        case '50':
            tmp = "<span data-qtip='自助游'>【自】</span>"+v;
            break;
        default :
            tmp = "<span data-qtip=''></span>"+v;
            break;
    }
    return tmp;
}


function product_type(v){
    var com_type=_sunline_.product_type,len=com_type.length;
    for(var i=0;i<len;i++){
        if(com_type[i][0]==v){ return com_type[i][1]; }
    };
    return com_type[i][0];
};

function Import(js, id){
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    if (!id) oScript.id = id;
    oScript.type = "text/javascript";
    oScript.src= js ;
    oHead.appendChild( oScript);
};
Ext.onReady(function(){
    Ext.Ajax.on('requestcomplete', function(conn, response, options, eOpts){
        var _rt = response.responseText;
        try{
            var _ajax_return = Ext.decode(_rt);
            if (_ajax_return.status==0 && _ajax_return.logout==1){
                top.Ext.Msg.show({
                    title: '错误信息',
                    message: '您当前的会话已<span style="color: #ff9b2d">超时</span>，请<span style="color: blue">重新登录</span>！',
                    width: 300,
                    buttons: Ext.Msg.OK,
                    buttonText: { ok: '我知道了' },
                    fn: function(){
                        top.location.href = _ajax_return.url;
                    },
                    icon: Ext.MessageBox.INFO
                });
            }
            if (_ajax_return.status==0 && _ajax_return.exception==1){
                top.Ext.Msg.show({
                    title: '异常错误信息',
                    message: _ajax_return.message + (_ajax_return.code ? ' ['+ _ajax_return.code +']' : '') ,
                    width: 300,
                    buttons: Ext.Msg.OK,
                    buttonText: { ok: '我知道了' },
                    fn: function(){
                        if (_ajax_return.url) top.location.href = _ajax_return.url;
                    },
                    icon: Ext.MessageBox.INFO
                });
            }
        }catch(e){
            /* console.log(response);
             console.log(options);*/
        }
    });
});

function in_array($value, $array){
    if (typeof $array != 'object') return false;
    for (var $i=0; $i<$array.length; $i++){
        if ( $value == $array[$i] ) return $i;
    }
    return -1;
};

//四舍五入保留两位小数点
function round_format(price){
    if(!price)price=0;
    return parseFloat(price).toFixed(2);
}

function sort_fn(v){
    var str='<i class="bus-stor-cls">8</i>'+ v;
    if(v=='导游' || v=='车辆'){
        str='<i class="bus-stor-cls">1</i><font color="blue">'+ v+'<font>';
    }
    return str;
};


//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
window.banBackSpace=function(e){
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型
    //获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
    //处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
    && (vReadOnly==true || vEnabled!=true))?true:false;
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") ?true:false;
    //判断
    if(flag2) return false;
    if(flag1) return false;
}
//禁止后退键 作用于Firefox、Opera
window.document.onkeypress=banBackSpace;
//禁止后退键  作用于IE、Chrome
window.document.onkeydown=banBackSpace;