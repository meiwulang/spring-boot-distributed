var DATA=[];//储存坐标值  把坐标值输出到地图上显示
var parms={};//储存参数和page（点击行政区 搜索的）
var points={};//储存坐标值和page（自定义搜索功能 搜索的）
var da={};//储存 选择地点 的对象

$(function(){
    window.onload=default_index;

    var areaV=$(".map_left").find('.top');
    var area_a=areaV.find('a');
    area_a.live('click',function(){//行政区域按钮点击
        da={};
        $(this).parent().find('a').removeClass('clicked');
        $(this).addClass('clicked');
        var skey=$(this).text();
        area_search(skey);
        ifm.window.get_point1('南京市'+skey);
    });

    var se=$('.map_top').find('span');
    se.live('click',function(){//点击搜索
        var val=$(this).parent().find('input').val();
        $('.map_left .top').find('a').removeClass('clicked');
        ifm.window.get_point(val);
    });

    var submit=$('.tijiao').find('span');
    submit.live('click',function(){//提交按钮点击
        if(!da.ad_id){
            alert('请选择地址！')
            return false;
        }
        alert('ID:'+da.ad_id+';add_address:'+da.address+';add_area:'+da.area);
    });

    var tr=$('table').find('tr:not(:first-child)');//点击列表地址
    tr.live('click',function(){
        $(this).parent().find('tr').removeClass('selected');
        $(this).addClass('selected');
        da.ad_id=$(this).find('#add_id').text();
        da.address=$(this).find('#add_address').text();
        da.area=$(this).find('#add_area span').text();
        $.ajax({
            type:"POST",
            url:$__app__ + "/Station/one_point",
            data:{add_address:da.address},
            success:function (msg) {
                var row = msg;
                if (typeof msg != 'object')
                    row = eval("(" + msg + ")");
                var info=row.info;
                if(row.status==1){
                    ifm.window.markerDisplay(info);
                }
            }
        })
    });

    tr.live('mouseenter',function(){
        $(this).addClass('enter');
        var id=$(this).index();
        ifm.window.changePoint(id-1,1);
    });

    tr.live('mouseleave',function(){
        $(this).removeClass('enter');
        var id=$(this).index();
        ifm.window.changePoint(id-1,2);
    });

    var p=$('.page');

    function default_index(){//默认的 分页
        parms={};
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
                    ali(info.total,1,5,'p');
                    p.find('.p:eq('+parms.page+')').addClass('clicked');
                }else{
                    $("table").html(info);
                }
            }
        })
    }

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
                    var start=1;
                    var limit=5;
                    if(N>3){
                        start=N-2;
                    }
                    ali(info.total,start,limit,Cl,N);
                }else{
                    $("table").html(info);
                }
            }
        })
    }


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
    parms={};
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
                ali(info.total,1,5,'p');
                $('.page').find('.p:eq('+parms.page+')').addClass('clicked');
            }else{
                $("table").html(info);
            }
        }
    })
}

function pointSelectSql(point){//获取坐标 去搜索数据库
//    points=point;
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
                ali(info.total,1,5,'pa');
                $('.page').find('.pa:eq('+parms.page+')').addClass('clicked');
            }else{
                $("table").html(info);
            }
        }
    })
}

function List(data){
    var str='<tr>' +
        '<th>序号</th>' +
        '<th>站点名称</th>' +
        '<th>自定区域</th>' +
        '</tr>';
    DATA=[];
    ifm.window.clear();

    $.each(data,function(i,v){
        str+=Tpl(i,v);
        DATA.push([v.add_x, v.add_y]);
    });
    ifm.window.set_point(DATA);
    $('.bottom table').html(str);
}

function Tpl(i,data){
    var zimu=['A','B','C','D','E','F','G','H','I'];
    var tpl='';
    tpl='<tr class="">' +
        '<td id="add_id">'+zimu[i]+'</td>'+
        '<td id="add_address">'+data.add_address+'</td>'+
        '<td id="add_area"><span>'+data.add_area+'</span>区</td>' +
        '</tr>';
    return tpl;
}

function selected(index){//点击地图获取坐标，获取索引值
//    alert(index)
    da={}
    var i=index+1;
    var t=$('table').find('tr:eq('+i+')');
    t.parent().find('tr').removeClass('selected');
    t.addClass('selected');
    da.ad_id=t.find('#add_id').text();
    da.address=t.find('#add_address').text();
    da.area=t.find('#add_area span').text();
}