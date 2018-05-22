var _me = window.location.href;
if (top.location.href != _me) top.location.href = _me;
var stop_day;
var stop_time;
var stop_type;
Ext.onReady(function () {
    var org_url=_uinfo.org_url;
    if(!org_url){
        org_url='';
    }
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var cp = new Ext.state.CookieProvider({
        expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))
    });
    Ext.state.Manager.setProvider(cp);

    var tb = Ext.create('Ext.toolbar.Toolbar', {cls: 'ziyo-main-bar'});
    window.tab_list_menu = new Ext.menu.Menu({
        width: 180,
        plain: true,
        floating: true,
        cls: 'tool_menu',
        items: [{ //'<div class="title-x">选择窗口</div>',
            text: '关闭当前页',
            handler: function () {
                var main_tab_view = Ext.getCmp('MainTabPanel'); //得到tab组件
                var tab = main_tab_view.getActiveTab();
                if (!tab.closable) return;
                Ext.Msg.confirm('友情提醒', '您真的要关闭“' + tab.title + '”吗？', function (btn) {
                    if (btn == 'yes') {
                        main_tab_view.remove(tab);
                        tab_list_menu.remove(Ext.getCmp('am_' + tab.id));
                    }
                });
            }
        }, {
            text: '关闭其他页',
            handler: function () {
                Ext.Msg.confirm('友情提醒', '您真的要关闭其他的窗口吗？', function (btn) {
                    if (btn == 'yes') {
                        var main_tab_view = Ext.getCmp('MainTabPanel'); //得到tab组件
                        var tab = main_tab_view.getActiveTab();
                        main_tab_view.items.each(function (item) {
                            if (item.closable && item != tab) {
                                main_tab_view.remove(item);
                                tab_list_menu.remove(Ext.getCmp('am_' + item.id));
                            }
                        });
                    }
                });
            }
        }, '-', {
            text: '我的控制台',
            tab: 'my_console',
            checked: true,
            group: 'current_menu',
            handler: activeTab
        }]
    });
    var logo_css='';
    if(org_url=='588ly/'){
        logo_css='style="background-image: url(http://img.jdytrip.cn/img/mgh-logo.png);background-size: 98%;"';
    }
    tb.add({
        xtype: 'tbtext',
        cls: 'logo',
        text: '<a href="' + $app_root +org_url+ '"><h1 '+logo_css+'>' + $web_name + '</h1></a>'
    });
    var sub_menu = {};
    for (var i = 0; i < __main_menu.length; i++) {
        var item = __main_menu[i];
        //主菜单
        tb.add({
            id: 'm_' + item['id'],
            cls: 'mbtn',
            text: '<i class="fa ' + item['icon'] + ' fa-3x"></i><br>' + item['text'],
            handler: function (b) {
                var ln = Ext.getCmp('ziyo-left');
                ln.setTitle('<i class="fa fa-bars"></i> ' + sub_menu[b.id].text);
                var html = menu_tpl.apply(sub_menu[b.id]['children']);
                var menu = Ext.fly('ziyo-menu');
                menu.setHtml(html);
                menu.highlight('ffffff', {
                    attr: 'backgroundColor',
                    endColor: '2A3340',
                    easing: 'easeIn',
                    duration: 500
                });
                bind('ziyo-menu');
            }
        });
        //子菜单
        sub_menu['m_' + item['id']] = item;
    };

    tb.add('->');
    tb.add({
        id: 'current_fn',
        tooltip: '当前显示页面',
        text: '我的控制台',
        menu: tab_list_menu
    });
    //系统消息
    tb.add({
        id: 'userMsg',
        cls: 'user_msg',
        tooltip: '消息中心',
        text: '<i class="fa fa-bell fa-lg"></i> <span><span class="n0">0</span></span>',
        handler: function () {
            OpenTab('消息中心', 'msg', '', $__app__ + '/Messages', 1);
        }
    });

    /* 暂时去掉 *******************
     tb.add('-');
     tb.add({
     text : '工单服务',
     handler : function(b){
     OpenTab('我的工单', 'work', '', $__app__ + '/WorkOrder', 1);
     }
     });
     tb.add('-');
     tb.add({
     text : '<i class="fa fa-exclamation-circle fa-lg"></i> 帮助与文档',
     handler : function(){
     OpenTab('帮助与文档', 'help', '', $__app__ + '/Help', 2  );
     }
     });
     */

    tb.add('-');
    //用户信息
    tb.add({
        id: 'user_info',
        text: '<i class="fa fa-user-secret fa-lg"></i> ' + _uinfo.u_realname + '[ ' + _uinfo.u_name + ' ]',
        enableToggle: true,
        toggleHandler: onUserInfoToggle,
        pressed: false
    });

    var user_info_dom;
    function onUserInfoToggle(b) {
        var wg_name=_uinfo.wg_name?_uinfo.wg_name:'';
        var html = '<div class="user_info_dom">' +
            '<p>' + _uinfo.org_name + '</p>' +
            '<p><b>权限：</b>' + _uinfo.r_name + '</p>'+
            '<p><b>级别：</b>' + _uinfo.u_scope + '</p>'+
            '<p><b>部门：</b>' + wg_name+ '</p>';
        if (_uinfo.u_openid == 0) {
            //Ext.getCmp('weixin').setText('绑定微信');
            html += '<div style="width:180px;height:180px"><img style="width:100%;height:100%" src=' + $__app__ + '/WxMobile/wx_bind_user/rand/' + Math.random() + '></div>';
        } else {
            //Ext.getCmp('weixin').setText('解除绑定');
            html += '<a href="' + $__app__ + '/WxMobile/relieveUser"><button style="color:#fff;width:100px;height:30px;margin:5px;border:none;background: #0899CB">解除绑定</button></a>';
        }

        html += '<p><a href="' + $__app__ + '/'+org_url+'"> 分销首页 </a> <a href="' + $__app__ + '/'+org_url+'logout.html?type=sys"> 安全退出 </a></p></div>';
        if (!user_info_dom) {
            user_info_dom = Ext.fly(Ext.getBody().insertHtml('afterBegin', html));
            var ps = b.getPosition(), wh = b.getSize(), bw = Ext.getBody().getSize();
            user_info_dom.setStyle({top: ( ps[1] + wh.height ) + 'px', right: (bw[0] - (ps[0] + wh.width +2)) + 'px' });
            user_info_dom.insertHtml('afterBegin','<div style="float:right; width: '+ wh.width
                +'px; height: 5px; margin-top: -11px; margin-right: -10px; background: #fff;"></div>');
        };
        if (b.pressed){
            user_info_dom.show();
        } else {
            user_info_dom.hide();
        }
    };


    /*//菜单添加窗口
     var test_win=new Ext.Window({
     title : '绑定微信',
     layout: 'border',
     width : 400,
     height: 350,
     style:'background-color:#fff;',
     closeAction : 'hide',
     resizable:false,
     modal:true,
     html:'<div style="width:100%;height:100%;background: #fff"><p style="text-align: center;padding-top: 20px;font-size: 16px;">使用手机微信端扫描下方二维码完成绑定</p><p style="text-align: center;margin-top: 10px;"><img src="'+$__app__+'/WxMobile/wx_bind_user/rand/'+Math.random()+'" alt="" style="width:230px"/></p></div>'
     });*/

    var left_width = 200;
    new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            border: false,
            tbar: tb,
            shadow: true
        }, {
            title: '<i class="fa fa-bars"></i> 工作台',
            region: 'west',
            floatable: false,
            width: left_width,
            pressed: true,
            id: 'ziyo-left',
            cls: 'ziyo-left',
            autoScroll: true,
            html: '<div id="ziyo-menu" class="ziyo-menu ziyo-menu-expand"></div>'
        }, {
            xtype: 'tabpanel',
            reference: 'tabpanel',
            collapsible: false,
            region: 'center',
            id: 'MainTabPanel',
            defaults: {autoScroll: true, closable: true},
            /*stateId : 'MainTabPanel_state',
             stateful : true,
             listeners : {
             add : function(t, c, i){
             clog(c.id, c.title);
             }
             },*/
            items: [
                {
                    title: '工作台',
                    glyph: 11,
                    id: 'my_console',
                    closable: false,
                    html: '<iframe width="100%" height="100%" id="ifm_0"  name="ifm_0" src="/Index/welcome" frameborder="0"></iframe>'
                }
            ]
        }]
    });

    var lp = Ext.getCmp('ziyo-left'), lh = lp.getHeader(),
        collapse_width = 40; //collapse_width的宽度请配合样式.ziyo-menu-collapse的宽度
    lh.on('click', function () {
        var menu = Ext.fly('ziyo-menu');
        if (menu.hasCls('ziyo-menu-expand')) {
            lp.addCls('ziyo-left-collapse');
            lp.removeCls('ziyo-left-expand');
            lp.setWidth(collapse_width);
            cp.set('ziyo-left-menu', collapse_width);
            menu.addCls('ziyo-menu-collapse');
            menu.removeCls('ziyo-menu-expand');
        } else {
            lp.addCls('ziyo-left-expand');
            lp.removeCls('ziyo-left-collapse');
            lp.setWidth(left_width);
            cp.set('ziyo-left-menu', left_width);
            menu.addCls('ziyo-menu-expand');
            menu.removeCls('ziyo-menu-collapse');
        }
    });

    if (cp.get('ziyo-left-menu') == collapse_width) {
        lp.setWidth(collapse_width);
        var menu = Ext.fly('ziyo-menu');
        menu.removeCls('ziyo-menu-expand');
        menu.addCls('ziyo-menu-collapse');
    };




    function getIcon(v) {
        v = v ? v : 'fa-file-code-o';
        if (v.substring(0, 3) != 'fa-') v = 'fa-file-code-o';
        return v;
    };


    var menu_data = {}, float_menu_width = 150, current_pm;
    var menu_tpl = new Ext.XTemplate(
        '<ul>',
        '<tpl for=".">',
        '<li>' +
        '<a href="javascript:void(0);" class="{[this._sub_menu_cls(values.children)]} ziyo-menu-items" data-id="{id}">' +
        '<label><i class="fa {[this._icon(values.icon)]}"></i></label>' +
        '<span>{text}</span>' +
        '</a>',
        '{[this._child(values.children)]}',
        '</li>',
        '{[this._load_data(values)]}',
        '</tpl>',
        '</ul>',
        {
            _child: function (v) {
                return v ? menu_tpl.apply(v) : '';
            },
            _icon: getIcon,
            _sub_menu_cls: function (v) {
                return v ? 'ziyo-sub-menu' : '';
            },
            _load_data: function (v) {
                menu_data[v.id] = v;
            }
        }
    );

    var html = menu_tpl.apply(__main_menu);
    var menu = Ext.fly('ziyo-menu');
    menu.insertHtml('afterBegin', html, true);
    menu.highlight('ffffff', {attr: 'backgroundColor', endColor: '2A3340', easing: 'easeIn', duration: 500});

    bind('ziyo-menu');

    function bind(obj, am) {
        var menu = Ext.fly(obj);
        var aa = menu.query('a');
        Ext.each(aa, function (item, index, all) {
            var ao = Ext.get(item), is_sub_menu = ao.hasCls('ziyo-sub-menu');
            //console.log(ao)
            if (is_sub_menu) ao.addCls('ziyo-sub-menu-expand');
            ao.on('click', function (e, t, o) {
                var id = ao.getAttribute('data-id');
                var node = menu_data[id];

                if (is_sub_menu) {
                    var nx = ao.next();
                    nx.setVisibilityMode(Ext.dom.Element.DISPLAY);
                    if (!nx.isHide) {
                        ao.removeCls('ziyo-sub-menu-expand');
                        ao.addCls('ziyo-sub-menu-collapse');
                        nx.isHide = true;
                        nx.hide();
                    } else {
                        ao.removeCls('ziyo-sub-menu-collapse');
                        ao.addCls('ziyo-sub-menu-expand');
                        nx.isHide = false;
                        nx.show();
                    };
                };
                var _type = node.type;
                if (_type != '0') {
                    var module = node.module, _link = '';
                    var _mod = module.split('/')[0].toLowerCase();

                    if(node.module=='index.html'){
                        _link = $__app__ + '/'+org_url + node.module;
                    }else{
                        _link = $__app__ + '/' + node.module;
                    }
                    if (node.action)_link += '/' + node.action;
                    if (_mod == 'http:' || _mod == 'https:' || _mod == 'ftp:' || _type == '3') _link = module;
                    var css = '';
                    OpenTab(node.text, node.id, css, _link, _type);
                };
            });

            ao.on({
                mouseenter: function (e, t, o) {
                    //进入
                    var menu = Ext.fly(obj);
                    var expand = menu.hasCls('ziyo-menu-expand');
                    if (am && cleaner) clearTimeout(cleaner);
                    if (expand) return;

                    var id = ao.getAttribute('data-id');
                    var node = menu_data[id];
                    var mid = 'menu-float-' + node.id;
                    var _menu = Ext.getCmp(mid);
                    current_pm = ao.id;
                    if (!_menu) {
                        var html = '<a href="#" class="ziyo-menu-items ziyo-menu-items-float">' + node.text + '</a>';
                        if (node.children) {
                            ao.addCls('ziyo-menu-over');
                            html += menu_tpl.apply(node.children);
                        };

                        _menu = Ext.create('Ext.Component', {
                            floating: true,
                            html: html,
                            width: float_menu_width,
                            id: mid,
                            cls: 'ziyo-menu ziyo-menu-float ziyo-menu-expand',
                            shadow: false,
                            autoShow: true
                        });

                        var xy = ao.getXY(), wh = ao.getSize();
                        _menu.setPosition((xy[0] + wh.width), xy[1]);
                        bind(mid, true);
                    } else
                        _menu.setStyle({display: 'block'});
                },
                mouseleave: function (e, t, o) {
                    //离开
                    var menu = Ext.fly(obj);
                    var expand = menu.hasCls('ziyo-menu-expand');
                    if (am) cleaner = setTimeout(function () {
                        menu.setStyle({display: 'none'});
                    }, 50);
                    //console.log(current_pm);
                    if (expand) return;

                    var id = ao.getAttribute('data-id');
                    var node = menu_data[id];
                    var mo = Ext.getCmp('menu-float-' + node.id);
                    if (node.children) {
                        cleaner = setTimeout(function () {
                            mo.setStyle({display: 'none'});
                        }, 50);
                    } else {
                        mo.setStyle({display: 'none'});
                    }
                }
            });
        });
    }


    var _chgPassForm = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaultType:'textfield',
        defaults:{anchor:'90%',labelWidth:80,labelAlign:'right'},
        items:[
            {id:'u_id', name:'u_id', xtype:'hidden', value:top._uinfo.u_id},
            {id:'u_name', name:'u_name', disabled:true, value:top._uinfo.u_name, fieldLabel:'登录名'},
            {id:'u_realname', name:'u_realname', disabled:true, value:top._uinfo.u_realname, fieldLabel:'真实姓名'},
            {id:'u_oldpass', name:'u_oldpass', inputType:'password', fieldLabel:'旧密码',allowBlank:false,emptyText:'请输入原密码'},
            {id:'u_pass', name:'u_pass', inputType:'password', fieldLabel:'新密码',allowBlank:false,emptyText:'请输入6-20位字母或者数字密码'},
            {id:'u_pass2', name:'u_pass2', inputType:'password', fieldLabel:'确认密码',allowBlank:false,emptyText:'请再次输入新密码'}
        ]
    });

    window._chgPassWin = new Ext.Window({
        id:'resetPwd',
        title : '修改密码',
        width : 380,
        autoHeight:true,
        closeAction:'hide',
        modal : true,
        items :[_chgPassForm],
        buttons:[
            //todo 完善保存的Ajax代码及后台修改密码的方法
            {text:'修改密码',handler:updatePass},
            {text:'取消',handler:function(){_chgPassWin.hide();}}
        ]
    });

    function updatePass() {
        var s = _chgPassForm.getForm().getValues();
        var reg = /^[a-zA-Z0-9]{6,20}$/;// 这里是正则表达式，6-20位数字或字母
        if (reg.test(s.u_pass && s.u_oldpass && s.u_pass2) != true) {
            Ext.Msg.alert('友情提示', "请输入6-20位字母或者数字密码");
            return;
        }
        if (!_chgPassForm.form.isValid()) {
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        if(s.u_oldpass == s.u_pass){
            Ext.Msg.alert('友情提示', '新密码不能与原密码相同，请重新输入。');
            return;
        }
        if (s.u_pass != s.u_pass2) {
            Ext.Msg.alert('友情提示', '两次输入的密码不一致，请重新输入。');
            return;
        }

        Ext.Msg.confirm('友情提示', '您真的要修改密码吗？', function (yn) {
            if (yn == 'yes') {
                Ext.Ajax.request({
                    url: $__app__ + '/Users/updatePass',
                    method: 'POST',
                    params: {u_id: s.u_id, u_password: s.u_pass, u_old: s.u_oldpass},
                    success: function (response, opts) {
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        _chgPassWin.hide();
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '用户密码修改失败！');
                    }
                });
            }
        });
    }
    ////强制修改密码
    //Ext.Ajax.request({
    //    url: $__app__ + '/Users/checkpwd',//从数据库中请求数据，动态获取items中的数据
    //    method: 'Get',
    //    success: function (response, opts) {
    //        // 获取后台数据成功时
    //        if (response.status == 200) {
    //            var rst = response.responseText;
    //            var check = JSON.parse(rst);
    //            if(check.code==200){
    //                Ext.getCmp('resetPwd').setTitle('修改密码<span style="color: red;display: inline-block;float: right">当前密码为初始密码，请重置！</span>');
    //                Ext.getCmp('u_oldpass').setFieldLabel('初始密码');
    //                Ext.getCmp('resetPwd').show();
    //            }
    //        }
    //    }
    //});

})  ;


