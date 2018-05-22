var DATA=[];//储存坐标值  把坐标值输出到地图上显示
var parms={};//储存参数和page（点击行政区 搜索的）
var points={};//储存坐标值和page（自定义搜索功能 搜索的）
var da={};//储存 选择地点 的对象
var map_data={};
$(function(){
    window.onload=default_index;
    //头部行政区域
    var areaV=$(".map_left").find('.top');
    var area_a=areaV.find('.area');
    area_a.live('click',function(){//行政区域按钮点击
        if($(this).hasClass('area_block'))return false;
        da={};
        $(this).parent().find('.area').removeClass('area_block');
        $(this).addClass('area_block');
        var skey=$(this).text();
        area_search(skey);
        ifm.window.get_point1('南京市'+skey);
    });

    var area_more=$('.top .more');
    var more_block=$('.top .area_none');
    var more_hide=$('.top .area_hide');
    var area_box=$('.area-box');
    area_more.click(function(){
        area_more.hide();
        more_block.addClass('area_show');
        more_hide.addClass('area_show');
        area_box.addClass('area-box-border');
    });
    more_hide.click(function(){
        area_more.show();
        more_block.removeClass('area_show');
        more_hide.removeClass('area_show');
        area_box.removeClass('area-box-border');
    });

    var submit=$('.tijiao').find('span');
    submit.live('click',function(){//提交按钮点击
        if(!da.ad_id){
            alert('请选择地址！')
            return false;
        }
        alert('ID:'+da.ad_id+';add_address:'+da.address+';add_area:'+da.area);
    });

    var tr=$('.map-table').find('.m-list');
    tr.live('click',function(){
        $('.m-list').removeClass('selected');
        $(this).addClass('selected');
        da.ad_id=$(this).attr('data-id');
        da.address=$(this).find('#add_address').text();
        da.area=$(this).find('#add_area span').text();
        var info={};
        $.each(map_data,function(i,v){
            if(v['add_id']==da.ad_id){
                info=v;
                return false;
            }
        });
        ifm.window.markerDisplay({add_x: info.add_x,add_y: info.add_y});
    });

    var p=$('.page');

    function ajaxPage(parms,N,Cl){
        $.ajax({
            type:"POST",
            url:$__app__ + "/Station/search_json",
            data:parms,
            success:function (msg) {
                var row = msg;
                if (typeof msg != 'object')
                    row = eval("(" + msg + ")");
                var info=row.info;
                if(row.status==1){
                    List(info.data);
                    map_data=info.data;
                    var start=1;
                    var limit=5;
                    if(N>3){
                        start=N-2;
                    }

                    ali(info.total,start,limit,Cl,N);
                }else{
                    $(".index_box").hide();
                }
            }
        })
    }
    function default_index(){
        parms.page=0;
        parms.skey='全部';
        $.ajax({
            type:"POST",
            url:$__app__ + "/Station/search_json",
            data:parms,
            success:function (msg) {
                var row = msg;
                if (typeof msg != 'object')
                    row = eval("(" + msg + ")");
                var info=row.info;
                if(row.status==1){
                    List(info.data);
                    map_data=info.data;
                    ali(info.total,1,5,'p',1);
                }else{
                    $(".index_box").hide();
                }
            }
        })
    };
    p.find('.index').live('click',function(){//点击 分页的首页
        if(typeof(parms.lng)!=='undefined'){
            var pp={};
            pp.lng=parms.lng;
            pp.lat=parms.lat;
            pointSelectSql(pp);
        }else if(parms.skey!=='全部' && typeof(parms.skey)){
            area_search(parms.skey);
        }else{
            default_index()
        }

    });

    p.find('.pre').live('click',function(){//点击上一页
        var Cl='';
        if(p.find('.pa').outerHTML){
            Cl='pa';
        }else{
            Cl='p';
        }
        var N=p.find('.clicked').text();
        parms.page=N-2;
        ajaxPage(parms,N-1,Cl);
    });

    p.find('.next').live('click',function(){//点击下一页
        var Cl='';
        if(p.find('.pa').outerHTML){
            Cl='pa';
        }else{
            Cl='p';
        }
        var N=p.find('.clicked').text();
        parms.page=N;
        N=Number(N)+1;
        ajaxPage(parms,N,Cl);
    });

    p.find('.p').live('click',function(){//点击分页数
        parms.page=$(this).text()-1;
        var N=$(this).text();
        ajaxPage(parms,N,'p');
    });

    p.find('.pa').live('click',function(){//点击分页数 （自定义搜索框得到的）
        parms.page=$(this).text()-1;
        var N=$(this).text();
        ajaxPage(parms,N,'pa');
    });

});

