/**
 * Created by wangxinghuan on 15-4-10.
 */
var ROW={};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url=$__app__ + '/Station/address_json';
    var field=[
        'add_id','add_province','add_city','add_district','add_street','add_streetNum','add_x','add_y','add_address','add_station',
        'add_area'
    ];
    var store=new SUNLINE.JsonStore(url,field);

    window.form=new Ext.form.FormPanel({
//        border:false,
        region:'south',
//        layout:'column',
        formId:'m_form',
        height:340,
        bodyStyle:'padding:15px 20px/*;border-left:1px solid #000*/',
        defaultType:'textfield',
        buttonAlign:'left',
        labelAlign:'right',
        items:[
            {id:"add_id",name:"add_id",maxLength:'350',hidden:true},
            {id:"station",name:"add_station",fieldLabel:"站点名称",width:200,maxLength:'350',allowBlank:false},
            {id:"add_area",name:"add_area",fieldLabel:"自定区域",width:200,maxLength:'350',allowBlank:false,xtype:"combo",
                triggerAction:'all',
                emptyText:'请选择自定区域',
                store:[['A', 'A区'],
                    ['B', 'B区'],
                    ['C', 'C区'],
                    ['D', 'D区']]
            },
            {id:"all",name:"add_address",fieldLabel:"具体地址",width:200,maxLength:'350',disabled:true},
            {id:"add_province",name:"add_province",fieldLabel:"省份",width:150,maxLength:'350',allowBlank:false,disabled:true},
            {id:"add_city",name:"add_city",fieldLabel:"城市",width:150,maxLength:'350',allowBlank:false,disabled:true},
            {id:"add_district",name:"add_district",fieldLabel:"区县",width:150,maxLength:'350',allowBlank:false,disabled:true},
            {id:"add_street",name:"add_street",maxLength:'350',hidden:true},
            {id:"add_streetNum",name:"add_streetNum",maxLength:'350',hidden:true},
            {id:"add_x",name:"add_x",maxLength:'350',allowBlank:false},
            {id:"add_y",name:"add_y",maxLength:'350',allowBlank:false}
        ],
        buttons:[
//            {text:'重置',handler:clear},
            {text:'新增',id:'add_update', style:'margin-left:100px',handler:save,disabled:isDisabled('Station::save_address')}
        ]
    });

    var org_panel = new Ext.Panel({
        layout : 'border',
        region : 'north',
        border : false,
        tbar : [
//            {text:'重置',act:'add',iconCls:'button-add',handler:address_add},'-',
//            {text:'更新',act:'edit',iconCls:'button-edit',handler:update},'-',
            {text:'删除',act:'del',iconCls:'button-del',handler:add_del,disabled:isDisabled('Station::address_del')},'-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                emptyText:'站点名称',
                width:200,
                onTriggerClick:function (e) {
                    do_search();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            do_search();
                    }
                }
            },'->',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载八达通站点管理',
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip("订单管理"),
                handler:function () {
                    parent.CloseTab();
                }
            }
        ]
    });