window.OpenTab = function (name, id, css, link, type, fn) {

    if (type == '0') {
        return;
    }
    if (type == '2') {
        window.open(link, id);
        return;
    }
    if (type == '3') {
        try {
            eval(link);
        } catch (e) {
            Ext.Msg.alert($app_ui_title, '错误提示：<br><textarea style="width:300px; height:80px;">' + e.message + '</textarea>');
        }
        return;
    }
    if (link == '') {
        link = $__app__ + '/Index/build';
    }
    id = id.replace('tree_', '').replace('menu_', '');
    var tabId = "tab_" + id; //为id稍作修改。
    var tabTitle = name;
    var iconCss = '';
    if (css != '') {
        iconCss = css;
    }

    var MainTabPanel = Ext.getCmp('MainTabPanel'); //得到tab组件
    var tab = MainTabPanel.getComponent(tabId); //得到tab页
    var is_load = true;
    if (!tab) {
        is_load = false;
        tab = MainTabPanel.add(
            new Ext.Panel({
                id: tabId,
                title: tabTitle,
                autoScroll: false,
                layout: 'fit',
                border: false,
                closable: true,
                listeners: {
                    activate: function (p) {
                        /*try{
                         var xtheme = Ext.util.Cookies.get('xtheme');
                         eval("window.ifm_" + tabId + ".set_theme({xtheme:'"+xtheme+"'});");
                         }catch(e){
                         //Ext.Msg.alert('友情提示','提示内容：' + e.message + '|||' +xtheme);
                         }*/
                        var current_fn_btn = Ext.getCmp('current_fn');
                        current_fn_btn.setText(tabTitle);
                        if (!current_menu) current_menu = Ext.getCmp('am_' + tabId);
                        current_menu.setChecked(true);
                    },
                    remove: function (p) {
                        //remove menu item 事件监听不到，暂时依赖debug.js里的closeTab方法实现移除
                    }
                },
                html: '<iframe width="100%" height="100%" id="ifm_' + tabId + '"  name="ifm_' + tabId + '" src="' + link + '" frameborder="0"></iframe>'
            })
        );
        var menu_item = {
            id: 'am_' + tabId,
            text: tabTitle,
            tab: tabId,
            group: 'current_menu',
            checked: false,
            handler: activeTab
        };
        var current_menu = tab_list_menu.add(menu_item);
    };
    MainTabPanel.setActiveTab(tab); //激活加入的tab页
    if (iconCss != '') {
        tab.setIconClass(iconCss)
    };
    if (fn){
        try{
            if(fn=='runReActive'){
                parent.ReActive(link);
            } else {
                if (is_load) {
                    eval("window.ifm_" + tabId + "." + fn);
                } else {
                    setTimeout(function () {
                        eval("window.ifm_" + tabId + "." + fn);
                    }, 1000);
                }
            }
        }catch(e){ }
    };
};

