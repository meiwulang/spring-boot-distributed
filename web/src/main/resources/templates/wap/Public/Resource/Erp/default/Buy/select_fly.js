/**
 * Created by Administrator on 2016/1/28.
 */
var SelectFly={};
Ext.onReady(function () {
    var sp_grid=ITEMS_YUN.FlySelect({site:site,fly:fly,start_date:start_date},function(row,stock,site_data){
        //选择行赋值事件
        SelectFly={};
        SelectFly = row;
        if(site_data){
            SelectFly.start_site=site_data.start;
            SelectFly.end_site=site_data.end;
        }
        if(stock){
            SelectFly['stock']=stock;
        }else{
            SelectFly['stock']='';
        }
        site_txt();
    });
    sp_grid.grid.render('fly-id');
    var grid=sp_grid.grid;
    var site_name=document.getElementById('fly_name');
    var fly_all=document.getElementById('fly_all');
    /*if(site!='yes'){
        var fly_in=document.getElementById('fly_in');
        fly_in.checked=true;
        site_name.checked=false;
        fly_all.checked=true;
        $('#fly_in').parent().hide();
    }else{
        site_name.checked=true;
        fly_all.checked=false;
        $('#fly_all').parent().hide();
    }*/
    function site_txt(){
        var str='';
        if(SelectFly){
            if(!SelectFly.fl_start_platform)SelectFly.fl_start_platform='';
            if(!SelectFly.fl_start_platform)SelectFly.fl_end_platform='';
            var stock='';
            if(SelectFly.stock){
                stock=' <span class="stock_fn">(库存)</span>';
            }
            str=SelectFly.fl_start_name+SelectFly.fl_start_platform+'('+SelectFly.fl_start_time+')—'+SelectFly.fl_end_name+SelectFly.fl_end_platform+'('+SelectFly.fl_end_time+') <b style="color: green">'+SelectFly.fl_number+'</b>'+stock;
        }
        $('.site-cls').html(str);
    }
    var confirm_id=$('.site-confirm');
    confirm_id.unbind();
    confirm_id.click(function(){
        if(!SelectFly.fl_number){
            layer.msg('请选择航班(次)号!');
            return false;
        }
        var vip_cls=$('.vip-cls');
        var traffic_val=radio_val('traffic');
        parent.fly_select_fn(SelectFly,tid,t_index,vip_cls.val(),fly_type,traffic_val);
        clos_layer_combox();
        console.log([vip_cls.val(),traffic_val]);
        return false;
        var site_name=document.getElementById('fly_name');
        var fly_in=document.getElementById('fly_in');
        var fly_big_in=document.getElementById('fly_big_in');
        var fly_all=document.getElementById('fly_all');
        var bool=false,bool_all=false;
        if(site_name.checked==true)bool=true;
        if(fly_all.checked==true)bool_all=true;
        //如果使用了库存，在些判断库存是否够用
        var fly_inval=1;
        if(fly_in.checked==true)fly_inval=0;
        if(fly_big_in.checked==true)fly_inval=1;
        parent.fly_select_fn(SelectFly,tid,t_index,bool,fly_type,fly_inval,bool_all);
        clos_layer_combox();
    });

    var site_cell=$('.site-cell');
    site_cell.unbind();
    site_cell.click(function(){
        clos_layer_combox();
    });
    function  clos_layer_combox(){
        var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
        parent.layer.close(index); //执行关闭
    }
});