//    var clientwidth = $(window).width();
    var grid=new Ext.grid.GridPanel({
        region:'west',
        border:false,
        width:750,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        columns:[
            new Ext.grid.RowNumberer,
            {header:'ID',dataIndex:'add_id',hidden:true},
            {header:'自定区域',dataIndex:'add_area',width:80,renderer:d_area,sortable:true},
            {header:'站点名称',dataIndex:'add_station',width:170},
            {header:'省份',dataIndex:'add_province',width:100},
            {header:'城市',dataIndex:'add_city',width:100},
            {header:'区县',dataIndex:'add_district',width:100},
            {header:'地址（街道/街号）',dataIndex:'add_address',width:150}
//            {header:'街道',dataIndex:'add_street',width:100},
//            {header:'街道号',dataIndex:'add_streetNum',width:100},
//            {header:'坐标x',dataIndex:'add_x'},
//            {header:'坐标y',dataIndex:'add_y'}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有地址信息'
        })
    });

    function d_area(v){
        var s='';
        if(v=='A') s='<div style="color: red"> A区</div>';
        if(v=='B') s='<div style="color: blue">B区</div>';
        if(v=='C') s='<div style="color: green">C区</div>';
        if(v=='D') s='<div style="color: black">D区</div>';
        return s;
    }

    var Panel=new Ext.Panel({
        region:'center',
        border:false,
        layout:'border',
//        html:'<iframe id="ifm_map" name="ifm_map" src="'+$__app__+'/Station/map_address_html" width="100%" height="100%" frameborder=0 ></iframe>',
        items:[
            form,
            {
                region:'center',
                border:false,
                html:'<iframe id="ifm_map" name="ifm_map" src="'+$__app__+'/Station/map_address_html" width="100%" height="100%" frameborder=0 ></iframe>'
            }
        ]
    });
    function save(v){
        var formValue=form.getForm().getFieldValues();
        if(!formValue.add_x){
            Ext.Msg.alert('提示信息','请点击 地图 获取地址!');
            return false;
        }
        if(!form.form.isValid()){
            Ext.Msg.alert('提示信息','请完成红色区域内容！');
            return false;
        }
        if(v.text=='新增'){
            formValue.add_id='';
        }

//        Ext.Msg.alert('提示信息',Ext.encode(formValue));
//        return;
        Ext.Msg.confirm('提示aa信息','您确定要把'+formValue.add_address+v.text+'到您的常用地址吗？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/Station/save_address',
                    method:'POST',
                    params:formValue,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status){
                            Ext.Msg.alert('友情提示', '站点名称'+ret.info);
                            store.reload();
                        }else{
                            Ext.Msg.alert('友情提示', '站点名称'+ret.info);
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '地址保存失败！');
                    }
                })
            }
        });

    }

    function clear(){//如果未点击更新 添加按钮无作用时候
        Ext.getCmp('add_update').setText('新增');
        ROW={};
        window.ifm_map.clear();
        set_value(ROW);
    }

    function add_del(){
        var row=grid.getSelectionModel().getSelected();
        if(!row){
            Ext.Msg.alert('提示信息','请选择要删除的地址!');
            return false;
        }
//
//        Ext.Msg.alert('提示信息',Ext.encode(row.data));
//        return;

        Ext.Msg.confirm('提示aa信息','您确定要把'+row.data.add_address+'从常用地址里删除吗？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/Station/address_del',
                    method:'POST',
                    params:row.data,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status){
                            Ext.Msg.alert('友情提示', ret.info);
                            store.reload();
                        }else{
                            Ext.Msg.alert('友情提示', ret.info);
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '地址保存失败！');
                    }
                })
            }
        });

    }

    function do_search(){
        var skey = Ext.getCmp('search').getValue();
        if(!skey){
            Ext.Msg.alert('提示信息','请输入站点名称！');
            return false;
        }
        store['baseParams'] = {skey:skey};
        store.load();
    }

    function do_map_search(){//地图搜索
        var skey = Ext.getCmp('map_search').getValue();
        window.ifm_map.searche_point(skey);
    }

    new Ext.Viewport({
        layout:'border',
        items:[grid,org_panel,Panel]
    });

    grid.getSelectionModel().on('rowselect',function(sm, index, record){
        Ext.getCmp('add_update').setText('更新');
        var data=record.data;
        window.ifm_map.set_map(data);
        form.getForm().setValues(data);
    });

    function valll(){
        alert(1);
    }
});

function set_value(value){
    var data={};
    Ext.getCmp('add_update').setText('新增');
    data.add_address=value.address;
    data.add_province=value.province;
    data.add_city=value.city;
    data.add_district=value.district;
    data.add_street=value.street;
    data.add_streetNum=value.streetNumber;
    data.add_x=value.x;
    data.add_y=value.y;
    if(typeof (value.station)!=="undefined"){
        data.add_station=value.station;
    }
    form.getForm().reset();//清空原来的内容
    form.getForm().setValues(data);
}