function _changePass() {
    Ext.getCmp('resetPwd').setTitle('修改密码');
    Ext.getCmp('u_oldpass').setFieldLabel('旧密码');
    _chgPassWin.show('sunline_home');

};





/**
 * 系统设置
 */
var _chgSetForm = Ext.create("Ext.form.Panel", {
    border: false,
    bodyStyle: 'background:none;padding:10px',
    defaultType: 'textfield',
    defaults: {anchor: '100%', labelWidth: 200, labelAlign: 'right'},
    id: 'dynamicFC',
    items: []
});
// 动态生成items
fc = Ext.getCmp('dynamicFC');
fc.removeAll();//把panel中原有的移除，不然会累加-------1
Ext.Ajax.request({
    url: $__app__ + '/Set/dataSet',//从数据库中请求数据，动态获取items中的数据
    method: 'Get',
    success: function (response, opts) {
        // 获取后台数据成功时
        if (response.status == 200) {
            var items = response.responseText;
            var items1 = JSON.parse(items);
            fc.add(items1);//把获取的items添加到panel中，注意和----1中的顺序，先移除再添加，才不会导致累加
            fc.doLayout();
            stop_time_fn();
        }
    },
    failure: function (form, action) {
        Ext.Msg.alert('失败', action.result.message);
    }
});

