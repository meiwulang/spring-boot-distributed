/**
 * Created by liwei on 2017/4/20.
 */
var pageSize = 20; //每页记录数
var notSelectedMsg = '请先选择您要操作的账单!';
var status_color = {'处理中':'#ff6331', '已提现':'#71dc1c', '已失败':'#8899AB', '已撤销':'#666666', '已合并':'#fda50d', '已受理':'#45b4fc'};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    //获取初始化失败数据
    var url = $__app__ + '/PayWithdraw/getFailureData';
    var field = ['w_id', 'w_number', 'w_in_orgid', 'w_in_orgname', 'w_bill_amount', 'w_bill_date', 'w_addtime', 'w_request_time', 'w_flag', 'w_uname', 'w_status', 'w_bill_fee', 'w_fee_tid', 'w_request_info'];
    var store = SUNLINE.JsonStore(url, field);

    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: "ID", dataIndex: "w_id", width:80, hidden: true},
        {header: "收款方ID", dataIndex: "w_in_orgid", width:80, hidden: true},
        {header: "提现状态", dataIndex: "w_status", width:100,renderer:format_status},
        {header: "账单编号", dataIndex: "w_number", width:200},
        {header: "账单日", dataIndex: "w_bill_date", width:100},
        {header: "收款方单位名称", dataIndex: "w_in_orgname", width:200},
        {header: "账单金额", dataIndex: "w_bill_amount",width:100,renderer:money},
        {header: "提现手续费", dataIndex: "w_bill_fee", width:100,renderer:money},
        {header:"实收金额",dataIndex:"w_bill_income",width:100,renderer:money},
        {header: "账单生成时间", dataIndex: "w_addtime",renderer:repay_time, width:180},
        {header: "请求提现时间", dataIndex: "w_request_time",renderer:repay_time, width:180},
        {header: "备注", dataIndex: "w_request_info", width:200},
    ];

    var w_status_combo = new Ext.form.ComboBox({
        colspan:3,
        id: 'w_status',
        name: 'w_status',
        fieldLabel:false,
        allowBlank:false,
        width:140,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['已失败'],['处理中'],['已受理'],['已提现'],['已合并'],['已撤销']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        editable:false,
        value:"已失败"
    });

    //配置ext面板
    var panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '暂时没有账单记录！'},
        tbar: [
            {
                xtype:'buttongroup',
                title:'提现失败预警',
                height:80,
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                style:'padding:2px',
                items:[
                    {text:'处理',tooltip:'对于已失败或处理中的提现会进行撤销，并重发提现指令，处理前会检查融数的提现状态，所以无需担心重复提现',id:"openProcessingWin",rowspan: 2,height:48,disabled:isDisabled("PayWithdraw::setProcessing"),iconCls: 'button-write',iconAlign: 'top',style:'margin-right:3px;',handler:openProcessingWin},
                    {text:'融数原生查询',tooltip:'主要给开发使用，输入相应参数，查询融数的提现/转账等订单数据',id:'search-withdraw',rowspan: 2,iconCls: 'button-edit',height:48,iconAlign: 'top',handler:searchWithdraw}
                ]
            },
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:6,
                items:[
                    {xtype:'tbtext',text: '提现状态：',height:29,style:'line-height:26px'},
                    w_status_combo,
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',height:50,handler:doSearch,style:'margin:3px 5px 3px 10px;'},
                    {text:'日志',rowspan:2,iconCls:'button-log',iconAlign: 'top',id:'ziyo_log_btn',height:50,style:'margin:3px 5px 3px 0px'},
                    {xtype:'tbtext',text:'提现日期：',height:29,style:'line-height:26px'},
                    new SUNLINE.ExtDateField({id: 'w_time_start',
                        name: 'w_time_start',labelWidth: 1,fieldLabel: false,width: 140,gang: 'w_time_end',start: true,value:''}
                    ),
                    {xtype:'tbtext',text:'~',height:29,style:'line-height:26px;text-align:center'},
                    new SUNLINE.ExtDateField({id: 'w_time_end',name: 'w_time_end',labelWidth: 1,fieldLabel: false,width: 140,gang: 'w_time_start',value: ''}
                    ),
                ]
            },
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'w_search',
                cls:'search-icon-cls',
                emptyText:'账单编号/收款方单位名称',
                width:200,
                onTriggerClick:function (e) {
                    doSearch(1);
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            doSearch(1);
                    }
                }
            },
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: ''
        }),
        viewConfig: { //面板可复制属性
            enableTextSelection: true
        },
    });
    ziyo_log({ listeners : [{grid: panel, action:'PaymentWithdraw', pk_id:'w_id'}] });
    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

    panel.getSelectionModel().on('select', function(sm,record){
        Ext.getCmp("openProcessingWin").setDisabled(true);
        if(record.data.w_status == '已受理' || record.data.w_status == '已失败'){
            Ext.getCmp("openProcessingWin").setDisabled(false);
        }
    });

    //处理窗口显示数据
    var basic_items = [
        {id:"w_id", name:"w_id",xtype:'hidden'},
        {id:"w_number", name:"w_number", fieldLabel:"原账单编号",readOnly:true},
        {id:"w_in_orgname", name:"w_in_orgname", fieldLabel:"收款方单位名称",readOnly:true},
        {id:"w_bill_amount", name:"w_bill_amount", fieldLabel:"账单金额",readOnly:true},
        {id:"w_bill_fee", name:"w_bill_fee", fieldLabel:"提现手续费",readOnly:true},
        {id:"w_bill_status", name:"w_bill_status", fieldLabel:"手续费状态",readOnly:true},
        {id:"w_request_info", name:"w_request_info", fieldLabel:"失败原因",readOnly:true},
    ];
    //处理窗口布局
    var data_form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,id:'form',border:false,width: 410,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{allowBlank:false,labelAlign:'right',width:380,labelWidth:100,height:25}
        },
        items: [
            {title:'基本信息',cls:'tcol1',items:basic_items},
            {title:'备注说明',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1.请确认当前账单已被第三方告知提现失败!</li><li>2.请确认已根据第三方反馈信息进行相应更改!</li><li>3.处理流程:将原账单设置为已撤销,重新生成一个数据一致的新账单,进入提现队列</li><li>4.重新生成的账单不会重复收取手续费</li></ul></div>'}
        ]
    });


    //处理窗口
    var data_win = new Ext.Window({
        title: '提现账单处理',
        width: document.body.clientWidth > 420 ? 420 : document.body.clientWidth - 20,
        autoHeight : true,
        closable:false,
        modal:true,
        style:'background:#fff',
        resizable:false,
        items: data_form,
        buttonAlign:'left',
        buttons:[
            {xtype:'tbtext',id:'hj',style:'font-weight:bold;color:blue',text:''},'->',
            {text:'处理',handler: setProcessing},
            {text:'关闭',handler:function(){data_win.hide();}
            }]
    });

    data_win.on("hide",function(){
        var f=data_form.getForm();
        f.reset();
    });

    //打开处理窗口
    function openProcessingWin() {
        var row = SUNLINE.getSelected(panel);
        if (!row) {
            Ext.Msg.alert('友情提示',notSelectedMsg);
            return false;
        }
        data_win.show();
        var w_bill_status = '未扣';
        if(row.data.w_fee_tid > 0){
            w_bill_status = '已扣';
        }
        var data = {'w_id':row.data.w_id,'w_number':row.data.w_number,'w_in_orgname':row.data.w_in_orgname,'w_bill_amount':row.data.w_bill_amount,'w_bill_fee':row.data.w_bill_fee,'w_bill_status':w_bill_status,'w_request_info':row.data.w_request_info};
        data_form.getForm().setValues(data);
    }
    //处理按钮事件
    function setProcessing() {
        var  form = data_form.getForm();
        var  data = form.getValues();
        var url = $__app__ + '/PayWithdraw/setProcessing';
        Ext.Ajax.request({
            url: url,
            params: {w_id: data.w_id},
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.success) {
                    store.reload();
                    data_win.hide();
                }else if(ret.info){
                    return ExtAlert('您无权操作本功能!', '提示');
                }
                return ExtAlert(ret.message, '提示');
            },
            failure: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                return ExtAlert(ret.message, '提示');
            }
        });
    }

    //原生查询窗口布局
    var search_form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,border:false,width: 510,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{allowBlank:true,labelAlign:'right',width:480,labelWidth:80,height:25}
        },
        items: [
            {title:'查询条件',cls:'tcol1',items:[
                {id:"s_starttime", name:"s_starttime", fieldLabel:"开始时间",emptyText:'如2017-08-16 10:00:00'},
                {id:"s_endtime", name:"s_endtime", fieldLabel:"结束时间",emptyText:'如2017-08-16 11:00:00'},
                SUNLINE.LocalComob({
                    fields: ['id', 'text'],
                    data: [
                        {id: '4016', text: '提现4016'},
                        {id: '3001', text: '转账3001'},
                        {id: '4015', text: '落单4015'},
                    ],
                    config: {
                        id: 's_funccode',
                        name: 's_funccode',
                        editable: false,
                        valueField: 'id',
                        displayField: 'text',
                        labelWidth: 80,
                        fieldLabel:"查询类型",
                        labelAlign: 'right',
                        width: 480,
                        emptyText:'请选择类型',
                    }
                }),
                {id:"s_userid", name:"s_userid", fieldLabel:"付款方ID",emptyText:'单位ID：如金豆云则填1'},
                {id:"s_intermerchantcode", name:"s_intermerchantcode", fieldLabel:"收款方ID",emptyText:'单位ID，如南京时尚则填S5171'},
                {id:"s_amount", name:"s_amount", fieldLabel:"交易金额",emptyText:'单位分，如100元则填写10000'},
            ]},
            {title:'融数返回数据',cls:'tcol2',items:[
                {id:'s_content',name:'s_content',xtype:'textareafield',width:480,height:150}
            ]}
        ]
    });


    //处理窗口
    var search_win = new Ext.Window({
        title: '查询融数提现、转账等数据',
        width: 530,
        height : 480,
        modal:true,
        style:'background:#fff',
        resizable:false,
        items: search_form,
        buttonAlign:'left',
        buttons:[
            {xtype:'tbtext',style:'font-weight:bold;color:blue',text:''},'->',
            {text:'关闭',handler:function(){search_win.hide();}},
            {text:'重置',handler: function(){search_form.getForm().reset();}},
            {text:'查询',handler: searchWithdraw}
        ]
    });

    function searchWithdraw(v){
        if(v.text=='查询'){
            if (!search_form.getForm().isValid()) {
                return ExtAlert('红色边框显示为必填项', '友情提示');
            };
            var myMask=new Ext.LoadMask({target:search_win,msg:'查询提交中，请稍候...'});
            myMask.show();
            var  data = search_form.getForm().getValues();
            var url = $__app__ + '/PayWithdraw/search_ruixue';
            Ext.Ajax.request({
                url: url,
                params: data,
                method: 'POST',
                success: function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var content = typeof ret.data=='object' ? Ext.encode(ret.data) : ret.data;
                    Ext.getCmp('s_content').setValue(js_beautify(content,1,'\t'));
                    myMask.hide();
                },
                failure: function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    return ExtAlert(ret.message, '提示');
                }
            });
        }else{
            var row = SUNLINE.getSelected(panel);
            if(row){
                search_form.getForm().setValues({s_funccode:'4016',s_userid:row.data.w_in_orgid,s_amount:row.data.w_bill_income*100});
            }
            search_win.show();
        }
    }

    //搜索查询数据
    function doSearch(is_key) {
        var keyword = '';
        if(is_key == 1){
            keyword = Ext.getCmp('w_search').getValue();
        }
        var w_status     = Ext.getCmp('w_status').getValue();
        var w_time_start = Ext.getCmp('w_time_start').getValue();
        var w_time_end   = Ext.getCmp('w_time_end').getValue();
        SUNLINE.baseParams(store,{keyword:keyword,w_status:w_status,w_time_start:w_time_start,w_time_end:w_time_end},true);
        store.currentPage = 1;
        store.load();
    }

    Ext.getCmp('w_status').on('change',function(){
        doSearch(0);
    })

    function repay_time(v){
        if(isNaN(v) || v==0){
            return '';
        }else{
            return getLocalTime(v);
        }
    }

    function getLocalTime(tm) {
        var t = Ext.Date.format(new Date(parseInt(tm) * 1000),'Y-m-d H:i:s');
        return t;
    }

    function format_status(v, m, r){
        return '<div style="width:52px;border-radius:3px;padding:2px 5px;color:#fff;background-color: '+status_color[v]+'">'+v+'</div>';
    };
});


