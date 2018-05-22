/**
 * Created by chaos on 2016/5/9.
 */
$(function(){
    $.choose_company = function(opt){
        var obj = $('.choose-settle-org');
        if(opt.param){
            var param=opt.param;
        }else{
            var param={};
        }
        param['page']=1;
        var ajax_flag=false;
        if (!obj[0]) {
            $('body').append(''+
                '<div class="choose-settle-org">'+
                '   <div class="settle-org-div">'+
                '       <div class="org-content">'+
                '           <div style="text-align: right">'+
                '               <i class="fa fa-remove close-icon"></i>'+
                '           </div>'+
                '           <div>'+
                '               <div id="-search-bar" class="right-search">'+
                '                   <i class="fa fa-search"></i>'+
                '               </div>'+
                '               <div class="left-input">'+
                '                   <input id="-search-input" type="text" placeholder="输入要查找的单位名称">'+
                '               </div>'+
                '           </div>'+
                '           <ul id="-org-list">'+
                '           </ul>'+
                '           <div id="-page-div" class="page" style="text-align: center">'+
                '           </div>'+
                '       </div>'+
                '   </div>'+
                '</div>');
            $('.close-icon').click(function(){
                $('.choose-settle-org').hide();
            })
        }
        load_html(param);
        $('.choose-settle-org').show();
        function load_html(param){
            if(ajax_flag){
                return false;
            }
            $('#-org-list').html('加载中...');
            ajax_flag=true;
            $.ajax({
                url:$__app__+'/WxMobile/get_company',
                type:'post',
                data:param,
                success:function(data){
                    if(data.status){
                        var html='';
                        $.each(data.info.data,function(i,item){
                            html+='<li data-id="'+item.org_id+'" class="org-li">'+item.org_name+'</li>';
                        })
                        $('#-org-list').html(html);
                        page=data.info.current_page;
                        var page_html=load_page(data.info.current_page,data.info.total_page);
                        $("#-page-div").html(page_html);
                        $('.org-li').click(function(){
                            $('.choose-settle-org').hide();
                            if(opt.callback){
                                var org_id=$(this).attr('data-id');
                                var org_name=$(this).html();
                                opt.callback(org_id,org_name);
                            }
                        });
                        $('#-page-div a').click(function(){
                            param['page']=$(this).attr('data-page');
                            load_html(param);
                        });
                        $('#-jump-btn').click(function(){
                            var page=$('.choose-page').val();
                            if(isNaN(page)){
                                return false;
                            }else{
                                param['page']=page;
                                load_html(param);
                            }
                        });
                        ajax_flag=false;
                    }else{
                        ajax_flag=false;
                        alert('加载错误');
                    }
                },
                error:function(){
                    ajax_flag=false;
                    alert('传输错误');
                }
            })
        }

        function load_page(current_page,total_page){
            var page_html='';
            current_page=parseInt(current_page);
            if(current_page>1){
                page_html+='<a href="javascript:void(0)" data-page="'+(current_page-1)+'">上一页</a>';
            }
            page_html+='<span>'+current_page+'/'+total_page+'</span>';
            if(current_page<total_page){
                page_html+='<a href="javascript:void(0)" data-page="'+(current_page+1)+'">下一页</a>';
            }
            page_html+='<input type="text" class="choose-page" value="'+current_page+'"><input id="-jump-btn" type="button" value="确定">';
            return page_html;
        }
        $('#-search-bar').click(function(){
            param['skey']=$('#-search-input').val();
            param['page']=1;
            load_html(param);
        })
    };
})