window._chgSetFormw = new Ext.Window({
    title: '系统设置',
    width: 600,
    autoHeight: true,
    closeAction: 'hide',
    modal: true,
    items: [_chgSetForm],
    buttons: [
        //todo 完善保存的Ajax代码及后台修改密码的方法
        {text: '保存', handler: updateSet},
        {
            text: '取消', handler: function () {
            _chgSetFormw.hide();
        }
        }
    ]
});
function updateSet() {
    var set = _chgSetForm.getForm().getValues();
    Ext.Msg.confirm('友情提示', '您真的要修改设置吗？', function(yn){
        if (yn=='yes'){
            if(set.is_expire_open){
                if(set.expire_time_now==''||set.expire_time_save==''||set.expire_time==''){
                    Ext.Msg.alert('友情提示','请把红色框填写完整');
                    return false;
                }

                var expire_time_now = set.expire_time_now * 60;
                if (expire_time_now < set.expire_time_save) {
                    Ext.Msg.alert('友情提示', '保留时间不能小于否则保留时间');
                    return;
                }


            }//验证表单提交内容

            Ext.Ajax.request({
                url: $__app__ + '/Set/save',
                method: 'post',
                waitMsg: '数据加载中，请稍后....',
                params: set,
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.status == 1) {//如果你处理的JSON串中true不是字符串，就obj.success == true
                        Ext.Msg.alert('友情提示', obj.info.msg);
                        _chgSetFormw.hide();
                    } else {
                        Ext.Msg.alert('友情提示', '系统设置修改失败！');
                    }
                },
                failure: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', '系统设置修改失败！');
                }
            });
        }
    });
}