/**
 *
 * @param v  总共的分页数
 * @param start 起始位置
 * @param limit 最多显示几条
 * @param Cl html 类
 * @param n 被点击分页的数字
 */
function ali(v,start,limit,Cl,n){//分页
    var page=$('.page');
    var str='';

    if(v>1){//组织html代码  当总页数大于1的时候   显示分页
        pageList(v,start,limit,Cl,n);
    }else{
        page.html(" ");
    }
    if(n>3){
        page.find('.index').show();//显示首页
    }
    if(n>1){
        page.find('.pre').show();//显示上一页
    }
    if(v-n==0){
        page.find('.next').hide();//显示下一页
    }
}

function pageList(v,start,limit,Cl,n){//组织html代码
    var page=$('.page');
    var i=start;
    var m=start+limit;

    if(start+limit>v+1){
        m=v+1;
    }

    if(v+1<=limit){
        m=v+1
    }

    var str='';
    str='<a class="index" style="display: none">首页</a>' +
        '<a class="pre" style="display: none">上一页</a>';
    for(i;i<m;i++){
        str+=aTpl(i,Cl);
    }
    str+='<a class="next">下一页</a>';
    if(v==1){
        str='';
    }
    page.html(str);

    if(start>1){
        page.find('.p:eq(2)').addClass('clicked');
        page.find('.pa:eq(2)').addClass('clicked');
    }else{
        page.find('.p:eq('+(n-1)+')').addClass('clicked');
        page.find('.pa:eq('+(n-1)+')').addClass('clicked');
    }
}

function aTpl(i,Cl){//分页模板
    var t='';
    t='<a class="'+Cl+'">' +i + '</a>';
    return t;
}



function area_search(skey){
    parms.page=0;
    parms.skey=skey;
    $.ajax({
        type:"POST",
        url:$__app__ + "/Station/search_json",
        data:parms,
        success:function (msg) {
            var row = msg;
            if (typeof msg != 'object')
                row = eval("(" + msg + ")");
            var info=row.info;
            if(row.status==1){
                List(info.data);
                map_data=info.data;
                ali(info.total,1,5,'p',1);
            }else{
                $(".index_box").hide();
            }
        }
    })
}

function pointSelectSql(point){//获取坐标 去搜索数据库
    parms={};
    parms.page=0;
    parms.lng=point.lng;
    parms.lat=point.lat;
    $.ajax({
        type:"POST",
        url:$__app__ + "/Station/search_json",
        data:parms,
        success:function (msg) {
            var row = msg;
            if (typeof msg != 'object')
                row = eval("(" + msg + ")");
            var info=row.info;
            if(row.status==1){
                List(info.data);
                ali(info.total,1,5,'pa',1);
            }else{
                $(".index_box").hide();
            }
        }
    })
}

function List(data){
    var str='<li class="m-th">' +
        '<div class="map_name">站点名称</div>' +
        '<div class="map_q">所属区域</div>' +
        '</li>';
    DATA=[];
    ifm.window.clear();
    $.each(data,function(i,v){
        str+=Tpl(v);
        DATA.push([v.add_x, v.add_y]);
    });
    ifm.window.set_point(DATA);
    $('.map-table').html('<ul>'+str+'</ul>');
}

function Tpl(data){
    var tpl='';
    tpl='<li class="m-list" data-id="'+data.add_id+'">' +
        '<div class="map_name" id="add_address"><span class="txt">'+data.add_address+'</span></div>'+
        '<div class="map_q" id="add_area"><span>'+data.add_area+'</span>区</div>' +
        '</li>';
    return tpl;
}

function selected(index){//点击地图获取坐标，获取索引值
    da={}
    var i=index;
    var tr=$('.map-table').find('.m-list');
    var t=tr.eq(i);
    tr.removeClass('selected');
    t.addClass('selected');
    da.ad_id=t.attr('data-id');
    da.address=t.find('#add_address').text();
    da.area=t.find('#add_area span').text();
}

function map_search(val){
    $('.map_left .top').find('a').removeClass('clicked');
    ifm.window.get_point(val.map_name);
}

function map_data_select(){
    if(!da.ad_id){
        alert('请选择地址！')
        return false;
    }
    return da;
}
