/**
 * Created by sunline on 16-4-23.
 * 日志查看器
 * author: asun
 * 使用方法：
 * 1、增加一个打开日志查看窗口的按钮。代码如下：
 * {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}
 * 2、运行ziyo_log的方法，注册日志相关事件，即可享受日志查看功能了。代码如下：
 * ziyo_log({ listeners : [{grid: grid, action:'Users', table:'Users', pk_id:'u_id'}] });
 * ziyo_log参数说明：
 * listeners[{Json}, {Json}] : 需要监听的对象，仅处理grid的行选择事件
 *    {Json}内的参数说明：
 *    grid: 需要监听的Grid对象名，不要引号引起来；
 *    action: 日志中记录的Action类名；
 *    table: 日志中记录的表名，可省略；
 *    pk_id: grid记录对应的主键名称；
 */


var _ziyo_log_win, _ziyo_log_grid, _ziyo_log_grid_cm, _ziyo_log_store, _ziyo_log_url, _ziyo_log_field,
    _ziyo_detail_body, _ziyo_log_view,_ziyo_log_win_params, _ziyo_log_current;
_ziyo_log_url = $__app__ + '/Log/dataJson';
_ziyo_log_v_url = $__app__ + '/Log/detail';
_ziyo_log_field = ["_id","log_m","log_a","log_orgid","log_orgname","log_uid","log_uname","log_zname","log_table","log_tid","log_intro","log_unique","log_time","log_date","log_ip","log_site"];

function log_source(v,m,r){
    var s = '<span class="log log_action">A: '+ v +'; </span>';
    s += '<span class="log log_table">T: '+ r.get('log_table') +'</span>';
    return s;
};

function log_name(v,m,r){
    return v + '<span class="log log_name"> '+ r.get('log_uname') +'</span>';
};

function log_intro(v,m,r){
    return v.replace(/<[^>]+>/g,"");
}

/**
 * 查看日志用户界面
 * @param JSON $obj
 * $obj : {button:'ziyo_log_btn',listeners:[{obj:grid, action:'Users', table:'Users'},{obj:grid, action:'UsersInfo', table:'Users'}]}
 */
