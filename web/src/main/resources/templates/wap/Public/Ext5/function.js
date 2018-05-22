/**
 * Created by zhushaolei on 15-6-1.
 */
/**
 * Ext5.0 不可直接写Date().format('')
 * @param mat 日期格式 Y-m-d
 * @param d 选择时间
 * @returns {format|*|format|format|format|format}
 * @constructor
 */
function DateFormat(mat,d){
    var d2=new Date();
    if(d)d2=new Date(d);
    var fm=Ext.Date.format(d2,mat);
    return fm;
}

/**
 * Ext5.0 LoadMask后要加componet
 * @param msg 提示语
 * @returns {LoadMask}
 * @constructor
 */
function LoadMask(msg){
    return new Ext.LoadMask(Ext.getBody().component, {msg:msg});
}

/**
 * Ext5.0 不再支持getSelected
 * @param grid 数据表
 * @constructor
 */
function GetSelected(grid){
    return grid.getSelectionModel().getSelection()[0];
}

function JsonStore(mod,pageSize,url,field,AutoLoad){
    AutoLoad=AutoLoad?AutoLoad:true;
    Ext.define(mod, {
        extend: 'Ext.data.Model',
        fields: field
    });
    var store = Ext.create('Ext.data.Store', {
        model: mod,
        pageSize:pageSize,
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
        autoLoad:AutoLoad
    });
    return store;
};


/**
 * 通过dataIndex获取索引
 * @param dataIndex
 * @param columns
 * @returns {*}
 */
function get_grid_header_index(dataIndex, columns){
    for (var i in columns){
        var nd = columns[i];
        try{
            if ( nd.dataIndex == dataIndex ) return i;
        }catch(e){};
    };
    return -1;
};


/**
 * 显示标签的方法
 * @param label
 * @returns {Array}
 */
var _label_array_ = [];
function show_label(label){
    var lb_txt = [];
    try{
        var lb = Ext.decode(label);
        for (var i=0; i<lb.length; i++){
            lb_txt.push('<span class="ziyo_label label_icon_'+ in_array(lb[i], _label_array_) +'">'+ lb[i] +'</span>');
        }
    }catch(e){
        clog(e);
    }
    return lb_txt;
}

function ziyo_label(id,type){
    //标签相关代码开始
    var label_data = [];
    var label_index = 0;
    try{
        if(type == 'search'){
            label_data.push({ text: '全部', iconCls:'', handler:search_label });
            label_data.push({ text: '未标记', iconCls:'', handler:search_label });
        }
        if (_label_){
            for (var c in _label_){
                if (typeof _label_[c] == 'function') continue;
                if (label_data.length>0) label_data.push('-');
                Ext.each(_label_[c], function(item, i){
                    _label_array_.push(item);
                    if(type == 'search'){
                        label_data.push({ text: item, iconCls:'label_icon_'+label_index, handler:search_label }); //这个set_label请参考本方法后面的注释
                    }else{
                        label_data.push({ text: item, iconCls:'label_icon_'+label_index, handler:set_label }); //这个set_label请参考本方法后面的注释
                    }
                    label_index++;
                });
            }
            var mark_menu = Ext.create('Ext.menu.Menu', {
                items: label_data
            });
            Ext.getCmp(id).setMenu(mark_menu);
        }
    }catch(e){
        clog(e);
    }
}



function updateEndTime()
{
    var date = new Date();
    var time = date.getTime();
    $(".set_time").each(function(i){
        var endDate =this.getAttribute("expireTime"); //结束时间字符串
        var lag = (parseInt(endDate)*1000 - time) / 1000; //当前时间和结束时间之间的秒数
        if(endDate==0){
            $(this).empty();
        }else if(lag > 0)
        {
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var hour = Math.floor((lag / 3600) % 24);
            var day = Math.floor((lag / 3600) / 24);
            day=day?day+'天':'';
            hour=hour?hour+'小时':'';
            minite=minite?minite+'分':'';
            $(this).html('<em></em>请于'+day+hour+minite+second+"秒内完成支付");
        }
        else
            $(this).html("已超期");
    });
    setTimeout(updateEndTime,1000);
}

/**
 *  ☆☆☆☆ ★★★★★ 请勿删除 ★★★★★ ☆☆☆☆
 *
 * 以下代码配合上标签设置用，需要在每个调用的功能中重载下面的方法
     window.set_label = function(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您想标记的计划单数据。');
        var team_id = row.get('team_id');
        if (team_id==''||team_id=='0') return ExtAlert('标签只能对已经生成的计划单进行标记。');

        var data = {team_id:team_id, team_label: b.text};
        Ext.Ajax.request({
            url:__app__ + '/TeamPlan/set_label',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                QtipMsg('友情提醒', info.msg, {direction:'t', width:210});
                if (ret.status){
                    row.set('team_label', info.label);
                }
            },
            failure:function (response, otps) {
                QtipMsg('友情提醒', '设置标签操作失败', {direction:'t', width:210});
            }
        });
    }

 */