function _changeSet() {
    Ext.Ajax.request({
        url: $__app__ + '/Set/dataJson',
        method: 'GET',
        success: function (response, options) {
            _chgSetForm.getForm().setValues(JSON.parse(response.responseText));
             stop_day=JSON.parse(response.responseText).buslist_stop_day;
             stop_time=JSON.parse(response.responseText).buslist_stop_time;
             stop_type=JSON.parse(response.responseText).stop_type;
             var is_expire_open=JSON.parse(response.responseText).is_expire_open;
            if(stop_type == 'on'){
                Ext.getCmp('stop_type').setValue(true);
            }else{
                Ext.getCmp('stop_type').setValue(false);
            }
            Ext.getCmp('is_expire_open').setValue({is_expire_open:is_expire_open});
            $("#buslist_stop_day").html(stop_day);
            $("#buslist_stop_time").html(stop_time);
            //$('input[name=buslist_stop_day]').attr({ readonly: 'true' });
        },
        failure: function (response, options) {
            Ext.MessageBox.alert('失败', '请求超时或网络故障');
        }
    });

    _chgSetFormw.show('sunline_home');
};

$(document).on("change","input[name=buslist_stop_day]",function(){
    var day= $(this).val();
    $("#buslist_stop_day").html(day);
});
    
