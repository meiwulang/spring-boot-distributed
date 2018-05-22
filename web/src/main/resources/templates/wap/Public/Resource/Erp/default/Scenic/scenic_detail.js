var PicStore=[{img_id:'scenic_max',img_name:'产品相册'}];

Ext.onReady(function(){

    /*alert(data_save['sc_remark'])
    alert(data_ri_save['ri_remark'])*/



    Ext.create('Ext.form.HtmlEditor', {
        width: 960,
        height: 250,
        id:'small_id_val_0',
        style:'border-radius:5px',
        renderTo:'small_id_0'
    });
    /*Ext.create('Ext.form.HtmlEditor', {
        width: 870,
        height: 250,
        id:'small_id_val_1',
        style:'border-radius:5px',
        renderTo:'small_id_1'
    });
    Ext.create('Ext.form.HtmlEditor', {
        width: 870,
        height: 250,
        id:'small_id_val_2',
        style:'border-radius:5px',
        renderTo:'small_id_2'
    });*/

    var par_id;
    var url=$__app__ + '/Products/scenic_img';
    var field = [];
    var pic_store = new SUNLINE.JsonStore(url, field,false);
    var imageTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="thumb-wrap scenic-cls">',
        '<i class="fa fa-check-circle"></i><img src="'+$app_root+'{at_url}" />',
        '</div>',
        '</tpl>'
    );
    var pic_view=Ext.create('Ext.view.View', {
        store: pic_store,
        tpl: imageTpl,
        simpleSelect:true,
        multiSelect :true,
        overClass:'header-view-over',
        selectedClass:'header-view-selected',
        itemSelector:'div.thumb-wrap',
        emptyText: '没有图片信息'
    });
    var combox_sc=SUNLINE.ComBoxPlus({
        fields:['img_id','img_name'],
        action:'local',
        storeData:PicStore,
        id:'img_name'
    });

    var pic_panel=Ext.create('Ext.panel.Panel',{
        height:420,
        tbar:[
            '<b>选择图片类型：</b>',
            '->','快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'Search_key',
                emptyText : '景区名称,图片名称',
                width:250,
                onTriggerClick:function(e){
                    _Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            _Search();
                    }
                }
            }
        ],
        items:[pic_view],
        bbar:new Ext.PagingToolbar({
            pageSize:15,
            store:pic_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });

    function _Search(){

    }

    var pic_win=Ext.create('Ext.window.Window',{
        title : '添加行程图片',
        width : 800,
        height:510,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        padding:6,
        resizable:false,
        fixed:true,
        modal:true,
        items:[pic_panel],
        buttons: [
            {text : '保存',handler:add_img},
            {text : '上传图片',handler:img_upload},
            {text : '关闭', handler:function(){pic_win.hide();}}
        ]
    });

    pic_win.on('show',function(){
        //SUNLINE.baseParams(pic_store,{at_table_id:source_id,at_model:'景点',at_table:'scenic'});
        SUNLINE.baseParams(pic_store,{at_id:get_sc_id,type:'scenic'});
        pic_store.load();
    });

    function add_img(b){
        var pic_id=par_id.find('.pic-box');
        var pic_length=0;
        if(pic_id.html())pic_length=pic_id.find('.list-pic').length;
        var row=pic_view.getSelectionModel().getSelection();
        if((row.length+pic_length)>4){
            Ext.Msg.alert('友情提示','每天只可以上传4张图片,请重新选择!');
            return false;
        }
        var str_img='';
        $.each(row,function(i,v){
            var r= v.data;
            str_img+='<div class="list-pic"><i class="fa fa-times-circle"></i><img src="'+$app_root+r.at_url+'"></div>';
        })
        pic_id.prepend(str_img);
        pic_win.hide();
        remove_pic();
        //remove_small();
    }

    /******************** 相册  start ***************************/
    var upload_win=new Ext.Window({
        title:'上传图片',
        width:650,
        height:400,
        closeAction:'hide',
        fixed:true,
        modal:true,
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>',
        buttons:[
            {text:'关闭',handler:add_load}
        ]
    });
    /******************** 相册  end ***************************/

    function img_upload(){
        upload_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/景点/table_id/'+get_sc_id;
    };

    function add_load(){
        /*var img_check=$('.img-check');
        $.each(img_check,function(ii,vv){
            alert(33)
        });
        $('.img-check').each(function(){
            aa=$(this).attr('data-index')
            console.log(aa);
            alert(11)
        })
        $('.img-check').each(function(i,v){
            alert(444)
        })
        alert(22)*/

        pic_store.load();
        upload_win.hide();

    };


    add_pic();
    function add_pic(){
        var add_pic=$('.add-pic');
        add_pic.unbind();
        add_pic.click(function(){
            var info_box=$(this).parents('.detail-img-box');
            par_id=info_box;
            pic_win.show();
        });
    }

    var ii=1;
    $('.add-small').click(function(){
        var tpl='<li class="p-li p-l2 detail-img-box"><ul><li class="y-li"><ul><li class="i-ltop i-ltop1">小景区标题 : </li> ' +
            '<li class="i-ltop i-ltop2"><input type="text" class="t-title" name="title"></li><li class="i-ltop i-ltop4"></li> ' +
            '<li class="i-ltop i-ltop3 add-pic"> <i class="fa fa-picture-o"></i> 添加图片</li><li class="i-ltop i-ltop5">删除</li> <li class="clear"></li> </ul></li> ' +
            '<li class="y-li y-li2" id="small_id_'+ii+'"><input type="hidden" name="id_val" value="small_id_val_'+ii+'">' +
            '</li><li class="y-li"> <li class="y-li y-li3 pic-box"><div class="clear"></div>' +
            '</li>  </ul></li>';
        $('.y-ul').append(tpl);
        Ext.create('Ext.form.HtmlEditor', {
            width: 870,
            height: 250,
            id:'small_id_val_'+ii,
            renderTo: 'small_id_'+ii
            //value:detail_id.html()
        });
        ii++;
        add_pic();
        remove_small();
        var old_height=parseFloat(($(this).offset().top));
        var height=parseFloat(($(this).offset().top))+370;
        cartoon_fn(old_height,height,function(i){
            $(window).scrollTop(i);
        },500,50);

        function cartoon_fn(ff,dfto,fn,speed,size){
            var df=ff;
            var is_time=setInterval(function(){
                if(ff>dfto){
                    if(df<=dfto){
                        clearInterval(is_time);
                        return;
                    }
                    df-=size;
                }else{
                    if(df>=dfto){
                        clearInterval(is_time);
                        return;
                    }
                    df+=size;
                }
                fn(df);
            },speed);
        };

    })
    /*console.log(data_save)
    console.log(data_ri_save)


    for(var i in data_ri_save){
        for(j in data_ri_save[i]['ri_text'])
        console.log(data_ri_save[i]['ri_text'][j])
    }*/



    function save_dosave(){
        var str_img='';
        for(var i in data_save['sc_more_image']){
            if(typeof(data_save['sc_more_image'][i])=='string'){
                var url=data_save['sc_more_image'][i].substring(1)
                str_img+='<div class="list-pic"><i class="fa fa-times-circle"></i><img src="'+$app_root+url+'"></div>';
            }
        }
        //$('#pic-box-0').append(str_img);
        $('.pic-box').append(str_img);
        Ext.getCmp('small_id_val_0').setValue(data_save['sc_remark']);


        for(var i in data_ri_save){
            var tpll='';
            if(typeof(data_ri_save[i])=='object'){
                var str_img_fen='';
                for(var j in data_ri_save[i]['ri_text']){
                    var url='';
                    if(data_ri_save[i]['ri_text']['length']!=0){
                        if(typeof(data_ri_save[i]['ri_text'][j])=='string'){
                             url=data_ri_save[i]['ri_text'][j].substring(1);
                             str_img_fen+='<div class="list-pic"><i class="fa fa-times-circle"></i><img src="'+$app_root+url+'"></div>';
                        }
                    }
                }
                var ff=Number(i)+1;
                tpll+='<li class="p-li p-l2 detail-img-box"><ul><li class="y-li"><ul><li class="i-ltop i-ltop1">小景区标题 : </li> ' +
                    '<li class="i-ltop i-ltop2"><input type="text" class="t-title" name="title" value="'+data_ri_save[i]['ri_title']+'"></li><li class="i-ltop i-ltop4"></li> ' +
                    '<li class="i-ltop i-ltop3 add-pic"> <i class="fa fa-picture-o"></i> 添加图片</li><li class="i-ltop i-ltop5">删除</li> <li class="clear"></li> </ul></li> ' +
                    '<li class="y-li y-li2" id="small_id_'+ff+'"><input type="hidden" name="id_val" value="small_id_val_'+ii+'">' +
                    '</li><li class="y-li"> <li class="y-li y-li3 pic-box">'+str_img_fen+
                    '<div class="clear"></div></li></ul></li>';
                ii++;
                $('.y-ul').append(tpll);
            }
        }
        add_pic();
        remove_pic();
        remove_small();
    }
    save_dosave();

    function remove_pic(){
        var fa=$('.fa-times-circle');
        fa.unbind();
        fa.click(function(){
            var this_id=$(this).parents('.list-pic');
            this_id.remove();
        });

    };

    function remove_small(){
        var ffa=$('.i-ltop5');
        ffa.unbind();
        ffa.click(function(){
            var this_id=$(this).parents('.detail-img-box');
            this_id.remove();
        });
    };
    for(var f=1;f<=num_detail;f++){
        var ff=f-1;
        Ext.create('Ext.form.HtmlEditor', {
            width: 870,
            height: 250,
            id:'small_id_val_'+f,
            style:'border-radius:5px',
            renderTo:'small_id_'+f,
            value:data_ri_save[ff]['ri_big_text']
        });
    }
});
function save_data(){
    var info_id=$('.detail-img-box');
    var info_data=[];
    $.each(info_id,function(i,v){
        var days_id=info_id.eq(i);
        //获取图片信息
        var pic_data=[];
        var pic_id=days_id.find('.pic-box .list-pic');
        if(pic_id.length){
            $.each(pic_id,function(i,v){
                pic_data[i]=pic_id.eq(i).find('img').attr('src');
            })
        };
        pic_data=Ext.encode(pic_data);
        var num=days_id.find('input[name=id_val]').val();
        //console.log(pic_data)
        info_data[i]={
            title:days_id.find('input[name=title]').val(),
            detail_text:Ext.getCmp(num).getValue(),
            pic_img:pic_data
        }
    });
    info_data=Ext.encode(info_data);
    var detail_data={};
    detail_data['info']=info_data;

    //console.log(info_data)
    return detail_data;
}