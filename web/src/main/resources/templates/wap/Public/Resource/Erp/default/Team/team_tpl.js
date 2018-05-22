/**
 * Created by zsl on 16-3-3.
 */
Ext.onReady(function(){
    var tpl_url = $__app__ + '/Team/team_tpl_json';
    var tpl_field = [];
    var tpl_store = new SUNLINE.JsonStore(tpl_url, tpl_field);
    var team_tpl = new Ext.XTemplate('<div id="tpl-id">',
        '<tpl for=".">',
        '<div class="tpl-list"><ul>' +
            '<li class="tl-title">' +
                '<span class="tool-cls">' +
                    /*'<span class="tool-edit" onclick="TeamTplNumber(\'编辑\',\'{tm_number}\')">编辑</span>' +
                    '<span class="tool-del" onclick="TeamTplDel(\'{tm_number}\')">删除</span>' +
                    '<span class="tool-use" onclick="TeamTplNumber(\'使用\',\'{tm_number}\')">使用</span>' +*/
                '{[ this.TeamTplEvent(values)]}'+
                '</span>' +
                '<span class="brand-cls">【{tm_tpl_type}】</span>' +
                '<span class="tpl-name">{tm_tpl_name}</span>' +
                '<span class="tpl-days">{tm_day}日</span>' +
                '<span class="tpl-eat">{tm_eat}</span>' +
            '</li>' +
            '<li class="tl-detail">{tm_detail}<span class="clear"></span></li>' +
            '</ul>' +
            '</div>',
        '</tpl>',
    '</div>',{
            TeamTplEvent:function(v){
                var href='';
                if(isDisabled('TeamList::edit_tpl')===false){
                    href+= '<span class="tool-edit" onclick="TeamTplNumber(\'编辑\',\''+ v.tm_number+'\')">编辑</span>';
                }
                if(isDisabled('TeamList::del_tpl')===false){
                    href+= '<span class="tool-del" onclick="TeamTplDel(\''+ v.tm_number+'\')">删除</span>';
                }
                if(isDisabled('TeamList::tpl_data')===false){
                    href+= '<span class="tool-use" onclick="TeamTplNumber(\'使用\',\''+ v.tm_number+'\')">使用</span>';
                }
                return href;
            }
        }
    );
    var team_view = new Ext.DataView({
        region:'center',
        store:tpl_store,
        tpl:team_tpl,
        autoHeight:true,
        multiSelect:true,
        border:false,
        overClass:'header-view-over',
        selectedClass:'header-view-selected',
        itemSelector:'div.thumb-wrap',
        emptyText: '前暂无团队模版信息...'
    });
    var tm_type_box=SUNLINE.DictComBox_false({name:'tpl_type',fieldLabel:"品牌系列",labelWidth:60,width:200, labelAlign:'right',forceSelection:false},{'d_type':'品牌系列'});
    //票种类型Box
    var tm_day_box=SUNLINE.LocalComob({
        id:'tpl_day',
        fields:['tpl_day'],
        data:[['全部'],['1'],['2'],['3'],['4'],['5'],['6'],['7'],['8'],['9']],
        config:{
            fieldLabel:'行程天数',
            labelWidth:60,
            width:160,
            value:'全部'
        }
    });

    var Panel = Ext.create('Ext.panel.Panel',{
        frame:false,
        region:'center',
        layout :'border',
        bodyStyle : 'background:#fff',
        /*autoScroll:true,*/
        items:[team_view],
        tbar:[
            {text:'添加模板',iconCls:'button-add',handler:addTeam,disabled:isDisabled('TeamList::add_tpl')},'-',
            tm_type_box.box,'-',
            tm_day_box,'-',
            {text:'查询', iconCls:'button-sch',handler:search_tpl},'->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '订单号、游客信息、航班号、、团队编号',
                width:280,
                onTriggerClick:function(e){
                    tpl_Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            tpl_Search();
                    }
                }
            },'-',
            {text:'关闭',handler:function(){
                parent.CloseTab(true);
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:tpl_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'前暂无团队模版信息'
        })
    });

    function addTeam(){
        parent.OpenTab('添加团队', 'Team', '', $__app__+'/Team/index/type/tpl', 1);
    }

    function tpl_Search(){

    }

    function search_tpl(){
        var post=search_json();
        console.log(post)
        SUNLINE.baseParams(tpl_store,post,true);
        tpl_store.load();
    }

    /**
     * 获取查询条件
     * @returns {{}}
     */
    function search_json(){
        var tpl_type=tm_type_box.box.getValue();
        var tpl_day=tm_day_box.getValue();
        var skeys=Ext.getCmp('pl_Search').getValue();
        var post={tpl_type:tpl_type,tpl_day:tpl_day,skeys:skeys};
        if(!tpl_type)post.tpl_type='';
        if(!tpl_day || tpl_day=='全部')post.tpl_day='';
        if(!skeys)post.skeys='';
        return post;
    }

    //删除模版信息
    window.TeamTplDel=function(number){
        Ext.MessageBox.confirm('友情提示','你确认要删除当前团队模版信息吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/Team/team_tpl_del',
                params: {number:number},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        tpl_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    };
    window.TeamTplNumber=function(text,number){
        var status='used';
        if(text=='编辑') status='edit';
        parent.OpenTab(text+'团队模板', 'Team'+number, '', $__app__+'/Team/index/id/'+number+'/type/tpl/status/'+status, 1);
    }

    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })

});