//格式化json显示
window.js_beautify = function(js_source_text, indent_size, indent_character, indent_level){var input,output,token_text,last_type,last_text,last_word,current_mode,modes,indent_string;var whitespace,wordchar,punct,parser_pos,line_starters,in_case;var prefix,token_type,do_block_just_closed,var_line,var_line_tainted;function trim_output(){while(output.length&&(output[output.length-1]===' '||output[output.length-1]===indent_string)){output.pop()}}function print_newline(ignore_repeated){ignore_repeated=typeof ignore_repeated==='undefined'?true:ignore_repeated;trim_output();if(!output.length){return}if(output[output.length-1]!=="\n"||!ignore_repeated){output.push("\n")}for(var i=0;i<indent_level;i++){output.push(indent_string)}}function print_space(){var last_output=output.length?output[output.length-1]:' ';if(last_output!==' '&&last_output!=='\n'&&last_output!==indent_string){output.push(' ')}}function print_token(){output.push(token_text)}function indent(){indent_level++}function unindent(){if(indent_level){indent_level--}}function remove_indent(){if(output.length&&output[output.length-1]===indent_string){output.pop()}}function set_mode(mode){modes.push(current_mode);current_mode=mode}function restore_mode(){do_block_just_closed=current_mode==='DO_BLOCK';current_mode=modes.pop()}function in_array(what,arr){for(var i=0;i<arr.length;i++){if(arr[i]===what){return true}}return false}function get_next_token(){var n_newlines=0;var c='';do{if(parser_pos>=input.length){return['','TK_EOF']}c=input.charAt(parser_pos);parser_pos+=1;if(c==="\n"){n_newlines+=1}}while(in_array(c,whitespace));if(n_newlines>1){for(var i=0;i<2;i++){print_newline(i===0)}}var wanted_newline=(n_newlines===1);if(in_array(c,wordchar)){if(parser_pos<input.length){while(in_array(input.charAt(parser_pos),wordchar)){c+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos===input.length){break}}}if(parser_pos!==input.length&&c.match(/^[0-9]+[Ee]$/)&&input.charAt(parser_pos)==='-'){parser_pos+=1;var t=get_next_token(parser_pos);c+='-'+t[0];return[c,'TK_WORD']}if(c==='in'){return[c,'TK_OPERATOR']}return[c,'TK_WORD']}if(c==='('||c==='['){return[c,'TK_START_EXPR']}if(c===')'||c===']'){return[c,'TK_END_EXPR']}if(c==='{'){return[c,'TK_START_BLOCK']}if(c==='}'){return[c,'TK_END_BLOCK']}if(c===';'){return[c,'TK_END_COMMAND']}if(c==='/'){var comment='';if(input.charAt(parser_pos)==='*'){parser_pos+=1;if(parser_pos<input.length){while(!(input.charAt(parser_pos)==='*'&&input.charAt(parser_pos+1)&&input.charAt(parser_pos+1)==='/')&&parser_pos<input.length){comment+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos>=input.length){break}}}parser_pos+=2;return['/*'+comment+'*/','TK_BLOCK_COMMENT']}if(input.charAt(parser_pos)==='/'){comment=c;while(input.charAt(parser_pos)!=="\x0d"&&input.charAt(parser_pos)!=="\x0a"){comment+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos>=input.length){break}}parser_pos+=1;if(wanted_newline){print_newline()}return[comment,'TK_COMMENT']}}if(c==="'"||c==='"'||(c==='/'&&((last_type==='TK_WORD'&&last_text==='return')||(last_type==='TK_START_EXPR'||last_type==='TK_END_BLOCK'||last_type==='TK_OPERATOR'||last_type==='TK_EOF'||last_type==='TK_END_COMMAND')))){var sep=c;var esc=false;c='';if(parser_pos<input.length){while(esc||input.charAt(parser_pos)!==sep){c+=input.charAt(parser_pos);if(!esc){esc=input.charAt(parser_pos)==='\\'}else{esc=false}parser_pos+=1;if(parser_pos>=input.length){break}}}parser_pos+=1;if(last_type==='TK_END_COMMAND'){print_newline()}return[sep+c+sep,'TK_STRING']}if(in_array(c,punct)){while(parser_pos<input.length&&in_array(c+input.charAt(parser_pos),punct)){c+=input.charAt(parser_pos);parser_pos+=1;if(parser_pos>=input.length){break}}return[c,'TK_OPERATOR']}return[c,'TK_UNKNOWN']}indent_character=indent_character||' ';indent_size=indent_size||4;indent_string='';while(indent_size--){indent_string+=indent_character}input=js_source_text;last_word='';last_type='TK_START_EXPR';last_text='';output=[];do_block_just_closed=false;var_line=false;var_line_tainted=false;whitespace="\n\r\t ".split('');wordchar='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');punct='+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |='.split(' ');line_starters='continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');current_mode='BLOCK';modes=[current_mode];indent_level=indent_level||0;parser_pos=0;in_case=false;while(true){var t=get_next_token(parser_pos);token_text=t[0];token_type=t[1];if(token_type==='TK_EOF'){break}switch(token_type){case'TK_START_EXPR':var_line=false;set_mode('EXPRESSION');if(last_type==='TK_END_EXPR'||last_type==='TK_START_EXPR'){}else if(last_type!=='TK_WORD'&&last_type!=='TK_OPERATOR'){print_space()}else if(in_array(last_word,line_starters)&&last_word!=='function'){print_space()}print_token();break;case'TK_END_EXPR':print_token();restore_mode();break;case'TK_START_BLOCK':if(last_word==='do'){set_mode('DO_BLOCK')}else{set_mode('BLOCK')}if(last_type!=='TK_OPERATOR'&&last_type!=='TK_START_EXPR'){if(last_type==='TK_START_BLOCK'){print_newline()}else{print_space()}}print_token();indent();break;case'TK_END_BLOCK':if(last_type==='TK_START_BLOCK'){trim_output();unindent()}else{unindent();print_newline()}print_token();restore_mode();break;case'TK_WORD':if(do_block_just_closed){print_space();print_token();print_space();break}if(token_text==='case'||token_text==='default'){if(last_text===':'){remove_indent()}else{unindent();print_newline();indent()}print_token();in_case=true;break}prefix='NONE';if(last_type==='TK_END_BLOCK'){if(!in_array(token_text.toLowerCase(),['else','catch','finally'])){prefix='NEWLINE'}else{prefix='SPACE';print_space()}}else if(last_type==='TK_END_COMMAND'&&(current_mode==='BLOCK'||current_mode==='DO_BLOCK')){prefix='NEWLINE'}else if(last_type==='TK_END_COMMAND'&&current_mode==='EXPRESSION'){prefix='SPACE'}else if(last_type==='TK_WORD'){prefix='SPACE'}else if(last_type==='TK_START_BLOCK'){prefix='NEWLINE'}else if(last_type==='TK_END_EXPR'){print_space();prefix='NEWLINE'}if(last_type!=='TK_END_BLOCK'&&in_array(token_text.toLowerCase(),['else','catch','finally'])){print_newline()}else if(in_array(token_text,line_starters)||prefix==='NEWLINE'){if(last_text==='else'){print_space()}else if((last_type==='TK_START_EXPR'||last_text==='=')&&token_text==='function'){}else if(last_type==='TK_WORD'&&(last_text==='return'||last_text==='throw')){print_space()}else if(last_type!=='TK_END_EXPR'){if((last_type!=='TK_START_EXPR'||token_text!=='var')&&last_text!==':'){if(token_text==='if'&&last_type==='TK_WORD'&&last_word==='else'){print_space()}else{print_newline()}}}else{if(in_array(token_text,line_starters)&&last_text!==')'){print_newline()}}}else if(prefix==='SPACE'){print_space()}print_token();last_word=token_text;if(token_text==='var'){var_line=true;var_line_tainted=false}break;case'TK_END_COMMAND':print_token();var_line=false;break;case'TK_STRING':if(last_type==='TK_START_BLOCK'||last_type==='TK_END_BLOCK'){print_newline()}else if(last_type==='TK_WORD'){print_space()}print_token();break;case'TK_OPERATOR':var start_delim=true;var end_delim=true;if(var_line&&token_text!==','){var_line_tainted=true;if(token_text===':'){var_line=false}}if(token_text===':'&&in_case){print_token();print_newline();break}in_case=false;if(token_text===','){if(var_line){if(var_line_tainted){print_token();print_newline();var_line_tainted=false}else{print_token();print_space()}}else if(last_type==='TK_END_BLOCK'){print_token();print_newline()}else{if(current_mode==='BLOCK'){print_token();print_newline()}else{print_token();print_space()}}break}else if(token_text==='--'||token_text==='++'){if(last_text===';'){start_delim=true;end_delim=false}else{start_delim=false;end_delim=false}}else if(token_text==='!'&&last_type==='TK_START_EXPR'){start_delim=false;end_delim=false}else if(last_type==='TK_OPERATOR'){start_delim=false;end_delim=false}else if(last_type==='TK_END_EXPR'){start_delim=true;end_delim=true}else if(token_text==='.'){start_delim=false;end_delim=false}else if(token_text===':'){if(last_text.match(/^\d+$/)){start_delim=true}else{start_delim=false}}if(start_delim){print_space()}print_token();if(end_delim){print_space()}break;case'TK_BLOCK_COMMENT':print_newline();print_token();print_newline();break;case'TK_COMMENT':print_space();print_token();print_newline();break;case'TK_UNKNOWN':print_token();break}last_type=token_type;last_text=token_text}return output.join('')};