function ziyo_log($obj){
    //显示日志窗口
    if (!Ext) {
        console.log('ExtJS not found.');
        return;
    };
    var obj = $obj || {};
    //console.log($obj);
    if (!obj.listeners){
        console.log('Listeners not found.');
        return;
    };
    if (!obj.button) obj.button = 'ziyo_log_btn';
    console.log(obj);
    if (!_ziyo_log_store){
        _ziyo_log_store = SUNLINE.JsonStore(_ziyo_log_url, _ziyo_log_field, false);
        var p=[];
        Ext.each(obj.listeners, function(item, index){
            var table = item.table ? item.table : item.action;
            p.push( table );
        });
        SUNLINE.baseParams(_ziyo_log_store, {'log_table[]':p},true);
        /*_ziyo_log_store.on('load', function(){
            //更新日志显示面板
            var bd = _ziyo_log_view.body;
            bd.update('请选择需要查看的日志记录。');
        });*/
    };
    if (!_ziyo_log_grid_cm){
        _ziyo_log_grid_cm = [
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"_id", width:100, hidden:true},
            {header:"事件描述", dataIndex:"log_intro", width:180, renderer:log_intro},
            {header:"来源", dataIndex:"log_a", width:100, renderer:log_source},
            {header:"操作人", dataIndex:"log_zname", width:100, renderer:log_name},
            {header:"时间", dataIndex:"log_date", width:150},
            {header:"ip地址", dataIndex:"log_ip", width:100},
            {header:"区域", dataIndex:"log_area", width:100}
        ]
    };
    if (!_ziyo_log_grid){
        _ziyo_log_grid = Ext.create('Ext.grid.Panel',{
            region:'center',
            store:_ziyo_log_store,
            columns:_ziyo_log_grid_cm,
            viewConfig:{emptyText:'暂时没有信息'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store:_ziyo_log_store,
                displayInfo: true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有相关日志信息'
            }),
            listeners : {
                select : function( g, record, rowIndex, eOpts ){
                    console.log(record);
                    Ext.Ajax.request({
                        url:_ziyo_log_v_url,
                        params : {id:record.get('_id')},
                        method: 'POST',
                        success : function(res, opt){
                            try{
                                _ziyo_log_current = Ext.decode(res.responseText);
                                var html = _ziyo_log_view_base_tpl.apply(_ziyo_log_current.info);
                                if (!_ziyo_detail_body){
                                    var bd = _ziyo_log_view.body;
                                    bd.update('');
                                    _ziyo_detail_body = bd.createChild();
                                };
                                _ziyo_detail_body.hide().update(html).slideIn('t', { duration: 200 });
                            }catch(e){
                                Ext.Msg.alert('系统错误', '系统发生未知错误，请重试！');
                            }
                        },
                        failure : function(res, opt){
                            Ext.Msg.alert('系统错误', '系统发生未知错误，请重试！');
                        }
                    });
                }
            }
        });
    };
    var _ziyo_log_view_base_tpl = new Ext.XTemplate(
        '<tpl for=".">' +
            '<fieldset><legend>操作人基本信息</legend>' +
            '<div><label>单位：</label>{log.log_orgname}</div>' +
            '<div><label>姓名：</label>{log.log_zname}</div>' +
            '<div><label>账号：</label>{log.log_uname}</div>' +
            '</fieldset>' +
            '<fieldset><legend>日志信息</legend>' +
            '<div><label>描述：</label>{log.log_intro}</div>' +
            '<div><label>模块：</label>{log.log_m}</div>' +
            '<div><label>方法：</label>{log.log_a}</div>' +
            '<div><label>时间：</label>{log.log_date}</div>' +
            '<div><label>域名：</label>{log.log_site}</div>' +
            '<div><label>位置：</label>{log.log_ip} - {log.log_country} - {log.log_area}</div>' +
            '</fieldset>' +
            '<fieldset><legend>其他信息</legend>' +
            '<div><label>浏览器：</label>{server.HTTP_USER_AGENT}</div>' +
            '</fieldset>' +
        '</tpl>'
    );
    if (!_ziyo_log_view){
        _ziyo_log_view = Ext.create('Ext.panel.Panel', {
            region : 'south',
            height: 300,
            bodyStyle : 'background:#F5F5F5; padding:5px;',
            minHeight: 300,
            maxHeight : 300,
            autoScroll : true,
            html : '请选择需要查看的日志记录。'
        });
    };
    if (!_ziyo_log_win){
        _ziyo_log_win = Ext.create('Ext.Window', {
            title : '系统日志查看',
            width : 800,
            height : 600,
            closeAction : 'hide',
            layout : 'border',
            items : [_ziyo_log_grid, _ziyo_log_view],
            listeners : {'show':function(){_ziyo_log_store.load();}},
            tools : [{
                itemId: 'refresh',
                type: 'refresh',
                callback: function() { _ziyo_log_store.reload(); }
            },{
                type: 'search',
                cls : 'log_ljs',
                callback: function() {
                    if (_ziyo_log_current){
                        _ziyo_log_win_params.show();
                    }else{
                        Ext.Msg.alert('系统提示', '请选择您要查看的日志。');
                    }
                }
            }]
        });
    };
    if(obj.js_app!='jquery'){
        Ext.getCmp(obj.button).on('click', function(){
            var is_selected = false, action = [];
            Ext.each(obj.listeners, function(item, index){
                if (item.grid.getXType() == 'grid'){
                    var s = item.grid.getSelection();
                    if (s.length>0) is_selected = true;
                    var skey = item.table ? item.table : item.action;
                    action.push(skey);
                }
            });
            if (!is_selected){
                SUNLINE.baseParams(_ziyo_log_store, {'log_table[]':action});
            };
            _ziyo_log_win.show();
        });
        Ext.each(obj.listeners, function(item, index){
            //console.log(item.grid.getXType( ) );
            if (item.grid.getXType( ) == 'grid'){
                item.grid.getSelectionModel().on('select', function( g, record, index, eOpts){
                    var params = {log_tid:record.get(item.pk_id)};
                    if (item.table || item.action ) params['log_table'] = item.table ? item.table : item.action;
                    SUNLINE.baseParams(_ziyo_log_store, params);
                    if ( _ziyo_log_win.isVisible() ) {
                        _ziyo_log_store.load();
                    };
                    console.log(record);
                });
            }
            //console.log(item);
        });
    }



    if (!_ziyo_log_win_params){
        _ziyo_log_win_params = Ext.create('Ext.Window',{
            title : '日志详情',
            width : 800,
            height : 600,
            closeAction : 'hide',
            bodyStyle : 'padding:5px;',
            modal : true,
            autoScroll : true,
            html : '日志详情加载中...',
            listeners : {
                'show' : function(){
                    var bd = _ziyo_log_win_params.body;
                    bd.update('');
                    var cd = bd.createChild();
                    var html =formatJson(_ziyo_log_current.info.log);
                    html = 'LOG:<textarea style="width: 100%; height: 150px; margin-bottom: 5px;">' + html + '</textarea>';
                    if (_ziyo_log_current.info.get) {
                        var json_get = formatJson(_ziyo_log_current.info.get);
                        html += 'GET:<textarea style="width: 100%; height: 100px; margin-bottom: 5px;">' + json_get + '</textarea>';
                    };
                    if (_ziyo_log_current.info.post) {
                        var json_post = formatJson(_ziyo_log_current.info.post);
                        html += 'POST:<textarea style="width: 100%; height: 280px; margin-bottom: 5px;">' + json_post + '</textarea>';
                    };
                    if (_ziyo_log_current.info.server) {
                        var json_serv = formatJson(_ziyo_log_current.info.server);
                        html += 'SERVER:<textarea style="width: 100%; height: 280px; margin-bottom: 5px;">' + json_serv + '</textarea>';
                    };
                    if (_ziyo_log_current.info.trace) {
                        var json_trac = formatJson(_ziyo_log_current.info.trace);
                        html += 'TRACE:<textarea style="width: 100%; height: 280px; margin-bottom: 5px;">' + json_trac + '</textarea>';
                    };
                    cd.hide().update(html).slideIn('t', { duration: 200 });
                }
            }
        });
    };
    return {store:_ziyo_log_store,win:_ziyo_log_win};
};




var formatJson = function(json, options) {
    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    '; // one can also use '\t' or a different number of spaces

    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    // use a space after a colon
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

    // begin formatting...
    if (typeof json !== 'string') {
        // make sure we start with the JSON as a string
        json = JSON.stringify(json);
    } else {
        // is already a string, so parse and re-stringify in order to remove extra whitespace
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }

    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');

    // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');

    // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
    }

    Ext.each(json.split('\r\n'), function( node, index) {
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
};