function stop_time_fn(){
    Ext.getCmp('stop_time').on('select',function(c,r){
        var day=r[0].data.time_value;
        $("#buslist_stop_time").html(day);
    })
    Ext.getCmp('stop_type').on('change',function(c,r) {
        var is_able=r?false:true;
        Ext.getCmp('stop_day').setDisabled(is_able);
        Ext.getCmp('stop_time').setDisabled(is_able);
    })


    Ext.getCmp('is_expire_open').on('change',function(c,r) {
        var is_able=r.is_expire_open?false:true;
        Ext.getCmp('expire_time').setDisabled(is_able);
        Ext.getCmp('expire_time_now').setDisabled(is_able);
        Ext.getCmp('expire_time_save').setDisabled(is_able);
    })

    Ext.getCmp('expire_time').on('change',function(c,r){
        $('#expire_time_tip').html(r);
    })

    Ext.getCmp('expire_time_now').on('change',function(c,r){
        $('#expire_time_now_tip').html(r);
    })

    Ext.getCmp('expire_time_save').on('change',function(c,r){
        $('#expire_time_save_tip').html(r);
    })


}

/**
 * 操作父级下的子级内容
 * @param id
 * @param fn
 * @returns {Window}
 */
window.to_pernet_wind = function (id, fn) {
    var tab_id = window.frames[id];
    if (fn) {
        fn(tab_id);
    }
    return tab_id;
}


function activeTab(b) {
    var main_tab_view = Ext.getCmp('MainTabPanel'); //得到tab组件
    var current_fn_btn = Ext.getCmp('current_fn');
    var tab = main_tab_view.getComponent(b.tab);
    main_tab_view.setActiveTab(tab);
    //current_fn_btn.setText(b.text);
    clog(main_tab_view.getState());
};
